/**
 * Script to create an admin user in Firebase Authentication
 */
const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');

// Initialize Firebase Admin with service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Admin user details
const adminEmail = 'mianabdullah_2027@depauw.com';
const adminPassword = 'mortonspeople';

// First try to get the user (in case it already exists)
admin.auth().getUserByEmail(adminEmail)
  .then(existingUser => {
    console.log('User already exists:', existingUser.uid);
    // Update password for existing user
    return admin.auth().updateUser(existingUser.uid, { 
      password: adminPassword,
      emailVerified: true
    });
  })
  .catch(error => {
    // User doesn't exist, create new one
    if (error.code === 'auth/user-not-found') {
      return admin.auth().createUser({
        email: adminEmail,
        password: adminPassword,
        emailVerified: true,
        displayName: 'Admin User'
      });
    }
    throw error;
  })
  .then(userRecord => {
    console.log('User updated/created:', userRecord.uid);
    // Set admin role
    return admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });
  })
  .then(() => {
    console.log('Admin credentials set:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  }); 