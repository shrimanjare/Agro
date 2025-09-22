import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { 
  Card, 
  Title, 
  Button, 
  List, 
  Switch,
  Avatar,
  Divider
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Feature', 'Edit profile coming soon!');
  };

  const handleChangePassword = () => {
    Alert.alert('Feature', 'Change password coming soon!');
  };

  const handleSupport = () => {
    Alert.alert(
      'Support',
      'Contact us:\n\n📞 Phone: +91-9876543210\n📧 Email: support@agroshop.com\n🌐 Website: www.agroshop.com'
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About AgroShop',
      'AgroShop v1.0.0\n\nYour trusted agricultural partner providing quality products and AI-powered disease detection.\n\nDeveloped with ❤️ for farmers.'
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={user?.name?.charAt(0)?.toUpperCase() || 'U'} 
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        <Text style={styles.userRole}>
          {user?.role === 'admin' ? '👑 Admin' : '👤 Customer'}
        </Text>
      </View>

      {/* Profile Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Account</Title>
          <List.Item
            title="Edit Profile"
            description="Update your personal information"
            left={props => <List.Icon {...props} icon="account-edit" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleEditProfile}
          />
          <Divider />
          <List.Item
            title="Change Password"
            description="Update your password"
            left={props => <List.Icon {...props} icon="lock" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleChangePassword}
          />
        </Card.Content>
      </Card>

      {/* Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Settings</Title>
          <List.Item
            title="Push Notifications"
            description="Receive notifications about offers and updates"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Dark Mode"
            description="Switch to dark theme"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* App Info */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Support & Info</Title>
          <List.Item
            title="Help & Support"
            description="Get help or contact us"
            left={props => <List.Icon {...props} icon="help-circle" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleSupport}
          />
          <Divider />
          <List.Item
            title="About AgroShop"
            description="App version and information"
            left={props => <List.Icon {...props} icon="information" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleAbout}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            description="Read our privacy policy"
            left={props => <List.Icon {...props} icon="shield-account" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Feature', 'Privacy policy coming soon!')}
          />
          <Divider />
          <List.Item
            title="Terms of Service"
            description="Read our terms of service"
            left={props => <List.Icon {...props} icon="file-document" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Feature', 'Terms of service coming soon!')}
          />
        </Card.Content>
      </Card>

      {/* Stats Card (for customers) */}
      {user?.role !== 'admin' && (
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Your Stats</Title>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>₹2,450</Text>
                <Text style={styles.statLabel}>Total Spent</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Disease Scans</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Logout Button */}
      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            buttonColor="#E53E3E"
            icon="logout"
          >
            Logout
          </Button>
        </Card.Content>
      </Card>

      {/* App Version */}
      <Text style={styles.versionText}>AgroShop v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#10B981',
    alignItems: 'center',
    padding: 30,
    paddingTop: 60,
  },
  avatar: {
    backgroundColor: '#059669',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 8,
  },
  userRole: {
    fontSize: 14,
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  statsCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#E6FFFA',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    marginTop: 8,
  },
  versionText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginVertical: 20,
  },
});

export default ProfileScreen;