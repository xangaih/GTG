import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Text, Title, Button, Divider, DataTable, Badge, IconButton } from 'react-native-paper';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
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
  program?: string;
  [key: string]: any;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [visitorCount, setVisitorCount] = useState(0);
  const [mentorCount, setMentorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState<User[]>([]);

  // Fetch counts on component mount
  useEffect(() => {
    fetchCounts();
    fetchRecentVisitors();
  }, []);

  const fetchCounts = async () => {
    setLoading(true);
    try {
      // Count visitors
      const visitorQuery = query(collection(db, 'users'), where('role', '==', 'visitor'));
      const visitorSnapshot = await getDocs(visitorQuery);
      setVisitorCount(visitorSnapshot.size);

      // Count mentors
      const mentorQuery = query(collection(db, 'users'), where('role', '==', 'mentor'));
      const mentorSnapshot = await getDocs(mentorQuery);
      setMentorCount(mentorSnapshot.size);
    } catch (error) {
      console.error("Error fetching counts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentVisitors = async () => {
    try {
      const visitorQuery = query(
        collection(db, 'users'),
        where('role', '==', 'visitor')
      );
      const snapshot = await getDocs(visitorQuery);
      
      if (!snapshot.empty) {
        const visitorData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        
        // Sort by date and take most recent
        const sorted = visitorData.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        
        setVisitors(sorted.slice(0, 3)); // Get top 3 recent visitors
      }
    } catch (error) {
      console.error("Error fetching recent visitors:", error);
    }
  };

  const navigateToUserManagement = () => {
    router.push('/user-management');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pageHeader}>
        <Title style={styles.pageTitle}>Program Overview</Title>
        <Text style={styles.dateText}>Summer 2025</Text>
      </View>

      {/* Stats container with horizontal layout */}
      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <View style={styles.statsCardContent}>
            <Text style={styles.statsNumber}>
              {loading ? '...' : visitorCount}
            </Text>
            <Text style={styles.statsLabel}>Active Visitors</Text>
          </View>
          <Button 
            mode="text" 
            textColor={Colors.light.headerBackground}
            onPress={() => router.push('/user-management')}
            style={styles.viewButton}
            disabled={loading}
          >
            View All
          </Button>
        </View>
        
        <View style={styles.statsCard}>
          <View style={styles.statsCardContent}>
            <Text style={styles.statsNumber}>
              {loading ? '...' : mentorCount}
            </Text>
            <Text style={styles.statsLabel}>Mentors</Text>
          </View>
          <Button 
            mode="text" 
            textColor={Colors.light.headerBackground}
            onPress={() => router.push('/user-management?role=mentor')}
            style={styles.viewButton}
            disabled={loading}
          >
            View All
          </Button>
        </View>
      </View>
      
      {/* Visitor Status Section */}
      <View style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Visitor Status</Text>
          <Button 
            mode="contained" 
            buttonColor={Colors.light.primary}
            textColor={Colors.light.headerBackground}
            compact
            onPress={navigateToUserManagement}
          >
            Manage Visitors
          </Button>
        </View>
        <Divider />
        <View style={styles.tableContainer}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Email/Phone</DataTable.Title>
              <DataTable.Title>Program</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
              <DataTable.Title numeric>Actions</DataTable.Title>
            </DataTable.Header>

            {visitors.length > 0 ? (
              visitors.map((visitor: User) => (
                <DataTable.Row key={visitor.id}>
                  <DataTable.Cell>{visitor.name || 'N/A'}</DataTable.Cell>
                  <DataTable.Cell>
                    {visitor.email || 'N/A'}
                    {visitor.phone && <Text>{'\n'}{visitor.phone}</Text>}
                  </DataTable.Cell>
                  <DataTable.Cell>{visitor.program || 'N/A'}</DataTable.Cell>
                  <DataTable.Cell>
                    <Badge style={styles.statusBadgeActive}>
                      {visitor.status || 'Active'}
                    </Badge>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <IconButton 
                      icon="eye" 
                      size={20} 
                      onPress={() => router.push(`/user-management?id=${visitor.id}`)} 
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <DataTable.Row>
                <DataTable.Cell style={{ flex: 5, justifyContent: 'center' }}>
                  <Text>No visitors found. Add visitors through the Manage Visitors page.</Text>
                </DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable>
        </View>
      </View>

      {/* Footer */}
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
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsCard: {
    width: '48%', // Two cards side by side with some margin
    backgroundColor: Colors.light.background,
    padding: 16,
    borderRadius: 8,
    justifyContent: 'space-between',
    height: 150,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statsCardContent: {
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  statsLabel: {
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 8,
  },
  viewButton: {
    marginTop: 8,
    alignSelf: 'center',
  },
  sectionCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    marginBottom: 24,
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
  tableContainer: {
    padding: 8,
  },
  statusBadgeActive: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  statusBadgePending: {
    backgroundColor: '#FF9800',
    color: 'white',
  },
  footerText: {
    textAlign: 'center',
    marginVertical: 16,
    color: Colors.light.text,
    opacity: 0.7,
  },
});