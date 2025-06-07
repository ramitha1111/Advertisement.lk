import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Eye, DollarSign, Package, Calendar, 
  MapPin, Star, Activity, Filter, RefreshCw 
} from 'lucide-react';
import { getAdvertisementsByUser } from '../../api/advertisementApi';
import useAuth from '../../hooks/useAuth';

const AdStats = ({ userId }) => {
  const { user, token } = useAuth();
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('all'); // all, 30d, 7d, 1d
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Color palette for charts
  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'];

  useEffect(() => {
    fetchAdvertisements();
  }, [userId, token]);

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const targetUserId = userId || user?._id || user?.id;
      if (!targetUserId || !token) return;

      const data = await getAdvertisementsByUser(targetUserId, token);
      setAdvertisements(data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching advertisements:', err);
      setError('Failed to load advertisement data');
    } finally {
      setLoading(false);
    }
  };

  // Filter advertisements based on date range
  const filteredAds = useMemo(() => {
    let filtered = advertisements;

    // Date filtering
    if (dateRange !== 'all') {
      const now = new Date();
      const days = dateRange === '30d' ? 30 : dateRange === '7d' ? 7 : 1;
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(ad => {
        const adDate = new Date(ad.createdAt);
        return adDate >= cutoffDate;
      });
    }

    // Category filtering
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ad => ad.categoryId === selectedCategory);
    }

    return filtered;
  }, [advertisements, dateRange, selectedCategory]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAds = filteredAds.length;
    const totalViews = filteredAds.reduce((sum, ad) => sum + parseInt(ad.views || 0), 0);
    const averagePrice = totalAds > 0 ? 
      filteredAds.reduce((sum, ad) => sum + (ad.price || 0), 0) / totalAds : 0;
    const boostedAds = filteredAds.filter(ad => ad.isBoosted === 1).length;
    const visibleAds = filteredAds.filter(ad => ad.isVisible === 1).length;
    const activeAds = filteredAds.filter(ad => ad.status === 'active').length;

    return {
      totalAds,
      totalViews,
      averagePrice,
      boostedAds,
      visibleAds,
      activeAds,
      averageViewsPerAd: totalAds > 0 ? Math.round(totalViews / totalAds) : 0
    };
  }, [filteredAds]);

  // Prepare chart data
  const chartData = useMemo(() => {
    // Views by category
    const viewsByCategory = {};
    filteredAds.forEach(ad => {
      const category = ad.categoryId || 'Unknown';
      viewsByCategory[category] = (viewsByCategory[category] || 0) + parseInt(ad.views || 0);
    });

    const categoryData = Object.entries(viewsByCategory).map(([category, views]) => ({
      category,
      views,
      ads: filteredAds.filter(ad => ad.categoryId === category).length
    }));

    // Ads created over time (last 30 days)
    const timeData = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const adsOnDate = advertisements.filter(ad => {
        const adDate = new Date(ad.createdAt);
        return adDate.toISOString().split('T')[0] === dateStr;
      }).length;
      
      timeData.push({
        date: dateStr,
        ads: adsOnDate,
        day: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }

    // Price distribution
    const priceRanges = {
      '0-100': 0,
      '101-500': 0,
      '501-1000': 0,
      '1001-5000': 0,
      '5000+': 0
    };

    filteredAds.forEach(ad => {
      const price = ad.price || 0;
      if (price <= 100) priceRanges['0-100']++;
      else if (price <= 500) priceRanges['101-500']++;
      else if (price <= 1000) priceRanges['501-1000']++;
      else if (price <= 5000) priceRanges['1001-5000']++;
      else priceRanges['5000+']++;
    });

    const priceData = Object.entries(priceRanges).map(([range, count]) => ({
      range,
      count
    }));

    // Status distribution
    const statusData = {};
    filteredAds.forEach(ad => {
      const status = ad.status || 'unknown';
      statusData[status] = (statusData[status] || 0) + 1;
    });

    const statusChartData = Object.entries(statusData).map(([status, count]) => ({
      status,
      count
    }));

    return { categoryData, timeData, priceData, statusChartData };
  }, [filteredAds, advertisements]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(advertisements.map(ad => ad.categoryId))];
    return uniqueCategories.filter(Boolean);
  }, [advertisements]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={fetchAdvertisements}
          className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Activity className="h-6 w-6 mr-2 text-blue-500" />
          Advertisement Analytics
        </h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Time</option>
            <option value="30d">Last 30 Days</option>
            <option value="7d">Last 7 Days</option>
            <option value="1d">Last 24 Hours</option>
          </select>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <button
            onClick={fetchAdvertisements}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Ads</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalAds}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Total Views</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Avg. Price</p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">${stats.averagePrice.toFixed(0)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Boosted Ads</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.boostedAds}</p>
            </div>
            <Star className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Active Ads</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.activeAds}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Visible Ads</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.visibleAds}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Avg. Views/Ad</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.averageViewsPerAd}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views by Category */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Views by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ads Created Over Time */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ads Created (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.timeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ads" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Price Distribution */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ad Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {chartData.statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdStats;