export interface ScanRequest {
  brand: string;
  baseUrl: string;
  sequence?: string;
  range?: number;
  ctDays?: number;
  logoUrl?: string;
  features: ScanFeature[];
}

export type ScanFeature = 
  | 'typosquatting'
  | 'social-media'
  | 'mobile-apps'
  | 'visual-ai'
  | 'dark-web'
  | 'threat-intel'
  | 'crypto'
  | 'legal';

export interface ScanResult {
  id: string;
  brand: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt: string;
  completedAt?: string;
  results: {
    domains: DomainResult[];
    threats: ThreatResult[];
    mobile: MobileAppResult[];
    crypto: CryptoThreatResult[];
    darkweb: DarkWebThreatResult[];
    social: SocialThreatResult[];
  };
  summary: {
    totalDomains: number;
    activeDomains: number;
    clones: number;
    highRisk: number;
  };
}

export interface DomainResult {
  domain: string;
  reason: string;
  isRegistered: boolean;
  hasARecord: boolean;
  hasMxRecord: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  similarity?: {
    visual: number;
    dom: number;
    text: number;
  };
  whois?: {
    registrar?: string;
    creationDate?: string;
    nameServers?: string[];
  };
}

export interface ThreatResult {
  domain: string;
  reputation: 'clean' | 'suspicious' | 'malicious' | 'unknown';
  riskScore: number;
  sources: string[];
  categories: string[];
}

export interface MobileAppResult {
  platform: 'ios' | 'android';
  name: string;
  developer: string;
  riskLevel: 'low' | 'medium' | 'high';
  suspiciousReasons: string[];
  storeUrl: string;
}

export interface CryptoThreatResult {
  type: 'fake_exchange' | 'phishing_wallet' | 'ico_scam';
  domain: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  indicators: string[];
}

export interface DarkWebThreatResult {
  source: 'tor' | 'forum' | 'marketplace' | 'leak';
  title: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  threatType: string;
}

export interface SocialThreatResult {
  platform: string;
  content: string;
  riskLevel: 'low' | 'medium' | 'high';
  url: string;
}

export interface WebSocketMessage {
  type: 'scan_progress' | 'scan_complete' | 'scan_error' | 'metrics_update';
  data: any;
}
