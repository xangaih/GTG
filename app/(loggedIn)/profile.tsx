import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { TextInput, Button, Text, Title, Avatar, Card, Divider, ActivityIndicator, Snackbar } from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Colors } from '../../constants/Colors';
import { ThemedView } from '../../components/ThemedView';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, userDetails, getUserProfile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bioText, setBioText] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  
  useEffect(() => {
    if (userDetails) {
      setDisplayName(userDetails.displayName || '');
      setEmail(userDetails.email || '');
      setPhone(userDetails.phone || '');
      setBioText(userDetails.bio || '');
      setProfileImage(userDetails.photoURL || null);
    }
  }, [userDetails]);
  
  const pickImage = async () => {
    if (!isEditMode) return;
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      setMessage('Permission to access camera roll is required!');
      setIsError(true);
      setShowSnackbar(true);
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };
  
  const handleUpdateProfile = async () => {
    if (!isEditMode) {
      setIsEditMode(true);
      return;
    }
    
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const updateData = {
        displayName,
        phone,
        bio: bioText,
        updatedAt: new Date(),
      };
      
      // Upload profile image if changed
      if (profileImage && !profileImage.startsWith('https://')) {
        const storage = getStorage();
        const imageRef = ref(storage, `profile-images/${currentUser.uid}`);
        
        // Convert URI to blob
        const response = await fetch(profileImage);
        const blob = await response.blob();
        
        // Upload to Firebase Storage
        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);
        
        updateData.photoURL = downloadURL;
      }
      
      await updateDoc(userDocRef, updateData);
      await getUserProfile(currentUser.uid);
      
      setMessage('Profile updated successfully!');
      setIsError(false);
      setShowSnackbar(true);
      setIsEditMode(false);
    } catch (err) {
      console.error('Update profile error:', err);
      setMessage('Failed to update profile. Please try again.');
      setIsError(true);
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };
  
  const cancelEdit = () => {
    // Reset form values to original
    if (userDetails) {
      setDisplayName(userDetails.displayName || '');
      setEmail(userDetails.email || '');
      setPhone(userDetails.phone || '');
      setBioText(userDetails.bio || '');
      setProfileImage(userDetails.photoURL || null);
    }
    setIsEditMode(false);
  };
  
  const navigateToChangePassword = () => {
    router.push('/change-password');
  };
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage} disabled={!isEditMode}>
            {profileImage ? (
              <Avatar.Image 
                source={{ uri: profileImage }} 
                size={120} 
                style={styles.profileImage}
              />
            ) : (
              <Avatar.Icon 
                icon="account" 
                size={120} 
                style={styles.profileImage}
                color={Colors.light.white}
                backgroundColor={Colors.light.headerBackground}
              />
            )}
            {isEditMode && (
              <View style={styles.editImageIcon}>
                <MaterialIcons name="edit" size={24} color={Colors.light.white} />
              </View>
            )}
          </TouchableOpacity>
          
          <Title style={styles.title}>
            {userDetails?.displayName || userDetails?.email || 'Profile'}
          </Title>
          <Text style={styles.subtitle}>
            {userDetails?.role === 'admin' ? 'Administrator' : 
             userDetails?.role === 'mentor' ? 'Mentor' : 'Student'}
          </Text>
        </View>
        
        <Card style={styles.card}>
          <Card.Title 
            title="Personal Information"
            left={(props) => <MaterialIcons name="person" size={24} color={Colors.light.primary} />}
          />
          <Card.Content>
            <TextInput
              label="Full Name"
              value={displayName}
              onChangeText={setDisplayName}
              mode="outlined"
              style={styles.input}
              disabled={!isEditMode}
            />
            
            <TextInput
              label="Email Address"
              value={email}
              mode="outlined"
              style={styles.input}
              disabled={true} // Email should not be editable
            />
            
            <TextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              style={styles.input}
              disabled={!isEditMode}
              keyboardType="phone-pad"
            />
            
            <TextInput
              label="Bio"
              value={bioText}
              onChangeText={setBioText}
              mode="outlined"
              style={styles.textArea}
              multiline
              numberOfLines={4}
              disabled={!isEditMode}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Title 
            title="Security"
            left={(props) => <MaterialCommunityIcons name="shield-lock" size={24} color={Colors.light.primary} />}
          />
          <Card.Content>
            <Button 
              mode="outlined" 
              onPress={navigateToChangePassword}
              style={styles.securityButton}
              icon="key-change"
            >
              Change Password
            </Button>
          </Card.Content>
        </Card>
        
        <View style={styles.actionButtons}>
          {isEditMode ? (
            <>
              <Button 
                mode="contained" 
                onPress={handleUpdateProfile}
                style={styles.saveButton}
                loading={loading}
                disabled={loading}
              >
                Save Changes
              </Button>
              
              <Button 
                mode="outlined"
                onPress={cancelEdit}
                style={styles.cancelButton}
                disabled={loading}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              mode="contained" 
              onPress={handleUpdateProfile}
              style={styles.editButton}
              icon="pencil"
            >
              Edit Profile
            </Button>
          )}
        </View>
      </ScrollView>
      
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        style={[
          styles.snackbar,
          isError ? styles.errorSnackbar : styles.successSnackbar
        ]}
      >
        {message}
      </Snackbar>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    marginBottom: 16,
  },
  editImageIcon: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.headerBackground,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 4,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.light.background,
  },
  textArea: {
    marginBottom: 16,
    backgroundColor: Colors.light.background,
    minHeight: 100,
  },
  securityButton: {
    marginVertical: 8,
    borderColor: Colors.light.primary,
  },
  actionButtons: {
    marginTop: 8,
    marginBottom: 40,
  },
  editButton: {
    backgroundColor: Colors.light.primary,
    marginVertical: 8,
  },
  saveButton: {
    backgroundColor: Colors.light.success,
    marginBottom: 16,
  },
  cancelButton: {
    borderColor: Colors.light.error,
    borderWidth: 1,
  },
  snackbar: {
    marginBottom: 16,
  },
  errorSnackbar: {
    backgroundColor: Colors.light.error,
  },
  successSnackbar: {
    backgroundColor: Colors.light.success,
  },
}); 