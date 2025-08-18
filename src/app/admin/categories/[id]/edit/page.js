"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Link from "next/link";
import Cropper from "react-easy-crop";
import { canvasToBlob } from "canvas-to-blob";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.id;
  const [formData, setFormData] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [croppingImageUrl, setCroppingImageUrl] = useState("");
  const [croppingFile, setCroppingFile] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!categoryId) return;
    fetch(`/api/admin/categories/${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Category not found");
        setLoading(false);
      });
  }, [categoryId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const file = files[0];
      setCroppingFile(file);
      setCroppingImageUrl(URL.createObjectURL(file));
      setCropModalOpen(true);
    }
  };

  const onCropChange = (newCrop) => setCrop(newCrop);
  const onZoomChange = (newZoom) => setZoom(newZoom);
  const onCropComplete = (croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels);

  const getCroppedImg = async () => {
    return new Promise((resolve, reject) => {
      const image = new window.Image();
      image.src = croppingImageUrl;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      };
      image.onerror = reject;
    });
  };

  const handleCropSave = async () => {
    const croppedBlob = await getCroppedImg();
    const data = new FormData();
    data.append("file", croppedBlob, croppingFile.name);
    data.append("upload_preset", "ora-ecommerce");
    const res = await fetch("https://api.cloudinary.com/v1_1/djpertvld/image/upload", {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    if (result.secure_url) {
      setFormData((prev) => ({
        ...prev,
        image: result.secure_url,
      }));
    }
    setCropModalOpen(false);
    setCroppingImageUrl("");
    setCroppingFile(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setFormData(data);
        router.push("/admin/categories");
      } else {
        setError(data.message || "Update failed");
      }
    } catch {
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !formData) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto p-8 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="border rounded px-3 py-2 w-full" placeholder="Category Name" required />
          <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} className="border rounded px-3 py-2 w-full" placeholder="Slug" required />
          <textarea name="description" value={formData.description} onChange={handleInputChange} className="border rounded px-3 py-2 w-full" placeholder="Description" />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {formData.image && (
            <div className="mt-2">
              <img src={formData.image} alt="Category" className="w-32 h-32 object-cover rounded" />
            </div>
          )}
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded" disabled={loading}>Update</button>
          {success && <div className="mt-2 text-green-600">Category updated successfully!</div>}
        </form>
        {/* Crop Image Modal */}
        {cropModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-lg font-semibold mb-4">Crop Image</h2>
              <div className="relative w-full h-64 bg-gray-100">
                <Cropper
                  image={croppingImageUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={onCropChange}
                  onCropComplete={onCropComplete}
                  onZoomChange={onZoomChange}
                />
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => setCropModalOpen(false)}>Cancel</button>
                <button type="button" className="px-4 py-2 bg-primary-600 text-white rounded" onClick={handleCropSave}>Save Crop</button>
              </div>
            </div>
          </div>
        )}
        <Link href="/admin/categories" className="mt-6 inline-block text-primary-600 underline">Back to Categories</Link>
      </div>
    </>
  );
}
