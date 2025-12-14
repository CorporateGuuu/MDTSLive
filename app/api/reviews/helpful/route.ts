import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { reviewId } = await request.json();

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    // Create server Supabase client
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user already voted on this review
    const { data: existingVote, error: checkError } = await supabase
      .from('review_helpful_votes')
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing vote:', checkError);
      return NextResponse.json(
        { error: 'Error checking vote status' },
        { status: 500 }
      );
    }

    if (existingVote) {
      // User already voted - remove the vote (toggle functionality)
      const { error: deleteError } = await supabase
        .from('review_helpful_votes')
        .delete()
        .eq('review_id', reviewId)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error removing vote:', deleteError);
        return NextResponse.json(
          { error: 'Error removing vote' },
          { status: 500 }
        );
      }

      // Get current helpful votes count and decrement
      const { data: currentReview, error: fetchError } = await supabase
        .from('reviews')
        .select('helpful_votes')
        .eq('id', reviewId)
        .single();

      if (fetchError) {
        console.error('Error fetching current vote count:', fetchError);
        return NextResponse.json(
          { error: 'Error fetching vote count' },
          { status: 500 }
        );
      }

      // Decrement helpful votes count
      const { error: decrementError } = await supabase
        .from('reviews')
        .update({
          helpful_votes: Math.max(0, currentReview.helpful_votes - 1),
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId);

      if (decrementError) {
        console.error('Error updating vote count:', decrementError);
        return NextResponse.json(
          { error: 'Error updating vote count' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        action: 'removed',
        message: 'Vote removed successfully'
      });
    } else {
      // User hasn't voted yet - add the vote
      const { error: insertError } = await supabase
        .from('review_helpful_votes')
        .insert({
          review_id: reviewId,
          user_id: user.id
        });

      if (insertError) {
        console.error('Error adding vote:', insertError);
        return NextResponse.json(
          { error: 'Error adding vote' },
          { status: 500 }
        );
      }

      // Get current helpful votes count and increment
      const { data: currentReview, error: fetchError } = await supabase
        .from('reviews')
        .select('helpful_votes')
        .eq('id', reviewId)
        .single();

      if (fetchError) {
        console.error('Error fetching current vote count:', fetchError);
        return NextResponse.json(
          { error: 'Error fetching vote count' },
          { status: 500 }
        );
      }

      // Increment helpful votes count
      const { error: incrementError } = await supabase
        .from('reviews')
        .update({
          helpful_votes: currentReview.helpful_votes + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId);

      if (incrementError) {
        console.error('Error updating vote count:', incrementError);
        return NextResponse.json(
          { error: 'Error updating vote count' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        action: 'added',
        message: 'Vote added successfully'
      });
    }

  } catch (error) {
    console.error('Error in helpful vote API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if user has voted on a review
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    // Create server Supabase client
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({
        hasVoted: false,
        canVote: false
      });
    }

    // Check if user has voted on this review
    const { data: existingVote, error: checkError } = await supabase
      .from('review_helpful_votes')
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking vote status:', checkError);
      return NextResponse.json(
        { error: 'Error checking vote status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      hasVoted: !!existingVote,
      canVote: true
    });

  } catch (error) {
    console.error('Error in helpful vote check API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
