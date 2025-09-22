import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCart } from '../context/CartContext';

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const { addToCart } = useCart();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to use this feature.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to use this feature.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('No image selected', 'Please select an image first.');
      return;
    }

    setAnalyzing(true);
    
    // Simulate AI analysis (replace with actual API call)
    setTimeout(() => {
      const mockResults = [
        {
          disease: 'Tomato Leaf Blight',
          confidence: 92,
          cause: 'Fungal infection caused by Alternaria solani',
          symptoms: 'Dark spots on leaves, yellowing, and wilting',
          organicSolutions: [
            'Remove affected leaves immediately',
            'Apply neem oil spray',
            'Improve air circulation',
            'Use copper-based fungicide'
          ],
          chemicalSolutions: [
            'Apply Mancozeb fungicide',
            'Use Chlorothalonil spray',
            'Apply Propiconazole'
          ],
          recommendedProducts: [
            {
              _id: '1',
              name: 'Neem Oil Organic Spray',
              price: 280,
              type: 'organic',
              image: 'https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg?auto=compress&cs=tinysrgb&w=400'
            },
            {
              _id: '2',
              name: 'Mancozeb Fungicide',
              price: 450,
              type: 'chemical',
              image: 'https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg?auto=compress&cs=tinysrgb&w=400'
            }
          ]
        },
        {
          disease: 'Bacterial Wilt',
          confidence: 78,
          cause: 'Bacterial infection in soil',
          symptoms: 'Sudden wilting, yellowing leaves',
          organicSolutions: [
            'Remove infected plants',
            'Improve soil drainage',
            'Use beneficial bacteria'
          ],
          chemicalSolutions: [
            'Apply copper sulfate',
            'Use streptomycin spray'
          ],
          recommendedProducts: [
            {
              _id: '3',
              name: 'Copper Sulfate Solution',
              price: 320,
              type: 'chemical',
              image: 'https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg?auto=compress&cs=tinysrgb&w=400'
            }
          ]
        }
      ];
      
      setResult(mockResults);
      setAnalyzing(false);
    }, 3000);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    Alert.alert('Success', `${product.name} added to cart!`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Plant Disease Detection</Text>
        <Text style={styles.headerSubtitle}>AI-powered crop health analysis</Text>
      </View>

      {/* Image Selection */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Upload Plant Image</Title>
          <Paragraph>Take a photo or select from gallery to detect plant diseases</Paragraph>
          
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={takePhoto}
              style={[styles.button, { backgroundColor: '#10B981' }]}
              icon="camera"
            >
              Take Photo
            </Button>
            <Button
              mode="outlined"
              onPress={pickImage}
              style={styles.button}
              icon="image"
            >
              From Gallery
            </Button>
          </View>

          {selectedImage && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <Button
                mode="contained"
                onPress={analyzeImage}
                style={[styles.analyzeButton, { backgroundColor: '#3B82F6' }]}
                disabled={analyzing}
                icon="magnify"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Image'}
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Loading */}
      {analyzing && (
        <Card style={styles.card}>
          <Card.Content style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.loadingText}>Analyzing image with AI...</Text>
            <Text style={styles.loadingSubtext}>This may take a few seconds</Text>
          </Card.Content>
        </Card>
      )}

      {/* Results */}
      {result && result.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Detection Results</Text>
          
          {result.map((detection, index) => (
            <Card key={index} style={styles.resultCard}>
              <Card.Content>
                <View style={styles.resultHeader}>
                  <Title style={styles.diseaseName}>{detection.disease}</Title>
                  <View style={styles.confidenceContainer}>
                    <Text style={styles.confidenceText}>{detection.confidence}%</Text>
                    <Text style={styles.confidenceLabel}>Confidence</Text>
                  </View>
                </View>

                <Paragraph style={styles.cause}>
                  <Text style={styles.boldText}>Cause: </Text>
                  {detection.cause}
                </Paragraph>

                <Paragraph style={styles.symptoms}>
                  <Text style={styles.boldText}>Symptoms: </Text>
                  {detection.symptoms}
                </Paragraph>

                {/* Organic Solutions */}
                <View style={styles.solutionSection}>
                  <Text style={styles.solutionTitle}>🌿 Organic Solutions:</Text>
                  {detection.organicSolutions.map((solution, idx) => (
                    <Text key={idx} style={styles.solutionItem}>• {solution}</Text>
                  ))}
                </View>

                {/* Chemical Solutions */}
                <View style={styles.solutionSection}>
                  <Text style={styles.solutionTitle}>🧪 Chemical Solutions:</Text>
                  {detection.chemicalSolutions.map((solution, idx) => (
                    <Text key={idx} style={styles.solutionItem}>• {solution}</Text>
                  ))}
                </View>

                {/* Recommended Products */}
                <View style={styles.productsSection}>
                  <Text style={styles.productsTitle}>Recommended Products:</Text>
                  {detection.recommendedProducts.map((product, idx) => (
                    <View key={idx} style={styles.productItem}>
                      <Image source={{ uri: product.image }} style={styles.productImage} />
                      <View style={styles.productInfo}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.productPrice}>₹{product.price}</Text>
                        <Text style={styles.productType}>
                          {product.type === 'organic' ? '🌿 Organic' : '🧪 Chemical'}
                        </Text>
                      </View>
                      <Button
                        mode="contained"
                        onPress={() => handleAddToCart(product)}
                        style={styles.buyButton}
                        compact
                      >
                        Buy Now
                      </Button>
                    </View>
                  ))}
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}

      {/* Instructions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Tips for Better Results</Title>
          <View style={styles.tipsList}>
            <Text style={styles.tip}>📸 Take clear, well-lit photos</Text>
            <Text style={styles.tip}>🍃 Focus on affected leaves or parts</Text>
            <Text style={styles.tip}>📏 Keep the camera 6-12 inches away</Text>
            <Text style={styles.tip}>🌞 Use natural lighting when possible</Text>
          </View>
        </Card.Content>
      </Card>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  card: {
    margin: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  analyzeButton: {
    width: '100%',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  resultsContainer: {
    margin: 16,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  resultCard: {
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  diseaseName: {
    fontSize: 20,
    color: '#E53E3E',
    flex: 1,
  },
  confidenceContainer: {
    alignItems: 'center',
    backgroundColor: '#10B981',
    padding: 8,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  confidenceLabel: {
    fontSize: 12,
    color: 'white',
  },
  cause: {
    marginBottom: 8,
  },
  symptoms: {
    marginBottom: 16,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  solutionSection: {
    marginBottom: 16,
  },
  solutionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  solutionItem: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
    paddingLeft: 8,
  },
  productsSection: {
    marginTop: 16,
  },
  productsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  productType: {
    fontSize: 12,
    color: '#666',
  },
  buyButton: {
    backgroundColor: '#10B981',
  },
  tipsList: {
    marginTop: 8,
  },
  tip: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
});

export default DiseaseDetection;