import fs from 'node:fs/promises';
import path from 'node:path';
// Extract abuse contact from WHOIS data
export async function extractAbuseContacts(domain) {
    try {
        const whois = await import('whois');
        const whoisData = await new Promise((resolve, reject) => {
            whois.lookup(domain, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
        const abuseEmails = [];
        const emailRegex = /abuse[^@\s]*@[^\s,;]+/gi;
        const matches = whoisData.match(emailRegex);
        if (matches) {
            abuseEmails.push(...matches);
        }
        // Also look for general admin contacts
        const adminRegex = /admin[^@\s]*@[^\s,;]+/gi;
        const adminMatches = whoisData.match(adminRegex);
        if (adminMatches) {
            abuseEmails.push(...adminMatches);
        }
        return [...new Set(abuseEmails)]; // Remove duplicates
    }
    catch (error) {
        console.error('Failed to extract abuse contacts:', error);
        return [];
    }
}
// Generate takedown request template
export function generateTakedownTemplate(request, brand) {
    const templates = {
        phishing: `
Subject: Urgent: Phishing Website Impersonating ${brand} - Immediate Takedown Required

Dear Abuse Team,

We are writing to report a phishing website that is impersonating ${brand} and potentially defrauding users.

Fraudulent Domain: ${request.domain}
Brand Being Impersonated: ${brand}
Threat Type: Phishing/Brand Impersonation

EVIDENCE:
${request.evidenceUrls.map((url, i) => `${i + 1}. ${url}`).join('\n')}

REQUESTED ACTION:
We request immediate suspension of this domain due to:
- Trademark infringement
- Consumer fraud
- Phishing activities

LEGAL BASIS:
- Trademark violation under 15 U.S.C. § 1114
- Anticybersquatting Consumer Protection Act (ACPA)
- Computer Fraud and Abuse Act violations

Please confirm receipt and provide an estimated timeline for resolution.

Best regards,
${brand} Legal Team
    `,
        trademark: `
Subject: Trademark Infringement Notice - ${request.domain}

Dear Sir/Madam,

This is a formal notice of trademark infringement regarding the domain ${request.domain}.

Our client, ${brand}, holds registered trademark rights and the domain in question is causing consumer confusion and diluting our trademark rights.

EVIDENCE OF INFRINGEMENT:
${request.evidenceUrls.map((url, i) => `${i + 1}. ${url}`).join('\n')}

We request immediate action to suspend this infringing domain.

Sincerely,
Legal Department
    `,
        copyright: `
Subject: DMCA Takedown Notice - ${request.domain}

This is a formal DMCA takedown notice for copyrighted content being used without authorization on ${request.domain}.

The infringing material includes copyrighted logos, text, and design elements owned by ${brand}.

EVIDENCE:
${request.evidenceUrls.map((url, i) => `${i + 1}. ${url}`).join('\n')}

Under penalty of perjury, I state that the information in this notice is accurate and that I am authorized to act on behalf of ${brand}.
    `,
        malware: `
Subject: Security Threat Report - Malicious Domain ${request.domain}

We are reporting a domain that is distributing malware while impersonating ${brand}.

Domain: ${request.domain}
Threat: Malware distribution and brand impersonation

EVIDENCE:
${request.evidenceUrls.map((url, i) => `${i + 1}. ${url}`).join('\n')}

This poses immediate security risks to users and requires urgent action.
    `
    };
    return templates[request.requestType] || templates.phishing;
}
// Collect evidence for takedown request
export async function collectEvidence(domain, artifactPaths) {
    const evidence = [];
    for (const artifactPath of artifactPaths) {
        try {
            const stats = await fs.stat(artifactPath);
            const fileName = path.basename(artifactPath);
            let type = 'screenshot';
            let description = '';
            if (fileName.includes('whois')) {
                type = 'whois';
                description = 'WHOIS registration data showing domain ownership';
            }
            else if (fileName.includes('dns')) {
                type = 'dns';
                description = 'DNS records showing domain resolution';
            }
            else if (fileName.includes('report')) {
                type = 'similarity_report';
                description = 'Similarity analysis report showing brand impersonation';
            }
            else if (fileName.endsWith('.png') || fileName.endsWith('.jpg')) {
                type = 'screenshot';
                description = `Screenshot of ${domain} showing visual similarity`;
            }
            evidence.push({
                type,
                filePath: artifactPath,
                description,
                timestamp: stats.mtime.toISOString()
            });
        }
        catch (error) {
            console.error(`Failed to process evidence file ${artifactPath}:`, error);
        }
    }
    return evidence;
}
// Create takedown request
export async function createTakedownRequest(domain, requestType, artifactPaths) {
    const abuseContacts = await extractAbuseContacts(domain);
    const evidence = await collectEvidence(domain, artifactPaths);
    const request = {
        domain,
        registrar: 'Unknown', // Would be extracted from WHOIS
        abuseContact: abuseContacts[0] || 'abuse@registrar.com',
        evidenceUrls: evidence.map(e => `file://${e.filePath}`),
        requestType,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    return request;
}
// Send takedown request via email (would integrate with email service)
export async function sendTakedownRequest(request, brand) {
    try {
        const emailContent = generateTakedownTemplate(request, brand);
        // In a real implementation, would use email service like SendGrid, AWS SES, etc.
        console.log('Takedown request email content:');
        console.log('To:', request.abuseContact);
        console.log('Subject: Takedown Request for', request.domain);
        console.log(emailContent);
        // Mock sending
        request.status = 'sent';
        request.updatedAt = new Date().toISOString();
        return true;
    }
    catch (error) {
        console.error('Failed to send takedown request:', error);
        return false;
    }
}
// Generate legal report
export async function generateLegalReport(requests, outputPath) {
    const report = {
        generatedAt: new Date().toISOString(),
        totalRequests: requests.length,
        statusSummary: {
            pending: requests.filter(r => r.status === 'pending').length,
            sent: requests.filter(r => r.status === 'sent').length,
            resolved: requests.filter(r => r.status === 'resolved').length,
            rejected: requests.filter(r => r.status === 'rejected').length
        },
        requests: requests.map(r => ({
            domain: r.domain,
            type: r.requestType,
            status: r.status,
            createdAt: r.createdAt,
            abuseContact: r.abuseContact
        }))
    };
    await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
}
export async function runLegalAutomation(domains, brand, artifactDir) {
    const requests = [];
    for (const domain of domains) {
        try {
            // Find artifacts for this domain
            const domainArtifacts = await fs.readdir(artifactDir);
            const relevantArtifacts = domainArtifacts
                .filter(file => file.includes(domain.replace(/\./g, '_')))
                .map(file => path.join(artifactDir, file));
            if (relevantArtifacts.length > 0) {
                const request = await createTakedownRequest(domain, 'phishing', relevantArtifacts);
                const sent = await sendTakedownRequest(request, brand);
                if (sent) {
                    requests.push(request);
                }
            }
        }
        catch (error) {
            console.error(`Failed to create takedown request for ${domain}:`, error);
        }
    }
    return requests;
}

