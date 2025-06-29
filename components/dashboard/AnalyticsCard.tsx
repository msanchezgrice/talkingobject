'use client';

import { ReactNode } from 'react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export function AnalyticsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  className = '' 
}: AnalyticsCardProps) {
  return (
    <div className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {icon && (
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                {icon}
              </div>
            )}
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </h3>
          </div>
          
          <div className="mb-1">
            <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
          </div>
          
          {subtitle && (
            <p className="text-sm text-gray-500 mb-2">
              {subtitle}
            </p>
          )}
          
          {trend && (
            <div className={`flex items-center text-sm ${
              trend.isUp ? 'text-green-600' : 'text-red-600'
            }`}>
              <svg 
                className={`w-4 h-4 mr-1 ${trend.isUp ? 'rotate-0' : 'rotate-180'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 17l9.2-9.2M17 17V7M17 17H7" 
                />
              </svg>
              <span className="font-medium">
                {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500 ml-1">
                {trend.isUp ? 'increase' : 'decrease'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 