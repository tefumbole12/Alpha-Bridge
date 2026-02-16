
import React, { useState, useEffect } from 'react';
import { getSystemSettings, updateSystemSettings } from '@/services/settingsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Save, Loader2, Settings2 } from 'lucide-react';

const AdminShareSettingsPage = () => {
  const [settings, setSettings] = useState({
    total_shares: 0,
    price_per_share: 0,
    currency: 'USD',
    total_sold: 0,
    total_available: 0
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await getSystemSettings();
    if (data) {
        setSettings(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => {
        const newSettings = { ...prev, [name]: value };
        // Recalculate available shares client-side for immediate feedback
        if (name === 'total_shares' || name === 'total_sold') {
            const total = parseInt(newSettings.total_shares) || 0;
            const sold = parseInt(newSettings.total_sold) || 0;
            newSettings.total_available = total - sold;
        }
        return newSettings;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Only send editable fields to the update function
      const payload = {
        total_shares: settings.total_shares,
        price_per_share: settings.price_per_share,
        currency: settings.currency,
        total_sold: settings.total_sold
      };
      await updateSystemSettings(payload);
      toast({ title: "Settings Saved", description: "Share configuration updated successfully." });
      loadSettings(); // Reload settings from DB to ensure consistency
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div>
            <h1 className="text-3xl font-bold text-[#003D82]">Share Settings</h1>
            <p className="text-gray-500">Configure core parameters for shareholder equity.</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings2 className="w-5 h-5 text-[#D4AF37]" /> Configuration</CardTitle>
                <CardDescription>Update global share values and limits.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="total_shares">Total Shares Available <span className="text-red-500">*</span></Label>
                        <Input id="total_shares" name="total_shares" type="number" value={settings.total_shares} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price_per_share">Price Per Share <span className="text-red-500">*</span></Label>
                        <Input id="price_per_share" name="price_per_share" type="number" value={settings.price_per_share} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="total_sold">Total Sold (Admin Override)</Label>
                        <Input id="total_sold" name="total_sold" type="number" value={settings.total_sold} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="total_available" className="text-gray-500">Total Available (Calculated)</Label>
                        <Input id="total_available" name="total_available" type="number" value={settings.total_available} readOnly className="bg-gray-100 cursor-not-allowed"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Input id="currency" name="currency" value={settings.currency} onChange={handleChange} />
                    </div>

                    <Button type="submit" className="w-full bg-[#003D82] font-bold" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Configuration
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
};

export default AdminShareSettingsPage;
