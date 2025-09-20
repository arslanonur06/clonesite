import React, { useState, useEffect } from 'react';
import {
  Shield, Search, Globe, Smartphone, Bitcoin, Eye,
  AlertTriangle, Gavel, Share2, ArrowRight, X,
  CheckCircle, Clock, Loader2, ChevronDown, ChevronUp,
  FileText, Download, RefreshCw, Info, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../hooks/useWebSocket';

interface ScanFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  estimatedTime: string;
  enabled: boolean;
  color: string;
}

interface ScanResult {
  scanId: string;
  brand: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  results: any;
  summary: {
    totalDomains: number;
    activeDomains: number;
    clones: number;
    highRisk: number;
  };
}

const BrandScanner: React.FC = () => {
  const navigate = useNavigate();
  const { sendMessage, lastMessage } = useWebSocket();
  
  const [brand, setBrand] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [sequencePattern, setSequencePattern] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [expandedResults, setExpandedResults] = useState<string[]>([]);
  const [scanFeatures, setScanFeatures] = useState<ScanFeature[]>([
    {
      id: 'typosquatting',
      name: 'Domain Typosquatting',
      description: '2000+ pattern variations across 50+ TLDs',
      icon: <Globe className="w-5 h-5" />,
      estimatedTime: '2-5 min',
      enabled: true,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'visual-ai',
      name: 'Visual AI Detection',
      description: 'Logo similarity and design clone detection',
      icon: <Eye className="w-5 h-5" />,
      estimatedTime: '5-10 min',
      enabled: true,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'mobile-apps',
      name: 'Mobile App Monitoring',
      description: 'iOS and Android app store surveillance',
      icon: <Smartphone className="w-5 h-5" />,
      estimatedTime: '3-7 min',
      enabled: true,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency Threats',
      description: 'Fake exchanges and wallet phishing',
      icon: <Bitcoin className="w-5 h-5" />,
      estimatedTime: '2-4 min',
      enabled: false,
      color: 'from-amber-500 to-amber-600'
    },
    {
      id: 'dark-web',
      name: 'Dark Web Monitoring',
      description: 'Underground forums and credential leaks',
      icon: <AlertTriangle className="w-5 h-5" />,
      estimatedTime: '5-15 min',
      enabled: false,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'threat-intel',
      name: 'Threat Intelligence',
      description: 'Multi-source reputation analysis',
      icon: <Search className="w-5 h-5" />,
      estimatedTime: '1-3 min',
      enabled: true,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'social-media',
      name: 'Social Media Threats',
      description: 'Twitter and Telegram monitoring',
      icon: <Share2 className="w-5 h-5" />,
      estimatedTime: '2-5 min',
      enabled: false,
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'legal',
      name: 'Legal Automation',
      description: 'Automated takedown preparation',
      icon: <Gavel className="w-5 h-5" />,
      estimatedTime: '1-2 min',
      enabled: false,
      color: 'from-gray-600 to-gray-700'
    }
  ]);

  useEffect(() => {
    if (lastMessage && lastMessage.type === 'scan_progress') {
      updateScanProgress(lastMessage.data);
    } else if (lastMessage && lastMessage.type === 'scan_complete') {
      handleScanComplete(lastMessage.data);
    }
  }, [lastMessage]);

  const toggleFeature = (featureId: string) => {
    setScanFeatures(prev =>
      prev.map(f => f.id === featureId ? { ...f, enabled: !f.enabled } : f)
    );
  };

  const selectAllFeatures = () => {
    setScanFeatures(prev => prev.map(f => ({ ...f, enabled: true })));
  };

  const deselectAllFeatures = () => {
    setScanFeatures(prev => prev.map(f => ({ ...f, enabled: false })));
  };

  const startScan = async () => {
    if (!brand || !baseUrl) {
      alert('Please enter both brand name and website URL');
      return;
    }

    const enabledFeatures = scanFeatures.filter(f => f.enabled).map(f => f.id);
    if (enabledFeatures.length === 0) {
      alert('Please select at least one scanning feature');
      return;
    }

    setIsScanning(true);
    setShowResults(false);

    try {
      const response = await fetch('/api/scan/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand,
          baseUrl,
          features: enabledFeatures,
          sequence: sequencePattern || undefined,
          logoUrl: logoUrl || undefined,
          range: 10,
          ctDays: 30
        })
      });

      const data = await response.json();
      
      if (data.scanId) {
        setCurrentScan({
          scanId: data.scanId,
          brand,
          status: 'running',
          progress: 0,
          results: {},
          summary: {
            totalDomains: 0,
            activeDomains: 0,
            clones: 0,
            highRisk: 0
          }
        });
        setShowResults(true);
      }
    } catch (error) {
      console.error('Failed to start scan:', error);
      alert('Failed to start scan. Please try again.');
      setIsScanning(false);
    }
  };

  const updateScanProgress = (data: any) => {
    if (currentScan && data.scanId === currentScan.scanId) {
      setCurrentScan(prev => prev ? {
        ...prev,
        progress: data.progress,
        status: data.status,
        results: data.results || prev.results,
        summary: data.summary || prev.summary
      } : null);
    }
  };

  const handleScanComplete = (data: any) => {
    if (currentScan && data.scanId === currentScan.scanId) {
      setIsScanning(false);
      loadScanResults(data.scanId);
    }
  };

  const loadScanResults = async (scanId: string) => {
    try {
      const response = await fetch(`/api/scan/${scanId}`);
      const data = await response.json();
      setCurrentScan(data);
    } catch (error) {
      console.error('Failed to load scan results:', error);
    }
  };

  const exportReport = async () => {
    if (!currentScan) return;

    try {
      const response = await fetch(`/api/scan/${currentScan.scanId}/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentScan.brand}-report-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export report:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  const toggleResultSection = (section: string) => {
    setExpandedResults(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-4"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">Brand Scanner</h1>
                  <p className="text-xs text-gray-500">Comprehensive brand protection analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Scan Configuration</h2>
              
              {/* Brand Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g., betfair"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={isScanning}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Official Website URL *
                  </label>
                  <input
                    type="url"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={isScanning}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sequence Pattern
                    <span className="ml-2 text-xs text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={sequencePattern}
                    onChange={(e) => setSequencePattern(e.target.value)}
                    placeholder="e.g., brand1256.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={isScanning}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                    <span className="ml-2 text-xs text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={isScanning}
                  />
                </div>
              </div>

              {/* Start Scan Button */}
              <button
                onClick={startScan}
                disabled={isScanning || !brand || !baseUrl}
                className={`w-full mt-6 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                  isScanning || !brand || !baseUrl
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                }`}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Start Scan</span>
                  </>
                )}
              </button>

              {/* Feature Selection Controls */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Features ({scanFeatures.filter(f => f.enabled).length}/{scanFeatures.length})
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={selectAllFeatures}
                      className="text-xs text-blue-600 hover:text-blue-700"
                      disabled={isScanning}
                    >
                      Select All
                    </button>
                    <span className="text-gray-400">|</span>
                    <button
                      onClick={deselectAllFeatures}
                      className="text-xs text-gray-600 hover:text-gray-700"
                      disabled={isScanning}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features & Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Features Grid */}
            {!showResults && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Scanning Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scanFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      onClick={() => !isScanning && toggleFeature(feature.id)}
                      className={`bg-white rounded-xl p-4 cursor-pointer transition-all ${
                        feature.enabled
                          ? 'ring-2 ring-blue-500 shadow-lg'
                          : 'hover:shadow-md'
                      } ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color} text-white`}>
                          {feature.icon}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          feature.enabled
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {feature.enabled && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900 mt-3">{feature.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      <div className="flex items-center mt-3 text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {feature.estimatedTime}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scan Results */}
            {showResults && currentScan && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Scan Results</h2>
                  <div className="flex items-center space-x-3">
                    {currentScan.status === 'completed' && (
                      <button
                        onClick={exportReport}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export PDF</span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowResults(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {currentScan.status === 'running' && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Scanning Progress</span>
                      <span className="text-sm text-gray-600">{currentScan.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${currentScan.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-blue-600">{currentScan.summary.totalDomains}</p>
                    <p className="text-sm text-gray-600">Total Domains</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-green-600">{currentScan.summary.activeDomains}</p>
                    <p className="text-sm text-gray-600">Active Domains</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-amber-600">{currentScan.summary.clones}</p>
                    <p className="text-sm text-gray-600">Clones Detected</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-red-600">{currentScan.summary.highRisk}</p>
                    <p className="text-sm text-gray-600">High Risk</p>
                  </div>
                </div>

                {/* Detailed Results */}
                {currentScan.status === 'completed' && (
                  <div className="space-y-4">
                    {/* Domain Results */}
                    {currentScan.results.domains && currentScan.results.domains.length > 0 && (
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleResultSection('domains')}
                          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                        >
                          <span className="font-medium text-gray-900">
                            Domain Threats ({currentScan.results.domains.length})
                          </span>
                          {expandedResults.includes('domains') ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        {expandedResults.includes('domains') && (
                          <div className="p-4 max-h-96 overflow-y-auto">
                            <div className="space-y-2">
                              {currentScan.results.domains.slice(0, 10).map((domain: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div>
                                    <p className="font-medium text-gray-900">{domain.domain}</p>
                                    <p className="text-sm text-gray-500">{domain.reason}</p>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    domain.riskLevel === 'high'
                                      ? 'bg-red-100 text-red-700'
                                      : domain.riskLevel === 'medium'
                                      ? 'bg-amber-100 text-amber-700'
                                      : 'bg-green-100 text-green-700'
                                  }`}>
                                    {domain.riskLevel}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Other result sections can be added here */}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandScanner;