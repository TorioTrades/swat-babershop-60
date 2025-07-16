import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock, User, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => boolean;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for remembered login on component mount
  useEffect(() => {
    const rememberedLogin = localStorage.getItem('barber-remembered-login');
    if (rememberedLogin) {
      try {
        const { username: savedUsername, password: savedPassword } = JSON.parse(rememberedLogin);
        setUsername(savedUsername);
        setPassword(savedPassword);
        setRememberDevice(true);
        // Auto-login
        const success = onLogin(savedUsername, savedPassword);
        if (success) {
          toast({
            title: "Welcome back!",
            description: `Automatically signed in as ${savedUsername}`,
          });
        }
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('barber-remembered-login');
      }
    }
  }, [onLogin, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      const success = onLogin(username, password);
      if (success) {
        // Save credentials if remember device is checked
        if (rememberDevice) {
          localStorage.setItem('barber-remembered-login', JSON.stringify({
            username,
            password
          }));
        } else {
          // Remove any existing saved credentials
          localStorage.removeItem('barber-remembered-login');
        }
        
        toast({
          title: "Login Successful",
          description: `Welcome ${username}!`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative">
      <Button 
        variant="outline" 
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 flex items-center gap-2"
      >
        <Home className="h-4 w-4" />
        Home
      </Button>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">Barber Admin Portal</CardTitle>
          <CardDescription>
            Sign in to access your appointment dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember-device"
                checked={rememberDevice}
                onCheckedChange={(checked) => setRememberDevice(checked as boolean)}
              />
              <Label htmlFor="remember-device" className="text-sm text-muted-foreground">
                Remember this device
              </Label>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};