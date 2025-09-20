import https from 'node:https';
import http from 'node:http';

// External data integration for enhanced clone detection
export class ExternalDataIntegration {
    constructor() {
        this.ahrefsApiKey = process.env.AHREFS_API_KEY;
        this.whoisApiKey = process.env.WHOIS_API_KEY;
        this.virustotalApiKey = process.env.VIRUSTOTAL_API_KEY;
    }

    // Get domain registration data from WHOIS
    async getWhoisData(domain) {
        try {
            const whoisData = await this.makeRequest(`https://whoisjson.com/api/v1/whois?domain=${domain}`);
            return {
                registrar: whoisData.registrar || 'Unknown',
                creationDate: whoisData.creation_date || null,
                expirationDate: whoisData.expiration_date || null,
                nameServers: whoisData.name_servers || [],
                status: whoisData.status || 'unknown',
                country: whoisData.country || 'Unknown',
                organization: whoisData.organization || 'Unknown'
            };
        } catch (error) {
            console.error(`WHOIS lookup failed for ${domain}:`, error.message);
            return {
                registrar: 'Unknown',
                creationDate: null,
                expirationDate: null,
                nameServers: [],
                status: 'unknown',
                country: 'Unknown',
                organization: 'Unknown'
            };
        }
    }

    // Get domain backlink data from Ahrefs
    async getAhrefsData(domain) {
        try {
            if (!this.ahrefsApiKey) {
                console.warn('Ahrefs API key not configured');
                return null;
            }

            const ahrefsData = await this.makeRequest(`https://apiv2.ahrefs.com?target=${domain}&mode=domain&output=json&token=${this.ahrefsApiKey}`);
            return {
                domainRating: ahrefsData.domain_rating || 0,
                backlinks: ahrefsData.backlinks || 0,
                referringDomains: ahrefsData.referring_domains || 0,
                organicTraffic: ahrefsData.organic_traffic || 0,
                organicKeywords: ahrefsData.organic_keywords || 0
            };
        } catch (error) {
            console.error(`Ahrefs lookup failed for ${domain}:`, error.message);
            return null;
        }
    }

    // Get domain security data from VirusTotal
    async getVirusTotalData(domain) {
        try {
            if (!this.virustotalApiKey) {
                console.warn('VirusTotal API key not configured');
                return null;
            }

            const vtData = await this.makeRequest(`https://www.virustotal.com/vtapi/v2/domain/report?apikey=${this.virustotalApiKey}&domain=${domain}`);
            return {
                isMalicious: vtData.positives > 0,
                detectionCount: vtData.positives || 0,
                totalScans: vtData.total || 0,
                lastScan: vtData.scan_date || null,
                categories: vtData.categories || {},
                subdomains: vtData.subdomains || []
            };
        } catch (error) {
            console.error(`VirusTotal lookup failed for ${domain}:`, error.message);
            return null;
        }
    }

    // Get domain age and history
    async getDomainHistory(domain) {
        try {
            const historyData = await this.makeRequest(`https://api.domainsdb.info/v1/domains/search?domain=${domain}`);
            return {
                firstSeen: historyData.domains?.[0]?.create_date || null,
                lastSeen: historyData.domains?.[0]?.update_date || null,
                isActive: historyData.domains?.[0]?.is_active || false,
                country: historyData.domains?.[0]?.country || 'Unknown'
            };
        } catch (error) {
            console.error(`Domain history lookup failed for ${domain}:`, error.message);
            return {
                firstSeen: null,
                lastSeen: null,
                isActive: false,
                country: 'Unknown'
            };
        }
    }

    // Get SSL certificate information
    async getSSLCertificate(domain) {
        try {
            const sslData = await this.makeRequest(`https://api.ssllabs.com/api/v3/analyze?host=${domain}`);
            return {
                hasSSL: sslData.endpoints?.[0]?.grade !== 'F',
                sslGrade: sslData.endpoints?.[0]?.grade || 'F',
                issuer: sslData.endpoints?.[0]?.details?.cert?.issuer || 'Unknown',
                validFrom: sslData.endpoints?.[0]?.details?.cert?.notBefore || null,
                validTo: sslData.endpoints?.[0]?.details?.cert?.notAfter || null,
                isExpired: sslData.endpoints?.[0]?.details?.cert?.notAfter ? 
                    new Date(sslData.endpoints[0].details.cert.notAfter) < new Date() : false
            };
        } catch (error) {
            console.error(`SSL lookup failed for ${domain}:`, error.message);
            return {
                hasSSL: false,
                sslGrade: 'F',
                issuer: 'Unknown',
                validFrom: null,
                validTo: null,
                isExpired: true
            };
        }
    }

    // Get domain reputation data
    async getDomainReputation(domain) {
        try {
            const reputationData = await this.makeRequest(`https://api.majestic.com/api/json?app_api_key=${process.env.MAJESTIC_API_KEY}&cmd=GetBackLinkData&item=${domain}&Count=1`);
            return {
                trustFlow: reputationData.DataTables?.Results?.Data?.[0]?.[2] || 0,
                citationFlow: reputationData.DataTables?.Results?.Data?.[0]?.[3] || 0,
                referringDomains: reputationData.DataTables?.Results?.Data?.[0]?.[4] || 0,
                backlinks: reputationData.DataTables?.Results?.Data?.[0]?.[5] || 0
            };
        } catch (error) {
            console.error(`Domain reputation lookup failed for ${domain}:`, error.message);
            return {
                trustFlow: 0,
                citationFlow: 0,
                referringDomains: 0,
                backlinks: 0
            };
        }
    }

    // Get recent domain registrations (last 30 days)
    async getRecentRegistrations(brand) {
        try {
            const recentData = await this.makeRequest(`https://api.domainsdb.info/v1/domains/search?query=${brand}&limit=100`);
            const recentDomains = recentData.domains?.filter(domain => {
                const createDate = new Date(domain.create_date);
                const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                return createDate > thirtyDaysAgo;
            }) || [];

            return recentDomains.map(domain => ({
                domain: domain.domain,
                createDate: domain.create_date,
                country: domain.country,
                isActive: domain.is_active
            }));
        } catch (error) {
            console.error(`Recent registrations lookup failed for ${brand}:`, error.message);
            return [];
        }
    }

    // Get domain variations from external sources
    async getExternalDomainVariations(brand) {
        try {
            const variations = [];
            
            // Get variations from domain suggestion APIs
            const suggestions = await this.makeRequest(`https://api.domainsdb.info/v1/domains/search?query=${brand}&limit=50`);
            if (suggestions.domains) {
                suggestions.domains.forEach(domain => {
                    if (domain.domain.includes(brand.toLowerCase())) {
                        variations.push({
                            domain: domain.domain,
                            source: 'domainsdb',
                            createDate: domain.create_date,
                            country: domain.country
                        });
                    }
                });
            }

            // Get variations from typosquatting databases
            const typosquattingData = await this.makeRequest(`https://api.typosquatting.com/v1/check?domain=${brand}`);
            if (typosquattingData.variations) {
                typosquattingData.variations.forEach(variation => {
                    variations.push({
                        domain: variation.domain,
                        source: 'typosquatting',
                        similarity: variation.similarity,
                        riskLevel: variation.risk_level
                    });
                });
            }

            return variations;
        } catch (error) {
            console.error(`External variations lookup failed for ${brand}:`, error.message);
            return [];
        }
    }

    // Get domain threat intelligence
    async getThreatIntelligence(domain) {
        try {
            const threatData = await this.makeRequest(`https://api.threatintel.com/v1/domain/${domain}`);
            return {
                isThreat: threatData.is_threat || false,
                threatType: threatData.threat_type || 'none',
                confidence: threatData.confidence || 0,
                lastSeen: threatData.last_seen || null,
                indicators: threatData.indicators || [],
                tags: threatData.tags || []
            };
        } catch (error) {
            console.error(`Threat intelligence lookup failed for ${domain}:`, error.message);
            return {
                isThreat: false,
                threatType: 'none',
                confidence: 0,
                lastSeen: null,
                indicators: [],
                tags: []
            };
        }
    }

    // Get domain content analysis
    async getContentAnalysis(domain) {
        try {
            const contentData = await this.makeRequest(`https://api.contentanalysis.com/v1/analyze?url=http://${domain}`);
            return {
                title: contentData.title || '',
                description: contentData.description || '',
                keywords: contentData.keywords || [],
                language: contentData.language || 'unknown',
                category: contentData.category || 'unknown',
                sentiment: contentData.sentiment || 'neutral',
                readability: contentData.readability || 0,
                wordCount: contentData.word_count || 0
            };
        } catch (error) {
            console.error(`Content analysis failed for ${domain}:`, error.message);
            return {
                title: '',
                description: '',
                keywords: [],
                language: 'unknown',
                category: 'unknown',
                sentiment: 'neutral',
                readability: 0,
                wordCount: 0
            };
        }
    }

    // Get domain social media presence
    async getSocialMediaPresence(domain) {
        try {
            const socialData = await this.makeRequest(`https://api.socialmedia.com/v1/domain/${domain}`);
            return {
                hasFacebook: socialData.facebook || false,
                hasTwitter: socialData.twitter || false,
                hasInstagram: socialData.instagram || false,
                hasLinkedIn: socialData.linkedin || false,
                hasYouTube: socialData.youtube || false,
                socialScore: socialData.social_score || 0,
                followers: socialData.followers || 0
            };
        } catch (error) {
            console.error(`Social media lookup failed for ${domain}:`, error.message);
            return {
                hasFacebook: false,
                hasTwitter: false,
                hasInstagram: false,
                hasLinkedIn: false,
                hasYouTube: false,
                socialScore: 0,
                followers: 0
            };
        }
    }

    // Get domain hosting information
    async getHostingInfo(domain) {
        try {
            const hostingData = await this.makeRequest(`https://api.hosting.com/v1/domain/${domain}`);
            return {
                hostingProvider: hostingData.hosting_provider || 'Unknown',
                hostingCountry: hostingData.hosting_country || 'Unknown',
                hostingCity: hostingData.hosting_city || 'Unknown',
                ipAddress: hostingData.ip_address || 'Unknown',
                isp: hostingData.isp || 'Unknown',
                hostingType: hostingData.hosting_type || 'Unknown',
                uptime: hostingData.uptime || 0
            };
        } catch (error) {
            console.error(`Hosting lookup failed for ${domain}:`, error.message);
            return {
                hostingProvider: 'Unknown',
                hostingCountry: 'Unknown',
                hostingCity: 'Unknown',
                ipAddress: 'Unknown',
                isp: 'Unknown',
                hostingType: 'Unknown',
                uptime: 0
            };
        }
    }

    // Get comprehensive domain analysis
    async getComprehensiveAnalysis(domain) {
        try {
            console.log(`🔍 Getting comprehensive analysis for ${domain}`);
            
            const [
                whoisData,
                ahrefsData,
                virusTotalData,
                domainHistory,
                sslData,
                reputationData,
                threatData,
                contentData,
                socialData,
                hostingData
            ] = await Promise.all([
                this.getWhoisData(domain),
                this.getAhrefsData(domain),
                this.getVirusTotalData(domain),
                this.getDomainHistory(domain),
                this.getSSLCertificate(domain),
                this.getDomainReputation(domain),
                this.getThreatIntelligence(domain),
                this.getContentAnalysis(domain),
                this.getSocialMediaPresence(domain),
                this.getHostingInfo(domain)
            ]);

            return {
                domain,
                whois: whoisData,
                ahrefs: ahrefsData,
                virusTotal: virusTotalData,
                history: domainHistory,
                ssl: sslData,
                reputation: reputationData,
                threat: threatData,
                content: contentData,
                social: socialData,
                hosting: hostingData,
                analysisDate: new Date().toISOString()
            };
        } catch (error) {
            console.error(`Comprehensive analysis failed for ${domain}:`, error.message);
            return {
                domain,
                error: error.message,
                analysisDate: new Date().toISOString()
            };
        }
    }

    // Make HTTP request helper
    async makeRequest(url) {
        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https') ? https : http;
            
            protocol.get(url, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve(jsonData);
                    } catch (error) {
                        reject(new Error(`Failed to parse JSON: ${error.message}`));
                    }
                });
            }).on('error', (error) => {
                reject(error);
            });
        });
    }

    // Get domain similarity score based on external data
    calculateExternalSimilarityScore(domain1, domain2, externalData1, externalData2) {
        let score = 0;
        let factors = 0;

        // Compare WHOIS data
        if (externalData1.whois && externalData2.whois) {
            if (externalData1.whois.registrar === externalData2.whois.registrar) {
                score += 20;
            }
            if (externalData1.whois.country === externalData2.whois.country) {
                score += 10;
            }
            if (externalData1.whois.organization === externalData2.whois.organization) {
                score += 30;
            }
            factors += 3;
        }

        // Compare hosting data
        if (externalData1.hosting && externalData2.hosting) {
            if (externalData1.hosting.hostingProvider === externalData2.hosting.hostingProvider) {
                score += 15;
            }
            if (externalData1.hosting.hostingCountry === externalData2.hosting.hostingCountry) {
                score += 10;
            }
            if (externalData1.hosting.ipAddress === externalData2.hosting.ipAddress) {
                score += 25;
            }
            factors += 3;
        }

        // Compare content data
        if (externalData1.content && externalData2.content) {
            if (externalData1.content.category === externalData2.content.category) {
                score += 10;
            }
            if (externalData1.content.language === externalData2.content.language) {
                score += 5;
            }
            factors += 2;
        }

        // Compare SSL data
        if (externalData1.ssl && externalData2.ssl) {
            if (externalData1.ssl.issuer === externalData2.ssl.issuer) {
                score += 15;
            }
            factors += 1;
        }

        return factors > 0 ? Math.round(score / factors) : 0;
    }
}

// Export singleton instance
export const externalDataIntegration = new ExternalDataIntegration();
