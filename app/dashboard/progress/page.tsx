'use client';

import { useEffect, useState, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressRecord {
  id: string;
  weight_kg: number;
  body_fat_percentage?: number;
  measurements?: any;
  notes?: string;
  recorded_date: string;
}

interface FormData {
  weight_kg: number;
  body_fat_percentage: number;
  measurements: {
    chest_cm?: number;
    waist_cm?: number;
    hips_cm?: number;
    biceps_cm?: number;
  };
  notes: string;
  recorded_date: string;
}

export default function ProgressPage() {
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    weight_kg: 0,
    body_fat_percentage: 0,
    measurements: {},
    notes: '',
    recorded_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/progress');
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      }
    } catch (err) {
      setError('Failed to load progress records');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newRecord = await response.json();
        setRecords([newRecord, ...records]);
        setSuccess('Progress record added successfully!');
        setOpen(false);
        setFormData({
          weight_kg: 0,
          body_fat_percentage: 0,
          measurements: {},
          notes: '',
          recorded_date: new Date().toISOString().split('T')[0],
        });
      } else {
        setError('Failed to save progress record');
      }
    } catch (err) {
      setError('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  // Prepare data for chart
  const chartData = records
    .slice()
    .reverse()
    .map(record => ({
      date: new Date(record.recorded_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: record.weight_kg,
    }));

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const currentWeight = records[0]?.weight_kg;
  const startWeight = records[records.length - 1]?.weight_kg;
  const weightChange = currentWeight && startWeight ? (currentWeight - startWeight) : 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Progress Tracking</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              Log Progress
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Log Your Progress</DialogTitle>
              <DialogDescription>
                Record your weight and measurements
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={formData.recorded_date}
                  onChange={(e) => setFormData({ ...formData, recorded_date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Weight (kg) *</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.weight_kg}
                  onChange={(e) => setFormData({ ...formData, weight_kg: parseFloat(e.target.value) })}
                  placeholder="75"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Body Fat (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.body_fat_percentage}
                  onChange={(e) => setFormData({ ...formData, body_fat_percentage: parseFloat(e.target.value) })}
                  placeholder="20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Chest (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.measurements.chest_cm || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    measurements: { ...formData.measurements, chest_cm: parseFloat(e.target.value) }
                  })}
                  placeholder="100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Waist (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.measurements.waist_cm || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    measurements: { ...formData.measurements, waist_cm: parseFloat(e.target.value) }
                  })}
                  placeholder="85"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="How are you feeling? Any observations?"
                  rows={2}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Record'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {success && (
        <Alert className="mb-6 bg-green-50 text-green-900 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      {records.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentWeight} kg</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Change</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${weightChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {weightChange > 0 ? '+' : ''}{(Math.round(weightChange * 10) / 10)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">kg</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{records.length}</div>
              <p className="text-xs text-muted-foreground mt-1">total entries</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Weight Trend Chart */}
      {records.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Weight Trend</CardTitle>
            <CardDescription>Your weight progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip formatter={(value) => `${value} kg`} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#16a34a"
                  dot={{ fill: '#16a34a' }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Records</CardTitle>
          <CardDescription>All your logged progress entries</CardDescription>
        </CardHeader>
        <CardContent>
          {records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Date</th>
                    <th className="text-left py-3 px-2 font-medium">Weight</th>
                    <th className="text-left py-3 px-2 font-medium">Body Fat</th>
                    <th className="text-left py-3 px-2 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b last:border-0">
                      <td className="py-3 px-2">
                        {new Date(record.recorded_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 font-medium">{record.weight_kg} kg</td>
                      <td className="py-3 px-2">{record.body_fat_percentage ? `${record.body_fat_percentage}%` : '-'}</td>
                      <td className="py-3 px-2 text-muted-foreground">{record.notes?.substring(0, 30) || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-6">No progress records yet. Start logging today!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
