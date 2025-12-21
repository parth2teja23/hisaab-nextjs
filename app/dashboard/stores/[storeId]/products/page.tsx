// "use client";

// import { useEffect, useState, useRef } from "react"; // 1. IMPORT useRef
// import { useParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card } from "@/components/ui/card";

// interface Product {
//   id: string;
//   name: string;
//   description?: string;
//   price: number;
//   quantity: number;
//   imageUrl?: string;
// }

// export default function ProductsPage() {
//   const params = useParams();
//   const storeId = params.storeId as string;
  
//   // 2. CREATE THE REF
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [products, setProducts] = useState<Product[]>([]);
//   const [open, setOpen] = useState(false);
//   const [imageDialog, setImageDialog] = useState(false);
//   const [loading, setLoading] = useState(false);
  
//   // Add an uploading state to disable button while image uploads
//   const [uploading, setUploading] = useState(false); 

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     quantity: "",
//   });

//   const [imageUrl, setImageUrl] = useState<string | null>(null);

//   useEffect(() => {
//     if (!storeId) return;
//     fetch(`/api/products?storeId=${storeId}`)
//       .then((res) => res.json())
//       .then((data) => setProducts(data))
//       .catch((err) => console.error(err));
//   }, [storeId]);

//   async function handleImageUpload(file: File) {
//     if (!file.type.startsWith("image/")) {
//       alert("Only images allowed");
//       return;
//     }
    
//     setUploading(true); // Start loading spinner/disable

//     const formData = new FormData();
//     formData.append("file", file);
//     // TODO: change cloud name and cloud preset and use from .env file
//     formData.append("upload_preset", "hisaab_products"); 
//     formData.append("cloud_name", 'daetznp27'!);
    

//     try {
//       const res = await fetch(
//         // TODO: change cloud preset name here too.
//         `https://api.cloudinary.com/v1_1/daetznp27/image/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );
//       const data = await res.json();
//       console.log("Cloudinary Response:", data);
//       setImageUrl(data.secure_url);
//     } catch (error) {
//       console.error("Upload failed", error);
//       alert("Upload failed. Check console.");
//     } finally {
//       setUploading(false); // Stop loading
//     }
//   }

//   async function createProduct() {
//     if (!form.name.trim() || !form.price || !form.quantity) return;

//     setLoading(true);
//     try {
//       const res = await fetch("/api/products", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: form.name,
//           description: form.description,
//           price: parseFloat(form.price),
//           quantity: parseInt(form.quantity),
//           imageUrl,
//           storeId,
//         }),
//       });

//       if (res.ok) {
//         const newProduct = await res.json();
//         setProducts((prev) => [...prev, newProduct]);

//         setForm({ name: "", description: "", price: "", quantity: "" });
//         setImageUrl(null);
//         setOpen(false);
//         setImageDialog(false);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-semibold">Inventory</h1>
//           <p className="text-gray-500">Store ID: {storeId}</p>
//         </div>

//         {/* Step 1: Product details */}
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <Button>Add Product</Button>
//           </DialogTrigger>

//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Product Details</DialogTitle>
//             </DialogHeader>

//             <div className="space-y-4 mt-4">
//               <div>
//                 <Label htmlFor="name">Product Name</Label>
//                 <Input
//                   id="name"
//                   value={form.name}
//                   onChange={(e) => setForm({ ...form, name: e.target.value })}
//                   placeholder="e.g., Silk Kurti"
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <Input
//                   id="description"
//                   value={form.description}
//                   onChange={(e) => setForm({ ...form, description: e.target.value })}
//                   placeholder="Short description"
//                 />
//               </div>

//               <div className="flex gap-4">
//                 <div className="flex-1">
//                   <Label htmlFor="price">Price</Label>
//                   <Input
//                     id="price"
//                     type="number"
//                     value={form.price}
//                     onChange={(e) => setForm({ ...form, price: e.target.value })}
//                     required
//                   />
//                 </div>

//                 <div className="flex-1">
//                   <Label htmlFor="quantity">Quantity</Label>
//                   <Input
//                     id="quantity"
//                     type="number"
//                     value={form.quantity}
//                     onChange={(e) => setForm({ ...form, quantity: e.target.value })}
//                     required
//                   />
//                 </div>
//               </div>

//               <Button
//                 onClick={() => {
//                   setOpen(false);
//                   setImageDialog(true);
//                 }}
//               >
//                 Next
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>

//         {/* Step 2: Image dialog (FIXED SECTION) */}
//         <Dialog open={imageDialog} onOpenChange={setImageDialog}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add Image</DialogTitle>
//             </DialogHeader>

//             <div className="flex flex-col gap-4">
//                <div className="flex gap-3">
//                   <Button variant="outline">Create image from AI</Button>
                  
//                   {/* 3. HIDDEN INPUT */}
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     accept="image/*"
//                     hidden
//                     onChange={(e) => {
//                       const file = e.target.files?.[0];
//                       console.log("Selected file:", file); // DEBUG

//                       if (file) handleImageUpload(file);
//                     }}
//                   />

//                   {/* 4. BUTTON TRIGGERS INPUT */}
//                   <Button 
//                     variant="outline" 
//                     disabled={uploading}
//                     onClick={() => fileInputRef.current?.click()}
//                   >
//                     {uploading ? "Uploading..." : "Upload image"}
//                   </Button>
//                </div>

//                {/* 5. PREVIEW OUTSIDE THE BUTTONS */}
//                {imageUrl && (
//                  <div className="relative rounded-md overflow-hidden border">
//                     <img
//                       src={imageUrl}
//                       className="w-full h-40 object-cover"
//                       alt="Preview"
//                     />
//                     <Button
//                       variant="destructive"
//                       size="sm"
//                       className="absolute top-2 right-2 h-8"
//                       onClick={() => setImageUrl(null)}
//                     >
//                       Remove
//                     </Button>
//                  </div>
//                )}
//             </div>

//             <Button
//               disabled={loading || uploading} 
//               onClick={createProduct}
//               className="mt-4"
//             >
//               {loading ? "Saving..." : "Save Product"}
//             </Button>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Products grid */}
//       {products.length === 0 ? (
//         <p className="text-gray-500">No products added yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {products.map((p) => (
//             <Card key={p.id} className="p-4">
//               {p.imageUrl && (
//                 <img
//                   src={p.imageUrl}
//                   className="w-full h-40 object-cover rounded-md mb-2"
//                 />
//               )}
//               <h2 className="font-medium text-lg">{p.name}</h2>
//               <p className="text-sm text-gray-500">{p.description}</p>
//               <div className="mt-2 flex justify-between text-sm">
//                 <span>₹{p.price}</span>
//                 <span className="text-gray-500">Qty: {p.quantity}</span>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

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
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  // We still keep this state in case the user wants to manually edit the AI prompt
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const CLOUDINARY_PRESET = "hisaab_products";
  const CLOUDINARY_CLOUD_NAME = "daetznp27";

  useEffect(() => {
    if (!storeId) return;
    fetch(`/api/products?storeId=${storeId}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, [storeId]);

  // When the Image Dialog opens, pre-fill the prompt with Name + Description
  useEffect(() => {
    if (imageDialog && form.name) {
      const autoPrompt = `Professional studio product shot of ${form.name}. ${form.description || ""} , white background, high quality.`;
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

      console.log("Cloudinary Success:", data);
      setImageUrl(data.secure_url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  // --- HANDLER: AI Generation (Nano Banana) ---
  async function handleAIGenerate() {
    // 1. Validate we have a prompt (either auto-filled or user edited)
    if (!imagePrompt.trim()) {
      alert("Prompt is empty. Please enter product details first.");
      return;
    }

    try {
      setGenerating(true);

      // 2. Call our Next.js API (which calls Nano Banana)
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Failed to generate");
      }

      const data = await response.json();
      const base64String = data.b64;

      if (!base64String) throw new Error("No image data received from AI");

      // 3. Convert Base64 to a format Cloudinary accepts directly
      // Cloudinary expects: "data:image/png;base64,....."
      const dataUri = `data:image/png;base64,${base64String}`;

      // 4. Upload to Cloudinary
      await uploadToCloudinary(dataUri);

    } catch (error: any) {
      console.error("AI Error:", error);
      alert("AI Generation failed: " + error.message);
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

  // Helper boolean for UI states
  const isBusy = loading || uploading || generating;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Inventory</h1>
          <p className="text-gray-500">Store ID: {storeId}</p>
        </div>

        {/* Step 1: Product details Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Silk Kurti"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description (e.g., Red with gold embroidery)"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={() => { setOpen(false); setImageDialog(true); }}>
                Next: Add Image
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Step 2: Image dialog (Updated for Nano Banana) */}
        <Dialog open={imageDialog} onOpenChange={setImageDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Image</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-6 py-4">
              {/* ---- AI Section ---- */}
              <div className="space-y-2 border-b pb-6">
                <div className="flex justify-between items-center">
                   <Label htmlFor="prompt">Generate Image</Label>
                </div>
                
                <Textarea
                  id="prompt"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  disabled={isBusy || !!imageUrl}
                  className="resize-none h-24"
                />
                
                <Button
                  onClick={handleAIGenerate}
                  disabled={isBusy || !imagePrompt.trim() || !!imageUrl}
                  className="w-full bg-black hover:bg-neutral-800"
                >
                  {generating ? "Generating Image..." : "Generate Image"}
                </Button>
              </div>

              {/* ---- Local Upload Section ---- */}
              <div className="flex flex-col gap-3">
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
                >
                  {uploading && !generating ? "Uploading..." : "Or Select Local File"}
                </Button>

                {/* Preview */}
                {imageUrl && (
                  <div className="relative rounded-md overflow-hidden border mt-2">
                    <img src={imageUrl} className="w-full h-48 object-cover" alt="Preview" />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => { setImageUrl(null); setImagePrompt(""); }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Button disabled={isBusy || !imageUrl} onClick={createProduct} className="w-full">
               {loading ? "Saving..." : "Save Product"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            {p.imageUrl ? (
              <img src={p.imageUrl} className="w-full h-48 object-contain" alt={p.name} />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <div className="p-4">
              <h2 className="font-medium text-lg">{p.name}</h2>
              <p className="text-sm text-gray-500">{p.description}</p>
              <div className="mt-2 flex justify-between">
                <span className="font-bold">₹{p.price}</span>
                <span className="text-gray-500">Qty: {p.quantity}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}