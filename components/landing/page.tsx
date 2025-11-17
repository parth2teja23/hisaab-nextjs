import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function HisaabLanding() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">

      <section className="flex flex-col items-center text-center mt-20 px-4">
        <h2 className="text-5xl font-bold max-w-3xl leading-tight">
          The Next Generation Accounting and Billing Platform
        </h2>
        <p className="text-lg mt-4 max-w-2xl text-gray-600">
          Smart invoicing, product tracking, store management, and AI-assisted insights. All in one place.
        </p>
        <a href="/dashboard">
        <Button className="mt-6 rounded-2xl px-8 py-3 text-lg flex gap-2 items-center">
          Get Started <ArrowRight size={20} />
        </Button>
        </a>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-28 px-6 max-w-6xl mx-auto">
        <Card className="shadow-lg rounded-2xl p-2">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">Billing & Invoices</h3>
            <p className="text-gray-600 text-base">
              Create professional invoices and manage bills with real time tracking.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl p-2">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">Product & Inventory</h3>
            <p className="text-gray-600 text-base">
              Keep your stock updated automatically with every sale.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl p-2">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
            <p className="text-gray-600 text-base">
              Make data backed decisions using smart AI summaries and suggestions.
            </p>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-24 p-6 text-center text-gray-500 text-sm">
        © 2025 Hisaab. All rights reserved.
      </footer>
    </div>
  );
}
