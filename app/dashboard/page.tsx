"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Store, ArrowRight, Package, FileText, Users, Sparkles, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";

interface StoreType {
  id: string;
  name: string;
  imageUrl?: string | null;
}

const STORE_COLORS = [
  { iconBg: "bg-blue-100", iconText: "text-blue-700" },
  { iconBg: "bg-violet-100", iconText: "text-violet-700" },
  { iconBg: "bg-emerald-100", iconText: "text-emerald-700" },
  { iconBg: "bg-orange-100", iconText: "text-orange-700" },
  { iconBg: "bg-rose-100", iconText: "text-rose-700" },
  { iconBg: "bg-cyan-100", iconText: "text-cyan-700" },
];

const CLOUDINARY_PRESET = "hisaab_products";
const CLOUDINARY_CLOUD_NAME = "daetznp27";

export default function StoresPage() {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBusy = loading || generating || uploading;

  useEffect(() => {
    fetch("/api/stores")
      .then(r => r.json())
      .then(d => setStores(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setFetching(false));
  }, []);

  // Auto-fill prompt when name changes
  useEffect(() => {
    if (name.trim()) {
      setImagePrompt(`A professional minimalist store logo or banner for "${name}". Clean, modern, suitable for an Indian retail business. White background, high quality.`);
    }
  }, [name]);

  async function uploadToCloudinary(fileOrBase64: File | string) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", fileOrBase64);
    fd.append("upload_preset", CLOUDINARY_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setImageUrl(data.secure_url);
    } catch {
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleAIGenerate() {
    if (!imagePrompt.trim()) return;
    setGenerating(true);
    const tid = toast.loading("Generating store image with AI…");
    try {
      const res = await fetch("/api/generate-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: imagePrompt }) });
      if (!res.ok) throw new Error("Generation failed");
      const { b64 } = await res.json();
      if (!b64) throw new Error("No image returned");
      await uploadToCloudinary(`data:image/png;base64,${b64}`);
      toast.dismiss(tid);
      toast.success("Image generated!");
    } catch {
      toast.dismiss(tid);
      toast.error("AI generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleCreateStore(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, imageUrl }),
      });
      if (res.ok) {
        const newStore = await res.json();
        setStores(prev => [...prev, newStore]);
        setName(""); setImageUrl(null); setImagePrompt("");
        setOpen(false);
        toast.success("Store created!", { description: `"${newStore.name}" is ready.` });
      } else {
        toast.error("Failed to create store.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Stores</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {fetching ? "Loading…" : stores.length > 0 ? `${stores.length} store${stores.length !== 1 ? "s" : ""} — click to manage` : "Create your first store to get started"}
            </p>
          </div>

          <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) { setName(""); setImageUrl(null); setImagePrompt(""); } }}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-slate-950 hover:bg-slate-800 rounded-lg text-sm"><Plus size={15} />New Store</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Create a New Store</DialogTitle></DialogHeader>
              <form onSubmit={handleCreateStore} className="space-y-5 mt-2">
                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name">Store Name</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Pakeeza Women Wear" required />
                </div>

                {/* Image section */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-1.5"><Sparkles size={13} className="text-violet-500" />Store Image <span className="text-slate-400 font-normal">(optional)</span></Label>

                  {imageUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200">
                      <img src={imageUrl} className="w-full h-40 object-cover" alt="Store" />
                      <button type="button" onClick={() => setImageUrl(null)} className="absolute top-2 right-2 bg-white border border-slate-200 rounded-lg p-1.5 text-slate-500 hover:text-red-600 hover:border-red-200 transition-colors">
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Textarea value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} disabled={isBusy} placeholder="Describe the store image…" className="resize-none h-16 text-sm" />
                      <div className="flex gap-2">
                        <Button type="button" onClick={handleAIGenerate} disabled={isBusy || !imagePrompt.trim()} className="flex-1 bg-slate-950 hover:bg-slate-800 gap-1.5 text-sm h-9">
                          <Sparkles size={13} />{generating ? "Generating…" : "Generate with AI"}
                        </Button>
                        <input type="file" ref={fileInputRef} accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) uploadToCloudinary(f); e.target.value = ""; }} />
                        <Button type="button" variant="outline" disabled={isBusy} onClick={() => fileInputRef.current?.click()} className="h-9 px-3">
                          <ImageIcon size={14} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={isBusy} className="w-full bg-slate-950 hover:bg-slate-800">
                  {loading ? "Creating…" : "Create Store"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading skeleton */}
        {fetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-44 bg-white border border-slate-200 rounded-xl animate-pulse" />)}
          </div>
        ) : stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5">
              <Store className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No stores yet</h3>
            <p className="text-slate-500 text-sm max-w-xs mb-6 leading-relaxed">Create your first store to start managing inventory, invoices, and customers.</p>
            <Button onClick={() => setOpen(true)} className="gap-2 bg-slate-950 hover:bg-slate-800"><Plus size={15} />Create your first store</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stores.map((store, index) => {
              const color = STORE_COLORS[index % STORE_COLORS.length];
              return (
                <div
                  key={store.id}
                  onClick={() => window.location.href = `/dashboard/stores/${store.id}`}
                  className="group bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:border-slate-300 hover:shadow-lg transition-all duration-200"
                >
                  {/* Store image or colored placeholder */}
                  {store.imageUrl ? (
                    <div className="h-32 w-full overflow-hidden">
                      <img src={store.imageUrl} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className={`h-32 w-full ${color.iconBg} flex items-center justify-center`}>
                      <span className={`text-4xl font-black ${color.iconText} opacity-30 select-none`}>{store.name[0].toUpperCase()}</span>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-slate-900 text-base truncate">{store.name}</h2>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Package size={11} />Inventory</span>
                      <span className="flex items-center gap-1"><FileText size={11} />Invoices</span>
                      <span className="flex items-center gap-1"><Users size={11} />Customers</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
