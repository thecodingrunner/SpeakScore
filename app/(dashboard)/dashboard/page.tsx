'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  Settings, 
  TrendingUp, 
  Users, 
  Activity,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Calendar
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}

const StatCard = ({ title, value, change, icon, trend }: StatCardProps) => (
  <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 group">
    <div className="card-body">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm opacity-60 font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${
              trend === 'up' ? 'text-success' : 'text-error'
            }`}>
              <TrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
    </div>
  </div>
);

const QuickAction = ({ title, description, icon, onClick }: QuickActionProps) => (
  <button 
    onClick={onClick}
    className="card bg-base-100 hover:bg-base-200 shadow border border-base-300 hover:border-primary transition-all duration-200 text-left group"
  >
    <div className="card-body p-5">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
            {title}
          </h4>
          <p className="text-sm opacity-60 line-clamp-1">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </button>
);

const ActivityItem = ({ title, description, time, type }: ActivityItemProps) => {
  const colors = {
    success: 'bg-success/10 text-success border-success/20',
    info: 'bg-info/10 text-info border-info/20',
    warning: 'bg-warning/10 text-warning border-warning/20'
  };

  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-base-200/50 transition-colors group">
      <div className={`w-2 h-2 rounded-full mt-2 ${colors[type].split(' ')[0]}`} />
      <div className="flex-1 min-w-0">
        <h5 className="font-medium text-sm group-hover:text-primary transition-colors">
          {title}
        </h5>
        <p className="text-xs opacity-60 mt-0.5">{description}</p>
        <p className="text-xs opacity-40 mt-1">{time}</p>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Configurable mock data - replace with your actual data
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,426',
      change: '+12.5% vs last period',
      icon: <CreditCard className="w-6 h-6" />,
      trend: 'up' as const
    },
    {
      title: 'Active Users',
      value: '2,847',
      change: '+8.2% vs last period',
      icon: <Users className="w-6 h-6" />,
      trend: 'up' as const
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '-0.4% vs last period',
      icon: <Target className="w-6 h-6" />,
      trend: 'down' as const
    },
    {
      title: 'API Calls',
      value: '1.2M',
      change: '+23.1% vs last period',
      icon: <Activity className="w-6 h-6" />,
      trend: 'up' as const
    }
  ];

  const quickActions = [
    {
      title: 'Create New Project',
      description: 'Start a new project from scratch',
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      title: 'Upgrade Plan',
      description: 'Unlock more features and credits',
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: 'View Analytics',
      description: 'Deep dive into your metrics',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      title: 'Schedule Meeting',
      description: 'Book a call with our team',
      icon: <Calendar className="w-5 h-5" />
    }
  ];

  const activities = [
    {
      title: 'New user signup',
      description: 'john.doe@example.com joined your workspace',
      time: '2 minutes ago',
      type: 'success' as const
    },
    {
      title: 'Payment processed',
      description: 'Monthly subscription renewed successfully',
      time: '1 hour ago',
      type: 'info' as const
    },
    {
      title: 'API limit warning',
      description: 'You\'ve used 80% of your monthly quota',
      time: '3 hours ago',
      type: 'warning' as const
    },
    {
      title: 'Report generated',
      description: 'Weekly analytics report is ready',
      time: '5 hours ago',
      type: 'success' as const
    },
    {
      title: 'Integration updated',
      description: 'Slack integration was successfully configured',
      time: '1 day ago',
      type: 'info' as const
    }
  ];

  return (
    <div className="min-h-screen bg-base-200/50">
      {/* Header */}
      <div className="bg-base-100 border-b border-base-300 sticky top-0 z-10 backdrop-blur-sm bg-base-100/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Period Selector */}
              <div className="btn-group">
                {['24h', '7d', '30d', '90d'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`btn btn-sm ${selectedPeriod === period ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <button className="btn btn-ghost btn-circle">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
          <p className="opacity-60">Here's what's happening with your account today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column - Quick Actions & Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <QuickAction key={index} {...action} />
                  ))}
                </div>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="card-title text-lg">Performance Overview</h3>
                  <div className="badge badge-primary badge-sm">Live</div>
                </div>
                <div className="h-64 flex items-center justify-center bg-base-200 rounded-lg border border-base-300">
                  <div className="text-center opacity-40">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Chart component goes here</p>
                    <p className="text-xs mt-1">Integrate your preferred charting library</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Activity Feed */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-lg border border-base-300 sticky top-24">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">Recent Activity</h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {activities.map((activity, index) => (
                    <ActivityItem key={index} {...activity} />
                  ))}
                </div>
                <button className="btn btn-ghost btn-sm w-full mt-4">
                  View All Activity
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}