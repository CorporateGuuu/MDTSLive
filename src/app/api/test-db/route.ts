import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET() {
  try {
    console.log('Testing Supabase database connection...');

    // Test 1: Check if we can connect to Supabase
    const { error: connectionError } = await supabase
      .from('supabase_migrations')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('Connection test failed:', connectionError);
      return NextResponse.json({
        success: false,
        message: 'Database connection failed',
        error: connectionError.message
      }, { status: 500 });
    }

    // Test 2: Check if profiles table exists and is accessible
    const { error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    // Test 3: Check if products table exists
    const { error: productsError } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    // Test 4: Check if categories table exists
    const { error: categoriesError } = await supabase
      .from('categories')
      .select('count')
      .limit(1);

    // Test 5: Check if brands table exists
    const { error: brandsError } = await supabase
      .from('brands')
      .select('count')
      .limit(1);

    // Compile results
    const tests = {
      connection: { success: !connectionError, error: connectionError?.message || null },
      profiles: { success: !profilesError, error: profilesError?.message || null },
      products: { success: !productsError, error: productsError?.message || null },
      categories: { success: !categoriesError, error: categoriesError?.message || null },
      brands: { success: !brandsError, error: brandsError?.message || null },
    };

    const allSuccessful = Object.values(tests).every(test => test.success);

    return NextResponse.json({
      success: allSuccessful,
      message: allSuccessful
        ? 'All database tests passed! Midas Technical Solutions is fully functional.'
        : 'Some database tests failed. Check the details below.',
      tests,
      timestamp: new Date().toISOString(),
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Missing',
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configured' : 'Missing',
      }
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Unexpected error during database testing',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
