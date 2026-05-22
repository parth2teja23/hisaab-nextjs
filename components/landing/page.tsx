import React from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  Clock,
  Package,
  Users,
  Bell,
} from "lucide-react";

export default function HisaabLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.06),transparent)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              Built for India's 63 million MSMEs
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black max-w-4xl leading-[1.05] tracking-tight mb-6">
              Accounting made{" "}
              <span className="relative inline-block">
                <span className="text-blue-600">intelligent.</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 6 C50 2, 150 2, 200 6"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.4"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-xl mb-10 leading-relaxed">
              Stop wrestling with spreadsheets. Hisaab automates your invoicing, GST filing, inventory, and cash flow insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/dashboard">
                <button className="flex items-center gap-2 h-12 px-7 rounded-xl bg-slate-950 text-white font-semibold text-sm hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-slate-200 active:scale-[0.98]">
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </button>
              </a>
              <a href="#features">
                <button className="flex items-center gap-2 h-12 px-7 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all">
                  See how it works
                </button>
              </a>
            </div>

            {/* Trust bar */}
            <div className="flex flex-wrap justify-center items-center gap-6 mt-10 text-xs text-slate-400 font-medium">
              {["No credit card required", "Free forever plan", "Setup in 2 minutes"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ─── Dashboard Mockup ─── */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            {/* Glow under mockup */}
            <div className="absolute -inset-x-6 bottom-0 h-40 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

            <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12)] overflow-hidden">
              {/* Browser chrome */}
              <div className="h-11 border-b border-slate-100 bg-slate-50 flex items-center px-4 gap-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white border border-slate-200 rounded-md px-4 py-1 text-xs text-slate-400 font-mono">
                    app.hisaab.in/dashboard
                  </div>
                </div>
              </div>

              {/* App shell */}
              <div className="flex">
                {/* Mini sidebar */}
                <div className="hidden sm:flex w-44 border-r border-slate-100 bg-white flex-col p-3 gap-0.5 shrink-0">
                  <div className="flex items-center gap-2 px-2 py-2 mb-2">
                    <div className="h-6 w-6 bg-slate-950 rounded-md flex items-center justify-center">
                      <IndianRupee className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="font-bold text-sm text-slate-900">Hisaab</span>
                  </div>
                  {[
                    { icon: LayoutDashboard, label: "Overview", active: true },
                    { icon: FileText, label: "Invoices", active: false },
                    { icon: Package, label: "Inventory", active: false },
                    { icon: Users, label: "Customers", active: false },
                  ].map(({ icon: Icon, label, active }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium ${
                        active
                          ? "bg-slate-950 text-white"
                          : "text-slate-500"
                      }`}
                    >
                      <Icon size={13} />
                      {label}
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div className="flex-1 p-5 bg-slate-50/50">
                  {/* Stat cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {[
                      { label: "Revenue", value: "₹12.4L", sub: "+15% vs last month", icon: IndianRupee, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
                      { label: "Invoices", value: "342", sub: "This month", icon: FileText, iconBg: "bg-violet-50", iconColor: "text-violet-600" },
                      { label: "Receivables", value: "₹3.2L", sub: "14 pending", icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
                      { label: "Low Stock", value: "28", sub: "Needs reorder", icon: AlertTriangle, iconBg: "bg-red-50", iconColor: "text-red-500" },
                    ].map(({ label, value, sub, icon: Icon, iconBg, iconColor }) => (
                      <div key={label} className="bg-white rounded-xl border border-slate-100 p-3.5 shadow-sm">
                        <div className="flex items-center justify-between mb-2.5">
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{label}</p>
                          <div className={`h-6 w-6 ${iconBg} ${iconColor} rounded-md flex items-center justify-center`}>
                            <Icon size={12} />
                          </div>
                        </div>
                        <p className="text-base font-bold text-slate-900">{value}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent transactions table */}
                  <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-700">Recent Transactions</p>
                      <span className="text-[10px] text-blue-500 font-medium">View all →</span>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50/60">
                          <th className="px-4 py-2 text-left text-[10px] text-slate-400 font-medium uppercase tracking-wide">Client</th>
                          <th className="px-4 py-2 text-left text-[10px] text-slate-400 font-medium uppercase tracking-wide hidden sm:table-cell">Date</th>
                          <th className="px-4 py-2 text-left text-[10px] text-slate-400 font-medium uppercase tracking-wide">Status</th>
                          <th className="px-4 py-2 text-right text-[10px] text-slate-400 font-medium uppercase tracking-wide">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {[
                          { name: "Reliance Smart Point", date: "Today", status: "Paid", statusColor: "bg-emerald-50 text-emerald-700", amount: "₹45,000" },
                          { name: "DMart Supermarts", date: "Yesterday", status: "Pending", statusColor: "bg-amber-50 text-amber-700", amount: "₹1,12,500" },
                          { name: "Tata Croma", date: "Oct 24", status: "Paid", statusColor: "bg-emerald-50 text-emerald-700", amount: "₹85,200" },
                          { name: "BigBasket", date: "Oct 20", status: "Overdue", statusColor: "bg-red-50 text-red-600", amount: "₹22,100" },
                        ].map(({ name, date, status, statusColor, amount }) => (
                          <tr key={name} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500 shrink-0">
                                  {name[0]}
                                </div>
                                <span className="text-xs font-medium text-slate-700 truncate max-w-[80px]">{name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2.5 text-[10px] text-slate-400 hidden sm:table-cell">{date}</td>
                            <td className="px-4 py-2.5">
                              <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${statusColor}`}>
                                {status}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-xs font-semibold text-slate-800 text-right">{amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="border-y border-slate-100 bg-slate-50/60 py-10">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-7">
            Trusted by 10,000+ Indian businesses
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 opacity-50">
            {[
              { icon: LayoutDashboard, name: "TechRetail" },
              { icon: Zap, name: "QuickLogistics" },
              { icon: ShieldCheck, name: "SecurePay" },
              { icon: BarChart3, name: "FinFlow India" },
            ].map(({ icon: Icon, name }) => (
              <div key={name} className="flex items-center gap-2 font-bold text-slate-700">
                <Icon className="h-5 w-5" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Everything your business needs
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Powerful tools designed for the way Indian businesses actually work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: FileText,
              label: "01",
              title: "GST Compliant Invoicing",
              desc: "Create professional, GST-ready invoices in seconds. Auto-fill customer details, calculate tax, and share via WhatsApp or Email.",
              iconBg: "bg-blue-50",
              iconColor: "text-blue-600",
              hoverBg: "hover:bg-blue-50",
              hoverBorder: "hover:border-blue-200",
            },
            {
              icon: Package,
              label: "02",
              title: "Inventory & Godown Mgmt",
              desc: "Real-time stock tracking across multiple godowns and locations. Auto-sync inventory with every sale. Get low-stock alerts.",
              iconBg: "bg-emerald-50",
              iconColor: "text-emerald-600",
              hoverBg: "hover:bg-emerald-50",
              hoverBorder: "hover:border-emerald-200",
            },
            {
              icon: BarChart3,
              label: "03",
              title: "AI Financial Insights",
              desc: "Visual cash flow reports, top-selling item analysis, and AI-powered suggestions to cut operational costs and grow revenue.",
              iconBg: "bg-violet-50",
              iconColor: "text-violet-600",
              hoverBg: "hover:bg-violet-50",
              hoverBorder: "hover:border-violet-200",
            },
          ].map(({ icon: Icon, label, title, desc, iconBg, iconColor, hoverBg, hoverBorder }) => (
            <div
              key={title}
              className={`group border border-slate-200 ${hoverBorder} ${hoverBg} rounded-2xl p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`h-12 w-12 ${iconBg} ${iconColor} rounded-xl flex items-center justify-center`}>
                  <Icon size={22} />
                </div>
                <span className="text-xs font-bold text-slate-200 tracking-widest">{label}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── AUTOMATION / BENEFITS ─── */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_50%,rgba(59,130,246,0.12),transparent)]" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">Automation</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 leading-tight">
                Let Hisaab handle the busy work
              </h2>
              <div className="space-y-5">
                {[
                  { icon: Bell, text: "Automated GST calculation — GSTR-1, GSTR-3B generated instantly" },
                  { icon: Zap, text: "Send payment reminders via SMS & WhatsApp automatically" },
                  { icon: ShieldCheck, text: "Auto-fetch bank transactions from all major Indian banks" },
                  { icon: Users, text: "Multi-user access with role-based permissions for staff & accountants" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-4">
                    <div className="h-9 w-9 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={16} className="text-slate-300" />
                    </div>
                    <p className="text-slate-300 text-base leading-relaxed pt-1.5">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cash flow visual */}
            <div className="relative">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-300">Cash Flow</p>
                    <p className="text-xs text-slate-500 mt-0.5">October 2025</p>
                  </div>
                  <span className="text-emerald-400 text-sm font-semibold bg-emerald-950 border border-emerald-900 px-2.5 py-1 rounded-full">
                    +12.5%
                  </span>
                </div>
                {/* Bar chart */}
                <div className="flex items-end gap-2 h-36 mb-4">
                  {[40, 65, 35, 80, 55, 70, 90, 60, 75, 95, 50, 100].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`flex-1 rounded-t-md transition-all ${
                        i === 11
                          ? "bg-blue-500"
                          : i >= 8
                          ? "bg-slate-600"
                          : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-600 font-medium">
                  <span>Oct 1</span>
                  <span>Oct 15</span>
                  <span>Oct 31</span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Total Inflow</p>
                    <p className="text-lg font-bold text-white mt-0.5">₹12,45,000</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Net Profit</p>
                    <p className="text-lg font-bold text-emerald-400 mt-0.5">₹4,12,300</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Get started in minutes</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Up and running in 3 steps
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-slate-200" />
          {[
            { step: "1", title: "Create your store", desc: "Sign up and set up your first store in under 2 minutes. No complex configuration." },
            { step: "2", title: "Add products & customers", desc: "Import your inventory and customer list, or add them manually with our simple forms." },
            { step: "3", title: "Start invoicing", desc: "Generate professional GST invoices, track payments, and get insights on your business." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="relative flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-slate-950 text-white rounded-2xl flex items-center justify-center text-xl font-black mb-5 shadow-lg shadow-slate-200 relative z-10">
                {step}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-slate-950 rounded-3xl p-12 md:p-16 text-center text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-900 rounded-full blur-3xl opacity-20 -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-violet-900 rounded-full blur-3xl opacity-20 translate-y-1/3 -translate-x-1/3" />
            <div className="relative z-10">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                Ready to get started?
              </p>
              <h2 className="text-3xl md:text-5xl font-black mb-5 tracking-tight leading-tight">
                Take control of your<br />business finances.
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Join thousands of Indian businesses using Hisaab. Free forever plan available.
              </p>
              <a href="/dashboard">
                <button className="inline-flex items-center gap-2 h-13 px-8 py-3.5 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-all hover:shadow-lg active:scale-[0.98]">
                  Get started for free
                  <ArrowRight className="h-4 w-4" />
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-slate-100 bg-white pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-7 w-7 bg-slate-950 rounded-lg flex items-center justify-center">
                  <IndianRupee className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-slate-900">Hisaab</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed pr-4">
                Making business finance simple, smart, and GST-compliant for Indian MSMEs.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
                {["GST Invoicing", "Inventory", "Reports", "Pricing"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-slate-900 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4">Resources</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
                {["Blog", "GST Guide", "Support", "API Docs"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-slate-900 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
                {["About", "Careers", "Privacy Policy", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-slate-900 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400">
            <span>© 2025 Hisaab Technologies Pvt Ltd. All rights reserved.</span>
            <span>Made with ❤️ by Parth, Piyush, Prachi & Priyanshi</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
