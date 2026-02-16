
import { sendWhatsAppMessage } from './wasenderapiService';

const INVITATIONS_KEY = 'alpha_invitations';

const getInvitations = () => JSON.parse(localStorage.getItem(INVITATIONS_KEY) || '[]');
const saveInvitations = (inv) => localStorage.setItem(INVITATIONS_KEY, JSON.stringify(inv));

export const createInvitation = async (userId) => {
    const token = Math.random().toString(36).substring(7);
    const inv = {
        id: `inv-${Date.now()}`,
        user_id: userId,
        token,
        status: 'Pending',
        created_at: new Date().toISOString()
    };
    
    const all = getInvitations();
    all.push(inv);
    saveInvitations(all);
    return inv;
};

export const sendInvitation = async (userId, phone) => {
    const inv = await createInvitation(userId);
    const msg = `You have been invited to join Alpha Bridge Admin Panel. Use token: ${inv.token} to accept.`;
    await sendWhatsAppMessage(phone, msg);
    return inv;
};

export const getPendingInvitations = async () => {
    const all = getInvitations();
    return all.filter(i => i.status === 'Pending');
};
