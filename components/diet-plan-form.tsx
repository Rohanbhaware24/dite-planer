'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DietPlanFormProps {
  onSuccess?: () => void;
}

export function DietPlanForm({ onSuccess }: DietPlanFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'balanced',
    duration_days: 30,
    daily_calories: 2000,
    daily_protein_g: 100,
    daily_carbs_g: 250,
    daily_fats_g: 65,
    description: '',
    restrictions: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = [
      'duration_days',
      'daily_calories',
      'daily_protein_g',
      'daily_carbs_g',
      'daily_fats_g',
    ];
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? (value === '' ? '' : parseInt(value, 10))
        : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration_days' ? parseInt(value, 10) : value,
    }));
  };

  const calculateMacrosByType = () => {
    const calories = formData.daily_calories;
    let protein = 0, carbs = 0, fats = 0;

    switch (formData.type) {
      case 'highProtein':
        protein = Math.round((calories * 0.35) / 4);
        carbs = Math.round((calories * 0.45) / 4);
        fats = Math.round((calories * 0.2) / 9);
        break;
      case 'lowCarb':
        protein = Math.round((calories * 0.3) / 4);
        carbs = Math.round((calories * 0.2) / 4);
        fats = Math.round((calories * 0.5) / 9);
        break;
      case 'balanced':
      default:
        protein = Math.round((calories * 0.3) / 4);
        carbs = Math.round((calories * 0.5) / 4);
        fats = Math.round((calories * 0.2) / 9);
    }

    setFormData(prev => ({
      ...prev,
      daily_protein_g: protein,
      daily_carbs_g: carbs,
      daily_fats_g: fats,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/diet-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create diet plan');
      }

      // Reset form
      setFormData({
        name: '',
        type: 'balanced',
        duration_days: 30,
        daily_calories: 2000,
        daily_protein_g: 100,
        daily_carbs_g: 250,
        daily_fats_g: 65,
        description: '',
        restrictions: '',
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create diet plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Diet Plan</CardTitle>
        <CardDescription>Design a personalized nutrition plan for your health goals</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Summer Body Plan"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="type">Diet Type</Label>
              <Select value={formData.type} onValueChange={(val) => {
                handleSelectChange('type', val);
                setFormData(prev => ({ ...prev, type: val }));
              }}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced Diet</SelectItem>
                  <SelectItem value="highProtein">High Protein</SelectItem>
                  <SelectItem value="lowCarb">Low Carb</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                name="duration_days"
                type="number"
                min="7"
                max="365"
                value={formData.duration_days}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="calories">Daily Calories</Label>
              <Input
                id="calories"
                name="daily_calories"
                type="number"
                min="1000"
                max="5000"
                value={formData.daily_calories}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={calculateMacrosByType}
            className="w-full"
          >
            Auto-Calculate Macros for {formData.type}
          </Button>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="protein">Daily Protein (g)</Label>
              <Input
                id="protein"
                name="daily_protein_g"
                type="number"
                min="0"
                value={formData.daily_protein_g}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="carbs">Daily Carbs (g)</Label>
              <Input
                id="carbs"
                name="daily_carbs_g"
                type="number"
                min="0"
                value={formData.daily_carbs_g}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="fats">Daily Fats (g)</Label>
              <Input
                id="fats"
                name="daily_fats_g"
                type="number"
                min="0"
                value={formData.daily_fats_g}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the goals and focus of this diet plan..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="restrictions">Dietary Restrictions</Label>
            <Textarea
              id="restrictions"
              name="restrictions"
              placeholder="e.g., No dairy, No gluten, Allergies..."
              value={formData.restrictions}
              onChange={handleChange}
              rows={2}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Creating Plan...' : 'Create Diet Plan'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
