import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { saveShareholderRegistration } from '@/services/shareholderService';
import CountryCodeSelector, { countryOptions } from '@/components/CountryCodeSelector';
import { validatePhoneByCountry } from '@/utils/validatePhoneByCountry';

function ShareholdersRegistrationForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    countryCode: '+250',
    companyName: '',
    shares: 1,
    acceptedTerms: false
  });
  
  const [totalCost, setTotalCost] = useState(500);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTotalCost(formData.shares * 500);
  }, [formData.shares]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCountryChange = (value) => {
      setFormData(prev => ({ ...prev, countryCode: value }));
  };

  const handleShareChange = (e) => {
    const val = parseInt(e.target.value);
    setFormData(prev => ({ ...prev, shares: val }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({ ...prev, acceptedTerms: checked }));
    if (errors.acceptedTerms && checked) setErrors(prev => ({ ...prev, acceptedTerms: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    
    // Valid Phone check
    const phoneValidation = validatePhoneByCountry(formData.phone, formData.countryCode);
    if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.error;
    }

    if (!formData.acceptedTerms) newErrors.acceptedTerms = "You must accept the terms";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      toast({ title: "Validation Error", description: firstError, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
        const phoneValidation = validatePhoneByCountry(formData.phone, formData.countryCode);
        
        const payload = {
            ...formData,
            phone: phoneValidation.formatted,
            totalAmount: totalCost
        };

        const { data, error } = await saveShareholderRegistration(payload);
        
        if (error) throw error;

        // Navigate to confirmation page
        if (data && data.reference_number) {
            navigate(`/shares/confirmation/${data.reference_number}`);
        } else {
             // Fallback if no reference number returned for some reason
            toast({
                title: "Application Received",
                description: "Your application has been submitted successfully.",
                className: "bg-green-600 text-white"
            });
        }

    } catch (err) {
        console.error(err);
        toast({
            title: "Submission Error",
            description: err.message || "Failed to submit application. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  // Get dynamic placeholder
  const selectedCountry = countryOptions.find(c => c.code === formData.countryCode) || countryOptions[0];

  return (
    <form className="space-y-4 text-left bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100" onSubmit={handleSubmit}>
        <h3 className="text-xl font-bold text-[#003D82] mb-4 border-b pb-2">Shareholder Application</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-[#003D82]">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Engr. Tefu R. Mbole"
              value={formData.fullName}
              onChange={handleChange}
              className={`bg-gray-50 ${errors.fullName ? "border-red-500" : ""}`}
            />
            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#003D82]">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="info@alpha-bridge.net"
              value={formData.email}
              onChange={handleChange}
              className={`bg-gray-50 ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#003D82]">Phone Number *</Label>
            <div className="flex gap-2">
                <CountryCodeSelector 
                    value={formData.countryCode} 
                    onChange={handleCountryChange} 
                />
                <Input
                  id="phone"
                  name="phone"
                  placeholder={selectedCountry.placeholder}
                  value={formData.phone}
                  onChange={handleChange}
                  className={`bg-gray-50 flex-1 ${errors.phone ? "border-red-500" : ""}`}
                />
            </div>
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
             <Label htmlFor="companyName" className="text-[#003D82]">Company (Optional)</Label>
             <Input
              id="companyName"
              name="companyName"
              placeholder="Alpha Bridge Technologies Ltd"
              value={formData.companyName}
              onChange={handleChange}
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                  <Label htmlFor="shares" className="text-[#003D82] font-bold">Number of Shares ($500/share)</Label>
                  <select
                      id="shares"
                      name="shares"
                      value={formData.shares}
                      onChange={handleShareChange}
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                      {Array.from({ length: 60 }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num}</option>
                      ))}
                  </select>
              </div>
              <div className="text-right">
                  <span className="text-sm text-gray-500 block">Total Investment</span>
                  <span className="text-3xl font-bold text-[#003D82]">${totalCost.toLocaleString()}</span>
              </div>
          </div>
        </div>

        <div className="flex items-start space-x-2 py-4">
          <Checkbox 
              id="terms" 
              checked={formData.acceptedTerms} 
              onCheckedChange={handleCheckboxChange}
              className={errors.acceptedTerms ? "border-red-500" : ""}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
            >
              I agree to the Terms and Conditions for Shareholders.
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              By checking this box, you confirm that you have read and understood the investment agreement.
            </p>
            {errors.acceptedTerms && <p className="text-red-500 text-xs">{errors.acceptedTerms}</p>}
          </div>
        </div>

        <div className="pt-2">
          <Button 
            type="submit"
            className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-[#003D82] py-6 text-lg font-semibold shadow-md hover:shadow-lg transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              `Submit Application`
            )}
          </Button>
        </div>
    </form>
  );
}

export default ShareholdersRegistrationForm;