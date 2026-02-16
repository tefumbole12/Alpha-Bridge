
/**
 * Validates a phone number based on the country code.
 * Strips leading zeros and non-numeric characters before validation.
 * 
 * @param {string} phone - The phone number input
 * @param {string} countryCode - The country dialing code (e.g., "+250")
 * @returns {object} { isValid: boolean, formatted: string, error: string|null }
 */
export const validatePhoneByCountry = (phone, countryCode) => {
    if (!phone) return { isValid: false, formatted: null, error: 'Phone number is required' };
  
    // Remove spaces, dashes, parentheses
    let cleanPhone = phone.replace(/[\s\-()]/g, '');
  
    // Remove country code if user typed it manually
    if (cleanPhone.startsWith(countryCode)) {
      cleanPhone = cleanPhone.slice(countryCode.length);
    } else if (cleanPhone.startsWith(countryCode.replace('+', ''))) {
      cleanPhone = cleanPhone.slice(countryCode.replace('+', '').length);
    }
  
    // Remove leading zero if present (common in local formats)
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.substring(1);
    }
  
    // Check if remaining string is numeric
    if (!/^\d+$/.test(cleanPhone)) {
      return { isValid: false, formatted: null, error: 'Phone must contain only numbers' };
    }
  
    // Country specific validation rules (approximate lengths)
    let isValid = false;
    let expectedLength = '';
  
    switch (countryCode) {
      case '+250': // Rwanda
        isValid = cleanPhone.length === 9;
        expectedLength = '9 digits (e.g., 788 123 456)';
        break;
      case '+237': // Cameroon
        isValid = cleanPhone.length === 9;
        expectedLength = '9 digits';
        break;
      case '+44': // UK
        isValid = cleanPhone.length >= 10 && cleanPhone.length <= 11;
        expectedLength = '10-11 digits';
        break;
      case '+1': // USA
        isValid = cleanPhone.length === 10;
        expectedLength = '10 digits';
        break;
      case '+966': // Saudi Arabia
        isValid = cleanPhone.length === 9;
        expectedLength = '9 digits';
        break;
      case '+256': // Uganda
        isValid = cleanPhone.length === 9;
        expectedLength = '9 digits';
        break;
      case '+254': // Kenya
        isValid = cleanPhone.length === 9;
        expectedLength = '9 digits';
        break;
      default:
        isValid = cleanPhone.length >= 7 && cleanPhone.length <= 15;
        expectedLength = 'valid length';
    }
  
    if (!isValid) {
      return { isValid: false, formatted: null, error: `Invalid length for ${countryCode}. Expected ${expectedLength}.` };
    }
  
    // Return formatted full number E.164-ish style (without spaces for API)
    return { 
      isValid: true, 
      formatted: `${countryCode}${cleanPhone}`, 
      clean: cleanPhone,
      error: null 
    };
  };
