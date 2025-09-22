import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert
} from 'react-native';
import { Card, Title, Paragraph, Button, Searchbar, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API_BASE_URL = 'http://localhost:5000/api';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [weather, setWeather] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();

  const categories = ['All', 'Pesticide', 'Fertilizer', 'Seed', 'Tool'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch products (dummy data for now)
      const dummyProducts = [
        {
          _id: '1',
          name: 'Organic Pesticide Pro',
          category: 'Pesticide',
          price: 450,
          image: 'https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Effective organic pesticide for crop protection',
          stock: 50
        },
        {
          _id: '2',
          name: 'NPK Fertilizer',
          category: 'Fertilizer',
          price: 320,
          image: 'https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Balanced NPK fertilizer for healthy plant growth',
          stock: 30
        },
        {
          _id: '3',
          name: 'Hybrid Tomato Seeds',
          category: 'Seed',
          price: 150,
          image: 'https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'High-yield hybrid tomato seeds',
          stock: 100
        },
        {
          _id: '4',
          name: 'Garden Sprayer',
          category: 'Tool',
          price: 1200,
          image: 'https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Professional garden sprayer tool',
          stock: 15
        }
      ];
      
      setProducts(dummyProducts);
      
      // Dummy schemes data
      const dummySchemes = [
        {
          _id: '1',
          title: '50% Off on Organic Pesticides',
          description: 'Limited time offer on all organic pesticides',
          validUntil: '2024-12-31',
          image: 'https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          _id: '2',
          title: 'Free Delivery on Orders Above ₹500',
          description: 'Get free home delivery on orders above ₹500',
          validUntil: '2024-12-31',
          image: 'https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
      ];
      
      setSchemes(dummySchemes);
      
      // Dummy weather data
      setWeather({
        temperature: 28,
        condition: 'Sunny',
        humidity: 65,
        rainfall: 0
      });
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
    Alert.alert('Success', `${product.name} added to cart!`);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AgroShop</Text>
        <Text style={styles.headerSubtitle}>Your Agricultural Partner</Text>
      </View>

      {/* Weather Card */}
      {weather && (
        <Card style={styles.weatherCard}>
          <Card.Content>
            <View style={styles.weatherContent}>
              <View>
                <Title style={styles.weatherTitle}>Today's Weather</Title>
                <Text style={styles.weatherTemp}>{weather.temperature}°C</Text>
                <Text style={styles.weatherCondition}>{weather.condition}</Text>
              </View>
              <View style={styles.weatherDetails}>
                <Text>Humidity: {weather.humidity}%</Text>
                <Text>Rainfall: {weather.rainfall}mm</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Schemes Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Schemes & Offers</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {schemes.map(scheme => (
            <Card key={scheme._id} style={styles.schemeCard}>
              <Card.Cover source={{ uri: scheme.image }} style={styles.schemeImage} />
              <Card.Content>
                <Title style={styles.schemeTitle}>{scheme.title}</Title>
                <Paragraph style={styles.schemeDescription}>
                  {scheme.description}
                </Paragraph>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </View>

      {/* Products Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Products</Text>
        
        {/* Search Bar */}
        <Searchbar
          placeholder="Search products..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
          {categories.map(category => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={styles.categoryChip}
            >
              {category}
            </Chip>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <View style={styles.productsGrid}>
          {filteredProducts.map(product => (
            <Card key={product._id} style={styles.productCard}>
              <Card.Cover source={{ uri: product.image }} style={styles.productImage} />
              <Card.Content>
                <Title style={styles.productTitle}>{product.name}</Title>
                <Paragraph style={styles.productDescription}>
                  {product.description}
                </Paragraph>
                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>₹{product.price}</Text>
                  <Text style={styles.productStock}>Stock: {product.stock}</Text>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button
                  mode="contained"
                  onPress={() => handleAddToCart(product)}
                  style={styles.addToCartButton}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
      </View>
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
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  weatherCard: {
    margin: 16,
    backgroundColor: '#E3F2FD',
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherTitle: {
    fontSize: 18,
    color: '#1976D2',
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  weatherCondition: {
    fontSize: 16,
    color: '#1976D2',
  },
  weatherDetails: {
    alignItems: 'flex-end',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  schemeCard: {
    width: 280,
    marginRight: 16,
  },
  schemeImage: {
    height: 120,
  },
  schemeTitle: {
    fontSize: 16,
  },
  schemeDescription: {
    fontSize: 14,
  },
  searchBar: {
    marginBottom: 16,
  },
  categoryFilter: {
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: 16,
  },
  productImage: {
    height: 120,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  productStock: {
    fontSize: 12,
    color: '#666',
  },
  addToCartButton: {
    backgroundColor: '#10B981',
  },
});

export default HomeScreen;