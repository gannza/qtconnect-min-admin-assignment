import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserStats, fetchChartData } from '../store/slices/userSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import UserChart from '../components/UserChart';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { userStats, chartData, loading, error } = useAppSelector((state) => state.users);
  const [selectedDays, setSelectedDays] = useState(7);

  useEffect(() => {
    dispatch(fetchUserStats());
    dispatch(fetchChartData(selectedDays));
  }, [dispatch, selectedDays]);

  const handleDaysChange = (days: string) => {
    setSelectedDays(parseInt(days));
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        <p>Error loading dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your admin panel and user statistics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Users - Blue theme */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Users</CardTitle>
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{userStats?.total || 0}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              All registered users
            </p>
          </CardContent>
        </Card>

        {/* Admins - Purple theme */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Admins</CardTitle>
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{userStats?.admins || 0}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Administrators
            </p>
          </CardContent>
        </Card>

        {/* Regular Users - Green theme */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Regular Users</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{userStats?.regular || 0}</div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Regular users
            </p>
          </CardContent>
        </Card>

        {/* Active Users - Emerald theme */}
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 dark:border-emerald-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Active Users</CardTitle>
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{userStats?.active || 0}</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              Currently active
            </p>
          </CardContent>
        </Card>

        {/* Inactive Users - Red theme */}
        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 dark:border-red-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Inactive Users</CardTitle>
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">{userStats?.inactive || 0}</div>
            <p className="text-xs text-red-600 dark:text-red-400">
              Currently inactive
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Registration Trends</CardTitle>
              <CardDescription>
                Number of users created per day over the last {selectedDays} days
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="days-select" className="text-sm font-medium text-muted-foreground">
                Period:
              </label>
              <Select value={selectedDays.toString()} onValueChange={handleDaysChange}>
                <SelectTrigger id="days-select" className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <UserChart data={chartData || []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
