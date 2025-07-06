"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { productsApi } from "@/lib/api";
import Layout from "@/components/Layout/Layout";

const AddProductPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    quantity: 0,
    price: 0,
    category: "",
    brand: "",
    partNumber: "",
    isActive: true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle redirect in useEffect to avoid render-time navigation
  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/admin/login");
    }
  }, [user, router]);

  // Don't render if not admin
  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await productsApi.createProduct(form, image || undefined);
      router.push("/admin/products");
    } catch (err) {
      setError("Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Name" className="w-full border px-3 py-2 rounded" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border px-3 py-2 rounded" />
          <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="w-full border px-3 py-2 rounded" />
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" className="w-full border px-3 py-2 rounded" />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full border px-3 py-2 rounded" />
          <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="w-full border px-3 py-2 rounded" />
          <input name="partNumber" value={form.partNumber} onChange={handleChange} required placeholder="Part Number" className="w-full border px-3 py-2 rounded" />
          <label className="flex items-center space-x-2">
            <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} />
            <span>Active</span>
          </label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {error && <div className="text-red-500">{error}</div>}
          <button type="submit" disabled={isLoading} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded">
            {isLoading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddProductPage; 