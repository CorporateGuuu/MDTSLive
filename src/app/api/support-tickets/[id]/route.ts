import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/support-tickets/[id] - Get ticket messages
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching ticket messages:', error);
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/support-tickets/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/support-tickets/[id] - Add reply to ticket
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;
    const body = await request.json();
    const { user_id, message } = body;

    if (!ticketId || !user_id || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert new message
    const now = new Date();
    const { data: newMessage, error: messageError } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id: ticketId,
        user_id,
        sender: 'user',
        message,
        timestamp: now.toLocaleString(),
      })
      .select()
      .single();

    if (messageError) {
      console.error('Error creating reply:', messageError);
      return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 });
    }

    // Update ticket replies count
    const { error: updateError } = await supabase.rpc('increment_ticket_replies', {
      ticket_id: ticketId
    });

    if (updateError) {
      console.error('Error updating ticket replies count:', updateError);
      // Don't fail the whole operation if count update fails
    }

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error in POST /api/support-tickets/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
