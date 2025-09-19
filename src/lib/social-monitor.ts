import axios from 'axios';
import { chromium } from 'playwright';

export type SocialThreat = {
  platform: string;
  url: string;
  content: string;
  timestamp: string;
  riskLevel: 'low' | 'medium' | 'high';
  brandMentions: string[];
};

export type EmailThreat = {
  domain: string;
  dmarc: boolean;
  spf: boolean;
  reputation: string;
  riskLevel: 'low' | 'medium' | 'high';
};

// Social media monitoring
export async function monitorTwitter(brand: string, apiKey?: string): Promise<SocialThreat[]> {
  // Twitter API v2 search (requires API key)
  if (!apiKey) {
    console.warn('Twitter API key not provided, skipping Twitter monitoring');
    return [];
  }
  
  try {
    const query = `"${brand}" (phishing OR scam OR fake OR clone)`;
    const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      params: { query, max_results: 100 }
    });
    
    return response.data.data?.map((tweet: any) => ({
      platform: 'twitter',
      url: `https://twitter.com/i/web/status/${tweet.id}`,
      content: tweet.text,
      timestamp: tweet.created_at,
      riskLevel: tweet.text.toLowerCase().includes('scam') ? 'high' : 'medium',
      brandMentions: [brand]
    })) || [];
  } catch (error) {
    console.error('Twitter monitoring failed:', error);
    return [];
  }
}

export async function monitorTelegram(brand: string): Promise<SocialThreat[]> {
  // Telegram public channel/group scraping
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const threats: SocialThreat[] = [];
  
  try {
    // Search public Telegram channels
    const searchUrl = `https://t.me/s/telegram?q=${encodeURIComponent(brand)}`;
    await page.goto(searchUrl, { timeout: 10000 });
    
    const messages = await page.$$eval('.tgme_widget_message', (elements) =>
      elements.map(el => ({
        text: el.querySelector('.tgme_widget_message_text')?.textContent || '',
        link: el.querySelector('.tgme_widget_message_date')?.getAttribute('href') || '',
        date: el.querySelector('.tgme_widget_message_date')?.getAttribute('datetime') || ''
      }))
    );
    
    for (const msg of messages) {
      if (msg.text.toLowerCase().includes(brand.toLowerCase())) {
        threats.push({
          platform: 'telegram',
          url: msg.link,
          content: msg.text,
          timestamp: msg.date,
          riskLevel: /scam|fake|phish/i.test(msg.text) ? 'high' : 'low',
          brandMentions: [brand]
        });
      }
    }
  } catch (error) {
    console.error('Telegram monitoring failed:', error);
  }
  
  await browser.close();
  return threats;
}

// Email security monitoring
export async function monitorEmailSecurity(domain: string): Promise<EmailThreat> {
  try {
    // Check DMARC record
    const dmarcResponse = await axios.get(`https://dns.google/resolve?name=_dmarc.${domain}&type=TXT`);
    const hasDmarc = dmarcResponse.data.Answer?.some((record: any) => 
      record.data.includes('v=DMARC1')
    ) || false;
    
    // Check SPF record
    const spfResponse = await axios.get(`https://dns.google/resolve?name=${domain}&type=TXT`);
    const hasSpf = spfResponse.data.Answer?.some((record: any) => 
      record.data.includes('v=spf1')
    ) || false;
    
    // Simple reputation check (would integrate with real reputation APIs)
    const reputation = hasDmarc && hasSpf ? 'good' : 'poor';
    const riskLevel = hasDmarc && hasSpf ? 'low' : 'high';
    
    return {
      domain,
      dmarc: hasDmarc,
      spf: hasSpf,
      reputation,
      riskLevel
    };
  } catch (error) {
    return {
      domain,
      dmarc: false,
      spf: false,
      reputation: 'unknown',
      riskLevel: 'medium'
    };
  }
}

export async function runSocialMonitoring(brand: string): Promise<{
  social: SocialThreat[];
  email: EmailThreat;
}> {
  const [twitterThreats, telegramThreats, emailThreat] = await Promise.all([
    monitorTwitter(brand, process.env.TWITTER_API_KEY),
    monitorTelegram(brand),
    monitorEmailSecurity(`${brand}.com`)
  ]);
  
  return {
    social: [...twitterThreats, ...telegramThreats],
    email: emailThreat
  };
}
