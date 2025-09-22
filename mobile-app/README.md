# AgroShop Mobile App

A React Native mobile application for agricultural products and services, featuring AI-powered plant disease detection, product browsing, and order management.

## Features

### Customer Features
- **Home Screen**: Browse products, schemes, and weather updates
- **Disease Detection**: AI-powered plant disease identification with treatment recommendations
- **Shopping Cart**: Add products and place orders
- **Order History**: Track past orders and reorder items
- **Profile Management**: Account settings and preferences

### Admin Features
- **Admin Dashboard**: Overview of products, schemes, users, and orders
- **Product Management**: Add, edit, and delete products
- **Scheme Management**: Create and manage promotional schemes
- **Push Notifications**: Send updates to all users via multiple channels

## Tech Stack

- **React Native** with Expo
- **React Navigation** for navigation
- **React Native Paper** for UI components
- **Expo Camera** for image capture
- **Expo Image Picker** for gallery selection
- **Context API** for state management
- **AsyncStorage** for local data persistence

## Installation

1. **Install dependencies**
   ```bash
   cd mobile-app
   npm install
   ```

2. **Install Expo CLI** (if not already installed)
   ```bash
   npm install -g @expo/cli
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - For Android: `npm run android`
   - For iOS: `npm run ios`
   - For web: `npm run web`

## Building for Production

### Android APK/AAB
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build for Android
eas build --platform android
```

### iOS App Store
```bash
# Build for iOS
eas build --platform ios
```

## Project Structure

```
mobile-app/
├── src/
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── CartContext.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── DiseaseDetection.js
│   │   ├── CartScreen.js
│   │   ├── OrderHistory.js
│   │   ├── ProfileScreen.js
│   │   ├── AdminDashboard.js
│   │   └── ProductManagement.js
│   └── components/
├── assets/
├── App.js
├── app.json
└── package.json
```

## Key Features Explained

### Disease Detection
- Uses device camera or gallery to capture plant images
- Simulates AI analysis with mock disease identification
- Provides organic and chemical treatment recommendations
- Suggests related products for purchase

### Admin Panel
- Manage products and promotional schemes
- Send push notifications to all users
- View dashboard statistics
- Real-time updates across all user devices

### Shopping Experience
- Browse products by category
- Add items to cart with quantity management
- Place orders with dummy payment integration
- Track order history and status

### Notifications
- Push notifications for new schemes and updates
- SMS and WhatsApp integration (placeholder)
- Weather alerts for farmers
- Order status updates

## Configuration

### API Integration
Update the API base URL in `src/context/AuthContext.js`:
```javascript
const API_BASE_URL = 'your-backend-url/api';
```

### Push Notifications
Configure push notifications in `app.json` and implement the service in your backend.

## Demo Accounts

- **Customer**: customer@demo.com / password123
- **Admin**: admin@demo.com / password123

## Deployment

### Google Play Store
1. Build AAB file: `eas build --platform android`
2. Upload to Google Play Console
3. Complete store listing and publish

### Apple App Store
1. Build IPA file: `eas build --platform ios`
2. Upload to App Store Connect
3. Complete app review process

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.