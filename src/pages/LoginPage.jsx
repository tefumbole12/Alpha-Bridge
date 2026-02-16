
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { otpService } from '@/services/otpService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Loader2, LogIn, Lock, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { loginWithCredentials } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    if (!identifier || !password) {
        setErrorMsg('Please enter both email/username and password.');
        setIsLoading(false);
        return;
    }

    try {
        // 1. Authenticate with Supabase
        const result = await loginWithCredentials(identifier, password);
        
        if (!result.success) {
            throw new Error(result.error || 'Login failed');
        }

        const user = result.user;
        if (!user) throw new Error("Authentication succeeded but user data is missing.");
        
        // 2. Fetch Profile Safely
        // SAFE DESTRUCTURING FIX: Instead of const { role, phone } = ..., we get the object first
        const profileService = await import('@/services/profileService');
        const profileData = await profileService.getProfile(user.id);
        
        // Safe access with optional chaining and nullish coalescing
        const phoneFromProfile = profileData?.phone ?? null;
        const phoneFromAuth = user?.phone ?? null;
        
        // Prioritize profile phone, fallback to auth metadata phone
        const phoneToUse = phoneFromProfile || phoneFromAuth;
        
        if (!phoneToUse) {
            console.error("Login Error: No phone number found for user", user.id);
            throw new Error('No phone number linked to this account. Please contact support to update your profile.');
        }

        // 3. Send OTP
        await otpService.sendOTP(user.id, phoneToUse);
        
        toast({
            title: "Verification Code Sent",
            description: "Please check your WhatsApp for the code.",
            className: "bg-blue-600 text-white"
        });

        // 4. Redirect
        navigate('/otp-verification');

    } catch (err) {
        console.error("Login Process Error:", err);
        // User-friendly error mapping
        let displayMessage = err.message || 'An unexpected error occurred.';
        if (displayMessage.includes("destructure")) {
            displayMessage = "System error: Profile data could not be loaded.";
        } else if (displayMessage.includes("network")) {
            displayMessage = "Network error. Please check your connection.";
        }
        
        setErrorMsg(displayMessage);
        toast({
            title: "Login Error",
            description: displayMessage,
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003D82] to-[#001f42] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#D4AF37] p-8 text-center relative">
             <div className="absolute top-0 left-0 w-full h-full bg-[#003D82] opacity-10 pattern-grid-lg"></div>
             <h1 className="text-3xl font-bold text-[#003D82] relative z-10">Alpha Bridge</h1>
             <p className="text-[#003D82] font-medium text-sm tracking-wider uppercase relative z-10 opacity-80">Technologies Ltd</p>
          </div>

          <div className="p-8">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Welcome Back</h2>
                <p className="text-gray-500 text-sm">Sign in to access your dashboard</p>
            </div>

            <AnimatePresence>
                {errorMsg && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4"
                    >
                        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                            <AlertDescription>{errorMsg}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="identifier" 
                    placeholder="name@example.com" 
                    className="pl-10 h-11 border-gray-300 focus:border-[#003D82] focus:ring-[#003D82]/20"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-xs text-[#003D82] hover:underline font-medium">
                        Forgot Password?
                    </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-10 h-11 border-gray-300 focus:border-[#003D82] focus:ring-[#003D82]/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-[#003D82] hover:bg-[#002855] text-white font-bold text-lg shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <span className="flex items-center gap-2">
                        Login <ArrowRight className="w-4 h-4" />
                    </span>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/registration" className="text-[#003D82] font-bold hover:underline">
                        Register Now
                    </Link>
                </p>
                <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400">
                    <Link to="/" className="hover:text-gray-600">Home</Link>
                    <span>•</span>
                    <Link to="/contact" className="hover:text-gray-600">Contact Support</Link>
                    <span>•</span>
                    <Link to="/about" className="hover:text-gray-600">About Us</Link>
                </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
