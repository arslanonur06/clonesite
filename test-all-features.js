#!/usr/bin/env node

// Comprehensive Test Script for All iGaming Features
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

// Test configuration
const TEST_CONFIG = {
    brand: 'kalebet',
    domains: ['kalebet.com', 'kalebet.net', 'kalebet.org'],
    urls: ['https://kalebet.com', 'https://kalebet.net'],
    affiliateIds: ['AFF001', 'AFF002', 'AFF003']
};

// Test results tracking
const testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
};

// Helper function to run a test
async function runTest(testName, endpoint, method = 'POST', data = {}) {
    testResults.total++;
    console.log(`\n🧪 Testing: ${testName}`);
    console.log(`   Endpoint: ${endpoint}`);
    
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: method === 'POST' ? JSON.stringify(data) : undefined
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log(`   ✅ PASSED`);
            testResults.passed++;
            testResults.details.push({
                name: testName,
                status: 'PASSED',
                endpoint,
                responseTime: Date.now()
            });
        } else {
            console.log(`   ❌ FAILED: ${result.error || 'Unknown error'}`);
            testResults.failed++;
            testResults.details.push({
                name: testName,
                status: 'FAILED',
                endpoint,
                error: result.error || 'Unknown error'
            });
        }
    } catch (error) {
        console.log(`   ❌ FAILED: ${error.message}`);
        testResults.failed++;
        testResults.details.push({
            name: testName,
            status: 'FAILED',
            endpoint,
            error: error.message
        });
    }
}

// Main test function
async function runAllTests() {
    console.log('🚀 Starting Comprehensive iGaming Features Test');
    console.log('================================================\n');

    // Brand Protection Tests
    console.log('🛡️  BRAND PROTECTION TESTS');
    console.log('==========================');
    
    await runTest('Fake Domain Checker', '/api/brand-protection/fake-domain-check', 'POST', {
        brand: TEST_CONFIG.brand,
        useExternalData: true
    });
    
    await runTest('Clone Detection', '/api/brand-protection/clone-detection', 'POST', {
        baseUrl: TEST_CONFIG.urls[0],
        threshold: 0.8,
        useExternalData: true
    });

    // iGaming Basic Tools Tests
    console.log('\n🎰 IGAMING BASIC TOOLS TESTS');
    console.log('============================');
    
    await runTest('Affiliate Monitoring', '/api/igaming/affiliate-monitor', 'POST', {
        brand: TEST_CONFIG.brand,
        officialAffiliateIds: TEST_CONFIG.affiliateIds
    });
    
    await runTest('License Verification', '/api/igaming/license-verify', 'POST', {
        domains: TEST_CONFIG.domains
    });
    
    await runTest('Payment Analysis', '/api/igaming/payment-analysis', 'POST', {
        brand: TEST_CONFIG.brand,
        domains: TEST_CONFIG.domains
    });
    
    await runTest('Game Provider Verification', '/api/igaming/game-providers', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Responsible Gaming', '/api/igaming/responsible-gaming', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Bonus Abuse Detection', '/api/igaming/bonus-abuse', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Geo-blocking Compliance', '/api/igaming/geo-compliance', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Odds Manipulation Detection', '/api/igaming/odds-manipulation', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Customer Support Analysis', '/api/igaming/customer-support', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Security Analysis', '/api/igaming/security-analysis', 'POST', {
        brand: TEST_CONFIG.brand,
        domains: TEST_CONFIG.domains
    });
    
    await runTest('DMCA Takedown', '/api/igaming/dmca-takedown', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Deep Website Analysis', '/api/igaming/deep-website-analysis', 'POST', {
        url: TEST_CONFIG.urls[0],
        brand: TEST_CONFIG.brand
    });

    // iGaming Advanced Tools Tests
    console.log('\n🚀 IGAMING ADVANCED TOOLS TESTS');
    console.log('===============================');
    
    await runTest('Player Behavior Analytics', '/api/igaming/player-behavior', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Tournament Management', '/api/igaming/tournaments', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Live Dealer Management', '/api/igaming/live-dealers', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('VIP Player Management', '/api/igaming/vip-players', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Game Performance Analytics', '/api/igaming/game-performance', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Fraud Detection', '/api/igaming/fraud-detection', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Marketing Campaign Analytics', '/api/igaming/marketing-campaigns', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Compliance Monitor', '/api/igaming/compliance-monitor', 'POST', {
        brand: TEST_CONFIG.brand
    });

    // iGaming Professional Tools Tests
    console.log('\n👑 IGAMING PROFESSIONAL TOOLS TESTS');
    console.log('===================================');
    
    await runTest('Risk Assessment Engine', '/api/igaming/risk-assessment', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('KYC Verification System', '/api/igaming/kyc-verification', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('AML Monitoring', '/api/igaming/aml-monitoring', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Transaction Monitoring', '/api/igaming/transaction-monitoring', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Loyalty Programs Management', '/api/igaming/loyalty-programs', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Chargeback Prevention', '/api/igaming/chargeback-prevention', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Game Fairness Verification', '/api/igaming/game-fairness', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Player Segmentation Engine', '/api/igaming/player-segmentation', 'POST', {
        brand: TEST_CONFIG.brand
    });

    // Advanced Monitoring Tests
    console.log('\n📊 ADVANCED MONITORING TESTS');
    console.log('============================');
    
    await runTest('Crypto Monitoring', '/api/crypto-monitoring', 'POST', {
        brand: TEST_CONFIG.brand,
        cryptocurrencies: ['bitcoin', 'ethereum']
    });
    
    await runTest('Dark Web Monitoring', '/api/darkweb-monitoring', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Social Media Monitoring', '/api/social-monitoring', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Mobile App Monitoring', '/api/mobile-monitoring', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Visual Comparison', '/api/visual-comparison', 'POST', {
        url1: TEST_CONFIG.urls[0],
        url2: TEST_CONFIG.urls[1]
    });
    
    await runTest('Threat Intelligence', '/api/threat-intelligence', 'POST', {
        brand: TEST_CONFIG.brand
    });

    // Automation Tests
    console.log('\n⚡ AUTOMATION TESTS');
    console.log('==================');
    
    await runTest('Schedule Monitoring', '/api/automation/schedule-monitoring', 'POST', {
        brand: TEST_CONFIG.brand,
        frequency: 'daily',
        baseUrl: TEST_CONFIG.urls[0]
    });
    
    await runTest('Setup Alerts', '/api/automation/setup-alerts', 'POST', {
        brand: TEST_CONFIG.brand,
        alertType: 'domain_monitoring'
    });
    
    await runTest('Setup Reports', '/api/automation/setup-reports', 'POST', {
        brand: TEST_CONFIG.brand,
        frequency: 'weekly'
    });

    // Reports & Analytics Tests
    console.log('\n📈 REPORTS & ANALYTICS TESTS');
    console.log('============================');
    
    await runTest('CRM Dashboard', '/api/igaming/crm-dashboard', 'POST', {
        brand: TEST_CONFIG.brand
    });
    
    await runTest('Website Comparison', '/api/website-comparison/compare', 'POST', {
        url1: TEST_CONFIG.urls[0],
        url2: TEST_CONFIG.urls[1]
    });
    
    await runTest('Multiple Website Comparison', '/api/website-comparison/compare-multiple', 'POST', {
        urls: TEST_CONFIG.urls
    });

    // Integration Tests
    console.log('\n🔗 INTEGRATION TESTS');
    console.log('===================');
    
    await runTest('Telegram Bots', '/api/telegram/bots', 'POST', {
        brand: TEST_CONFIG.brand,
        name: 'TestBot',
        username: 'testbot',
        token: 'test_token_123'
    });
    
    await runTest('Google Sheets Export', '/api/google-sheets/export-csv', 'POST', {
        brand: TEST_CONFIG.brand,
        range: 'A1:Z100',
        credentials: { type: 'service_account' },
        spreadsheetId: 'test_spreadsheet_id'
    });

    // Print final results
    console.log('\n🎯 TEST RESULTS SUMMARY');
    console.log('=======================');
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    
    if (testResults.failed > 0) {
        console.log('\n❌ FAILED TESTS:');
        testResults.details
            .filter(test => test.status === 'FAILED')
            .forEach(test => {
                console.log(`   - ${test.name}: ${test.error}`);
            });
    }
    
    console.log('\n🎉 All tests completed!');
    
    return testResults;
}

// Run the tests
runAllTests().catch(console.error);
