import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';

const GundamCollection = () => {
  const featuredItems = [
    {
      id: 1,
      name: 'RX-78-2 Model Kit',
      price: '$89.00',
      category: 'Model Kits',
      image: 'https://example.com/rx78-2.jpg' // Replace with actual image URL
    },
    {
      id: 2,
      name: 'Zeon Mobile Suit Jacket',
      price: '$129.00',
      category: 'Apparel',
      image: 'https://example.com/zeon-jacket.jpg'
    },
    {
      id: 3,
      name: 'Gundam Wing Sneakers',
      price: '$150.00',
      category: 'Footwear',
      image: 'https://example.com/gundam-sneakers.jpg'
    },
    {
      id: 4,
      name: 'Char\'s Zaku Helmet',
      price: '$199.00',
      category: 'Collectibles',
      image: 'https://example.com/zaku-helmet.jpg'
    }
  ];

  const categories = [
    'Model Kits',
    'Apparel',
    'Bottoms',
    'Footwear',
    'Accessories',
    'Collectibles'
  ];

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">GUNDAM COLLECTION</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our latest Gundam merchandise drop this week! Premium quality items for fans and collectors, 
          designed to showcase your love for the Universal Century.
        </p>
        <div className="mt-6">
          <span className="text-sm font-medium text-gray-500">{featuredItems.length * 32} Products Available</span>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">SHOP BY CATEGORY</h2>
        <div className="flex flex-wrap gap-4">
          {categories.map((category, index) => (
            <Button 
              key={index} 
              type={index === 0 ? 'primary' : 'default'} 
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">FEATURED ITEMS</h2>
        <Row gutter={[24, 24]}>
          {featuredItems.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card
                hoverable
                cover={
                  <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img 
                      alt={item.name} 
                      src={item.image} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                }
                actions={[
                  <HeartOutlined key="wishlist" className="text-red-500" />,
                  <ShoppingCartOutlined key="cart" />,
                ]}
              >
                <Card.Meta
                  title={<span className="font-bold">{item.name}</span>}
                  description={
                    <>
                      <span className="text-gray-600">{item.category}</span>
                      <div className="mt-2 text-lg font-semibold text-blue-600">{item.price}</div>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* New Arrivals Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">NEW ARRIVALS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <div key={`new-${item.id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.category}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-600">{item.price}</span>
                  <Button type="primary" size="small">Add to Cart</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 bg-blue-800 text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">JOIN THE GUNDAM FAN CLUB</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Get exclusive access to limited edition items, early product releases, and special discounts.
        </p>
        <Button type="primary" size="large" className="bg-white text-blue-800 hover:bg-gray-100">
          Sign Up Now
        </Button>
      </div>
    </div>
  );
};

export default GundamCollection;