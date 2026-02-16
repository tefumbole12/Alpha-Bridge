import React, { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/context/AuthContext';
import { getSystemSettings } from '@/services/settingsService';
import ShareholdersRegistrationForm from './ShareholdersRegistrationForm'; // Use this instead of MemberSignupForm
import { createShareBooking } from '@/services/shareBookingService';

const SharePurchaseForm = ({ defaultShares = 1 }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [shareSettings, setShareSettings] = useState({ price_per_share: 500, total_shares: 100, total_available: 60 });
  
  const [formData, setFormData] = useState({ shares: defaultShares });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isSignatureRequired, setIsSignatureRequired] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const settings = await getSystemSettings();
      setShareSettings(settings);
    }
    loadSettings();
  }, []);

  useEffect(() => {
    if (user) {
        // Check if user has a signature on their shareholder record
        const checkSignature = async () => {
            const { data } = await supabase.from('shareholders').select('agreement_signed_at').eq('email', user.email).single();
            if (!data || !data.agreement_signed_at) {
                setIsSignatureRequired(true);
            } else {
                setIsSignatureRequired(false);
            }
        };
        checkSignature();
        setShowSignup(false); // Hide signup form if user is logged in
    } else {
        setShowSignup(true); // Default to signup form if not logged in
    }
  }, [user]);

  const totalAmount = formData.shares * shareSettings.price_per_share;

  const handleSharesChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    setFormData(prev => ({ ...prev, shares: Math.max(1, val) }));
  };

  const handleBookShares = async () => {
    setLoading(true);
    try {
        if (!user) {
            setShowSignup(true);
            return;
        }
        if (isSignatureRequired) {
            throw new Error("Please sign the shareholder agreement first.");
        }
        if (formData.shares > shareSettings.total_available) {
            throw new Error(`Only ${shareSettings.total_available} shares are available.`);
        }

        const shareholderResponse = await supabase.from('shareholders').select('id').eq('email', user.email).single();
        if(!shareholderResponse.data) throw new Error("Shareholder record not found for this user.");
        const member_id = shareholderResponse.data.id;
        
        await createShareBooking({
            member_id,
            shares_booked: formData.shares,
            total_amount: totalAmount,
        });

        setSuccess(true);
        toast({
            title: "Shares Booked Successfully! 🚀",
            description: "Your booking is confirmed. You will receive an invoice for payment.",
            className: "bg-green-50 border-green-200 text-green-900"
        });

    } catch (error) {
        console.error("Booking Error:", error);
        toast({
            title: "Booking Failed",
            description: error.message,
            variant: "destructive"
        });
    } finally {
        setLoading(false);
    }
  };

  if (success) {
      return (
          <div className="text-center py-12 px-6 bg-white rounded-xl shadow-lg border border-green-100">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-6">
                  Your request for <strong>{formData.shares} Share(s)</strong> has been booked.
              </p>
              <Button onClick={() => setSuccess(false)} variant="outline" className="mt-6">
                Book More Shares
              </Button>
          </div>
      );
  }

  // If user is NOT logged in, show the comprehensive registration form
  if (showSignup) {
      return (
          <div className="bg-transparent">
              <ShareholdersRegistrationForm onRegistrationComplete={() => setShowSignup(false)} />
          </div>
      )
  }

  // If user IS logged in, show the simplified booking form
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-[#003D82] p-6 text-white">
        <h3 className="text-xl font-bold">Book Your Shares</h3>
        <p className="text-blue-200 text-sm">Welcome back, {user.email}</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 text-center bg-gray-50 p-4 rounded-lg">
            <div>
                <Label className="text-xs text-gray-500">Total Available</Label>
                <p className="text-lg font-bold text-[#003D82]">{shareSettings.total_available} Shares</p>
            </div>
            <div>
                <Label className="text-xs text-gray-500">Price/Share</Label>
                <p className="text-lg font-bold text-[#003D82]">${shareSettings.price_per_share}</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="shares">Number of Shares to Book</Label>
                <Input
                    id="shares"
                    type="number"
                    min="1"
                    max={shareSettings.total_available}
                    value={formData.shares}
                    onChange={handleSharesChange}
                    className="text-lg font-bold text-[#003D82]"
                />
            </div>
            <div className="bg-blue-50 rounded-lg p-4 flex flex-col justify-center items-end">
                <span className="text-sm text-blue-600 font-medium">Total Investment Value</span>
                <span className="text-3xl font-bold text-[#003D82]">${totalAmount.toLocaleString()}</span>
            </div>
        </div>

        {isSignatureRequired && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg flex items-center gap-2">
                <Info className="w-5 h-5"/>
                <p className="text-sm">You must <a href="/shareholders-agreement" className="underline font-bold">sign the agreement</a> before booking.</p>
            </div>
        )}

        <Button 
            onClick={handleBookShares}
            className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-[#003D82] font-bold text-lg py-6 shadow-md"
            disabled={loading || isSignatureRequired}
        >
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
            Book Shares Now
        </Button>

        <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Secure Shareholder Portal
        </p>
      </div>
    </div>
  );
};

export default SharePurchaseForm;