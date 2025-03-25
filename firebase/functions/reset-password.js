/**
 * Script to reset a user's password in Firebase Authentication
 */
const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  // App might already be initialized
  console.log('Firebase app initialization:', error.message);
}

// User email and new password
const userEmail = 'mianabdullah_2027@depauw.com';
const newPassword = 'mortonspeople';

// Reset the user's password
admin.auth().getUserByEmail(userEmail)
  .then(user => {
    console.log('Found user:', user.uid, user.email);
    
    return admin.auth().updateUser(user.uid, {
      password: newPassword,
      emailVerified: true
    });
  })
  .then(userRecord => {
    console.log(`Successfully reset password for: ${userEmail}`);
    console.log('New password is:', newPassword);
    console.log('Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error resetting password:', error);
    process.exit(1);
  }); 