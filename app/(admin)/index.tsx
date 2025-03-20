import { StyleSheet, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Text, Title, Button, Divider, DataTable, Badge, IconButton } from 'react-native-paper';
import { Colors } from '../../constants/Colors';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pageHeader}>
        <Title style={styles.pageTitle}>Program Overview</Title>
        <Text style={styles.dateText}>Summer 2025</Text>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsCardContent}>
            <Text style={styles.statsNumber}>24</Text>
            <Text style={styles.statsLabel}>Active Campers</Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="text" 
              textColor={Colors.light.headerBackground}
              onPress={() => {}}
            >
              View All
            </Button>
          </Card.Actions>
        </Card>
        
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsCardContent}>
            <Text style={styles.statsNumber}>8</Text>
            <Text style={styles.statsLabel}>Mentors</Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="text" 
              textColor={Colors.light.headerBackground}
              onPress={() => {}}
            >
              View All
            </Button>
          </Card.Actions>
        </Card>
        
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsCardContent}>
            <Text style={styles.statsNumber}>42</Text>
            <Text style={styles.statsLabel}>Activities</Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="text" 
              textColor={Colors.light.headerBackground}
              onPress={() => {}}
            >
              View All
            </Button>
          </Card.Actions>
        </Card>
      </View>
      
      <Card style={styles.sectionCard}>
        <Card.Title 
          title="Upcoming Activities" 
          titleStyle={styles.cardTitle}
          right={(props) => (
            <Button 
              mode="contained" 
              buttonColor={Colors.light.primary}
              textColor={Colors.light.headerBackground}
              compact
              onPress={() => {}}
            >
              Add New
            </Button>
          )}
        />
        <Divider />
        <Card.Content style={styles.tableContainer}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Activity</DataTable.Title>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title>Location</DataTable.Title>
              <DataTable.Title numeric>Participants</DataTable.Title>
              <DataTable.Title numeric>Actions</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>Campus Tour</DataTable.Cell>
              <DataTable.Cell>Jul 7, 9:00 AM</DataTable.Cell>
              <DataTable.Cell>Main Entrance</DataTable.Cell>
              <DataTable.Cell numeric>18</DataTable.Cell>
              <DataTable.Cell numeric>
                <IconButton icon="pencil" size={20} onPress={() => {}} />
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Welcome Dinner</DataTable.Cell>
              <DataTable.Cell>Jul 7, 6:00 PM</DataTable.Cell>
              <DataTable.Cell>Hoover Hall</DataTable.Cell>
              <DataTable.Cell numeric>24</DataTable.Cell>
              <DataTable.Cell numeric>
                <IconButton icon="pencil" size={20} onPress={() => {}} />
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Team Building</DataTable.Cell>
              <DataTable.Cell>Jul 8, 10:00 AM</DataTable.Cell>
              <DataTable.Cell>Bowman Park</DataTable.Cell>
              <DataTable.Cell numeric>22</DataTable.Cell>
              <DataTable.Cell numeric>
                <IconButton icon="pencil" size={20} onPress={() => {}} />
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Card.Content>
      </Card>
      
      <Card style={styles.sectionCard}>
        <Card.Title 
          title="Camper Status" 
          titleStyle={styles.cardTitle}
          right={(props) => (
            <Button 
              mode="contained" 
              buttonColor={Colors.light.primary}
              textColor={Colors.light.headerBackground}
              compact
              onPress={() => {}}
            >
              View All
            </Button>
          )}
        />
        <Divider />
        <Card.Content style={styles.tableContainer}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Age</DataTable.Title>
              <DataTable.Title>Mentor</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
              <DataTable.Title numeric>Actions</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>Emma Johnson</DataTable.Cell>
              <DataTable.Cell>16</DataTable.Cell>
              <DataTable.Cell>Dr. Smith</DataTable.Cell>
              <DataTable.Cell>
                <Badge style={styles.statusBadgeActive}>Active</Badge>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <IconButton icon="eye" size={20} onPress={() => {}} />
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>James Wilson</DataTable.Cell>
              <DataTable.Cell>17</DataTable.Cell>
              <DataTable.Cell>Prof. Roberts</DataTable.Cell>
              <DataTable.Cell>
                <Badge style={styles.statusBadgeActive}>Active</Badge>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <IconButton icon="eye" size={20} onPress={() => {}} />
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Sophia Martinez</DataTable.Cell>
              <DataTable.Cell>16</DataTable.Cell>
              <DataTable.Cell>Dr. Lee</DataTable.Cell>
              <DataTable.Cell>
                <Badge style={styles.statusBadgePending}>Pending</Badge>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <IconButton icon="eye" size={20} onPress={() => {}} />
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Card.Content>
      </Card>

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
    width: '31%',
    backgroundColor: Colors.light.background,
  },
  statsCardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  statsLabel: {
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 4,
  },
  sectionCard: {
    marginBottom: 24,
    backgroundColor: Colors.light.background,
  },
  cardTitle: {
    fontSize: 18,
    color: Colors.light.headerBackground,
  },
  tableContainer: {
    paddingHorizontal: 0,
    paddingVertical: 8,
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