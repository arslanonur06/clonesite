import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Shield, 
  Smartphone, 
  Bitcoin, 
  Eye, 
  AlertTriangle,
  TrendingUp,
  Globe,
  Zap
} from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';

interface DashboardMetrics {
  totalScans: number;
  activeThreats: number;
  domainsMonitored: number;
  riskScore: number;
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalScans: 0,
    activeThreats: 0,
    domainsMonitored: 0,
    riskScore: 0
  });
  
  const { isConnected, lastMessage } = useWebSocket();

  useEffect(() => {
    // Fetch initial metrics
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lastMessage?.type === 'metrics_update') {
      setMetrics(lastMessage.data);
    } else if (lastMessage?.type === 'scan_complete') {
      // Refresh metrics when any scan completes
      fetch('/api/metrics')
        .then(res => res.json())
        .then(data => setMetrics(data))
        .catch(console.error);
    }
  }, [lastMessage]);

  const features = [
    {
      name: 'Domain Monitoring',
      description: 'Typosquatting detection across 50+ TLDs with advanced pattern matching',
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      capabilities: ['2000+ patterns', '50+ TLDs', 'Real-time CT logs']
    },
    {
      name: 'Visual AI Detection',
      description: 'Computer vision-powered logo and design similarity analysis',
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      capabilities: ['Logo similarity', 'Color analysis', 'Layout detection']
    },
    {
      name: 'Mobile App Monitoring',
      description: 'iOS and Android app store monitoring with icon comparison',
      icon: Smartphone,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      capabilities: ['iOS App Store', 'Google Play', 'Icon similarity']
    },
    {
      name: 'Cryptocurrency Threats',
      description: 'Fake exchanges, phishing wallets, and blockchain domain monitoring',
      icon: Bitcoin,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      capabilities: ['Fake exchanges', 'Wallet phishing', 'ICO scams']
    },
    {
      name: 'Dark Web Monitoring',
      description: 'Underground forums, credential leaks, and Tor network scanning',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      capabilities: ['Tor network', 'Breach data', 'Forums']
    },
    {
      name: 'Threat Intelligence',
      description: 'Multi-source intelligence with VirusTotal, URLVoid, and Shodan',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      capabilities: ['VirusTotal', 'URLVoid', 'Shodan']
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl text-white">
        <h1 className="text-4xl font-bold mb-4">
          Advanced Brand Protection
        </h1>
        <p className="text-xl mb-8 opacity-90">
          Enterprise-grade monitoring with AI-powered threat detection
        </p>
        <div className="flex space-x-4">
          <Link
            to="/scan"
            className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <Search className="w-5 h-5 mr-2" />
            Start Brand Scan
          </Link>
          <Link
            to="/igaming-tools"
            className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
          >
            🎰 iGaming Tools
          </Link>
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Scans</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalScans}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Threats</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.activeThreats}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Domains Monitored</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.domainsMonitored}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Risk Score</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.riskScore}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Protection Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.name} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className={`p-3 ${feature.bgColor} rounded-lg`}>
                    <IconComponent className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      {feature.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {feature.capabilities.map((capability) => (
                        <span
                          key={capability}
                          className="badge badge-info text-xs"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/scan"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <Search className="w-5 h-5 text-primary-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">New Brand Scan</div>
              <div className="text-sm text-gray-600">Monitor any brand or domain</div>
            </div>
          </Link>
          
          <button 
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            onClick={() => {
              // Show analytics modal or navigate to analytics page
              alert('Analytics Dashboard: Feature coming soon! This will show threat trends, risk scores over time, and detailed security metrics for iGaming operators.');
            }}
          >
            <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">View Analytics</div>
              <div className="text-sm text-gray-600">Threat trends and insights</div>
            </div>
          </button>
          
          <button 
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
            onClick={async () => {
              try {
                const response = await fetch('/api/scans');
                const scans = await response.json();
                const activeThreats = scans.filter((s: any) => s.status === 'completed').length;
                alert(`Active Monitoring Status:\n\n• Total Scans: ${scans.length}\n• Completed Scans: ${activeThreats}\n• Current Risk Level: ${activeThreats > 3 ? 'HIGH' : activeThreats > 1 ? 'MEDIUM' : 'LOW'}\n\nFor detailed alerts, check individual scan results.`);
              } catch (error) {
                alert('Unable to fetch current alerts. Please try again.');
              }
            }}
          >
            <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Active Alerts</div>
              <div className="text-sm text-gray-600">Recent threat notifications</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
