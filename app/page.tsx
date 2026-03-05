import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Activity, TrendingDown, Calendar, BarChart3, Users, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
            Your Personal <span className="text-green-600">Health & Diet</span> Companion
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Track your weight, plan your meals, and achieve your health goals with personalized diet recommendations and progress tracking.
          </p>
        </div>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/register">Get Started Free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Activity className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>BMI Calculator</CardTitle>
              <CardDescription>Calculate and track your body mass index</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Personalized Meal Plans</CardTitle>
              <CardDescription>Get AI-generated diet plans tailored to your goals</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingDown className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>Monitor weight and body measurements over time</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Analytics & Charts</CardTitle>
              <CardDescription>Visualize your progress with detailed charts</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Nutrition Tracking</CardTitle>
              <CardDescription>Track calories, macros, and micronutrients daily</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Community Support</CardTitle>
              <CardDescription>Connect with others on their health journey</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Health?</h2>
          <p className="text-lg mb-8 text-green-100">Start your free journey today with HealthTrack</p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/register">Create Your Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; 2026 HealthTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
