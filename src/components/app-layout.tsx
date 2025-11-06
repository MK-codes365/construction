"use client";

import React, { useEffect, useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { Logo } from '@/components/logo';
import { MainNav } from '@/components/main-nav';
import { Button } from './ui/button';
import { Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [feed, setFeed] = useState({ lastUpdated: null, riskScore: null, status: 'unknown' });

  useEffect(() => {
    let mounted = true;
    // lazy import to avoid server-side issues
    const subModule = require('../lib/aiFeedStore');
    const unsubscribe = subModule.subscribe((s: any) => {
      if (!mounted) return;
      setFeed(s || { lastUpdated: null, riskScore: null, status: 'unknown' });
    });
    return () => { mounted = false; unsubscribe(); };
  }, []);

  const statusColor = () => {
    if (feed.status === 'connecting') return 'text-blue-400';
    if (feed.status === 'disconnected' || feed.status === 'error') return 'text-gray-400';
    // status === connected -> color based on riskScore
    const r = typeof feed.riskScore === 'number' ? feed.riskScore : null;
    if (r === null) return 'text-gray-400';
    if (r < 0.3) return 'text-green-400';
    if (r < 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const statusDotBg = () => {
    if (feed.status === 'connecting') return 'bg-blue-400';
    if (feed.status === 'disconnected' || feed.status === 'error') return 'bg-gray-400';
    const r = typeof feed.riskScore === 'number' ? feed.riskScore : null;
    if (r === null) return 'bg-gray-400';
    if (r < 0.3) return 'bg-green-400';
    if (r < 0.7) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
            <div className="flex items-center justify-end gap-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                {/* spinner when connecting */}
                {feed.status === 'connecting' && (
                  <svg className="h-4 w-4 animate-spin text-muted-foreground" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}

                {/* last-updated */}
                <div className="hidden sm:block">
                  <div className="text-xs">Last AI update</div>
                  <div className="text-sm">
                    {feed.lastUpdated ? new Date(feed.lastUpdated).toLocaleString() : 'No data'}
                  </div>
                </div>

                {/* status dot */}
                <div className={`h-3 w-3 rounded-full ${statusDotBg()}`} title={`AI feed: ${feed.status}`}></div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={async () => {
                try {
                  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                } catch (e) {
                  // ignore
                } finally {
                  // redirect to landing page
                  // use location.replace so history doesn't keep authenticated pages
                  if (typeof window !== 'undefined') window.location.replace('/');
                }
              }}
              className="h-10 w-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
