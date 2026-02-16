import React from 'react';
import { CreditCard, Smartphone } from 'lucide-react';

function ShareholdersPaymentMethodSelector({ amount, onSelectMethod }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
         <h3 className="text-xl font-bold text-navy">Select Payment Method</h3>
         <p className="text-sm text-gray-500">Investment Amount: <span className="font-bold text-gold">${amount.toLocaleString()}</span></p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => onSelectMethod('card')}
          className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
        >
          <div className="p-3 bg-blue-100 rounded-full mr-4 group-hover:bg-blue-200">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-navy">VISA / MasterCard</h4>
            <p className="text-xs text-gray-500">Secure international card payment via Stripe</p>
          </div>
        </button>

        <button
          onClick={() => onSelectMethod('mobile_money')}
          className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all group text-left"
        >
          <div className="p-3 bg-yellow-100 rounded-full mr-4 group-hover:bg-yellow-200">
            <Smartphone className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h4 className="font-bold text-navy">Mobile Money</h4>
            <p className="text-xs text-gray-500">MTN Mobile Money / Airtel Money</p>
          </div>
        </button>
      </div>
      
      <p className="text-xs text-center text-gray-400 pt-4">
        Secure SHA-256 encrypted transaction. Your financial data is never stored on our servers.
      </p>
    </div>
  );
}

export default ShareholdersPaymentMethodSelector;