'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, TrendingDown, Utensils, Target } from 'lucide-react';

interface Profile {
  name?: string;
  current_weight_kg?: number;
  target_weight_kg?: number;
  height_cm?: number;
}

interface ProgressRecord {
  id: string;
  weight_kg: number;
  recorded_date: string;
}

interface DietPlan {
  id: string;
  name: string;
  daily_calories: number;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [bmi, setBmi] = useState<number | null>(null);

  // helper converts API model to front-end shape
  const normalizeProfile = (raw: any): Profile => {
    if (!raw) return null;
    return {
      name: raw.name,
      current_weight_kg: raw.currentWeight ?? raw.current_weight_kg,
      target_weight_kg: raw.goalWeight ?? raw.target_weight_kg,
      height_cm: raw.height ?? raw.height_cm,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, progressRes, dietRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/progress'),
          fetch('/api/diet-plans'),
        ]);

        if (profileRes.ok) {
          const profileDataRaw = await profileRes.json();
          // API returns { user, profile }
          const profileData = normalizeProfile(profileDataRaw.profile || profileDataRaw);
          setProfile(profileData);
          
          // Calculate BMI
          if (profileData?.height_cm && profileData?.current_weight_kg) {
            const bmi = profileData.current_weight_kg / ((profileData.height_cm / 100) ** 2);
            setBmi(Math.round(bmi * 10) / 10);
          }
        }

        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgress(progressData);
        }

        if (dietRes.ok) {
          const dietData = await dietRes.json();
          // ensure each plan has an `id` field for React keys
          const normalized = dietData.map((p: any) => ({ ...p, id: p.id || p._id }));
          setDietPlans(normalized);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const weightProgress = progress.length > 0 ? (progress[0].weight_kg - progress[progress.length - 1].weight_kg) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.current_weight_kg || '-'} kg</div>
            {profile?.target_weight_kg && (
              <p className="text-xs text-muted-foreground mt-1">Target: {profile.target_weight_kg} kg</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">BMI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bmi || '-'}</div>
            <p className="text-xs text-muted-foreground mt-1">Body Mass Index</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{weightProgress > 0 ? '+' : ''}{Math.round(weightProgress * 10) / 10} kg</div>
            <p className="text-xs text-muted-foreground mt-1">Weight change</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dietPlans.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Diet plans</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Weight Progress</CardTitle>
          <CardDescription>Your last 5 weight records</CardDescription>
        </CardHeader>
        <CardContent>
          {progress.length > 0 ? (
            <div className="space-y-2">
              {progress.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">
                    {new Date(record.recorded_date).toLocaleDateString()}
                  </span>
                  <span className="font-medium">{record.weight_kg} kg</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No progress records yet. Start by adding your weight.</p>
          )}
          <Button asChild variant="outline" className="w-full mt-4">
            <Link href="/dashboard/progress">View All Progress</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Diet Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Your Diet Plans</CardTitle>
          <CardDescription>Active and completed diet plans</CardDescription>
        </CardHeader>
        <CardContent>
          {dietPlans.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {dietPlans.map((plan) => (
                <div key={plan.id} className="border rounded-lg p-4">
                  <h3 className="font-medium">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.daily_calories} cal/day
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No diet plans yet. Create one to get started.</p>
          )}
          <Button asChild className="w-full mt-4 bg-green-600 hover:bg-green-700">
            <Link href="/dashboard/diet-plans">Create Diet Plan</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-green-600" />
              Meal Planning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create and manage personalized meal plans based on your dietary preferences and health goals.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/diet-plans">Manage Plans</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-600" />
              Track Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Log your weight and body measurements to track your progress over time.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/progress">Log Progress</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
