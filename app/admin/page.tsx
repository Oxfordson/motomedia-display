'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const DEFAULT_MESSAGE =
  'We are thrilled to have you here today, Our team is dedicated to making your visit comfortable and Inspiring.';

const ADMIN_PIN = '1234'; // Set your admin password/PIN here

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'instant' | 'schedule'>('instant');

  // Instant state
  const [instantGuest, setInstantGuest] = useState('');
  const [instantMessage, setInstantMessage] = useState(DEFAULT_MESSAGE);

  // Schedule state
  const [schedGuest, setSchedGuest] = useState('');
  const [schedMessage, setSchedMessage] = useState(DEFAULT_MESSAGE);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Passcode.');
    }
  };

  // Push Live Instantly
  const handleInstantPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    const { error } = await supabase
      .from('welcome_screen')
      .update({
        guest_name: instantGuest,
        message: instantMessage,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    setLoading(false);
    if (error) {
      console.error('Supabase Update Error:', error);
      setStatus({ 
        type: 'error', 
        msg: `Failed to push update: ${error.message}` 
      });
    } else {
      setStatus({ type: 'success', msg: 'Successfully updated display screen!' });
    }
  };

  // Create Schedule
  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    const { error } = await supabase.from('schedules').insert([
      {
        guest_name: schedGuest,
        message: schedMessage,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        is_active: true,
      },
    ]);

    setLoading(false);
    if (error) {
      console.error('Supabase Insert Error:', error);
      setStatus({ 
        type: 'error', 
        msg: `Failed to create schedule: ${error.message}` 
      });
    } else {
      setStatus({ type: 'success', msg: 'Schedule added successfully!' });
      setSchedGuest('');
      setStartTime('');
      setEndTime('');
    }
  };

  // Password Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#eeeeee] flex justify-center items-center font-sans p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-[#000000] mb-2 text-center">
            Admin Authentication
          </h1>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Enter the admin PIN to manage the reception screen.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm text-center">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Passcode
              </label>
              <input
                type="password"
                required
                placeholder="Enter PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F60701] focus:outline-none text-center text-lg tracking-widest"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#2B2626] text-white font-bold py-3 rounded-lg hover:bg-black transition"
            >
              Access Manager
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eeeeee] p-4 md:p-8 flex justify-center items-center font-sans">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 border border-gray-200 relative">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-bold text-[#000000]">
            Reception Display Manager
          </h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-gray-500 underline hover:text-black"
          >
            Lock Admin
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Update the display screen live or schedule upcoming visits.
        </p>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => {
              setActiveTab('instant');
              setStatus({ type: '', msg: '' });
            }}
            className={`py-2 px-4 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'instant'
                ? 'border-[#F60701] text-[#F60701]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Instant Live Push
          </button>
          <button
            onClick={() => {
              setActiveTab('schedule');
              setStatus({ type: '', msg: '' });
            }}
            className={`py-2 px-4 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'schedule'
                ? 'border-[#F60701] text-[#F60701]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Schedule Visitor
          </button>
        </div>

        {/* Status Message */}
        {status.msg && (
          <div
            className={`p-3 rounded-md mb-4 text-sm font-medium ${
              status.type === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}
          >
            {status.msg}
          </div>
        )}

        {/* Instant Tab Form */}
        {activeTab === 'instant' && (
          <form onSubmit={handleInstantPush} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Guest Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mr Agbaje"
                value={instantGuest}
                onChange={(e) => setInstantGuest(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F60701] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Welcome Message
              </label>
              <textarea
                rows={3}
                required
                value={instantMessage}
                onChange={(e) => setInstantMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F60701] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F60701] text-white font-bold py-3 rounded-lg hover:bg-red-700 transition"
            >
              {loading ? 'Pushing Live...' : 'Push Live to Screen'}
            </button>
          </form>
        )}

        {/* Schedule Tab Form */}
        {activeTab === 'schedule' && (
          <form onSubmit={handleCreateSchedule} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Guest Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chief Ojo"
                value={schedGuest}
                onChange={(e) => setSchedGuest(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F60701] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F60701] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F60701] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Welcome Message
              </label>
              <textarea
                rows={3}
                required
                value={schedMessage}
                onChange={(e) => setSchedMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F60701] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2B2626] text-white font-bold py-3 rounded-lg hover:bg-black transition"
            >
              {loading ? 'Saving Schedule...' : 'Save Schedule'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}