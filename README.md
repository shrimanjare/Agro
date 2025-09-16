# Agro Billing System

A comprehensive MERN stack billing and inventory management system designed specifically for agriculture pesticide shops. This GST-compliant system provides modern features for managing products, customers, invoices, and generating detailed reports.

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
│   │   └── pdfGenerator.js
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
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agro_billing
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:5173`

### Individual Commands

- **Backend only**: `npm run backend:dev`
- **Frontend only**: `npm run frontend:dev`
- **Production backend**: `npm run backend:start`
- **Build frontend**: `npm run frontend:build`

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
- Features planned for future releases:
  - WhatsApp invoice sharing
  - Barcode scanning
  - Multi-location support
  - Advanced analytics

---

Built with ❤️ for the agriculture community