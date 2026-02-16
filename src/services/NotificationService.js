// Mock Service for Notification Management

const NOTIFICATIONS_KEY = 'ab_notifications';
const NOTIFICATION_RECIPIENTS_KEY = 'ab_notification_recipients';

const getLocalNotifications = () => JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
const saveLocalNotifications = (data) => localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(data));

const getLocalRecipients = () => JSON.parse(localStorage.getItem(NOTIFICATION_RECIPIENTS_KEY) || '[]');
const saveLocalRecipients = (data) => localStorage.setItem(NOTIFICATION_RECIPIENTS_KEY, JSON.stringify(data));

export const createNotification = async (notificationData, recipients) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const notifications = getLocalNotifications();
    const notificationId = `notif-${Date.now()}`;
    
    const newNotification = {
        id: notificationId,
        ...notificationData,
        sent_at: new Date().toISOString(),
        is_archived: false
    };
    
    notifications.push(newNotification);
    saveLocalNotifications(notifications);

    // Create recipient records
    const allRecipients = getLocalRecipients();
    const newRecipients = recipients.map(r => ({
        id: `nr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        notification_id: notificationId,
        recipient_id: r.id,
        recipient_type: r.type, // User, Shareholder, Member
        recipient_name: r.name, // Stored for display convenience in mock
        is_read: false,
        created_at: new Date().toISOString()
    }));
    
    saveLocalRecipients([...allRecipients, ...newRecipients]);
    
    return newNotification;
};

export const getNotificationHistory = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const notifications = getLocalNotifications();
    const recipients = getLocalRecipients();
    
    // Join logic simulation
    return notifications.map(n => {
        const recs = recipients.filter(r => r.notification_id === n.id);
        return {
            ...n,
            recipient_count: recs.length,
            read_count: recs.filter(r => r.is_read).length
        };
    }).sort((a,b) => new Date(b.sent_at) - new Date(a.sent_at));
};

export const getNotificationsByRecipient = async (recipientId) => {
    // In real implementation this would query the join table
    await new Promise(resolve => setTimeout(resolve, 300));
    const recipients = getLocalRecipients().filter(r => r.recipient_id === recipientId);
    const notifications = getLocalNotifications();
    
    return recipients.map(r => {
        const n = notifications.find(notif => notif.id === r.notification_id);
        return { ...n, ...r }; // Merge notification details with recipient status
    }).filter(n => n.id); // Filter out any broken links
};

export const markAsRead = async (recipientRecordId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const all = getLocalRecipients();
    const index = all.findIndex(r => r.id === recipientRecordId || (r.notification_id === recipientRecordId)); // Mock flexibility
    if (index !== -1) {
        all[index].is_read = true;
        all[index].read_at = new Date().toISOString();
        saveLocalRecipients(all);
    }
};

export const deleteNotification = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let notifications = getLocalNotifications();
    notifications = notifications.filter(n => n.id !== id);
    saveLocalNotifications(notifications);
    
    let recipients = getLocalRecipients();
    recipients = recipients.filter(r => r.notification_id !== id);
    saveLocalRecipients(recipients);
    return true;
};