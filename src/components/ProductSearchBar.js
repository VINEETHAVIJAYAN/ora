"use client"

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductSearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 mb-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 w-full max-w-xs"
      />
      <button
        type="submit"
        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
      >
        <Search className="w-5 h-5" />
        Search
      </button>
    </form>
  );
}
