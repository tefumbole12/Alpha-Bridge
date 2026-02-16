
import { supabase } from '@/lib/customSupabaseClient';
import { createProfile } from '@/services/profileService';

export const createAdminAccount = async (email, password, fullName, phone, role = 'admin') => {
  try {
    // 1. Sign up the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          role: role 
        }
      }
    });

    if (authError) throw authError;

    if (authData.user) {
        // 2. Create Profile safely
        // Check if exists first to avoid duplicate key errors if triggers exist
        const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', authData.user.id)
            .single();

        if (!existing) {
            await createProfile(authData.user.id, email, fullName, phone, role);
        } else {
             // Update if exists
             await supabase.from('profiles').update({
                 full_name: fullName,
                 phone: phone,
                 role: role
             }).eq('id', authData.user.id);
        }

        // 3. Assign Role via RPC
        await supabase.rpc('assign_role', {
            target_user_id: authData.user.id,
            role_name: role
        });
    }

    return authData;
  } catch (error) {
    throw error;
  }
};

export const sendPasswordResetEmail = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/admin/update-password', 
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    throw error;
  }
};
