import dns from 'node:dns/promises';
import pLimit from 'p-limit';
class EnhancedWhoisChecker {
    limit;
    constructor(concurrency = 20) {
        this.limit = pLimit(concurrency);
    }
    async checkDomain(domain) {
        try {
            // First, check if domain exists via DNS
            const hasARecord = await this.checkARecord(domain);
            const hasMxRecord = await this.checkMxRecord(domain);
            if (!hasARecord && !hasMxRecord) {
                return {
                    domain,
                    isRegistered: false,
                    riskLevel: 'low'
                };
            }
            // Get WHOIS data
            const whoisData = await this.getWhoisData(domain);
            // Analyze risk indicators
            const riskIndicators = this.analyzeWhoisRisk(whoisData);
            const riskLevel = this.calculateRiskLevel(riskIndicators);
            return {
                domain,
                isRegistered: true,
                ...whoisData,
                riskIndicators,
                riskLevel
            };
        }
        catch (error) {
            console.warn(`WHOIS check failed for ${domain}:`, error);
            return {
                domain,
                isRegistered: false,
                riskLevel: 'low',
                riskIndicators: ['WHOIS lookup failed']
            };
        }
    }
    async checkARecord(domain) {
        try {
            await dns.resolve4(domain);
            return true;
        }
        catch {
            return false;
        }
    }
    async checkMxRecord(domain) {
        try {
            const mxRecords = await dns.resolveMx(domain);
            return mxRecords.length > 0;
        }
        catch {
            return false;
        }
    }
    async getWhoisData(domain) {
        try {
            // Use the existing whois functionality from check.ts for now
            // In a real implementation, you'd use a proper WHOIS library
            const { checkDomain } = await import('./check.js');
            const basicWhois = await checkDomain(domain);
            if (!basicWhois.isRegistered) {
                return {};
            }
            // Convert basic WHOIS data to enhanced format
            const data = {
                registrar: basicWhois.whoisRegistrar || undefined,
                creationDate: basicWhois.whoisCreationDate ? new Date(basicWhois.whoisCreationDate).toISOString() : undefined,
                nameServers: basicWhois.whoisNameServers || undefined
            };
            return data;
        }
        catch (error) {
            console.warn(`WHOIS parsing failed for ${domain}:`, error);
            return {};
        }
    }
    parseDate(dateValue) {
        if (!dateValue)
            return '';
        try {
            if (typeof dateValue === 'string') {
                return new Date(dateValue).toISOString();
            }
            if (dateValue instanceof Date) {
                return dateValue.toISOString();
            }
            if (typeof dateValue === 'number') {
                return new Date(dateValue * 1000).toISOString();
            }
            return String(dateValue);
        }
        catch {
            return String(dateValue);
        }
    }
    parseContactInfo(contact) {
        if (typeof contact === 'string') {
            return { name: contact };
        }
        if (Array.isArray(contact) && contact.length > 0) {
            return this.parseContactInfo(contact[0]);
        }
        return {
            name: contact.name,
            organization: contact.organization,
            email: contact.email,
            phone: contact.phone,
            country: contact.country
        };
    }
    analyzeWhoisRisk(whoisData) {
        const indicators = [];
        if (!whoisData) {
            return ['No WHOIS data available'];
        }
        // Check for privacy protection
        if (whoisData.registrantOrganization?.includes('privacy') ||
            whoisData.registrantEmail?.includes('privacy') ||
            whoisData.registrantOrganization?.includes('protect')) {
            indicators.push('Privacy protection service detected');
        }
        // Check registrar reputation
        const suspiciousRegistrars = [
            'namecheap', 'godaddy', 'enom', 'tucows', 'networksolutions',
            'register.com', '1&1', 'hostgator', 'bluehost'
        ];
        if (whoisData.registrar) {
            const registrar = whoisData.registrar.toLowerCase();
            if (suspiciousRegistrars.some(s => registrar.includes(s))) {
                indicators.push('Common registrar used by spammers');
            }
        }
        // Check for recent registration
        if (whoisData.creationDate) {
            const creationDate = new Date(whoisData.creationDate);
            const daysSinceCreation = (Date.now() - creationDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceCreation < 30) {
                indicators.push('Recently registered domain');
            }
            else if (daysSinceCreation < 90) {
                indicators.push('Domain registered within last 3 months');
            }
        }
        // Check for missing contact information
        if (!whoisData.registrantOrganization || whoisData.registrantOrganization === 'REDACTED FOR PRIVACY') {
            indicators.push('Registrant information hidden');
        }
        if (!whoisData.registrantEmail || whoisData.registrantEmail.includes('privacy')) {
            indicators.push('Registrant email hidden');
        }
        // Check for suspicious name servers
        if (whoisData.nameServers) {
            const suspiciousNs = ['ns1.example.com', 'ns2.example.com', 'localhost'];
            const hasSuspiciousNs = whoisData.nameServers.some(ns => suspiciousNs.some(s => ns.toLowerCase().includes(s)));
            if (hasSuspiciousNs) {
                indicators.push('Suspicious name servers detected');
            }
        }
        // Check domain status
        if (whoisData.status) {
            const suspiciousStatuses = ['clienthold', 'serverhold', 'pendingdelete', 'redemptionperiod'];
            const hasSuspiciousStatus = whoisData.status.some(status => suspiciousStatuses.some(s => status.toLowerCase().includes(s)));
            if (hasSuspiciousStatus) {
                indicators.push('Domain has concerning status flags');
            }
        }
        return indicators.length > 0 ? indicators : ['No significant risk indicators'];
    }
    calculateRiskLevel(indicators) {
        const highRiskKeywords = [
            'Recently registered',
            'Privacy protection',
            'Registrant information hidden',
            'Suspicious name servers',
            'Common registrar used by spammers'
        ];
        const mediumRiskKeywords = [
            'Domain registered within last 3 months',
            'Registrant email hidden'
        ];
        const hasHighRisk = indicators.some(indicator => highRiskKeywords.some(keyword => indicator.includes(keyword)));
        const hasMediumRisk = indicators.some(indicator => mediumRiskKeywords.some(keyword => indicator.includes(keyword)));
        if (hasHighRisk)
            return 'high';
        if (hasMediumRisk)
            return 'medium';
        return 'low';
    }
    async checkDomains(domains) {
        return Promise.all(domains.map(domain => this.limit(() => this.checkDomain(domain))));
    }
}
export function createEnhancedWhoisChecker(concurrency = 20) {
    return new EnhancedWhoisChecker(concurrency);
}
export { EnhancedWhoisChecker };
