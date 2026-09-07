'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Playfair_Display, Montserrat } from 'next/font/google';
import Image from 'next/image';

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['600'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ScreenData {
  guest_name: string;
  message: string;
}

export default function DisplayPage() {
  const [data, setData] = useState<ScreenData>({
    guest_name: 'Mr Agbaje',
    message:
      'We are thrilled to have you here today, Our team is dedicated to making your visit comfortable and Inspiring.',
  });

  useEffect(() => {
    // Initial fetch from Supabase
    const fetchInitialData = async () => {
      const { data: initialData } = await supabase
        .from('welcome_screen')
        .select('guest_name, message')
        .eq('id', 1)
        .single();

      if (initialData) {
        setData(initialData);
      }
    };

    fetchInitialData();

    // Realtime subscription for live updates
    const channel = supabase
      .channel('welcome_screen_updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'welcome_screen' },
        (payload) => {
          if (payload.new) {
            setData({
              guest_name: payload.new.guest_name,
              message: payload.new.message,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className={`relative w-screen h-screen bg-[#ffffff] flex flex-col justify-between items-center overflow-hidden select-none ${montserrat.className}`}>
      {/* Background City Skyline Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-bottom opacity-40 pointer-events-none z-0"
        style={{ backgroundImage: "url('/city-skyline-bg.png')" }}
      />

      {/* Discrete Admin Link Button (Top Left) */}
      <Link
        href="/admin"
        aria-label="Admin Portal"
        className="absolute top-4 left-4 z-50 p-2 text-gray-400 opacity-25 hover:opacity-100 transition-opacity duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </Link>

      {/* Top Right Red Corner L-Frame */}
      <div className="absolute top-[4vh] right-[4vw] w-[90px] h-[75px] border-t-[14px] border-r-[14px] border-[#F60701] z-10" />

      {/* Header Section */}
      <div className="z-10 mt-[6vh] text-center flex flex-col items-center">
        {/* "Welcome to" Script */}
        <p className={`${playfair.className} text-[3.2rem] md:text-[3.8rem] text-[#000000] leading-none font-semibold tracking-tightest`}>
          Welcome to
        </p>

        {/* Motomedia Logo Image */}
        <Image
          src="/BIG BLACK MM LOGO small (1).png"
          alt="Motomedia Logo"
          width={280}
          height={70}
          priority
          className="h-auto w-auto max-w-[320px] object-contain"
        />
      </div>

      {/* Main Guest Greeting Content */}
      <div className="z-10 text-center max-w-[85vw] px-4 flex flex-col items-center mt-[8.5vh] mb-auto">
        {/* Guest Name */}
        <h2 className={`${playfair.className} text-[5.5rem] md:text-[7rem] font-bold text-[#000000] leading-none mb-6 tracking-tight`}>
          {data.guest_name}
        </h2>

        {/* Waterfall Container with CSS Shape-Outside Floats */}
        <div className="relative max-w-[65vw] mt-[6.5vh] text-center">
          {/* Left Waterfall Inward Slope */}
          <div
            className="float-left h-full w-[22%]"
            style={{
              shapeOutside: 'polygon(0 0, 0 100%, 100% 100%)',
              clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
            }}
          />

          {/* Right Waterfall Inward Slope */}
          <div
            className="float-right h-full w-[22%]"
            style={{
              shapeOutside: 'polygon(100% 0, 100% 100%, 0 100%)',
              clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
            }}
          />

          {/* Dynamic Message Text */}
          <p className="text-[1.8rem] md:text-[2.2rem] text-[#000000] italic font-semibold leading-[1.35] tracking-tight">
            {data.message}
          </p>
        </div>
      </div>

      {/* Bottom Left Red Corner L-Frame */}
      <div className="absolute bottom-[8vh] left-[2vw] w-[110px] h-[85px] border-b-[18px] border-l-[18px] border-[#F60701] z-10" />

      {/* Bottom Footer Section */}
      <div className="w-full z-10 border-t-[1.5px] border-[#2B2626] bg-[#ffffff] py-2 text-right pr-[3vw]">
        <p className="text-xs md:text-sm italic text-[#000000] font-medium tracking-normal">
          Reaching Millions of lives Daily across Africa
        </p>
      </div>
    </main>
  );
}