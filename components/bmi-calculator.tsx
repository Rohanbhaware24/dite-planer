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
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BMIResult {
  bmi: number;
  category: string;
  weightRange: string;
}

export function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculateBMI = () => {
    if (!height || !weight) {
      alert('Please enter both height and weight');
      return;
    }

    let h = parseFloat(height);
    let w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      alert('Please enter valid numbers');
      return;
    }

    let bmi: number;

    if (unit === 'metric') {
      // Convert cm to m
      h = h / 100;
      bmi = w / (h * h);
    } else {
      // Imperial: weight in pounds, height in inches
      bmi = (w / (h * h)) * 703;
    }

    let category = '';
    if (bmi < 18.5) {
      category = 'Underweight';
    } else if (bmi < 25) {
      category = 'Normal Weight';
    } else if (bmi < 30) {
      category = 'Overweight';
    } else {
      category = 'Obese';
    }

    // Calculate healthy weight range
    const minHeight = unit === 'metric' ? h : h / 12;
    const minWeight = 18.5 * minHeight * minHeight;
    const maxWeight = 24.9 * minHeight * minHeight;

    const weightRange = unit === 'metric'
      ? `${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} kg`
      : `${(minWeight * 2.205).toFixed(1)} - ${(maxWeight * 2.205).toFixed(1)} lbs`;

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      category,
      weightRange,
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Underweight':
        return 'bg-blue-100 text-blue-800';
      case 'Normal Weight':
        return 'bg-green-100 text-green-800';
      case 'Overweight':
        return 'bg-yellow-100 text-yellow-800';
      case 'Obese':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>BMI Calculator</CardTitle>
        <CardDescription>Calculate your Body Mass Index</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="unit">Unit System</Label>
            <Select value={unit} onValueChange={(val) => setUnit(val as 'metric' | 'imperial')}>
              <SelectTrigger id="unit" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                <SelectItem value="imperial">Imperial (lbs, inches)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height">
                Height ({unit === 'metric' ? 'cm' : 'inches'})
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="weight">
                Weight ({unit === 'metric' ? 'kg' : 'lbs'})
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <Button onClick={calculateBMI} className="w-full">
            Calculate BMI
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Your BMI:</span>
                  <span className="text-2xl font-bold text-primary">{result.bmi}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Category:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(result.category)}`}>
                    {result.category}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <p className="font-medium mb-1">Healthy Weight Range:</p>
                  <p>{result.weightRange}</p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
