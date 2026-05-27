import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-brand-100/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-bold text-white shadow-soft"
            aria-hidden
          >
            SC
          </span>
          <div>
            <p className="font-display text-lg font-semibold leading-tight text-brand-900 group-hover:text-brand-700">
              She Can Foundation
            </p>
            <p className="text-xs text-brand-600">Empowering every woman to rise</p>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/#contact"
            className="hidden text-sm font-medium text-gray-600 hover:text-brand-600 sm:inline"
          >
            Contact
          </Link>
          <Link href="/admin" className="btn-secondary text-xs sm:text-sm">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
