"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Mail, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, username, password, name }),
      });
      const data = await res.json();
      if (data?.status === 'ok') {
        toast({ title: 'Account created', description: `Welcome, ${data.user?.name || data.user?.email}` });
        router.push('/dashboard');
      } else {
        toast({ variant: 'destructive', title: 'Registration failed', description: data?.message || 'Unable to register' });
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Network or server error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-400 text-white p-6 rounded-t">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Register to access Green Track</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Full name</label>
              <div className="mt-1 flex items-center gap-2">
                <User className="text-slate-400" />
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Username</label>
              <div className="mt-1 flex items-center gap-2">
                <User className="text-slate-400" />
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <div className="mt-1 flex items-center gap-2">
                <Mail className="text-slate-400" />
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
              <div className="text-sm text-muted-foreground">Already have an account? <a href="/login" className="underline">Sign in</a></div>
              <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
