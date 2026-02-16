import React, { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/context/AuthContext';
import { getSystemSettings } from '@/services/settingsService';
import ShareholdersRegistrationForm from '@/components/ShareholdersRegistrationForm';

const SharePurchasePortal = () => {
  const { user } = useAuth();
  
  // Directly render the comprehensive form for everyone
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#003D82]">Become a Shareholder</h1>
            <p className="text-gray-600 mt-2">Invest in the future of Alpha Bridge Technologies</p>
        </div>
        
        <ShareholdersRegistrationForm />
        
        <div className="mt-8 text-center text-sm text-gray-500">
             <p className="flex items-center justify-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-green-600" />
                 Secure Application Portal • SSL Encrypted
             </p>
        </div>
    </div>
  );
};

export default SharePurchasePortal;