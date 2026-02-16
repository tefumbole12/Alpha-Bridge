
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ShareholdersPaymentModal({ isOpen, onClose, onSelectMethod, amount, onBack }) {
  if (!isOpen) return null;

  const methods = [
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      icon: <Smartphone className="w-8 h-8 text-yellow-600" />,
      desc: 'MTN Mobile Money / Airtel Money',
      color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-500',
    },
    {
      id: 'card',
      name: 'VISA / MasterCard',
      icon: <CreditCard className="w-8 h-8 text-blue-600" />,
      desc: 'Secure Payment via Stripe',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-500',
    },
    {
      id: 'pay_later',
      name: 'Pay Later',
      icon: <Clock className="w-8 h-8 text-gray-600" />,
      desc: 'Book shares now, pay within 24h',
      color: 'bg-gray-50 border-gray-200 hover:border-gray-500',
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-[#003D82] p-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Select Payment Method</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500">Total Investment Amount</p>
              <p className="text-3xl font-bold text-[#003D82]">${amount.toLocaleString()}</p>
            </div>

            <div className="space-y-3">
              {methods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => onSelectMethod(method.id)}
                  className={`w-full flex items-center p-4 border-2 rounded-lg transition-all ${method.color} group text-left outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500`}
                >
                  <div className="mr-4 bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    {method.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{method.name}</h4>
                    <p className="text-xs text-gray-600">{method.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack} 
                className="text-gray-500 hover:text-[#003D82] px-0"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Form
              </Button>
              <p className="text-[10px] text-gray-400">
                Secure SSL Encrypted Transaction
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ShareholdersPaymentModal;
