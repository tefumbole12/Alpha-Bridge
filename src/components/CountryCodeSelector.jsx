
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export const countryOptions = [
  { code: '+250', country: 'Rwanda', flag: '🇷🇼', placeholder: '788 123 456' },
  { code: '+237', country: 'Cameroon', flag: '🇨🇲', placeholder: '671 234 567' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', placeholder: '7700 900077' },
  { code: '+1', country: 'United States', flag: '🇺🇸', placeholder: '555 123 4567' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', placeholder: '50 123 4567' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬', placeholder: '772 123 456' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪', placeholder: '712 345 678' },
];

const CountryCodeSelector = ({ value, onChange, className }) => {
  const selectedCountry = countryOptions.find(c => c.code === value) || countryOptions[0];

  return (
    <div className={cn("relative", className)}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[110px] sm:w-[140px] bg-gray-50 border-gray-200 focus:ring-blue-500 rounded-lg shadow-sm hover:bg-gray-100 transition-colors">
            <SelectValue>
                <span className="flex items-center gap-2">
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <span className="font-medium text-gray-700">{selectedCountry.code}</span>
                </span>
            </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {countryOptions.map((country) => (
            <SelectItem key={country.code} value={country.code} className="cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-xl">{country.flag}</span>
                <span className="flex-1 text-sm text-gray-700">{country.country}</span>
                <span className="text-xs font-mono text-gray-400">{country.code}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountryCodeSelector;
