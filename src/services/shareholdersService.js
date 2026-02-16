
import { supabase } from '@/lib/customSupabaseClient';

export const getAllShareholders = async () => {
  try {
    // Explicitly selecting columns to avoid any ambiguity and ensure lightweight fetch
    const { data, error } = await supabase
      .from('shareholders')
      .select('id, name, email, phone, company_name, shares_assigned, total_amount, currency, payment_method, payment_status, reference_number, created_at, updated_at')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching shareholders:', error);
    return [];
  }
};

export const createShareholder = async (shareholderData) => {
  try {
    const { data, error } = await supabase
      .from('shareholders')
      .insert([{
        ...shareholderData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating shareholder:', error);
    throw error;
  }
};

export const updateShareholder = async (id, updates) => {
  try {
    if (!id) throw new Error("Shareholder ID is required for update.");
    
    const { data, error } = await supabase
      .from('shareholders')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating shareholder:', error);
    throw error;
  }
};

export const deleteShareholder = async (id) => {
  try {
    if (!id) throw new Error("Shareholder ID is required for delete.");

    const { error } = await supabase
      .from('shareholders')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting shareholder:', error);
    throw error;
  }
};

export const getShareStats = async () => {
  try {
    // Try to get from share_settings first
    const { data: settings, error: settingsError } = await supabase
      .from('share_settings')
      .select('*')
      .single();

    if (!settingsError && settings) {
      return {
        total: settings.total_shares || 100,
        assigned: settings.shares_sold || 0,
        remaining: settings.shares_remaining || 100
      };
    }

    // Fallback to calculating from shareholders table
    const { data, error } = await supabase
      .from('shareholders')
      .select('shares_assigned');
    
    if (error) throw error;
    
    const total = 100; // Default total
    const assigned = data.reduce((sum, s) => sum + (s.shares_assigned || 0), 0);
    
    return {
      total,
      assigned,
      remaining: total - assigned
    };
  } catch (error) {
    console.error('Error getting share stats:', error);
    return { total: 100, assigned: 0, remaining: 100 };
  }
};
