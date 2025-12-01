const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mdtstech_store',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

/**
 * Get invoice due amount by invoice ID
 * @param {string|number} invoiceId - The invoice ID
 * @returns {Promise<Object>} Invoice data with amount_due and is_paid
 */
async function getInvoiceDueAmount(invoiceId) {
  try {
    const query = `
      SELECT
        id,
        amount_due,
        is_paid,
        total_amount,
        created_at,
        updated_at
      FROM invoices
      WHERE id = $1
    `;

    const result = await pool.query(query, [invoiceId]);

    if (result.rows.length === 0) {
      return null; // Invoice not found
    }

    const invoice = result.rows[0];
    return {
      id: invoice.id,
      amount_due: parseFloat(invoice.amount_due) || 0,
      is_paid: Boolean(invoice.is_paid),
      total_amount: parseFloat(invoice.total_amount) || 0,
      created_at: invoice.created_at,
      updated_at: invoice.updated_at
    };
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw new Error('Database query failed');
  }
}

/**
 * Validate API key (placeholder - implement actual validation logic)
 * @param {string} apiKey - The API key to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateApiKey(apiKey) {
  // TODO: Implement actual API key validation
  // For now, accept any non-empty key (similar to existing endpoints)
  return apiKey && apiKey.length > 0;
}

module.exports = {
  getInvoiceDueAmount,
  validateApiKey
};
