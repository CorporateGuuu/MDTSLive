const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    const { action, email, password, first_name, last_name, phone, company } = JSON.parse(event.body);

    switch (action) {
      case 'login':
        return await handleLogin(email, password, headers);

      case 'register':
        return await handleRegister({ email, password, first_name, last_name, phone, company }, headers);

      case 'logout':
        return await handleLogout(headers);

      case 'check_session':
        return await checkSession(headers);

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, message: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Request error:', error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, message: 'Invalid request body' })
    };
  }
};

async function handleLogin(email, password, headers) {
  try {
    // Use Supabase auth sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, message: error.message })
      };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Profile fetch error:', profileError);
    }

    // For backward compatibility, also check if user exists in MySQL-style users table
    // (This is a fallback for existing users)
    const firstName = data.user.user_metadata?.first_name || 'User';
    const lastName = data.user.user_metadata?.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();

    const userData = {
      id: data.user.id,
      email: data.user.email,
      name: fullName || 'User',
      role: profile?.role || 'customer'
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Login successful',
        user: userData,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        }
      })
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Login failed. Please try again.' })
    };
  }
}

async function handleRegister(userData, headers) {
  try {
    const { email, password, first_name, last_name, phone, company } = userData;

    // Create user with Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          phone,
          company
        }
      }
    });

    if (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: error.message })
      };
    }

    // Profile will be created automatically by the trigger

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Registration successful! Welcome to Midas Technical Solutions.',
        user: {
          id: data.user.id,
          email: data.user.email,
          name: `${first_name} ${last_name}`,
          role: 'customer'
        }
      })
    };

  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Registration failed. Please try again.' })
    };
  }
}

async function handleLogout(headers) {
  // For Supabase, logout is handled client-side
  // But we can clear any server-side session if needed
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, message: 'Logged out successfully' })
  };
}

async function checkSession(headers) {
  // This would typically check for a valid session
  // For now, return not logged in since we're using client-side auth
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, logged_in: false })
  };
}
