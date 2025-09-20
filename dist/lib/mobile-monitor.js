import { chromium } from 'playwright';
import Jimp from 'jimp';
export async function searchAppStore(brand, platform) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const apps = [];
    try {
        if (platform === 'ios') {
            // iOS App Store search
            const searchUrl = `https://apps.apple.com/search?term=${encodeURIComponent(brand)}`;
            await page.goto(searchUrl, { timeout: 15000 });
            const appElements = await page.$$('.we-lockup--app');
            for (const element of appElements.slice(0, 20)) {
                try {
                    const name = await element.$eval('.we-truncate--single-line', el => el.textContent?.trim() || '');
                    const developer = await element.$eval('.we-text--caption', el => el.textContent?.trim() || '');
                    const iconUrl = await element.$eval('img', el => el.src || '');
                    const storeUrl = await element.$eval('a', el => el.href || '');
                    const suspiciousReasons = [];
                    if (name.toLowerCase().includes(brand.toLowerCase()) && !developer.toLowerCase().includes('official')) {
                        suspiciousReasons.push('Brand name used by unofficial developer');
                    }
                    if (developer.toLowerCase().includes('ltd') || developer.toLowerCase().includes('inc')) {
                        suspiciousReasons.push('Generic company name');
                    }
                    apps.push({
                        platform: 'ios',
                        appId: storeUrl.split('/id')[1]?.split('?')[0] || '',
                        name,
                        developer,
                        description: '',
                        iconUrl,
                        storeUrl,
                        riskLevel: suspiciousReasons.length > 0 ? 'medium' : 'low',
                        suspiciousReasons
                    });
                }
                catch (e) {
                    // Skip failed elements
                }
            }
        }
        else {
            // Google Play Store search
            const searchUrl = `https://play.google.com/store/search?q=${encodeURIComponent(brand)}&c=apps`;
            await page.goto(searchUrl, { timeout: 15000 });
            const appElements = await page.$$('[data-uitype="500"]');
            for (const element of appElements.slice(0, 20)) {
                try {
                    const name = await element.$eval('span[title]', el => el.getAttribute('title') || '');
                    const developer = await element.$eval('.wMUdtb', el => el.textContent?.trim() || '');
                    const iconUrl = await element.$eval('img', el => el.src || '');
                    const storeUrl = 'https://play.google.com' + await element.$eval('a', el => el.getAttribute('href') || '');
                    const suspiciousReasons = [];
                    if (name.toLowerCase().includes(brand.toLowerCase()) && !developer.toLowerCase().includes('official')) {
                        suspiciousReasons.push('Brand name used by unofficial developer');
                    }
                    apps.push({
                        platform: 'android',
                        appId: storeUrl.split('id=')[1]?.split('&')[0] || '',
                        name,
                        developer,
                        description: '',
                        iconUrl,
                        storeUrl,
                        riskLevel: suspiciousReasons.length > 0 ? 'medium' : 'low',
                        suspiciousReasons
                    });
                }
                catch (e) {
                    // Skip failed elements
                }
            }
        }
    }
    catch (error) {
        console.error(`${platform} app store search failed:`, error);
    }
    await browser.close();
    return apps;
}
export async function compareAppIcons(originalIconUrl, suspiciousIconUrl) {
    try {
        const [originalImage, suspiciousImage] = await Promise.all([
            Jimp.read(originalIconUrl),
            Jimp.read(suspiciousIconUrl)
        ]);
        // Resize to same dimensions for comparison
        originalImage.resize(128, 128);
        suspiciousImage.resize(128, 128);
        // Calculate pixel difference
        const diff = Jimp.diff(originalImage, suspiciousImage);
        return 1 - diff.percent; // Return similarity (0-1)
    }
    catch (error) {
        console.error('Icon comparison failed:', error);
        return 0;
    }
}
export async function monitorMobileApps(brand, originalIconUrl) {
    const [iosApps, androidApps] = await Promise.all([
        searchAppStore(brand, 'ios'),
        searchAppStore(brand, 'android')
    ]);
    const allApps = [...iosApps, ...androidApps];
    // If original icon provided, check for visual similarity
    if (originalIconUrl) {
        for (const app of allApps) {
            try {
                const similarity = await compareAppIcons(originalIconUrl, app.iconUrl);
                if (similarity > 0.8) {
                    app.suspiciousReasons.push(`Icon similarity: ${(similarity * 100).toFixed(1)}%`);
                    app.riskLevel = 'high';
                }
            }
            catch (e) {
                // Skip icon comparison failures
            }
        }
    }
    return allApps.filter(app => app.suspiciousReasons.length > 0);
}
