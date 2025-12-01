// Chatbot Service for Nexus TechHub
// Mock implementation for demo purposes

export const processMessage = async (message, userId = null) => {
  console.log(`Processing message: "${message}" from user ${userId || 'anonymous'}`);
  
  // Mock responses based on message content
  const lowerMessage = message.toLowerCase();
  
  let response = '';
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    response = 'Hello! Welcome to Nexus TechHub. How can I help you with your phone repair needs today?';
  } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    response = 'Our prices are very competitive! Please check our product pages for specific pricing, or contact us at +971 58 553 1029 for a quote.';
  } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
    response = 'We offer fast shipping across the UAE! Orders are typically delivered within 1-2 business days in Ras Al Khaimah and surrounding areas.';
  } else if (lowerMessage.includes('warranty')) {
    response = 'All our parts come with manufacturer warranty. Contact us for specific warranty terms for your product.';
  } else if (lowerMessage.includes('iphone')) {
    response = 'We have a wide selection of iPhone parts including screens, batteries, cameras, and more. What specific iPhone model are you looking for?';
  } else if (lowerMessage.includes('samsung')) {
    response = 'We stock Samsung Galaxy parts for most popular models. What Samsung device do you need parts for?';
  } else if (lowerMessage.includes('repair')) {
    response = 'We offer professional repair services at our Ras Al Khaimah location. You can also purchase parts for DIY repairs with our detailed guides.';
  } else if (lowerMessage.includes('location') || lowerMessage.includes('address')) {
    response = 'We are located at Compass Building, Al Shohada Road, AL Hamra Industrial Zone-FZ, Ras Al Khaimah, United Arab Emirates.';
  } else if (lowerMessage.includes('contact') || lowerMessage.includes('phone')) {
    response = 'You can reach us at +971 58 553 1029 or email support@nexustechhub.ae. Our hours are Sunday-Thursday 9AM-6PM GST.';
  } else {
    response = 'Thank you for your message! For specific inquiries, please contact us at +971 58 553 1029 or visit our store in Ras Al Khaimah. How else can I help you?';
  }
  
  return {
    response,
    confidence: 0.95,
    intent: 'general_inquiry',
    timestamp: new Date().toISOString(),
    userId
  };
};

export const getChatHistory = async (userId, limit = 50) => {
  console.log(`Getting chat history for user ${userId} (limit: ${limit})`);
  
  return {
    messages: [
      {
        id: 1,
        message: 'Hello, I need help with iPhone parts',
        response: 'Hello! I can help you with iPhone parts. What specific model are you looking for?',
        timestamp: '2024-01-15T10:30:00Z',
        userId
      }
    ],
    total: 1,
    userId
  };
};

export default {
  processMessage,
  getChatHistory
};
