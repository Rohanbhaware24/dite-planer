'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  User,
  Apple,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/diet-plans', label: 'Diet Plans', icon: Apple },
  { href: '/dashboard/progress', label: 'Progress', icon: TrendingUp },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
];

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const sidebarContent = (
    <>
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-foreground">HealthTrack</h2>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
              )}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="my-4 border-t" />
            <Link
              href="/dashboard/admin"
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                pathname === '/dashboard/admin'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
              )}
              onClick={() => setMobileOpen(false)}
            >
              <Shield className="h-5 w-5" />
              <span className="font-medium">Admin Panel</span>
            </Link>
          </>
        )}
      </nav>

      <div className="p-6 border-t space-y-2">
        <Link
          href="/dashboard/profile"
          className={cn(
            'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
            pathname === '/dashboard/profile'
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-accent'
          )}
          onClick={() => setMobileOpen(false)}
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </Link>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-3"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-background border-r min-h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center gap-2 p-4 border-b bg-background">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
        <h2 className="text-xl font-bold text-foreground">HealthTrack</h2>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50">
          <aside className="absolute left-0 top-0 h-screen w-64 bg-background flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
