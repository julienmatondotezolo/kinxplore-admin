"use client";

import React, { useState, useEffect } from "react";
import { Link, usePathname } from "@/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MapPin,
  Layers,
  Settings,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Destinations",
    href: "/",
    icon: MapPin,
  },
  {
    name: "Categories",
    href: "/categories",
    icon: Layers,
  },
];

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border bg-card transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Area */}
          <div className="flex h-20 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <MapPin className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">Kinxplore</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-5 w-5", isActive ? "" : "text-muted-foreground group-hover:text-foreground")} />
                    {item.name}
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <div className="rounded-2xl bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent" />
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-semibold">Admin User</p>
                  <p className="truncate text-xs text-muted-foreground">admin@kinxplore.com</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Header({ setIsOpen }: { setIsOpen: (open: boolean) => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="hidden lg:block">
          <h2 className="text-lg font-semibold">Welcome back, Admin</h2>
          <p className="text-sm text-muted-foreground">Here's what's happening today.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent" />
          </Button>
          <div className="h-6 w-px bg-border mx-1" />
        </div>
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </header>
  );
}
