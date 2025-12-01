// Netlify Function for UAE VAT Tax Calculation - Nexus TechHub
const Stripe = require('stripe');

// UAE VAT configuration
const UAE_TAX_CONFIG = {
  country: 'AE',
  vatRate: 0.05, // 5% VAT
  currency: 'aed',
  defaultTaxCode: 'txcd_99999999', // General - Tangible Goods
  serviceTaxCode: 'txcd_20030000', // General - Services
  shippingTaxCode: 'txcd_92010001', // Shipping
};

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    // Parse request body
    const { items, customerLocation, shippingCost = 0, currency = 'aed' } = JSON.parse(event.body);

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Items array is required' }),
      };
    }

    // Prepare line items for Stripe Tax calculation
    const lineItems = items.map((item, index) => ({
      amount: item.amount, // Amount in fils (smallest currency unit)
      reference: item.reference || `item-${index}`,
      tax_code: item.tax_code || UAE_TAX_CONFIG.defaultTaxCode,
      quantity: item.quantity || 1,
    }));

    // Add shipping as a line item if applicable
    if (shippingCost > 0) {
      lineItems.push({
        amount: shippingCost,
        reference: 'shipping',
        tax_code: UAE_TAX_CONFIG.shippingTaxCode,
        quantity: 1,
      });
    }

    // Prepare customer address for tax calculation
    const customerAddress = {
      country: customerLocation.country || UAE_TAX_CONFIG.country,
      state: customerLocation.state || customerLocation.emirate,
      postal_code: customerLocation.postal_code || customerLocation.postalCode,
      city: customerLocation.city,
      line1: customerLocation.line1 || customerLocation.address,
    };

    try {
      // Create tax calculation using Stripe Tax API
      const taxCalculation = await stripe.tax.calculations.create({
        currency: currency.toLowerCase(),
        line_items: lineItems,
        customer_details: {
          address: customerAddress,
          address_source: 'billing',
        },
        expand: ['line_items'],
      });

      // Calculate totals
      const subtotalAmount = lineItems.reduce((sum, item) => {
        return sum + (item.amount * item.quantity);
      }, 0) - (shippingCost || 0);

      const totalTaxAmount = taxCalculation.tax_amount_exclusive;
      const totalAmount = taxCalculation.amount_total;

      // Format response
      const response = {
        calculationId: taxCalculation.id,
        subtotal: subtotalAmount / 100, // Convert from fils to AED
        shippingCost: (shippingCost || 0) / 100,
        vatAmount: totalTaxAmount / 100,
        vatRate: UAE_TAX_CONFIG.vatRate,
        total: totalAmount / 100,
        currency: currency.toUpperCase(),
        calculationMethod: 'stripe-tax',
        taxBreakdown: taxCalculation.line_items.data.map(item => ({
          reference: item.reference,
          amount: item.amount / 100,
          taxAmount: item.tax_amount / 100,
          taxRate: item.tax_breakdown?.[0]?.tax_rate?.percentage || 0,
          taxCode: item.tax_code,
        })),
        stripeCalculationId: taxCalculation.id,
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response),
      };

    } catch (stripeError) {
      console.error('Stripe Tax calculation error:', stripeError);

      // Fallback to manual calculation for UAE
      console.log('Falling back to manual UAE VAT calculation');
      
      const subtotalAmount = items.reduce((sum, item) => {
        return sum + (item.amount * item.quantity);
      }, 0);

      const manualVatAmount = Math.round((subtotalAmount + (shippingCost || 0)) * UAE_TAX_CONFIG.vatRate);
      const manualTotal = subtotalAmount + (shippingCost || 0) + manualVatAmount;

      const fallbackResponse = {
        subtotal: subtotalAmount / 100,
        shippingCost: (shippingCost || 0) / 100,
        vatAmount: manualVatAmount / 100,
        vatRate: UAE_TAX_CONFIG.vatRate,
        total: manualTotal / 100,
        currency: currency.toUpperCase(),
        calculationMethod: 'manual',
        fallbackReason: stripeError.message,
        message: 'Using manual 5% UAE VAT calculation',
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(fallbackResponse),
      };
    }

  } catch (error) {
    console.error('Tax calculation function error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Tax calculation failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      }),
    };
  }
};
