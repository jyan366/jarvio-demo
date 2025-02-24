
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export default function Auth() {
  const [email] = useState('demo@jarvio.io');
  const [password] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple mock login - always succeeds
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/');
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <img src="/lovable-uploads/983c698c-2767-4609-b0fe-48e16d5a1fc0.png" alt="Logo" className="w-8 h-8" />
            <CardTitle>Welcome to Jarvio</CardTitle>
          </div>
          <CardDescription>Demo login (no real authentication)</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                readOnly
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
