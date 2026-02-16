import { supabase } from '@/lib/customSupabaseClient';
import { sendWhatsAppMessageWithImage, sendWhatsAppMessage } from './wasenderapiService';
import { generateShareholderQRCode } from '@/utils/qrCodeGenerator';
import { logWhatsAppMessage } from './whatsappLogService';
import { generateReferenceNumber } from '@/utils/referenceNumberGenerator';

/**
 * Fetch the total number of shares already booked.
 */
export const getTotalBookedShares = async () => {
  try {
    const { data, error } = await supabase
      .from('shareholders')
      .select('shares_assigned');
    
    if (error) throw error;
    const totalBooked = data.reduce((sum, record) => sum + (record.shares_assigned || 0), 0);
    return { data: totalBooked, error: null };
  } catch (error) {
    console.error('Error fetching total booked shares:', error.message);
    return { data: 0, error };
  }
};

/**
 * Get remaining shares.
 */
export const getRemainingShares = async () => {
  const { data: bookedDB, error } = await getTotalBookedShares();
  const TOTAL_SHARES = 100;
  
  if (error) return { data: 60, error }; // Default fallback
  
  const totalBooked = (bookedDB || 0);
  const remaining = Math.max(0, TOTAL_SHARES - totalBooked);
  return { data: remaining, error: null };
};

/**
 * Admin: Fetch all shareholders
 * Corrected to use SELECT instead of UPDATE
 */
export const getAllShareholders = async () => {
    try {
        const { data, error } = await supabase
            .from('shareholders')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return { data, error: null };
    } catch(err) {
        console.error("Error fetching shareholders:", err);
        return { data: [], error: err };
    }
}

/**
 * Get shareholder by reference number
 */
export const getShareholderByReference = async (referenceNumber) => {
    try {
        const { data, error } = await supabase
            .from('shareholders')
            .select('*')
            .eq('reference_number', referenceNumber)
            .single();
            
        if (error) throw error;
        return { data, error: null };
    } catch (err) {
        console.error("Error fetching shareholder by reference:", err);
        return { data: null, error: err };
    }
}

/**
 * Saves a new shareholder registration directly.
 */
export const saveShareholderRegistration = async (formData) => {
  try {
    console.log("Saving shareholder registration:", formData);

    const referenceNumber = generateReferenceNumber();

    const payload = {
      name: formData.fullName || formData.name,
      email: formData.email,
      phone: formData.phone,
      company_name: formData.companyName || formData.company_name || null,
      shares_assigned: formData.shares || formData.shares_assigned,
      total_amount: formData.totalAmount || formData.total_amount,
      currency: formData.currency || 'USD',
      payment_method: 'pending_confirmation', // Default for direct submission
      payment_status: 'pending',
      reference_number: referenceNumber,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('shareholders')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    // Generate QR and Send WhatsApp Notification
    (async () => {
        const qrData = {
            fullName: payload.name,
            shares: payload.shares_assigned,
            totalAmount: payload.total_amount,
            reference: referenceNumber
        };
        
        let result = { success: false, error: 'Initialization' };
        try {
            const qrBase64 = await generateShareholderQRCode(qrData);
            const msg = `Hi ${payload.name},\n\nThank you for your interest in Alpha Bridge Technologies Ltd!\n\nReference: ${referenceNumber}\nShares: ${payload.shares_assigned}\nAmount: $${payload.total_amount}\n\nYour application has been received. We will contact you shortly regarding the next steps.\n\nContact: +237671553091`;
            
            result = await sendWhatsAppMessageWithImage(payload.phone, msg, qrBase64);
        } catch (qrError) {
            console.error("QR Generation failed, sending text only", qrError);
            const msg = `Hi ${payload.name},\n\nThank you for your interest in Alpha Bridge Technologies Ltd!\n\nReference: ${referenceNumber}\nShares: ${payload.shares_assigned}\nAmount: $${payload.total_amount}\n\nYour application has been received.\n\nContact: +237671553091`;
            result = await sendWhatsAppMessage(payload.phone, msg);
        }

        // Update DB with WhatsApp status
        if (data && data.id) {
            await supabase
                .from('shareholders')
                .update({ 
                    whatsapp_sent: result.success,
                    whatsapp_sent_at: new Date().toISOString(),
                    whatsapp_error: result.error || null
                })
                .eq('id', data.id);
            
            await logWhatsAppMessage({
                recipient_phone: payload.phone,
                message_type: 'shareholder_application',
                status: result.success ? 'success' : 'failed',
                error_message: result.error,
                related_registration_id: data.id
            });
        }
    })();

    return { data, error: null };
  } catch (error) {
    console.error('Error saving shareholder registration:', error.message);
    return { data: null, error };
  }
};