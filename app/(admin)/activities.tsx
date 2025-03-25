import { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button, DataTable, IconButton, TextInput, Surface, Title } from 'react-native-paper';
import { Colors } from '../../constants/Colors';

interface Activity {
  id: string;
  name: string;
  date: string;
  location: string;
  participants: number;
}

export default function ActivitiesScreen() {
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', name: 'Campus Tour', date: 'Jun 15, 2023', location: 'Main Campus', participants: 25 },
    { id: '2', name: 'Welcome Dinner', date: 'Jun 16, 2023', location: 'Dining Hall', participants: 42 },
    { id: '3', name: 'Team Building', date: 'Jun 17, 2023', location: 'Sports Center', participants: 38 },
  ]);
  
  const [search, setSearch] = useState('');
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    name: '',
    date: '',
    location: '',
    participants: 0
  });

  const handleAddActivity = () => {
    if (!newActivity.name || !newActivity.date || !newActivity.location) {
      // Show error or validation message
      return;
    }
    
    const activity: Activity = {
      id: Date.now().toString(),
      name: newActivity.name,
      date: newActivity.date,
      location: newActivity.location,
      participants: newActivity.participants || 0
    };
    
    setActivities([...activities, activity]);
    setNewActivity({ name: '', date: '', location: '', participants: 0 });
    setIsAddingActivity(false);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  const filteredActivities = activities.filter(activity => 
    activity.name.toLowerCase().includes(search.toLowerCase()) ||
    activity.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pageHeader}>
        <Title style={styles.pageTitle}>Program Schedule</Title>
        <Text style={styles.dateText}>Summer 2025</Text>
      </View>
      
      <Surface style={styles.searchContainer}>
        <TextInput
          label="Search activities"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          theme={{ colors: { primary: Colors.light.primary } }}
        />
      </Surface>
      
      {isAddingActivity && (
        <Surface style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Add New Activity</Text>
            <Button 
              mode="outlined" 
              onPress={() => setIsAddingActivity(false)}
              style={styles.cancelButton}
              textColor={Colors.light.headerBackground}
            >
              Cancel
            </Button>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              label="Activity Name"
              value={newActivity.name}
              onChangeText={(text) => setNewActivity({...newActivity, name: text})}
              style={styles.input}
              theme={{ colors: { primary: Colors.light.primary } }}
            />
            <TextInput
              label="Date"
              value={newActivity.date}
              onChangeText={(text) => setNewActivity({...newActivity, date: text})}
              style={styles.input}
              theme={{ colors: { primary: Colors.light.primary } }}
            />
            <TextInput
              label="Location"
              value={newActivity.location}
              onChangeText={(text) => setNewActivity({...newActivity, location: text})}
              style={styles.input}
              theme={{ colors: { primary: Colors.light.primary } }}
            />
            <TextInput
              label="Participants"
              value={newActivity.participants?.toString() || '0'}
              onChangeText={(text) => setNewActivity({...newActivity, participants: parseInt(text) || 0})}
              keyboardType="numeric"
              style={styles.input}
              theme={{ colors: { primary: Colors.light.primary } }}
            />
            <Button 
              mode="contained" 
              onPress={handleAddActivity} 
              style={styles.saveButton}
              buttonColor={Colors.light.primary}
              textColor={Colors.light.headerBackground}
            >
              Save Activity
            </Button>
          </View>
        </Surface>
      )}
      
      <Surface style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Activities List</Text>
          <Button 
            mode="contained" 
            onPress={() => setIsAddingActivity(true)}
            style={styles.addButton}
            buttonColor={Colors.light.primary}
            textColor={Colors.light.headerBackground}
          >
            Add New
          </Button>
        </View>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Activity</DataTable.Title>
            <DataTable.Title>Date</DataTable.Title>
            <DataTable.Title>Location</DataTable.Title>
            <DataTable.Title numeric>Participants</DataTable.Title>
            <DataTable.Title numeric>Actions</DataTable.Title>
          </DataTable.Header>
          
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <DataTable.Row key={activity.id}>
                <DataTable.Cell>{activity.name}</DataTable.Cell>
                <DataTable.Cell>{activity.date}</DataTable.Cell>
                <DataTable.Cell>{activity.location}</DataTable.Cell>
                <DataTable.Cell numeric>{activity.participants}</DataTable.Cell>
                <DataTable.Cell numeric style={styles.actionsCell}>
                  <IconButton icon="pencil" size={20} onPress={() => console.log('Edit', activity.id)} />
                  <IconButton icon="delete" size={20} onPress={() => handleDeleteActivity(activity.id)} />
                </DataTable.Cell>
              </DataTable.Row>
            ))
          ) : (
            <DataTable.Row>
              <DataTable.Cell style={{ flex: 5, justifyContent: 'center' }}>
                <Text>No activities found. Add a new activity to get started.</Text>
              </DataTable.Cell>
            </DataTable.Row>
          )}
        </DataTable>
      </Surface>
      
      <Text style={styles.footerText}>
        DePauw University Pre-College Program Dashboard
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  pageHeader: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.headerBackground,
  },
  dateText: {
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 8,
  },
  searchContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  searchInput: {
    backgroundColor: Colors.light.background,
  },
  sectionCard: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.headerBackground,
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  formContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: Colors.light.background,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: Colors.light.primary,
  },
  cancelButton: {
    borderColor: Colors.light.headerBackground,
  },
  footerText: {
    textAlign: 'center',
    marginVertical: 16,
    color: Colors.light.text,
    opacity: 0.7,
  },
}); 