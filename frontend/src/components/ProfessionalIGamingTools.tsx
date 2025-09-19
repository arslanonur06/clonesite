import React, { useState, useEffect } from 'react';
import { 
  Shield, Target, TrendingUp, Award, UserCheck, CreditCard, Users, 
  Globe, Activity, MessageCircle, Lock, BarChart3, AlertTriangle,
  Search, Eye, Play as PlayIcon, Clock, CheckCircle,
  Zap, Star, Crown, DollarSign, FileText, Gamepad2, Eye as EyeIcon, X
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  endpoint: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  features: string[];
}

const ProfessionalIGamingTools: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [brandInput, setBrandInput] = useState('');
  const [domainsInput, setDomainsInput] = useState('');
  const [tools, setTools] = useState<Tool[]>([]);
  const [results, setResults] = useState<any>({});
  const [runningTools, setRunningTools] = useState<Set<string>>(new Set());
  const [completedTools, setCompletedTools] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState('');

  const categories = [
    { id: 'all', name: 'All Tools', count: 26, color: 'bg-gradient-to-r from-blue-500 to-purple-600' },
    { id: 'Marketing', name: 'Marketing', count: 3, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { id: 'Compliance', name: 'Compliance', count: 4, color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { id: 'Financial', name: 'Financial', count: 4, color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    { id: 'Security', name: 'Security', count: 3, color: 'bg-gradient-to-r from-red-500 to-pink-500' },
    { id: 'Analytics', name: 'Analytics', count: 4, color: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
    { id: 'Operations', name: 'Operations', count: 3, color: 'bg-gradient-to-r from-indigo-500 to-blue-500' },
    { id: 'VIP', name: 'VIP', count: 2, color: 'bg-gradient-to-r from-amber-500 to-yellow-500' }
  ];

  const professionalTools: Tool[] = [
    // Marketing & Brand Protection
    { 
      id: 'affiliate-monitor', 
      name: 'Affiliate Monitor', 
      description: 'Monitor suspicious affiliate activities and player tracking', 
      icon: Target, 
      category: 'Marketing', 
      endpoint: 'affiliate-monitor', 
      priority: 'high', 
      estimatedTime: '2-3 min',
      status: 'idle',
      features: ['Real-time monitoring', 'Player tracking', 'DMCA automation']
    },
    { 
      id: 'marketing-campaigns', 
      name: 'Campaign Analytics', 
      description: 'Analyze marketing campaign performance and ROI', 
      icon: TrendingUp, 
      category: 'Marketing', 
      endpoint: 'marketing-campaigns', 
      priority: 'medium', 
      estimatedTime: '1-2 min',
      status: 'idle',
      features: ['ROI analysis', 'Performance metrics', 'A/B testing']
    },
    { 
      id: 'bonus-abuse', 
      name: 'Bonus Abuse Detection', 
      description: 'Detect and prevent bonus hunting and abuse patterns', 
      icon: AlertTriangle, 
      category: 'Marketing', 
      endpoint: 'bonus-abuse', 
      priority: 'high', 
      estimatedTime: '3-4 min',
      status: 'idle',
      features: ['Pattern detection', 'Risk scoring', 'Automated alerts']
    },
    
    // Compliance & Legal
    { 
      id: 'license-verify', 
      name: 'License Verification', 
      description: 'Verify gaming licenses and regulatory compliance', 
      icon: Award, 
      category: 'Compliance', 
      endpoint: 'license-verify', 
      priority: 'high', 
      estimatedTime: '1-2 min',
      status: 'idle',
      features: ['License validation', 'Jurisdiction check', 'Compliance reports']
    },
    { 
      id: 'compliance-monitor', 
      name: 'Compliance Monitor', 
      description: 'Monitor regulatory compliance across jurisdictions', 
      icon: FileText, 
      category: 'Compliance', 
      endpoint: 'compliance-monitor', 
      priority: 'high', 
      estimatedTime: '2-3 min',
      status: 'idle',
      features: ['Multi-jurisdiction', 'Real-time alerts', 'Audit trails']
    },
    { 
      id: 'kyc-verification', 
      name: 'KYC Verification', 
      description: 'Automated KYC document verification and screening', 
      icon: UserCheck, 
      category: 'Compliance', 
      endpoint: 'kyc-verification', 
      priority: 'high', 
      estimatedTime: '1-2 min',
      status: 'idle',
      features: ['Document verification', 'Identity screening', 'Risk assessment']
    },
    { 
      id: 'aml-monitoring', 
      name: 'AML Monitoring', 
      description: 'Anti-Money Laundering transaction monitoring', 
      icon: Shield, 
      category: 'Compliance', 
      endpoint: 'aml-monitoring', 
      priority: 'high', 
      estimatedTime: '3-5 min',
      status: 'idle',
      features: ['Transaction analysis', 'Suspicious activity', 'Regulatory reporting']
    },

    // Financial & Risk
    { 
      id: 'payment-analysis', 
      name: 'Payment Analysis', 
      description: 'Analyze payment methods and transaction trends', 
      icon: CreditCard, 
      category: 'Financial', 
      endpoint: 'payment-analysis', 
      priority: 'medium', 
      estimatedTime: '2-3 min',
      status: 'idle',
      features: ['Payment trends', 'Method analysis', 'Fraud detection']
    },
    { 
      id: 'fraud-detection', 
      name: 'Fraud Detection', 
      description: 'Detect and prevent fraudulent activities', 
      icon: Shield, 
      category: 'Security', 
      endpoint: 'fraud-detection', 
      priority: 'high', 
      estimatedTime: '2-4 min',
      status: 'idle',
      features: ['ML algorithms', 'Real-time detection', 'Risk scoring']
    },
    { 
      id: 'risk-assessment', 
      name: 'Risk Assessment', 
      description: 'Comprehensive risk scoring for players and operations', 
      icon: AlertTriangle, 
      category: 'Financial', 
      endpoint: 'risk-assessment', 
      priority: 'high', 
      estimatedTime: '3-5 min',
      status: 'idle',
      features: ['Player scoring', 'Operational risk', 'Predictive analytics']
    },
    { 
      id: 'transaction-monitoring', 
      name: 'Transaction Monitor', 
      description: 'Monitor player transactions for suspicious patterns', 
      icon: DollarSign, 
      category: 'Financial', 
      endpoint: 'transaction-monitoring', 
      priority: 'high', 
      estimatedTime: '2-3 min',
      status: 'idle',
      features: ['Pattern analysis', 'Anomaly detection', 'Real-time alerts']
    },
    { 
      id: 'chargeback-prevention', 
      name: 'Chargeback Prevention', 
      description: 'Analyze and prevent chargebacks', 
      icon: Shield, 
      category: 'Financial', 
      endpoint: 'chargeback-prevention', 
      priority: 'medium', 
      estimatedTime: '2-3 min',
      status: 'idle',
      features: ['Risk scoring', 'Prevention strategies', 'Dispute management']
    },

    // Operations & Management
    { 
      id: 'tournaments', 
      name: 'Tournament Management', 
      description: 'Manage and optimize gaming tournaments', 
      icon: Award, 
      category: 'Operations', 
      endpoint: 'tournaments', 
      priority: 'medium', 
      estimatedTime: '1-2 min',
      status: 'idle',
      features: ['Tournament setup', 'Prize management', 'Player tracking']
    },
    { 
      id: 'live-dealers', 
      name: 'Live Dealer Management', 
      description: 'Monitor and manage live dealer operations', 
      icon: EyeIcon, 
      category: 'Operations', 
      endpoint: 'live-dealers', 
      priority: 'medium', 
      estimatedTime: '2-3 min',
      status: 'idle',
      features: ['Dealer monitoring', 'Quality control', 'Performance metrics']
    },
    { 
      id: 'vip-players', 
      name: 'VIP Management', 
      description: 'VIP player management and tier optimization', 
      icon: Crown, 
      category: 'VIP', 
      endpoint: 'vip-players', 
      priority: 'medium', 
      estimatedTime: '2-3 min',
      status: 'idle',
      features: ['Tier management', 'Personalized offers', 'Dedicated support']
    },
    { 
      id: 'loyalty-programs', 
      name: 'Loyalty Programs', 
      description: 'Loyalty program optimization and management', 
      icon: Star, 
      category: 'VIP', 
      endpoint: 'loyalty-programs', 
      priority: 'low', 
      estimatedTime: '1-2 min',
      status: 'idle',
      features: ['Points system', 'Reward management', 'Engagement tracking']
    },

    // Analytics & Performance
    { 
      id: 'player-behavior', 
      name: 'Player Analytics', 
      description: 'Analyze player behavior and engagement', 
      icon: Users, 
      category: 'Analytics', 
      endpoint: 'player-behavior', 
      priority: 'medium', 
      estimatedTime: '3-4 min',
      status: 'idle',
      features: ['Behavior analysis', 'Engagement metrics', 'Segmentation']
    },
    { 
      id: 'game-performance', 
      name: 'Game Performance', 
      description: 'Analyze performance of individual games', 
      icon: BarChart3, 
      category: 'Analytics', 
      endpoint: 'game-performance', 
      priority: 'medium', 
      estimatedTime: '2-3 min',
      status: 'idle',
      features: ['Performance metrics', 'Revenue analysis', 'Player preferences']
    },
    { 
      id: 'odds-manipulation', 
      name: 'Odds Analysis', 
      description: 'Detect and analyze suspicious odds manipulation', 
      icon: Activity, 
      category: 'Analytics', 
      endpoint: 'odds-manipulation', 
      priority: 'high', 
      estimatedTime: '2-4 min',
      status: 'idle',
      features: ['Odds monitoring', 'Anomaly detection', 'Market analysis']
    },
    { 
      id: 'player-segmentation', 
      name: 'Player Segmentation', 
      description: 'Segment players based on various criteria', 
      icon: Users, 
      category: 'Analytics', 
      endpoint: 'player-segmentation', 
      priority: 'low', 
      estimatedTime: '2-3 min',
      status: 'idle',
      features: ['Segmentation models', 'Targeting', 'Personalization']
    },

    // Content & Security
    { 
      id: 'game-providers', 
      name: 'Game Providers', 
      description: 'Game provider verification and content analysis', 
      icon: Gamepad2, 
      category: 'Operations', 
      endpoint: 'game-providers', 
      priority: 'low', 
      estimatedTime: '2-3 min',
      status: 'idle',
      features: ['Provider verification', 'Content analysis', 'Quality control']
    },
    { 
      id: 'security-analysis', 
      name: 'Security Scan', 
      description: 'Perform security analysis of gaming platforms', 
      icon: Lock, 
      category: 'Security', 
      endpoint: 'security-analysis', 
      priority: 'high', 
      estimatedTime: '3-5 min',
      status: 'idle',
      features: ['Vulnerability scanning', 'Penetration testing', 'Security reports']
    },
    { 
      id: 'customer-support', 
      name: 'Support Quality', 
      description: 'Analyze customer support quality and response times', 
      icon: MessageCircle, 
      category: 'Operations', 
      endpoint: 'customer-support', 
      priority: 'medium', 
      estimatedTime: '2-3 min',
      status: 'idle',
      features: ['Response time analysis', 'Quality metrics', 'Satisfaction tracking']
    },
    { 
      id: 'game-fairness', 
      name: 'Game Fairness', 
      description: 'Verify fairness of game outcomes', 
      icon: BarChart3, 
      category: 'Security', 
      endpoint: 'game-fairness', 
      priority: 'high', 
      estimatedTime: '3-4 min',
      status: 'idle',
      features: ['RNG verification', 'Fairness testing', 'Compliance checks']
    },
    { 
      id: 'responsible-gaming', 
      name: 'Responsible Gaming', 
      description: 'Ensure responsible gaming practices and player protection', 
      icon: UserCheck, 
      category: 'Compliance', 
      endpoint: 'responsible-gaming', 
      priority: 'high', 
      estimatedTime: '2-3 min',
      status: 'idle',
      features: ['Player protection', 'Self-exclusion', 'Spending limits']
    },
    { 
      id: 'geo-compliance', 
      name: 'Geo-Compliance', 
      description: 'Check geographical restrictions and compliance', 
      icon: Globe, 
      category: 'Compliance', 
      endpoint: 'geo-compliance', 
      priority: 'medium', 
      estimatedTime: '1-2 min',
      status: 'idle',
      features: ['Location verification', 'Restriction compliance', 'Jurisdiction mapping']
    }
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
    setRunningTools(prev => new Set(prev).add(toolId));
    setTools(prev => prev.map(tool => 
      tool.id === toolId ? { ...tool, status: 'running' } : tool
    ));
    
    try {
      const tool = tools.find(t => t.id === toolId);
      if (!tool) return;
      
      const endpoint = `/api/igaming/${tool.endpoint}`;
      let requestBody: any = {};
      
      if (tool.category === 'Marketing' || tool.category === 'Analytics' || tool.category === 'Financial') {
        if (!brandInput.trim()) {
          alert('Please enter a brand name first');
          return;
        }
        requestBody = { brand: brandInput.trim() };
      } else if (tool.category === 'Compliance' || tool.category === 'Operations') {
        const domains = domainsInput.split('\n').filter(d => d.trim());
        if (domains.length === 0) {
          alert('Please enter at least one domain');
          return;
        }
        requestBody = { domains };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const result = await response.json();
        setResults((prev: any) => ({ ...prev, [toolId]: result }));
        setCompletedTools(prev => new Set([...prev, toolId]));
        setTools(prev => prev.map(t => 
          t.id === toolId ? { ...t, status: 'completed' } : t
        ));
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error(`Tool ${toolId} failed:`, error);
      setTools(prev => prev.map(t => 
        t.id === toolId ? { ...t, status: 'error' } : t
      ));
      alert(`Tool failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setRunningTools(prev => {
        const newSet = new Set(prev);
        newSet.delete(toolId);
        return newSet;
      });
    }
  };

  const viewDetails = (toolId: string) => {
    setModalTitle(tools.find(t => t.id === toolId)?.name || 'Tool Details');
    setModalContent(results[toolId]);
    setShowModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300"></div>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Marketing': 'from-blue-500 to-cyan-500',
      'Compliance': 'from-green-500 to-emerald-500',
      'Financial': 'from-yellow-500 to-orange-500',
      'Security': 'from-red-500 to-pink-500',
      'Analytics': 'from-purple-500 to-indigo-500',
      'Operations': 'from-indigo-500 to-blue-500',
      'VIP': 'from-amber-500 to-yellow-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              🎰 Professional iGaming Suite
            </h1>
            <p className="text-xl text-gray-600 mb-6">26 Enterprise-Grade Tools for iGaming Operators</p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                {completedTools.size} Completed
              </div>
              <div className="flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 mr-2" />
                {runningTools.size} Running
              </div>
              <div className="flex items-center bg-gray-100 text-gray-800 px-4 py-2 rounded-full">
                <div className="w-4 h-4 rounded-full bg-gray-400 mr-2"></div>
                {tools.length - completedTools.size - runningTools.size} Pending
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Control Panel */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Control Panel</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Brand Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Kalebet"
                value={brandInput}
                onChange={(e) => setBrandInput(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Domains (one per line)</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                placeholder="e.g., kalebet.com&#10;kalebet.net"
                value={domainsInput}
                onChange={(e) => setDomainsInput(e.target.value)}
              />
            </div>
            <div className="flex flex-col justify-end">
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2" />
                Run All Tools
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tools..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    activeCategory === category.id
                      ? `${category.color} text-white shadow-lg transform scale-105`
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map(tool => {
            const IconComponent = tool.icon;
            const isRunning = tool.status === 'running';
            const isCompleted = tool.status === 'completed';
            const isError = tool.status === 'error';
            
            return (
              <div
                key={tool.id}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  isCompleted ? 'border-green-300 ring-2 ring-green-200' : 
                  isRunning ? 'border-yellow-300 ring-2 ring-yellow-200' :
                  isError ? 'border-red-300 ring-2 ring-red-200' :
                  'border-gray-200'
                }`}
              >
                <div className="p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${getCategoryColor(tool.category)}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(tool.priority)}`}>
                        {tool.priority.toUpperCase()}
                      </span>
                      {getStatusIcon(tool.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{tool.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tool.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">{tool.category}</span>
                        <span className="text-xs">⏱️ {tool.estimatedTime}</span>
                      </div>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-1">
                        {tool.features.slice(0, 2).map((feature, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {tool.features.length > 2 && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            +{tool.features.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Results Preview */}
                    {isCompleted && results[tool.id] && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                        <div className="text-sm text-green-800 font-semibold mb-1">✅ Analysis Complete</div>
                        <div className="text-xs text-green-700">
                          {results[tool.id].totalChecked || 
                           results[tool.id].totalAnalyzed || 
                           results[tool.id].alerts?.length ||
                           results[tool.id].programs?.length ||
                           results[tool.id].games?.length ||
                           'Results available'} items processed
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => isCompleted ? viewDetails(tool.id) : runTool(tool.id)}
                    disabled={isRunning}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      isCompleted 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : isRunning 
                        ? 'bg-yellow-100 text-yellow-700 cursor-not-allowed'
                        : isError
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
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
                    ) : isError ? (
                      <div className="flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Retry
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <PlayIcon className="w-4 h-4 mr-2" />
                        Run Analysis
                      </div>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Details */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-6">
                <h3 className="text-2xl font-bold text-gray-900">{modalTitle}</h3>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <pre className="bg-gray-50 p-6 rounded-xl text-sm overflow-x-auto">
                  {JSON.stringify(modalContent, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalIGamingTools;
