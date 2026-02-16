
import { supabase } from '@/lib/customSupabaseClient';

/**
 * Service for managing Users (Profiles) in Supabase.
 * Connects to the 'profiles' table.
 * 
 * CRITICAL: We explicitly select only specific columns to avoid 
 * "stack depth limit exceeded" errors caused by circular RLS policies 
 * or accidental deep relation fetching.
 */

export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, role, created_at, status, username')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("getAllUsers Error:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, role, created_at, status, username')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("getUserById Error:", error);
    throw error;
  }
};

/**
 * Creates a new user profile in the system.
 */
export const createUser = async (userData) => {
  try {
    // 1. Check if email already exists in profiles
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userData.email)
      .maybeSingle();

    if (existing) {
      throw new Error("A user with this email already exists in profiles.");
    }

    // 2. Insert into Profiles
    const payload = {
        full_name: userData.full_name,
        email: userData.email,
        phone: userData.phone,
        role: (userData.role || 'student').toLowerCase(), // Normalize role
        username: userData.username || userData.email.split('@')[0],
        status: 'Active',
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([payload])
      .select('id, email, full_name, phone, role')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("createUser Error:", error);
    throw error;
  }
};

export const updateUser = async (userId, updates) => {
  try {
    // Normalize role if present
    if (updates.role) {
        updates.role = updates.role.toLowerCase();
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('id, email, full_name, phone, role')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("updateUser Error:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("deleteUser Error:", error);
    throw error;
  }
};
