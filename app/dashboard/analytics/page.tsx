"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ProgressRecord {
  weight_kg: number;
  body_fat_percentage?: number;
  recorded_date: string;
}

interface DietPlan {
  id: string;
  name?: string;
  daily_calories?: number;
  macros?: any;
  type?: string;
}

export default function AnalyticsPage() {
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, dietRes] = await Promise.all([
          fetch("/api/progress"),
          fetch("/api/diet-plans"),
        ]);

        if (progressRes.ok) {
          const data = await progressRes.json();
          setProgress(data);
        }

        if (dietRes.ok) {
          const data = await dietRes.json();
          setDietPlans(data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Prepare weight progress data
  const weightData = progress
    .slice()
    .reverse()
    .map((record) => ({
      date: new Date(record.recorded_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      weight: record.weight_kg,
      bodyFat: record.body_fat_percentage || 0,
    }));

  // Calculate statistics
  const currentWeight = progress[0]?.weight_kg || 0;
  const startWeight = progress[progress.length - 1]?.weight_kg || 0;
  const weightChange = currentWeight - startWeight;
  const avgWeight = (
    progress.reduce((sum, r) => sum + r.weight_kg, 0) / progress.length
  ).toFixed(1);
  const avgBodyFat =
    progress
      .filter((r) => r.body_fat_percentage)
      .reduce((sum, r) => sum + (r.body_fat_percentage || 0), 0) /
    progress.filter((r) => r.body_fat_percentage).length;

  // Diet plans breakdown
  const planTypes = dietPlans.reduce(
    (acc, plan) => {
      const existing = acc.find((p) => p.name === plan.type);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: plan.type || "Unknown", value: 1 });
      }
      return acc;
    },
    [] as { name: string; value: number }[],
  );

  const COLORS = ["#16a34a", "#86efac", "#22c55e", "#4ade80", "#dcfce7"];

  // Calorie distribution
  const macroData =
    dietPlans.length > 0
      ? [
          {
            name: "Protein",
            value:
              dietPlans.reduce(
                (sum, p) => sum + (p.macros?.protein_percent || 30),
                0,
              ) / dietPlans.length,
          },
          {
            name: "Carbs",
            value:
              dietPlans.reduce(
                (sum, p) => sum + (p.macros?.carbs_percent || 40),
                0,
              ) / dietPlans.length,
          },
          {
            name: "Fat",
            value:
              dietPlans.reduce(
                (sum, p) => sum + (p.macros?.fat_percent || 30),
                0,
              ) / dietPlans.length,
          },
        ]
      : [];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics & Reports</h1>

      <Tabs defaultValue="weight" className="space-y-6">
        <TabsList>
          <TabsTrigger value="weight">Weight Progress</TabsTrigger>
          <TabsTrigger value="diet">Diet Plans</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        {/* Weight Progress Tab */}
        <TabsContent value="weight" className="space-y-6">
          {weightData.length > 0 ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Weight Trend Over Time</CardTitle>
                  <CardDescription>
                    Your weight progression with detailed tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis
                        yAxisId="left"
                        domain={["dataMin - 2", "dataMax + 2"]}
                      />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="weight"
                        stroke="#16a34a"
                        name="Weight (kg)"
                        isAnimationActive={true}
                      />
                      {progress.some((r) => r.body_fat_percentage) && (
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="bodyFat"
                          stroke="#f59e0b"
                          name="Body Fat %"
                          isAnimationActive={true}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Starting Weight
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{startWeight} kg</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Current Weight
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentWeight} kg</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Change
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${weightChange > 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {weightChange > 0 ? "+" : ""}
                      {Math.round(weightChange * 10) / 10} kg
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  No weight data available. Start logging your progress!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Diet Plans Tab */}
        <TabsContent value="diet" className="space-y-6">
          {dietPlans.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Diet Plan Types</CardTitle>
                    <CardDescription>
                      Distribution of your diet plans
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={planTypes}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#16a34a"
                          dataKey="value"
                        >
                          {planTypes.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Average Macronutrient Breakdown</CardTitle>
                    <CardDescription>
                      Across all your diet plans
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={macroData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) =>
                            `${name}: ${Math.round(value)}%`
                          }
                          outerRadius={80}
                          fill="#16a34a"
                          dataKey="value"
                        >
                          {macroData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => `${Math.round(value)}%`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Daily Calorie Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={dietPlans.map((p, i) => ({
                        name: (p.name || `Plan ${i + 1}`).substring(0, 10),
                        calories: p.daily_calories || 0,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="calories" fill="#16a34a" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  No diet plans yet. Create your first plan to see analytics!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weight Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Average Weight</span>
                  <span className="font-semibold">{avgWeight} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Highest Weight</span>
                  <span className="font-semibold">
                    {Math.max(...progress.map((r) => r.weight_kg))} kg
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Lowest Weight</span>
                  <span className="font-semibold">
                    {Math.min(...progress.map((r) => r.weight_kg))} kg
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Records</span>
                  <span className="font-semibold">{progress.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Body Fat Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Average Body Fat
                  </span>
                  <span className="font-semibold">
                    {avgBodyFat.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Records with Data
                  </span>
                  <span className="font-semibold">
                    {progress.filter((r) => r.body_fat_percentage).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tracking Period</span>
                  <span className="font-semibold">
                    {progress.length > 0
                      ? Math.ceil(
                          (new Date(progress[0].recorded_date).getTime() -
                            new Date(
                              progress[progress.length - 1].recorded_date,
                            ).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )
                      : 0}{" "}
                    days
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diet Plan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Plans</span>
                  <span className="font-semibold">{dietPlans.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Average Daily Calories
                  </span>
                  <span className="font-semibold">
                    {dietPlans.length > 0
                      ? Math.round(
                          dietPlans.reduce(
                            (sum, p) => sum + p.daily_calories,
                            0,
                          ) / dietPlans.length,
                        )
                      : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Plan Types</span>
                  <span className="font-semibold">{planTypes.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Weight Change</span>
                  <span
                    className={`font-semibold ${weightChange > 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {weightChange > 0 ? "+" : ""}
                    {Math.round(weightChange * 10) / 10} kg
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Tracking Consistency
                  </span>
                  <span className="font-semibold">
                    {progress.length > 0
                      ? Math.round(
                          (progress.length /
                            Math.ceil(
                              (new Date(progress[0].recorded_date).getTime() -
                                new Date(
                                  progress[progress.length - 1].recorded_date,
                                ).getTime()) /
                                (1000 * 60 * 60 * 24),
                            )) *
                            100,
                        )
                      : 0}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
