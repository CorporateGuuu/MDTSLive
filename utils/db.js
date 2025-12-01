// Database utilities for Nexus TechHub using Supabase
// Re-exports from lib/db.js for consistency

import { pool, query, getConnection, supabase } from '../lib/db.js';

export {
  pool,
  query,
  getConnection,
  supabase
};

export default {
  pool,
  query,
  getConnection,
  supabase
};
