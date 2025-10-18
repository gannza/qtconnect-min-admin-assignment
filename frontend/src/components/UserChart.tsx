import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData } from '../types';

interface UserChartProps {
  data: ChartData[];
}

const UserChart = ({ data }: UserChartProps) => {
  // Format data for the chart
  const chartData = data.map(stat => ({
    date: new Date(stat.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    users: stat.count,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              color: 'hsl(var(--foreground))',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Bar 
            dataKey="users" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]}
            className="opacity-80 hover:opacity-100 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserChart;
