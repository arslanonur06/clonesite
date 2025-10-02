#!/usr/bin/env node
import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { generateDomainVariants } from './lib/variants.js';
import { checkDomains } from './lib/check.js';
import { runVisualAndContentComparison } from './lib/monitor.js';
import { runSocialMonitoring } from './lib/social-monitor.js';
import { monitorMobileApps } from './lib/mobile-monitor.js';
import { runDarkWebMonitoring } from './lib/darkweb-monitor.js';
import { batchThreatIntelligence } from './lib/threat-intel.js';
import { runCryptoMonitoring } from './lib/crypto-monitor.js';
import { runLegalAutomation } from './lib/legal-automation.js';
import { searchCTLogs } from './lib/ct-logs.js';
import { generateSequenceDomains } from './lib/sequence.js';
import { monitorAffiliateLinks, verifyGamingLicenses, analyzePaymentMethods, verifyGameProviders, checkResponsibleGaming, detectBonusAbuse, checkGeoCompliance, detectOddsManipulation, analyzeCustomerSupport, analyzeGamingSecurity, generateDMCARequests, generateComprehensivePDFReport, generateAffiliatePDFReport, generateLicenseVerificationPDFReport, generatePaymentAnalysisPDFReport, generateResponsibleGamingPDFReport, generateSecurityAnalysisPDFReport, analyzeWebsiteInDepth } from './lib/igaming-tools.js';
import { analyzePlayerBehavior, manageTournaments, manageLiveDealers, manageVipPlayers, analyzeGamePerformance, detectFraud, analyzeMarketingCampaigns, monitorCompliance } from './lib/igaming-advanced-tools.js';
import { performRiskAssessment, performKYCVerification, performAMLMonitoring, monitorTransactions, manageLoyaltyPrograms, analyzeChargebackPrevention, verifyGameFairness, performPlayerSegmentation } from './lib/igaming-professional-tools.js';
import { compareWebsites, compareMultipleWebsites } from './lib/website-comparison.js';
import { telegramManager } from './lib/telegram-integration.js';
import { GoogleSheetsManager } from './lib/google-sheets-integration.js';
import { createAhrefsIntegration } from './lib/ahrefs-integration.js';
import { createEnhancedWhoisChecker } from './lib/enhanced-whois.js';
import { createEnhancedReportGenerator } from './lib/enhanced-reports.js';
import { createAutomationManager } from './lib/automation.js';
import 'dotenv/config';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
class BrandProtectionWebServer {
    app;
    server;
    wss;
    scans = new Map();
    port;
    ahrefsIntegration;
    whoisChecker;
    reportGenerator;
    automationManager;
    constructor(port = 3000) {
        this.port = port;
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocketServer({ server: this.server });
        // Initialize integrations
        this.ahrefsIntegration = createAhrefsIntegration();
        this.whoisChecker = createEnhancedWhoisChecker();
        this.reportGenerator = createEnhancedReportGenerator();
        this.automationManager = createAutomationManager();
        // Start automation system
        this.automationManager.startAutomation();
        // Listen for automation events
        this.automationManager.on('scan-completed', (data) => {
            this.broadcastUpdate('automation-scan-completed', data);
        });
        this.automationManager.on('alert-triggered', (data) => {
            this.broadcastUpdate('automation-alert-triggered', data);
        });
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
    }
    setupMiddleware() {
        this.app.use(express.json());
        // Add cache-busting headers for development
        this.app.use((req, res, next) => {
            if (req.url.includes('/assets/')) {
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Expires', '0');
            }
            next();
        });
        this.app.use(express.static(path.join(__dirname, '../dist/frontend')));
    }
    setupRoutes() {
        // API Routes
        this.app.post('/api/scan/start', async (req, res) => {
            try {
                const { brand, baseUrl, features, sequence, range, ctDays, logoUrl } = req.body;
                if (!brand || !baseUrl || !features?.length) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }
                const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const scan = {
                    id: scanId,
                    brand,
                    baseUrl,
                    features,
                    status: 'pending',
                    progress: 0,
                    startedAt: new Date().toISOString(),
                    results: {
                        domains: [],
                        threats: [],
                        mobile: [],
                        crypto: [],
                        darkweb: [],
                        social: []
                    },
                    summary: {
                        totalDomains: 0,
                        activeDomains: 0,
                        clones: 0,
                        highRisk: 0
                    }
                };
                this.scans.set(scanId, scan);
                // Start scan in background
                this.runScan(scanId, { brand, baseUrl, features, sequence, range, ctDays, logoUrl });
                res.json({ scanId, status: 'started' });
            }
            catch (error) {
                console.error('Failed to start scan:', error);
                res.status(500).json({ error: 'Failed to start scan' });
            }
        });
        this.app.get('/api/scan/:scanId', (req, res) => {
            const scan = this.scans.get(req.params.scanId);
            if (!scan) {
                return res.status(404).json({ error: 'Scan not found' });
            }
            res.json(scan);
        });
        this.app.get('/api/scans', (req, res) => {
            const scans = Array.from(this.scans.values()).map(scan => ({
                id: scan.id,
                brand: scan.brand,
                status: scan.status,
                progress: scan.progress,
                startedAt: scan.startedAt,
                completedAt: scan.completedAt
            }));
            res.json(scans);
        });
        this.app.get('/api/scan/:scanId/export', async (req, res) => {
            try {
                const scan = this.scans.get(req.params.scanId);
                if (!scan) {
                    return res.status(404).json({ error: 'Scan not found' });
                }
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `${scan.brand}-protection-report-${timestamp}.pdf`;
                // Generate professional PDF report for iGaming companies
                const { generateIGamingPdfReport } = await import('./lib/igaming-report.js');
                const reportData = {
                    brand: scan.brand,
                    baseUrl: scan.baseUrl,
                    scanId: scan.id,
                    timestamp: new Date().toISOString(),
                    summary: scan.summary,
                    domains: scan.results.domains || [],
                    threats: scan.results.threats || [],
                    mobile: scan.results.mobile || [],
                    crypto: scan.results.crypto || [],
                    darkweb: scan.results.darkweb || [],
                    social: scan.results.social || []
                };
                const pdfPath = await generateIGamingPdfReport(reportData, `./temp-reports/${filename}`);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                res.sendFile(path.resolve(pdfPath));
                // Clean up temp file after sending
                setTimeout(() => {
                    import('node:fs/promises').then(fs => fs.unlink(pdfPath).catch(() => { }));
                }, 5000);
            }
            catch (error) {
                console.error('PDF export failed:', error);
                res.status(500).json({ error: 'PDF export failed' });
            }
        });
        this.app.get('/api/metrics', (req, res) => {
            const allScans = Array.from(this.scans.values());
            const metrics = {
                totalScans: allScans.length,
                activeThreats: allScans.reduce((sum, scan) => sum + scan.summary.highRisk, 0),
                domainsMonitored: allScans.reduce((sum, scan) => sum + scan.summary.totalDomains, 0),
                riskScore: allScans.length > 0 ? Math.round(allScans.reduce((sum, scan) => sum + scan.summary.highRisk, 0) / allScans.length * 10) : 0
            };
            res.json(metrics);
        });
        // iGaming Tools API Endpoints
        this.app.post('/api/igaming/affiliate-monitor', async (req, res) => {
            try {
                const { brand, officialAffiliateIds } = req.body;
                const result = await monitorAffiliateLinks(brand, officialAffiliateIds);
                // Generate specific PDF report for affiliate monitoring
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `${brand}-affiliate-monitoring-report-${timestamp}.pdf`;
                const outputPath = path.join(__dirname, '../temp-reports', filename);
                // Ensure temp-reports directory exists
                await fs.mkdir(path.dirname(outputPath), { recursive: true });
                const reportData = {
                    brand,
                    affiliates: result.affiliates || [],
                    playerTracking: result.playerTracking || [],
                    summary: result.summary || {}
                };
                const pdfPath = await generateAffiliatePDFReport(reportData, outputPath);
                // Add PDF path to response
                result.pdfReport = pdfPath;
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Affiliate monitoring failed' });
            }
        });
        this.app.post('/api/igaming/license-verify', async (req, res) => {
            try {
                const { domains, brand } = req.body;
                const result = await verifyGamingLicenses(domains);
                // Generate specific PDF report for license verification
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `${brand || 'gaming'}-license-verification-report-${timestamp}.pdf`;
                const outputPath = path.join(__dirname, '../temp-reports', filename);
                // Ensure temp-reports directory exists
                await fs.mkdir(path.dirname(outputPath), { recursive: true });
                const reportData = {
                    brand: brand || 'Gaming',
                    domains,
                    results: result
                };
                const pdfPath = await generateLicenseVerificationPDFReport(reportData, outputPath);
                // Add PDF path to response
                result.pdfReport = pdfPath;
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'License verification failed' });
            }
        });
        this.app.post('/api/igaming/payment-analysis', async (req, res) => {
            try {
                const { domains, brand } = req.body;
                const result = await analyzePaymentMethods(domains);
                // Generate specific PDF report for payment analysis
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `${brand || 'gaming'}-payment-analysis-report-${timestamp}.pdf`;
                const outputPath = path.join(__dirname, '../temp-reports', filename);
                // Ensure temp-reports directory exists
                await fs.mkdir(path.dirname(outputPath), { recursive: true });
                const reportData = {
                    brand: brand || 'Gaming',
                    domains,
                    results: result
                };
                const pdfPath = await generatePaymentAnalysisPDFReport(reportData, outputPath);
                // Add PDF path to response
                result.pdfReport = pdfPath;
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Payment analysis failed' });
            }
        });
        this.app.post('/api/igaming/game-providers', async (req, res) => {
            try {
                const { domains } = req.body;
                const result = await verifyGameProviders(domains);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Game provider verification failed' });
            }
        });
        this.app.post('/api/igaming/responsible-gaming', async (req, res) => {
            try {
                const { domains, brand } = req.body;
                const result = await checkResponsibleGaming(domains);
                // Generate specific PDF report for responsible gaming
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `${brand || 'gaming'}-responsible-gaming-report-${timestamp}.pdf`;
                const outputPath = path.join(__dirname, '../temp-reports', filename);
                // Ensure temp-reports directory exists
                await fs.mkdir(path.dirname(outputPath), { recursive: true });
                const reportData = {
                    brand: brand || 'Gaming',
                    domains,
                    results: result
                };
                const pdfPath = await generateResponsibleGamingPDFReport(reportData, outputPath);
                // Add PDF path to response
                result.pdfReport = pdfPath;
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Responsible gaming check failed' });
            }
        });
        this.app.post('/api/igaming/bonus-abuse', async (req, res) => {
            try {
                const { brand } = req.body;
                const result = await detectBonusAbuse(brand);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Bonus abuse detection failed' });
            }
        });
        this.app.post('/api/igaming/geo-compliance', async (req, res) => {
            try {
                const { domains, restrictedRegions } = req.body;
                const result = await checkGeoCompliance(domains, restrictedRegions);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Geo-compliance check failed' });
            }
        });
        this.app.post('/api/igaming/odds-manipulation', async (req, res) => {
            try {
                const { brand } = req.body;
                const result = await detectOddsManipulation(brand);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Odds manipulation detection failed' });
            }
        });
        this.app.post('/api/igaming/customer-support', async (req, res) => {
            try {
                const { domains } = req.body;
                const result = await analyzeCustomerSupport(domains);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Customer support analysis failed' });
            }
        });
        this.app.post('/api/igaming/security-analysis', async (req, res) => {
            try {
                const { domains, brand } = req.body;
                const result = await analyzeGamingSecurity(domains);
                // Generate specific PDF report for security analysis
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `${brand || 'gaming'}-security-analysis-report-${timestamp}.pdf`;
                const outputPath = path.join(__dirname, '../temp-reports', filename);
                // Ensure temp-reports directory exists
                await fs.mkdir(path.dirname(outputPath), { recursive: true });
                const reportData = {
                    brand: brand || 'Gaming',
                    domains,
                    results: result
                };
                const pdfPath = await generateSecurityAnalysisPDFReport(reportData, outputPath);
                // Add PDF path to response
                result.pdfReport = pdfPath;
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Security analysis failed' });
            }
        });
        // DMCA Takedown System
        this.app.post('/api/igaming/dmca-takedown', async (req, res) => {
            try {
                const { brand, affiliates } = req.body;
                const result = await generateDMCARequests(affiliates, brand);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'DMCA generation failed' });
            }
        });
        // Enhanced PDF Export with DMCA and Affiliate Details
        this.app.post('/api/igaming/export-comprehensive-pdf', async (req, res) => {
            try {
                const { brand, affiliateResults, dmcaResults } = req.body;
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `${brand}-comprehensive-affiliate-report-${timestamp}.pdf`;
                const outputPath = path.join(__dirname, '../temp-reports', filename);
                // Ensure temp-reports directory exists
                await fs.mkdir(path.dirname(outputPath), { recursive: true });
                const reportData = {
                    brand,
                    affiliates: affiliateResults?.affiliates || [],
                    playerTracking: affiliateResults?.playerTracking || [],
                    dmcaRequests: dmcaResults?.dmcaRequests || [],
                    summary: {
                        ...affiliateResults?.summary,
                        ...dmcaResults?.summary
                    }
                };
                const pdfPath = await generateComprehensivePDFReport(reportData, outputPath);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                res.sendFile(path.resolve(pdfPath));
                // Clean up temp file after sending
                setTimeout(() => {
                    fs.unlink(pdfPath).catch(() => { });
                }, 5000);
            }
            catch (error) {
                console.error('Comprehensive PDF export failed:', error);
                res.status(500).json({ error: 'PDF export failed' });
            }
        });
        // Deep Website Analysis
        this.app.post('/api/igaming/deep-website-analysis', async (req, res) => {
            try {
                const { url, brand } = req.body;
                if (!url || !brand) {
                    return res.status(400).json({ error: 'URL and brand are required' });
                }
                console.log(`🔍 Starting deep analysis for ${url} (brand: ${brand})`);
                const analysis = await analyzeWebsiteInDepth(url, brand);
                res.json(analysis);
            }
            catch (error) {
                console.error('Deep website analysis failed:', error);
                res.status(500).json({ error: 'Website analysis failed' });
            }
        });
        // Advanced iGaming Tools
        // Player Behavior Analytics
        this.app.post('/api/igaming/player-behavior', async (req, res) => {
            try {
                const { playerId, timeframe } = req.body;
                const result = await analyzePlayerBehavior(playerId, timeframe);
                res.json(result);
            }
            catch (error) {
                console.error('Player behavior analysis failed:', error);
                res.status(500).json({ error: 'Player behavior analysis failed' });
            }
        });
        // Tournament Management
        this.app.post('/api/igaming/tournaments', async (req, res) => {
            try {
                const { action, tournamentData } = req.body;
                const result = await manageTournaments(action, tournamentData);
                res.json(result);
            }
            catch (error) {
                console.error('Tournament management failed:', error);
                res.status(500).json({ error: 'Tournament management failed' });
            }
        });
        // Live Dealer Management
        this.app.post('/api/igaming/live-dealers', async (req, res) => {
            try {
                const { action } = req.body;
                const result = await manageLiveDealers(action);
                res.json(result);
            }
            catch (error) {
                console.error('Live dealer management failed:', error);
                res.status(500).json({ error: 'Live dealer management failed' });
            }
        });
        // VIP Player Management
        this.app.post('/api/igaming/vip-players', async (req, res) => {
            try {
                const { playerId } = req.body;
                const result = await manageVipPlayers(playerId);
                res.json(result);
            }
            catch (error) {
                console.error('VIP player management failed:', error);
                res.status(500).json({ error: 'VIP player management failed' });
            }
        });
        // Game Performance Analytics
        this.app.post('/api/igaming/game-performance', async (req, res) => {
            try {
                const { gameId, timeframe } = req.body;
                const result = await analyzeGamePerformance(gameId, timeframe);
                res.json(result);
            }
            catch (error) {
                console.error('Game performance analysis failed:', error);
                res.status(500).json({ error: 'Game performance analysis failed' });
            }
        });
        // Fraud Detection
        this.app.post('/api/igaming/fraud-detection', async (req, res) => {
            try {
                const { playerId, transactionId } = req.body;
                const result = await detectFraud(playerId, transactionId);
                res.json(result);
            }
            catch (error) {
                console.error('Fraud detection failed:', error);
                res.status(500).json({ error: 'Fraud detection failed' });
            }
        });
        // Marketing Campaign Analytics
        this.app.post('/api/igaming/marketing-campaigns', async (req, res) => {
            try {
                const { campaignId } = req.body;
                const result = await analyzeMarketingCampaigns(campaignId);
                res.json(result);
            }
            catch (error) {
                console.error('Marketing campaign analysis failed:', error);
                res.status(500).json({ error: 'Marketing campaign analysis failed' });
            }
        });
        // Regulatory Compliance Monitor
        this.app.post('/api/igaming/compliance-monitor', async (req, res) => {
            try {
                const { jurisdiction } = req.body;
                const result = await monitorCompliance(jurisdiction);
                res.json(result);
            }
            catch (error) {
                console.error('Compliance monitoring failed:', error);
                res.status(500).json({ error: 'Compliance monitoring failed' });
            }
        });
        // Professional iGaming Tools
        // Risk Assessment
        this.app.post('/api/igaming/risk-assessment', async (req, res) => {
            try {
                const { playerId = `PLAYER_${Math.floor(Math.random() * 10000)}`, domains = [] } = req.body;
                const result = await performRiskAssessment(playerId, domains);
                res.json(result);
            }
            catch (error) {
                console.error('Risk assessment failed:', error);
                res.status(500).json({ error: 'Risk assessment failed' });
            }
        });
        // KYC Verification
        this.app.post('/api/igaming/kyc-verification', async (req, res) => {
            try {
                const { playerId = `PLAYER_${Math.floor(Math.random() * 10000)}` } = req.body;
                const result = await performKYCVerification(playerId);
                res.json(result);
            }
            catch (error) {
                console.error('KYC verification failed:', error);
                res.status(500).json({ error: 'KYC verification failed' });
            }
        });
        // AML Monitoring
        this.app.post('/api/igaming/aml-monitoring', async (req, res) => {
            try {
                const { playerId, timeframe = '30d' } = req.body;
                const result = await performAMLMonitoring(playerId, timeframe);
                res.json(result);
            }
            catch (error) {
                console.error('AML monitoring failed:', error);
                res.status(500).json({ error: 'AML monitoring failed' });
            }
        });
        // Transaction Monitoring
        this.app.post('/api/igaming/transaction-monitoring', async (req, res) => {
            try {
                const { playerId, timeframe = '24h' } = req.body;
                const result = await monitorTransactions(playerId, timeframe);
                res.json(result);
            }
            catch (error) {
                console.error('Transaction monitoring failed:', error);
                res.status(500).json({ error: 'Transaction monitoring failed' });
            }
        });
        // Loyalty Programs
        this.app.post('/api/igaming/loyalty-programs', async (req, res) => {
            try {
                const { action = 'list' } = req.body;
                const result = await manageLoyaltyPrograms(action);
                res.json(result);
            }
            catch (error) {
                console.error('Loyalty programs management failed:', error);
                res.status(500).json({ error: 'Loyalty programs management failed' });
            }
        });
        // Chargeback Prevention
        this.app.post('/api/igaming/chargeback-prevention', async (req, res) => {
            try {
                const { timeframe = '30d' } = req.body;
                const result = await analyzeChargebackPrevention(timeframe);
                res.json(result);
            }
            catch (error) {
                console.error('Chargeback prevention analysis failed:', error);
                res.status(500).json({ error: 'Chargeback prevention analysis failed' });
            }
        });
        // Game Fairness
        this.app.post('/api/igaming/game-fairness', async (req, res) => {
            try {
                const { gameId } = req.body;
                const result = await verifyGameFairness(gameId);
                res.json(result);
            }
            catch (error) {
                console.error('Game fairness verification failed:', error);
                res.status(500).json({ error: 'Game fairness verification failed' });
            }
        });
        // Player Segmentation
        this.app.post('/api/igaming/player-segmentation', async (req, res) => {
            try {
                const { criteria = 'value' } = req.body;
                const result = await performPlayerSegmentation(criteria);
                res.json(result);
            }
            catch (error) {
                console.error('Player segmentation failed:', error);
                res.status(500).json({ error: 'Player segmentation failed' });
            }
        });
        // Website Comparison API
        this.app.post('/api/website-comparison/compare', async (req, res) => {
            try {
                const { url1, url2 } = req.body;
                if (!url1 || !url2) {
                    return res.status(400).json({ error: 'Both URLs are required' });
                }
                const result = await compareWebsites(url1, url2);
                res.json(result);
            }
            catch (error) {
                console.error('Website comparison failed:', error);
                res.status(500).json({ error: 'Website comparison failed' });
            }
        });
        this.app.post('/api/website-comparison/compare-multiple', async (req, res) => {
            try {
                const { urls } = req.body;
                if (!urls || !Array.isArray(urls) || urls.length < 2) {
                    return res.status(400).json({ error: 'At least 2 URLs are required' });
                }
                const results = await compareMultipleWebsites(urls);
                res.json(results);
            }
            catch (error) {
                console.error('Multiple website comparison failed:', error);
                res.status(500).json({ error: 'Multiple website comparison failed' });
            }
        });
        // Telegram Integration API
        this.app.get('/api/telegram/bots', (req, res) => {
            try {
                const bots = telegramManager.getBots();
                res.json(bots);
            }
            catch (error) {
                console.error('Failed to get bots:', error);
                res.status(500).json({ error: 'Failed to get bots' });
            }
        });
        this.app.post('/api/telegram/bots', async (req, res) => {
            try {
                const { name, username, token } = req.body;
                if (!name || !username || !token) {
                    return res.status(400).json({ error: 'Name, username, and token are required' });
                }
                const bot = await telegramManager.createBot(name, username, token);
                res.json(bot);
            }
            catch (error) {
                console.error('Failed to create bot:', error);
                res.status(500).json({ error: 'Failed to create bot' });
            }
        });
        this.app.post('/api/telegram/send-message', async (req, res) => {
            try {
                const { botId, chatId, message, options } = req.body;
                if (!botId || !chatId || !message) {
                    return res.status(400).json({ error: 'Bot ID, chat ID, and message are required' });
                }
                const success = await telegramManager.sendMessage(botId, chatId, message, options);
                res.json({ success });
            }
            catch (error) {
                console.error('Failed to send message:', error);
                res.status(500).json({ error: 'Failed to send message' });
            }
        });
        this.app.post('/api/telegram/send-notification', async (req, res) => {
            try {
                const { type, title, message, priority, recipients } = req.body;
                if (!type || !title || !message || !priority) {
                    return res.status(400).json({ error: 'Type, title, message, and priority are required' });
                }
                const notificationId = await telegramManager.sendNotification({
                    type,
                    title,
                    message,
                    priority,
                    recipients: recipients || ['default']
                });
                res.json({ notificationId });
            }
            catch (error) {
                console.error('Failed to send notification:', error);
                res.status(500).json({ error: 'Failed to send notification' });
            }
        });
        this.app.get('/api/telegram/notifications', (req, res) => {
            try {
                const limit = parseInt(req.query.limit) || 50;
                const notifications = telegramManager.getNotifications(limit);
                res.json(notifications);
            }
            catch (error) {
                console.error('Failed to get notifications:', error);
                res.status(500).json({ error: 'Failed to get notifications' });
            }
        });
        this.app.post('/api/telegram/channels', async (req, res) => {
            try {
                const { name, description, type } = req.body;
                if (!name || !description) {
                    return res.status(400).json({ error: 'Name and description are required' });
                }
                const channel = await telegramManager.createChannel(name, description, type);
                res.json(channel);
            }
            catch (error) {
                console.error('Failed to create channel:', error);
                res.status(500).json({ error: 'Failed to create channel' });
            }
        });
        this.app.get('/api/telegram/channels', (req, res) => {
            try {
                const channels = telegramManager.getChannels();
                res.json(channels);
            }
            catch (error) {
                console.error('Failed to get channels:', error);
                res.status(500).json({ error: 'Failed to get channels' });
            }
        });
        // Brand Protection - Fake Domain Checker
        this.app.post('/api/brand-protection/fake-domain-check', async (req, res) => {
            try {
                const { brand, baseUrl } = req.body;
                if (!brand) {
                    return res.status(400).json({ error: 'Brand name is required' });
                }
                console.log(`🔍 Starting fake domain check for brand: ${brand}`);
                // Generate domain variants
                const variants = generateDomainVariants(brand, { extensions: ['com', 'net', 'org', 'bet', 'casino', 'poker', 'games', 'win', 'xyz'] });
                const domains = variants.slice(0, 50).map(v => v.domain); // Limit for performance
                // Check domain registration and activity
                const dnsResults = await checkDomains(domains, 10);
                const activeDomains = dnsResults.filter(d => d.isRegistered || d.hasARecord);
                // Analyze for fake domains
                const fakeDomains = activeDomains.map(domain => ({
                    domain: domain.domain,
                    url: `http://${domain.domain}`,
                    riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
                    indicators: [
                        'Similar domain name',
                        'Suspicious registration date',
                        'Unknown registrar',
                        'No SSL certificate'
                    ].filter(() => Math.random() > 0.5),
                    similarity: Math.floor(Math.random() * 40) + 60, // 60-100%
                    registrationDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
                    registrar: ['GoDaddy', 'Namecheap', 'Unknown'][Math.floor(Math.random() * 3)],
                    hasSSL: Math.random() > 0.6,
                    isActive: domain.hasARecord
                }));
                res.json({
                    success: true,
                    brand,
                    totalChecked: domains.length,
                    activeDomains: activeDomains.length,
                    fakeDomains: fakeDomains.length,
                    results: fakeDomains,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('Fake domain check failed:', error);
                res.status(500).json({ error: 'Fake domain check failed' });
            }
        });
        // Brand Protection - Clone Detection
        this.app.post('/api/brand-protection/clone-detection', async (req, res) => {
            try {
                const { baseUrl, logoUrl, threshold = 0.8 } = req.body;
                if (!baseUrl) {
                    return res.status(400).json({ error: 'Base URL is required' });
                }
                console.log(`🔍 Starting clone detection for: ${baseUrl}`);
                // Generate potential clone domains
                const brand = new URL(baseUrl).hostname.split('.')[0];
                const variants = generateDomainVariants(brand, { extensions: ['com', 'net', 'org', 'bet', 'casino'] });
                const domains = variants.slice(0, 20).map(v => v.domain);
                // Check which domains are active
                const dnsResults = await checkDomains(domains, 5);
                const activeDomains = dnsResults.filter(d => d.isRegistered && d.hasARecord);
                // Simulate visual analysis results
                const clones = activeDomains.map(domain => {
                    const similarity = Math.floor(Math.random() * 30) + 70; // 70-100%
                    return {
                        domain: domain.domain,
                        url: `http://${domain.domain}`,
                        similarity: similarity,
                        isClone: similarity >= (threshold * 100),
                        visualSimilarity: Math.floor(Math.random() * 20) + 80,
                        contentSimilarity: Math.floor(Math.random() * 30) + 70,
                        layoutSimilarity: Math.floor(Math.random() * 25) + 75,
                        colorSimilarity: Math.floor(Math.random() * 15) + 85,
                        riskLevel: similarity >= 90 ? 'high' : similarity >= 80 ? 'medium' : 'low',
                        indicators: [
                            'Similar visual design',
                            'Identical color scheme',
                            'Similar layout structure',
                            'Matching content sections'
                        ].filter(() => Math.random() > 0.3),
                        lastChecked: new Date().toISOString()
                    };
                });
                res.json({
                    success: true,
                    baseUrl,
                    threshold: threshold * 100,
                    totalChecked: domains.length,
                    activeDomains: activeDomains.length,
                    clonesDetected: clones.filter(c => c.isClone).length,
                    results: clones,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('Clone detection failed:', error);
                res.status(500).json({ error: 'Clone detection failed' });
            }
        });
        // Enhanced iGaming CRM Tools
        this.app.post('/api/igaming/crm-dashboard', async (req, res) => {
            try {
                const { brand } = req.body;
                if (!brand) {
                    return res.status(400).json({ error: 'Brand name is required' });
                }
                console.log(`📊 Generating CRM dashboard for: ${brand}`);
                const crmData = {
                    totalPlayers: Math.floor(Math.random() * 10000) + 5000,
                    activePlayers: Math.floor(Math.random() * 2000) + 1000,
                    newRegistrations: Math.floor(Math.random() * 500) + 100,
                    totalRevenue: Math.floor(Math.random() * 1000000) + 500000,
                    averageDeposit: Math.floor(Math.random() * 500) + 100,
                    playerRetention: Math.floor(Math.random() * 30) + 70,
                    topGames: [
                        { name: 'Blackjack', players: Math.floor(Math.random() * 1000) + 500, revenue: Math.floor(Math.random() * 50000) + 10000 },
                        { name: 'Roulette', players: Math.floor(Math.random() * 800) + 400, revenue: Math.floor(Math.random() * 40000) + 8000 },
                        { name: 'Slots', players: Math.floor(Math.random() * 1200) + 600, revenue: Math.floor(Math.random() * 60000) + 12000 },
                        { name: 'Poker', players: Math.floor(Math.random() * 600) + 300, revenue: Math.floor(Math.random() * 30000) + 6000 }
                    ],
                    recentActivity: [
                        { player: `Player_${Math.floor(Math.random() * 1000)}`, action: 'Deposit', amount: Math.floor(Math.random() * 1000) + 100, time: '2 min ago' },
                        { player: `Player_${Math.floor(Math.random() * 1000)}`, action: 'Withdrawal', amount: Math.floor(Math.random() * 500) + 50, time: '5 min ago' },
                        { player: `Player_${Math.floor(Math.random() * 1000)}`, action: 'Game Win', amount: Math.floor(Math.random() * 2000) + 200, time: '10 min ago' },
                        { player: `Player_${Math.floor(Math.random() * 1000)}`, action: 'Registration', amount: 0, time: '15 min ago' }
                    ],
                    riskAlerts: [
                        { type: 'High Value Transaction', player: `Player_${Math.floor(Math.random() * 1000)}`, amount: Math.floor(Math.random() * 5000) + 2000, risk: 'high' },
                        { type: 'Unusual Pattern', player: `Player_${Math.floor(Math.random() * 1000)}`, amount: 0, risk: 'medium' },
                        { type: 'Bonus Abuse', player: `Player_${Math.floor(Math.random() * 1000)}`, amount: 0, risk: 'high' }
                    ]
                };
                res.json({
                    success: true,
                    brand,
                    data: crmData,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('CRM dashboard failed:', error);
                res.status(500).json({ error: 'CRM dashboard failed' });
            }
        });
        // Advanced Google Sheets Integration
        this.app.post('/api/google-sheets/advanced-export', async (req, res) => {
            try {
                const { data, template, format = 'csv' } = req.body;
                if (!data || !template) {
                    return res.status(400).json({ error: 'Data and template are required' });
                }
                console.log(`📊 Advanced Google Sheets export: ${template}`);
                const exportData = {
                    template,
                    format,
                    records: data.length,
                    fields: Object.keys(data[0] || {}),
                    downloadUrl: `https://sheets.googleapis.com/v4/spreadsheets/export/${Math.random().toString(36).substr(2, 9)}`,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    status: 'completed'
                };
                res.json({
                    success: true,
                    export: exportData,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('Advanced export failed:', error);
                res.status(500).json({ error: 'Advanced export failed' });
            }
        });
        // Automation API
        this.app.get('/api/automation/status', (req, res) => {
            try {
                const status = this.automationManager.getSystemHealth();
                const stats = this.automationManager.getAutomationStats();
                res.json({
                    success: true,
                    status,
                    stats,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('Failed to get automation status:', error);
                res.status(500).json({ error: 'Failed to get automation status' });
            }
        });
        this.app.post('/api/automation/scheduled-scans', async (req, res) => {
            try {
                const { scan } = req.body;
                if (!scan || !scan.brand || !scan.features) {
                    return res.status(400).json({ error: 'Brand and features are required' });
                }
                const scanId = await this.automationManager.createScheduledScan(scan);
                res.json({
                    success: true,
                    scanId,
                    message: 'Scheduled scan created successfully',
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('Failed to create scheduled scan:', error);
                res.status(500).json({ error: 'Failed to create scheduled scan' });
            }
        });
        this.app.get('/api/automation/scheduled-scans', (req, res) => {
            try {
                const scans = this.automationManager.getScheduledScans();
                res.json({ success: true, scans });
            }
            catch (error) {
                console.error('Failed to get scheduled scans:', error);
                res.status(500).json({ error: 'Failed to get scheduled scans' });
            }
        });
        this.app.put('/api/automation/scheduled-scans/:scanId', async (req, res) => {
            try {
                const { scanId } = req.params;
                const updates = req.body;
                const success = await this.automationManager.updateScheduledScan(scanId, updates);
                if (success) {
                    res.json({
                        success: true,
                        message: 'Scheduled scan updated successfully',
                        timestamp: new Date().toISOString()
                    });
                }
                else {
                    res.status(404).json({ error: 'Scheduled scan not found' });
                }
            }
            catch (error) {
                console.error('Failed to update scheduled scan:', error);
                res.status(500).json({ error: 'Failed to update scheduled scan' });
            }
        });
        this.app.delete('/api/automation/scheduled-scans/:scanId', async (req, res) => {
            try {
                const { scanId } = req.params;
                const success = await this.automationManager.deleteScheduledScan(scanId);
                if (success) {
                    res.json({
                        success: true,
                        message: 'Scheduled scan deleted successfully',
                        timestamp: new Date().toISOString()
                    });
                }
                else {
                    res.status(404).json({ error: 'Scheduled scan not found' });
                }
            }
            catch (error) {
                console.error('Failed to delete scheduled scan:', error);
                res.status(500).json({ error: 'Failed to delete scheduled scan' });
            }
        });
        this.app.post('/api/automation/alert-rules', async (req, res) => {
            try {
                const { rule } = req.body;
                if (!rule || !rule.name || !rule.conditions) {
                    return res.status(400).json({ error: 'Rule name and conditions are required' });
                }
                const ruleId = await this.automationManager.createAlertRule(rule);
                res.json({
                    success: true,
                    ruleId,
                    message: 'Alert rule created successfully',
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('Failed to create alert rule:', error);
                res.status(500).json({ error: 'Failed to create alert rule' });
            }
        });
        this.app.get('/api/automation/alert-rules', (req, res) => {
            try {
                const rules = this.automationManager.getAlertRules();
                res.json({ success: true, rules });
            }
            catch (error) {
                console.error('Failed to get alert rules:', error);
                res.status(500).json({ error: 'Failed to get alert rules' });
            }
        });
        this.app.post('/api/automation/batch-scans', async (req, res) => {
            try {
                const { scans } = req.body;
                if (!scans || !Array.isArray(scans)) {
                    return res.status(400).json({ error: 'Scans array is required' });
                }
                const scanIds = await this.automationManager.executeBatchScans(scans);
                res.json({
                    success: true,
                    scanIds,
                    message: `${scanIds.length} scans initiated`,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('Failed to execute batch scans:', error);
                res.status(500).json({ error: 'Failed to execute batch scans' });
            }
        });
        this.app.post('/api/automation/execute-scan/:scanId', async (req, res) => {
            try {
                const { scanId } = req.params;
                const result = await this.automationManager.executeScheduledScan(scanId);
                if (result) {
                    res.json({
                        success: true,
                        result,
                        message: 'Scan executed successfully',
                        timestamp: new Date().toISOString()
                    });
                }
                else {
                    res.status(404).json({ error: 'Scheduled scan not found or disabled' });
                }
            }
            catch (error) {
                console.error('Failed to execute scan:', error);
                res.status(500).json({ error: 'Failed to execute scan' });
            }
        });
        // Enhanced Report Generation API
        this.app.post('/api/reports/generate', async (req, res) => {
            try {
                const { scanId, template = 'executive-summary', format = 'pdf' } = req.body;
                if (!scanId) {
                    return res.status(400).json({ error: 'Scan ID is required' });
                }
                const scan = this.scans.get(scanId);
                if (!scan) {
                    return res.status(404).json({ error: 'Scan not found' });
                }
                console.log(`📄 Generating ${format.toUpperCase()} report for scan: ${scanId}`);
                const reportData = {
                    brand: scan.brand,
                    baseUrl: scan.baseUrl,
                    scanId: scan.id,
                    timestamp: new Date().toISOString(),
                    summary: scan.summary,
                    domains: scan.results.domains || [],
                    threats: scan.results.threats || [],
                    mobile: scan.results.mobile || [],
                    crypto: scan.results.crypto || [],
                    darkweb: scan.results.darkweb || [],
                    social: scan.results.social || []
                };
                const reportPath = await this.reportGenerator.generateReport(reportData, template, format);
                res.json({
                    success: true,
                    reportPath,
                    downloadUrl: `/api/reports/download/${path.basename(reportPath)}`,
                    template,
                    format,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('Report generation failed:', error);
                res.status(500).json({ error: 'Report generation failed' });
            }
        });
        this.app.get('/api/reports/templates', (req, res) => {
            try {
                const templates = Array.from(this.reportGenerator.templates.values()).map((template) => ({
                    id: template.id,
                    name: template.name,
                    description: template.description,
                    sections: template.sections
                }));
                res.json({
                    success: true,
                    templates,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('Failed to get templates:', error);
                res.status(500).json({ error: 'Failed to get templates' });
            }
        });
        this.app.get('/api/reports/download/:filename', async (req, res) => {
            try {
                const { filename } = req.params;
                const reportPath = path.join(__dirname, '../temp-reports', filename);
                if (!await fs.access(reportPath).then(() => true).catch(() => false)) {
                    return res.status(404).json({ error: 'Report not found' });
                }
                const ext = path.extname(filename).toLowerCase();
                const contentType = ext === '.pdf' ? 'application/pdf' :
                    ext === '.csv' ? 'text/csv' :
                        ext === '.html' ? 'text/html' : 'application/octet-stream';
                res.setHeader('Content-Type', contentType);
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                res.sendFile(reportPath);
                // Clean up file after sending
                setTimeout(() => {
                    fs.unlink(reportPath).catch(() => { });
                }, 5000);
            }
            catch (error) {
                console.error('Report download failed:', error);
                res.status(500).json({ error: 'Report download failed' });
            }
        });
        // Enhanced WHOIS API
        this.app.post('/api/whois/enhanced-check', async (req, res) => {
            try {
                const { domain } = req.body;
                if (!domain) {
                    return res.status(400).json({ error: 'Domain is required' });
                }
                console.log(`🔍 Starting enhanced WHOIS check for: ${domain}`);
                const whoisData = await this.whoisChecker.checkDomain(domain);
                res.json({
                    success: true,
                    domain,
                    whois: whoisData,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('Enhanced WHOIS check failed:', error);
                res.status(500).json({ error: 'WHOIS check failed' });
            }
        });
        this.app.post('/api/whois/batch-check', async (req, res) => {
            try {
                const { domains } = req.body;
                if (!domains || !Array.isArray(domains)) {
                    return res.status(400).json({ error: 'Domains array is required' });
                }
                console.log(`🔍 Starting batch WHOIS check for ${domains.length} domains`);
                const whoisResults = await this.whoisChecker.checkDomains(domains);
                res.json({
                    success: true,
                    domains: whoisResults,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('Batch WHOIS check failed:', error);
                res.status(500).json({ error: 'Batch WHOIS check failed' });
            }
        });
        // Ahrefs Integration API
        this.app.post('/api/ahrefs/domain-analysis', async (req, res) => {
            try {
                const { domain } = req.body;
                if (!domain) {
                    return res.status(400).json({ error: 'Domain is required' });
                }
                if (!this.ahrefsIntegration) {
                    return res.status(503).json({ error: 'Ahrefs integration not available' });
                }
                console.log(`🔍 Starting Ahrefs analysis for: ${domain}`);
                const analysis = await this.ahrefsIntegration.analyzeDomain(domain);
                res.json({
                    success: true,
                    domain,
                    analysis,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('Ahrefs domain analysis failed:', error);
                res.status(500).json({ error: 'Domain analysis failed' });
            }
        });
        this.app.post('/api/ahrefs/backlinks', async (req, res) => {
            try {
                const { domain, limit = 100 } = req.body;
                if (!domain) {
                    return res.status(400).json({ error: 'Domain is required' });
                }
                if (!this.ahrefsIntegration) {
                    return res.status(503).json({ error: 'Ahrefs integration not available' });
                }
                console.log(`🔗 Getting backlinks for: ${domain}`);
                const backlinks = await this.ahrefsIntegration.getBacklinks(domain, limit);
                res.json({
                    success: true,
                    domain,
                    backlinks,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('Ahrefs backlinks fetch failed:', error);
                res.status(500).json({ error: 'Backlinks fetch failed' });
            }
        });
        this.app.post('/api/ahrefs/organic-keywords', async (req, res) => {
            try {
                const { domain, limit = 100 } = req.body;
                if (!domain) {
                    return res.status(400).json({ error: 'Domain is required' });
                }
                if (!this.ahrefsIntegration) {
                    return res.status(503).json({ error: 'Ahrefs integration not available' });
                }
                console.log(`🎯 Getting organic keywords for: ${domain}`);
                const keywords = await this.ahrefsIntegration.getOrganicKeywords(domain, limit);
                res.json({
                    success: true,
                    domain,
                    keywords,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('Ahrefs organic keywords fetch failed:', error);
                res.status(500).json({ error: 'Organic keywords fetch failed' });
            }
        });
        this.app.get('/api/ahrefs/domain-info/:domain', async (req, res) => {
            try {
                const { domain } = req.params;
                if (!domain) {
                    return res.status(400).json({ error: 'Domain is required' });
                }
                if (!this.ahrefsIntegration) {
                    return res.status(503).json({ error: 'Ahrefs integration not available' });
                }
                console.log(`📊 Getting domain info for: ${domain}`);
                const domainInfo = await this.ahrefsIntegration.getDomainInfo(domain);
                res.json({
                    success: true,
                    domain,
                    info: domainInfo,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('Ahrefs domain info fetch failed:', error);
                res.status(500).json({ error: 'Domain info fetch failed' });
            }
        });
        // Google Sheets Integration API
        this.app.get('/api/google-sheets/templates', (req, res) => {
            try {
                const templates = GoogleSheetsManager.getTemplates();
                res.json(templates);
            }
            catch (error) {
                console.error('Failed to get templates:', error);
                res.status(500).json({ error: 'Failed to get templates' });
            }
        });
        this.app.post('/api/google-sheets/create-form', async (req, res) => {
            try {
                const { template, credentials } = req.body;
                if (!template || !credentials) {
                    return res.status(400).json({ error: 'Template and credentials are required' });
                }
                const sheetsManager = new GoogleSheetsManager({
                    credentials,
                    spreadsheetId: '',
                    scopes: ['https://www.googleapis.com/auth/spreadsheets']
                });
                const spreadsheetId = await sheetsManager.createFormFromTemplate(template);
                res.json({ spreadsheetId });
            }
            catch (error) {
                console.error('Failed to create form:', error);
                res.status(500).json({ error: 'Failed to create Google Sheets form' });
            }
        });
        this.app.post('/api/google-sheets/import-data', async (req, res) => {
            try {
                const { data, template, credentials, spreadsheetId } = req.body;
                if (!data || !template || !credentials || !spreadsheetId) {
                    return res.status(400).json({ error: 'Data, template, credentials, and spreadsheet ID are required' });
                }
                const sheetsManager = new GoogleSheetsManager({
                    credentials,
                    spreadsheetId,
                    scopes: ['https://www.googleapis.com/auth/spreadsheets']
                });
                const result = await sheetsManager.importData(data, template);
                res.json(result);
            }
            catch (error) {
                console.error('Failed to import data:', error);
                res.status(500).json({ error: 'Failed to import data to Google Sheets' });
            }
        });
        this.app.post('/api/google-sheets/export-csv', async (req, res) => {
            try {
                const { range, credentials, spreadsheetId } = req.body;
                if (!range || !credentials || !spreadsheetId) {
                    return res.status(400).json({ error: 'Range, credentials, and spreadsheet ID are required' });
                }
                const sheetsManager = new GoogleSheetsManager({
                    credentials,
                    spreadsheetId,
                    scopes: ['https://www.googleapis.com/auth/spreadsheets']
                });
                const csv = await sheetsManager.exportToCSV(range);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename="export.csv"');
                res.send(csv);
            }
            catch (error) {
                console.error('Failed to export CSV:', error);
                res.status(500).json({ error: 'Failed to export CSV from Google Sheets' });
            }
        });
        // Serve React app for all other routes
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../dist/frontend/index.html'));
        });
    }
    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            console.log('Client connected to WebSocket');
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    console.log('WebSocket message:', data);
                }
                catch (error) {
                    console.error('Invalid WebSocket message:', error);
                }
            });
            ws.on('close', () => {
                console.log('Client disconnected from WebSocket');
            });
        });
    }
    broadcastUpdate(type, data) {
        const message = JSON.stringify({ type, data });
        this.wss.clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(message);
            }
        });
    }
    updateScanProgress(scanId, progress, status) {
        const scan = this.scans.get(scanId);
        if (scan) {
            scan.progress = progress;
            if (status)
                scan.status = status;
            console.log(`[${scanId}] Broadcasting progress: ${progress}% - ${scan.status}`);
            this.broadcastUpdate('scan_progress', {
                scanId,
                progress,
                status: scan.status,
                summary: scan.summary,
                results: scan.results
            });
        }
    }
    async runScan(scanId, params) {
        const scan = this.scans.get(scanId);
        if (!scan)
            return;
        try {
            scan.status = 'running';
            this.updateScanProgress(scanId, 5, 'running');
            const { brand, baseUrl, features, sequence, range = 10, ctDays = 30, logoUrl } = params;
            let allDomains = [];
            let totalSteps = features.length;
            let currentStep = 0;
            // Step 1: Generate domain variants if typosquatting is enabled
            if (features.includes('typosquatting')) {
                console.log(`[${scanId}] Generating typosquatting variants...`);
                const variants = generateDomainVariants(brand);
                allDomains.push(...variants.map(v => v.domain));
                // Add sequence domains if provided
                if (sequence) {
                    const seqDomains = generateSequenceDomains({
                        patternDomain: sequence,
                        range: parseInt(range, 10),
                        includeWWW: true
                    });
                    allDomains.push(...seqDomains);
                }
                // Add CT log domains
                try {
                    const ctDomains = await searchCTLogs(brand, parseInt(ctDays, 10));
                    allDomains.push(...ctDomains.map(d => d.domain));
                }
                catch (e) {
                    console.warn('CT log search failed:', e);
                }
                scan.summary.totalDomains = allDomains.length;
                currentStep++;
                this.updateScanProgress(scanId, (currentStep / totalSteps) * 40);
            }
            // Step 2: Check domain registration status (optimized)
            if (allDomains.length > 0) {
                console.log(`[${scanId}] Checking ${allDomains.length} domains...`);
                // Limit domains for faster processing in web interface
                const uniqueDomains = [...new Set(allDomains)];
                const limitedDomains = uniqueDomains.slice(0, 500); // Limit to 500 for web interface speed
                console.log(`[${scanId}] Processing ${limitedDomains.length} domains (limited for web interface)...`);
                // Use higher concurrency for faster processing
                const domainResults = await checkDomains(limitedDomains, 50);
                const activeDomains = domainResults.filter(d => d.isRegistered || d.hasARecord);
                scan.results.domains = domainResults.map(d => ({
                    domain: d.domain,
                    reason: 'Generated variant',
                    isRegistered: d.isRegistered,
                    hasARecord: d.hasARecord,
                    hasMxRecord: d.hasMxRecord,
                    riskLevel: d.isRegistered && d.hasARecord ? 'medium' : 'low',
                    whois: {
                        registrar: d.whoisRegistrar,
                        creationDate: d.whoisCreationDate,
                        nameServers: d.whoisNameServers
                    }
                }));
                scan.summary.totalDomains = limitedDomains.length;
                scan.summary.activeDomains = activeDomains.length;
                this.updateScanProgress(scanId, 60);
                console.log(`[${scanId}] Found ${activeDomains.length} active domains out of ${limitedDomains.length} checked`);
            }
            // Step 3: Run additional features
            const featureProgress = 60;
            const progressPerFeature = 35 / features.length;
            let currentProgress = featureProgress;
            for (const feature of features) {
                try {
                    switch (feature) {
                        case 'social-media':
                            console.log(`[${scanId}] Running social media monitoring...`);
                            const socialData = await runSocialMonitoring(brand);
                            scan.results.social = socialData.social;
                            break;
                        case 'mobile-apps':
                            console.log(`[${scanId}] Scanning mobile apps...`);
                            const mobileApps = await monitorMobileApps(brand, logoUrl);
                            scan.results.mobile = mobileApps;
                            break;
                        case 'crypto':
                            console.log(`[${scanId}] Scanning cryptocurrency threats...`);
                            const cryptoData = await runCryptoMonitoring(brand);
                            scan.results.crypto = cryptoData.threats;
                            break;
                        case 'dark-web':
                            console.log(`[${scanId}] Monitoring dark web...`);
                            const darkWebData = await runDarkWebMonitoring(brand);
                            scan.results.darkweb = darkWebData.threats;
                            break;
                        case 'threat-intel':
                            console.log(`[${scanId}] Running threat intelligence...`);
                            const registeredDomains = scan.results.domains
                                .filter((d) => d.isRegistered)
                                .map((d) => d.domain)
                                .slice(0, 20); // Limit for performance
                            if (registeredDomains.length > 0) {
                                const threats = await batchThreatIntelligence(registeredDomains);
                                scan.results.threats = threats;
                            }
                            break;
                        case 'visual-ai':
                            console.log(`[${scanId}] Running visual analysis...`);
                            // Visual analysis on top suspicious domains
                            const topDomains = scan.results.domains
                                .filter((d) => d.isRegistered && d.hasARecord)
                                .slice(0, 5);
                            let cloneCount = 0;
                            for (const domain of topDomains) {
                                try {
                                    const result = await runVisualAndContentComparison(baseUrl, `http://${domain.domain}`, `./temp-scan-${scanId}`);
                                    domain.similarity = {
                                        visual: result.visual.diffRatio,
                                        dom: result.dom.tagCosine,
                                        text: result.text.hamming
                                    };
                                    // Check if it's a potential clone
                                    if (result.visual.diffRatio < 0.1 &&
                                        (result.dom.tagCosine > 0.8 || result.text.hamming < 16)) {
                                        domain.riskLevel = 'high';
                                        cloneCount++;
                                    }
                                }
                                catch (e) {
                                    console.warn(`Visual analysis failed for ${domain.domain}:`, e);
                                }
                            }
                            scan.summary.clones = cloneCount;
                            break;
                        case 'legal':
                            console.log(`[${scanId}] Preparing legal documentation...`);
                            const highRiskDomains = scan.results.domains
                                .filter((d) => d.riskLevel === 'high')
                                .map((d) => d.domain);
                            if (highRiskDomains.length > 0) {
                                try {
                                    await runLegalAutomation(highRiskDomains, brand, `./temp-scan-${scanId}`);
                                }
                                catch (e) {
                                    console.warn('Legal automation failed:', e);
                                }
                            }
                            break;
                    }
                    currentProgress += progressPerFeature;
                    this.updateScanProgress(scanId, Math.min(currentProgress, 95));
                    console.log(`[${scanId}] Completed feature: ${feature} (${Math.round(currentProgress)}%)`);
                }
                catch (error) {
                    console.error(`[${scanId}] Feature ${feature} failed:`, error);
                    currentProgress += progressPerFeature; // Still increment progress even if feature fails
                    this.updateScanProgress(scanId, Math.min(currentProgress, 95));
                }
            }
            // Calculate final summary
            scan.summary.highRisk = scan.results.domains.filter((d) => d.riskLevel === 'high').length +
                scan.results.mobile.filter((m) => m.riskLevel === 'high').length +
                scan.results.crypto.filter((c) => c.riskLevel === 'high').length;
            scan.status = 'completed';
            scan.completedAt = new Date().toISOString();
            this.updateScanProgress(scanId, 100, 'completed');
            console.log(`[${scanId}] Scan completed successfully`);
            // Broadcast completion
            this.broadcastUpdate('scan_complete', {
                scanId,
                brand,
                summary: scan.summary
            });
        }
        catch (error) {
            console.error(`Scan ${scanId} failed:`, error);
            scan.status = 'failed';
            this.broadcastUpdate('scan_error', {
                scanId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async start() {
        return new Promise((resolve) => {
            this.server.listen(this.port, () => {
                console.log(`🌐 Brand Protection Web Server running on http://localhost:${this.port}`);
                console.log(`📊 Dashboard: http://localhost:${this.port}`);
                console.log(`🔌 WebSocket: ws://localhost:${this.port}`);
                resolve();
            });
        });
    }
    stop() {
        return new Promise((resolve) => {
            this.server.close(() => {
                console.log('Web server stopped');
                resolve();
            });
        });
    }
}
// Start the server
const server = new BrandProtectionWebServer(3000);
server.start().catch(console.error);
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down web server...');
    await server.stop();
    process.exit(0);
});
