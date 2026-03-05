'use client';

import { useEffect, useState, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface Profile {
  user_id?: string;
  name?: string;
  age?: number;
  gender?: string;
  height_cm?: number;
  current_weight_kg?: number;
  target_weight_kg?: number;
  activity_level?: string;
  dietary_preferences?: string;
  health_conditions?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  // convert between API model and UI model
  const toClient = (raw: any): Profile | null => {
    if (!raw) return null;
    return {
      user_id: raw.userId,
      name: raw.name,
      age: raw.age,
      gender: raw.gender,
      height_cm: raw.height ?? raw.height_cm,
      current_weight_kg: raw.currentWeight ?? raw.current_weight_kg,
      target_weight_kg: raw.goalWeight ?? raw.target_weight_kg,
      activity_level: raw.activityLevel ?? raw.activity_level,
      dietary_preferences: raw.dietaryPreferences ?? raw.dietary_preferences,
      health_conditions: raw.medicalConditions ?? raw.health_conditions,
    };
  };

  const toServer = (client: Profile) => ({
    ...client,
    height: client.height_cm,
    currentWeight: client.current_weight_kg,
    goalWeight: client.target_weight_kg,
    activityLevel: client.activity_level,
    dietaryPreferences: client.dietary_preferences,
    medicalConditions: client.health_conditions,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const dataRaw = await response.json();
          const data = dataRaw.profile || dataRaw;
          const clientData = toClient(data);
          setProfile(clientData);
          if (clientData) calculateBMI(clientData);
        }
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const calculateBMI = (profileData: Profile) => {
    if (profileData.height_cm && profileData.current_weight_kg) {
      const bmi = profileData.current_weight_kg / ((profileData.height_cm / 100) ** 2);
      setBmi(Math.round(bmi * 10) / 10);
    }
  };

  const handleChange = (field: keyof Profile, value: any) => {
    if (profile) {
      const updated = { ...profile, [field]: value };
      setProfile(updated);
      if ((field === 'height_cm' || field === 'current_weight_kg') && updated.height_cm && updated.current_weight_kg) {
        calculateBMI(updated);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const payload = toServer(profile as Profile);
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const dataRaw = await response.json();
        const data = toClient(dataRaw);
        setProfile(data);
        setSuccess('Profile updated successfully!');
      } else {
        setError('Failed to update profile');
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
        <Skeleton className="h-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Update your personal information and health metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-900 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    value={profile?.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="age" className="text-sm font-medium">
                    Age
                  </label>
                  <Input
                    id="age"
                    type="number"
                    value={profile?.age || ''}
                    onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                    placeholder="30"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="gender" className="text-sm font-medium">
                    Gender
                  </label>
                  <Select value={profile?.gender || ''} onValueChange={(value) => handleChange('gender', value)}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="activity" className="text-sm font-medium">
                    Activity Level
                  </label>
                  <Select value={profile?.activity_level || ''} onValueChange={(value) => handleChange('activity_level', value)}>
                    <SelectTrigger id="activity">
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="lightly_active">Lightly Active</SelectItem>
                      <SelectItem value="moderately_active">Moderately Active</SelectItem>
                      <SelectItem value="very_active">Very Active</SelectItem>
                      <SelectItem value="extremely_active">Extremely Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Health Metrics */}
            <div className="space-y-4">
              <h3 className="font-semibold">Health Metrics</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="height" className="text-sm font-medium">
                    Height (cm)
                  </label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={profile?.height_cm || ''}
                    onChange={(e) => handleChange('height_cm', parseFloat(e.target.value) || 0)}
                    placeholder="170"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="weight" className="text-sm font-medium">
                    Current Weight (kg)
                  </label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={profile?.current_weight_kg || ''}
                    onChange={(e) => handleChange('current_weight_kg', parseFloat(e.target.value) || 0)}
                    placeholder="75"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="targetWeight" className="text-sm font-medium">
                    Target Weight (kg)
                  </label>
                  <Input
                    id="targetWeight"
                    type="number"
                    step="0.1"
                    value={profile?.target_weight_kg || ''}
                    onChange={(e) => handleChange('target_weight_kg', parseFloat(e.target.value) || 0)}
                    placeholder="70"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    BMI: {bmi ? `${bmi}` : 'N/A'}
                  </label>
                  <p className="text-xs text-muted-foreground">Automatically calculated</p>
                </div>
              </div>
            </div>

            {/* Dietary Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Dietary Information</h3>
              <div className="space-y-2">
                <label htmlFor="preferences" className="text-sm font-medium">
                  Dietary Preferences
                </label>
                <Textarea
                  id="preferences"
                  value={profile?.dietary_preferences || ''}
                  onChange={(e) => handleChange('dietary_preferences', e.target.value)}
                  placeholder="e.g., Vegetarian, Vegan, Gluten-free, etc."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="conditions" className="text-sm font-medium">
                  Health Conditions
                </label>
                <Textarea
                  id="conditions"
                  value={profile?.health_conditions || ''}
                  onChange={(e) => handleChange('health_conditions', e.target.value)}
                  placeholder="e.g., Diabetes, High blood pressure, Allergies, etc."
                  rows={3}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
