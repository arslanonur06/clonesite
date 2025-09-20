import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Eye,
  Play,
  Settings,
  Calendar,
  DollarSign,
  FileText,
  BarChart3,
  UserCheck,
  Globe,
  Lock,
  Target,
  Award,
  Activity,
  ChevronRight,
  X
} from 'lucide-react';

const ComprehensiveDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [brandInput, setBrandInput] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [domainsInput, setDomainsInput] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<any>({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({});

  // Mock employee data
  useEffect(() => {
    setEmployees([
      { id: 1, name: 'John Smith', role: 'Security Analyst', status: 'online', shift: '09:00-17:00', performance: 95 },
      { id: 2, name: 'Sarah Johnson', role: 'Compliance Officer', status: 'online', shift: '10:00-18:00', performance: 88 },
      { id: 3, name: 'Mike Wilson', role: 'Brand Protection Manager', status: 'away', shift: '08:00-16:00', performance: 92 },
      { id: 4, name: 'Lisa Chen', role: 'Legal Specialist', status: 'offline', shift: '11:00-19:00', performance: 97 },
    ]);

    setMetrics({
      totalScans: 1247,
      activeThreats: 23,
      domainsMonitored: 8934,
      riskScore: 67,
      employeesOnline: 3,
      totalEmployees: 4,
      todayRevenue: 45678,
      monthlyGrowth: 12.5
    });
  }, []);

  const getCategoryColorClass = (category: string) => {
    const colors: { [key: string]: string } = {
      'Marketing': 'text-blue-800 bg-blue-100',
      'Compliance': 'text-green-800 bg-green-100',
      'Financial': 'text-yellow-800 bg-yellow-100',
      'Security': 'text-red-800 bg-red-100',
      'Analytics': 'text-purple-800 bg-purple-100',
      'Operations': 'text-indigo-800 bg-indigo-100',
      'VIP': 'text-amber-800 bg-amber-100',
      'Fraud': 'text-red-800 bg-red-100',
      'Player Protection': 'text-green-800 bg-green-100',
      'Regulatory': 'text-blue-800 bg-blue-100'
    };
    return colors[category] || 'text-gray-800 bg-gray-100';
  };

  const sections = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'brand-protection', name: 'Brand Protection', icon: Shield },
    { id: 'igaming-tools', name: 'iGaming Tools', icon: Target },
    { id: 'employee-management', name: 'Employee Management', icon: Users },
    { id: 'compliance', name: 'Compliance & Legal', icon: FileText },
    { id: 'analytics', name: 'Analytics & Reports', icon: TrendingUp },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const iGamingTools = [
    // Brand Protection & Marketing
    { id: 'affiliate-monitor', name: 'Affiliate Monitor', description: 'Monitor suspicious affiliate activities and player tracking', icon: Target, category: 'Marketing', endpoint: 'affiliate-monitor' },
    { id: 'marketing-campaigns', name: 'Campaign Analytics', description: 'Analyze marketing campaign performance and ROI', icon: TrendingUp, category: 'Marketing', endpoint: 'marketing-campaigns' },
    { id: 'bonus-abuse', name: 'Bonus Abuse Detection', description: 'Detect and prevent bonus hunting patterns', icon: AlertTriangle, category: 'Fraud', endpoint: 'bonus-abuse' },
    
    // Website Comparison & Analysis
    { id: 'website-comparison', name: 'Website Comparison', description: 'Compare similar iGaming websites and detect similarities', icon: Globe, category: 'Analysis', endpoint: 'website-comparison' },
    { id: 'competitor-analysis', name: 'Competitor Analysis', description: 'Analyze competitor websites and market positioning', icon: Target, category: 'Analysis', endpoint: 'competitor-analysis' },
    
    // Compliance & Legal
    { id: 'license-verify', name: 'License Verification', description: 'Verify gaming licenses and regulatory compliance', icon: Award, category: 'Compliance', endpoint: 'license-verify' },
    { id: 'compliance-monitor', name: 'Compliance Monitor', description: 'Track regulatory compliance and audit trails', icon: FileText, category: 'Compliance', endpoint: 'compliance-monitor' },
    { id: 'responsible-gaming', name: 'Responsible Gaming', description: 'Monitor player protection and self-exclusion', icon: UserCheck, category: 'Player Protection', endpoint: 'responsible-gaming' },
    { id: 'geo-compliance', name: 'Geo Compliance', description: 'Verify location and regional restrictions', icon: Globe, category: 'Regulatory', endpoint: 'geo-compliance' },
    
    // Financial & Payments
    { id: 'payment-analysis', name: 'Payment Analysis', description: 'Monitor transaction patterns and payment methods', icon: DollarSign, category: 'Financial', endpoint: 'payment-analysis' },
    { id: 'fraud-detection', name: 'Fraud Detection', description: 'Detect fraudulent activities using ML algorithms', icon: Shield, category: 'Security', endpoint: 'fraud-detection' },
    
    // Operations & Management
    { id: 'tournaments', name: 'Tournament Management', description: 'Manage tournaments and prize distributions', icon: Award, category: 'Operations', endpoint: 'tournaments' },
    { id: 'live-dealers', name: 'Live Dealer Management', description: 'Schedule and monitor live dealer performance', icon: Eye, category: 'Operations', endpoint: 'live-dealers' },
    { id: 'vip-players', name: 'VIP Management', description: 'Manage VIP players and exclusive offers', icon: UserCheck, category: 'VIP', endpoint: 'vip-players' },
    
    // Analytics & Performance
    { id: 'player-behavior', name: 'Player Analytics', description: 'Analyze player behavior and segmentation', icon: Users, category: 'Analytics', endpoint: 'player-behavior' },
    { id: 'game-performance', name: 'Game Performance', description: 'Monitor game performance and player engagement', icon: BarChart3, category: 'Analytics', endpoint: 'game-performance' },
    { id: 'odds-manipulation', name: 'Odds Analysis', icon: Activity, category: 'Sports', endpoint: 'odds-manipulation' },
    
    // Content & Security
    { id: 'game-providers', name: 'Game Providers', icon: Play, category: 'Content', endpoint: 'game-providers' },
    { id: 'security-analysis', name: 'Security Scan', icon: Lock, category: 'Security', endpoint: 'security-analysis' },
    { id: 'customer-support', name: 'Support Quality', icon: Users, category: 'Service', endpoint: 'customer-support' },
    
    // Advanced Professional Tools
    { id: 'risk-assessment', name: 'Risk Assessment', icon: AlertTriangle, category: 'Risk', endpoint: 'risk-assessment' },
    { id: 'kyc-verification', name: 'KYC Verification', icon: UserCheck, category: 'Compliance', endpoint: 'kyc-verification' },
    { id: 'aml-monitoring', name: 'AML Monitoring', icon: Shield, category: 'Compliance', endpoint: 'aml-monitoring' },
    { id: 'transaction-monitoring', name: 'Transaction Monitor', icon: DollarSign, category: 'Financial', endpoint: 'transaction-monitoring' },
    { id: 'loyalty-programs', name: 'Loyalty Programs', icon: Award, category: 'VIP', endpoint: 'loyalty-programs' },
    { id: 'chargeback-prevention', name: 'Chargeback Prevention', icon: Shield, category: 'Financial', endpoint: 'chargeback-prevention' },
    { id: 'game-fairness', name: 'Game Fairness', icon: BarChart3, category: 'Content', endpoint: 'game-fairness' },
    { id: 'player-segmentation', name: 'Player Segmentation', icon: Users, category: 'Analytics', endpoint: 'player-segmentation' },
    
    // Integration Tools
    { id: 'telegram-integration', name: 'Telegram Bot', description: 'Manage Telegram bots and notifications', icon: Users, category: 'Integration', endpoint: 'telegram-integration' },
    { id: 'google-sheets', name: 'Google Sheets', description: 'Import/export data with Google Sheets integration', icon: FileText, category: 'Integration', endpoint: 'google-sheets' },
  ];

  const runTool = async (toolId: string) => {
    setLoading(toolId);
    
    try {
      const tool = iGamingTools.find(t => t.id === toolId);
      if (!tool) {
        console.error(`Tool not found: ${toolId}`);
        return;
      }
      
      const endpoint = `/api/igaming/${tool.endpoint}`;
      console.log(`Running tool: ${tool.name} -> ${endpoint}`);
      
      // Determine request body based on tool type
      let requestBody: any = {};
      
      // Brand-based tools
      if (['affiliate-monitor', 'bonus-abuse', 'odds-manipulation', 'player-behavior', 'marketing-campaigns', 'risk-assessment', 'kyc-verification', 'aml-monitoring', 'transaction-monitoring', 'competitor-analysis', 'fake-domain-check', 'clone-detection'].includes(toolId)) {
        if (!brandInput.trim()) {
          alert('Please enter a brand name first');
          return;
        }
        requestBody = { brand: brandInput.trim() };
        
        // Special handling for brand protection tools
        if (toolId === 'fake-domain-check') {
          endpoint = '/api/brand-protection/fake-domain-check';
          requestBody = { brand: brandInput.trim(), baseUrl: websiteUrl.trim() || undefined };
        } else if (toolId === 'clone-detection') {
          endpoint = '/api/brand-protection/clone-detection';
          requestBody = { baseUrl: websiteUrl.trim() || `https://${brandInput.trim()}.com` };
        }
        
        // Special cases for advanced tools
        if (toolId === 'player-behavior') {
          requestBody.playerId = `PLAYER_${Math.floor(Math.random() * 10000)}`;
          requestBody.timeframe = '30d';
        }
        if (toolId === 'marketing-campaigns') {
          requestBody.campaignId = 'WELCOME_BONUS_2025';
        }
        if (toolId === 'competitor-analysis') {
          requestBody.competitors = ['bet365', 'william hill', 'ladbrokes', 'paddy power'];
        }
      }
      // Domain-based tools
      else if (['payment-analysis', 'game-providers', 'responsible-gaming', 'geo-compliance', 'customer-support', 'security-analysis'].includes(toolId)) {
        const domains = domainsInput.split('\n').filter((d: string) => d.trim());
        if (domains.length === 0) {
          alert('Please enter at least one domain');
          return;
        }
        requestBody = { domains };
      }
      // Special tools
      else if (toolId === 'license-verify') {
        requestBody = { domains: domainsInput.split('\n').filter((d: string) => d.trim()) };
      }
      else if (toolId === 'tournaments') {
        requestBody = { action: 'list' };
      }
      else if (toolId === 'live-dealers') {
        requestBody = { action: 'status' };
      }
      else if (toolId === 'vip-players') {
        requestBody = {}; // List all VIPs
      }
      else if (toolId === 'game-performance') {
        requestBody = { timeframe: '7d' };
      }
      else if (toolId === 'fraud-detection') {
        requestBody = {}; // Get all fraud alerts
      }
      else if (toolId === 'compliance-monitor') {
        requestBody = { jurisdiction: 'all' };
      }
      // New professional tools
      else if (toolId === 'loyalty-programs') {
        requestBody = { action: 'list' };
      }
      else if (toolId === 'chargeback-prevention') {
        requestBody = { timeframe: '30d' };
      }
      else if (toolId === 'game-fairness') {
        requestBody = {}; // List all games
      }
      else if (toolId === 'player-segmentation') {
        requestBody = { criteria: 'value' };
      }
      // Website comparison tools
      else if (toolId === 'website-comparison') {
        const domains = domainsInput.split('\n').filter((d: string) => d.trim());
        if (domains.length < 2) {
          alert('Please enter at least 2 domains for comparison');
          return;
        }
        requestBody = { url1: domains[0], url2: domains[1] };
        endpoint = '/api/website-comparison/compare';
      }
      // Integration tools
      else if (toolId === 'telegram-integration') {
        requestBody = { action: 'list' };
        endpoint = '/api/telegram/bots';
      }
      else if (toolId === 'google-sheets') {
        requestBody = { action: 'templates' };
        endpoint = '/api/google-sheets/templates';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const result = await response.json();
        setResults((prev: any) => ({ ...prev, [toolId]: result }));
        console.log(`✅ Tool ${tool.name} completed successfully`);
      } else {
        const errorText = await response.text();
        console.error(`Tool ${tool.name} failed:`, response.status, errorText);
        alert(`Tool failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error(`Tool ${toolId} failed:`, error);
      alert(`Tool failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(null);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Scans</p>
              <p className="text-3xl font-bold">{metrics.totalScans?.toLocaleString()}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="card p-6 bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Active Threats</p>
              <p className="text-3xl font-bold">{metrics.activeThreats}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
          </div>
        </div>
        
        <div className="card p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Domains Monitored</p>
              <p className="text-3xl font-bold">{metrics.domainsMonitored?.toLocaleString()}</p>
            </div>
            <Globe className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="card p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Risk Score</p>
              <p className="text-3xl font-bold">{metrics.riskScore}/100</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">🔍 Quick Brand Scan</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter brand name (e.g., betfair)"
              className="input"
              value={brandInput}
              onChange={(e) => setBrandInput(e.target.value)}
            />
            <input
              type="url"
              placeholder="Enter website URL (optional)"
              className="input"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
            <button 
              className="btn btn-primary w-full"
              onClick={() => runTool('affiliate-monitor')}
              disabled={!brandInput || loading !== null}
            >
              <Shield className="w-4 h-4 mr-2" />
              Start Brand Protection Scan
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">🎰 Quick Access</h3>
          <div className="space-y-3">
            <a 
              href="/igaming-tools"
              className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Professional iGaming Tools</div>
                  <div className="text-sm opacity-90">25 Enterprise Tools Available</div>
                </div>
                <ChevronRight className="w-5 h-5" />
              </div>
            </a>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">👥 Team Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Online Employees</span>
              <span className="font-bold text-green-600">{metrics.employeesOnline}/{metrics.totalEmployees}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Today's Revenue</span>
              <span className="font-bold text-blue-600">${metrics.todayRevenue?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Monthly Growth</span>
              <span className="font-bold text-purple-600">+{metrics.monthlyGrowth}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium">Brand scan completed for "kalebet"</p>
              <p className="text-sm text-gray-600">Found 7 suspicious affiliates - 2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium">High-risk domain detected</p>
              <p className="text-sm text-gray-600">kalebet123.com shows critical violations - 15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <FileText className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium">DMCA takedown successful</p>
              <p className="text-sm text-gray-600">3 infringing sites removed - 1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployeeManagement = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">👥 Employee Management</h2>
        <p className="text-green-100 text-lg">
          Comprehensive staff management, scheduling, and performance tracking
        </p>
      </div>

      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Online Now</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.employeesOnline}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalEmployees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Performance</p>
              <p className="text-2xl font-bold text-gray-900">93%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hours Today</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
            </div>
          </div>
        </div>
      </div>

      {/* Management Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Employee */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Employee</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Select Role</option>
              <option>Security Analyst</option>
              <option>Compliance Officer</option>
              <option>Brand Protection Manager</option>
              <option>Legal Specialist</option>
              <option>Customer Support</option>
            </select>
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors">
              Add Employee
            </button>
          </div>
        </div>

        {/* Schedule Management */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule Management</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors">
                📅 View Schedule
              </button>
              <button className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors">
                ✏️ Edit Shifts
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 font-medium transition-colors">
                📊 Attendance
              </button>
              <button className="bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 font-medium transition-colors">
                🏖️ Time Off
              </button>
            </div>
          </div>
        </div>

        {/* Performance Tracking */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Tracking</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 font-medium transition-colors">
                📈 Analytics
              </button>
              <button className="bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 font-medium transition-colors">
                🎯 Goals
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 font-medium transition-colors">
                📝 Reviews
              </button>
              <button className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-medium transition-colors">
                ⚠️ Alerts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Staff Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Employee</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Shift</th>
                <th className="text-left py-3 px-4">Performance</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        employee.status === 'online' ? 'bg-green-500' : 
                        employee.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                      <span className="font-medium">{employee.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{employee.role}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      employee.status === 'online' ? 'bg-green-100 text-green-800' :
                      employee.status === 'away' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{employee.shift}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{width: `${employee.performance}%`}}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{employee.performance}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="btn btn-secondary text-xs">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button className="btn btn-secondary text-xs">
                        <Settings className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">⏰ Time Tracking</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">John Smith</p>
                <p className="text-sm text-gray-600">Started: 09:00 AM</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">7h 23m</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-gray-600">Started: 10:00 AM</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">6h 23m</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">📅 Shift Management</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Current Shift</span>
              <span className="font-bold">Day Shift (09:00-17:00)</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Next Shift</span>
              <span className="font-bold">Evening Shift (17:00-01:00)</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Coverage</span>
              <span className="font-bold text-green-600">100%</span>
            </div>
            <button className="btn btn-primary w-full mt-4">
              <Calendar className="w-4 h-4 mr-2" />
              Manage Schedules
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIGamingTools = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">🎰 iGaming Professional Tools</h2>
        <div className="flex space-x-3">
          <button 
            className="btn btn-primary"
            onClick={() => {
              iGamingTools.forEach((tool, index) => {
                if ((tool.id === 'affiliate-monitor' && brandInput) || 
                    (tool.id !== 'affiliate-monitor' && domainsInput)) {
                  setTimeout(() => runTool(tool.id), index * 1000);
                }
              });
            }}
            disabled={loading !== null}
          >
            <Play className="w-4 h-4 mr-2" />
            Run All Tools
          </button>
          <button 
            className="btn btn-secondary"
            onClick={async () => {
              try {
                const response = await fetch('/api/igaming/export-comprehensive-pdf', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    brand: brandInput || 'iGaming Platform',
                    results: results,
                    tools: iGamingTools.filter(tool => results[tool.id])
                  })
                });
                
                if (response.ok) {
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `igaming-comprehensive-report-${Date.now()}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                } else {
                  alert('Export failed. Please try again.');
                }
              } catch (error) {
                console.error('Export error:', error);
                alert('Export failed. Please try again.');
              }
            }}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Brand Analysis</h3>
          <input
            type="text"
            placeholder="e.g., betfair, 888casino"
            className="input text-sm"
            value={brandInput}
            onChange={(e) => setBrandInput(e.target.value)}
          />
        </div>
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Domain Analysis</h3>
          <textarea
            placeholder="example1.com&#10;example2.com"
            className="input h-16 text-sm"
            value={domainsInput}
            onChange={(e) => setDomainsInput(e.target.value)}
          />
        </div>
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              className="btn btn-primary w-full text-sm"
              onClick={() => {
                iGamingTools.forEach((tool, index) => {
                  if ((tool.id === 'affiliate-monitor' && brandInput) || 
                      (tool.id !== 'affiliate-monitor' && domainsInput)) {
                    setTimeout(() => runTool(tool.id), index * 500);
                  }
                });
              }}
              disabled={loading !== null}
            >
              <Play className="w-4 h-4 mr-2" />
              Run All Tools
            </button>
            <button 
              className="btn btn-secondary w-full text-sm"
              onClick={async () => {
                try {
                  const response = await fetch('/api/igaming/export-comprehensive-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      brand: brandInput || 'iGaming Platform',
                      results: results,
                      tools: iGamingTools.filter(tool => results[tool.id])
                    })
                  });
                  
                  if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `igaming-report-${Date.now()}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  } else {
                    alert('Export failed. Please try again.');
                  }
                } catch (error) {
                  console.error('Export error:', error);
                  alert('Export failed. Please try again.');
                }
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            🎰 All iGaming Tools ({iGamingTools.length})
          </h3>
          <div className="flex space-x-2">
            <button 
              className="btn btn-primary text-sm"
              onClick={() => {
                iGamingTools.forEach((tool, index) => {
                  if ((tool.id === 'affiliate-monitor' && brandInput) || 
                      (tool.id !== 'affiliate-monitor' && domainsInput)) {
                    setTimeout(() => runTool(tool.id), index * 500);
                  }
                });
              }}
              disabled={loading !== null}
            >
              <Play className="w-4 h-4 mr-2" />
              Run All
            </button>
          </div>
        </div>

        {/* All Tools in Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {iGamingTools.map(tool => {
            const IconComponent = tool.icon;
            const isActive = results[tool.id];
            const isLoading = loading === tool.id;
            
            return (
              <div 
                key={tool.id} 
                className={`card p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-300 ${
                  isActive ? 'border-green-400 ring-1 ring-green-300' : 'border-gray-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-full ${getCategoryColorClass(tool.category).replace('text-', 'bg-').replace('-800', '-200')}`}>
                      <IconComponent className={`w-5 h-5 ${getCategoryColorClass(tool.category).replace('bg-', 'text-').replace('-100', '-600')}`} />
                    </div>
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : isActive ? (
                      <div className="w-4 h-4 rounded-full bg-green-400"></div>
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{tool.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{tool.description}</p>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColorClass(tool.category)}`}>
                    {tool.category}
                  </div>
                </div>
                <div className="mt-4">
                  {isActive ? (
                    <button 
                      onClick={() => {
                        setModalTitle(tool.name);
                        setModalContent(results[tool.id]);
                        setShowModal(true);
                      }} 
                      className="btn btn-secondary w-full py-2 flex items-center justify-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-2" /> View Results
                    </button>
                  ) : (
                    <button 
                      onClick={() => runTool(tool.id)} 
                      disabled={isLoading || (tool.id === 'affiliate-monitor' && !brandInput) || (tool.id !== 'affiliate-monitor' && !domainsInput)}
                      className="btn btn-primary w-full py-2 flex items-center justify-center text-sm"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      {isLoading ? 'Running...' : 'Run Tool'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Object.keys(results).length}
            </div>
            <div className="text-sm text-gray-600">Tools Completed</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {loading ? 1 : 0}
            </div>
            <div className="text-sm text-gray-600">Currently Running</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {iGamingTools.length - Object.keys(results).length}
            </div>
            <div className="text-sm text-gray-600">Tools Remaining</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round((Object.keys(results).length / iGamingTools.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
  const renderBrandProtection = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">🛡️ Brand Protection Suite</h2>
        <p className="text-blue-100 text-lg">
          Advanced tools to detect fake domains, clone sites, and unauthorized brand usage
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Threats</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Domains Monitored</p>
              <p className="text-2xl font-bold text-gray-900">8,934</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clones Detected</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Risk Score</p>
              <p className="text-2xl font-bold text-gray-900">67%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fake Domain Checker */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Fake Domain Checker</h3>
              <p className="text-gray-600">Detect clone sites and fake domains</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                placeholder="Enter your brand name (e.g., kalebet)"
                value={brandInput}
                onChange={(e) => setBrandInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Official Website URL
              </label>
              <input
                type="url"
                placeholder="https://yourbrand.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => runTool('fake-domain-check')}
                disabled={loading === 'fake-domain-check' || !brandInput.trim()}
                className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {loading === 'fake-domain-check' ? '🔍 Scanning...' : '🔍 Check Fake Domains'}
              </button>
              <button
                onClick={() => runTool('clone-detection')}
                disabled={loading === 'clone-detection' || !websiteUrl.trim()}
                className="bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {loading === 'clone-detection' ? '🔍 Analyzing...' : '🔍 Detect Clones'}
              </button>
            </div>
          </div>
        </div>

        {/* Visual Similarity Analysis */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Visual Similarity Analysis</h3>
              <p className="text-gray-600">AI-powered visual comparison</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://yourbrand.com/logo.png"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Similarity Threshold
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="0.8">High (80%+)</option>
                <option value="0.6">Medium (60%+)</option>
                <option value="0.4">Low (40%+)</option>
              </select>
            </div>

            <button
              onClick={() => runTool('visual-similarity')}
              disabled={loading === 'visual-similarity'}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
            >
              {loading === 'visual-similarity' ? '🔍 Analyzing...' : '🔍 Run Visual Analysis'}
            </button>
          </div>
        </div>

        {/* Social Media Monitoring */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Social Media Monitoring</h3>
              <p className="text-gray-600">Monitor social platforms for brand abuse</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => runTool('social-monitor')}
                disabled={loading === 'social-monitor'}
                className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium transition-colors"
              >
                {loading === 'social-monitor' ? '🔍 Monitoring...' : '📱 Social Media Scan'}
              </button>
              <button
                onClick={() => runTool('dark-web-monitor')}
                disabled={loading === 'dark-web-monitor'}
                className="bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 disabled:opacity-50 font-medium transition-colors"
              >
                {loading === 'dark-web-monitor' ? '🔍 Scanning...' : '🕵️ Dark Web Scan'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile App Monitoring */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Play className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Mobile App Monitoring</h3>
              <p className="text-gray-600">Detect fake mobile apps</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => runTool('mobile-apps')}
                disabled={loading === 'mobile-apps'}
                className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
              >
                {loading === 'mobile-apps' ? '🔍 Scanning...' : '📱 App Store Scan'}
              </button>
              <button
                onClick={() => runTool('crypto-monitor')}
                disabled={loading === 'crypto-monitor'}
                className="bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 disabled:opacity-50 font-medium transition-colors"
              >
                {loading === 'crypto-monitor' ? '🔍 Monitoring...' : '₿ Crypto Monitor'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Threats Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🚨 Recent Threats Detected</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Similarity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">kalebet-fake.com</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Clone Site</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">High</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">94%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-red-600 hover:text-red-900">Take Action</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">kalebet-bonus.net</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Typosquatting</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Medium</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">78%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-red-600 hover:text-red-900">Take Action</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">kalebet-mobile.app</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Fake App</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">High</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">89%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-red-600 hover:text-red-900">Take Action</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">📋 Compliance & Legal Management</h2>
        <button className="btn btn-primary">
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </button>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Licenses</p>
              <p className="text-2xl font-bold text-green-600">12</p>
            </div>
            <Award className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="card p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-blue-600">94%</p>
            </div>
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="card p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-yellow-600">3</p>
            </div>
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        <div className="card p-4 bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Violations</p>
              <p className="text-2xl font-bold text-red-600">1</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* License Management */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">🏛️ License Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">License</th>
                <th className="text-left py-3 px-4">Jurisdiction</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Expiry</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">MGA/B2C/123/2020</td>
                <td className="py-3 px-4">Malta</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span>
                </td>
                <td className="py-3 px-4">2025-12-31</td>
                <td className="py-3 px-4">
                  <button className="btn btn-secondary text-xs">View</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">UKGC-456789</td>
                <td className="py-3 px-4">United Kingdom</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span>
                </td>
                <td className="py-3 px-4">2024-06-30</td>
                <td className="py-3 px-4">
                  <button className="btn btn-secondary text-xs">View</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">CGA-789012</td>
                <td className="py-3 px-4">Curacao</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>
                </td>
                <td className="py-3 px-4">2024-03-15</td>
                <td className="py-3 px-4">
                  <button className="btn btn-secondary text-xs">Review</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">✅ Compliance Checklist</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">KYC Procedures</span>
              <span className="text-green-600">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">AML Monitoring</span>
              <span className="text-green-600">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Responsible Gaming</span>
              <span className="text-green-600">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Protection</span>
              <span className="text-yellow-600">⚠</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Audit Trail</span>
              <span className="text-green-600">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Reporting</span>
              <span className="text-red-600">✗</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Compliance Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Overall Compliance</span>
                <span className="text-sm font-medium">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Regulatory Updates</span>
                <span className="text-sm font-medium">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '87%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Documentation</span>
                <span className="text-sm font-medium">91%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: '91%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">📊 Analytics & Reports</h2>
        <p className="text-purple-100 text-lg">
          Comprehensive analytics dashboard with real-time insights and reporting
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors">
          <FileText className="w-4 h-4 mr-2 inline" />
          Export Data
        </button>
        <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors">
          <BarChart3 className="w-4 h-4 mr-2 inline" />
          Generate Report
        </button>
        <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 font-medium transition-colors">
          <TrendingUp className="w-4 h-4 mr-2 inline" />
          Real-time Dashboard
        </button>
        <button className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 font-medium transition-colors">
          <Activity className="w-4 h-4 mr-2 inline" />
          Performance Monitor
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Revenue</p>
              <p className="text-3xl font-bold">$2.4M</p>
              <p className="text-blue-200 text-sm">+12.5% from last month</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="card p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Active Players</p>
              <p className="text-3xl font-bold">15,247</p>
              <p className="text-green-200 text-sm">+8.2% from last month</p>
            </div>
            <Users className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="card p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Conversion Rate</p>
              <p className="text-3xl font-bold">3.2%</p>
              <p className="text-purple-200 text-sm">+0.3% from last month</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="card p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Avg. Session</p>
              <p className="text-3xl font-bold">24m</p>
              <p className="text-orange-200 text-sm">+2.1m from last month</p>
            </div>
            <Clock className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Advanced Analytics Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">💰 Revenue Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Daily Revenue</span>
              <span className="text-lg font-bold text-green-600">$45,678</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Monthly Revenue</span>
              <span className="text-lg font-bold text-blue-600">$1,234,567</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Growth Rate</span>
              <span className="text-lg font-bold text-purple-600">+12.5%</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors">
              📊 View Detailed Report
            </button>
          </div>
        </div>

        {/* Player Analytics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">👥 Player Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Active Players</span>
              <span className="text-lg font-bold text-green-600">15,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">New Registrations</span>
              <span className="text-lg font-bold text-blue-600">1,234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Retention Rate</span>
              <span className="text-lg font-bold text-purple-600">78.5%</span>
            </div>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors">
              👥 Player Insights
            </button>
          </div>
        </div>

        {/* Game Performance */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🎮 Game Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Top Game</span>
              <span className="text-lg font-bold text-green-600">Blackjack</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Total Games</span>
              <span className="text-lg font-bold text-blue-600">2,456</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Avg. Session</span>
              <span className="text-lg font-bold text-purple-600">24m</span>
            </div>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 font-medium transition-colors">
              🎮 Game Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Charts and Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Revenue Trends</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium">Revenue Chart Visualization</p>
              <p className="text-sm text-gray-500 mt-2">Interactive charts with real-time data</p>
              <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors">
                Load Chart
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Player Segmentation</h3>
          <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Users className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium">Player Segmentation Chart</p>
              <p className="text-sm text-gray-500 mt-2">Pie charts and demographic analysis</p>
              <button className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors">
                Load Chart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🔥 Top Performing Games</h3>
          <div className="space-y-3">
            {[
              { name: 'Blackjack Pro', players: 1247, revenue: 45678, growth: '+15%' },
              { name: 'Roulette VIP', players: 892, revenue: 32156, growth: '+8%' },
              { name: 'Slots Mega', players: 2156, revenue: 67890, growth: '+22%' },
              { name: 'Poker Classic', players: 634, revenue: 23456, growth: '+5%' }
            ].map((game, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{game.name}</p>
                  <p className="text-sm text-gray-600">{game.players} players</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${game.revenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">{game.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'High Value Win', player: 'Player_1234', amount: 2500, time: '2 min ago' },
              { action: 'New Registration', player: 'Player_5678', amount: 0, time: '5 min ago' },
              { action: 'Large Deposit', player: 'Player_9012', amount: 1000, time: '8 min ago' },
              { action: 'Bonus Claimed', player: 'Player_3456', amount: 500, time: '12 min ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.player}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">${activity.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">⚡ Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">1.2s</div>
            <div className="text-sm text-gray-600">Avg. Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">4.8/5</div>
            <div className="text-sm text-gray-600">User Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">📄 Recent Reports</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium">Monthly Performance Report</p>
                <p className="text-sm text-gray-600">Generated 2 hours ago</p>
              </div>
            </div>
            <button className="btn btn-secondary text-xs">Download</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium">Player Analytics Report</p>
                <p className="text-sm text-gray-600">Generated 1 day ago</p>
              </div>
            </div>
            <button className="btn btn-secondary text-xs">Download</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-red-600 mr-3" />
              <div>
                <p className="font-medium">Security Audit Report</p>
                <p className="text-sm text-gray-600">Generated 3 days ago</p>
              </div>
            </div>
            <button className="btn btn-secondary text-xs">Download</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">⚙️ System Settings</h2>
        <p className="text-gray-100 text-lg">
          Configure system preferences, security settings, and integrations
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors">
          <Settings className="w-4 h-4 mr-2 inline" />
          Save All Changes
        </button>
        <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors">
          <Shield className="w-4 h-4 mr-2 inline" />
          Security Settings
        </button>
        <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 font-medium transition-colors">
          <Users className="w-4 h-4 mr-2 inline" />
          User Management
        </button>
        <button className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 font-medium transition-colors">
          <FileText className="w-4 h-4 mr-2 inline" />
          Export Config
        </button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🔧 General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                defaultValue="iGaming Management Suite" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Timezone</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>UTC</option>
                <option>EST</option>
                <option>PST</option>
                <option>GMT</option>
                <option>Europe/London</option>
                <option>Asia/Tokyo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Italian</option>
                <option>Portuguese</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>JPY (¥)</option>
                <option>CAD (C$)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🔒 Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
              <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Session Timeout</span>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">IP Whitelist</span>
              <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors">
                Configure
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Audit Logging</span>
              <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 font-medium transition-colors">
                View Logs
              </button>
            </div>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🔗 Integration Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Google Sheets API</span>
              <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors">
                Connected
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Telegram Bot</span>
              <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors">
                Configure
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Email Notifications</span>
              <button className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 font-medium transition-colors">
                Setup
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Webhook URLs</span>
              <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 font-medium transition-colors">
                Manage
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🔔 Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Email Alerts</span>
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Push Notifications</span>
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Telegram Alerts</span>
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Database Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🗄️ Database Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Connection String</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="mongodb://localhost:27017/igaming"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Auto Backup</span>
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors">
              Test Connection
            </button>
          </div>
        </div>

        {/* API Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🔌 API Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Rate Limit</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>100 requests/minute</option>
                <option>500 requests/minute</option>
                <option>1000 requests/minute</option>
                <option>Unlimited</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">API Key Required</span>
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
            </div>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors">
              Generate New Key
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📊 System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Server Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Database Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">API Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Uptime</span>
              <span className="text-sm text-gray-600">99.9%</span>
            </div>
          </div>
        </div>
      </div>
              <select className="input">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="notifications" className="mr-2" defaultChecked />
              <label htmlFor="notifications" className="text-sm text-gray-700">Enable notifications</label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">🔒 Security Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
              <input type="number" className="input" defaultValue="30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
              <select className="input">
                <option>Standard</option>
                <option>Strong</option>
                <option>Enterprise</option>
              </select>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="2fa" className="mr-2" />
              <label htmlFor="2fa" className="text-sm text-gray-700">Enable Two-Factor Authentication</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="audit" className="mr-2" defaultChecked />
              <label htmlFor="audit" className="text-sm text-gray-700">Enable audit logging</label>
            </div>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">🔗 Integration Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telegram Bot Token</label>
              <input type="password" className="input" placeholder="Enter bot token" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Sheets API Key</label>
              <input type="password" className="input" placeholder="Enter API key" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
              <input type="url" className="input" placeholder="https://your-domain.com/webhook" />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="auto-sync" className="mr-2" defaultChecked />
              <label htmlFor="auto-sync" className="text-sm text-gray-700">Enable auto-sync</label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">📢 Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Email Notifications</span>
              <input type="checkbox" className="mr-2" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">SMS Notifications</span>
              <input type="checkbox" className="mr-2" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Telegram Notifications</span>
              <input type="checkbox" className="mr-2" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Push Notifications</span>
              <input type="checkbox" className="mr-2" defaultChecked />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notification Frequency</label>
              <select className="input">
                <option>Immediate</option>
                <option>Every 15 minutes</option>
                <option>Every hour</option>
                <option>Daily digest</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">ℹ️ System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Version</p>
            <p className="font-semibold">v2.1.0</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="font-semibold">2024-01-15</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Database Size</p>
            <p className="font-semibold">2.3 GB</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'employee-management':
        return renderEmployeeManagement();
      case 'igaming-tools':
        return renderIGamingTools();
      case 'brand-protection':
        return renderBrandProtection();
      case 'compliance':
        return renderCompliance();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                iGaming Management Suite
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Enterprise Dashboard
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-6">
            {sections.map(section => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {section.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>

      {/* Results Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{modalTitle} - Results</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(modalContent, null, 2)}
              </pre>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/igaming/export-comprehensive-pdf', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        brand: brandInput || 'iGaming Platform',
                        results: { [modalTitle]: modalContent },
                        tools: iGamingTools.filter(tool => tool.name === modalTitle)
                      })
                    });
                    
                    if (response.ok) {
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${modalTitle.toLowerCase().replace(/\s+/g, '-')}-report-${Date.now()}.pdf`;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    } else {
                      alert('Export failed. Please try again.');
                    }
                  } catch (error) {
                    console.error('Export error:', error);
                    alert('Export failed. Please try again.');
                  }
                }}
                className="btn btn-primary"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export This Result
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComprehensiveDashboard;
