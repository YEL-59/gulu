"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from "@/components/ui/menubar";
import { ChevronDown, Headphones } from "lucide-react";

export default function StoreHeader() {
  const categories = [
    {
      name: "Electronics",
      subCategories: [
        { name: "Smartphones", href: "/store/category/smartphones" },
        { name: "Laptops", href: "/store/category/laptops" },
        { name: "Tablets", href: "/store/category/tablets" },
        { name: "Accessories", href: "/store/category/accessories" },
      ],
    },
    {
      name: "Fashion",
      subCategories: [
        { name: "Men's Clothing", href: "/store/category/mens-clothing" },
        { name: "Women's Clothing", href: "/store/category/womens-clothing" },
        { name: "Shoes", href: "/store/category/shoes" },
        { name: "Accessories", href: "/store/category/fashion-accessories" },
      ],
    },
    {
      name: "Home & Garden",
      subCategories: [
        { name: "Furniture", href: "/store/category/furniture" },
        { name: "Kitchen", href: "/store/category/kitchen" },
        { name: "Garden", href: "/store/category/garden" },
        { name: "Decor", href: "/store/category/decor" },
      ],
    },
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      {/* Navigation Bar */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between space-x-8">
          <div className="flex items-center space-x-8">
            {/* All Category Menubar */}
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger className="bg-orange-100 border-orange-200 text-gray-700 hover:bg-orange-200">
                  All Category
                  <ChevronDown className="h-4 w-4 ml-2" />
                </MenubarTrigger>
                <MenubarContent className="w-96 [&_*]:text-gray-900 [&_*:hover]:text-gray-900 [&_*:focus]:text-gray-900">
                  {categories.map((category) => (
                    <MenubarSub key={category.name}>
                      <MenubarSubTrigger className="text-gray-900 hover:text-gray-900 focus:text-gray-900">
                        {category.name}
                      </MenubarSubTrigger>
                      <MenubarSubContent className="[&_*]:text-gray-900 [&_*:hover]:text-gray-900 [&_*:focus]:text-gray-900">
                        {category.subCategories.map((subCategory) => (
                          <MenubarItem
                            key={subCategory.name}
                            asChild
                            className="text-gray-900 hover:text-gray-900 focus:text-gray-900"
                          >
                            <Link
                              href={subCategory.href}
                              className="text-gray-900 hover:text-gray-900 focus:text-gray-900"
                            >
                              {subCategory.name}
                            </Link>
                          </MenubarItem>
                        ))}
                      </MenubarSubContent>
                    </MenubarSub>
                  ))}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>

            {/* Customer Support  store/customer-support*/}
            <div className="flex items-center space-x-2 text-gray-700">
              <Link
                href="/store/customer-support"
                className="text-sm text-gray-700 flex justify-center items-center gap-2 underline hover:text-blue-600"
              >
                <Headphones className="h-4 w-4" />
                <span className="text-sm">Customer Support</span>
              </Link>
            </div>
          </div>

          {/* Become Wholesaler/Reseller Links  wholesaler  reseller*/}
          <div className="flex items-center space-x-4">
            <Link
              href="/wholesaler"
              className="text-sm text-gray-700 underline hover:text-blue-600"
            >
              Become a Wholesaler
            </Link>
            <Link
              href="/reseller"
              className="text-sm text-gray-700 underline hover:text-blue-600"
            >
              Become a Reseller
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
