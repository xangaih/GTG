import { StyleSheet, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Text, Title, Avatar, Button, Divider, List, Chip, ProgressBar } from 'react-native-paper';
import { Colors } from '../../constants/Colors';

export default function MentorDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, perform logout operations
    router.replace('/(auth)/role-selection' as any);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pageHeader}>
        <Title style={styles.pageTitle}>Mentor Dashboard</Title>
        <Text style={styles.dateText}>July 2025 • Summer Program</Text>
      </View>

      <Card style={styles.welcomeCard}>
        <Card.Content>
          <Title style={styles.welcomeTitle}>Welcome back, Dr. Reynolds!</Title>
          <Text style={styles.welcomeText}>
            You have 3 student updates and 2 upcoming activities today.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="outlined" 
            style={styles.goldButton}
            textColor={Colors.light.headerBackground}
            onPress={() => {}}
          >
            View Schedule
          </Button>
        </Card.Actions>
      </Card>

      <Title style={styles.sectionTitle}>My Students</Title>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.studentsScrollView}>
        <Card style={styles.studentCard}>
          <Card.Content>
            <View style={styles.studentHeader}>
              <Avatar.Text size={40} label="JD" style={styles.avatar} color={Colors.light.headerBackground} />
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>John Doe</Text>
                <Chip style={styles.programChip} textStyle={styles.programChipText}>Computer Science</Chip>
              </View>
            </View>
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Overall Progress</Text>
                <Text style={styles.progressPercent}>75%</Text>
              </View>
              <ProgressBar progress={0.75} color={Colors.light.primary} style={styles.progressBar} />
            </View>
            <Text style={styles.studentNotes}>
              Last meeting: Jul 5, 2025. Discussed project progress and research interests.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="text"
              onPress={() => {}}
              textColor={Colors.light.headerBackground}
            >
              View Details
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.studentCard}>
          <Card.Content>
            <View style={styles.studentHeader}>
              <Avatar.Text size={40} label="JS" style={styles.avatar} color={Colors.light.headerBackground} />
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>Jane Smith</Text>
                <Chip style={styles.programChip} textStyle={styles.programChipText}>Biology</Chip>
              </View>
            </View>
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Overall Progress</Text>
                <Text style={styles.progressPercent}>42%</Text>
              </View>
              <ProgressBar progress={0.42} color={Colors.light.primary} style={styles.progressBar} />
            </View>
            <Text style={styles.studentNotes}>
              Last meeting: Jul 3, 2025. Helped with lab experiment design.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="text"
              onPress={() => {}}
              textColor={Colors.light.headerBackground}
            >
              View Details
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.studentCard}>
          <Card.Content>
            <View style={styles.studentHeader}>
              <Avatar.Text size={40} label="MJ" style={styles.avatar} color={Colors.light.headerBackground} />
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>Mike Johnson</Text>
                <Chip style={styles.programChip} textStyle={styles.programChipText}>Physics</Chip>
              </View>
            </View>
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Overall Progress</Text>
                <Text style={styles.progressPercent}>89%</Text>
              </View>
              <ProgressBar progress={0.89} color={Colors.light.primary} style={styles.progressBar} />
            </View>
            <Text style={styles.studentNotes}>
              Last meeting: Jul 6, 2025. Final review of research paper.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="text"
              onPress={() => {}}
              textColor={Colors.light.headerBackground}
            >
              View Details
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>

      <Title style={styles.sectionTitle}>Today's Schedule</Title>
      
      <Card style={styles.scheduleCard}>
        <Card.Content>
          <List.Section style={styles.scheduleList}>
            <List.Item
              title="Meeting with John"
              description="2:00 PM - 3:00 PM • Julian Science Center 159"
              left={props => <List.Icon {...props} icon="clock" color={Colors.light.primary} />}
            />
            <Divider />
            <List.Item
              title="Group Workshop"
              description="4:30 PM - 6:00 PM • Hoover Hall 112"
              left={props => <List.Icon {...props} icon="account-group" color={Colors.light.primary} />}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <Title style={styles.sectionTitle}>Tomorrow</Title>
      
      <Card style={styles.scheduleCard}>
        <Card.Content>
          <List.Section style={styles.scheduleList}>
            <List.Item
              title="Faculty Planning"
              description="10:00 AM - 11:30 AM • Administration Building"
              left={props => <List.Icon {...props} icon="clipboard-text" color={Colors.light.primary} />}
            />
            <Divider />
            <List.Item
              title="Student Review: Jane"
              description="1:15 PM - 2:15 PM • Julian Science Center 159"
              left={props => <List.Icon {...props} icon="account" color={Colors.light.primary} />}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <Text style={styles.footerText}>
        DePauw University Pre-College Program
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
  welcomeCard: {
    marginBottom: 24,
    backgroundColor: Colors.light.background,
  },
  welcomeTitle: {
    fontSize: 20,
    color: Colors.light.headerBackground,
  },
  welcomeText: {
    fontSize: 14,
    marginTop: 8,
  },
  goldButton: {
    borderColor: Colors.light.primary,
    borderWidth: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
    color: Colors.light.headerBackground,
  },
  studentsScrollView: {
    marginBottom: 24,
  },
  studentCard: {
    width: 300,
    marginRight: 16,
    backgroundColor: Colors.light.background,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: Colors.light.primary,
  },
  studentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  studentName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  programChip: {
    backgroundColor: '#E8F4FD',
    height: 24,
    alignSelf: 'flex-start',
  },
  programChipText: {
    fontSize: 12,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  studentNotes: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 8,
  },
  scheduleCard: {
    marginBottom: 24,
    backgroundColor: Colors.light.background,
  },
  scheduleList: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  footerText: {
    textAlign: 'center',
    marginVertical: 16,
    color: Colors.light.text,
    opacity: 0.7,
  },
}); 