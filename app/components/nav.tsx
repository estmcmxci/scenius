import Link from "next/link";
import { AuthButton } from "@/app/components/auth-button";

export function Nav() {
  return (
    <nav className="border-b border-gray-200">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-gray-900">
          Scenius
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/resolved"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Resolved
          </Link>
          <Link
            href="/submit"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Submit Prediction
          </Link>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
