import { supabase } from '@/lib/customSupabaseClient';
import { sendWhatsAppMessage, sendWhatsAppMessageWithImage } from './wasenderapiService';
import { logWhatsAppMessage } from './whatsappLogService';
import { generateShareholderQRCode } from '@/utils/qrCodeGenerator';

// Local Storage Fallback for Event Management (since Supabase is not connected)
const EVENTS_KEY = 'ab_events_data';
const EVENTS_REGISTRATIONS_KEY = 'ab_event_registrations';

const getLocalEvents = () => JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
const saveLocalEvents = (data) => localStorage.setItem(EVENTS_KEY, JSON.stringify(data));

// === EVENT MANAGEMENT (ADMIN) ===

export const getAllEvents = async () => {
  // Try getting from localStorage
  let events = getLocalEvents();
  if (events.length === 0) {
     // Seed some data if empty
     events = [
       {
         id: 'evt-1',
         title: "Grand Launching Ceremony",
         date: "2026-04-05T11:00:00",
         description: "Join us for the official grand launching of Alpha Bridge Technologies Ltd in Kigali.",
         image_url: "https://horizons-cdn.hostinger.com/81ef3422-3855-479e-bfe8-28a4ceb0df39/e6e37094926bef1038b30bd31899fd47.png",
         enable_countdown: true,
         created_at: new Date().toISOString()
       }
     ];
     saveLocalEvents(events);
  }
  return events.sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const createEvent = async (eventData) => {
  const events = getLocalEvents();
  const newEvent = {
    id: `evt-${Date.now()}`,
    ...eventData,
    created_at: new Date().toISOString()
  };
  events.push(newEvent);
  saveLocalEvents(events);
  return newEvent;
};

export const updateEvent = async (id, updates) => {
  const events = getLocalEvents();
  const index = events.findIndex(e => e.id === id);
  if (index === -1) throw new Error("Event not found");
  events[index] = { ...events[index], ...updates };
  saveLocalEvents(events);
  return events[index];
};

export const deleteEvent = async (id) => {
  let events = getLocalEvents();
  events = events.filter(e => e.id !== id);
  saveLocalEvents(events);
  return true;
};


// === REGISTRATIONS & STATS (EXISTING LOGIC) ===

// Helper to get total slots - hardcoded for now or fetch from specific event config if we expanded
const TOTAL_SLOTS = 150;

/**
 * Saves a new event registration and sends Pending WhatsApp.
 */
export const saveEventRegistration = async (formData) => {
    // LocalStorage Fallback implementation for registrations
    try {
        const registrations = JSON.parse(localStorage.getItem(EVENTS_REGISTRATIONS_KEY) || '[]');
        const newReg = {
            id: `reg-${Date.now()}`,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            company_name: formData.companyName || null,
            event_name: formData.eventName || 'Grand Launching',
            approval_status: 'pending',
            payment_status: 'pending',
            created_at: new Date().toISOString(),
            registration_date: new Date().toISOString()
        };
        registrations.push(newReg);
        localStorage.setItem(EVENTS_REGISTRATIONS_KEY, JSON.stringify(registrations));

        // Simulate WhatsApp
        console.log("Simulating WhatsApp Pending Message to:", formData.phone);
        
        return { data: newReg, error: null };
    } catch (error) {
        console.error('Error saving event registration:', error);
        return { data: null, error };
    }
};

/**
 * Gets event stats for the counter.
 */
export const getEventStats = async () => {
    try {
        const registrations = JSON.parse(localStorage.getItem(EVENTS_REGISTRATIONS_KEY) || '[]');
        const approved = registrations.filter(r => r.approval_status === 'approved').length;
        
        const booked = approved;
        const remaining = Math.max(0, TOTAL_SLOTS - booked);
        
        return { booked, remaining, total: TOTAL_SLOTS, error: null };
    } catch (error) {
        return { booked: 0, remaining: TOTAL_SLOTS, total: TOTAL_SLOTS, error: error.message };
    }
};

/**
 * Approve registration
 */
export const approveEventRegistration = async (id, adminUser = 'Admin') => {
    // Local implementation
    const regs = JSON.parse(localStorage.getItem(EVENTS_REGISTRATIONS_KEY) || '[]');
    const index = regs.findIndex(r => r.id === id);
    if(index > -1) {
        regs[index].approval_status = 'approved';
        regs[index].approved_by = adminUser;
        localStorage.setItem(EVENTS_REGISTRATIONS_KEY, JSON.stringify(regs));
        return { success: true };
    }
    return { success: false, error: 'Not found' };
};

/**
 * Reject registration
 */
export const rejectEventRegistration = async (id, adminUser = 'Admin') => {
    // Local implementation
    const regs = JSON.parse(localStorage.getItem(EVENTS_REGISTRATIONS_KEY) || '[]');
    const index = regs.findIndex(r => r.id === id);
    if(index > -1) {
        regs[index].approval_status = 'rejected';
        regs[index].rejected_by = adminUser;
        localStorage.setItem(EVENTS_REGISTRATIONS_KEY, JSON.stringify(regs));
        return { success: true };
    }
    return { success: false, error: 'Not found' };
};