import React, { useState, useEffect } from 'react';
import { 
  Shield, TrendingUp, AlertTriangle, Globe, Search, 
  BarChart3, Users, FileText, Settings, ChevronRight,
  Activity, DollarSign, Target, Lock, Eye, Play,
  Download, RefreshCw, Menu, X, Bell, CheckCircle,
  XCircle, Clock, Zap, Award, CreditCard, UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../hooks/useWebSocket';

interface Metric {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
}

interface RecentScan {
  id: string;
  brand: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  timestamp: Date;
  threats: number;
}

const MainDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, lastMessage } = useWebSocket();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [selectedView, setSelectedView] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lastMessage) {
      handleWebSocketMessage(lastMessage);
    }
  }, [lastMessage]);

  const loadDashboardData = async () => {
    try {
      // Load metrics
      const metricsResponse = await fetch('/api/metrics');
      const metricsData = await metricsResponse.json();
      
      setMetrics([
        {
          label: 'Total Scans',
          value: metricsData.totalScans || 0,
          change: 12.5,
          icon: <Activity className="w-5 h-5" />,
          color: 'bg-gradient-to-br from-blue-500 to-blue-600'
        },
        {
          label: 'Active Threats',
          value: metricsData.activeThreats || 0,
          change: -8.3,
          icon: <AlertTriangle className="w-5 h-5" />,
          color: 'bg-gradient-to-br from-red-500 to-red-600'
        },
        {
          label: 'Domains Monitored',
          value: metricsData.domainsMonitored || 0,
          change: 23.1,
          icon: <Globe className="w-5 h-5" />,
          color: 'bg-gradient-to-br from-green-500 to-green-600'
        },
        {
          label: 'Risk Score',
          value: `${metricsData.riskScore || 0}%`,
          change: -5.2,
          icon: <Target className="w-5 h-5" />,
          color: 'bg-gradient-to-br from-amber-500 to-amber-600'
        }
      ]);

      // Load recent scans
      const scansResponse = await fetch('/api/scans');
      const scansData = await scansResponse.json();
      setRecentScans(scansData.slice(0, 5).map((scan: any) => ({
        ...scan,
        timestamp: new Date(scan.startedAt),
        threats: scan.summary?.highRisk || 0
      })));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleWebSocketMessage = (message: any) => {
    if (message.type === 'scan_complete') {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'success',
        title: 'Scan Completed',
        message: `Brand protection scan for ${message.data.brand} completed successfully`,
        timestamp: new Date()
      };
      setNotifications(prev => [notification, ...prev].slice(0, 10));
      loadDashboardData(); // Refresh data
    } else if (message.type === 'scan_error') {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'error',
        title: 'Scan Failed',
        message: `Scan failed: ${message.data.error}`,
        timestamp: new Date()
      };
      setNotifications(prev => [notification, ...prev].slice(0, 10));
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'scanner', label: 'Brand Scanner', icon: <Search className="w-5 h-5" /> },
    { id: 'tools', label: 'iGaming Tools', icon: <Target className="w-5 h-5" /> },
    { id: 'threats', label: 'Threat Analysis', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center ml-4 lg:ml-0">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">iGaming Protection</h1>
                  <p className="text-xs text-gray-500">Enterprise Security Platform</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                disabled={refreshing}
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-all relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>
              </div>

              {/* Quick Actions */}
              <button
                onClick={() => navigate('/scanner')}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
              >
                New Scan
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden`}>
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'scanner') {
                    navigate('/scanner');
                  } else if (item.id === 'tools') {
                    navigate('/igaming-tools');
                  } else {
                    setSelectedView(item.id);
                  }
                }}
                className={`w-full flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                  selectedView === item.id
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border-l-4 border-blue-500'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {item.icon}
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            {/* Page Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedView === 'overview' ? 'Dashboard Overview' : 
                 selectedView === 'threats' ? 'Threat Analysis' :
                 selectedView === 'reports' ? 'Reports & Analytics' :
                 selectedView === 'settings' ? 'Platform Settings' : 'Dashboard'}
              </h2>
              <p className="text-gray-600 mt-1">
                Real-time brand protection monitoring and analysis
              </p>
            </div>

            {/* Metrics Grid */}
            {selectedView === 'overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {metrics.map((metric, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      <div className={`${metric.color} p-1`}>
                        <div className="bg-white bg-opacity-95 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`${metric.color} p-3 rounded-xl text-white shadow-lg`}>
                              {metric.icon}
                            </div>
                            {metric.change && (
                              <span className={`text-sm font-semibold ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {metric.change > 0 ? '+' : ''}{metric.change}%
                              </span>
                            )}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
                          <p className="text-sm text-gray-600">{metric.label}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Scans */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Scans</h3>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {recentScans.map((scan) => (
                        <div key={scan.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(scan.status)}
                            <div>
                              <p className="font-medium text-gray-900">{scan.brand}</p>
                              <p className="text-sm text-gray-500">
                                {scan.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {scan.status === 'running' ? (
                              <div className="w-24">
                                <div className="bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                    style={{ width: `${scan.progress}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                scan.threats > 0 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {scan.threats} threats
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <button 
                        onClick={() => setNotifications([])}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No new notifications</p>
                      ) : (
                        notifications.map((notification) => (
                          <div key={notification.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{notification.title}</p>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                {notification.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => navigate('/scanner')}
                      className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <Search className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Start New Scan</p>
                          <p className="text-sm text-gray-500">Monitor a new brand</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    </button>

                    <button
                      onClick={() => navigate('/igaming-tools')}
                      className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                          <Target className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">iGaming Tools</p>
                          <p className="text-sm text-gray-500">26 professional tools</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    </button>

                    <button
                      onClick={() => setSelectedView('reports')}
                      className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                          <Download className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Generate Report</p>
                          <p className="text-sm text-gray-500">Export PDF report</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Threat Analysis View */}
            {selectedView === 'threats' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Active Threat Analysis</h3>
                  <p className="text-gray-600">Threat analysis features coming soon...</p>
                </div>
              </div>
            )}

            {/* Reports View */}
            {selectedView === 'reports' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Reports & Analytics</h3>
                  <p className="text-gray-600">Reporting features coming soon...</p>
                </div>
              </div>
            )}

            {/* Settings View */}
            {selectedView === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Platform Settings</h3>
                  <p className="text-gray-600">Settings configuration coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainDashboard;