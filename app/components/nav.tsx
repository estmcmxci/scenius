import Link from "next/link";

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
            className="rounded-md bg-gray-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
          >
            Submit Prediction
          </Link>
        </div>
      </div>
    </nav>
  );
}
