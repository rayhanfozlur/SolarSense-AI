import React from 'react';
import { FileText, Cpu, Cloud, Shield, Zap, Network, Database, Code } from 'lucide-react';

export default function Documentation() {
  const sections = [
    {
      title: 'System Architecture',
      icon: Network,
      color: 'from-cyan-500 to-blue-400',
      content: [
        {
          subtitle: 'Hardware Components',
          details: [
            'ESP32/ARM Cortex-M microcontrollers for edge computing',
            'Hall-effect current sensors for real-time power monitoring',
            'Voltage sensors for panel output measurement',
            'Temperature sensors (thermal) for overheating detection',
            'Environmental sensors: irradiance & dust level monitoring',
            'Modular PCB design for scalable assembly'
          ]
        },
        {
          subtitle: 'Communication Protocols',
          details: [
            'LoRaWAN for long-range, low-bandwidth communication',
            'Wi-Fi/LTE for urban installations',
            'MQTT for secure data transmission',
            'Offline data buffering during outages',
            'OTA firmware updates'
          ]
        }
      ]
    },
    {
      title: 'AI/ML Predictive Engine',
      icon: Cpu,
      color: 'from-purple-500 to-pink-400',
      content: [
        {
          subtitle: 'Prediction Capabilities',
          details: [
            'Inverter failure prediction with time-to-failure estimates',
            'Panel degradation trend analysis',
            'Soiling loss detection',
            'Temperature stress identification',
            'Anomaly detection in time-series data',
            'Self-learning algorithms that improve over time'
          ]
        },
        {
          subtitle: 'Model Features',
          details: [
            'Real-time inference on edge devices',
            'Historical data pattern recognition',
            'Fleet-level diagnostics across multiple sites',
            'Confidence scoring for predictions',
            'Remaining useful life (RUL) forecasting'
          ]
        }
      ]
    },
    {
      title: 'Cloud Infrastructure',
      icon: Cloud,
      color: 'from-emerald-500 to-green-400',
      content: [
        {
          subtitle: 'Backend Architecture',
          details: [
            'Cloud-agnostic design (AWS, Google Cloud, Azure compatible)',
            'Time-series database for performance data',
            'MQTT broker for IoT data ingestion',
            'RESTful API for dashboard integration',
            'Scalable microservices architecture',
            'Real-time alerting system'
          ]
        },
        {
          subtitle: 'Data Management',
          details: [
            'Automated data backup and recovery',
            'Multi-site data aggregation',
            'Export capabilities (CSV, JSON, XML)',
            'Integration with third-party tools (Power BI, Tableau)',
            'Historical data retention policies'
          ]
        }
      ]
    },
    {
      title: 'Cybersecurity',
      icon: Shield,
      color: 'from-red-500 to-orange-400',
      content: [
        {
          subtitle: 'Security Measures',
          details: [
            'End-to-end SSL/TLS encryption',
            'Device authentication and authorization',
            'Firmware integrity checks',
            'Role-based access control (RBAC)',
            'Secure data storage with encryption at rest',
            'Regular security audits and penetration testing'
          ]
        }
      ]
    },
    {
      title: 'Mass Production Strategy',
      icon: Zap,
      color: 'from-amber-500 to-yellow-400',
      content: [
        {
          subtitle: 'Cost Optimization',
          details: [
            'Target: Sub-$60 per unit manufacturing cost',
            'Commodity component selection',
            'Modular design for easy assembly',
            'Weatherproof, durable enclosures',
            'Open-source firmware (no licensing fees)',
            'Local assembly facilitation for domestic production'
          ]
        },
        {
          subtitle: 'Scalability',
          details: [
            'Residential single-node deployments',
            'Commercial multi-inverter installations',
            'Community solar projects',
            'Rural/off-grid low-bandwidth networks',
            'Utility-scale microgrid monitoring'
          ]
        }
      ]
    },
    {
      title: 'Integration Ecosystem',
      icon: Database,
      color: 'from-indigo-500 to-purple-400',
      content: [
        {
          subtitle: 'Compatibility',
          details: [
            'Works with existing inverters and batteries',
            'API for smart grid system integration',
            'Third-party monitoring platform support',
            'Smart energy management system (SEMS) integration',
            'Data export for external analysis tools'
          ]
        }
      ]
    },
    {
      title: 'Technical Specifications',
      icon: Code,
      color: 'from-teal-500 to-cyan-400',
      content: [
        {
          subtitle: 'Sensor Specifications',
          details: [
            'Voltage Range: 0-600V DC',
            'Current Range: 0-100A',
            'Temperature Range: -40°C to +85°C',
            'Irradiance: 0-1400 W/m²',
            'Sampling Rate: 1 Hz (configurable)',
            'Accuracy: ±2% for voltage/current, ±1°C for temperature'
          ]
        },
        {
          subtitle: 'Communication Specs',
          details: [
            'LoRaWAN: 15km range (line of sight)',
            'Wi-Fi: 802.11 b/g/n',
            'LTE: Cat-M1/NB-IoT',
            'Data Rate: 50-250 kbps (LoRa), up to 10 Mbps (Wi-Fi)',
            'Power Consumption: 50-200mW (sleep mode: <1mW)'
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          System Documentation
        </h1>
        <p className="text-slate-400">Complete technical specifications and architecture overview</p>
      </div>

      {/* Executive Summary */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Executive Summary</h2>
        </div>
        <div className="space-y-4 text-slate-300 leading-relaxed">
          <p>
            <strong className="text-white">SolarAI Predictive Diagnostics Platform</strong> is an advanced solar health monitoring system 
            that combines edge computing, AI/ML predictive analytics, and cloud infrastructure to deliver real-time 
            performance monitoring and failure prediction for solar installations.
          </p>
          <p>
            The platform leverages <strong className="text-cyan-400">low-cost IoT sensors</strong> (sub-$60 per unit) 
            deployed at solar sites to collect voltage, current, temperature, and environmental data. This data is 
            processed locally using <strong className="text-purple-400">edge AI algorithms</strong> for immediate 
            anomaly detection, while comprehensive analytics are performed in the cloud.
          </p>
          <p>
            Our <strong className="text-emerald-400">machine learning models</strong> analyze historical and real-time 
            data to predict component failures (inverters, panels, sensors) with up to 94% accuracy, providing 
            time-to-failure estimates and recommended maintenance schedules. This predictive approach reduces downtime, 
            extends equipment life, and optimizes maintenance costs.
          </p>
          <p>
            The system supports <strong className="text-amber-400">multi-site fleet monitoring</strong>, making it 
            suitable for residential, commercial, industrial, and utility-scale deployments. It integrates seamlessly 
            with existing solar infrastructure and third-party energy management systems.
          </p>
          <p className="text-white font-semibold pt-4">
            National Impact: This platform aligns with U.S. energy priorities by improving solar reliability, 
            reducing maintenance costs, supporting grid resilience, and accelerating clean energy adoption through 
            accessible, affordable monitoring technology.
          </p>
        </div>
      </div>

      {/* Documentation Sections */}
      {sections.map((section, idx) => {
        const Icon = section.icon;
        return (
          <div
            key={idx}
            className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">{section.title}</h2>
            </div>

            <div className="space-y-6">
              {section.content.map((subsection, subIdx) => (
                <div key={subIdx}>
                  <h3 className="text-lg font-bold text-cyan-400 mb-4">{subsection.subtitle}</h3>
                  <ul className="space-y-3">
                    {subsection.details.map((detail, detailIdx) => (
                      <li key={detailIdx} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${section.color} mt-2 shrink-0`} />
                        <span className="text-slate-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* National Impact Statement */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 border border-blue-500/30 p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">National Impact Statement</h2>
        <div className="space-y-4 text-slate-300 leading-relaxed">
          <p>
            <strong className="text-cyan-400">Energy Security:</strong> By improving solar system reliability and 
            reducing downtime, this platform strengthens U.S. energy independence and reduces reliance on imported 
            fossil fuels.
          </p>
          <p>
            <strong className="text-emerald-400">Decarbonization Goals:</strong> Enhanced solar performance directly 
            supports federal and state clean energy targets, helping achieve net-zero emissions by 2050.
          </p>
          <p>
            <strong className="text-purple-400">Grid Resilience:</strong> Predictive maintenance prevents sudden solar 
            generation drops, supporting grid stability and enabling higher renewable penetration.
          </p>
          <p>
            <strong className="text-amber-400">Economic Impact:</strong> Domestic production and local assembly create 
            manufacturing jobs while the sub-$60 cost makes solar monitoring accessible to underserved communities.
          </p>
          <p>
            <strong className="text-pink-400">Clean Energy Equity:</strong> Affordable monitoring technology democratizes 
            access to advanced solar diagnostics, supporting environmental justice and community solar initiatives.
          </p>
          <p className="text-white font-semibold pt-4">
            This platform represents a critical infrastructure investment that accelerates the clean energy transition 
            while creating economic opportunity and supporting national energy resilience.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-slate-800">
        <p className="text-slate-500 text-sm">
          SolarAI Predictive Diagnostics Platform • Version 1.0 • {new Date().getFullYear()}
        </p>
        <p className="text-slate-600 text-xs mt-2">
          Advancing clean energy through intelligent monitoring and predictive maintenance
        </p>
      </div>
    </div>
  );
}