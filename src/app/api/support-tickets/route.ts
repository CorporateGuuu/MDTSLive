import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface SupportTicket {
  id: string;
  user_id: string;
  ticket_number: string;
  subject: string;
  description: string;
  preview: string;
  category: string;
  priority: string;
  status: string;
  replies: number;
  date_created: string;
  last_reply_date?: string;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  sender: 'user' | 'support';
  message: string;
  timestamp: string;
  created_at: string;
}

// GET /api/support-tickets - Fetch tickets with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Build query with filters
    let query = supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Apply filters
    const ticketNumber = searchParams.get('ticket_number');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const keyword = searchParams.get('keyword');
    const status = searchParams.get('status');

    if (ticketNumber) {
      query = query.ilike('ticket_number', `%${ticketNumber}%`);
    }

    if (dateFrom) {
      query = query.gte('date_created', dateFrom);
    }

    if (dateTo) {
      query = query.lte('date_created', dateTo);
    }

    if (keyword) {
      query = query.or(`subject.ilike.%${keyword}%,description.ilike.%${keyword}%`);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching support tickets:', error);
      return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/support-tickets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/support-tickets - Create new ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, subject, description, category, priority } = body;

    if (!user_id || !subject || !description || !category || !priority) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate ticket number
    const now = new Date();
    const ticketNumber = `TKT${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const dateCreated = now.toLocaleDateString();
    const preview = description.length > 50 ? description.substring(0, 50) + '...' : description;

    // Insert ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .insert({
        user_id,
        ticket_number: ticketNumber,
        subject,
        description,
        preview,
        category,
        priority,
        status: 'Open',
        replies: 0,
        date_created: dateCreated,
      })
      .select()
      .single();

    if (ticketError) {
      console.error('Error creating support ticket:', ticketError);
      return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
    }

    // Insert initial message
    const { error: messageError } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id: ticket.id,
        user_id,
        sender: 'user',
        message: description,
        timestamp: now.toLocaleString(),
      });

    if (messageError) {
      console.error('Error creating initial message:', messageError);
      // Don't fail the whole operation if message creation fails
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error in POST /api/support-tickets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
