import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-8">
      {/* Logo */}
      <Image
        src="/critique-logo.png"
        alt="Critique App Logo"
        width={400}
        height={400}
      />

      {/* Reset Password Button */}
      <Link href="/reset-password">
        <button
          className="mt-20 px-6 py-3 text-white text-lg rounded-lg transition"
          style={{ backgroundColor: "#7850bf" }}
        >
          Reset Password
        </button>
      </Link>
    </div>
  );
}
