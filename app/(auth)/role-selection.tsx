import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Text, Title, Surface, Avatar } from 'react-native-paper';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function RoleSelectionScreen() {
  const router = useRouter();

  const selectRole = (role: string) => {
    router.push({
      pathname: '/(auth)/login',
      params: { role }
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.logoContainer} elevation={0}>
          <Image 
            source={require('../../assets/images/depauw-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Surface>

        <Title style={styles.title}>DePauw Pre-College Program</Title>
        <Text style={styles.subtitle}>Please select your role to continue</Text>
        
        <View style={styles.cardsContainer}>
          <Card style={styles.roleCard} mode="elevated">
            <Card.Content style={styles.cardHeader}>
              <Avatar.Icon 
                icon={() => <Ionicons name="briefcase" size={36} color={Colors.light.background} />} 
                size={72} 
                style={[styles.roleIcon, styles.adminIcon]} 
                color={Colors.light.background}
              />
            </Card.Content>
            <Card.Content style={styles.cardContent}>
              <Title style={styles.cardTitle}>Administrator</Title>
              <Text style={styles.cardDescription}>
                Manage the program, oversee activities, and coordinate with mentors and students.
              </Text>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button 
                mode="contained" 
                buttonColor={Colors.light.primary}
                textColor={Colors.light.headerBackground}
                style={styles.roleButton}
                onPress={() => selectRole('admin')}
              >
                Continue as Admin
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.roleCard} mode="elevated">
            <Card.Content style={styles.cardHeader}>
              <Avatar.Icon 
                icon={() => <Ionicons name="school" size={36} color={Colors.light.background} />} 
                size={72} 
                style={[styles.roleIcon, styles.mentorIcon]} 
                color={Colors.light.background}
              />
            </Card.Content>
            <Card.Content style={styles.cardContent}>
              <Title style={styles.cardTitle}>Mentor</Title>
              <Text style={styles.cardDescription}>
                Guide students through learning activities, provide feedback, and help build skills.
              </Text>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button 
                mode="contained" 
                buttonColor={Colors.light.primary}
                textColor={Colors.light.headerBackground}
                style={styles.roleButton}
                onPress={() => selectRole('mentor')}
              >
                Continue as Mentor
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.roleCard} mode="elevated">
            <Card.Content style={styles.cardHeader}>
              <Avatar.Icon 
                icon={() => <Ionicons name="person" size={36} color={Colors.light.background} />} 
                size={72} 
                style={[styles.roleIcon, styles.visitorIcon]} 
                color={Colors.light.background}
              />
            </Card.Content>
            <Card.Content style={styles.cardContent}>
              <Title style={styles.cardTitle}>Visitor</Title>
              <Text style={styles.cardDescription}>
                Explore available resources, connect with mentors, and participate in learning activities.
              </Text>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button 
                mode="contained" 
                buttonColor={Colors.light.primary}
                textColor={Colors.light.headerBackground}
                style={styles.roleButton}
                onPress={() => selectRole('visitor')}
              >
                Continue as Visitor
              </Button>
            </Card.Actions>
          </Card>
        </View>

        <Text style={styles.footerText}>
          DePauw University Pre-College Summer Program
        </Text>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 24,
    backgroundColor: 'transparent',
  },
  logo: {
    width: 240,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.light.headerBackground,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: Colors.light.text,
  },
  cardsContainer: {
    gap: 24,
  },
  roleCard: {
    marginBottom: 8,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    paddingTop: 24,
    alignItems: 'center',
    paddingBottom: 0,
  },
  roleIcon: {
    marginBottom: 8,
  },
  adminIcon: {
    backgroundColor: '#3F51B5', // Indigo
  },
  mentorIcon: {
    backgroundColor: '#00796B', // Teal
  },
  visitorIcon: {
    backgroundColor: '#E64A19', // Deep Orange
  },
  cardContent: {
    paddingVertical: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.headerBackground,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  cardActions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'flex-end',
  },
  roleButton: {
    width: '100%',
    borderRadius: 8,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 12,
    color: Colors.light.text,
  },
}); 