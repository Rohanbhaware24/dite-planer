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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DietPlan {
  id: string;
  name: string;
  description: string;
  daily_calories: number;
  macros: any;
  meal_count: number;
  duration_days: number;
  type: string;
  created_at: string;
}

interface FormData {
  name: string;
  description: string;
  daily_calories: number;
  macros: {
    protein_percent: number;
    carbs_percent: number;
    fat_percent: number;
  };
  meal_count: number;
  duration_days: number;
  type: string;
}

export default function DietPlansPage() {
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    daily_calories: 2000,
    macros: { protein_percent: 30, carbs_percent: 40, fat_percent: 30 },
    meal_count: 3,
    duration_days: 30,
    type: 'balanced',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/diet-plans');
      if (response.ok) {
        const data = await response.json();
        const normalized = data.map((p: any) => ({ ...p, id: p.id || p._id }));
        setPlans(normalized);
      }
    } catch (err) {
      setError('Failed to load diet plans');
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
      const response = await fetch('/api/diet-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newPlan = await response.json();
        setPlans([newPlan, ...plans]);
        setSuccess('Diet plan created successfully!');
        setOpen(false);
        setFormData({
          name: '',
          description: '',
          daily_calories: 2000,
          macros: { protein_percent: 30, carbs_percent: 40, fat_percent: 30 },
          meal_count: 3,
          duration_days: 30,
          type: 'balanced',
        });
      } else {
        setError('Failed to create diet plan');
      }
    } catch (err) {
      setError('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Diet Plans</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              Create New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Diet Plan</DialogTitle>
              <DialogDescription>
                Create a personalized diet plan tailored to your goals
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
                <label className="text-sm font-medium">Plan Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Weight Loss Plan"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="high_protein">High Protein</SelectItem>
                    <SelectItem value="low_carb">Low Carb</SelectItem>
                    <SelectItem value="high_carb">High Carb</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Daily Calories</label>
                <Input
                  type="number"
                  value={formData.daily_calories}
                  onChange={(e) => setFormData({ ...formData, daily_calories: parseInt(e.target.value) })}
                  placeholder="2000"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Meals per Day</label>
                <Input
                  type="number"
                  value={formData.meal_count}
                  onChange={(e) => setFormData({ ...formData, meal_count: parseInt(e.target.value) })}
                  placeholder="3"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (days)</label>
                <Input
                  type="number"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                  placeholder="30"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your diet plan goals..."
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={saving}
              >
                {saving ? 'Creating...' : 'Create Plan'}
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

      {plans.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id || plan._id}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.type}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Calories/Day</p>
                    <p className="font-semibold">{plan.daily_calories}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Meals/Day</p>
                    <p className="font-semibold">{plan.meal_count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-semibold">{plan.duration_days}d</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs font-medium mb-2">Macros</p>
                  <div className="space-y-1 text-xs">
                    <p>Protein: {plan.macros?.protein_percent || 30}%</p>
                    <p>Carbs: {plan.macros?.carbs_percent || 40}%</p>
                    <p>Fat: {plan.macros?.fat_percent || 30}%</p>
                  </div>
                </div>

                <Button asChild variant="outline" className="w-full">
                  <a href={`/dashboard/diet-plans/${plan.id || plan._id}`}>View Details</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No diet plans yet. Create your first one!</p>
            <Button className="bg-green-600 hover:bg-green-700">
              Create Diet Plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
