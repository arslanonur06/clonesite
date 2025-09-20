/**
 * iGaming Brand Protection Platform - Configuration
 * Centralized configuration management for the application
 */

import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Configuration schema
const configSchema = z.object({
  // Server Configuration
  server: z.object({
    port: z.number().min(1).max(65535),
    host: z.string(),
    env: z.enum(['development', 'production', 'test']),
  }),

  // Database Configuration
  database: z.object({
    path: z.string(),
    backupPath: z.string().optional(),
  }),

  // API Keys
  apiKeys: z.object({
    twitter: z.string().optional(),
    virustotal: z.string().optional(),
    urlvoid: z.string().optional(),
    shodan: z.string().optional(),
    securitytrails: z.string().optional(),
  }),

  // Telegram Configuration
  telegram: z.object({
    enabled: z.boolean(),
    botToken: z.string().optional(),
    chatId: z.string().optional(),
  }),

  // Scanning Configuration
  scanning: z.object({
    defaultConcurrency: z.number().min(1).max(100),
    maxDomainsPerScan: z.number().min(1).max(10000),
    visualAnalysisTimeout: z.number().min(1000).max(120000),
    retryAttempts: z.number().min(0).max(5),
    retryDelay: z.number().min(100).max(10000),
  }),

  // Rate Limiting
  rateLimiting: z.object({
    twitter: z.object({
      requestsPerWindow: z.number(),
      windowMs: z.number(),
    }),
    virustotal: z.object({
      requestsPerMinute: z.number(),
    }),
    general: z.object({
      requestsPerMinute: z.number(),
    }),
  }),

  // Security
  security: z.object({
    dashboardSecret: z.string().optional(),
    corsOrigins: z.array(z.string()),
    sessionTimeout: z.number(),
  }),

  // Features
  features: z.object({
    enableDarkWeb: z.boolean(),
    enableCrypto: z.boolean(),
    enableSocialMedia: z.boolean(),
    enableMobileApps: z.boolean(),
    enableVisualAI: z.boolean(),
    enableThreatIntel: z.boolean(),
    enableLegalAutomation: z.boolean(),
  }),
});

// Build configuration object
const buildConfig = () => {
  return {
    server: {
      port: parseInt(process.env.PORT || '3000', 10),
      host: process.env.HOST || 'localhost',
      env: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
    },

    database: {
      path: process.env.DB_PATH || './data/monitor.db',
      backupPath: process.env.DB_BACKUP_PATH,
    },

    apiKeys: {
      twitter: process.env.TWITTER_API_KEY,
      virustotal: process.env.VIRUSTOTAL_API_KEY,
      urlvoid: process.env.URLVOID_API_KEY,
      shodan: process.env.SHODAN_API_KEY,
      securitytrails: process.env.SECURITYTRAILS_API_KEY,
    },

    telegram: {
      enabled: process.env.ENABLE_TG_ALERT === '1',
      botToken: process.env.TG_BOT_TOKEN,
      chatId: process.env.TG_CHAT_ID,
    },

    scanning: {
      defaultConcurrency: parseInt(process.env.DEFAULT_SCAN_CONCURRENCY || '50', 10),
      maxDomainsPerScan: parseInt(process.env.MAX_DOMAINS_PER_SCAN || '500', 10),
      visualAnalysisTimeout: parseInt(process.env.VISUAL_ANALYSIS_TIMEOUT || '30000', 10),
      retryAttempts: parseInt(process.env.RETRY_ATTEMPTS || '3', 10),
      retryDelay: parseInt(process.env.RETRY_DELAY || '1000', 10),
    },

    rateLimiting: {
      twitter: {
        requestsPerWindow: 300,
        windowMs: 15 * 60 * 1000, // 15 minutes
      },
      virustotal: {
        requestsPerMinute: 4,
      },
      general: {
        requestsPerMinute: 60,
      },
    },

    security: {
      dashboardSecret: process.env.DASHBOARD_SECRET,
      corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
      sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600000', 10), // 1 hour
    },

    features: {
      enableDarkWeb: process.env.ENABLE_DARKWEB !== 'false',
      enableCrypto: process.env.ENABLE_CRYPTO !== 'false',
      enableSocialMedia: process.env.ENABLE_SOCIAL !== 'false',
      enableMobileApps: process.env.ENABLE_MOBILE !== 'false',
      enableVisualAI: process.env.ENABLE_VISUAL_AI !== 'false',
      enableThreatIntel: process.env.ENABLE_THREAT_INTEL !== 'false',
      enableLegalAutomation: process.env.ENABLE_LEGAL !== 'false',
    },
  };
};

// Validate and export configuration
let config: z.infer<typeof configSchema>;

try {
  const rawConfig = buildConfig();
  config = configSchema.parse(rawConfig);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Configuration validation failed:');
    console.error(error.errors);
    process.exit(1);
  }
  throw error;
}

// Helper functions
export const isProduction = () => config.server.env === 'production';
export const isDevelopment = () => config.server.env === 'development';
export const isTest = () => config.server.env === 'test';

export const hasApiKey = (service: keyof typeof config.apiKeys): boolean => {
  return !!config.apiKeys[service];
};

export const isFeatureEnabled = (feature: keyof typeof config.features): boolean => {
  return config.features[feature];
};

// Log configuration status (only in development)
if (isDevelopment()) {
  console.log('📋 Configuration loaded:');
  console.log(`  Environment: ${config.server.env}`);
  console.log(`  Port: ${config.server.port}`);
  console.log(`  Database: ${config.database.path}`);
  console.log(`  API Keys configured: ${Object.entries(config.apiKeys).filter(([, v]) => v).map(([k]) => k).join(', ') || 'none'}`);
  console.log(`  Features enabled: ${Object.entries(config.features).filter(([, v]) => v).map(([k]) => k).join(', ')}`);
}

export default config;