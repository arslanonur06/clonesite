import axios from 'axios';
import * as cheerio from 'cheerio';
const TURKISH_HINTS = [
    'hoş geldin',
    'bonus',
    'promosyon',
    'çevrim',
    'şart',
    'yatırım',
    'freespin',
    'deneme',
    'kayıp iadesi',
    'cashback',
];
const BONUS_LINE_PATTERN_TR = /(hoş\s*geldin|bonus|promosyon|freespin|free\s*spin|yatırım|çevrim|cashback|kayıp\s*iadesi)/i;
const BONUS_LINE_PATTERN_EN = /(welcome|bonus|promotion|freespin|free\s*spin|deposit|wager|wagering|cashback|terms)/i;
function normalizeWhitespace(value) {
    return value.replace(/\s+/g, ' ').trim();
}
function parseNumber(raw) {
    const normalized = raw.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.');
    const num = Number(normalized);
    return Number.isFinite(num) ? num : undefined;
}
function parsePercentage(text) {
    const match = text.match(/%\s*(\d{1,3})/);
    if (!match)
        return undefined;
    return Number(match[1]);
}
function parseWagering(text) {
    const match = text.match(/(\d{1,3})\s*x\s*(çevrim|wager|wagering|çrim|çevirim)?/i);
    if (!match)
        return undefined;
    return Number(match[1]);
}
function parseFreeSpins(text) {
    const match = text.match(/(\d{1,4})\s*(adet\s*)?(freespin|free\s*spin)/i);
    if (!match)
        return undefined;
    return Number(match[1]);
}
function parseAmountNearKeywords(text, keywordRegex) {
    const keywordMatch = text.match(keywordRegex);
    if (!keywordMatch || keywordMatch.index === undefined)
        return undefined;
    const windowText = text.slice(Math.max(0, keywordMatch.index - 30), keywordMatch.index + 80);
    const amountMatch = windowText.match(/(₺|\$|€)?\s*\d{2,7}([.,]\d{1,2})?/);
    if (!amountMatch)
        return undefined;
    return parseNumber(amountMatch[0]);
}
function classifyBonusType(text) {
    const lower = text.toLowerCase();
    if (lower.includes('hoş geldin'))
        return 'welcome';
    if (lower.includes('freespin') || lower.includes('free spin'))
        return 'freespin';
    if (lower.includes('cashback') || lower.includes('kayıp iadesi'))
        return 'cashback';
    if (lower.includes('yatırım'))
        return 'deposit';
    return 'generic';
}
function extractCandidateLines($, preferredLanguage) {
    const pattern = preferredLanguage === 'tr'
        ? BONUS_LINE_PATTERN_TR
        : preferredLanguage === 'en'
            ? BONUS_LINE_PATTERN_EN
            : /(hoş\s*geldin|bonus|promosyon|freespin|free\s*spin|yatırım|çevrim|cashback|kayıp\s*iadesi|welcome|promotion|deposit|wagering)/i;
    const chunks = [];
    $('h1, h2, h3, h4, p, li, span, div').each((_, el) => {
        const text = normalizeWhitespace($(el).text() || '');
        if (!text || text.length < 20 || text.length > 320)
            return;
        if (!pattern.test(text))
            return;
        chunks.push(text);
    });
    return [...new Set(chunks)].slice(0, 120);
}
function buildOffers(lines) {
    const offers = lines.map((line) => {
        const bonusType = classifyBonusType(line);
        const percentage = parsePercentage(line);
        const wagering = parseWagering(line);
        const freeSpins = parseFreeSpins(line);
        const maxAmount = parseAmountNearKeywords(line, /(maksimum|max)\s*(bonus|tutar|limit)?/i);
        const minDeposit = parseAmountNearKeywords(line, /(minimum|min)\s*(yatırım|depozit|deposit)?/i);
        const title = normalizeWhitespace(line).slice(0, 96);
        return {
            title,
            bonusType,
            percentage,
            maxAmount,
            minDeposit,
            wagering,
            freeSpins,
            sourceSnippet: line,
        };
    });
    const deduped = new Map();
    for (const offer of offers) {
        const key = `${offer.bonusType}-${offer.title.toLowerCase()}`;
        if (!deduped.has(key))
            deduped.set(key, offer);
    }
    return [...deduped.values()].slice(0, 12);
}
function buildSummary(offers) {
    const welcome = offers.find((o) => o.bonusType === 'welcome') || offers[0];
    const wagering = offers.find((o) => typeof o.wagering === 'number');
    const maxAmount = offers.find((o) => typeof o.maxAmount === 'number');
    return {
        welcomeBonusText: welcome
            ? `${welcome.percentage ? `%${welcome.percentage} ` : ''}${welcome.maxAmount ? `up to ${welcome.maxAmount}` : welcome.title}`
            : 'N/A',
        wageringText: wagering?.wagering ? `${wagering.wagering}x` : 'N/A',
        maxCashoutText: maxAmount?.maxAmount ? `${maxAmount.maxAmount}` : 'N/A',
        offerCount: offers.length,
    };
}
function detectLanguage(lines, preferredLanguage) {
    if (preferredLanguage === 'tr')
        return 'tr';
    if (preferredLanguage === 'en')
        return 'en';
    const text = lines.join(' ').toLowerCase();
    const score = TURKISH_HINTS.reduce((sum, token) => sum + (text.includes(token) ? 1 : 0), 0);
    if (score >= 2)
        return 'tr';
    if (/(welcome|promotion|wagering|deposit|terms|bonus)/i.test(text))
        return 'en';
    return 'unknown';
}
export async function analyzeBonusPage(url, name, preferredLanguage = 'auto') {
    const errors = [];
    let html = '';
    let title = name || 'Unknown';
    try {
        const response = await axios.get(url, {
            timeout: 20000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
                Accept: 'text/html,application/xhtml+xml',
            },
            maxRedirects: 5,
            responseType: 'text',
        });
        html = response.data;
    }
    catch (error) {
        errors.push(`fetch_failed: ${error.message}`);
    }
    if (!html) {
        return {
            name: name || new URL(url).hostname,
            url,
            language: preferredLanguage === 'tr' ? 'tr' : preferredLanguage === 'en' ? 'en' : 'unknown',
            offers: [],
            summary: {
                welcomeBonusText: 'N/A',
                wageringText: 'N/A',
                maxCashoutText: 'N/A',
                offerCount: 0,
            },
            confidence: 0,
            errors,
        };
    }
    const $ = cheerio.load(html);
    title = normalizeWhitespace($('title').first().text()) || title;
    const lines = extractCandidateLines($, preferredLanguage);
    const offers = buildOffers(lines);
    const language = detectLanguage(lines, preferredLanguage);
    const detectedOffers = [...offers];
    // Fallback: keep comparison usable when a site blocks scraping/dynamic content.
    if (detectedOffers.length === 0) {
        errors.push('no_bonus_lines_detected');
        detectedOffers.push({
            title: 'Hoş geldin bonusu (otomatik tespit edilemedi, manuel kontrol önerilir)',
            bonusType: 'welcome',
            sourceSnippet: 'No parsable bonus content detected from page source',
        });
    }
    const summary = buildSummary(detectedOffers);
    const confidence = Math.min(100, detectedOffers.length * 12 + (language === 'tr' ? 25 : 5));
    return {
        name: name || title || new URL(url).hostname,
        url,
        language,
        offers: detectedOffers,
        summary,
        confidence,
        errors,
    };
}
export function createSideBySideComparison(profiles) {
    return profiles.map((profile) => ({
        name: profile.name,
        url: profile.url,
        language: profile.language,
        confidence: profile.confidence,
        welcomeBonus: profile.summary.welcomeBonusText,
        wagering: profile.summary.wageringText,
        maxCashout: profile.summary.maxCashoutText,
        offerCount: profile.summary.offerCount,
    }));
}
