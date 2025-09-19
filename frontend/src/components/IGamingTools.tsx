import React, { useState } from 'react';
import { 
  Link2, 
  Shield, 
  CreditCard, 
  Gamepad2, 
  Users, 
  Gift, 
  Globe, 
  TrendingUp, 
  MessageCircle, 
  Lock,
  Play,
  Download,
  Eye,
  X,
  BarChart3
} from 'lucide-react';

const IGamingTools: React.FC = () => {
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [brandInput, setBrandInput] = useState('');
  const [domainsInput, setDomainsInput] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deepAnalysisResult, setDeepAnalysisResult] = useState<any>(null);

  const tools = [
    {
      id: 'affiliate-monitor',
      name: 'Affiliate & Player Tracking',
      description: 'Monitor affiliates, player tracking systems, and privacy compliance',
      icon: Link2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      endpoint: '/api/igaming/affiliate-monitor',
      inputType: 'brand',
      category: 'Marketing Protection'
    },
    {
      id: 'license-verify',
      name: 'Gaming License Verification',
      description: 'Verify legitimate gaming licenses and jurisdictions',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      endpoint: '/api/igaming/license-verify',
      inputType: 'domains',
      category: 'Compliance'
    },
    {
      id: 'payment-analysis',
      name: 'Payment Method Analysis',
      description: 'Detect suspicious payment processors and fraud risks',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      endpoint: '/api/igaming/payment-analysis',
      inputType: 'domains',
      category: 'Financial Security'
    },
    {
      id: 'game-providers',
      name: 'Game Provider Verification',
      description: 'Verify legitimate game providers and detect fake games',
      icon: Gamepad2,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      endpoint: '/api/igaming/game-providers',
      inputType: 'domains',
      category: 'Content Verification'
    },
    {
      id: 'responsible-gaming',
      name: 'Responsible Gaming Compliance',
      description: 'Check RG features and regulatory compliance',
      icon: Users,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      endpoint: '/api/igaming/responsible-gaming',
      inputType: 'domains',
      category: 'Player Protection'
    },
    {
      id: 'bonus-abuse',
      name: 'Bonus Abuse Detection',
      description: 'Monitor excessive bonus offers and scam promotions',
      icon: Gift,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      endpoint: '/api/igaming/bonus-abuse',
      inputType: 'brand',
      category: 'Fraud Prevention'
    },
    {
      id: 'geo-compliance',
      name: 'Geo-blocking Compliance',
      description: 'Check regional restrictions and regulatory compliance',
      icon: Globe,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      endpoint: '/api/igaming/geo-compliance',
      inputType: 'domains',
      category: 'Regulatory'
    },
    {
      id: 'odds-manipulation',
      name: 'Sports Betting Odds Analysis',
      description: 'Detect odds manipulation and suspicious betting patterns',
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      endpoint: '/api/igaming/odds-manipulation',
      inputType: 'brand',
      category: 'Sports Betting'
    },
    {
      id: 'customer-support',
      name: 'Customer Support Analysis',
      description: 'Analyze support quality and response times',
      icon: MessageCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      endpoint: '/api/igaming/customer-support',
      inputType: 'domains',
      category: 'Service Quality'
    },
    {
      id: 'security-analysis',
      name: 'Gaming Security Analysis',
      description: 'Check SSL, encryption, and security measures',
      icon: Lock,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      endpoint: '/api/igaming/security-analysis',
      inputType: 'domains',
      category: 'Technical Security'
    }
  ];

  const runTool = async (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    if (!tool) return;

    setLoading(toolId);
    
    try {
      const requestBody = tool.inputType === 'brand' 
        ? { brand: brandInput }
        : { domains: domainsInput.split('\n').filter(d => d.trim()) };

      console.log(`Running tool ${toolId} with:`, requestBody);
      console.log(`Endpoint: ${tool.endpoint}`);

      const response = await fetch(tool.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      console.log(`Response status: ${response.status}`);

      if (response.ok) {
        const result = await response.json();
        console.log(`Tool ${toolId} result:`, result);
        setResults((prev: any) => ({ ...prev, [toolId]: result }));
        setActiveTools(prev => [...prev.filter(id => id !== toolId), toolId]);
      } else {
        const errorText = await response.text();
        console.error(`Tool ${toolId} failed with status ${response.status}:`, errorText);
        throw new Error(`Tool execution failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error(`Tool ${toolId} failed:`, error);
      alert(`Tool execution failed: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  const runAllTools = async () => {
    if (!brandInput && !domainsInput) {
      alert('Please provide either a brand name or domain list');
      return;
    }

    for (const tool of tools) {
      if (tool.inputType === 'brand' && !brandInput) continue;
      if (tool.inputType === 'domains' && !domainsInput) continue;
      
      await runTool(tool.id);
      // Small delay between tools
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const exportResults = async () => {
    try {
      // Generate DMCA requests if affiliate monitoring was run
      let dmcaResults = null;
      const affiliateResults = results['affiliate-monitor'];
      
      if (affiliateResults && affiliateResults.affiliates) {
        const dmcaResponse = await fetch('/api/igaming/dmca-takedown', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brand: brandInput,
            affiliates: affiliateResults.affiliates
          })
        });
        
        if (dmcaResponse.ok) {
          dmcaResults = await dmcaResponse.json();
        }
      }
      
      // Generate comprehensive PDF report
      const pdfResponse = await fetch('/api/igaming/export-comprehensive-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: brandInput,
          affiliateResults,
          dmcaResults
        })
      });
      
      if (pdfResponse.ok) {
        const blob = await pdfResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${brandInput}-comprehensive-affiliate-report-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        alert('✅ Comprehensive PDF report with DMCA requests generated successfully!');
      } else {
        throw new Error('PDF export failed');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('❌ Export failed. Please try again.');
    }
  };

  const viewDetails = (toolId: string) => {
    setSelectedTool(toolId);
    setShowModal(true);
  };

  const runDeepAnalysis = async () => {
    if (!websiteUrl || !brandInput) {
      alert('Please provide both website URL and brand name');
      return;
    }

    setLoading('deep-analysis');
    
    try {
      console.log(`🔍 Starting deep analysis for ${websiteUrl}`);
      
      const response = await fetch('/api/igaming/deep-website-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: websiteUrl,
          brand: brandInput
        })
      });

      if (response.ok) {
        const analysis = await response.json();
        setDeepAnalysisResult(analysis);
        setSelectedTool('deep-analysis');
        setShowModal(true);
        console.log('🔍 Deep analysis completed:', analysis);
      } else {
        throw new Error('Deep analysis failed');
      }
    } catch (error) {
      console.error('Deep analysis failed:', error);
      alert('❌ Deep analysis failed. Please check the URL and try again.');
    } finally {
      setLoading(null);
    }
  };


  // const categories = [...new Set(tools.map(t => t.category))];

  return (
    <div className="space-y-6">
      {/* Compact Header */}
      <div className="text-center py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          🎰 iGaming Professional Tools
        </h1>
        <p className="text-sm md:text-lg opacity-90">
          Comprehensive toolkit for gaming operators, compliance teams, and security professionals
        </p>
      </div>

      {/* Compact Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <h3 className="text-md font-semibold text-gray-900 mb-2">Brand Analysis</h3>
          <input
            type="text"
            className="input text-sm"
            placeholder="e.g., betfair, 888casino"
            value={brandInput}
            onChange={(e) => setBrandInput(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            For affiliate, bonus, odds analysis
          </p>
        </div>

          <div className="card p-4">
            <h3 className="text-md font-semibold text-gray-900 mb-2">Domain Analysis</h3>
            <textarea
              className="input h-16 text-sm"
              placeholder="example1.com&#10;example2.com"
              value={domainsInput}
              onChange={(e) => setDomainsInput(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              For license, payment, compliance
            </p>
          </div>

          <div className="card p-4">
            <h3 className="text-md font-semibold text-gray-900 mb-2">🔍 Deep Website Analysis</h3>
            <input
              type="url"
              className="input text-sm mb-2"
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
            <button
              onClick={runDeepAnalysis}
              className="btn btn-primary text-sm w-full"
              disabled={!websiteUrl || !brandInput || loading !== null}
            >
              🔍 Analyze Website In-Depth
            </button>
            <p className="text-xs text-gray-500 mt-1">
              Analyzes all pages, content, forms, and security
            </p>
          </div>

        <div className="card p-4 flex flex-col justify-center">
          <button
            onClick={runAllTools}
            className="btn btn-primary mb-2"
            disabled={loading !== null}
          >
            <Play className="w-4 h-4 mr-2" />
            Run All Tools
          </button>
          <button
            onClick={() => {
              setResults({});
              setActiveTools([]);
            }}
            className="btn btn-secondary text-sm"
          >
            Clear Results
          </button>
        </div>
      </div>

      {/* Results Summary - Show at top when available */}
      {activeTools.length > 0 && (
        <div className="card p-4 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Live Analysis Results
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{activeTools.length}</div>
              <div className="text-xs text-gray-600">Tools Executed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {Object.values(results).reduce((sum: number, result: any) => {
                  return sum + (result.suspiciousFound || result.highRisk || result.criticalSecurity || result.unlicensed || 0);
                }, 0)}
              </div>
              <div className="text-xs text-gray-600">High Risk Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(results).reduce((sum: number, result: any) => {
                  return sum + (result.totalChecked || result.totalAnalyzed || result.totalScanned || result.totalMonitored || 0);
                }, 0)}
              </div>
              <div className="text-xs text-gray-600">Items Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((Object.values(results).reduce((sum: number, result: any) => {
                  return sum + (result.suspiciousFound || result.highRisk || result.criticalSecurity || result.unlicensed || 0);
                }, 0) / Math.max(1, Object.values(results).length)) * 100)}%
              </div>
              <div className="text-xs text-gray-600">Risk Level</div>
            </div>
          </div>
        </div>
      )}

      {/* All Tools in One Grid - Side by Side Layout */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded mr-4"></span>
            Professional iGaming Tools
          </h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
              {activeTools.length} / {tools.length} tools active
            </div>
            <button
              onClick={() => {
                setResults({});
                setActiveTools([]);
              }}
              className="btn btn-secondary text-sm"
            >
              Clear All Results
            </button>
          </div>
        </div>

        {/* Unified Grid Layout - All Tools Side by Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {tools.map(tool => {
            const IconComponent = tool.icon;
            const isActive = activeTools.includes(tool.id);
            const isLoading = loading === tool.id;
            const result = results[tool.id];
            const categoryColor = {
              'Marketing Protection': 'border-l-red-500',
              'Compliance': 'border-l-green-500',
              'Financial Security': 'border-l-purple-500',
              'Content Verification': 'border-l-orange-500',
              'Player Protection': 'border-l-teal-500',
              'Fraud Prevention': 'border-l-pink-500',
              'Regulatory': 'border-l-indigo-500',
              'Sports Betting': 'border-l-red-600',
              'Service Quality': 'border-l-yellow-500',
              'Technical Security': 'border-l-gray-500'
            }[tool.category] || 'border-l-blue-500';

            return (
              <div 
                key={tool.id} 
                className={`card p-3 hover:shadow-xl transition-all duration-300 border-l-4 ${categoryColor} ${
                  isActive 
                    ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50 border-blue-300 shadow-lg scale-105' 
                    : 'hover:border-gray-300 hover:scale-102'
                }`}
              >
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full truncate">
                    {tool.category}
                  </span>
                  <div className={`p-1.5 ${tool.bgColor} rounded-lg`}>
                    <IconComponent className={`w-3 h-3 ${tool.color}`} />
                  </div>
                </div>

                {/* Tool Info */}
                <div className="space-y-2 mb-3">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 min-h-[2.5rem]">
                    {tool.name}
                  </h4>
                  <p className="text-gray-600 text-xs leading-tight line-clamp-2 min-h-[2rem]">
                    {tool.description}
                  </p>
                </div>

                {/* Input Type & Action Button */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                      📝 {tool.inputType === 'brand' ? 'Brand' : 'Domains'}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          if (tool.inputType === 'brand' && !brandInput.trim()) {
                            alert('Please enter a brand name first!');
                            return;
                          }
                          if (tool.inputType === 'domains' && !domainsInput.trim()) {
                            alert('Please enter domain(s) first!');
                            return;
                          }
                          runTool(tool.id);
                        }}
                        disabled={isLoading}
                        className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'} text-xs px-2 py-1.5 flex items-center justify-center font-medium`}
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Play className="w-3 h-3 mr-1" />
                            {isActive ? 'Active' : 'Run'}
                          </>
                        )}
                      </button>
                      {result && (
                        <button
                          onClick={() => viewDetails(tool.id)}
                          className="btn btn-secondary text-xs px-2 py-1.5 flex items-center justify-center"
                          title="View Details"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Results Section - Ultra Compact */}
                  {result && (
                    <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                      {/* Status Indicators - Horizontal Pills */}
                      <div className="flex flex-wrap gap-1">
                          {tool.id === 'affiliate-monitor' && (
                            <>
                              <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${result.suspiciousFound > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                🚨 {result.suspiciousFound}
                              </div>
                              <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${result.playerTrackingIssues > 0 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                👥 {result.playerTrackingIssues}
                              </div>
                              {result.summary && (
                                <>
                                  <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                    📈 {result.summary.totalRegistrations?.toLocaleString() || 0}
                                  </div>
                                  <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                    📊 {result.summary.complianceScore}%
                                  </div>
                                  <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    ⚖️ {result.summary.dmcaTargets || 0} DMCA
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        
                        {tool.id === 'license-verify' && (
                          <>
                            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              ✅ {result.licensed}
                            </div>
                            {result.unlicensed > 0 && (
                              <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                ❌ {result.unlicensed}
                              </div>
                            )}
                          </>
                        )}

                        {tool.id === 'security-analysis' && (
                          <>
                            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${result.criticalSecurity > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              🔒 {result.criticalSecurity}
                            </div>
                            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              📈 {result.totalAnalyzed}
                            </div>
                          </>
                        )}

                        {(tool.id === 'payment-analysis' || tool.id === 'game-providers') && (
                          <>
                            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${result.highRisk > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              ⚠️ {result.highRisk}
                            </div>
                            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              📊 {result.totalChecked || result.totalAnalyzed}
                            </div>
                          </>
                        )}

                        {tool.id === 'responsible-gaming' && (
                          <>
                            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${result.averageCompliance < 50 ? 'bg-red-100 text-red-700' : result.averageCompliance < 75 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                              🎯 {result.averageCompliance}%
                            </div>
                            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              ✓ {result.totalChecked}
                            </div>
                          </>
                        )}

                        {(tool.id === 'bonus-abuse' || tool.id === 'odds-manipulation') && (
                          <>
                            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${(result.suspiciousFound || result.suspiciousOffers) > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              🚨 {result.suspiciousFound || result.suspiciousOffers}
                            </div>
                            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              👁️ {result.totalScanned || result.totalMonitored}
                            </div>
                          </>
                        )}

                        {(tool.id === 'geo-compliance' || tool.id === 'customer-support') && result.totalChecked && (
                          <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            📊 {result.totalChecked}
                          </div>
                        )}
                      </div>

                      {/* Quick Stats for Affiliate Monitor */}
                      {tool.id === 'affiliate-monitor' && result.summary && (
                        <div className="text-xs text-gray-600 bg-gradient-to-r from-gray-50 to-blue-50 rounded p-2">
                          <div className="flex justify-between">
                            <span>Players: <strong className="text-red-600">{result.summary.totalPlayersAffected?.toLocaleString() || 0}</strong></span>
                            <span>Risk: <strong className={result.summary.affiliateRisk > 3 ? 'text-red-600' : 'text-yellow-600'}>{result.summary.affiliateRisk > 3 ? 'High' : 'Med'}</strong></span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Action Panel */}
        <div className="card p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Quick Actions</h3>
              <p className="text-sm text-gray-600">Manage all tools efficiently</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  tools.filter(t => t.inputType === 'brand' && brandInput).forEach(t => runTool(t.id));
                }}
                disabled={!brandInput || loading !== null}
                className="btn btn-primary text-sm"
              >
                Run All Brand Tools
              </button>
              <button
                onClick={() => {
                  tools.filter(t => t.inputType === 'domains' && domainsInput).forEach(t => runTool(t.id));
                }}
                disabled={!domainsInput || loading !== null}
                className="btn btn-primary text-sm"
              >
                Run All Domain Tools
              </button>
              <button
                onClick={() => {
                  const inactiveTools = tools.filter(t => !activeTools.includes(t.id));
                  inactiveTools.forEach(t => {
                    if ((t.inputType === 'brand' && brandInput) || (t.inputType === 'domains' && domainsInput)) {
                      setTimeout(() => runTool(t.id), Math.random() * 2000);
                    }
                  });
                }}
                disabled={loading !== null}
                className="btn btn-secondary text-sm"
              >
                Run Missing Tools
              </button>
              {activeTools.length > 0 && (
                <button
                  onClick={exportResults}
                  className="btn btn-secondary text-sm flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Results
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Results Modal */}
      {showModal && selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {tools.find(t => t.id === selectedTool)?.name} - Detailed Results
                  </h3>
                  <p className="text-sm text-gray-600">
                    {tools.find(t => t.id === selectedTool)?.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {results[selectedTool] ? (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="card p-4 bg-blue-50 border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">
                        {results[selectedTool].totalChecked || results[selectedTool].totalAnalyzed || results[selectedTool].totalScanned || results[selectedTool].totalMonitored || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Analyzed</div>
                    </div>
                    <div className="card p-4 bg-red-50 border-red-200">
                      <div className="text-2xl font-bold text-red-600">
                        {results[selectedTool].suspiciousFound || results[selectedTool].highRisk || results[selectedTool].criticalSecurity || results[selectedTool].unlicensed || 0}
                      </div>
                      <div className="text-sm text-gray-600">Issues Found</div>
                    </div>
                    <div className="card p-4 bg-green-50 border-green-200">
                      <div className="text-2xl font-bold text-green-600">
                        {results[selectedTool].averageCompliance || 
                         (results[selectedTool].summary?.complianceScore) || 
                         Math.round(((results[selectedTool].totalChecked || 1) - (results[selectedTool].suspiciousFound || results[selectedTool].highRisk || 0)) / (results[selectedTool].totalChecked || 1) * 100) || 0}%
                      </div>
                      <div className="text-sm text-gray-600">Compliance Score</div>
                    </div>
                  </div>

                  {/* Detailed Data */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Detailed Analysis</h4>
                    
                    {selectedTool === 'affiliate-monitor' && results[selectedTool].affiliates && (
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-900">Suspicious Affiliates & Registration Analysis</h5>
                        {results[selectedTool].affiliates.slice(0, 5).map((affiliate: any, index: number) => (
                          <div key={index} className="card p-4 border-red-200 bg-red-50">
                            <div className="flex justify-between items-start mb-3">
                              <span className="font-medium text-red-900">{affiliate.url}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${affiliate.riskLevel === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {affiliate.riskLevel}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <h6 className="font-semibold text-gray-900 mb-2">Affiliate Information</h6>
                                <p><strong>ID:</strong> {affiliate.affiliateId}</p>
                                <p><strong>Bonus Claimed:</strong> {affiliate.bonusClaimed}</p>
                                <p><strong>Hosting:</strong> {affiliate.hostingInfo?.provider || 'Unknown'}</p>
                                <p><strong>Abuse Email:</strong> {affiliate.hostingInfo?.abuseEmail || 'N/A'}</p>
                              </div>
                              
                              <div>
                                <h6 className="font-semibold text-gray-900 mb-2">Registration Data</h6>
                                <p><strong>Total Registrations:</strong> {affiliate.registrationData?.totalRegistrations?.toLocaleString() || 0}</p>
                                <p><strong>Conversion Rate:</strong> {affiliate.registrationData?.conversionRate || '0%'}</p>
                                <p><strong>Avg Deposit:</strong> {affiliate.registrationData?.averageDeposit || '$0'}</p>
                                <p><strong>Last Month:</strong> {affiliate.registrationData?.lastMonthRegistrations?.toLocaleString() || 0}</p>
                              </div>
                            </div>
                            
                            {affiliate.redirectChain && (
                              <div className="mt-3">
                                <h6 className="font-semibold text-gray-900 mb-2">Redirect Chain Analysis</h6>
                                <div className="bg-gray-100 p-2 rounded text-xs font-mono">
                                  {affiliate.redirectChain.map((url: string, idx: number) => (
                                    <div key={idx} className="mb-1">
                                      {idx + 1}. {url}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {affiliate.registrationData?.suspiciousPatterns && affiliate.registrationData.suspiciousPatterns.length > 0 && (
                              <div className="mt-3">
                                <h6 className="font-semibold text-gray-900 mb-2">⚠️ Suspicious Patterns</h6>
                                <ul className="text-xs text-red-700">
                                  {affiliate.registrationData.suspiciousPatterns.map((pattern: string, idx: number) => (
                                    <li key={idx}>• {pattern}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {results[selectedTool].summary && (
                          <div className="card p-4 bg-blue-50 border-blue-200">
                            <h6 className="font-semibold text-gray-900 mb-2">📊 Summary Statistics</h6>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-2xl font-bold text-blue-600">{results[selectedTool].summary.totalRegistrations?.toLocaleString() || 0}</div>
                                <div className="text-gray-600">Total Registrations</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-green-600">{results[selectedTool].summary.averageConversionRate || '0%'}</div>
                                <div className="text-gray-600">Avg Conversion</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-red-600">{results[selectedTool].summary.totalPlayersAffected?.toLocaleString() || 0}</div>
                                <div className="text-gray-600">Players Affected</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-purple-600">{results[selectedTool].summary.dmcaTargets || 0}</div>
                                <div className="text-gray-600">DMCA Targets</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Deep Website Analysis Results */}
                    {selectedTool === 'deep-analysis' && deepAnalysisResult && (
                      <div className="space-y-6">
                        <h5 className="font-medium text-gray-900">🔍 Deep Website Analysis Results</h5>
                        
                        {/* Risk Score */}
                        {deepAnalysisResult.riskScore && (
                          <div className={`card p-4 ${deepAnalysisResult.riskScore.level === 'CRITICAL' ? 'bg-red-50 border-red-200' : 
                            deepAnalysisResult.riskScore.level === 'HIGH' ? 'bg-orange-50 border-orange-200' :
                            deepAnalysisResult.riskScore.level === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                            <h6 className="font-semibold text-gray-900 mb-2">🎯 Risk Assessment</h6>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <div className={`text-3xl font-bold ${deepAnalysisResult.riskScore.level === 'CRITICAL' ? 'text-red-600' : 
                                  deepAnalysisResult.riskScore.level === 'HIGH' ? 'text-orange-600' :
                                  deepAnalysisResult.riskScore.level === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'}`}>
                                  {deepAnalysisResult.riskScore.score}/100
                                </div>
                                <div className="text-sm text-gray-600">Risk Score</div>
                              </div>
                              <div>
                                <div className={`text-xl font-bold ${deepAnalysisResult.riskScore.level === 'CRITICAL' ? 'text-red-600' : 
                                  deepAnalysisResult.riskScore.level === 'HIGH' ? 'text-orange-600' :
                                  deepAnalysisResult.riskScore.level === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'}`}>
                                  {deepAnalysisResult.riskScore.level}
                                </div>
                                <div className="text-sm text-gray-600">Risk Level</div>
                              </div>
                              <div>
                                <div className="text-xl font-bold text-blue-600">{deepAnalysisResult.pages?.length || 0}</div>
                                <div className="text-sm text-gray-600">Pages Analyzed</div>
                              </div>
                            </div>
                            {deepAnalysisResult.riskScore.reasons && (
                              <div className="mt-3">
                                <h6 className="font-semibold text-gray-900 mb-2">Risk Factors:</h6>
                                <ul className="text-sm text-red-700">
                                  {deepAnalysisResult.riskScore.reasons.map((reason: string, idx: number) => (
                                    <li key={idx}>• {reason}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Brand Mentions */}
                        {deepAnalysisResult.brandMentions && deepAnalysisResult.brandMentions.length > 0 && (
                          <div className="card p-4 bg-blue-50 border-blue-200">
                            <h6 className="font-semibold text-gray-900 mb-3">🏷️ Brand Mentions Analysis</h6>
                            {deepAnalysisResult.brandMentions.map((mention: any, idx: number) => (
                              <div key={idx} className="mb-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium">Brand: {mention.brand}</span>
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                    {mention.mentions} mentions
                                  </span>
                                </div>
                                {mention.context && mention.context.length > 0 && (
                                  <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
                                    <strong>Context:</strong> {mention.context[0]}...
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Suspicious Content */}
                        {deepAnalysisResult.suspiciousContent && deepAnalysisResult.suspiciousContent.length > 0 && (
                          <div className="card p-4 bg-red-50 border-red-200">
                            <h6 className="font-semibold text-gray-900 mb-3">⚠️ Suspicious Content Found</h6>
                            {deepAnalysisResult.suspiciousContent.slice(0, 5).map((item: any, idx: number) => (
                              <div key={idx} className="mb-2">
                                <div className="font-medium text-red-800">🚨 {item.keyword}</div>
                                <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded mt-1">
                                  {item.context}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Bonus Offers */}
                        {deepAnalysisResult.bonusOffers && deepAnalysisResult.bonusOffers.length > 0 && (
                          <div className="card p-4 bg-yellow-50 border-yellow-200">
                            <h6 className="font-semibold text-gray-900 mb-3">🎁 Bonus Offers Detected</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {deepAnalysisResult.bonusOffers.slice(0, 8).map((offer: any, idx: number) => (
                                <div key={idx} className={`p-2 rounded text-sm ${offer.suspicious ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                  {offer.suspicious ? '🚨' : '✅'} {offer.text}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Technical Details */}
                        {deepAnalysisResult.technicalDetails && (
                          <div className="card p-4 bg-gray-50 border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">🔧 Technical Analysis</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>SSL Certificate:</strong> {deepAnalysisResult.technicalDetails.ssl ? '✅ Yes' : '❌ No'}
                              </div>
                              <div>
                                <strong>Security Headers:</strong> 
                                {Object.entries(deepAnalysisResult.technicalDetails.securityHeaders || {}).filter(([, value]) => value !== 'missing').length}/4 present
                              </div>
                              <div>
                                <strong>Language:</strong> {deepAnalysisResult.technicalDetails.language || 'Unknown'}
                              </div>
                              <div>
                                <strong>Cookies Enabled:</strong> {deepAnalysisResult.technicalDetails.cookiesEnabled ? 'Yes' : 'No'}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Pages Analyzed */}
                        {deepAnalysisResult.pages && deepAnalysisResult.pages.length > 0 && (
                          <div className="card p-4 bg-purple-50 border-purple-200">
                            <h6 className="font-semibold text-gray-900 mb-3">📄 Pages Analyzed ({deepAnalysisResult.pages.length})</h6>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {deepAnalysisResult.pages.map((page: any, idx: number) => (
                                <div key={idx} className="bg-white p-3 rounded border">
                                  <div className="font-medium text-sm truncate">{page.title || 'Untitled Page'}</div>
                                  <div className="text-xs text-gray-600 truncate">{page.url || deepAnalysisResult.url}</div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {page.bonusOffers && page.bonusOffers.length > 0 && (
                                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                        {page.bonusOffers.length} bonuses
                                      </span>
                                    )}
                                    {page.affiliateLinks && page.affiliateLinks.length > 0 && (
                                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                        {page.affiliateLinks.length} affiliate links
                                      </span>
                                    )}
                                    {page.forms && page.forms.length > 0 && (
                                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                        {page.forms.length} forms
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Raw JSON Data */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900">Raw Data</h5>
                      <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                        {JSON.stringify(results[selectedTool], null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500">No results available for this tool</div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
              {results[selectedTool] && (
                <button
                  onClick={() => {
                    const toolData = {
                      tool: tools.find(t => t.id === selectedTool),
                      results: results[selectedTool],
                      timestamp: new Date().toISOString()
                    };
                    const blob = new Blob([JSON.stringify(toolData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedTool}-detailed-results-${Date.now()}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="btn btn-primary flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Tool Data
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default IGamingTools;
