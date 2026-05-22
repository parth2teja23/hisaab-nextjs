"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Package, ImageIcon, Sparkles } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export default function ProductsPage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [imageDialog, setImageDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  const [imagePrompt, setImagePrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const CLOUDINARY_PRESET = "hisaab_products";
  const CLOUDINARY_CLOUD_NAME = "daetznp27";

  useEffect(() => {
    if (!storeId) return;
    fetch(`/api/products?storeId=${storeId}`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setFetching(false));
  }, [storeId]);

  useEffect(() => {
    if (imageDialog && form.name) {
      const autoPrompt = `Professional studio product shot of ${form.name}. ${form.description || ""}, white background, high quality.`;
      setImagePrompt(autoPrompt);
    }
  }, [imageDialog, form.name, form.description]);

  async function uploadToCloudinary(fileOrBase64: File | string) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", fileOrBase64);
    formData.append("upload_preset", CLOUDINARY_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setImageUrl(data.secure_url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleAIGenerate() {
    if (!imagePrompt.trim()) return;
    try {
      setGenerating(true);
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      if (!response.ok) throw new Error("Failed to generate");

      const data = await response.json();
      const base64String = data.b64;
      if (!base64String) throw new Error("No image data received");

      const dataUri = `data:image/png;base64,${base64String}`;
      await uploadToCloudinary(dataUri);
    } catch (error: unknown) {
      console.error("AI Error:", error);
      alert("AI Generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  async function createProduct() {
    if (!form.name.trim() || !form.price || !form.quantity) return;
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
          imageUrl,
          storeId,
        }),
      });

      if (res.ok) {
        const newProduct = await res.json();
        setProducts((prev) => [...prev, newProduct]);
        setForm({ name: "", description: "", price: "", quantity: "" });
        setImageUrl(null);
        setImagePrompt("");
        setOpen(false);
        setImageDialog(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const isBusy = loading || uploading || generating;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {fetching
                ? "Loading…"
                : `${products.length} product${products.length !== 1 ? "s" : ""} in stock`}
            </p>
          </div>

          {/* Step 1: Product details dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-slate-950 hover:bg-slate-800 rounded-lg text-sm">
                <Plus size={15} />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Product Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="e.g., Silk Kurti"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Short description (optional)"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={form.quantity}
                      onChange={(e) =>
                        setForm({ ...form, quantity: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <Button
                  className="w-full bg-slate-950 hover:bg-slate-800"
                  onClick={() => {
                    setOpen(false);
                    setImageDialog(true);
                  }}
                  disabled={!form.name || !form.price || !form.quantity}
                >
                  Next: Add Image
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Step 2: Image dialog */}
          <Dialog open={imageDialog} onOpenChange={setImageDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Product Image</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-5 py-2">
                {/* AI generation */}
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="flex items-center gap-1.5">
                    <Sparkles size={13} className="text-violet-500" />
                    AI-generated image
                  </Label>
                  <Textarea
                    id="prompt"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    disabled={isBusy || !!imageUrl}
                    className="resize-none h-20 text-sm"
                  />
                  <Button
                    onClick={handleAIGenerate}
                    disabled={isBusy || !imagePrompt.trim() || !!imageUrl}
                    className="w-full bg-slate-950 hover:bg-slate-800"
                  >
                    {generating ? "Generating…" : "Generate with AI"}
                  </Button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 border-t border-slate-200" />
                  <span className="text-xs text-slate-400 font-medium">OR</span>
                  <div className="flex-1 border-t border-slate-200" />
                </div>

                {/* File upload */}
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadToCloudinary(file);
                      e.target.value = "";
                    }}
                  />
                  <Button
                    variant="outline"
                    disabled={isBusy || !!imageUrl}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full gap-2"
                  >
                    <ImageIcon size={14} />
                    {uploading && !generating ? "Uploading…" : "Upload from device"}
                  </Button>
                </div>

                {/* Image preview */}
                {imageUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200">
                    <img
                      src={imageUrl}
                      className="w-full h-48 object-cover"
                      alt="Preview"
                    />
                    <button
                      onClick={() => {
                        setImageUrl(null);
                        setImagePrompt("");
                      }}
                      className="absolute top-2 right-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium px-2 py-1 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <Button
                disabled={isBusy || !imageUrl}
                onClick={createProduct}
                className="w-full bg-slate-950 hover:bg-slate-800"
              >
                {loading ? "Saving…" : "Save Product"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Product grid */}
        {fetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-slate-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 bg-slate-200 rounded" />
                  <div className="h-3 w-1/2 bg-slate-100 rounded" />
                  <div className="h-4 w-1/3 bg-slate-200 rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5">
              <Package className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No products yet
            </h3>
            <p className="text-slate-500 text-sm max-w-xs mb-6 leading-relaxed">
              Add your first product to start managing inventory and creating invoices.
            </p>
            <Button
              onClick={() => setOpen(true)}
              className="gap-2 bg-slate-950 hover:bg-slate-800"
            >
              <Plus size={15} />
              Add first product
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200"
              >
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    className="w-full h-44 object-cover"
                    alt={p.name}
                  />
                ) : (
                  <div className="w-full h-44 bg-slate-50 flex flex-col items-center justify-center text-slate-300 gap-2">
                    <Package size={28} />
                    <span className="text-xs">No image</span>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="font-semibold text-slate-900 text-sm leading-tight">
                    {p.name}
                  </h2>
                  {p.description && (
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {p.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-base font-bold text-slate-900">
                      ₹{Number(p.price).toLocaleString("en-IN")}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        p.quantity <= 5
                          ? "bg-red-50 text-red-600"
                          : p.quantity <= 20
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {p.quantity} in stock
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
