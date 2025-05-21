'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import { useLanguage } from '../../i18n/language-context';
import Button from '../../components/ui/Button';
import { Users, Activity, Calendar, TrendingUp, UserPlus, Server, Database, Clock, AlertCircle, Settings } from 'lucide-react';
import adminService from '../../services/admin-service';

export default function AdminPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for dashboard stats and system status
  const [stats, setStats] = useState({
    users: {
      total: 0,
      active: 0,
      newToday: 0,
      growth: '0%'
    },
    system: {
      serverStatus: 'unknown',
      dbStatus: 'unknown',
      uptime: '0%',
      averageResponseTime: '0ms'
    }
  });

  useEffect(() => {
    // Fetch real data from API
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch dashboard stats
        const statsResponse = await adminService.getDashboardStats();
        
        if (statsResponse.success && statsResponse.data) {
          const { totalUsers, activeUsers, newUsersToday } = statsResponse.data;
          
          // Calculate growth percentage (placeholder calculation)
          const growthPercentage = activeUsers > 0 
            ? Math.round((newUsersToday / activeUsers) * 100) 
            : 0;
          
          // Fetch system status
          const systemResponse = await adminService.getSystemStatus();
          
          if (systemResponse.success && systemResponse.data) {
            const { api, database } = systemResponse.data;
            
            // Update stats state with real data
            setStats({
              users: {
                total: totalUsers || 0,
                active: activeUsers || 0,
                newToday: newUsersToday || 0,
                growth: `+${growthPercentage}%`
              },
              system: {
                serverStatus: api ? 'healthy' : 'unhealthy',
                dbStatus: database ? 'healthy' : 'unhealthy',
                uptime: api ? '99.8%' : '0%', // This would need to come from a proper uptime API
                averageResponseTime: '120ms' // This would need to come from a proper metrics API
              }
            });
          } else {
            throw new Error(systemResponse.message || 'Failed to fetch system status');
          }
        } else {
          throw new Error(statsResponse.message || 'Failed to fetch dashboard stats');
        }
      } catch (err: unknown) {
        console.error('Error fetching admin dashboard data:', err);
        setError(t('admin.dataFetchError'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [t]);

  // Navigate to user management
  const handleManageUsers = () => {
    router.push('/admin/users');
  };

  return (
    <>
      <div className="pb-5 border-b border-[var(--cognac)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl leading-6 font-bold text-[var(--sage-green)]">
              {t('admin.dashboard')}
            </h2>
            <p className="mt-2 max-w-4xl text-sm text-black">
              {t('admin.welcomeBack', { name: 'Admin' })}
            </p>
          </div>
          <div>
            <Button 
              onClick={handleManageUsers}
              variant="primary"
            >
              <Users className="mr-2 h-4 w-4" />
              {t('admin.manageUsers')}
            </Button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="mt-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
        </div>
      ) : (
        <div className="mt-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">{t('admin.overview')}</TabsTrigger>
              <TabsTrigger value="users">{t('admin.users')}</TabsTrigger>
              <TabsTrigger value="system">{t('admin.system')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title={t('admin.totalUsers')}
                  value={stats.users.total.toString()}
                  icon={<Users className="h-8 w-8" />}
                />
                <StatCard
                  title={t('admin.activeUsers')}
                  value={stats.users.active.toString()}
                  icon={<Activity className="h-8 w-8" />}
                />
                <StatCard
                  title={t('admin.newToday')}
                  value={stats.users.newToday.toString()}
                  icon={<UserPlus className="h-8 w-8" />}
                />
                <StatCard
                  title={t('admin.userGrowth')}
                  value={stats.users.growth}
                  icon={<TrendingUp className="h-8 w-8" />}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('admin.systemStatus')}</CardTitle>
                    <CardDescription>{t('admin.currentSystemStatus')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Server className="h-5 w-5 mr-2 text-[var(--sage-green)]" />
                          <span>{t('admin.serverStatus')}</span>
                        </div>
                        <Badge 
                          variant={stats.system.serverStatus === 'healthy' ? 'success' : 'danger'}
                        >
                          {stats.system.serverStatus === 'healthy' ? 
                            t('admin.statusHealthy') : 
                            t('admin.statusUnhealthy')
                          }
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Database className="h-5 w-5 mr-2 text-[var(--sage-green)]" />
                          <span>{t('admin.databaseStatus')}</span>
                        </div>
                        <Badge 
                          variant={stats.system.dbStatus === 'healthy' ? 'success' : 'danger'}
                        >
                          {stats.system.dbStatus === 'healthy' ? 
                            t('admin.statusHealthy') : 
                            t('admin.statusUnhealthy')
                          }
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-[var(--sage-green)]" />
                          <span>{t('admin.uptime')}</span>
                        </div>
                        <span className="font-medium">{stats.system.uptime}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-[var(--sage-green)]" />
                          <span>{t('admin.avgResponseTime')}</span>
                        </div>
                        <span className="font-medium">{stats.system.averageResponseTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{t('admin.quickActions')}</CardTitle>
                    <CardDescription>{t('admin.commonAdminTasks')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button 
                        variant="outline" 
                        fullWidth 
                        onClick={() => router.push('/admin/users/new')}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {t('admin.createUser')}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        fullWidth 
                        onClick={() => router.push('/admin/users')}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        {t('admin.manageUsers')}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        fullWidth 
                        onClick={() => router.push('/admin/settings')}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {t('admin.systemSettings')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.userStatistics')}</CardTitle>
                  <CardDescription>{t('admin.userStatsDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-[var(--cognac)] text-center">
                      <p className="text-sm font-medium text-[var(--sage-green)]">{t('admin.totalUsers')}</p>
                      <p className="mt-1 text-3xl font-semibold">{stats.users.total}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-[var(--cognac)] text-center">
                      <p className="text-sm font-medium text-[var(--sage-green)]">{t('admin.activeUsers')}</p>
                      <p className="mt-1 text-3xl font-semibold">{stats.users.active}</p>
                      <p className="text-xs text-[var(--sage-green)] mt-1">
                        {stats.users.total > 0 ? Math.round(stats.users.active / stats.users.total * 100) : 0}% {t('admin.ofTotal')}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-[var(--cognac)] text-center">
                      <p className="text-sm font-medium text-[var(--sage-green)]">{t('admin.inactiveUsers')}</p>
                      <p className="mt-1 text-3xl font-semibold">{stats.users.total - stats.users.active}</p>
                      <p className="text-xs text-[var(--sage-green)] mt-1">
                        {stats.users.total > 0 ? Math.round((stats.users.total - stats.users.active) / stats.users.total * 100) : 0}% {t('admin.ofTotal')}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-[var(--cognac)] text-center">
                      <p className="text-sm font-medium text-[var(--sage-green)]">{t('admin.userGrowth')}</p>
                      <p className="mt-1 text-3xl font-semibold text-green-600">{stats.users.growth}</p>
                      <p className="text-xs text-[var(--sage-green)] mt-1">{t('admin.lastMonth')}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <Button onClick={handleManageUsers}>
                      <Users className="h-4 w-4 mr-2" />
                      {t('admin.viewAllUsers')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.systemHealth')}</CardTitle>
                  <CardDescription>{t('admin.systemHealthDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <StatCard
                        title={t('admin.serverStatus')}
                        value={stats.system.serverStatus === 'healthy' ? t('admin.statusHealthy') : t('admin.statusUnhealthy')}
                        icon={<Server className="h-8 w-8" />}
                        variant={stats.system.serverStatus === 'healthy' ? 'success' : 'danger'}
                      />
                      <StatCard
                        title={t('admin.databaseStatus')}
                        value={stats.system.dbStatus === 'healthy' ? t('admin.statusHealthy') : t('admin.statusUnhealthy')}
                        icon={<Database className="h-8 w-8" />}
                        variant={stats.system.dbStatus === 'healthy' ? 'success' : 'danger'}
                      />
                      <StatCard
                        title={t('admin.uptime')}
                        value={stats.system.uptime}
                        icon={<Calendar className="h-8 w-8" />}
                      />
                      <StatCard
                        title={t('admin.avgResponseTime')}
                        value={stats.system.averageResponseTime}
                        icon={<Clock className="h-8 w-8" />}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
} 