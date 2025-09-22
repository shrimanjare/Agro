import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl
} from 'react-native';
import { Card, Title, Chip, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    // Simulate API call with dummy data
    const dummyOrders = [
      {
        _id: '1',
        orderNumber: 'ORD-001',
        date: '2024-01-15',
        status: 'delivered',
        total: 750,
        items: [
          { name: 'Organic Pesticide Pro', quantity: 2, price: 450 },
          { name: 'Garden Sprayer', quantity: 1, price: 300 }
        ]
      },
      {
        _id: '2',
        orderNumber: 'ORD-002',
        date: '2024-01-10',
        status: 'shipped',
        total: 320,
        items: [
          { name: 'NPK Fertilizer', quantity: 1, price: 320 }
        ]
      },
      {
        _id: '3',
        orderNumber: 'ORD-003',
        date: '2024-01-05',
        status: 'processing',
        total: 150,
        items: [
          { name: 'Hybrid Tomato Seeds', quantity: 1, price: 150 }
        ]
      }
    ];

    setOrders(dummyOrders);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#10B981';
      case 'shipped': return '#3B82F6';
      case 'processing': return '#F59E0B';
      case 'cancelled': return '#E53E3E';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return 'checkmark-circle';
      case 'shipped': return 'car';
      case 'processing': return 'time';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={80} color="#ccc" />
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptySubtitle}>Your order history will appear here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
        <Text style={styles.headerSubtitle}>{orders.length} orders</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {orders.map(order => (
          <Card key={order._id} style={styles.orderCard}>
            <Card.Content>
              {/* Order Header */}
              <View style={styles.orderHeader}>
                <View>
                  <Title style={styles.orderNumber}>{order.orderNumber}</Title>
                  <Text style={styles.orderDate}>
                    {new Date(order.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </View>
                <View style={styles.statusContainer}>
                  <Chip 
                    mode="flat" 
                    style={[styles.statusChip, { backgroundColor: getStatusColor(order.status) + '20' }]}
                    textStyle={{ color: getStatusColor(order.status) }}
                    icon={() => (
                      <Ionicons 
                        name={getStatusIcon(order.status)} 
                        size={16} 
                        color={getStatusColor(order.status)} 
                      />
                    )}
                  >
                    {order.status.toUpperCase()}
                  </Chip>
                </View>
              </View>

              {/* Order Items */}
              <View style={styles.itemsContainer}>
                <Text style={styles.itemsTitle}>Items:</Text>
                {order.items.map((item, index) => (
                  <View key={index} style={styles.orderItem}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDetails}>
                      Qty: {item.quantity} × ₹{item.price} = ₹{item.quantity * item.price}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Order Total */}
              <View style={styles.orderFooter}>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total Amount:</Text>
                  <Text style={styles.totalAmount}>₹{order.total}</Text>
                </View>
                
                <View style={styles.orderActions}>
                  {order.status === 'delivered' && (
                    <Button
                      mode="outlined"
                      onPress={() => {/* Handle reorder */}}
                      compact
                    >
                      Reorder
                    </Button>
                  )}
                  <Button
                    mode="text"
                    onPress={() => {/* Handle view details */}}
                    compact
                  >
                    View Details
                  </Button>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.summaryTitle}>Order Summary</Title>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{orders.length}</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  ₹{orders.reduce((sum, order) => sum + order.total, 0)}
                </Text>
                <Text style={styles.statLabel}>Total Spent</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {orders.filter(order => order.status === 'delivered').length}
                </Text>
                <Text style={styles.statLabel}>Delivered</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#10B981',
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
  orderCard: {
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusChip: {
    borderRadius: 16,
  },
  itemsContainer: {
    marginBottom: 16,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  orderItem: {
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  itemDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  summaryCard: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#E6FFFA',
  },
  summaryTitle: {
    fontSize: 18,
    color: '#10B981',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});

export default OrderHistory;