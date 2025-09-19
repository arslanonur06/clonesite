import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download,
  ExternalLink,
  Shield,
  TrendingUp,
  Globe,
  Smartphone,
  Bitcoin
} from 'lucide-react';
import { ScanResult } from '../types';
import { useWebSocket } from '../hooks/useWebSocket';

const Results: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/scan/${scanId}`);
        if (response.ok) {
          const result = await response.json();
          setScanResult(result);
        }
      } catch (error) {
        console.error('Failed to fetch scan results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (scanId) {
      fetchResults();
    }
  }, [scanId]);

  useEffect(() => {
    if (lastMessage?.type === 'scan_progress' && lastMessage.data.scanId === scanId) {
      setScanResult(prev => prev ? { 
        ...prev, 
        progress: lastMessage.data.progress,
        status: lastMessage.data.status,
        summary: lastMessage.data.summary || prev.summary,
        results: lastMessage.data.results || prev.results
      } : null);
    } else if (lastMessage?.type === 'scan_complete' && lastMessage.data.scanId === scanId) {
      // Refresh data when scan completes
      const fetchResults = async () => {
        try {
          const response = await fetch(`/api/scan/${scanId}`);
          if (response.ok) {
            const result = await response.json();
            setScanResult(result);
          }
        } catch (error) {
          console.error('Failed to fetch final results:', error);
        }
      };
      fetchResults();
    }
  }, [lastMessage, scanId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading scan results...</p>
        </div>
      </div>
    );
  }

  if (!scanResult) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Scan Not Found</h2>
        <p className="text-gray-600">The requested scan could not be found.</p>
      </div>
    );
  }

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'badge-danger';
      case 'high': return 'badge-danger';
      case 'medium': return 'badge-warning';
      case 'low': return 'badge-success';
      default: return 'badge-info';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running': return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'failed': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Scan Results: {scanResult.brand}
          </h1>
          <div className="flex items-center mt-2 space-x-4">
            {getStatusIcon(scanResult.status)}
            <span className="text-sm text-gray-600">
              Started: {new Date(scanResult.startedAt).toLocaleString()}
            </span>
            {scanResult.completedAt && (
              <span className="text-sm text-gray-600">
                Completed: {new Date(scanResult.completedAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button 
            className="btn btn-secondary"
            onClick={async () => {
              try {
                const response = await fetch(`/api/scan/${scanId}/export`);
                if (response.ok) {
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `brand-protection-report-${scanResult.brand}-${Date.now()}.json`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                } else {
                  throw new Error('Export failed');
                }
              } catch (error) {
                console.error('Export failed:', error);
                alert('Export failed. Please try again.');
              }
            }}
            disabled={!scanResult || scanResult.status !== 'completed'}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {scanResult.status === 'running' && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Scan Progress</span>
            <span className="text-sm text-gray-600">{scanResult.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${scanResult.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <Globe className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Domains</p>
              <p className="text-2xl font-bold text-gray-900">{scanResult.summary.totalDomains}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Domains</p>
              <p className="text-2xl font-bold text-gray-900">{scanResult.summary.activeDomains}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Potential Clones</p>
              <p className="text-2xl font-bold text-gray-900">{scanResult.summary.clones}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-gray-900">{scanResult.summary.highRisk}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Results */}
      {scanResult.results.domains.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Domain Threats</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scanResult.results.domains.slice(0, 20).map((domain) => (
                  <tr key={domain.domain}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{domain.domain}</div>
                      <div className="text-sm text-gray-500">{domain.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Typosquatting
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getRiskBadgeColor(domain.riskLevel)}`}>
                        {domain.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {domain.isRegistered ? 'Registered' : 'Available'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-4">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {scanResult.results.domains.length > 20 && (
            <div className="mt-4 text-center">
              <button className="btn btn-secondary">
                Show All {scanResult.results.domains.length} Domains
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mobile App Results */}
      {scanResult.results.mobile.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <Smartphone className="w-5 h-5 inline mr-2" />
            Mobile App Threats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scanResult.results.mobile.map((app, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{app.name}</h3>
                    <p className="text-sm text-gray-600">{app.developer}</p>
                    <p className="text-xs text-gray-500 mt-1">{app.platform.toUpperCase()}</p>
                  </div>
                  <span className={`badge ${getRiskBadgeColor(app.riskLevel)}`}>
                    {app.riskLevel}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-sm text-gray-600">Suspicious reasons:</div>
                  <ul className="text-xs text-gray-500 mt-1">
                    {app.suspiciousReasons.map((reason, idx) => (
                      <li key={idx}>• {reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crypto Threats */}
      {scanResult.results.crypto.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <Bitcoin className="w-5 h-5 inline mr-2" />
            Cryptocurrency Threats
          </h2>
          <div className="space-y-4">
            {scanResult.results.crypto.map((threat, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{threat.domain}</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {threat.type.replace('_', ' ')}
                    </p>
                  </div>
                  <span className={`badge ${getRiskBadgeColor(threat.riskLevel)}`}>
                    {threat.riskLevel}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-sm text-gray-600">Indicators:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {threat.indicators.map((indicator, idx) => (
                      <span key={idx} className="badge badge-info text-xs">
                        {indicator}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {scanResult.status === 'completed' && 
       scanResult.results.domains.length === 0 && 
       scanResult.results.mobile.length === 0 && 
       scanResult.results.crypto.length === 0 && (
        <div className="card text-center py-12">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Threats Detected</h3>
          <p className="text-gray-600">
            Great news! No significant threats were found for your brand during this scan.
          </p>
        </div>
      )}
    </div>
  );
};

export default Results;
