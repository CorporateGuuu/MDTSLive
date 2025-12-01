'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface JoinGuildRequest {
  accessToken: string;
  userId: string;
  guildId: string;
}

export async function joinDiscordGuild({
  accessToken,
  userId,
  guildId
}: JoinGuildRequest) {
  try {
    // First, check if user is already in the guild
    const memberCheckResponse = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/members/${userId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (memberCheckResponse.ok) {
      return {
        success: true,
        message: 'User is already a member of the guild',
        alreadyMember: true
      };
    }

    // If not a member, add them to the guild
    const addMemberResponse = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/members/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken,
        }),
      }
    );

    if (!addMemberResponse.ok) {
      const errorData = await addMemberResponse.json();
      throw new Error(`Failed to add user to guild: ${errorData.message}`);
    }

    // Log the successful join in Supabase
    const { error: logError } = await supabase
      .from('discord_guild_joins')
      .insert({
        user_id: userId,
        guild_id: guildId,
        joined_at: new Date().toISOString(),
      });

    if (logError) {
      console.error('Failed to log guild join:', logError);
      // Don't throw here as the join was successful
    }

    return {
      success: true,
      message: 'Successfully joined the Discord guild!',
      alreadyMember: false
    };

  } catch (error) {
    console.error('Error joining Discord guild:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to join Discord guild',
      alreadyMember: false
    };
  }
}
