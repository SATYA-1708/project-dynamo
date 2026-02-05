// src/pages/analytics-dashboard/index.jsx
import React, { useState, useEffect } from 'react';

import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import CommandPalette from '../../components/ui/CommandPalette';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/AppIcon';

const AnalyticsDashboard = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [selectedTeamMember, setSelectedTeamMember] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedChartType, setSelectedChartType] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  // Mock data for analytics
  const kpiData = {
    velocity: { current: 42, previous: 38, trend: 'up', change: 10.5 },
    cycleTime: { current: 3.2, previous: 4.1, trend: 'down', change: -21.9 },
    completionRate: { current: 87, previous: 82, trend: 'up', change: 6.1 },
    burndownHealth: { current: 'Good', status: 'success', score: 85 }
  };

  const cumulativeFlowData = [
    { date: '2024-01-01', todo: 45, inProgress: 12, review: 8, done: 35 },
    { date: '2024-01-08', todo: 42, inProgress: 15, review: 6, done: 42 },
    { date: '2024-01-15', todo: 38, inProgress: 18, review: 9, done: 48 },
    { date: '2024-01-22', todo: 35, inProgress: 14, review: 7, done: 55 },
    { date: '2024-01-29', todo: 32, inProgress: 16, review: 5, done: 62 },
    { date: '2024-02-05', todo: 28, inProgress: 13, review: 8, done: 68 },
    { date: '2024-02-12', todo: 25, inProgress: 11, review: 6, done: 75 }
  ];

  const burndownData = [
    { day: 'Day 1', ideal: 100, actual: 100 },
    { day: 'Day 2', ideal: 90, actual: 95 },
    { day: 'Day 3', ideal: 80, actual: 88 },
    { day: 'Day 4', ideal: 70, actual: 82 },
    { day: 'Day 5', ideal: 60, actual: 75 },
    { day: 'Day 6', ideal: 50, actual: 68 },
    { day: 'Day 7', ideal: 40, actual: 58 },
    { day: 'Day 8', ideal: 30, actual: 45 },
    { day: 'Day 9', ideal: 20, actual: 32 },
    { day: 'Day 10', ideal: 10, actual: 18 },
    { day: 'Day 11', ideal: 0, actual: 8 }
  ];

  const throughputData = [
    { name: 'John Doe', week1: 8, week2: 12, week3: 10, week4: 15 },
    { name: 'Jane Smith', week1: 10, week2: 14, week3: 12, week4: 13 },
    { name: 'Mike Johnson', week1: 6, week2: 9, week3: 11, week4: 10 },
    { name: 'Sarah Wilson', week1: 12, week2: 11, week3: 14, week4: 16 },
    { name: 'Alex Brown', week1: 7, week2: 8, week3: 9, week4: 11 }
  ];

  const velocityForecastData = [
    { sprint: 'Sprint 8', actual: 38, forecast: null, confidence: null },
    { sprint: 'Sprint 9', actual: 42, forecast: null, confidence: null },
    { sprint: 'Sprint 10', actual: 45, forecast: null, confidence: null },
    { sprint: 'Sprint 11', actual: 41, forecast: null, confidence: null },
    { sprint: 'Sprint 12', actual: 47, forecast: null, confidence: null },
    { sprint: 'Sprint 13', actual: null, forecast: 44, confidence: { low: 38, high: 52 } },
    { sprint: 'Sprint 14', actual: null, forecast: 46, confidence: { low: 40, high: 54 } },
    { sprint: 'Sprint 15', actual: null, forecast: 45, confidence: { low: 39, high: 53 } }
  ];

  const commitCorrelationData = [
    { date: '2024-01-01', commits: 15, tasksCompleted: 8 },
    { date: '2024-01-02', commits: 22, tasksCompleted: 12 },
    { date: '2024-01-03', commits: 18, tasksCompleted: 10 },
    { date: '2024-01-04', commits: 25, tasksCompleted: 14 },
    { date: '2024-01-05', commits: 20, tasksCompleted: 11 },
    { date: '2024-01-06', commits: 12, tasksCompleted: 6 },
    { date: '2024-01-07', commits: 8, tasksCompleted: 4 }
  ];

  const taskDistributionData = [
    { name: 'Bug Fixes', value: 35, color: '#EF4444' },
    { name: 'Features', value: 45, color: '#2563EB' },
    { name: 'Improvements', value: 15, color: '#059669' },
    { name: 'Documentation', value: 5, color: '#F59E0B' }
  ];

  const teamMembers = [
    { id: 'all', name: 'All Team Members' },
    { id: 'john', name: 'John Doe' },
    { id: 'jane', name: 'Jane Smith' },
    { id: 'mike', name: 'Mike Johnson' },
    { id: 'sarah', name: 'Sarah Wilson' },
    { id: 'alex', name: 'Alex Brown' }
  ];

  const projects = [
    { id: 'all', name: 'All Projects' },
    { id: 'taskflow', name: 'TaskFlow Pro' },
    { id: 'mobile', name: 'Mobile App' },
    { id: 'api', name: 'API Platform' }
  ];

  const chartTypes = [
    { id: 'all', name: 'All Charts' },
    { id: 'flow', name: 'Flow Diagrams' },
    { id: 'burndown', name: 'Burndown Charts' },
    { id: 'throughput', name: 'Throughput' },
    { id: 'forecast', name: 'Forecasting' }
  ];

  const handleExport = async (type) => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    console.log(`Exporting ${type} report...`);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <CommandPalette />
      
      <main className="lg:ml-60 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <PageHeader 
            actions={
              <>
                <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors duration-200 flex items-center space-x-2">
                  <Icon name="Download" size={16} />
                  <span>Export Data</span>
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2">
                  <Icon name="RefreshCw" size={16} />
                  <span>Refresh</span>
                </button>
              </>
            }
          />

          <div className="flex flex-col xl:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="xl:w-64 space-y-6">
              <div className="bg-surface border border-border rounded-lg p-4">
                <h3 className="font-medium text-text-primary mb-4">Filters</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Team Member</label>
                    <select
                      value={selectedTeamMember}
                      onChange={(e) => setSelectedTeamMember(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.id}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Project</label>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Chart Type</label>
                    <select
                      value={selectedChartType}
                      onChange={(e) => setSelectedChartType(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {chartTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Real-time Status */}
              <div className="bg-surface border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-text-primary">Live Data</span>
                </div>
                <p className="text-xs text-text-secondary">Last updated: 2 minutes ago</p>
                <p className="text-xs text-text-secondary mt-1">Auto-refresh: Every 5 minutes</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Controls Section */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <p className="text-text-secondary">Comprehensive insights into team performance and project metrics</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={selectedDateRange}
                      onChange={(e) => setSelectedDateRange(e.target.value)}
                      className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="1y">Last year</option>
                    </select>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExport('pdf')}
                        disabled={isExporting}
                        className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                      >
                        <Icon name="FileText" size={16} />
                        <span>Export PDF</span>
                      </button>
                      
                      <button
                        onClick={() => handleExport('csv')}
                        disabled={isExporting}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                      >
                        <Icon name="Download" size={16} />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-surface border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Icon name="TrendingUp" size={24} color="var(--color-primary)" />
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${kpiData.velocity.trend === 'up' ? 'text-success' : 'text-error'}`}>
                      <Icon name={kpiData.velocity.trend === 'up' ? 'ArrowUp' : 'ArrowDown'} size={16} />
                      <span>{kpiData.velocity.change}%</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-text-secondary mb-1">Team Velocity</h3>
                  <p className="text-2xl font-bold text-text-primary">{kpiData.velocity.current}</p>
                  <p className="text-xs text-text-secondary mt-1">Story points per sprint</p>
                </div>

                <div className="bg-surface border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                      <Icon name="Clock" size={24} color="var(--color-warning)" />
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${kpiData.cycleTime.trend === 'down' ? 'text-success' : 'text-error'}`}>
                      <Icon name={kpiData.cycleTime.trend === 'down' ? 'ArrowDown' : 'ArrowUp'} size={16} />
                      <span>{Math.abs(kpiData.cycleTime.change)}%</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-text-secondary mb-1">Avg Cycle Time</h3>
                  <p className="text-2xl font-bold text-text-primary">{kpiData.cycleTime.current}d</p>
                  <p className="text-xs text-text-secondary mt-1">Days from start to done</p>
                </div>

                <div className="bg-surface border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                      <Icon name="CheckCircle" size={24} color="var(--color-success)" />
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${kpiData.completionRate.trend === 'up' ? 'text-success' : 'text-error'}`}>
                      <Icon name={kpiData.completionRate.trend === 'up' ? 'ArrowUp' : 'ArrowDown'} size={16} />
                      <span>{kpiData.completionRate.change}%</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-text-secondary mb-1">Completion Rate</h3>
                  <p className="text-2xl font-bold text-text-primary">{kpiData.completionRate.current}%</p>
                  <p className="text-xs text-text-secondary mt-1">Tasks completed on time</p>
                </div>

                <div className="bg-surface border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                      <Icon name="Target" size={24} color="var(--color-accent)" />
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-success">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>{kpiData.burndownHealth.current}</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-text-secondary mb-1">Sprint Health</h3>
                  <p className="text-2xl font-bold text-text-primary">{kpiData.burndownHealth.score}/100</p>
                  <p className="text-xs text-text-secondary mt-1">Burndown trajectory</p>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Cumulative Flow Diagram */}
                <div className="bg-surface border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">Cumulative Flow</h3>
                    <button className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200">
                      <Icon name="MoreHorizontal" size={20} />
                    </button>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cumulativeFlowData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={formatDate}
                          stroke="#64748B"
                          fontSize={12}
                        />
                        <YAxis stroke="#64748B" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area type="monotone" dataKey="done" stackId="1" stroke="#059669" fill="#059669" name="Done" />
                        <Area type="monotone" dataKey="review" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Review" />
                        <Area type="monotone" dataKey="inProgress" stackId="1" stroke="#2563EB" fill="#2563EB" name="In Progress" />
                        <Area type="monotone" dataKey="todo" stackId="1" stroke="#64748B" fill="#64748B" name="To Do" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Burndown Chart */}
                <div className="bg-surface border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">Sprint Burndown</h3>
                    <button className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200">
                      <Icon name="MoreHorizontal" size={20} />
                    </button>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={burndownData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="day" stroke="#64748B" fontSize={12} />
                        <YAxis stroke="#64748B" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="ideal" 
                          stroke="#64748B" 
                          strokeDasharray="5 5"
                          name="Ideal"
                          dot={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="actual" 
                          stroke="#2563EB" 
                          strokeWidth={3}
                          name="Actual"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Team Throughput */}
                <div className="bg-surface border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">Team Throughput</h3>
                    <button className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200">
                      <Icon name="MoreHorizontal" size={20} />
                    </button>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={throughputData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis type="number" stroke="#64748B" fontSize={12} />
                        <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={12} width={80} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="week1" fill="#E2E8F0" name="Week 1" />
                        <Bar dataKey="week2" fill="#CBD5E1" name="Week 2" />
                        <Bar dataKey="week3" fill="#94A3B8" name="Week 3" />
                        <Bar dataKey="week4" fill="#2563EB" name="Week 4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Task Distribution */}
                <div className="bg-surface border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">Task Distribution</h3>
                    <button className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200">
                      <Icon name="MoreHorizontal" size={20} />
                    </button>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {taskDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Advanced Analytics */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Velocity Forecasting */}
                <div className="bg-surface border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">Velocity Forecasting</h3>
                      <p className="text-sm text-text-secondary">Monte Carlo simulation with confidence intervals</p>
                    </div>
                    <button className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200">
                      <Icon name="MoreHorizontal" size={20} />
                    </button>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={velocityForecastData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="sprint" stroke="#64748B" fontSize={12} />
                        <YAxis stroke="#64748B" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="actual" 
                          stroke="#2563EB" 
                          strokeWidth={3}
                          name="Actual Velocity"
                          connectNulls={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="forecast" 
                          stroke="#059669" 
                          strokeWidth={3}
                          strokeDasharray="5 5"
                          name="Forecasted"
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* GitHub Correlation */}
                <div className="bg-surface border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">Code Commit Correlation</h3>
                      <p className="text-sm text-text-secondary">Commits vs task completion</p>
                    </div>
                    <button className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200">
                      <Icon name="MoreHorizontal" size={20} />
                    </button>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={commitCorrelationData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={formatDate}
                          stroke="#64748B" 
                          fontSize={12} 
                        />
                        <YAxis stroke="#64748B" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="commits" 
                          stroke="#F59E0B" 
                          strokeWidth={2}
                          name="Git Commits"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="tasksCompleted" 
                          stroke="#059669" 
                          strokeWidth={2}
                          name="Tasks Completed"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Export Status */}
              {isExporting && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin">
                      <Icon name="Loader2" size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">Generating Report...</p>
                      <p className="text-xs text-primary-600">This may take a few moments</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;