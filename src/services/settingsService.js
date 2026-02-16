
import { supabase } from '@/lib/customSupabaseClient';

/**
 * Service to handle system settings via Supabase
 * Maps to 'share_settings' table which holds global config
 */

export const getSystemSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('share_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.warn('getSystemSettings error (using defaults):', error.message);
      // Fallback for initial load if table is empty or connection fails
      return {
        total_shares: 100,
        price_per_share: 500,
        total_sold: 40,
        total_available: 60,
        currency: 'USD',
        system_logo: '',
        logo_url: ''
      };
    }
    
    return data;
  } catch (error) {
    console.error('System settings fetch exception:', error);
    throw error;
  }
};

export const updateSystemSettings = async (newSettings) => {
  try {
    // 1. Get current ID to ensure we update the correct row
    const { data: current, error: fetchError } = await supabase
      .from('share_settings')
      .select('id')
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // Ignore 'no rows' error
       throw fetchError;
    }

    const payload = {
        ...newSettings,
        updated_at: new Date().toISOString()
    };

    let result;
    if (current?.id) {
        // Update existing
        result = await supabase
            .from('share_settings')
            .update(payload)
            .eq('id', current.id)
            .select()
            .single();
    } else {
        // Insert if not exists
        result = await supabase
            .from('share_settings')
            .insert([payload])
            .select()
            .single();
    }

    if (result.error) throw result.error;
    return result.data;
  } catch (error) {
    console.error('System settings update exception:', error);
    throw error;
  }
};
