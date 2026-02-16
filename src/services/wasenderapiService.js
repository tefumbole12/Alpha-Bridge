/**
 * WaSender API Service Integration
 * Handles sending WhatsApp messages via WaSender API.
 */

// Use your existing .env names
const API_KEY = import.meta.env.VITE_WASENDER_API_KEY;
const DEVICE = import.meta.env.VITE_WASENDER_PHONE;
const RAW_API_URL = import.meta.env.VITE_WASENDER_API_URL || "https://wasenderapi.com/api";

// Normalize base URL (strip endpoint if mistakenly included)
const normalizeApiBaseUrl = (url) => {
  const u = String(url || "").trim().replace(/\/+$/, "");
  if (!u) return "https://wasenderapi.com/api";
  if (u.endsWith("/send-message")) return u.replace(/\/send-message$/, "");
  if (u.endsWith("/send-image")) return u.replace(/\/send-image$/, "");
  return u;
};

const API_BASE_URL = normalizeApiBaseUrl(RAW_API_URL);

const isValidPhoneNumber = (phone) => !!(phone && phone.startsWith("+") && phone.length > 8);

const logApiInteraction = (type, endpoint, success, details) => {
  const timestamp = new Date().toISOString();
  const sanitizedDetails = typeof details === "object" ? { ...details } : details;
  console.log(`[WaSender API] [${timestamp}] [${type}] ${endpoint} - Success: ${success}`, sanitizedDetails);
};

const safeJson = async (res) => {
  const t = await res.text();
  try {
    return t ? JSON.parse(t) : {};
  } catch {
    return { raw: t };
  }
};

/**
 * Sends a text message via WhatsApp using WaSender API
 */
export const sendWhatsAppMessage = async (phoneNumber, message) => {
  if (!isValidPhoneNumber(phoneNumber)) {
    return { success: false, error: "Invalid phone number format. Must start with +" };
  }

  if (!API_KEY || !DEVICE) {
    console.warn("WaSender credentials missing. Skipping network request.", {
      hasKey: !!API_KEY,
      hasDevice: !!DEVICE,
      baseUrl: API_BASE_URL,
    });
    return { success: false, error: "Configuration missing - API Key or Device not set" };
  }

  const payload = {
    // include in body (some APIs use this)
    apikey: API_KEY,
    api_key: API_KEY,          // include alternate name
    phone: phoneNumber,
    message: String(message ?? ""),
    device: DEVICE,            // keep as you had it
    priority: "high",
  };

  try {
    logApiInteraction("REQUEST", "/send-message", null, { phone: phoneNumber });

    const response = await fetch(`${API_BASE_URL}/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ✅ include key in headers too (many providers require this)
        "apikey": API_KEY,
        "x-api-key": API_KEY,
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await safeJson(response);

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || response.statusText || "Request failed";
      throw new Error(`API Error: ${response.status} ${errorMsg}`);
    }

    if (data.status === "error" || data.success === false) {
      throw new Error(data.message || data.error || "Unknown API error");
    }

    logApiInteraction("RESPONSE", "/send-message", true, { messageId: data.message_id || "unknown" });
    return { success: true, data };
  } catch (error) {
    logApiInteraction("ERROR", "/send-message", false, { error: error?.message });
    console.error("WaSender API Failure:", error);
    return { success: false, error: error?.message || "Network error or API unreachable" };
  }
};

/**
 * Sends a WhatsApp message with an image attachment
 */
export const sendWhatsAppMessageWithImage = async (phoneNumber, message, imageUrl) => {
  if (!isValidPhoneNumber(phoneNumber)) {
    return { success: false, error: "Invalid phone number format. Must start with +" };
  }

  if (!API_KEY || !DEVICE) {
    console.warn("WaSender credentials missing. Skipping network request.", {
      hasKey: !!API_KEY,
      hasDevice: !!DEVICE,
      baseUrl: API_BASE_URL,
    });
    return { success: false, error: "Configuration missing - API Key or Device not set" };
  }

  const payload = {
    apikey: API_KEY,
    api_key: API_KEY,
    phone: phoneNumber,
    message: String(message ?? ""),
    url: String(imageUrl ?? ""),
    device: DEVICE,
    priority: "high",
  };

  try {
    logApiInteraction("REQUEST", "/send-image", null, { phone: phoneNumber, hasImage: !!imageUrl });

    const response = await fetch(`${API_BASE_URL}/send-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: API_KEY,
        "x-api-key": API_KEY,
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await safeJson(response);

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || response.statusText || "Request failed";
      throw new Error(`API Error: ${response.status} ${errorMsg}`);
    }

    if (data.status === "error" || data.success === false) {
      throw new Error(data.message || data.error || "Unknown API error");
    }

    logApiInteraction("RESPONSE", "/send-image", true, { messageId: data.message_id || "unknown" });
    return { success: true, data };
  } catch (error) {
    logApiInteraction("ERROR", "/send-image", false, { error: error?.message });
    console.error("WaSender API Failure (Image):", error);
    return { success: false, error: error?.message || "Network error or API unreachable" };
  }
};
