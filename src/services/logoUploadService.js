
import { supabase } from '@/lib/customSupabaseClient';
import { updateSystemSettings } from '@/services/settingsService';
import { validateImageSize } from '@/utils/imageCompression';

/**
 * Uploads a system logo to Supabase Storage and updates the settings table.
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The public URL of the uploaded logo
 */
export const uploadLogo = async (file) => {
  try {
    // 1. Validate File
    const validation = validateImageSize(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 2. Prepare Upload
    const fileExt = file.name.split('.').pop();
    const fileName = `system-logo-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // 3. Upload to Supabase Storage ('system-assets' bucket)
    const { error: uploadError } = await supabase.storage
      .from('system-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      // If bucket doesn't exist, try creating it (this usually requires admin rights or setup via dashboard)
      // For now, we assume bucket exists or throw clear error
      console.error("Storage upload error:", uploadError);
      throw new Error("Failed to upload image. Ensure 'system-assets' bucket exists.");
    }

    // 4. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('system-assets')
      .getPublicUrl(filePath);

    if (!publicUrl) {
      throw new Error("Failed to retrieve public URL for uploaded logo.");
    }

    // 5. Update share_settings table
    // We update both system_logo (legacy) and logo_url (new standard) for compatibility
    await updateSystemSettings({ 
        logo_url: publicUrl,
        system_logo: publicUrl 
    });

    return publicUrl;
  } catch (error) {
    console.error("Logo upload service error:", error);
    throw error;
  }
};
