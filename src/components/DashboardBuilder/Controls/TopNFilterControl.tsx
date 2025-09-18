'use client';

import React from 'react';
import { BaseControlProps, ControlContainer } from './BaseControl';
import { TopNRanking, RankingFunction } from '../types';

export default function TopNFilterControl({ 
  config, 
  value, 
  onChange, 
  className 
}: BaseControlProps) {
  // Value should be an object { ranking: TopNRanking, n: number, rankingFunction: RankingFunction }
  const currentValue = value || { 
    ranking: 'top-n' as TopNRanking, 
    n: 10, 
    rankingFunction: 'rank' as RankingFunction 
  };

  const handleRankingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...currentValue, ranking: e.target.value as TopNRanking });
  };

  const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value) || 1;
    onChange({ ...currentValue, n });
  };

  const handleRankingFunctionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...currentValue, rankingFunction: e.target.value as RankingFunction });
  };

  const rankingOptions = [
    { value: 'top-n', label: 'Top N' },
    { value: 'bottom-n', label: 'Bottom N' },
    { value: 'top-percentile', label: 'Top Percentile' },
    { value: 'bottom-percentile', label: 'Bottom Percentile' }
  ];

  const rankingFunctionOptions = [
    { value: 'rank', label: 'Rank' },
    { value: 'rank-dense', label: 'Dense Rank' },
    { value: 'row-number', label: 'Row Number' }
  ];

  const isPercentile = currentValue.ranking.includes('percentile');

  return (
    <ControlContainer
      label={config.label}
      description={config.description}
      required={config.required}
      showLabel={config.showLabel}
      labelPosition={config.labelPosition}
      alignment={config.alignment}
      className={className}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Ranking Type
            </label>
            <select
              value={currentValue.ranking}
              onChange={handleRankingChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {rankingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {isPercentile ? 'Percentile' : 'N Value'}
            </label>
            <input
              type="number"
              value={currentValue.n}
              onChange={handleNChange}
              min={isPercentile ? 1 : 1}
              max={isPercentile ? 100 : undefined}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Ranking Function
          </label>
          <select
            value={currentValue.rankingFunction}
            onChange={handleRankingFunctionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {rankingFunctionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Description of current settings */}
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <strong>Current Filter:</strong> Show {currentValue.ranking.replace('-', ' ')} {currentValue.n}
          {isPercentile ? '%' : ''} using {currentValue.rankingFunction.replace('-', ' ')} function
        </div>
        
        {/* Help text */}
        <div className="text-xs text-gray-500">
          <p><strong>Rank:</strong> Standard ranking (1, 2, 2, 4)</p>
          <p><strong>Dense Rank:</strong> Dense ranking (1, 2, 2, 3)</p>
          <p><strong>Row Number:</strong> Sequential numbering (1, 2, 3, 4)</p>
        </div>
      </div>
    </ControlContainer>
  );
}
