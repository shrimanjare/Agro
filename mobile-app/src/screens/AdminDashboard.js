import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl
} from 'react-native';
import { Card, Title, Button, FAB, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSchemes: 0,
    totalUsers: 0,
    totalOrders: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Simulate API call with dummy data
    setStats({
      totalProducts: 25,
      totalSchemes: 3,
      totalUsers: 150,
      totalOrders: 45
    });

    setRecentActivity([
      {
        id: '1',
        type: 'product',
        action: 'added',
        item: 'Organic Pesticide Pro',
        time: '2 hours ago'
      },
      {
        id: '2',
        type: 'scheme',
        action: 'updated',
        item: '50% Off Fertilizers',
        time: '4 hours ago'
      },
      {
        id: '3',
        type: 'order',
        action: 'received',
        item: 'Order #1234',
        time: '6 hours ago'
      }
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const sendNotification = () => {
    Alert.alert(
      'Send Notification',
      'Choose notification type:',
      [
        {
          text: 'New Scheme',
          onPress: () => sendSchemeNotification()
        },
        {
          text: 'Weather Update',
          onPress: () => sendWeatherNotification()
        },
        {
          text: 'General',
          onPress: () => sendGeneralNotification()
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const sendSchemeNotification = () => {
    Alert.alert(
      'Notification Sent!',
      'New scheme notification has been sent to all users via push notification, SMS, and WhatsApp.'
    );
  };

  const sendWeatherNotification = () => {
    Alert.alert(
      'Weather Alert Sent!',
      'Weather update has been broadcasted to all farmers in the region.'
    );
  };

  const sendGeneralNotification = () => {
    Alert.alert(
      'General Notification Sent!',
      'Your message has been delivered to all app users.'
    );
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'product': return 'cube';
      case 'scheme': return 'gift';
      case 'order': return 'receipt';
      default: return 'information';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'product': return '#10B981';
      case 'scheme': return '#F59E0B';
      case 'order': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage your AgroShop</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { backgroundColor: '#E6FFFA' }]}>
              <Card.Content style={styles.statContent}>
                <Ionicons name="cube" size={24} color="#10B981" />
                <Text style={styles.statNumber}>{stats.totalProducts}</Text>
                <Text style={styles.statLabel}>Products</Text>
              </Card.Content>
            </Card>

            <Card style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
              <Card.Content style={styles.statContent}>
                <Ionicons name="gift" size={24} color="#F59E0B" />
                <Text style={styles.statNumber}>{stats.totalSchemes}</Text>
                <Text style={styles.statLabel}>Schemes</Text>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
              <Card.Content style={styles.statContent}>
                <Ionicons name="people" size={24} color="#3B82F6" />
                <Text style={styles.statNumber}>{stats.totalUsers}</Text>
                <Text style={styles.statLabel}>Users</Text>
              </Card.Content>
            </Card>

            <Card style={[styles.statCard, { backgroundColor: '#F3E8FF' }]}>
              <Card.Content style={styles.statContent}>
                <Ionicons name="receipt" size={24} color="#8B5CF6" />
                <Text style={styles.statNumber}>{stats.totalOrders}</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Quick Actions</Title>
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={sendNotification}
                style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                icon="bell"
              >
                Send Notification
              </Button>
              <Button
                mode="outlined"
                onPress={() => Alert.alert('Feature', 'Product management coming soon!')}
                style={styles.actionButton}
                icon="plus"
              >
                Add Product
              </Button>
            </View>
            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                onPress={() => Alert.alert('Feature', 'Scheme management coming soon!')}
                style={styles.actionButton}
                icon="gift"
              >
                Create Scheme
              </Button>
              <Button
                mode="outlined"
                onPress={() => Alert.alert('Feature', 'Weather updates coming soon!')}
                style={styles.actionButton}
                icon="cloud"
              >
                Weather Update
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Recent Activity</Title>
            {recentActivity.map(activity => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type) + '20' }]}>
                  <Ionicons 
                    name={getActivityIcon(activity.type)} 
                    size={20} 
                    color={getActivityColor(activity.type)} 
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>
                    <Text style={styles.activityAction}>{activity.action}</Text> {activity.item}
                  </Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                <Chip mode="outlined" compact>
                  {activity.type}
                </Chip>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Notification Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Notification Channels</Title>
            <Text style={styles.cardDescription}>
              When you post updates, they will be automatically sent through:
            </Text>
            <View style={styles.channelsList}>
              <View style={styles.channelItem}>
                <Ionicons name="phone-portrait" size={20} color="#10B981" />
                <Text style={styles.channelText}>Push Notifications</Text>
                <Chip mode="flat" style={styles.activeChip}>Active</Chip>
              </View>
              <View style={styles.channelItem}>
                <Ionicons name="chatbubble" size={20} color="#10B981" />
                <Text style={styles.channelText}>SMS Messages</Text>
                <Chip mode="flat" style={styles.activeChip}>Active</Chip>
              </View>
              <View style={styles.channelItem}>
                <Ionicons name="logo-whatsapp" size={20} color="#10B981" />
                <Text style={styles.channelText}>WhatsApp</Text>
                <Chip mode="flat" style={styles.activeChip}>Active</Chip>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => Alert.alert('Quick Add', 'Choose what to add:', [
          { text: 'Product', onPress: () => Alert.alert('Feature', 'Add product coming soon!') },
          { text: 'Scheme', onPress: () => Alert.alert('Feature', 'Add scheme coming soon!') },
          { text: 'Cancel', style: 'cancel' }
        ])}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3B82F6',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
  },
  activityAction: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  channelsList: {
    marginTop: 8,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  channelText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
  activeChip: {
    backgroundColor: '#E6FFFA',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#3B82F6',
  },
});

export default AdminDashboard;