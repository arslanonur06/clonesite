interface TelegramBot {
  id: string;
  name: string;
  username: string;
  token: string;
  isActive: boolean;
  createdAt: string;
}

interface TelegramChannel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  botId: string;
  chatId: string;
  createdAt: string;
}

interface Notification {
  id: string;
  type: 'threat' | 'scan_complete' | 'error' | 'warning';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  recipients: string[];
  sentAt: string;
  status: 'pending' | 'sent' | 'failed';
}

class TelegramManager {
  private bots: Map<string, TelegramBot> = new Map();
  private channels: Map<string, TelegramChannel> = new Map();
  private notifications: Notification[] = [];

  getBots(): TelegramBot[] {
    return Array.from(this.bots.values());
  }

  async createBot(name: string, username: string, token: string): Promise<TelegramBot> {
    const botId = `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const bot: TelegramBot = {
      id: botId,
      name,
      username,
      token,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    this.bots.set(botId, bot);
    
    console.log(`🤖 Created Telegram bot: ${name} (@${username})`);
    return bot;
  }

  async sendMessage(botId: string, chatId: string, message: string, options?: any): Promise<boolean> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error('Bot not found');
    }

    try {
      // In a real implementation, you would use the Telegram Bot API
      // For now, we'll simulate the API call
      console.log(`📤 Sending message via bot ${bot.name} to chat ${chatId}:`);
      console.log(`   ${message}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  async sendNotification(notification: Omit<Notification, 'id' | 'sentAt' | 'status'>): Promise<string> {
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newNotification: Notification = {
      id: notificationId,
      ...notification,
      sentAt: new Date().toISOString(),
      status: 'pending'
    };

    this.notifications.push(newNotification);

    // Send to all active bots
    const activeBots = Array.from(this.bots.values()).filter(bot => bot.isActive);
    const channels = Array.from(this.channels.values());

    let successCount = 0;
    for (const bot of activeBots) {
      for (const channel of channels) {
        if (channel.botId === bot.id) {
          const success = await this.sendMessage(
            bot.id,
            channel.chatId,
            `🚨 *${notification.title}*\n\n${notification.message}`,
            { parse_mode: 'Markdown' }
          );
          if (success) successCount++;
        }
      }
    }

    newNotification.status = successCount > 0 ? 'sent' : 'failed';
    
    console.log(`📢 Notification sent: ${notification.title} (${successCount} channels)`);
    return notificationId;
  }

  getNotifications(limit: number = 50): Notification[] {
    return this.notifications
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
      .slice(0, limit);
  }

  async createChannel(name: string, description: string, type: 'public' | 'private' = 'private'): Promise<TelegramChannel> {
    const channelId = `channel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const chatId = `@${name.toLowerCase().replace(/\s+/g, '_')}`;
    
    // Use the first active bot for the channel
    const activeBot = Array.from(this.bots.values()).find(bot => bot.isActive);
    if (!activeBot) {
      throw new Error('No active bots available');
    }

    const channel: TelegramChannel = {
      id: channelId,
      name,
      description,
      type,
      botId: activeBot.id,
      chatId,
      createdAt: new Date().toISOString()
    };

    this.channels.set(channelId, channel);
    
    console.log(`📺 Created Telegram channel: ${name} (${type})`);
    return channel;
  }

  getChannels(): TelegramChannel[] {
    return Array.from(this.channels.values());
  }

  // Utility methods for different notification types
  async sendThreatAlert(threat: any): Promise<string> {
    return this.sendNotification({
      type: 'threat',
      title: '🚨 Security Threat Detected',
      message: `Threat detected: ${threat.type}\nDomain: ${threat.domain}\nRisk Level: ${threat.riskLevel}`,
      priority: threat.riskLevel === 'high' ? 'critical' : 'high',
      recipients: ['default']
    });
  }

  async sendScanComplete(scanId: string, brand: string, summary: any): Promise<string> {
    return this.sendNotification({
      type: 'scan_complete',
      title: '✅ Scan Completed',
      message: `Brand protection scan completed for ${brand}\n\n` +
               `Total Domains: ${summary.totalDomains}\n` +
               `Active Domains: ${summary.activeDomains}\n` +
               `High Risk: ${summary.highRisk}\n` +
               `Clones Found: ${summary.clones}`,
      priority: 'medium',
      recipients: ['default']
    });
  }

  async sendErrorAlert(error: string, context?: string): Promise<string> {
    return this.sendNotification({
      type: 'error',
      title: '❌ System Error',
      message: `Error: ${error}${context ? `\nContext: ${context}` : ''}`,
      priority: 'high',
      recipients: ['default']
    });
  }

  async sendWarningAlert(warning: string, context?: string): Promise<string> {
    return this.sendNotification({
      type: 'warning',
      title: '⚠️ Warning',
      message: `Warning: ${warning}${context ? `\nContext: ${context}` : ''}`,
      priority: 'medium',
      recipients: ['default']
    });
  }
}

export const telegramManager = new TelegramManager();
