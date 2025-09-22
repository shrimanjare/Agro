# Agro Billing System

A comprehensive MERN stack billing and inventory management system designed specifically for agriculture pesticide shops, with a connected mobile app called "AgroShop". This GST-compliant system provides modern features for managing products, customers, invoices, generating detailed reports, and includes WhatsApp/Email invoice sharing.

## 🚀 Features

### Core Features
- **Authentication & Authorization**: JWT-based login with role-based access (Admin/Staff)
- **Product Management**: Complete CRUD operations with stock tracking, batch management, and low stock alerts
- **Customer Management**: Comprehensive customer database with GST information
- **Invoice Management**: Professional GST-compliant invoice generation with automatic tax calculations
- **Inventory Tracking**: Real-time stock management with automatic deduction on sales
- **Reports & Analytics**: Sales reports, GST summaries, and stock reports with export functionality

### Advanced Features
- **PDF Invoice Generation**: Professional tax invoices using Puppeteer
- **Export Functionality**: Export invoices and reports as PDF, Excel, or CSV
- **Dark/Light Mode**: Modern UI with theme switching
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Real-time Dashboard**: Analytics with charts showing sales trends and top products
- **Multi-format Support**: Amount in words, round-off calculations, and GST breakdowns
- **WhatsApp & Email Integration**: Automatic invoice sharing via WhatsApp and Email
- **Quick Billing**: Fast POS-style billing for walk-in customers
- **Shop Settings**: Configurable shop details, invoice settings, and notifications

## 📱 AgroShop Mobile App

A React Native mobile application that complements the web system:

### Customer Features
- **Product Browsing**: Browse agricultural products with search and filters
- **AI Disease Detection**: Upload plant photos for AI-powered disease identification
- **Treatment Recommendations**: Get organic and chemical treatment suggestions
- **Shopping Cart**: Add products to cart and place orders
- **Order History**: Track past orders and reorder items
- **Weather Updates**: Real-time weather information for farmers
- **Schemes & Offers**: View latest promotional offers

### Admin Features
- **Product Management**: Add, edit, and delete products from mobile
- **Scheme Management**: Create and manage promotional schemes
- **Push Notifications**: Send updates to all users via push, SMS, and WhatsApp
- **Dashboard**: View key metrics and recent activity
- **Real-time Updates**: Changes sync across web and mobile platforms
## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Puppeteer** for PDF generation
- **Bcrypt** for password hashing
- **Helmet** & **CORS** for security

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form management
- **Recharts** for data visualization
- **Axios** for API communication

### Mobile App
- **React Native** with Expo
- **React Navigation** for navigation
- **React Native Paper** for UI components
- **Expo Camera** for image capture
- **Context API** for state management

### Communication Services
- **Twilio** for WhatsApp messaging
- **Nodemailer** for email services
- **Push Notifications** for mobile alerts

## 📁 Project Structure

```
agro-billing-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Customer.js
│   │   └── Invoice.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── customers.js
│   │   ├── invoices.js
│   │   ├── reports.js
│   │   └── dashboard.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── pdfGenerator.js
│   │   ├── whatsappService.js
│   │   └── emailService.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.tsx
│   └── package.json
├── mobile-app/
│   ├── src/
│   │   ├── context/
│   │   ├── screens/
│   │   └── components/
│   ├── App.js
│   ├── app.json
│   └── package.json
└── package.json
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agro-billing-system
   ```

2. **Install dependencies for all packages**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Copy the example environment file and update with your values:
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://agrouser:agropass123@cluster0.mongodb.net/agro_billing
   JWT_SECRET=agro_billing_super_secret_jwt_key_2024_production_ready
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:5173`

5. **Start the mobile app** (optional)
   ```bash
   cd mobile-app
   npm install
   npm start
   ```
### Individual Commands

- **Backend only**: `npm run backend:dev`
- **Frontend only**: `npm run frontend:dev`
- **Production backend**: `npm run backend:start`
- **Build frontend**: `npm run frontend:build`
- **Mobile app**: `cd mobile-app && npm start`

## 📱 Mobile App Setup

### Prerequisites
- Node.js and npm
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your mobile device (for testing)

### Running the Mobile App
1. Navigate to mobile app directory: `cd mobile-app`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Scan QR code with Expo Go app or run on simulator

### Building for Production
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['admin', 'staff'],
  isActive: Boolean,
  lastLogin: Date
}
```

### Product Model
```javascript
{
  name: String,
  category: ['Pesticide', 'Fertilizer', 'Seed', 'Tool', 'Other'],
  price: Number,
  stock: Number,
  lowStockThreshold: Number,
  hsn: String,
  batch: String,
  expiryDate: Date,
  gstRate: [0, 5, 12, 18, 28],
  unit: String,
  isActive: Boolean
}
```

### Invoice Model
```javascript
{
  invoiceNumber: String (auto-generated),
  customer: ObjectId (Customer),
  items: [{
    product: ObjectId (Product),
    quantity: Number,
    price: Number,
    gstRate: Number,
    taxAmount: Number,
    totalAmount: Number
  }],
  subtotal: Number,
  totalTax: Number,
  cgst: Number,
  sgst: Number,
  igst: Number,
  discount: Number,
  roundOff: Number,
  grandTotal: Number,
  paymentStatus: ['paid', 'partial', 'unpaid'],
  createdBy: ObjectId (User)
}
```

## 🔐 Authentication & Authorization

The system implements JWT-based authentication with role-based access control:

- **Admin Users**: Full system access including user management
- **Staff Users**: Limited access - cannot manage users or access sensitive reports

Protected routes automatically redirect unauthenticated users to the login page.

## 📄 Invoice Features

### GST Compliance
- Automatic CGST/SGST calculation for intra-state transactions
- IGST calculation for inter-state transactions
- HSN code tracking for all products
- Professional tax invoice format

### PDF Generation
- Clean, professional invoice layout
- Company branding and details
- Itemized billing with tax breakdowns
- Amount in words conversion
- Terms and conditions

### Export Options
- PDF download for archival
- Excel export for accounting
- Print-ready format

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Collapsible sidebar navigation
- Touch-friendly interface elements
- Optimized layouts for all screen sizes

## 🎨 UI/UX Features

- **Dark/Light Mode**: System-wide theme switching
- **Toast Notifications**: User-friendly feedback messages
- **Loading States**: Smooth loading indicators
- **Modern Components**: Clean, professional interface
- **Accessibility**: WCAG compliant design elements
- **Quick Billing**: POS-style interface for fast transactions
- **Settings Management**: Configurable shop settings and preferences

## 📧 Communication Features

### WhatsApp Integration
- Automatic invoice sharing via Twilio WhatsApp API
- Customizable message templates
- Support for media attachments (PDF invoices)

### Email Integration
- Professional email templates
- Automatic invoice delivery
- SMTP configuration support
- HTML formatted emails with company branding

### Mobile Notifications
- Push notifications for scheme updates
- SMS integration for order updates
- Real-time sync between web and mobile

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing protection
- **Rate Limiting**: API request throttling
- **Input Validation**: Server-side validation for all inputs
- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure session management

## 📈 Analytics & Reports

### Dashboard Analytics
- Today's sales summary
- Monthly sales trends
- Top-selling products
- Low stock alerts
- Recent transaction history

### Report Generation
- **Sales Reports**: Filtered by date, customer, product
- **GST Summary**: Tax collection summaries
- **Stock Reports**: Inventory status and valuations
- **Export Options**: PDF, Excel, CSV formats

### Mobile App Analytics
- **Disease Detection**: AI-powered plant health analysis
- **Product Recommendations**: Based on detected diseases
- **User Engagement**: Track app usage and feature adoption
- **Order Analytics**: Mobile vs web order patterns

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Update MongoDB URI to production database
3. Configure proper CORS origins
4. Set up process manager (PM2 recommended)

### Frontend Deployment
1. Build the application: `npm run frontend:build`
2. Deploy the `dist` folder to your web server
3. Configure environment variables for production API URL

### Mobile App Deployment
1. **Google Play Store**:
   - Build AAB: `eas build --platform android`
   - Upload to Google Play Console
   - Complete store listing

2. **Apple App Store**:
   - Build IPA: `eas build --platform ios`
   - Upload to App Store Connect
   - Submit for review

## 🧪 Demo Data

The system includes comprehensive dummy data for testing:

### Web System
- **Products**: 25+ sample agricultural products
- **Customers**: 50+ dummy customer records
- **Invoices**: 100+ sample invoices with various statuses
- **Users**: Admin and staff demo accounts

### Mobile App
- **Disease Detection**: Mock AI responses with treatment recommendations
- **Products**: Synchronized with web system
- **Orders**: Sample order history
- **Schemes**: Promotional offers and discounts

### Demo Accounts
- **Admin**: admin@demo.com / password123
- **Staff**: staff@demo.com / password123
- **Customer**: customer@demo.com / password123

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Review the error logs for debugging information

## 🔄 Version History

- **v1.0.0**: Initial release with core billing features
- **v1.1.0**: Added mobile app and communication features
- Features planned for future releases:
  - Barcode scanning
  - Multi-location support
  - Advanced analytics
  - Offline mode for mobile app
  - Voice commands
  - Multi-language support

---

Built with ❤️ for the agriculture community 🌱

## 📞 Support

- **Email**: support@agrobilling.com
- **Phone**: +91-9876543210
- **Website**: www.agrobilling.com
- **Documentation**: Available in the `/docs` folder