import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Text, Title, Button, Chip, Paragraph, Divider, Surface } from 'react-native-paper';
import { Colors } from '../../constants/Colors';

export default function VisitorDashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.heroBanner} elevation={1}>
        <View style={styles.heroContentContainer}>
          <Title style={styles.heroTitle}>Welcome to DePauw</Title>
          <Text style={styles.heroSubtitle}>Pre-College Summer Program 2025</Text>
          <Button 
            mode="contained" 
            buttonColor={Colors.light.primary}
            textColor={Colors.light.headerBackground}
            style={styles.heroButton}
            onPress={() => {}}
          >
            Explore Courses
          </Button>
        </View>
        <Image 
          source={require('../../assets/images/depauw-campus.jpg')} 
          style={styles.heroImage}
          resizeMode="cover"
        />
      </Surface>

      <Title style={styles.sectionTitle}>Program Highlights</Title>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.highlightsContainer}>
        <Card style={styles.highlightCard}>
          <Card.Cover source={require('../../assets/images/campus-life.jpg')} style={styles.cardImage} />
          <Card.Content>
            <Title style={styles.cardTitle}>Campus Life</Title>
            <Paragraph style={styles.cardDescription}>
              Experience life at a top liberal arts campus with residence halls, dining options, and recreation facilities.
            </Paragraph>
          </Card.Content>
        </Card>
        
        <Card style={styles.highlightCard}>
          <Card.Cover source={require('../../assets/images/academics.jpg')} style={styles.cardImage} />
          <Card.Content>
            <Title style={styles.cardTitle}>Academic Excellence</Title>
            <Paragraph style={styles.cardDescription}>
              Learn from distinguished faculty in small class settings with personalized attention.
            </Paragraph>
          </Card.Content>
        </Card>
        
        <Card style={styles.highlightCard}>
          <Card.Cover source={require('../../assets/images/mentorship.jpg')} style={styles.cardImage} />
          <Card.Content>
            <Title style={styles.cardTitle}>Mentorship</Title>
            <Paragraph style={styles.cardDescription}>
              Connect with DePauw student mentors who will guide your pre-college experience.
            </Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>

      <Title style={styles.sectionTitle}>Available Resources</Title>
      
      <Card style={styles.resourceCard}>
        <Card.Content>
          <Title style={styles.resourceTitle}>Learning Paths</Title>
          <Divider style={styles.divider} />
          <Paragraph style={styles.resourceDescription}>
            Explore curated learning paths designed by our expert mentors in various disciplines:
          </Paragraph>
          <View style={styles.chipRow}>
            <Chip style={styles.chip} onPress={() => {}}>Computer Science</Chip>
            <Chip style={styles.chip} onPress={() => {}}>Biology</Chip>
            <Chip style={styles.chip} onPress={() => {}}>Economics</Chip>
          </View>
          <View style={styles.chipRow}>
            <Chip style={styles.chip} onPress={() => {}}>Creative Writing</Chip>
            <Chip style={styles.chip} onPress={() => {}}>Physics</Chip>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="outlined" 
            style={styles.cardActionButton}
            textColor={Colors.light.headerBackground}
            onPress={() => {}}
          >
            Browse All Paths
          </Button>
        </Card.Actions>
      </Card>
      
      <Card style={styles.resourceCard}>
        <Card.Content>
          <Title style={styles.resourceTitle}>Mentorship Program</Title>
          <Divider style={styles.divider} />
          <Paragraph style={styles.resourceDescription}>
            Connect with experienced mentors who can guide your development through personalized sessions and group workshops.
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="outlined" 
            style={styles.cardActionButton}
            textColor={Colors.light.headerBackground}
            onPress={() => {}}
          >
            Find Mentors
          </Button>
        </Card.Actions>
      </Card>
      
      <Card style={styles.resourceCard}>
        <Card.Content>
          <Title style={styles.resourceTitle}>Workshops & Events</Title>
          <Divider style={styles.divider} />
          <Paragraph style={styles.resourceDescription}>
            Participate in engaging workshops, collaborative projects, and campus events designed to enhance your learning experience.
          </Paragraph>
          <View style={styles.eventItem}>
            <Text style={styles.eventDate}>July 7, 2025</Text>
            <Text style={styles.eventTitle}>Welcome Reception</Text>
          </View>
          <View style={styles.eventItem}>
            <Text style={styles.eventDate}>July 8, 2025</Text>
            <Text style={styles.eventTitle}>Innovation Workshop</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="outlined" 
            style={styles.cardActionButton}
            textColor={Colors.light.headerBackground}
            onPress={() => {}}
          >
            View Schedule
          </Button>
        </Card.Actions>
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
    backgroundColor: '#F5F5F5',
  },
  heroBanner: {
    height: 280,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  heroContentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 24,
  },
  heroButton: {
    alignSelf: 'flex-start',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
    color: Colors.light.headerBackground,
  },
  highlightsContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  highlightCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: Colors.light.background,
  },
  cardImage: {
    height: 140,
  },
  cardTitle: {
    fontSize: 18,
    color: Colors.light.headerBackground,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.light.text,
  },
  resourceCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.light.background,
  },
  resourceTitle: {
    fontSize: 20,
    color: Colors.light.headerBackground,
    marginBottom: 8,
  },
  divider: {
    backgroundColor: Colors.light.primary,
    height: 2,
    marginBottom: 16,
  },
  resourceDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  chip: {
    margin: 4,
    backgroundColor: '#E8F4FD',
  },
  cardActionButton: {
    borderColor: Colors.light.primary,
    borderWidth: 2,
  },
  eventItem: {
    marginBottom: 12,
  },
  eventDate: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    marginVertical: 24,
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
  },
}); 