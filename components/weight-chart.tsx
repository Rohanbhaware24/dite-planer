'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressData {
  id: string;
  weight_kg: number;
  recorded_date: string;
  chest_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
}

interface WeightChartProps {
  data: ProgressData[];
  title?: string;
  description?: string;
}

export function WeightChart({
  data,
  title = 'Weight Progress Over Time',
  description = 'Track your weight loss or gain journey',
}: WeightChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>No progress data available. Start logging your weight to see the chart.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for chart
  const chartData = [...data]
    .reverse()
    .map(entry => ({
      date: new Date(entry.recorded_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      weight: parseFloat(entry.weight_kg.toFixed(1)),
      fullDate: entry.recorded_date,
    }));

  // Calculate stats
  const weights = data.map(d => d.weight_kg);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const currentWeight = data[0].weight_kg;
  const firstWeight = data[data.length - 1].weight_kg;
  const totalChange = firstWeight - currentWeight;
  const progressPercent = ((totalChange / firstWeight) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-accent p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Current Weight</p>
            <p className="text-lg font-bold text-foreground">{currentWeight} kg</p>
          </div>
          <div className="bg-accent p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Lowest Weight</p>
            <p className="text-lg font-bold text-green-600">{minWeight} kg</p>
          </div>
          <div className="bg-accent p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Highest Weight</p>
            <p className="text-lg font-bold text-red-600">{maxWeight} kg</p>
          </div>
          <div className="bg-accent p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Total Change</p>
            <p className={`text-lg font-bold ${totalChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {totalChange > 0 ? '+' : ''}{totalChange.toFixed(1)} kg
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={-45}
              height={60}
            />
            <YAxis
              domain={['dataMin - 2', 'dataMax + 2']}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
              }}
              formatter={(value) => {
                if (typeof value === 'number') {
                  return `${value.toFixed(1)} kg`;
                }
                return value;
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#3b82f6"
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              strokeWidth={2}
              name="Weight (kg)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
