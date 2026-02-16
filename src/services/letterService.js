
import { sendWhatsAppMessage } from './wasenderapiService';
import { getAllUsers } from './userService';

const HISTORY_KEY = 'alpha_letter_history';

const getHistory = () => JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
const saveHistory = (data) => localStorage.setItem(HISTORY_KEY, JSON.stringify(data));

export const personalizeLetter = (letterContent, userData, adminName = 'Admin') => {
    let content = letterContent;
    const map = {
        USER_NAME: userData.full_name || '',
        USER_EMAIL: userData.email || '',
        USER_PHONE: userData.phone || '',
        USER_COMPANY: userData.company || '',
        USER_ADDRESS: userData.address || '',
        CURRENT_DATE: new Date().toLocaleDateString(),
        ADMIN_NAME: adminName
    };

    Object.keys(map).forEach(key => {
        content = content.replace(new RegExp(`{${key}}`, 'g'), map[key]);
    });
    return content;
};

export const sendLetter = async (template, user, adminName) => {
    const personalizedContent = personalizeLetter(template.body, user, adminName);
    const historyId = `hist-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    
    try {
        const result = await sendWhatsAppMessage(user.phone, personalizedContent);
        
        const record = {
            id: historyId,
            template_id: template.id,
            template_name: template.name, // storing name for easier history display
            user_id: user.id,
            recipient_name: user.full_name,
            recipient_phone: user.phone,
            recipient_email: user.email,
            letter_content: personalizedContent,
            status: result.success ? 'Sent' : 'Failed',
            sent_at: new Date().toISOString(),
            error_message: result.error || null
        };
        
        const history = getHistory();
        history.push(record);
        saveHistory(history);
        
        return { success: result.success, record };
    } catch (e) {
        return { success: false, error: e.message };
    }
};

export const sendLetters = async (template, userIds, adminName) => {
    const users = await getAllUsers();
    const targets = users.filter(u => userIds.includes(u.id));
    
    let sent = 0;
    let failed = 0;
    const errors = [];
    
    for (const user of targets) {
        const result = await sendLetter(template, user, adminName);
        if (result.success) sent++;
        else {
            failed++;
            errors.push(`${user.full_name}: ${result.error}`);
        }
    }
    
    return { sent, failed, errors };
};

export const getLetterHistory = async () => {
    return getHistory().sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
};

export const deleteLetterRecord = async (id) => {
    const history = getHistory().filter(h => h.id !== id);
    saveHistory(history);
};
