import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Shield, 
  DollarSign, 
  Play, 
  Users, 
  AlertTriangle, 
  Globe, 
  Activity, 
  Lock,
  Award,
  FileText,
  TrendingUp,
  BarChart3,
  Eye,
  UserCheck,
  Zap,
  Download,
  Search,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  endpoint: string;
  status?: 'idle' | 'running' | 'completed' | 'error';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
}

const ModernIGamingTools: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [brandInput, setBrandInput] = useState('');
  const [domainsInput, setDomainsInput] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [tools, setTools] = useState<Tool[]>([]);
  const [results, setResults] = useState<any>({});
  const [runningTools, setRunningTools] = useState<Set<string>>(new Set());
  const [completedTools, setCompletedTools] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'all', name: 'All Tools', count: 25, color: 'bg-gray-500' },
    { id: 'Marketing', name: 'Marketing', count: 3, color: 'bg-blue-500' },
    { id: 'Compliance', name: 'Compliance', count: 6, color: 'bg-green-500' },
    { id: 'Financial', name: 'Financial', count: 4, color: 'bg-yellow-500' },
    { id: 'Security', name: 'Security', count: 3, color: 'bg-red-500' },
    { id: 'Analytics', name: 'Analytics', count: 4, color: 'bg-purple-500' },
    { id: 'Operations', name: 'Operations', count: 3, color: 'bg-indigo-500' },
    { id: 'VIP', name: 'VIP', count: 2, color: 'bg-amber-500' }
  ];

  const professionalTools: Tool[] = [
    // Marketing & Brand Protection
    { id: 'affiliate-monitor', name: 'Affiliate Monitor', description: 'Monitor suspicious affiliate activities and player tracking', icon: Target, category: 'Marketing', endpoint: 'affiliate-monitor', priority: 'high', estimatedTime: '2-3 min' },
    { id: 'marketing-campaigns', name: 'Campaign Analytics', description: 'Analyze marketing campaign performance and ROI', icon: TrendingUp, category: 'Marketing', endpoint: 'marketing-campaigns', priority: 'medium', estimatedTime: '1-2 min' },
    { id: 'bonus-abuse', name: 'Bonus Abuse Detection', description: 'Detect and prevent bonus hunting and abuse patterns', icon: AlertTriangle, category: 'Marketing', endpoint: 'bonus-abuse', priority: 'high', estimatedTime: '3-4 min' },
    
    // Compliance & Legal
    { id: 'license-verify', name: 'License Verification', description: 'Verify gaming licenses and regulatory compliance', icon: Award, category: 'Compliance', endpoint: 'license-verify', priority: 'high', estimatedTime: '1-2 min' },
    { id: 'compliance-monitor', name: 'Compliance Monitor', description: 'Monitor regulatory compliance across jurisdictions', icon: FileText, category: 'Compliance', endpoint: 'compliance-monitor', priority: 'high', estimatedTime: '2-3 min' },
    { id: 'kyc-verification', name: 'KYC Verification', description: 'Automated KYC document verification and screening', icon: UserCheck, category: 'Compliance', endpoint: 'kyc-verification', priority: 'high', estimatedTime: '1-2 min' },
    { id: 'aml-monitoring', name: 'AML Monitoring', description: 'Anti-Money Laundering transaction monitoring', icon: Shield, category: 'Compliance', endpoint: 'aml-monitoring', priority: 'high', estimatedTime: '3-5 min' },
    { id: 'responsible-gaming', name: 'Responsible Gaming', description: 'Monitor responsible gaming compliance and player protection', icon: UserCheck, category: 'Compliance', endpoint: 'responsible-gaming', priority: 'medium', estimatedTime: '2-3 min' },
    { id: 'geo-compliance', name: 'Geo-Compliance', description: 'Geographic restrictions and compliance monitoring', icon: Globe, category: 'Compliance', endpoint: 'geo-compliance', priority: 'medium', estimatedTime: '1-2 min' },
    
    // Financial & Risk
    { id: 'payment-analysis', name: 'Payment Analysis', description: 'Analyze payment methods and transaction patterns', icon: DollarSign, category: 'Financial', endpoint: 'payment-analysis', priority: 'high', estimatedTime: '2-4 min' },
    { id: 'transaction-monitoring', name: 'Transaction Monitor', description: 'Real-time transaction monitoring and alerts', icon: DollarSign, category: 'Financial', endpoint: 'transaction-monitoring', priority: 'high', estimatedTime: '3-5 min' },
    { id: 'chargeback-prevention', name: 'Chargeback Prevention', description: 'Prevent and manage payment chargebacks', icon: Shield, category: 'Financial', endpoint: 'chargeback-prevention', priority: 'medium', estimatedTime: '2-3 min' },
    { id: 'risk-assessment', name: 'Risk Assessment', description: 'Comprehensive player and operational risk assessment', icon: AlertTriangle, category: 'Financial', endpoint: 'risk-assessment', priority: 'high', estimatedTime: '4-6 min' },
    
    // Security & Fraud
    { id: 'fraud-detection', name: 'Fraud Detection', description: 'AI-powered fraud detection and prevention', icon: Shield, category: 'Security', endpoint: 'fraud-detection', priority: 'high', estimatedTime: '3-5 min' },
    { id: 'security-analysis', name: 'Security Analysis', description: 'Comprehensive security vulnerability assessment', icon: Lock, category: 'Security', endpoint: 'security-analysis', priority: 'medium', estimatedTime: '5-7 min' },
    { id: 'game-fairness', name: 'Game Fairness', description: 'Verify game fairness and RTP compliance', icon: BarChart3, category: 'Security', endpoint: 'game-fairness', priority: 'medium', estimatedTime: '3-4 min' },
    
    // Analytics & Performance
    { id: 'player-behavior', name: 'Player Analytics', description: 'Advanced player behavior and segmentation analysis', icon: Users, category: 'Analytics', endpoint: 'player-behavior', priority: 'medium', estimatedTime: '3-4 min' },
    { id: 'game-performance', name: 'Game Performance', description: 'Game performance metrics and optimization insights', icon: BarChart3, category: 'Analytics', endpoint: 'game-performance', priority: 'medium', estimatedTime: '2-3 min' },
    { id: 'player-segmentation', name: 'Player Segmentation', description: 'Advanced player segmentation and targeting', icon: Users, category: 'Analytics', endpoint: 'player-segmentation', priority: 'low', estimatedTime: '3-4 min' },
    { id: 'odds-manipulation', name: 'Odds Analysis', description: 'Sports betting odds analysis and manipulation detection', icon: Activity, category: 'Analytics', endpoint: 'odds-manipulation', priority: 'medium', estimatedTime: '2-3 min' },
    
    // Operations & Management
    { id: 'tournaments', name: 'Tournament Management', description: 'Manage tournaments and competitive events', icon: Award, category: 'Operations', endpoint: 'tournaments', priority: 'low', estimatedTime: '1-2 min' },
    { id: 'live-dealers', name: 'Live Dealer Management', description: 'Monitor and manage live dealer operations', icon: Eye, category: 'Operations', endpoint: 'live-dealers', priority: 'low', estimatedTime: '1-2 min' },
    { id: 'customer-support', name: 'Support Quality', description: 'Customer support quality assessment and optimization', icon: Users, category: 'Operations', endpoint: 'customer-support', priority: 'medium', estimatedTime: '2-3 min' },
    
    // VIP & Loyalty
    { id: 'vip-players', name: 'VIP Management', description: 'VIP player management and tier optimization', icon: UserCheck, category: 'VIP', endpoint: 'vip-players', priority: 'medium', estimatedTime: '2-3 min' },
    { id: 'loyalty-programs', name: 'Loyalty Programs', description: 'Loyalty program optimization and management', icon: Award, category: 'VIP', endpoint: 'loyalty-programs', priority: 'low', estimatedTime: '1-2 min' },
    
    // Content Management
    { id: 'game-providers', name: 'Game Providers', description: 'Game provider verification and content analysis', icon: Play, category: 'Operations', endpoint: 'game-providers', priority: 'low', estimatedTime: '2-3 min' }
  ];

  useEffect(() => {
    setTools(professionalTools);
  }, []);

  const filteredTools = tools.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const runTool = async (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    if (!tool) return;

    setRunningTools(prev => new Set([...prev, toolId]));
    
    try {
      let requestBody: any = {};
      
      // Determine request body based on tool requirements
      if (['affiliate-monitor', 'bonus-abuse', 'marketing-campaigns', 'player-behavior', 'risk-assessment', 'kyc-verification', 'aml-monitoring', 'transaction-monitoring'].includes(toolId)) {
        if (!brandInput.trim()) {
          alert('Please enter a brand name first');
          return;
        }
        requestBody = { brand: brandInput.trim() };
        
        if (toolId === 'player-behavior') {
          requestBody.playerId = `PLAYER_${Math.floor(Math.random() * 10000)}`;
        }
      } else {
        const domains = domainsInput.split('\n').filter(d => d.trim());
        if (domains.length === 0 && !['tournaments', 'live-dealers', 'vip-players', 'loyalty-programs', 'game-fairness', 'player-segmentation', 'compliance-monitor', 'fraud-detection', 'chargeback-prevention'].includes(toolId)) {
          alert('Please enter at least one domain');
          return;
        }
        requestBody = { domains };
      }

      const response = await fetch(`/api/igaming/${tool.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const result = await response.json();
        setResults((prev: any) => ({ ...prev, [toolId]: result }));
        setCompletedTools(prev => new Set([...prev, toolId]));
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error(`Tool ${toolId} failed:`, error);
      alert(`Tool failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setRunningTools(prev => {
        const newSet = new Set(prev);
        newSet.delete(toolId);
        return newSet;
      });
    }
  };

  const runAllTools = async () => {
    const toolsToRun = filteredTools.filter(tool => 
      !runningTools.has(tool.id) && !completedTools.has(tool.id)
    );
    
    for (let i = 0; i < toolsToRun.length; i++) {
      setTimeout(() => runTool(toolsToRun[i].id), i * 1000);
    }
  };

  const exportResults = async () => {
    try {
      const response = await fetch('/api/igaming/export-comprehensive-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: brandInput,
          results: results,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `igaming-comprehensive-report-${brandInput || 'analysis'}-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const getStatusIcon = (toolId: string) => {
    if (runningTools.has(toolId)) {
      return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
    }
    if (completedTools.has(toolId)) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <div className="w-4 h-4 rounded-full bg-gray-300"></div>;
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🎰 All iGaming Tools (26)</h1>
              <p className="text-gray-600 mt-1">Professional enterprise tools for iGaming operators</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span>{completedTools.size} Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                <span>{runningTools.size} Running</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                <span>{tools.length - completedTools.size - runningTools.size} Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Brand Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., betfair, 888casino"
                value={brandInput}
                onChange={(e) => setBrandInput(e.target.value)}
              />
            </div>

            {/* Domains Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Domains</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                placeholder="example1.com&#10;example2.com"
                value={domainsInput}
                onChange={(e) => setDomainsInput(e.target.value)}
              />
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
              <input
                type="url"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={runAllTools}
                disabled={runningTools.size > 0}
                className="btn btn-primary flex items-center justify-center"
              >
                <Zap className="w-4 h-4 mr-2" />
                Run All Tools
              </button>
              <button
                onClick={exportResults}
                disabled={completedTools.size === 0}
                className="btn btn-secondary flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tools..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tools Grid - Clean Responsive Layout */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
              Available Tools ({filteredTools.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {filteredTools.map(tool => {
            const IconComponent = tool.icon;
            const isRunning = runningTools.has(tool.id);
            const isCompleted = completedTools.has(tool.id);
            
            return (
              <div
                key={tool.id}
                className={`bg-white rounded-lg border hover:shadow-md transition-all duration-200 ${
                  isCompleted ? 'border-green-300 bg-green-50' : 
                  isRunning ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
                }`}
              >
                <div className="p-4 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-md ${
                      isCompleted ? 'bg-green-100' :
                      isRunning ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        isCompleted ? 'text-green-600' :
                        isRunning ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tool.priority === 'high' ? 'bg-red-100 text-red-800' :
                        tool.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {tool.priority}
                      </span>
                      {getStatusIcon(tool.id)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">{tool.name}</h3>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">{tool.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="bg-gray-100 px-2 py-1 rounded">{tool.category}</span>
                      <span>⏱️ {tool.estimatedTime}</span>
                    </div>

                    {/* Results Preview */}
                    {isCompleted && results[tool.id] && (
                      <div className="bg-green-50 border border-green-200 rounded p-2 mb-3">
                        <div className="text-xs text-green-800 font-medium">✅ Completed</div>
                        <div className="text-xs text-green-700">
                          {results[tool.id].totalChecked || 
                           results[tool.id].totalAnalyzed || 
                           results[tool.id].alerts?.length ||
                           results[tool.id].programs?.length ||
                           results[tool.id].games?.length ||
                           'Analysis complete'} items processed
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => runTool(tool.id)}
                    disabled={isRunning}
                    className={`w-full py-2 px-3 rounded-md font-medium text-sm transition-all ${
                      isCompleted 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : isRunning 
                        ? 'bg-yellow-100 text-yellow-700 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isRunning ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                        Running...
                      </div>
                    ) : isCompleted ? (
                      <div className="flex items-center justify-center">
                        <Eye className="w-4 h-4 mr-2" />
                        View Results
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Play className="w-4 h-4 mr-2" />
                        Run Tool
                      </div>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{tools.length}</div>
              <div className="text-sm text-gray-600">Total Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{completedTools.size}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{runningTools.size}</div>
              <div className="text-sm text-gray-600">Running</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round((completedTools.size / tools.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedTools.size / tools.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernIGamingTools;
