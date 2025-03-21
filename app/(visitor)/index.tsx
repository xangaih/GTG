import React from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Card, Text, Title, Button, Surface, Avatar, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function VisitorDashboard() {
  const router = useRouter();

  const navigateToSection = (section: string) => {
    console.log(`Navigating to ${section}`);
    // In a real app, this would navigate to the respective screens
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Hero Banner */}
      <Surface style={styles.heroBanner} elevation={3}>
        <Title style={styles.heroTitle}>Welcome to DePauw Pre-College Program</Title>
        <Text style={styles.heroSubtitle}>Explore opportunities, connect with mentors, and discover your potential</Text>
      </Surface>

      {/* Quick Nav Section */}
      <View style={styles.quickNavContainer}>
        <Button 
          mode="contained" 
          icon="compass" 
          style={styles.navButton}
          contentStyle={styles.navButtonContent}
          buttonColor="#3F51B5"
          onPress={() => navigateToSection('explore')}
        >
          Explore
        </Button>
        <Button 
          mode="contained" 
          icon="account-group" 
          style={styles.navButton}
          contentStyle={styles.navButtonContent}
          buttonColor="#00796B"
          onPress={() => navigateToSection('mentors')}
        >
          Mentors
        </Button>
        <Button 
          mode="contained" 
          icon="calendar" 
          style={styles.navButton}
          contentStyle={styles.navButtonContent}
          buttonColor="#E64A19"
          onPress={() => navigateToSection('schedule')}
        >
          Schedule
        </Button>
        <Button 
          mode="contained" 
          icon="information" 
          style={styles.navButton}
          contentStyle={styles.navButtonContent}
          buttonColor="#7B1FA2"
          onPress={() => navigateToSection('about')}
        >
          About
        </Button>
      </View>
      
      <Title style={styles.sectionTitle}>Program Highlights</Title>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.highlightsContainer}
      >
        <Card style={styles.highlightCard}>
          <Card.Content style={styles.highlightCardContent}>
            <Avatar.Icon size={40} icon="home-city" style={styles.highlightIcon} />
            <Title style={styles.highlightTitle}>Campus Life</Title>
            <Text style={styles.highlightText}>Experience life at DePauw University's beautiful campus</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.highlightCard}>
          <Card.Content style={styles.highlightCardContent}>
            <Avatar.Icon size={40} icon="school" style={styles.highlightIcon} />
            <Title style={styles.highlightTitle}>Academic Excellence</Title>
            <Text style={styles.highlightText}>Learn from outstanding faculty in small-group settings</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.highlightCard}>
          <Card.Content style={styles.highlightCardContent}>
            <Avatar.Icon size={40} icon="account-group" style={styles.highlightIcon} />
            <Title style={styles.highlightTitle}>Mentorship</Title>
            <Text style={styles.highlightText}>Connect with dedicated mentors who guide your journey</Text>
          </Card.Content>
        </Card>
      </ScrollView>
      
      <Divider style={styles.divider} />
      
      <Title style={styles.sectionTitle}>Available Resources</Title>
      <View style={styles.resourcesContainer}>
        <Card style={styles.resourceCard}>
          <Card.Content>
            <View style={styles.resourceHeader}>
              <Avatar.Icon 
                size={40} 
                icon="book-open-variant" 
                style={styles.resourceIcon} 
              />
              <Title style={styles.resourceTitle}>Learning Paths</Title>
            </View>
            <Text style={styles.resourceDescription}>
              Discover curated learning paths designed to help you explore academic interests
            </Text>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button mode="outlined">Browse Paths</Button>
          </Card.Actions>
        </Card>
        
        <Card style={styles.resourceCard}>
          <Card.Content>
            <View style={styles.resourceHeader}>
              <Avatar.Icon 
                size={40} 
                icon="account-supervisor" 
                style={styles.resourceIcon} 
              />
              <Title style={styles.resourceTitle}>Mentorship Program</Title>
            </View>
            <Text style={styles.resourceDescription}>
              Connect with DePauw faculty and students for guidance and support
            </Text>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button mode="outlined">Meet Mentors</Button>
          </Card.Actions>
        </Card>
        
        <Card style={styles.resourceCard}>
          <Card.Content>
            <View style={styles.resourceHeader}>
              <Avatar.Icon 
                size={40} 
                icon="calendar-month" 
                style={styles.resourceIcon} 
              />
              <Title style={styles.resourceTitle}>Workshops & Events</Title>
            </View>
            <Text style={styles.resourceDescription}>
              Join interactive workshops and special events throughout the program
            </Text>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button mode="outlined">View Schedule</Button>
          </Card.Actions>
        </Card>
      </View>

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
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  heroBanner: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    marginBottom: 24,
  },
  heroTitle: {
    color: Colors.light.headerBackground,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: Colors.light.headerBackground,
    fontSize: 14,
  },
  quickNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  navButton: {
    flex: 1,
    marginHorizontal: 4,
    minWidth: 80,
    borderRadius: 8,
  },
  navButtonContent: {
    flexDirection: 'column',
    padding: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.light.headerBackground,
  },
  highlightsContainer: {
    paddingBottom: 8,
  },
  highlightCard: {
    width: 180,
    marginRight: 12,
    borderRadius: 12,
  },
  highlightCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  highlightIcon: {
    backgroundColor: Colors.light.primary,
    marginBottom: 12,
  },
  highlightTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  divider: {
    marginVertical: 24,
  },
  resourcesContainer: {
    gap: 16,
  },
  resourceCard: {
    borderRadius: 12,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resourceIcon: {
    backgroundColor: Colors.light.primary,
    marginRight: 12,
  },
  resourceTitle: {
    fontSize: 18,
  },
  resourceDescription: {
    marginTop: 8,
    marginLeft: 52,
    fontSize: 14,
    lineHeight: 20,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 12,
    color: Colors.light.text,
  },
}); 