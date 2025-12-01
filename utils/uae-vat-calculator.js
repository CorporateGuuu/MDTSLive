// UAE VAT Calculator - Manual Implementation for Immediate Use
// Nexus TechHub - Production Ready

// UAE VAT Configuration
export const UAE_VAT_CONFIG = {
  country: 'AE',
  vatRate: 0.05, // 5% VAT
  currency: 'AED',
  defaultTaxCode: 'txcd_99999999', // Mobile repair parts
  serviceTaxCode: 'txcd_20030000', // Repair services
  shippingTaxCode: 'txcd_92010001', // Shipping
  business: {
    name: 'Nexus TechHub',
    location: 'Ras Al Khaimah, UAE',
    phone: '+971585531029',
    vatRegistered: true
  }
};

/**
 * Calculate UAE VAT for cart items
 * @param {Array} items - Array of cart items with price and quantity
 * @param {number} shippingCost - Shipping cost in AED
 * @param {Object} customerLocation - Customer location details
 * @returns {Object} VAT calculation breakdown
 */
export function calculateUAEVAT(items = [], shippingCost = 0, customerLocation = {}) {
  try {
    // Validate inputs
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Items array is required');
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return sum + (price * quantity);
    }, 0);

    // Add shipping to taxable amount
    const taxableAmount = subtotal + (parseFloat(shippingCost) || 0);

    // Calculate 5% UAE VAT
    const vatAmount = Math.round((taxableAmount * UAE_VAT_CONFIG.vatRate) * 100) / 100;

    // Calculate total
    const total = taxableAmount + vatAmount;

    // Create detailed breakdown
    const breakdown = {
      subtotal: Math.round(subtotal * 100) / 100,
      shippingCost: Math.round((parseFloat(shippingCost) || 0) * 100) / 100,
      taxableAmount: Math.round(taxableAmount * 100) / 100,
      vatRate: UAE_VAT_CONFIG.vatRate,
      vatAmount: vatAmount,
      total: Math.round(total * 100) / 100,
      currency: UAE_VAT_CONFIG.currency,
      calculationMethod: 'manual',
      timestamp: new Date().toISOString(),
      
      // Item breakdown
      itemBreakdown: items.map(item => {
        const itemPrice = parseFloat(item.price) || 0;
        const itemQuantity = parseInt(item.quantity) || 1;
        const itemTotal = itemPrice * itemQuantity;
        const itemVAT = Math.round((itemTotal * UAE_VAT_CONFIG.vatRate) * 100) / 100;
        
        return {
          id: item.id || item.sku,
          name: item.name,
          price: itemPrice,
          quantity: itemQuantity,
          subtotal: Math.round(itemTotal * 100) / 100,
          vatAmount: itemVAT,
          total: Math.round((itemTotal + itemVAT) * 100) / 100,
          taxCode: getTaxCodeForProduct(item.category, item.name)
        };
      }),

      // Compliance information
      compliance: {
        country: UAE_VAT_CONFIG.country,
        jurisdiction: 'United Arab Emirates',
        taxAuthority: 'Federal Tax Authority (FTA)',
        vatRegistration: UAE_VAT_CONFIG.business.vatRegistered,
        businessName: UAE_VAT_CONFIG.business.name,
        businessLocation: UAE_VAT_CONFIG.business.location,
        businessPhone: UAE_VAT_CONFIG.business.phone
      },

      // Customer location (for compliance)
      customerLocation: {
        country: customerLocation.country || 'AE',
        emirate: customerLocation.emirate || customerLocation.state,
        city: customerLocation.city,
        isUAE: (customerLocation.country || 'AE') === 'AE'
      }
    };

    return breakdown;

  } catch (error) {
    console.error('UAE VAT calculation error:', error);
    
    // Return safe fallback
    return {
      subtotal: 0,
      shippingCost: 0,
      taxableAmount: 0,
      vatRate: UAE_VAT_CONFIG.vatRate,
      vatAmount: 0,
      total: 0,
      currency: UAE_VAT_CONFIG.currency,
      calculationMethod: 'manual',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Get appropriate tax code for product
 * @param {string} category - Product category
 * @param {string} name - Product name
 * @returns {string} Tax code
 */
export function getTaxCodeForProduct(category = '', name = '') {
  const cat = category.toLowerCase();
  const productName = name.toLowerCase();
  
  // Mobile repair parts and accessories
  if (cat.includes('repair') || cat.includes('parts') || 
      productName.includes('screen') || productName.includes('battery') || 
      productName.includes('camera') || productName.includes('speaker') ||
      productName.includes('charger') || productName.includes('case')) {
    return UAE_VAT_CONFIG.defaultTaxCode; // Tangible goods
  }
  
  // Repair services
  if (cat.includes('service') || productName.includes('repair service') ||
      productName.includes('installation') || productName.includes('diagnostic')) {
    return UAE_VAT_CONFIG.serviceTaxCode; // Services
  }
  
  // Default to tangible goods for mobile parts
  return UAE_VAT_CONFIG.defaultTaxCode;
}

/**
 * Format currency for display
 * @param {number} amount - Amount in AED
 * @returns {string} Formatted currency string
 */
export function formatAEDCurrency(amount) {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Validate UAE VAT calculation
 * @param {Object} calculation - VAT calculation result
 * @returns {Object} Validation result
 */
export function validateUAEVATCalculation(calculation) {
  const validation = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Check VAT rate
  if (calculation.vatRate !== UAE_VAT_CONFIG.vatRate) {
    validation.errors.push(`VAT rate should be ${UAE_VAT_CONFIG.vatRate * 100}%`);
    validation.isValid = false;
  }

  // Check currency
  if (calculation.currency !== UAE_VAT_CONFIG.currency) {
    validation.errors.push(`Currency should be ${UAE_VAT_CONFIG.currency}`);
    validation.isValid = false;
  }

  // Check VAT amount calculation
  const expectedVAT = Math.round((calculation.taxableAmount * UAE_VAT_CONFIG.vatRate) * 100) / 100;
  if (Math.abs(calculation.vatAmount - expectedVAT) > 0.01) {
    validation.errors.push(`VAT amount mismatch: expected ${expectedVAT}, got ${calculation.vatAmount}`);
    validation.isValid = false;
  }

  // Check total calculation
  const expectedTotal = calculation.taxableAmount + calculation.vatAmount;
  if (Math.abs(calculation.total - expectedTotal) > 0.01) {
    validation.errors.push(`Total amount mismatch: expected ${expectedTotal}, got ${calculation.total}`);
    validation.isValid = false;
  }

  // Warnings for edge cases
  if (calculation.vatAmount < 0.01) {
    validation.warnings.push('Very small VAT amount - verify calculation');
  }

  if (calculation.total > 10000) {
    validation.warnings.push('Large transaction - consider additional compliance checks');
  }

  return validation;
}

/**
 * Create VAT receipt data for compliance
 * @param {Object} calculation - VAT calculation result
 * @param {Object} orderDetails - Order details
 * @returns {Object} Receipt data
 */
export function createVATReceipt(calculation, orderDetails = {}) {
  return {
    receiptId: `NTH-${Date.now()}`,
    businessDetails: UAE_VAT_CONFIG.business,
    customerDetails: {
      name: orderDetails.customerName,
      email: orderDetails.customerEmail,
      phone: orderDetails.customerPhone,
      address: orderDetails.customerAddress
    },
    transactionDetails: {
      date: new Date().toISOString(),
      items: calculation.itemBreakdown,
      subtotal: calculation.subtotal,
      shippingCost: calculation.shippingCost,
      vatRate: `${calculation.vatRate * 100}%`,
      vatAmount: calculation.vatAmount,
      total: calculation.total,
      currency: calculation.currency
    },
    compliance: {
      vatNumber: 'TRN-TO-BE-ASSIGNED', // Update with actual VAT number
      taxPoint: new Date().toISOString(),
      jurisdiction: 'UAE',
      taxAuthority: 'Federal Tax Authority (FTA)'
    }
  };
}

// Export default configuration
export default UAE_VAT_CONFIG;
