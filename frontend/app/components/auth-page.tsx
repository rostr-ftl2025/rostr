import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Trophy } from 'lucide-react';

export function AuthPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Login logic will be implemented with Supabase
    console.log('Login:', { loginEmail, loginPassword });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Signup logic will be implemented with Supabase
    console.log('Signup:', { signupName, signupEmail, signupPassword });
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shadow-lg">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl tracking-tight">Welcome to rostr.</h1>
          <p className="text-muted-foreground text-lg">
            Your championship roster starts here
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
            <TabsTrigger value="login" className="text-base">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="text-base">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-2 shadow-lg">
              <CardHeader className="space-y-2 pb-8">
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription className="text-base">
                  Get back to dominating your league
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="login-email" className="text-base">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="login-password" className="text-base">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 text-base rounded-full">
                    Sign In
                  </Button>
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-2 shadow-lg">
              <CardHeader className="space-y-2 pb-8">
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription className="text-base">
                  Join 50,000+ winning managers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="signup-name" className="text-base">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="signup-email" className="text-base">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="signup-password" className="text-base">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="signup-confirm-password" className="text-base">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 text-base rounded-full">
                    Start Winning
                  </Button>
                  <p className="text-xs text-center text-muted-foreground pt-2">
                    By signing up, you agree to our Terms & Privacy Policy
                  </p>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}