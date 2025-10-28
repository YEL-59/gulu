"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
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
import { ChevronDown, ChevronRight, Headphones, Menu } from "lucide-react";

export default function StoreHeader() {
  // Large, production-style nested categories structure used for both desktop and mobile
  const categories = [
    {
      name: "Electronics",
      href: "/store/category/electronics",
      subCategories: [
        {
          name: "Smartphones",
          href: "/store/category/smartphones",
          items: [
            { name: "Android Phones", href: "/store/category/smartphones/android" },
            { name: "iPhones", href: "/store/category/smartphones/iphone" },
            { name: "Refurbished", href: "/store/category/smartphones/refurbished" },
            { name: "Accessories", href: "/store/category/smartphones/accessories" },
          ],
        },
        {
          name: "Laptops",
          href: "/store/category/laptops",
          items: [
            { name: "Gaming Laptops", href: "/store/category/laptops/gaming" },
            { name: "Ultrabooks", href: "/store/category/laptops/ultrabooks" },
            { name: "MacBooks", href: "/store/category/laptops/macbook" },
            { name: "Accessories", href: "/store/category/laptops/accessories" },
          ],
        },
        {
          name: "Tablets",
          href: "/store/category/tablets",
          items: [
            { name: "Android Tablets", href: "/store/category/tablets/android" },
            { name: "iPad", href: "/store/category/tablets/ipad" },
            { name: "Kids Tablets", href: "/store/category/tablets/kids" },
          ],
        },
        { name: "Audio", href: "/store/category/audio" },
        { name: "Wearables", href: "/store/category/wearables" },
        { name: "Accessories", href: "/store/category/accessories" },
      ],
      featured: [
        { name: "New Arrivals", href: "/store/category/electronics?sort=new" },
        { name: "Top Rated", href: "/store/category/electronics?sort=top" },
        { name: "Deals", href: "/store/category/electronics?sort=deals" },
      ],
    },
    {
      name: "Fashion",
      href: "/store/category/fashion",
      subCategories: [
        {
          name: "Men",
          href: "/store/category/mens-clothing",
          items: [
            { name: "Tops & T-Shirts", href: "/store/category/mens-clothing/tops" },
            { name: "Jeans & Pants", href: "/store/category/mens-clothing/bottoms" },
            { name: "Shoes", href: "/store/category/mens-clothing/shoes" },
            { name: "Accessories", href: "/store/category/mens-clothing/accessories" },
          ],
        },
        {
          name: "Women",
          href: "/store/category/womens-clothing",
          items: [
            { name: "Dresses", href: "/store/category/womens-clothing/dresses" },
            { name: "Tops & Blouses", href: "/store/category/womens-clothing/tops" },
            { name: "Jeans & Skirts", href: "/store/category/womens-clothing/bottoms" },
            { name: "Shoes", href: "/store/category/womens-clothing/shoes" },
            { name: "Accessories", href: "/store/category/fashion-accessories" },
          ],
        },
        { name: "Kids", href: "/store/category/kids" },
      ],
      featured: [
        { name: "Trending Now", href: "/store/category/fashion?sort=trending" },
        { name: "Best Sellers", href: "/store/category/fashion?sort=best" },
        { name: "Clearance", href: "/store/category/fashion?sort=clearance" },
      ],
    },
    {
      name: "Home & Garden",
      href: "/store/category/home-garden",
      subCategories: [
        { name: "Furniture", href: "/store/category/furniture" },
        { name: "Kitchen", href: "/store/category/kitchen" },
        { name: "Decor", href: "/store/category/decor" },
        { name: "Garden", href: "/store/category/garden" },
      ],
      featured: [
        { name: "Room Makeovers", href: "/store/category/home-garden/makeovers" },
        { name: "Top Rated", href: "/store/category/home-garden?sort=top" },
        { name: "Deals", href: "/store/category/home-garden?sort=deals" },
      ],
    },
    {
      name: "Beauty & Health",
      href: "/store/category/beauty-health",
      subCategories: [
        { name: "Skincare", href: "/store/category/beauty/skincare" },
        { name: "Makeup", href: "/store/category/beauty/makeup" },
        { name: "Hair Care", href: "/store/category/beauty/hair" },
        { name: "Wellness", href: "/store/category/health/wellness" },
      ],
    },
    {
      name: "Sports & Outdoors",
      href: "/store/category/sports-outdoors",
      subCategories: [
        { name: "Fitness Equipment", href: "/store/category/sports/fitness" },
        { name: "Camping & Hiking", href: "/store/category/outdoors/camping" },
        { name: "Cycling", href: "/store/category/sports/cycling" },
      ],
    },
    {
      name: "Automotive",
      href: "/store/category/automotive",
      subCategories: [
        { name: "Car Electronics", href: "/store/category/automotive/electronics" },
        { name: "Tools & Parts", href: "/store/category/automotive/parts" },
        { name: "Accessories", href: "/store/category/automotive/accessories" },
      ],
    },
    {
      name: "Baby & Kids",
      href: "/store/category/baby-kids",
      subCategories: [
        { name: "Toys", href: "/store/category/kids/toys" },
        { name: "Nursery", href: "/store/category/baby/nursery" },
        { name: "Clothing", href: "/store/category/kids/clothing" },
      ],
    },
    {
      name: "Office & School",
      href: "/store/category/office-school",
      subCategories: [
        { name: "Stationery", href: "/store/category/office/stationery" },
        { name: "Office Furniture", href: "/store/category/office/furniture" },
        { name: "Accessories", href: "/store/category/office/accessories" },
      ],
    },
    {
      name: "Grocery",
      href: "/store/category/grocery",
      subCategories: [
        { name: "Snacks", href: "/store/category/grocery/snacks" },
        { name: "Beverages", href: "/store/category/grocery/beverages" },
        { name: "Household", href: "/store/category/grocery/household" },
      ],
    },
    {
      name: "Pet Supplies",
      href: "/store/category/pet-supplies",
      subCategories: [
        { name: "Dogs", href: "/store/category/pets/dogs" },
        { name: "Cats", href: "/store/category/pets/cats" },
        { name: "Aquatic", href: "/store/category/pets/aquatic" },
      ],
    },
    {
      name: "Gaming",
      href: "/store/category/gaming",
      subCategories: [
        { name: "Consoles", href: "/store/category/gaming/consoles" },
        { name: "Games", href: "/store/category/gaming/games" },
        { name: "Peripherals", href: "/store/category/gaming/peripherals" },
      ],
    },
    {
      name: "Books & Media",
      href: "/store/category/books-media",
      subCategories: [
        { name: "Books", href: "/store/category/books" },
        { name: "Magazines", href: "/store/category/magazines" },
        { name: "Music", href: "/store/category/music" },
      ],
    },
    {
      name: "Appliances",
      href: "/store/category/appliances",
      subCategories: [
        { name: "Kitchen", href: "/store/category/appliances/kitchen" },
        { name: "Cleaning", href: "/store/category/appliances/cleaning" },
        { name: "Climate", href: "/store/category/appliances/climate" },
      ],
    },
    {
      name: "Luxury",
      href: "/store/category/luxury",
      subCategories: [
        { name: "Watches", href: "/store/category/luxury/watches" },
        { name: "Bags", href: "/store/category/luxury/bags" },
        { name: "Jewelry", href: "/store/category/luxury/jewelry" },
      ],
    },
    {
      name: "Deals",
      href: "/store/deals",
      subCategories: [
        { name: "Flash Sales", href: "/store/deals/flash" },
        { name: "Clearance", href: "/store/deals/clearance" },
        { name: "Bundle & Save", href: "/store/deals/bundles" },
      ],
    },
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      {/* Navigation Bar */}
      <div className="container mx-auto px-4 py-2 md:py-4">
        <nav className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between gap-3 md:gap-8">
          <div className="flex items-center flex-wrap gap-3 md:gap-8">
            {/* Mobile Categories Sheet Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden flex items-center gap-2">
                  <Menu className="h-4 w-4" />
                  Browse
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <SheetHeader className="border-b">
                  <SheetTitle className="px-4 py-3">All Categories</SheetTitle>
                </SheetHeader>
                <div className="p-2 overflow-y-auto h-full">
                  <Accordion type="single" collapsible className="space-y-2">
                    {categories.map((cat) => (
                      <AccordionItem key={cat.name} value={cat.name}>
                        <AccordionTrigger>
                          <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {cat.name}
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {cat.href && (
                              <Link href={cat.href} className="block text-sm text-blue-600 hover:underline">
                                Shop all {cat.name}
                              </Link>
                            )}
                            {Array.isArray(cat.featured) && cat.featured.length > 0 && (
                              <div className="space-y-1">
                                <div className="text-xs font-semibold text-gray-500">Featured</div>
                                <ul className="space-y-1">
                                  {cat.featured.map((f) => (
                                    <li key={f.name}>
                                      <Link href={f.href} className="text-sm text-gray-700 hover:text-blue-600">
                                        {f.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {Array.isArray(cat.subCategories) && cat.subCategories.length > 0 && (
                              <div className="space-y-1">
                                <div className="text-xs font-semibold text-gray-500">Browse</div>
                                <ul className="space-y-1">
                                  {cat.subCategories.map((sub) => (
                                    <li key={sub.name}>
                                      <div className="flex flex-col gap-1">
                                        <Link href={sub.href} className="text-sm text-gray-800 hover:text-blue-600">
                                          {sub.name}
                                        </Link>
                                        {Array.isArray(sub.items) && sub.items.length > 0 && (
                                          <ul className="ml-3 space-y-1">
                                            {sub.items.map((item) => (
                                              <li key={item.name}>
                                                <Link href={item.href} className="text-xs text-gray-700 hover:text-blue-600">
                                                  {item.name}
                                                </Link>
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>
            {/* All Category Menubar */}
            <Menubar className="hidden md:block">
              <MenubarMenu>
                <MenubarTrigger className="bg-orange-100 border-orange-200 text-gray-700 hover:bg-orange-200 px-3 py-2 rounded-md text-sm md:text-base w-full sm:w-auto">
                  All Category
                  <ChevronDown className="h-4 w-4 ml-2" />
                </MenubarTrigger>
                <MenubarContent className="w-[calc(100vw-2rem)] sm:w-[28rem] md:w-96 max-h-[60vh] overflow-y-auto [&_*]:text-gray-900 [&_*:hover]:text-gray-900 [&_*:focus]:text-gray-900">
                  {categories.map((category) => (
                    <MenubarSub key={category.name}>
                      <MenubarSubTrigger className="text-gray-900 hover:text-gray-900 focus:text-gray-900 text-sm md:text-base">
                        {category.name}
                      </MenubarSubTrigger>
                      <MenubarSubContent className="[&_*]:text-gray-900 [&_*:hover]:text-gray-900 [&_*:focus]:text-gray-900">
                        {Array.isArray(category.subCategories) && category.subCategories.map((subCategory) => (
                          <MenubarItem
                            key={subCategory.name}
                            asChild
                            className="text-gray-900 hover:text-gray-900 focus:text-gray-900 text-sm md:text-base"
                          >
                            <Link
                              href={subCategory.href}
                              className="text-gray-900 hover:text-gray-900 focus:text-gray-900"
                            >
                              {subCategory.name}
                            </Link>
                          </MenubarItem>
                        ))}
                        {Array.isArray(category.featured) && category.featured.length > 0 && (
                          <div className="px-3 py-2 border-t mt-2">
                            <div className="text-xs font-semibold text-gray-600 mb-1">Featured</div>
                            <div className="flex flex-wrap gap-2">
                              {category.featured.map((f) => (
                                <Link key={f.name} href={f.href} className="text-xs text-blue-600 hover:underline">
                                  {f.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
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
          <div className="flex items-center flex-wrap gap-2 md:gap-4 mt-2 md:mt-0">
            <Link
              href="/wholesaler"
              className="text-xs sm:text-sm text-gray-700 underline hover:text-blue-600"
            >
              Become a Wholesaler
            </Link>
            <Link
              href="/reseller"
              className="text-xs sm:text-sm text-gray-700 underline hover:text-blue-600"
            >
              Become a Reseller
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
