
import { supabase } from '@/lib/customSupabaseClient';
import { logEmailSent } from './emailLoggingService';

const invokeEmailFunction = async (functionName, payload, applicationId, emailType, recipientEmail) => {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload
    });

    if (error) throw error;

    if (!data.success) {
      throw new Error(data.error || 'Unknown error sending email');
    }

    // Log success if applicationId is provided (might be null for general notifications)
    if (applicationId) {
      await logEmailSent(applicationId, emailType, recipientEmail, 'sent', data.messageId);
    }
    return { success: true, messageId: data.messageId };

  } catch (error) {
    console.error(`Error sending ${emailType}:`, error);
    // Log failure if applicationId is provided
    if (applicationId) {
      await logEmailSent(applicationId, emailType, recipientEmail, 'failed', null, error.message);
    }
    return { success: false, error: error.message };
  }
};

export const sendApplicationConfirmation = async (candidateEmail, applicationData) => {
  return invokeEmailFunction(
    'send-application-confirmation',
    {
      candidateEmail,
      candidateName: applicationData.candidate_name,
      jobTitle: applicationData.jobTitle,
      referenceNumber: applicationData.reference_number,
      applicationId: applicationData.id
    },
    applicationData.id,
    'confirmation',
    candidateEmail
  );
};

export const sendApplicationReceivedAdmin = async (adminEmail, applicationData) => {
  return invokeEmailFunction(
    'send-application-received-admin',
    {
      adminEmail,
      candidateName: applicationData.candidate_name,
      candidateEmail: applicationData.email,
      candidatePhone: applicationData.phone,
      jobTitle: applicationData.jobTitle,
      applicationId: applicationData.id
    },
    applicationData.id,
    'admin_notification',
    adminEmail || 'admin'
  );
};

export const sendApplicationRejected = async (candidateEmail, applicationData, rejectionReason) => {
  return invokeEmailFunction(
    'send-application-rejected',
    {
      candidateEmail,
      candidateName: applicationData.candidate_name,
      jobTitle: applicationData.jobTitle || applicationData.jobs?.title,
      rejectionReason
    },
    applicationData.id,
    'rejection',
    candidateEmail
  );
};

export const sendApplicationShortlisted = async (candidateEmail, applicationData, interviewDetails) => {
  return invokeEmailFunction(
    'send-application-shortlisted',
    {
      candidateEmail,
      candidateName: applicationData.candidate_name,
      jobTitle: applicationData.jobTitle || applicationData.jobs?.title,
      interviewDate: interviewDetails.date,
      interviewTime: interviewDetails.time,
      interviewLocation: interviewDetails.location
    },
    applicationData.id,
    'shortlisted',
    candidateEmail
  );
};

export const sendInterviewInvitation = async (candidateEmail, applicationData, invitationDetails) => {
  return invokeEmailFunction(
    'send-interview-invitation',
    {
      candidateEmail,
      candidateName: applicationData.candidate_name,
      jobTitle: applicationData.jobTitle || applicationData.jobs?.title,
      interviewDate: invitationDetails.date,
      interviewTime: invitationDetails.time,
      interviewLocation: invitationDetails.location,
      contactPerson: invitationDetails.contactPerson,
      contactPhone: invitationDetails.contactPhone
    },
    applicationData.id,
    'interview_invitation',
    candidateEmail
  );
};

// New functions for Registration
export const sendRegistrationConfirmation = async (registrationData, recipientEmail) => {
  // Using the generic 'send-email' function or a specific one if it existed.
  // For now, we'll use the generic structure assuming a template or direct HTML handling in the edge function.
  // If a specific edge function 'send-registration-confirmation' exists, use that.
  // Based on context, we'll use 'send-email' with a specific template type.
  
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: recipientEmail,
        subject: 'Course Registration Confirmation - Alpha Bridge',
        templateType: 'registration_confirmation',
        data: {
          clientName: registrationData.client_name,
          courseNames: registrationData.course_names || [], // Array of strings
          totalPrice: registrationData.total_price,
          registrationId: registrationData.id,
          paymentStatus: registrationData.payment_status
        }
      }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending registration confirmation:', error);
    return { success: false, error: error.message };
  }
};

export const sendAdminNotification = async (registrationData) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: 'admin@alpha-bridge.net', // Or fetch from settings
        subject: 'New Course Registration Received',
        templateType: 'admin_registration_notification',
        data: {
          clientName: registrationData.client_name,
          clientEmail: registrationData.client_email,
          courseNames: registrationData.course_names || [],
          totalPrice: registrationData.total_price,
          registrationId: registrationData.id
        }
      }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error: error.message };
  }
};

export const sendOTPEmail = async (email, otpCode) => {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: email,
        subject: 'Your OTP Code - Alpha Bridge',
        htmlBody: `<h1>OTP Code</h1><p>${otpCode}</p>`,
        templateType: 'otp',
        data: { otpCode }
      }
    });
    return { success: !error, data };
};
