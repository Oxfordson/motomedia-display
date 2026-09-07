import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  // 1. Verify Authorization Header from cron-job.org
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date().toISOString();

  try {
    // 2. Fetch the current active schedule matching current time
    const { data: activeSchedule, error: fetchErr } = await supabase
      .from('schedules')
      .select('*')
      .lte('start_time', now)
      .gte('end_time', now)
      .eq('is_active', true)
      .order('start_time', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    // 3. If an active schedule is found, push update live to welcome_screen
    if (activeSchedule) {
      const { error: updateErr } = await supabase
        .from('welcome_screen')
        .update({
          guest_name: activeSchedule.guest_name,
          message: activeSchedule.message,
          updated_at: now,
        })
        .eq('id', 1);

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        status: 'Updated live display from schedule',
        guest: activeSchedule.guest_name,
      });
    }

    return NextResponse.json({
      success: true,
      status: 'No active schedule at this time',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}