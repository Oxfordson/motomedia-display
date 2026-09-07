import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DEFAULT_GUEST = 'Distinguished Guest';
const DEFAULT_MESSAGE =
  'We are thrilled to have you here today, Our team is dedicated to making your visit comfortable and Inspiring.';

export async function GET(request: Request) {
  // Verify authorization header from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const now = new Date().toISOString();

  // Find current active schedule
  const { data: activeSchedule } = await supabase
    .from('schedules')
    .select('guest_name, message')
    .filter('is_active', 'eq', true)
    .filter('start_time', 'lte', now)
    .filter('end_time', 'gte', now)
    .order('start_time', { ascending: false })
    .limit(1)
    .single();

  if (activeSchedule) {
    // Update live screen with active schedule
    await supabase
      .from('welcome_screen')
      .update({
        guest_name: activeSchedule.guest_name,
        message: activeSchedule.message,
        updated_at: now,
      })
      .eq('id', 1);
  } else {
    // Revert to default text if no active schedule exists
    await supabase
      .from('welcome_screen')
      .update({
        guest_name: DEFAULT_GUEST,
        message: DEFAULT_MESSAGE,
        updated_at: now,
      })
      .eq('id', 1);
  }

  return NextResponse.json({ success: true, timestamp: now });
}