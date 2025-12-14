import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createFAQsTable() {
  try {
    console.log('Creating FAQs table...');

    // Create the table using raw SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create FAQs table for dynamic FAQ content and schema
        CREATE TABLE IF NOT EXISTS faqs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          category TEXT DEFAULT 'general',
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Create index for performance
        CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
        CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(display_order);
        CREATE INDEX IF NOT EXISTS idx_faqs_is_active ON faqs(is_active);

        -- Enable Row Level Security
        ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

        -- Create policy for public read access (FAQs are public content)
        DROP POLICY IF EXISTS "Public FAQs" ON faqs;
        CREATE POLICY "Public FAQs" ON faqs
          FOR SELECT
          USING (true);

        -- Create policy for authenticated users to manage FAQs (optional admin functionality)
        DROP POLICY IF EXISTS "Authenticated FAQ management" ON faqs;
        CREATE POLICY "Authenticated FAQ management" ON faqs
          FOR ALL
          USING (auth.role() = 'authenticated');
      `
    });

    if (error) {
      console.error('Error creating table:', error);
      // Try direct table creation as fallback
      console.log('Trying direct table creation...');

      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS faqs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          category TEXT DEFAULT 'general',
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `;

      const { error: createError } = await supabase
        .from('_supabase_migrations')
        .select('*')
        .limit(1); // Just test connection

      // Since we can't run raw SQL directly, let's create the table using a different approach
      console.log('Please run the SQL migration manually in Supabase dashboard:');
      console.log('File: migrations/023_create_faqs_table.sql');

      return false;
    }

    console.log('FAQs table created successfully!');
    return true;

  } catch (error) {
    console.error('Error in table creation process:', error);
    console.log('Please run the SQL migration manually in Supabase dashboard:');
    console.log('File: migrations/023_create_faqs_table.sql');
    return false;
  }
}

// Run the table creation
createFAQsTable();
