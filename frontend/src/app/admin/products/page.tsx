"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { productsApi } from "@/lib/api";
import { Product } from "@/types";
import Layout from "@/components/Layout/Layout";

const AdminProductsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/admin/login");
      return;
    }
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productsApi.getAdminProducts();
      setProducts(response.products);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productsApi.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <button
            onClick={() => router.push("/admin/products/new")}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          >
            Add New Product
          </button>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Active</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-2 border">{product.name}</td>
                  <td className="px-4 py-2 border">${product.price}</td>
                  <td className="px-4 py-2 border">{product.category}</td>
                  <td className="px-4 py-2 border">{product.isActive ? "Yes" : "No"}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => router.push(`/products/${product.id}`)}
                      className="text-primary-600 hover:underline mr-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-2"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default AdminProductsPage; 