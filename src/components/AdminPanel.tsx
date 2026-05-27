"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Submission = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    const res = await fetch("/api/submissions");
    if (!res.ok) return;
    const data = await res.json();
    setSubmissions(data.submissions ?? []);
  }, []);

  const checkSession = useCallback(async () => {
    const res = await fetch("/api/auth/me");
    if (res.ok) {
      const data = await res.json();
      setAuthenticated(true);
      setAdminEmail(data.email);
      await fetchSubmissions();
    } else {
      setAuthenticated(false);
    }
  }, [fetchSubmissions]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.message ?? "Login failed");
        return;
      }
      setAuthenticated(true);
      setAdminEmail(data.email);
      setPassword("");
      await fetchSubmissions();
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false);
    setAdminEmail("");
    setSubmissions([]);
  }

  if (authenticated === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-brand-100 bg-white p-8 shadow-card">
          <h1 className="font-display text-2xl font-semibold text-brand-900">Admin Login</h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to view contact form submissions.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1 block text-sm font-medium">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600" role="alert">
                {loginError}
              </p>
            )}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-gray-400">
            Demo: admin@shecan.org / SheCan2026!
          </p>
        </div>
        <p className="mt-4 text-center">
          <Link href="/" className="text-sm text-brand-600 hover:underline">
            ← Back to website
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-900">
            Submissions Dashboard
          </h1>
          <p className="text-sm text-gray-500">Signed in as {adminEmail}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={fetchSubmissions} className="btn-secondary">
            Refresh
          </button>
          <button type="button" onClick={handleLogout} className="btn-secondary">
            Log out
          </button>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-200 bg-white p-12 text-center text-gray-500">
          No submissions yet. Share the contact form to receive messages.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-brand-100 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-brand-100 bg-brand-50/50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-brand-800">Name</th>
                  <th className="px-4 py-3 font-semibold text-brand-800">Email</th>
                  <th className="px-4 py-3 font-semibold text-brand-800">Message</th>
                  <th className="px-4 py-3 font-semibold text-brand-800">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {submissions.map((s) => (
                  <tr key={s.id} className="hover:bg-brand-50/30">
                    <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${s.email}`}
                        className="text-brand-600 hover:underline"
                      >
                        {s.email}
                      </a>
                    </td>
                    <td className="max-w-xs px-4 py-3 text-gray-600">
                      <p className="line-clamp-3">{s.message}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                      {new Date(s.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-brand-50 px-4 py-2 text-xs text-gray-400">
            {submissions.length} submission{submissions.length !== 1 ? "s" : ""} total
          </p>
        </div>
      )}

      <p className="mt-6">
        <Link href="/" className="text-sm text-brand-600 hover:underline">
          ← Back to website
        </Link>
      </p>
    </div>
  );
}
