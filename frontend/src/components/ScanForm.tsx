import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, 
  Smartphone, 
  Bitcoin, 
  Eye, 
  Shield, 
  AlertTriangle,
  Gavel,
  MessageCircle,
  Play,
  Settings
} from 'lucide-react';
import { ScanFeature, ScanRequest } from '../types';

const ScanForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<ScanRequest>>({
    brand: '',
    baseUrl: '',
    sequence: '',
    range: 10,
    ctDays: 30,
    logoUrl: '',
    features: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const features: Array<{
    key: ScanFeature;
    name: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    estimatedTime: string;
  }> = [
    {
      key: 'typosquatting',
      name: 'Domain Typosquatting',
      description: 'Detect domain variants across 50+ TLDs with advanced pattern matching',
      icon: Globe,
      color: 'text-blue-600',
      estimatedTime: '2-5 min'
    },
    {
      key: 'visual-ai',
      name: 'Visual AI Detection',
      description: 'Computer vision analysis for logo and design similarity',
      icon: Eye,
      color: 'text-purple-600',
      estimatedTime: '5-10 min'
    },
    {
      key: 'mobile-apps',
      name: 'Mobile App Monitoring',
      description: 'iOS and Android app store scanning with icon comparison',
      icon: Smartphone,
      color: 'text-green-600',
      estimatedTime: '3-7 min'
    },
    {
      key: 'crypto',
      name: 'Cryptocurrency Threats',
      description: 'Fake exchanges, phishing wallets, and blockchain domains',
      icon: Bitcoin,
      color: 'text-yellow-600',
      estimatedTime: '2-4 min'
    },
    {
      key: 'dark-web',
      name: 'Dark Web Monitoring',
      description: 'Underground forums, credential leaks, and Tor network',
      icon: Shield,
      color: 'text-red-600',
      estimatedTime: '5-15 min'
    },
    {
      key: 'threat-intel',
      name: 'Threat Intelligence',
      description: 'Multi-source analysis with VirusTotal, URLVoid, Shodan',
      icon: AlertTriangle,
      color: 'text-orange-600',
      estimatedTime: '1-3 min'
    },
    {
      key: 'social-media',
      name: 'Social Media Threats',
      description: 'Twitter, Telegram, and email security monitoring',
      icon: MessageCircle,
      color: 'text-indigo-600',
      estimatedTime: '2-5 min'
    },
    {
      key: 'legal',
      name: 'Legal Automation',
      description: 'Evidence collection and takedown request preparation',
      icon: Gavel,
      color: 'text-gray-600',
      estimatedTime: '1-2 min'
    }
  ];

  const handleFeatureToggle = (featureKey: ScanFeature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.includes(featureKey)
        ? prev.features.filter(f => f !== featureKey)
        : [...(prev.features || []), featureKey]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.brand || !formData.baseUrl || !formData.features?.length) {
      alert('Please fill in all required fields and select at least one feature');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/scan/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        navigate(`/results/${result.scanId}`);
      } else {
        throw new Error('Failed to start scan');
      }
    } catch (error) {
      console.error('Scan failed:', error);
      alert('Failed to start scan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedTotalTime = formData.features?.reduce((total, featureKey) => {
    const feature = features.find(f => f.key === featureKey);
    const maxTime = parseInt(feature?.estimatedTime.split('-')[1] || '0');
    return total + maxTime;
  }, 0) || 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Start Brand Protection Scan</h1>
        <p className="text-gray-600 mt-2">
          Enter your brand details and select monitoring features to begin comprehensive threat detection.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Brand Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Name *
              </label>
              <input
                type="text"
                className="input"
                placeholder="e.g., kalebet, microsoft, google"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                The main brand name to monitor for threats
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Official Website URL *
              </label>
              <input
                type="url"
                className="input"
                placeholder="https://www.yourbrand.com"
                value={formData.baseUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Your legitimate website for comparison
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <Settings className="w-5 h-5 inline mr-2" />
            Advanced Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sequence Pattern
              </label>
              <input
                type="text"
                className="input"
                placeholder="e.g., yourbrand1256.com"
                value={formData.sequence}
                onChange={(e) => setFormData(prev => ({ ...prev, sequence: e.target.value }))}
              />
              <p className="text-xs text-gray-500 mt-1">
                For numeric sequence monitoring
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sequence Range
              </label>
              <input
                type="number"
                className="input"
                min="1"
                max="50"
                value={formData.range}
                onChange={(e) => setFormData(prev => ({ ...prev, range: parseInt(e.target.value) }))}
              />
              <p className="text-xs text-gray-500 mt-1">
                ±N range around sequence number
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CT Log Days
              </label>
              <input
                type="number"
                className="input"
                min="1"
                max="90"
                value={formData.ctDays}
                onChange={(e) => setFormData(prev => ({ ...prev, ctDays: parseInt(e.target.value) }))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Days back for certificate transparency
              </p>
            </div>
            
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL (Optional)
              </label>
              <input
                type="url"
                className="input"
                placeholder="https://www.yourbrand.com/logo.png"
                value={formData.logoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Logo image for visual comparison (improves accuracy)
              </p>
            </div>
          </div>
        </div>

        {/* Feature Selection */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Select Monitoring Features *
          </h2>
          <p className="text-gray-600 mb-6">
            Choose which types of threats to monitor. More features provide comprehensive protection but take longer to complete.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              const isSelected = formData.features?.includes(feature.key);
              
              return (
                <div
                  key={feature.key}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleFeatureToggle(feature.key)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={isSelected}
                        onChange={() => handleFeatureToggle(feature.key)}
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center mb-2">
                        <IconComponent className={`w-5 h-5 ${feature.color} mr-2`} />
                        <h3 className="font-medium text-gray-900">{feature.name}</h3>
                        <span className="ml-auto text-xs text-gray-500">
                          {feature.estimatedTime}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {formData.features && formData.features.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="font-medium text-blue-900">
                    {formData.features.length} feature{formData.features.length > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-sm text-blue-700">
                    Estimated completion time: ~{estimatedTotalTime} minutes
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !formData.features?.length}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Starting Scan...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Protection Scan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScanForm;
