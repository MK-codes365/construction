"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        const data = await res.json();
        if (!mounted) return;
        if (data?.status === 'ok') {
          router.replace('/dashboard');
        }
      } catch (e) {
        // ignore - user not authenticated or network error
      }
    };
    check();
    return () => { mounted = false; };
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data?.status === 'ok') {
        toast({ title: 'Signed in', description: `Welcome back, ${data.user?.name || data.user?.email}` });
        router.push('/dashboard');
      } else {
        toast({ variant: 'destructive', title: 'Login failed', description: data?.message || 'Invalid credentials' });
      }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Unable to contact server' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-sky-500 text-white p-6 rounded-t">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to access dashboard and real-time reports</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Email or username</label>
              <div className="mt-1 flex items-center gap-2">
                <User className="text-slate-400" />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Password</label>
              <div className="mt-1 flex items-center gap-2">
                <Lock className="text-slate-400" />
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Need an account? <a href="/register" className="underline">Create one</a></div>
              <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
