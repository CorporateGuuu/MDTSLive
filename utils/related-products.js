/**
 * Related Products Utility
 * Provides functions to find related products based on various criteria
 */

const { Pool } = require('pg');

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mdtstech_store',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

/**
 * Get related products for a given product ID
 * @param {number} productId - The product ID to find related products for
 * @param {number} limit - Number of related products to return (default: 4)
 * @returns {Promise<Array>} Array of related products
 */
async function getRelatedProducts(productId, limit = 4) {
  try {
    // Get the current product's category and brand
    const productQuery = `
      SELECT category_id, brand
      FROM products
      WHERE id = $1
    `;
    const productResult = await pool.query(productQuery, [productId]);

    if (productResult.rows.length === 0) {
      return [];
    }

    const { category_id, brand } = productResult.rows[0];

    // Find related products in the same category or same brand
    const relatedQuery = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id != $1
      AND (p.category_id = $2 OR p.brand = $3)
      ORDER BY
        CASE
          WHEN p.category_id = $2 AND p.brand = $3 THEN 1
          WHEN p.category_id = $2 THEN 2
          WHEN p.brand = $3 THEN 3
          ELSE 4
        END,
        p.created_at DESC
      LIMIT $4
    `;

    const relatedResult = await pool.query(relatedQuery, [productId, category_id, brand, limit]);

    return relatedResult.rows;
  } catch (error) {
    console.error('Error getting related products:', error);
    return [];
  }
}

module.exports = {
  getRelatedProducts
};
