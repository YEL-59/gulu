"use client";
import Link from "next/link";
export default function StoreNavbar({ basePath = "" }) {
  return (
    <nav className="bg-white border border-gray-200 rounded-lg p-2 mb-6">
      <ul className="flex flex-wrap items-center gap-3 text-sm">
        <li><Link className="px-3 py-2 rounded-md hover:bg-gray-100" href={basePath || "/"}>Home</Link></li>
        <li><Link className="px-3 py-2 rounded-md hover:bg-gray-100" href={`${basePath}/products`}>Products</Link></li>
        <li><a className="px-3 py-2 rounded-md hover:bg-gray-100" href="#about">About</a></li>
        <li><Link className="px-3 py-2 rounded-md hover:bg-gray-100" href={`${basePath}/contacts`}>Contacts</Link></li>
      </ul>
    </nav>
  );
}