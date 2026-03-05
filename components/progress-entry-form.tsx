'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ProgressEntry {
  weight_kg: number;
  chest_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
  thigh_cm?: number;
  arm_cm?: number;
  notes?: string;
}

interface ProgressEntryFormProps {
  onSuccess?: () => void;
}

export function ProgressEntryForm({ onSuccess }: ProgressEntryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ProgressEntry>({
    weight_kg: 0,
    chest_cm: undefined,
    waist_cm: undefined,
    hips_cm: undefined,
    thigh_cm: undefined,
    arm_cm: undefined,
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'notes' ? value : (value ? parseFloat(value) : undefined),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.weight_kg) {
      setError('Weight is required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight_kg: formData.weight_kg,
          ...(formData.chest_cm && { chest_cm: formData.chest_cm }),
          ...(formData.waist_cm && { waist_cm: formData.waist_cm }),
          ...(formData.hips_cm && { hips_cm: formData.hips_cm }),
          ...(formData.thigh_cm && { thigh_cm: formData.thigh_cm }),
          ...(formData.arm_cm && { arm_cm: formData.arm_cm }),
          ...(formData.notes && { notes: formData.notes }),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to record progress');
      }

      // Reset form
      setFormData({
        weight_kg: 0,
        chest_cm: undefined,
        waist_cm: undefined,
        hips_cm: undefined,
        thigh_cm: undefined,
        arm_cm: undefined,
        notes: '',
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record progress');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Your Progress</CardTitle>
        <CardDescription>Record your weight and body measurements today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Weight - Required */}
          <div>
            <Label htmlFor="weight">Weight (kg) *</Label>
            <Input
              id="weight"
              name="weight_kg"
              type="number"
              step="0.1"
              placeholder="75.5"
              value={formData.weight_kg || ''}
              onChange={handleChange}
              required
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Required field</p>
          </div>

          {/* Body Measurements */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Optional Body Measurements (cm)</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chest">Chest</Label>
                <Input
                  id="chest"
                  name="chest_cm"
                  type="number"
                  step="0.1"
                  placeholder="100"
                  value={formData.chest_cm || ''}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="waist">Waist</Label>
                <Input
                  id="waist"
                  name="waist_cm"
                  type="number"
                  step="0.1"
                  placeholder="85"
                  value={formData.waist_cm || ''}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="hips">Hips</Label>
                <Input
                  id="hips"
                  name="hips_cm"
                  type="number"
                  step="0.1"
                  placeholder="95"
                  value={formData.hips_cm || ''}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="thigh">Thigh</Label>
                <Input
                  id="thigh"
                  name="thigh_cm"
                  type="number"
                  step="0.1"
                  placeholder="55"
                  value={formData.thigh_cm || ''}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="arm">Arm</Label>
                <Input
                  id="arm"
                  name="arm_cm"
                  type="number"
                  step="0.1"
                  placeholder="32"
                  value={formData.arm_cm || ''}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="How are you feeling? Any observations about your progress..."
              value={formData.notes || ''}
              onChange={handleChange}
              rows={3}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Recording Progress...' : 'Record Progress'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
