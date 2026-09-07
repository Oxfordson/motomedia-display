import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#eeeeee] flex flex-col justify-center items-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center">
        {/* Logo Header */}
        <div className="mb-6">
          <p className="font-serif italic text-2xl text-[#000000] font-semibold">
            Welcome to
          </p>
          <h1 className="text-4xl font-extrabold text-[#000000] tracking-tight mt-[-2px]">
            moto<span className="text-[#F60701]">media</span>
          </h1>
        </div>

        <p className="text-gray-600 text-sm mb-8">
          Front Desk Welcome Screen Management Portal
        </p>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <Link
            href="/display"
            target="_blank"
            className="block w-full bg-[#2B2626] hover:bg-black text-white font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-md"
          >
            Open TV Display View
          </Link>

          <Link
            href="/admin"
            className="block w-full bg-[#F60701] hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-md"
          >
            Open Receptionist Control Portal
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
          Reaching Millions of lives Daily across Africa
        </div>
      </div>
    </main>
  );
}