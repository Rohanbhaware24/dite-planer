'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Zap, Flame, Leaf } from 'lucide-react';

interface NutritionInfoProps {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  showPercentages?: boolean;
}

export function NutritionInfo({
  calories,
  protein,
  carbs,
  fats,
  showPercentages = true,
}: NutritionInfoProps) {
  const proteinCals = protein * 4;
  const carbsCals = carbs * 4;
  const fatsCals = fats * 9;

  const proteinPercent = showPercentages ? Math.round((proteinCals / calories) * 100) : 0;
  const carbsPercent = showPercentages ? Math.round((carbsCals / calories) * 100) : 0;
  const fatsPercent = showPercentages ? Math.round((fatsCals / calories) * 100) : 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Total Calories */}
          <div className="text-center pb-6 border-b">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="text-muted-foreground">Total Daily Calories</span>
            </div>
            <p className="text-4xl font-bold text-foreground">{calories}</p>
            <p className="text-xs text-muted-foreground mt-1">kcal</p>
          </div>

          {/* Macronutrients */}
          <div className="space-y-4">
            {/* Protein */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="font-medium">Protein</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{protein}g</p>
                  {showPercentages && <p className="text-xs text-muted-foreground">{proteinPercent}%</p>}
                </div>
              </div>
              <div className="w-full bg-accent rounded-full h-2 overflow-hidden">
                <div
                  className="bg-red-500 h-full transition-all"
                  style={{ width: `${showPercentages ? proteinPercent : 0}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="font-medium">Carbohydrates</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{carbs}g</p>
                  {showPercentages && <p className="text-xs text-muted-foreground">{carbsPercent}%</p>}
                </div>
              </div>
              <div className="w-full bg-accent rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all"
                  style={{ width: `${showPercentages ? carbsPercent : 0}%` }}
                />
              </div>
            </div>

            {/* Fats */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="font-medium">Fats</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{fats}g</p>
                  {showPercentages && <p className="text-xs text-muted-foreground">{fatsPercent}%</p>}
                </div>
              </div>
              <div className="w-full bg-accent rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all"
                  style={{ width: `${showPercentages ? fatsPercent : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Macro breakdown chart */}
          {showPercentages && (
            <div className="pt-6 border-t">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{proteinPercent}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Protein</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{carbsPercent}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Carbs</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{fatsPercent}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Fats</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
