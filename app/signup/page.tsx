"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { IndianRupee, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setIsError(!res.ok);
    setMessage(data.message || data.error);

    if (res.ok) {
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        callbackUrl: "/dashboard",
      });
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Form panel — left side */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-8 w-8 bg-slate-950 rounded-lg flex items-center justify-center">
              <IndianRupee className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold">Hisaab</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
            <p className="text-slate-500 text-sm">
              Start managing your business finances today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Full name</label>
              <input
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                type="text"
                placeholder="Rajesh Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email address</label>
              <input
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                type="email"
                placeholder="you@business.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                type="password"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {message && (
              <div
                className={`text-sm px-3 py-2.5 rounded-lg border ${
                  isError
                    ? "text-red-700 bg-red-50 border-red-100"
                    : "text-emerald-700 bg-emerald-50 border-emerald-100"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div className="flex items-center my-5 gap-3">
            <div className="flex-1 border-t border-slate-100" />
            <span className="text-slate-400 text-xs font-medium tracking-wide">OR</span>
            <div className="flex-1 border-t border-slate-100" />
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-2.5 border border-slate-200 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 active:scale-[0.99] transition-all"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-4 h-4"
            />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-slate-900 font-semibold hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>

      {/* Brand panel — right side */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-950 p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-950 rounded-full blur-3xl opacity-30 -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-slate-800 rounded-full blur-3xl opacity-60 translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-14">
            <div className="h-9 w-9 bg-white rounded-xl flex items-center justify-center">
              <IndianRupee className="h-5 w-5 text-slate-950" />
            </div>
            <span className="text-xl font-bold tracking-tight">Hisaab</span>
          </div>
          <h2 className="text-4xl font-bold mb-5 leading-snug max-w-sm">
            Everything you need to run your business finances.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-xs">
            Trusted by thousands of Indian MSMEs for invoicing, inventory, and financial management.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {[
            "Create GST-compliant invoices in seconds",
            "Track inventory across multiple godowns",
            "Get AI-powered financial insights",
            "Automate payment reminders via SMS",
          ].map((text) => (
            <div key={text} className="flex items-start gap-3 text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{text}</span>
            </div>
          ))}
          <p className="text-slate-600 text-xs pt-4">
            © 2025 Hisaab Technologies Pvt Ltd. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}
