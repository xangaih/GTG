import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Platform } from 'react-native';
import { Text, Button, DataTable, Searchbar, Chip, Portal, Modal, TextInput, List, Divider } from 'react-native-paper';
// @ts-ignore
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
// @ts-ignore
import { decode } from 'base64-arraybuffer';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
// @ts-ignore
import * as XLSX from 'xlsx';
import { db, functions } from '../../firebase/config';
import { Colors } from '../../constants/Colors';

// Define interfaces for our data structures
interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

interface ImportUser {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export default function UserManagementScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState<ImportUser[]>([]);
  const [importStep, setImportStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('visitor');
  
  // New user form
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserName, setNewUserName] = useState('');
  
  // Page state
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as User[];
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users: ", error);
      Alert.alert('Error', 'Could not load users');
    } finally {
      setLoading(false);
    }
  };

  const handleImportExcel = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        copyToCacheDirectory: true
      });
      
      if (result.canceled) {
        setLoading(false);
        return;
      }
      
      const asset = result.assets[0];
      
      if (Platform.OS === 'web') {
        const reader = new FileReader();
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target && e.target.result) {
            const data = new Uint8Array(e.target.result as ArrayBuffer);
            processExcelData(data);
          }
        };
        
        reader.readAsArrayBuffer(blob);
      } else {
        const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
        const arrayBuffer = decode(base64);
        const data = new Uint8Array(arrayBuffer);
        processExcelData(data);
      }
    } catch (error) {
      console.error("Error importing excel: ", error);
      Alert.alert('Error', 'Could not import Excel file');
      setLoading(false);
    }
  };

  const processExcelData = (data: Uint8Array) => {
    try {
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Validate the data has required fields
      if (jsonData.length === 0) {
        Alert.alert('Error', 'No data found in the Excel file');
        setLoading(false);
        return;
      }
      
      // Check for required fields - email or phone number
      const validData = jsonData.filter((row: any) => row.email || row.phone || row.phoneNumber || row.Email || row.Phone);
      
      if (validData.length === 0) {
        Alert.alert('Error', 'No valid data with email or phone found');
        setLoading(false);
        return;
      }
      
      // Normalize the data
      const normalizedData = validData.map((row: any) => ({
        name: row.name || row.fullName || row.Name || row.FullName || 'User',
        email: (row.email || row.Email || '').toString().toLowerCase(),
        phone: row.phone || row.phoneNumber || row.Phone || row.PhoneNumber || '',
        role: selectedRole
      }));
      
      setImportData(normalizedData);
      setShowImportModal(true);
      setImportStep(1);
      setLoading(false);
    } catch (error) {
      console.error("Error processing Excel: ", error);
      Alert.alert('Error', 'Failed to process Excel file');
      setLoading(false);
    }
  };

  const confirmImport = async () => {
    setLoading(true);
    setImportStep(2);
    
    try {
      // Call Firebase Function to handle sending credentials
      const sendCredentials = httpsCallable(functions, 'sendUserCredentials');
      const result = await sendCredentials({ users: importData });
      
      // Process batch writes to Firestore
      const batch = [];
      for (const user of importData) {
        batch.push(addDoc(collection(db, 'users'), {
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: selectedRole,
          createdAt: new Date().toISOString(),
          status: 'invited'
        }));
      }
      
      await Promise.all(batch);
      Alert.alert('Success', `${importData.length} users imported and invited successfully!`);
      await fetchUsers();
      setShowImportModal(false);
      setImportData([]);
      setLoading(false);
    } catch (error) {
      console.error("Error sending invites: ", error);
      Alert.alert('Error', 'Failed to import users and send invites');
      setLoading(false);
    }
  };

  const addSingleUser = async () => {
    if (!newUserEmail && !newUserPhone) {
      Alert.alert('Error', 'Email or phone number is required');
      return;
    }
    
    setLoading(true);
    try {
      // Check if user already exists
      const userQuery = query(
        collection(db, 'users'), 
        where('email', '==', newUserEmail.toLowerCase())
      );
      const userSnapshot = await getDocs(userQuery);
      
      if (!userSnapshot.empty) {
        Alert.alert('Error', 'A user with this email already exists');
        setLoading(false);
        return;
      }
      
      // Call Firebase Function to send credentials
      const sendCredentials = httpsCallable(functions, 'sendUserCredentials');
      await sendCredentials({ 
        users: [{
          name: newUserName || 'User',
          email: newUserEmail.toLowerCase(),
          phone: newUserPhone,
          role: selectedRole
        }]
      });
      
      // Add user to Firestore
      await addDoc(collection(db, 'users'), {
        name: newUserName || 'User',
        email: newUserEmail.toLowerCase(),
        phone: newUserPhone,
        role: selectedRole,
        createdAt: new Date().toISOString(),
        status: 'invited'
      });
      
      Alert.alert('Success', 'User added and invited successfully!');
      setShowAddModal(false);
      clearNewUserForm();
      await fetchUsers();
    } catch (error) {
      console.error("Error adding user: ", error);
      Alert.alert('Error', 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const clearNewUserForm = () => {
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserName('');
  };

  const deleteUser = async (userId: string) => {
    try {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this user? This will revoke their access to the app.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              setLoading(true);
              await deleteDoc(doc(db, 'users', userId));
              // Call Firebase function to revoke access 
              const revokeAccess = httpsCallable(functions, 'revokeUserAccess');
              await revokeAccess({ userId });
              Alert.alert('Success', 'User deleted successfully');
              await fetchUsers();
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error deleting user: ", error);
      Alert.alert('Error', 'Failed to delete user');
      setLoading(false);
    }
  };

  const resendInvite = async (user: User) => {
    try {
      setLoading(true);
      const sendCredentials = httpsCallable(functions, 'sendUserCredentials');
      await sendCredentials({ 
        users: [{
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }]
      });
      
      await updateDoc(doc(db, 'users', user.id), {
        status: 'invited'
      });
      
      Alert.alert('Success', 'Invitation resent successfully');
      await fetchUsers();
    } catch (error) {
      console.error("Error resending invite: ", error);
      Alert.alert('Error', 'Failed to resend invitation');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.phone?.includes(query) ||
      user.role?.toLowerCase().includes(query)
    );
  });

  const paginatedUsers = filteredUsers.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Management</Text>
      
      <View style={styles.actions}>
        <Button 
          mode="contained" 
          icon="plus" 
          onPress={() => setShowAddModal(true)}
          style={styles.actionButton}
        >
          Add User
        </Button>
        <Button 
          mode="contained" 
          icon="file-import" 
          onPress={handleImportExcel}
          style={styles.actionButton}
          loading={loading}
        >
          Import Excel
        </Button>
      </View>
      
      <Searchbar
        placeholder="Search users..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <ScrollView style={styles.usersContainer}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Email/Phone</DataTable.Title>
            <DataTable.Title>Role</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
            <DataTable.Title>Actions</DataTable.Title>
          </DataTable.Header>

          {paginatedUsers.map((user) => (
            <DataTable.Row key={user.id}>
              <DataTable.Cell>{user.name}</DataTable.Cell>
              <DataTable.Cell>
                {user.email}
                {user.phone && <Text>{'\n'}{user.phone}</Text>}
              </DataTable.Cell>
              <DataTable.Cell>
                <Chip mode="outlined" style={getStyleForRole(user.role)}>
                  {user.role}
                </Chip>
              </DataTable.Cell>
              <DataTable.Cell>
                <Chip mode="outlined" style={getStyleForStatus(user.status)}>
                  {user.status}
                </Chip>
              </DataTable.Cell>
              <DataTable.Cell>
                <View style={styles.actionButtons}>
                  {user.status === 'invited' && (
                    <Button 
                      icon="email-send" 
                      mode="text" 
                      compact 
                      onPress={() => resendInvite(user)}
                    >
                      Resend
                    </Button>
                  )}
                  <Button 
                    icon="delete" 
                    mode="text" 
                    compact 
                    onPress={() => deleteUser(user.id)}
                    textColor={Colors.light.error}
                  >
                    Delete
                  </Button>
                </View>
              </DataTable.Cell>
            </DataTable.Row>
          ))}

          {filteredUsers.length === 0 && (
            <DataTable.Row>
              <DataTable.Cell style={{ flex: 5, justifyContent: 'center' }}>
                <Text>No users found</Text>
              </DataTable.Cell>
            </DataTable.Row>
          )}
        </DataTable>
      </ScrollView>
      
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(filteredUsers.length / itemsPerPage)}
        onPageChange={setPage}
        label={`${page + 1} of ${Math.ceil(filteredUsers.length / itemsPerPage)}`}
        showFastPaginationControls
        numberOfItemsPerPageList={[5, 10, 20]}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        selectPageDropdownLabel={'Rows per page'}
      />
      
      {/* Add User Modal */}
      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => {
            setShowAddModal(false);
            clearNewUserForm();
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Add New User</Text>
          
          <TextInput
            label="Name"
            value={newUserName}
            onChangeText={setNewUserName}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Email"
            value={newUserEmail}
            onChangeText={setNewUserEmail}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
          />
          
          <TextInput
            label="Phone Number"
            value={newUserPhone}
            onChangeText={setNewUserPhone}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
          />
          
          <Text style={styles.label}>Role</Text>
          <View style={styles.roleSelection}>
            <Chip
              selected={selectedRole === 'visitor'}
              onPress={() => setSelectedRole('visitor')}
              style={styles.roleChip}
              selectedColor={Colors.light.primary}
            >
              Visitor
            </Chip>
            <Chip
              selected={selectedRole === 'mentor'}
              onPress={() => setSelectedRole('mentor')}
              style={styles.roleChip}
              selectedColor={Colors.light.primary}
            >
              Mentor
            </Chip>
            <Chip
              selected={selectedRole === 'admin'}
              onPress={() => setSelectedRole('admin')}
              style={styles.roleChip}
              selectedColor={Colors.light.primary}
            >
              Admin
            </Chip>
          </View>
          
          <View style={styles.modalActions}>
            <Button 
              mode="outlined" 
              onPress={() => {
                setShowAddModal(false);
                clearNewUserForm();
              }}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={addSingleUser}
              style={styles.modalButton}
              loading={loading}
            >
              Add User
            </Button>
          </View>
        </Modal>
      </Portal>
      
      {/* Import Modal */}
      <Portal>
        <Modal
          visible={showImportModal}
          onDismiss={() => {
            if (!loading) {
              setShowImportModal(false);
              setImportData([]);
            }
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>
            {importStep === 1 ? 'Review Import Data' : 'Sending Invitations...'}
          </Text>
          
          {importStep === 1 ? (
            <>
              <Text style={styles.importSubtitle}>
                Found {importData.length} users to import. Please review the data before proceeding.
              </Text>
              
              <Text style={styles.label}>Role for all imported users:</Text>
              <View style={styles.roleSelection}>
                <Chip
                  selected={selectedRole === 'visitor'}
                  onPress={() => setSelectedRole('visitor')}
                  style={styles.roleChip}
                  selectedColor={Colors.light.primary}
                >
                  Visitor
                </Chip>
                <Chip
                  selected={selectedRole === 'mentor'}
                  onPress={() => setSelectedRole('mentor')}
                  style={styles.roleChip}
                  selectedColor={Colors.light.primary}
                >
                  Mentor
                </Chip>
                <Chip
                  selected={selectedRole === 'admin'}
                  onPress={() => setSelectedRole('admin')}
                  style={styles.roleChip}
                  selectedColor={Colors.light.primary}
                >
                  Admin
                </Chip>
              </View>
              
              <ScrollView style={styles.dataPreview}>
                <List.Section>
                  {importData.slice(0, 5).map((user, index) => (
                    <React.Fragment key={index}>
                      <List.Item
                        title={user.name}
                        description={
                          <>
                            {user.email && <Text>Email: {user.email}{'\n'}</Text>}
                            {user.phone && <Text>Phone: {user.phone}</Text>}
                          </>
                        }
                        left={props => <List.Icon {...props} icon="account" />}
                      />
                      {index < importData.slice(0, 5).length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                  
                  {importData.length > 5 && (
                    <List.Item
                      title={`+ ${importData.length - 5} more users`}
                      left={props => <List.Icon {...props} icon="dots-horizontal" />}
                    />
                  )}
                </List.Section>
              </ScrollView>
              
              <View style={styles.modalActions}>
                <Button 
                  mode="outlined" 
                  onPress={() => {
                    setShowImportModal(false);
                    setImportData([]);
                  }}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button 
                  mode="contained" 
                  onPress={confirmImport}
                  style={styles.modalButton}
                  loading={loading}
                >
                  Import & Send Invites
                </Button>
              </View>
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                Processing users and sending invitations...
              </Text>
              <Text style={styles.loadingSubtext}>
                This may take a moment. Please do not close this screen.
              </Text>
            </View>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const getStyleForRole = (role?: string) => {
  switch (role) {
    case 'admin':
      return { backgroundColor: '#E8F0FE' };
    case 'mentor':
      return { backgroundColor: '#E6F4EA' };
    case 'visitor':
    default:
      return { backgroundColor: '#FEF7E0' };
  }
};

const getStyleForStatus = (status?: string) => {
  switch (status) {
    case 'active':
      return { backgroundColor: '#E6F4EA' };
    case 'invited':
      return { backgroundColor: '#FEF7E0' };
    case 'disabled':
      return { backgroundColor: '#FEEAE6' };
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.light.headerBackground,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButton: {
    marginRight: 12,
    backgroundColor: Colors.light.primary,
  },
  searchBar: {
    marginBottom: 16,
    backgroundColor: Colors.light.background,
  },
  usersContainer: {
    flex: 1,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.light.headerBackground,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.light.text,
  },
  roleSelection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  roleChip: {
    marginRight: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    marginLeft: 8,
  },
  importSubtitle: {
    marginBottom: 16,
    fontSize: 14,
  },
  dataPreview: {
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginVertical: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
  },
}); 