// Chatbot Test Cases for Nexus TechHub
// Test scenarios for chatbot functionality

export const testCases = [
  {
    id: 'test_1',
    name: 'Greeting Test',
    input: 'Hello',
    expectedKeywords: ['hello', 'help', 'nexus', 'techhub'],
    category: 'greeting'
  },
  {
    id: 'test_2',
    name: 'Price Inquiry',
    input: 'How much does an iPhone 15 screen cost?',
    expectedKeywords: ['price', 'competitive', 'product page'],
    category: 'pricing'
  },
  {
    id: 'test_3',
    name: 'Shipping Question',
    input: 'How long does delivery take?',
    expectedKeywords: ['shipping', 'delivery', '1-2 business days', 'UAE'],
    category: 'shipping'
  },
  {
    id: 'test_4',
    name: 'Warranty Inquiry',
    input: 'What warranty do you offer?',
    expectedKeywords: ['warranty', 'manufacturer', 'months'],
    category: 'warranty'
  },
  {
    id: 'test_5',
    name: 'iPhone Parts',
    input: 'Do you have iPhone parts?',
    expectedKeywords: ['iphone', 'parts', 'screens', 'batteries'],
    category: 'products'
  },
  {
    id: 'test_6',
    name: 'Samsung Parts',
    input: 'Samsung Galaxy S24 battery',
    expectedKeywords: ['samsung', 'galaxy', 'parts'],
    category: 'products'
  },
  {
    id: 'test_7',
    name: 'Repair Services',
    input: 'Do you repair phones?',
    expectedKeywords: ['repair', 'services', 'ras al khaimah'],
    category: 'services'
  },
  {
    id: 'test_8',
    name: 'Location Query',
    input: 'Where are you located?',
    expectedKeywords: ['compass building', 'ras al khaimah', 'address'],
    category: 'location'
  },
  {
    id: 'test_9',
    name: 'Contact Information',
    input: 'How can I contact you?',
    expectedKeywords: ['phone', '+971 58 553 1029', 'email', 'support@nexustechhub.ae'],
    category: 'contact'
  },
  {
    id: 'test_10',
    name: 'Complex Query',
    input: 'I need to replace my iPhone 14 Pro screen and want to know about warranty and shipping',
    expectedKeywords: ['iphone', 'screen', 'warranty', 'shipping'],
    category: 'complex'
  }
];

export const runTestCase = async (testCase, chatbotService) => {
  try {
    const result = await chatbotService.processMessage(testCase.input);

    const response = result.response.toLowerCase();
    const matchedKeywords = testCase.expectedKeywords.filter(keyword =>
      response.includes(keyword.toLowerCase())
    );

    const score = matchedKeywords.length / testCase.expectedKeywords.length;

    return {
      testId: testCase.id,
      name: testCase.name,
      input: testCase.input,
      response: result.response,
      expectedKeywords: testCase.expectedKeywords,
      matchedKeywords,
      score,
      passed: score >= 0.5, // Pass if at least 50% of keywords match
      category: testCase.category
    };
  } catch (error) {
    return {
      testId: testCase.id,
      name: testCase.name,
      input: testCase.input,
      error: error.message,
      score: 0,
      passed: false,
      category: testCase.category
    };
  }
};

export const runAllTests = async (chatbotService) => {
  const results = [];

  for (const testCase of testCases) {
    const result = await runTestCase(testCase, chatbotService);
    results.push(result);
  }

  const summary = {
    total: results.length,
    passed: results.filter(r => r.passed).length,
    failed: results.filter(r => !r.passed).length,
    averageScore: results.reduce((sum, r) => sum + r.score, 0) / results.length,
    categoryBreakdown: {}
  };

  // Calculate category breakdown
  testCases.forEach(test => {
    if (!summary.categoryBreakdown[test.category]) {
      summary.categoryBreakdown[test.category] = { total: 0, passed: 0 };
    }
    summary.categoryBreakdown[test.category].total++;
  });

  results.forEach(result => {
    if (result.passed) {
      summary.categoryBreakdown[result.category].passed++;
    }
  });

  return {
    summary,
    results
  };
};

export const runChatbotTests = async (chatbotService) => {
  console.log('Running comprehensive chatbot tests...');

  const results = await runAllTests(chatbotService);

  return {
    ...results,
    test_run_id: `test_${Date.now()}`,
    completed_at: new Date().toISOString(),
    environment: 'development'
  };
};

export default {
  testCases,
  runTestCase,
  runAllTests,
  runChatbotTests
};
