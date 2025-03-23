const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');
const crypto = require('crypto');

admin.initializeApp();

// Initialize SendGrid with your API key
// You'll need to set these in Firebase Functions environment variables
sgMail.setApiKey(functions.config().sendgrid.key);

// Initialize Twilio
const twilioClient = twilio(
  functions.config().twilio.account_sid,
  functions.config().twilio.auth_token
);

/**
 * Generate a random password of specified length
 */
function generatePassword(length = 10) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

/**
 * Generate a username based on the user's name and a random number
 */
function generateUsername(name) {
  // Remove spaces and special characters, convert to lowercase
  const baseName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Append random numbers to make it unique
  const randomSuffix = Math.floor(Math.random() * 10000);
  
  return `${baseName}${randomSuffix}`;
}

/**
 * Send email with credentials to the user
 */
async function sendEmailCredentials(user, credentials) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://www.depauw.edu/files/resources/depauw_primary_d_logo_rev_rgb.jpg" alt="DePauw University Logo" style="max-width: 200px;">
      </div>
      
      <h2 style="color: #000; text-align: center;">Welcome to DePauw Pre-College Program</h2>
      
      <p>Hello ${user.name},</p>
      
      <p>You have been invited to join the DePauw Pre-College Program mobile app. Your account has been created with the following credentials:</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Username:</strong> ${credentials.username}</p>
        <p><strong>Password:</strong> ${credentials.password}</p>
      </div>
      
      <p>Please download our mobile app and log in with these credentials. You'll be prompted to change your password after your first login.</p>
      
      <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
        This is an automated message. Please do not reply to this email.<br>
        If you have any questions, please contact the program administrator.
      </p>
    </div>
  `;
  
  const msg = {
    to: user.email,
    from: functions.config().sendgrid.sender_email,
    subject: 'Your DePauw Pre-College Program Login Credentials',
    html: htmlContent,
  };
  
  return sgMail.send(msg);
}

/**
 * Send SMS with credentials to the user
 */
async function sendSmsCredentials(user, credentials) {
  const message = `
DePauw Pre-College Program: 
Your login credentials are:
Username: ${credentials.username}
Password: ${credentials.password}
Download the app and log in with these credentials.
  `;
  
  return twilioClient.messages.create({
    body: message,
    from: functions.config().twilio.phone_number,
    to: user.phone
  });
}

/**
 * Cloud Function to create users and send credentials
 */
exports.sendUserCredentials = functions.https.onCall(async (data, context) => {
  // Admin authentication is required
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }
  
  // Admin role check can be added here if needed
  
  const { users } = data;
  if (!users || !Array.isArray(users)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with "users" array.'
    );
  }
  
  const results = [];
  
  for (const user of users) {
    try {
      // Generate credentials
      const credentials = {
        username: generateUsername(user.name),
        password: generatePassword(12)
      };
      
      // Create user in Firebase Auth
      let userRecord;
      try {
        userRecord = await admin.auth().createUser({
          email: user.email || `${credentials.username}@example.com`,
          password: credentials.password,
          displayName: user.name,
          phoneNumber: user.phone ? `+1${user.phone.replace(/\D/g, '')}` : undefined,
          disabled: false
        });
        
        // Set custom claims for role
        await admin.auth().setCustomUserClaims(userRecord.uid, {
          role: user.role || 'visitor'
        });
      } catch (authError) {
        console.error('Error creating auth user:', authError);
        throw new Error(`Failed to create user authentication: ${authError.message}`);
      }
      
      // Send credentials to the user
      if (user.email) {
        await sendEmailCredentials(user, credentials);
      }
      
      if (user.phone) {
        // Format phone for Twilio (E.164 format)
        const formattedPhone = user.phone.startsWith('+')
          ? user.phone
          : `+1${user.phone.replace(/\D/g, '')}`;
          
        user.phone = formattedPhone;
        await sendSmsCredentials(user, credentials);
      }
      
      results.push({
        userId: userRecord.uid,
        username: credentials.username,
        success: true
      });
    } catch (error) {
      console.error('Error processing user:', error);
      results.push({
        name: user.name,
        email: user.email,
        phone: user.phone,
        error: error.message,
        success: false
      });
    }
  }
  
  return { results };
});

/**
 * Cloud Function to revoke user access
 */
exports.revokeUserAccess = functions.https.onCall(async (data, context) => {
  // Admin authentication is required
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }
  
  const { userId, email } = data;
  
  if (!userId && !email) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Either userId or email is required.'
    );
  }
  
  try {
    let userRecord;
    
    if (userId) {
      // If we have the Firebase UID
      userRecord = await admin.auth().getUser(userId);
    } else if (email) {
      // If we only have the email
      userRecord = await admin.auth().getUserByEmail(email);
    }
    
    // Disable the user account
    await admin.auth().updateUser(userRecord.uid, {
      disabled: true
    });
    
    return { success: true, message: 'User access revoked successfully' };
  } catch (error) {
    console.error('Error revoking user access:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to revoke user access: ${error.message}`
    );
  }
}); 