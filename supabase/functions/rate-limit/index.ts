import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { email, ip } = await req.json();

    // Check for recent login attempts (last 15 minutes)
    const { data, error } = await supabase
      .from('login_attempts')
      .select('*')
      .or(`email.eq.${email},ip.eq.${ip}`)
      .gt('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString());

    if (error) {
      console.error('Rate limit check error:', error);
      return new Response(JSON.stringify({ error: 'Rate limit service unavailable' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Rate limit: 5 attempts per 15 minutes per email/IP
    if (data && data.length >= 5) {
      return new Response(JSON.stringify({ 
        error: 'Too many login attempts. Please try again in 15 minutes.',
        retryAfter: 15 * 60 // 15 minutes in seconds
      }), {
        status: 429,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Retry-After': (15 * 60).toString()
        },
      });
    }

    // Log this attempt
    const { error: insertError } = await supabase
      .from('login_attempts')
      .insert({ 
        email, 
        ip,
        user_agent: req.headers.get('user-agent') || 'unknown'
      });

    if (insertError) {
      console.error('Failed to log login attempt:', insertError);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Rate limit function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
