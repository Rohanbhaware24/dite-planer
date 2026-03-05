'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, X, Activity } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Activity className="w-6 h-6 text-green-600" />
          <span className="hidden sm:inline">HealthTrack</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-sm hover:text-green-600 transition">Home</Link>
          <Link href="/features" className="text-sm hover:text-green-600 transition">Features</Link>
          <Link href="/about" className="text-sm hover:text-green-600 transition">About</Link>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden border-t px-4 py-4 space-y-3">
          <Link href="/" className="block text-sm hover:text-green-600">Home</Link>
          <Link href="/features" className="block text-sm hover:text-green-600">Features</Link>
          <Link href="/about" className="block text-sm hover:text-green-600">About</Link>
          <div className="flex gap-2 pt-3">
            <Button variant="outline" asChild size="sm" className="w-full">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
