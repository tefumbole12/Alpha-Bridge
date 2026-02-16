import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Briefcase, 
  DollarSign, 
  PieChart, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ShareholdersRegistrationForm from '@/components/ShareholdersRegistrationForm';
import { getRemainingShares } from '@/services/shareholderService';

const SharesPage = () => {
  const navigate = useNavigate();
  const [showRegistration, setShowRegistration] = useState(false);
  const [selectedShareType, setSelectedShareType] = useState(null);
  const [remainingShares, setRemainingShares] = useState(60);
  const [loading, setLoading] = useState(true);

  const TOTAL_SHARES = 100;
  const SHARE_PRICE = 500;

  useEffect(() => {
    // Access Control
    const accepted = localStorage.getItem('shareholderAgreementAccepted');
    if (!accepted) {
        navigate('/shareholders');
    }

    // Fetch live data
    const fetchShares = async () => {
        const { data } = await getRemainingShares();
        if (data !== null) setRemainingShares(data);
        setLoading(false);
    };
    fetchShares();
  }, [navigate]);

  const handlePurchase = (type) => {
    setSelectedShareType(type);
    setShowRegistration(true);
    // Smooth scroll to form
    setTimeout(() => {
        const element = document.getElementById('registration-form');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const soldPercentage = ((TOTAL_SHARES - remainingShares) / TOTAL_SHARES) * 100;

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Available Shares | Alpha Bridge Technologies</title>
        <meta name="description" content="Purchase shares in Alpha Bridge Technologies. Secure your investment today." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[#003D82] text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <Badge className="bg-[#D4AF37] text-[#003D82] hover:bg-[#b5952f] mb-4 text-sm px-3 py-1">
                 Verified Investor Access
             </Badge>
             <h1 className="text-3xl md:text-5xl font-bold mb-4">Investment Opportunities</h1>
             <p className="text-xl text-blue-200 max-w-2xl mx-auto">
               Choose your investment tier below. All shares are Class A Common Stock with full voting rights and dividend eligibility.
             </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-20">
        
        {/* Availability Status Bar */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-[#D4AF37]"
        >
            <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-full">
                    <PieChart className="w-6 h-6 text-[#003D82]" />
                </div>
                <div>
                    <h3 className="font-bold text-[#003D82]">Live Market Status</h3>
                    <p className="text-sm text-gray-600">
                        {remainingShares} shares remaining out of {TOTAL_SHARES} authorized
                    </p>
                </div>
            </div>
            
            <div className="w-full md:w-1/3">
                <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-[#003D82]">{Math.round(soldPercentage)}% Sold</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-[#D4AF37] h-2.5 rounded-full transition-all duration-1000" style={{ width: `${soldPercentage}%` }}></div>
                </div>
            </div>
        </motion.div>

        {/* Share Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* Standard Share Card */}
            <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
            >
                <div className="bg-[#003D82] p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                        <TrendingUp className="w-32 h-32" />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">Single Share Unit</h3>
                    <p className="text-blue-200 text-sm">Ideal for individual investors</p>
                </div>
                
                <div className="p-8 flex-1">
                    <div className="flex items-baseline mb-6">
                        <span className="text-4xl font-bold text-[#003D82]">${SHARE_PRICE}</span>
                        <span className="text-gray-500 ml-2">/ per share</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Class A Common Stock</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Full Voting Rights</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Annual Dividend Eligibility</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Certificate of Ownership</span>
                        </li>
                    </ul>
                </div>
                
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                     <Button 
                        onClick={() => handlePurchase('single')}
                        className="w-full bg-[#003D82] hover:bg-[#002855] text-white py-6 text-lg font-bold shadow-md"
                     >
                        Purchase Shares
                     </Button>
                </div>
            </motion.div>

            {/* Bulk / Bundle Card */}
            <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg border-2 border-[#D4AF37] relative flex flex-col"
            >
                <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#003D82] text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                    MOST POPULAR
                </div>
                
                <div className="bg-gradient-to-br from-[#003D82] to-[#0a192f] p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                        <Briefcase className="w-32 h-32" />
                    </div>
                    <h3 className="text-2xl font-bold mb-1 text-[#D4AF37]">Strategic Block</h3>
                    <p className="text-blue-200 text-sm">For institutional or serious investors</p>
                </div>
                
                <div className="p-8 flex-1">
                    <div className="flex items-baseline mb-6">
                        <span className="text-4xl font-bold text-[#003D82]">${SHARE_PRICE * 5}</span>
                        <span className="text-gray-500 ml-2">/ block of 5</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            <span><strong className="text-[#003D82]">5 Shares</strong> Bundle</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            <span>Priority Board Communication</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            <span>Quarterly Performance Reports</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            <span>Dedicated Relationship Manager</span>
                        </li>
                    </ul>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100">
                     <Button 
                        onClick={() => handlePurchase('bundle')}
                        className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-[#003D82] py-6 text-lg font-bold shadow-md"
                     >
                        Secure Block
                     </Button>
                </div>
            </motion.div>
        </div>

        {/* Registration Form Area */}
        <div id="registration-form" className="scroll-mt-24">
             {showRegistration ? (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
                >
                    <div className="mb-8 border-b border-gray-100 pb-4">
                        <h2 className="text-2xl font-bold text-[#003D82] mb-2">Complete Purchase</h2>
                        <p className="text-gray-600">
                            You selected: <span className="font-semibold text-[#D4AF37] capitalize">{selectedShareType === 'bundle' ? 'Strategic Block (5 Shares)' : 'Single Share Unit'}</span>
                        </p>
                    </div>
                    <ShareholdersRegistrationForm 
                        initialShareCount={selectedShareType === 'bundle' ? 5 : 1}
                        onRegistrationComplete={() => {
                            // Refresh shares count logic could go here
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} 
                    />
                </motion.div>
             ) : (
                <div className="text-center py-12 bg-white/50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                    <p>Select an investment option above to proceed with booking.</p>
                </div>
             )}
        </div>

      </div>
    </div>
  );
};

export default SharesPage;