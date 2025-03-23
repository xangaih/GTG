import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sign in with email/password
  const login = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
      throw err;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      const user = auth.currentUser;
      
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      return true;
    } catch (err) {
      console.error('Change password error:', err);
      setError(err.message);
      throw err;
    }
  };

  // Get user profile from Firestore
  const getUserProfile = async (userId) => {
    try {
      // Query by Firebase Auth UID
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        return userDoc.data();
      }
      
      // If not found by UID, try looking up by email
      // This is a fallback for cases where Firestore ID doesn't match Auth UID
      if (currentUser?.email) {
        const querySnapshot = await getDocs(
          query(collection(db, 'users'), where('email', '==', currentUser.email))
        );
        
        if (!querySnapshot.empty) {
          return querySnapshot.docs[0].data();
        }
      }
      
      return null;
    } catch (err) {
      console.error('Get user profile error:', err);
      return null;
    }
  };

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Get user's role from custom claims
        const idTokenResult = await user.getIdTokenResult();
        const role = idTokenResult.claims.role || 'visitor';
        
        // Get additional user details from Firestore
        const userProfile = await getUserProfile(user.uid);
        
        setUserDetails({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber,
          role: role,
          ...userProfile
        });
      } else {
        setUserDetails(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userDetails,
    loading,
    error,
    login,
    logout,
    changePassword,
    getUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
}; 