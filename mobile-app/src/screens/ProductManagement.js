import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl
} from 'react-native';
import { 
  Card, 
  Title, 
  Button, 
  TextInput, 
  Modal, 
  Portal,
  Chip,
  FAB
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('product'); // 'product' or 'scheme'
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Pesticide',
    price: '',
    description: '',
    stock: ''
  });

  const [schemeForm, setSchemeForm] = useState({
    title: '',
    description: '',
    discount: '',
    validUntil: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Simulate API call with dummy data
    const dummyProducts = [
      {
        _id: '1',
        name: 'Organic Pesticide Pro',
        category: 'Pesticide',
        price: 450,
        description: 'Effective organic pesticide for crop protection',
        stock: 50,
        isActive: true
      },
      {
        _id: '2',
        name: 'NPK Fertilizer',
        category: 'Fertilizer',
        price: 320,
        description: 'Balanced NPK fertilizer for healthy plant growth',
        stock: 30,
        isActive: true
      }
    ];

    const dummySchemes = [
      {
        _id: '1',
        title: '50% Off on Organic Pesticides',
        description: 'Limited time offer on all organic pesticides',
        discount: 50,
        validUntil: '2024-12-31',
        isActive: true
      },
      {
        _id: '2',
        title: 'Free Delivery on Orders Above ₹500',
        description: 'Get free home delivery on orders above ₹500',
        discount: 0,
        validUntil: '2024-12-31',
        isActive: true
      }
    ];

    setProducts(dummyProducts);
    setSchemes(dummySchemes);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    
    if (type === 'product') {
      setProductForm(item ? {
        name: item.name,
        category: item.category,
        price: item.price.toString(),
        description: item.description,
        stock: item.stock.toString()
      } : {
        name: '',
        category: 'Pesticide',
        price: '',
        description: '',
        stock: ''
      });
    } else {
      setSchemeForm(item ? {
        title: item.title,
        description: item.description,
        discount: item.discount.toString(),
        validUntil: item.validUntil
      } : {
        title: '',
        description: '',
        discount: '',
        validUntil: ''
      });
    }
    
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingItem(null);
  };

  const saveProduct = () => {
    if (!productForm.name || !productForm.price || !productForm.stock) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newProduct = {
      _id: editingItem ? editingItem._id : Date.now().toString(),
      name: productForm.name,
      category: productForm.category,
      price: parseFloat(productForm.price),
      description: productForm.description,
      stock: parseInt(productForm.stock),
      isActive: true
    };

    if (editingItem) {
      setProducts(products.map(p => p._id === editingItem._id ? newProduct : p));
      Alert.alert('Success', 'Product updated successfully!');
    } else {
      setProducts([...products, newProduct]);
      Alert.alert('Success', 'Product added successfully!');
    }

    closeModal();
  };

  const saveScheme = () => {
    if (!schemeForm.title || !schemeForm.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newScheme = {
      _id: editingItem ? editingItem._id : Date.now().toString(),
      title: schemeForm.title,
      description: schemeForm.description,
      discount: parseFloat(schemeForm.discount) || 0,
      validUntil: schemeForm.validUntil,
      isActive: true
    };

    if (editingItem) {
      setSchemes(schemes.map(s => s._id === editingItem._id ? newScheme : s));
      Alert.alert('Success', 'Scheme updated successfully!');
    } else {
      setSchemes([...schemes, newScheme]);
      Alert.alert('Success', 'Scheme added successfully!');
    }

    // Send notification to all users
    Alert.alert(
      'Notification Sent!',
      'All users have been notified about this scheme via push notification, SMS, and WhatsApp.'
    );

    closeModal();
  };

  const deleteItem = (type, id) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete this ${type}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (type === 'product') {
              setProducts(products.filter(p => p._id !== id));
            } else {
              setSchemes(schemes.filter(s => s._id !== id));
            }
            Alert.alert('Success', `${type} deleted successfully!`);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product Management</Text>
        <Text style={styles.headerSubtitle}>Manage products and schemes</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Products Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Products ({products.length})</Text>
            <Button
              mode="contained"
              onPress={() => openModal('product')}
              style={styles.addButton}
              compact
            >
              Add Product
            </Button>
          </View>

          {products.map(product => (
            <Card key={product._id} style={styles.itemCard}>
              <Card.Content>
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <Title style={styles.itemTitle}>{product.name}</Title>
                    <Text style={styles.itemCategory}>{product.category}</Text>
                  </View>
                  <Chip mode="flat" style={styles.priceChip}>
                    ₹{product.price}
                  </Chip>
                </View>
                
                <Text style={styles.itemDescription}>{product.description}</Text>
                
                <View style={styles.itemFooter}>
                  <Text style={styles.stockText}>Stock: {product.stock}</Text>
                  <View style={styles.itemActions}>
                    <Button
                      mode="outlined"
                      onPress={() => openModal('product', product)}
                      compact
                    >
                      Edit
                    </Button>
                    <Button
                      mode="text"
                      onPress={() => deleteItem('product', product._id)}
                      textColor="#E53E3E"
                      compact
                    >
                      Delete
                    </Button>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Schemes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Schemes ({schemes.length})</Text>
            <Button
              mode="contained"
              onPress={() => openModal('scheme')}
              style={styles.addButton}
              compact
            >
              Add Scheme
            </Button>
          </View>

          {schemes.map(scheme => (
            <Card key={scheme._id} style={styles.itemCard}>
              <Card.Content>
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <Title style={styles.itemTitle}>{scheme.title}</Title>
                    {scheme.discount > 0 && (
                      <Chip mode="flat" style={styles.discountChip}>
                        {scheme.discount}% OFF
                      </Chip>
                    )}
                  </View>
                </View>
                
                <Text style={styles.itemDescription}>{scheme.description}</Text>
                
                <View style={styles.itemFooter}>
                  <Text style={styles.validText}>Valid until: {scheme.validUntil}</Text>
                  <View style={styles.itemActions}>
                    <Button
                      mode="outlined"
                      onPress={() => openModal('scheme', scheme)}
                      compact
                    >
                      Edit
                    </Button>
                    <Button
                      mode="text"
                      onPress={() => deleteItem('scheme', scheme._id)}
                      textColor="#E53E3E"
                      compact
                    >
                      Delete
                    </Button>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Modal for Add/Edit */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={styles.modalContainer}
        >
          <ScrollView>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Edit' : 'Add'} {modalType === 'product' ? 'Product' : 'Scheme'}
            </Text>

            {modalType === 'product' ? (
              <>
                <TextInput
                  label="Product Name *"
                  value={productForm.name}
                  onChangeText={(text) => setProductForm({...productForm, name: text})}
                  style={styles.input}
                  mode="outlined"
                />

                <TextInput
                  label="Category"
                  value={productForm.category}
                  onChangeText={(text) => setProductForm({...productForm, category: text})}
                  style={styles.input}
                  mode="outlined"
                />

                <TextInput
                  label="Price *"
                  value={productForm.price}
                  onChangeText={(text) => setProductForm({...productForm, price: text})}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="numeric"
                />

                <TextInput
                  label="Stock *"
                  value={productForm.stock}
                  onChangeText={(text) => setProductForm({...productForm, stock: text})}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="numeric"
                />

                <TextInput
                  label="Description"
                  value={productForm.description}
                  onChangeText={(text) => setProductForm({...productForm, description: text})}
                  style={styles.input}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                />
              </>
            ) : (
              <>
                <TextInput
                  label="Scheme Title *"
                  value={schemeForm.title}
                  onChangeText={(text) => setSchemeForm({...schemeForm, title: text})}
                  style={styles.input}
                  mode="outlined"
                />

                <TextInput
                  label="Description *"
                  value={schemeForm.description}
                  onChangeText={(text) => setSchemeForm({...schemeForm, description: text})}
                  style={styles.input}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                />

                <TextInput
                  label="Discount (%)"
                  value={schemeForm.discount}
                  onChangeText={(text) => setSchemeForm({...schemeForm, discount: text})}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="numeric"
                />

                <TextInput
                  label="Valid Until (YYYY-MM-DD)"
                  value={schemeForm.validUntil}
                  onChangeText={(text) => setSchemeForm({...schemeForm, validUntil: text})}
                  style={styles.input}
                  mode="outlined"
                />
              </>
            )}

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={closeModal}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={modalType === 'product' ? saveProduct : saveScheme}
                style={styles.modalButton}
              >
                {editingItem ? 'Update' : 'Add'}
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => Alert.alert('Quick Add', 'Choose what to add:', [
          { text: 'Product', onPress: () => openModal('product') },
          { text: 'Scheme', onPress: () => openModal('scheme') },
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#10B981',
  },
  itemCard: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#666',
  },
  priceChip: {
    backgroundColor: '#E6FFFA',
  },
  discountChip: {
    backgroundColor: '#FEF3C7',
    marginTop: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 12,
    color: '#666',
  },
  validText: {
    fontSize: 12,
    color: '#666',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#3B82F6',
  },
});

export default ProductManagement;