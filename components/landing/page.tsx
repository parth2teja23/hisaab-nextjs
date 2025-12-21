// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { ArrowRight } from "lucide-react";

// export default function HisaabLanding() {
//   return (
//     <div className="min-h-screen bg-white text-black flex flex-col">

//       <section className="flex flex-col items-center text-center mt-20 px-4">
//         <h2 className="text-5xl font-bold max-w-3xl leading-tight">
//           The Next Generation Accounting and Billing Platform
//         </h2>
//         <p className="text-lg mt-4 max-w-2xl text-gray-600">
//           Smart invoicing, product tracking, store management, and AI-assisted insights. All in one place.
//         </p>
//         <a href="/dashboard">
//         <Button className="mt-6 rounded-2xl px-8 py-3 text-lg flex gap-2 items-center">
//           Get Started <ArrowRight size={20} />
//         </Button>
//         </a>
//       </section>

//       <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-28 px-6 max-w-6xl mx-auto">
//         <Card className="shadow-lg rounded-2xl p-2">
//           <CardContent className="p-6">
//             <h3 className="text-xl font-semibold mb-2">Billing & Invoices</h3>
//             <p className="text-gray-600 text-base">
//               Create professional invoices and manage bills with real time tracking.
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="shadow-lg rounded-2xl p-2">
//           <CardContent className="p-6">
//             <h3 className="text-xl font-semibold mb-2">Product & Inventory</h3>
//             <p className="text-gray-600 text-base">
//               Keep your stock updated automatically with every sale.
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="shadow-lg rounded-2xl p-2">
//           <CardContent className="p-6">
//             <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
//             <p className="text-gray-600 text-base">
//               Make data backed decisions using smart AI summaries and suggestions.
//             </p>
//           </CardContent>
//         </Card>
//       </section>

//       <footer className="mt-24 p-6 text-center text-gray-500 text-sm">
//         © 2025 Hisaab. All rights reserved.
//       </footer>
//     </div>
//   );
// }
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Globe,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  Clock,
  MoreHorizontal
} from "lucide-react";

export default function HisaabLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-100">


      {/* --- Hero Section --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-40 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl mix-blend-multiply filter" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-50 rounded-full blur-3xl mix-blend-multiply filter" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            Made for modern Indian businesses
          </div>

          <h1 className="text-5xl md:text-7xl font-bold max-w-4xl tracking-tight leading-tight mb-6">
            Accounting made <span className="text-blue-600">intelligent.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
            Stop wrestling with spreadsheets. Hisaab automates your invoicing, GST reports, inventory, and insights so you can focus on growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a href="/dashboard">
              <Button className="h-12 px-8 rounded-full text-lg bg-black text-white hover:bg-slate-800 hover:scale-105 transition-all duration-300 shadow-lg shadow-slate-200">
                Start for free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            
          </div>

          {/* Abstract Dashboard Visual with Indian Data Context */}
          <div className="mt-20 relative w-full max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-full w-full pointer-events-none"></div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
              {/* Mockup Header */}
              <div className="h-12 border-b border-slate-100 bg-slate-50 flex items-center justify-between px-4">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs font-medium text-slate-400">Hisaab Dashboard - Overview</div>
              </div>

              {/* Mockup Content - Filled with Data */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/30">
                {/* Metric Card 1: Revenue */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-slate-500">Total Revenue (Oct)</h4>
                      <div className="p-1 bg-blue-50 rounded-md">
                        <IndianRupee className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold tracking-tight">₹12,45,000</div>
                  </div>
                  <div className="flex items-center text-sm text-green-600 mt-3 font-medium">
                    <TrendingUp className="h-4 w-4 mr-1" /> +15.3% vs Sept
                  </div>
                </div>

                {/* Metric Card 2: Receivables */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-slate-500">Pending Receivables</h4>
                      <div className="p-1 bg-yellow-50 rounded-md">
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold tracking-tight">₹3,20,500</div>
                  </div>
                  <div className="flex items-center text-sm text-slate-500 mt-3">
                    Across 14 clients
                  </div>
                </div>

                 {/* Metric Card 3: Inventory Alert */}
                 <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-slate-500">Low Stock Alert</h4>
                      <div className="p-1 bg-red-50 rounded-md">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold tracking-tight">28 Items</div>
                  </div>
                  <div className="flex items-center text-sm text-red-600 mt-3 font-medium">
                    Needs immediate reorder
                  </div>
                </div>

                {/* Recent Activity Table */}
                <div className="col-span-1 sm:col-span-3 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mt-2">
                  <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-white">
                    <h4 className="font-semibold text-slate-800">Recent Transactions</h4>
                    <Button variant="ghost" size="sm" className="h-8 text-slate-500"><MoreHorizontal size={16}/></Button>
                  </div>
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-50/50 uppercase font-medium">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Client / Vendor</th>
                        <th className="px-4 py-3 hidden sm:table-cell">Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right rounded-tr-lg">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 bg-white">
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">R</div>
                          Reliance Smart Point
                        </td>
                        <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">Today, 10:45 AM</td>
                        <td className="px-4 py-3"><span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Paid</span></td>
                        <td className="px-4 py-3 text-right font-medium">₹45,000</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">D</div>
                          DMart Avenue Supermarts
                        </td>
                        <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">Yesterday</td>
                        <td className="px-4 py-3"><span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Pending</span></td>
                        <td className="px-4 py-3 text-right font-medium">₹1,12,500</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">T</div>
                          Tata Croma
                        </td>
                        <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">Oct 24, 2025</td>
                        <td className="px-4 py-3"><span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Paid</span></td>
                        <td className="px-4 py-3 text-right font-medium">₹85,200</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">B</div>
                          BigBasket Supplies
                        </td>
                        <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">Oct 20, 2025</td>
                        <td className="px-4 py-3"><span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">Overdue</span></td>
                        <td className="px-4 py-3 text-right font-medium text-red-600">₹22,100</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Social Proof --- */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">Trusted by 10,000+ Indian Businesses</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Placeholders for logos */}
             <div className="flex items-center gap-2 font-bold text-xl"><Globe className="h-6 w-6"/> Global Traders</div>
             <div className="flex items-center gap-2 font-bold text-xl"><Zap className="h-6 w-6"/> QuickLogistics India</div>
             <div className="flex items-center gap-2 font-bold text-xl"><LayoutDashboard className="h-6 w-6"/> TechRetail Solutions</div>
             <div className="flex items-center gap-2 font-bold text-xl"><ShieldCheck className="h-6 w-6"/> SecurePay Systems</div>
          </div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to run your business</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Powerful features wrapped in a simple, intuitive interface designed for the Indian market.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <Card className="group border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileText size={24} />
              </div>
              <CardTitle className="text-xl">GST Compliant Invoicing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
                Create professional, GST-ready invoices in seconds. Share via WhatsApp or Email and get paid faster.
              </p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="group border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <LayoutDashboard size={24} />
              </div>
              <CardTitle className="text-xl">Inventory & Godown Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
                Real-time stock tracking across multiple locations/godowns. Auto-sync inventory with every sale.
              </p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="group border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <BarChart3 size={24} />
              </div>
              <CardTitle className="text-xl">AI Financial Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
                Visual reports on cash flow, top-selling items, and AI suggestions to reduce operational costs.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* --- Benefits / Deep Dive Section --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Automate your busy work</h2>
            <div className="space-y-6">
              {[
                "Auto-fetch bank transactions securely (Supports major Indian banks).",
                "Automatic GST calculation and report generation (GSTR-1, GSTR-3B).",
                "Send automated payment reminders via SMS/WhatsApp.",
                "Multi-user access for accountants and staff with role-based permissions."
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle2 className="text-green-500 mt-1 shrink-0" />
                  <p className="text-lg text-slate-700">{item}</p>
                </div>
              ))}
            </div>
            {/* <Button variant="link" className="mt-8 text-blue-600 p-0 text-lg hover:underline">
              Explore all features &rarr;
            </Button> */}
          </div>
          <div className="relative">
             {/* Visual representation */}
             <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-8">
                    <span className="font-bold text-lg flex items-center gap-2"><IndianRupee size={20}/> Cash Flow</span>
                    <span className="text-green-500 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
                </div>
                <div className="flex items-end gap-2 h-40">
                    <div className="w-full bg-slate-100 rounded-t-md h-[40%]"></div>
                    <div className="w-full bg-slate-100 rounded-t-md h-[60%]"></div>
                    <div className="w-full bg-slate-100 rounded-t-md h-[30%]"></div>
                    <div className="w-full bg-slate-100 rounded-t-md h-[80%]"></div>
                    <div className="w-full bg-black rounded-t-md h-[95%] relative group">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ₹ 2.4 Lakh
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- Bottom CTA --- */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-black rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
          {/* Abstract circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>

          <h2 className="relative z-10 text-3xl md:text-5xl font-bold mb-6">Ready to upgrade your business?</h2>
          <p className="relative z-10 text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of Indian businesses using Hisaab to manage their finances. No credit card required for the trial.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
            <a href="/dashboard">
            <Button className="h-14 px-8 rounded-full bg-white text-black hover:bg-slate-200 text-lg font-semibold">
              Get Started Now
            </Button></a>
            {/* <Button variant="outline" className="h-14 px-8 rounded-full border-slate-700 text-white hover:bg-slate-800 hover:text-white text-lg bg-transparent">
              Talk to Sales
            </Button> */}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t border-slate-100 bg-white pt-16 pb-8">
        {/* <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="h-6 w-6 bg-black rounded flex items-center justify-center text-white text-xs">H</div>
              <span>Hisaab</span>
            </div>
            <p className="text-slate-500 text-sm pr-4">
              Making business finance simple, smart, and compliant for Indian MSMEs.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-black">GST Invoicing</a></li>
              <li><a href="#" className="hover:text-black">Inventory</a></li>
              <li><a href="#" className="hover:text-black">Reports</a></li>
              <li><a href="#" className="hover:text-black">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-black">Blog</a></li>
              <li><a href="#" className="hover:text-black">GST Guide</a></li>
              <li><a href="#" className="hover:text-black">Support</a></li>
              <li><a href="#" className="hover:text-black">API Docs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-black">About</a></li>
              <li><a href="#" className="hover:text-black">Careers</a></li>
              <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-black">Contact</a></li>
            </ul>
          </div>
        </div> */}
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm flex flex-col md:flex-row justify-between items-center">
          <span>© 2025 Hisaab Technologies Pvt Ltd. All rights reserved.</span>
          <span className="mt-2 md:mt-0">Made with ❤️ in by Parth, Piyush, Prachi and Priyanshi</span>
        </div>
      </footer>
    </div>
  );
}