import Link from "next/link";
import { AuthButton } from "@/app/components/auth-button";

export function Nav() {
  return (
    <nav className="border-b border-border">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-5">
        <Link
          href="/"
          className="font-serif text-xl font-bold tracking-tight text-fg"
        >
          Scenius
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/resolved"
            className="text-sm text-fg-muted hover:text-fg transition-colors"
          >
            Resolved
          </Link>
          <Link
            href="/submit"
            className="text-sm text-fg-muted hover:text-fg transition-colors"
          >
            Submit
          </Link>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
