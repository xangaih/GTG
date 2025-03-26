import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Title, Button, Card, DataTable, Portal, Modal, TextInput, Chip, IconButton, Badge, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import * as XLSX from 'xlsx';
import * as DocumentPicker from 'expo-document-picker';

interface Mentor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  assignedVisitors: string[];
  createdAt: Date;
}

interface Visitor {
  id: string;
  name: string;
  email: string;
}

export default function ManageMentorsScreen() {
  const router = useRouter();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [newMentor, setNewMentor] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchMentors();
    fetchVisitors();
  }, []);

  const fetchMentors = async () => {
    try {
      const mentorQuery = query(collection(db, 'users'), where('role', '==', 'mentor'));
      const snapshot = await getDocs(mentorQuery);
      
      if (!snapshot.empty) {
        const mentorData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Mentor[];
        
        setMentors(mentorData);
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
      showSnackbar("Error fetching mentors");
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitors = async () => {
    try {
      const visitorQuery = query(collection(db, 'users'), where('role', '==', 'visitor'));
      const snapshot = await getDocs(visitorQuery);
      
      if (!snapshot.empty) {
        const visitorData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Visitor[];
        
        setVisitors(visitorData);
      }
    } catch (error) {
      console.error("Error fetching visitors:", error);
      showSnackbar("Error fetching visitors");
    }
  };

  const handleImportExcel = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      if (result.assets && result.assets[0]) {
        // Process Excel file and add mentors
        // This is a placeholder for Excel processing logic
        showSnackbar("Excel import functionality to be implemented");
      }
    } catch (error) {
      console.error("Error importing Excel:", error);
      showSnackbar("Error importing Excel file");
    }
  };

  const addSingleMentor = async () => {
    if (!newMentor.name || !newMentor.email) {
      showSnackbar("Please fill in all required fields");
      return;
    }

    try {
      const mentorData = {
        ...newMentor,
        role: 'mentor',
        assignedVisitors: [],
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'users'), mentorData);
      setShowAddModal(false);
      clearNewMentorForm();
      fetchMentors();
      showSnackbar("Mentor added successfully");
    } catch (error) {
      console.error("Error adding mentor:", error);
      showSnackbar("Error adding mentor");
    }
  };

  const deleteMentor = async (mentorId: string) => {
    try {
      await deleteDoc(doc(db, 'users', mentorId));
      fetchMentors();
      showSnackbar("Mentor deleted successfully");
    } catch (error) {
      console.error("Error deleting mentor:", error);
      showSnackbar("Error deleting mentor");
    }
  };

  const assignVisitors = async (mentorId: string, visitorIds: string[]) => {
    try {
      await updateDoc(doc(db, 'users', mentorId), {
        assignedVisitors: visitorIds,
      });
      setShowAssignModal(false);
      fetchMentors();
      showSnackbar("Visitors assigned successfully");
    } catch (error) {
      console.error("Error assigning visitors:", error);
      showSnackbar("Error assigning visitors");
    }
  };

  const clearNewMentorForm = () => {
    setNewMentor({
      name: '',
      email: '',
      phone: '',
      department: '',
    });
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Manage Mentors</Title>
        <View style={styles.headerButtons}>
          <Button 
            mode="contained" 
            onPress={handleImportExcel}
            style={styles.headerButton}
            buttonColor={Colors.light.primary}
            textColor={Colors.light.headerBackground}
          >
            Import Excel
          </Button>
          <Button 
            mode="contained" 
            onPress={() => setShowAddModal(true)}
            style={styles.headerButton}
            buttonColor={Colors.light.primary}
            textColor={Colors.light.headerBackground}
          >
            Add Mentor
          </Button>
        </View>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Email</DataTable.Title>
              <DataTable.Title>Department</DataTable.Title>
              <DataTable.Title numeric>Assigned Visitors</DataTable.Title>
              <DataTable.Title numeric>Actions</DataTable.Title>
            </DataTable.Header>

            {mentors.map((mentor) => (
              <DataTable.Row key={mentor.id}>
                <DataTable.Cell>{mentor.name}</DataTable.Cell>
                <DataTable.Cell>{mentor.email}</DataTable.Cell>
                <DataTable.Cell>{mentor.department || 'N/A'}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <Badge>{mentor.assignedVisitors?.length || 0}</Badge>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <IconButton 
                    icon="account-plus" 
                    size={20} 
                    onPress={() => {
                      setSelectedMentor(mentor);
                      setShowAssignModal(true);
                    }}
                  />
                  <IconButton 
                    icon="delete" 
                    size={20} 
                    onPress={() => deleteMentor(mentor.id)}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>

      {/* Add Mentor Modal */}
      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => {
            setShowAddModal(false);
            clearNewMentorForm();
          }}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Add New Mentor</Title>
          <TextInput
            label="Name"
            value={newMentor.name}
            onChangeText={(text) => setNewMentor({ ...newMentor, name: text })}
            style={styles.input}
          />
          <TextInput
            label="Email"
            value={newMentor.email}
            onChangeText={(text) => setNewMentor({ ...newMentor, email: text })}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            label="Phone (Optional)"
            value={newMentor.phone}
            onChangeText={(text) => setNewMentor({ ...newMentor, phone: text })}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TextInput
            label="Department (Optional)"
            value={newMentor.department}
            onChangeText={(text) => setNewMentor({ ...newMentor, department: text })}
            style={styles.input}
          />
          <View style={styles.modalActions}>
            <Button 
              mode="outlined" 
              onPress={() => {
                setShowAddModal(false);
                clearNewMentorForm();
              }}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={addSingleMentor}
              style={styles.modalButton}
            >
              Add Mentor
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Assign Visitors Modal */}
      <Portal>
        <Modal
          visible={showAssignModal}
          onDismiss={() => setShowAssignModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Assign Visitors to {selectedMentor?.name}</Title>
          <ScrollView style={styles.visitorList}>
            {visitors.map((visitor) => (
              <Chip
                key={visitor.id}
                selected={selectedMentor?.assignedVisitors?.includes(visitor.id)}
                onPress={() => {
                  const newAssignedVisitors = selectedMentor?.assignedVisitors?.includes(visitor.id)
                    ? selectedMentor.assignedVisitors.filter(id => id !== visitor.id)
                    : [...(selectedMentor?.assignedVisitors || []), visitor.id];
                  
                  setSelectedMentor({
                    ...selectedMentor!,
                    assignedVisitors: newAssignedVisitors,
                  });
                }}
                style={styles.visitorChip}
              >
                {visitor.name}
              </Chip>
            ))}
          </ScrollView>
          <View style={styles.modalActions}>
            <Button 
              mode="outlined" 
              onPress={() => setShowAssignModal(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={() => selectedMentor && assignVisitors(selectedMentor.id, selectedMentor.assignedVisitors)}
              style={styles.modalButton}
            >
              Save Assignments
            </Button>
          </View>
        </Modal>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.headerBackground,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    borderRadius: 8,
  },
  card: {
    margin: 16,
    borderRadius: 12,
  },
  modal: {
    backgroundColor: Colors.light.background,
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
    color: Colors.light.headerBackground,
  },
  input: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  modalButton: {
    borderRadius: 8,
  },
  visitorList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  visitorChip: {
    margin: 4,
  },
}); 