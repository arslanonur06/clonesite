import https from 'node:https';

export async function sendTelegram(botToken: string, chatId: string, text: string): Promise<void> {
  const url = `https://api.telegram.org/bot${encodeURIComponent(botToken)}/sendMessage`;
  await httpPostJson(url, { chat_id: chatId, text, parse_mode: 'Markdown' });
}

function httpPostJson(urlStr: string, payload: unknown): Promise<void> {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(payload));
    const url = new URL(urlStr);
    const req = https.request(
      {
        method: 'POST',
        hostname: url.hostname,
        path: url.pathname + url.search,
        protocol: url.protocol,
        headers: { 'content-type': 'application/json', 'content-length': data.length },
      },
      (res) => {
        res.on('data', () => {});
        res.on('end', () => (res.statusCode && res.statusCode >= 200 && res.statusCode < 300 ? resolve() : reject(new Error(`HTTP ${res.statusCode}`))));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

