'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplet, Plus, Minus } from 'lucide-react';

interface WaterTrackerProps {
  initialIntake?: number;
  dailyGoal?: number;
}

export function WaterTracker({ initialIntake = 0, dailyGoal = 2000 }: WaterTrackerProps) {
  const [intake, setIntake] = useState(initialIntake);

  const percentage = Math.min((intake / dailyGoal) * 100, 100);
  const glassesConsumed = Math.round(intake / 250);
  const glassesGoal = Math.round(dailyGoal / 250);

  const addWater = (amount: number) => {
    setIntake(prev => prev + amount);
  };

  const removeWater = () => {
    setIntake(prev => Math.max(0, prev - 250));
  };

  const reset = () => {
    setIntake(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-500" />
          Water Intake Tracker
        </CardTitle>
        <CardDescription>Stay hydrated throughout the day</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          {/* Circular Progress */}
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-accent"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-primary transition-all duration-300"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentage / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-foreground">{Math.round(percentage)}%</p>
              <p className="text-xs text-muted-foreground">of daily goal</p>
            </div>
          </div>

          {/* Stats */}
          <div className="text-center space-y-1">
            <p className="text-2xl font-bold text-foreground">{glassesConsumed}/{glassesGoal} glasses</p>
            <p className="text-sm text-muted-foreground">{intake} / {dailyGoal} ml</p>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={() => addWater(250)}
            className="flex flex-col items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs">250ml</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => addWater(500)}
            className="flex flex-col items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs">500ml</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => addWater(750)}
            className="flex flex-col items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs">750ml</span>
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={removeWater}
            className="flex-1"
          >
            <Minus className="h-4 w-4 mr-2" />
            Remove
          </Button>
          <Button
            variant="outline"
            onClick={reset}
            className="flex-1"
          >
            Reset
          </Button>
        </div>

        {/* Hydration Tips */}
        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
          <p className="font-medium mb-1">💧 Hydration Tips:</p>
          <ul className="space-y-1 text-xs">
            <li>• Drink a glass of water when you wake up</li>
            <li>• Keep a water bottle with you throughout the day</li>
            <li>• Drink before, during, and after exercise</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
