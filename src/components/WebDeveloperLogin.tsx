import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface WebDeveloperLoginProps {
  onLogin: () => void;
}

const WebDeveloperLogin = ({ onLogin }: WebDeveloperLoginProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      const correctPassword = 'Cryptorio1312$';
      
      if (password === correctPassword) {
        // Store authentication in localStorage
        localStorage.setItem('webdev_authenticated', 'true');
        localStorage.setItem('webdev_auth_timestamp', Date.now().toString());
        onLogin();
        toast({
          title: "Access granted",
          description: "Welcome to the Web Developer Dashboard",
        });
      } else {
        toast({
          title: "Access denied",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
      setPassword('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-barbershop-black flex items-center justify-center px-4">
      {/* Home Button */}
      <Link to="/" className="absolute top-6 left-6">
        <Button variant="outline" className="border-barbershop-gold text-barbershop-gold hover:bg-barbershop-gold hover:text-barbershop-black">
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
      </Link>
      
      <div className="w-full max-w-md">
        <Card className="bg-barbershop-charcoal border-barbershop-gold/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-barbershop-gold/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-barbershop-gold" />
            </div>
            <CardTitle className="text-white font-serif text-2xl">
              Web Developer Access
            </CardTitle>
            <p className="text-gray-400 mt-2">
              Enter the password to access the developer dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter developer password"
                    className="bg-barbershop-black border-barbershop-gold/20 text-white pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading || !password}
                className="w-full bg-barbershop-gold text-barbershop-black hover:bg-barbershop-gold/90 disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Access Dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebDeveloperLogin;