import React from 'react';
import { 
  Leaf, 
  Shield, 
  Zap, 
  Heart, 
  Award, 
  Users,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle
} from 'lucide-react';

const CustomerDashboard: React.FC = () => {
  const benefits = [
    {
      icon: Shield,
      title: 'Crop Protection',
      description: 'Advanced pesticides to protect your crops from harmful insects and diseases',
      color: 'bg-green-500'
    },
    {
      icon: Zap,
      title: 'Fast Acting',
      description: 'Quick results with our scientifically formulated agricultural medicines',
      color: 'bg-blue-500'
    },
    {
      icon: Heart,
      title: 'Safe for Environment',
      description: 'Eco-friendly solutions that protect both crops and the environment',
      color: 'bg-red-500'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Premium quality products tested and approved by agricultural experts',
      color: 'bg-purple-500'
    }
  ];

  const products = [
    {
      name: 'Insecticides',
      description: 'Effective solutions against harmful insects',
      features: ['Broad spectrum control', 'Long-lasting protection', 'Safe application']
    },
    {
      name: 'Fungicides',
      description: 'Protection against fungal diseases',
      features: ['Disease prevention', 'Crop health improvement', 'Yield enhancement']
    },
    {
      name: 'Herbicides',
      description: 'Weed control solutions',
      features: ['Selective weed control', 'Crop safety', 'Easy application']
    },
    {
      name: 'Fertilizers',
      description: 'Nutrient-rich soil enhancers',
      features: ['Soil enrichment', 'Plant growth boost', 'Organic options']
    }
  ];

  const testimonials = [
    {
      name: 'राजेश पाटील',
      location: 'महाराष्ट्र',
      rating: 5,
      comment: 'अग्रो औषधे से मेरी फसल की गुणवत्ता बहुत बेहतर हुई है। बहुत अच्छे परिणाम मिले हैं।'
    },
    {
      name: 'सुनीता शर्मा',
      location: 'पंजाब',
      rating: 5,
      comment: 'किसानों के लिए बहुत उपयोगी उत्पाद हैं। कीटों से पूरी सुरक्षा मिलती है।'
    },
    {
      name: 'अमित कुमार',
      location: 'उत्तर प्रदेश',
      rating: 5,
      comment: 'गुणवत्तापूर्ण दवाइयां और बेहतरीन सेवा। मैं संतुष्ट हूं।'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Agro Aushadhe</h1>
            <h2 className="text-xl mb-4">कृषी औषधे - आपकी फसल का सुरक्षा कवच</h2>
            <p className="text-lg opacity-90">
              Premium agricultural medicines for healthy crops and better yields
            </p>
          </div>
          <div className="hidden md:block">
            <Leaf className="w-24 h-24 opacity-20" />
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Why Choose Our Agricultural Medicines?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className={`${benefit.color} p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{benefit.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Our Product Categories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{product.description}</p>
              <ul className="space-y-2">
                {product.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Guidelines */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            उपयोग की जानकारी (Usage Guidelines)
          </h3>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <p>सुबह या शाम के समय छिड़काव करें जब धूप कम हो</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <p>हवा की दिशा का ध्यान रखें और सुरक्षा उपकरण पहनें</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <p>निर्देशित मात्रा का ही उपयोग करें, अधिक न डालें</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <p>बारिश से पहले छिड़काव न करें</p>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            सुरक्षा सुझाव (Safety Tips)
          </h3>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
              <p>दस्ताने, मास्क और पूरी बाजू के कपड़े पहनें</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
              <p>छिड़काव के बाद हाथ-मुंह अच्छी तरह धोएं</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
              <p>दवाइयों को बच्चों और पशुओं से दूर रखें</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
              <p>खाली बोतलों को सुरक्षित तरीके से नष्ट करें</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Testimonials */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          किसान भाइयों के अनुभव (Customer Reviews)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3 italic">"{testimonial.comment}"</p>
              <div className="flex items-center">
                <Users className="w-4 h-4 text-gray-400 mr-2" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl text-white p-6">
        <h3 className="text-xl font-semibold mb-4 text-center">संपर्क करें (Contact Us)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="flex items-center justify-center">
            <Phone className="w-5 h-5 mr-2" />
            <span>+91-9876543210</span>
          </div>
          <div className="flex items-center justify-center">
            <Mail className="w-5 h-5 mr-2" />
            <span>info@agroaushadhe.com</span>
          </div>
          <div className="flex items-center justify-center">
            <MapPin className="w-5 h-5 mr-2" />
            <span>Agricultural District, India</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;