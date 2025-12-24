import React from 'react';
import { Brain, TrendingDown, Wrench, Calendar } from 'lucide-react';

export default function PredictiveInsights({ predictions }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
          <Brain className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">AI Predictive Insights</h3>
          <p className="text-sm text-slate-400">Machine learning diagnostics</p>
        </div>
      </div>

      <div className="space-y-4">
        {predictions && predictions.length > 0 ? (
          predictions.map((prediction) => (
            <div
              key={prediction.id}
              className="rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-5 hover:border-purple-500/40 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    {prediction.component_type} - {prediction.prediction_type}
                  </h4>
                  <p className="text-sm text-slate-400">{prediction.component_id}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-purple-400">
                    {prediction.probability}%
                  </div>
                  <p className="text-xs text-slate-500">probability</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 rounded-lg">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-500">RUL</p>
                    <p className="text-sm font-semibold text-white">
                      {prediction.remaining_useful_life_days} days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 rounded-lg">
                  <TrendingDown className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="text-xs text-slate-500">Confidence</p>
                    <p className="text-sm font-semibold text-white">
                      {prediction.confidence}%
                    </p>
                  </div>
                </div>
              </div>

              {prediction.contributing_factors && prediction.contributing_factors.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Contributing Factors:</p>
                  <div className="flex flex-wrap gap-2">
                    {prediction.contributing_factors.map((factor, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-slate-900/50 text-slate-300 rounded-lg border border-slate-700/50"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">AI analysis in progress...</p>
          </div>
        )}
      </div>
    </div>
  );
}