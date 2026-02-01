'use client';

import { useAuth } from '@/hooks/useAuth';
import { Link } from '@/navigation';
import { Database, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSwitcher } from '@/components/ui/language-switcher';

export default function AdminHeader() {
  const { profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Kinxplore Admin
            </h1>
            <p className="text-xs text-muted-foreground">
              Welcome back, {profile?.full_name || profile?.email?.split('@')[0] || 'Admin'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/categories">
            <Button variant="outline" className="gap-2">
              <Layers className="h-4 w-4" />
              Categories
            </Button>
          </Link>
          <ThemeToggle />
          <LanguageSwitcher />

          <div className="flex items-center gap-3 pl-3 border-l border-border/40">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">
                {profile?.full_name || 'Admin'}
              </p>
              <p className="text-xs text-muted-foreground">
                {profile?.email}
              </p>
            </div>

            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || 'Admin'}
                className="h-10 w-10 rounded-full border-2 border-border"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'A'}
              </div>
            )}

            <Button
              onClick={signOut}
              variant="destructive"
              size="sm"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
