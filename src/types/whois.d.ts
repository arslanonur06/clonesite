declare module 'whois' {
  function whois(domain: string, callback: (err: Error | null, data: string) => void): void;
  export = whois;
}
