// Recommendation Engine for Nexus TechHub
// Mock implementation for demo purposes

export const trackProductView = async (productId, userId = null) => {
  console.log(`Tracking product view: ${productId} by user ${userId || 'anonymous'}`);

  return {
    success: true,
    tracked: true,
    product_id: productId,
    user_id: userId,
    timestamp: new Date().toISOString()
  };
};

export const trackProductClick = async (productId, userId = null, context = 'search') => {
  console.log(`Tracking product click: ${productId} by user ${userId || 'anonymous'} in ${context}`);

  return {
    success: true,
    tracked: true,
    product_id: productId,
    user_id: userId,
    context,
    timestamp: new Date().toISOString()
  };
};

export const getPersonalizedRecommendations = async (userId, limit = 10) => {
  try {
    console.log(`Getting personalized recommendations for user ${userId} (limit: ${limit})`);

    // Validate input parameters
    const validLimit = Math.max(1, Math.min(limit || 10, 50)); // Ensure limit is between 1 and 50

    // Mock recommendations for Nexus TechHub
    const mockRecommendations = [
      {
        id: 1,
        name: 'iPhone 15 Pro Screen Assembly',
        price: 299.99,
        image: '/images/products/iphone-15-pro-screen.jpg',
        category: 'iPhone Parts',
        rating: 4.8,
        reason: 'Based on your recent views'
      },
      {
        id: 2,
        name: 'Samsung Galaxy S24 Battery',
        price: 89.99,
        image: '/images/products/samsung-s24-battery.jpg',
        category: 'Samsung Parts',
        rating: 4.7,
        reason: 'Popular in your area'
      },
      {
        id: 3,
        name: 'Professional Repair Tool Kit',
        price: 149.99,
        image: '/images/products/repair-tools.jpg',
        category: 'Tools',
        rating: 4.9,
        reason: 'Frequently bought together'
      }
    ];

    return {
      recommendations: mockRecommendations.slice(0, validLimit),
      user_id: userId,
      generated_at: new Date().toISOString(),
      success: true
    };
  } catch (error) {
    console.error('Error in getPersonalizedRecommendations:', error);
    return {
      recommendations: [],
      user_id: userId,
      generated_at: new Date().toISOString(),
      success: false,
      error: error.message
    };
  }
};

export const getSimilarProducts = async (productId, limit = 6) => {
  console.log(`Getting similar products for ${productId} (limit: ${limit})`);

  return {
    similar_products: [
      {
        id: 4,
        name: 'iPhone 14 Pro Screen Assembly',
        price: 249.99,
        image: '/images/products/iphone-14-pro-screen.jpg',
        category: 'iPhone Parts',
        rating: 4.7
      },
      {
        id: 5,
        name: 'iPhone 15 Screen Assembly',
        price: 279.99,
        image: '/images/products/iphone-15-screen.jpg',
        category: 'iPhone Parts',
        rating: 4.6
      }
    ].slice(0, limit),
    base_product_id: productId,
    generated_at: new Date().toISOString()
  };
};

export const getFrequentlyBoughtTogether = async (productId, limit = 3) => {
  console.log(`Getting frequently bought together products for ${productId} (limit: ${limit})`);

  // Mock data for frequently bought together products
  const mockRecommendations = [
    {
      id: 102,
      name: 'iPhone Screen Protector',
      price: 19.99,
      image_url: '/images/products/screen-protector.jpg',
      slug: 'iphone-screen-protector'
    },
    {
      id: 103,
      name: 'iPhone Repair Tool Kit',
      price: 29.99,
      image_url: '/images/products/repair-tools.jpg',
      slug: 'iphone-repair-tool-kit'
    },
    {
      id: 104,
      name: 'iPhone Cleaning Kit',
      price: 14.99,
      image_url: '/images/products/cleaning-kit.jpg',
      slug: 'iphone-cleaning-kit'
    }
  ];

  return mockRecommendations.slice(0, limit);
};

export const getPopularProducts = async (category = null, limit = 10) => {
  console.log(`Getting popular products for category ${category || 'all'} (limit: ${limit})`);

  return {
    popular_products: [
      {
        id: 1,
        name: 'iPhone 15 Pro Screen Assembly',
        price: 299.99,
        image: '/images/products/iphone-15-pro-screen.jpg',
        category: 'iPhone Parts',
        rating: 4.8,
        sales_count: 156
      },
      {
        id: 2,
        name: 'Samsung Galaxy S24 Battery',
        price: 89.99,
        image: '/images/products/samsung-s24-battery.jpg',
        category: 'Samsung Parts',
        rating: 4.7,
        sales_count: 134
      }
    ].slice(0, limit),
    category,
    generated_at: new Date().toISOString()
  };
};

export default {
  trackProductView,
  trackProductClick,
  getPersonalizedRecommendations,
  getSimilarProducts,
  getFrequentlyBoughtTogether,
  getPopularProducts
};
