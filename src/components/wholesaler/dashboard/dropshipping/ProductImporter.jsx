"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AddDropshippingProductModal from "./AddDropshippingProductModal";

export default function ProductImporter() {
  const [connections, setConnections] = useState([]);
  const [importMethod, setImportMethod] = useState("url");
  const [productUrl, setProductUrl] = useState("");
  const [bulkUrls, setBulkUrls] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [importing, setImporting] = useState(false);
  const [importedProduct, setImportedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = () => {
    try {
      const stored = localStorage.getItem("dropshippingPlatformConnections");
      if (stored) {
        const conns = JSON.parse(stored);
        setConnections(conns.filter((c) => c.status === "connected"));
        if (conns.length > 0) {
          setSelectedPlatform(conns[0].platformId);
        }
      }
    } catch (error) {
      console.error("Error loading connections:", error);
    }
  };

  const handleImportFromUrl = async () => {
    if (!productUrl.trim()) {
      alert("Please enter a product URL");
      return;
    }

    if (!selectedPlatform) {
      alert("Please select a connected platform");
      return;
    }

    setImporting(true);

    try {
      // In production, this would call your backend API which then calls the platform's API
      // For now, we'll simulate the import
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock imported product data
      const imported = {
        id: `imported-${Date.now()}`,
        name: "Imported Product from URL",
        price: 29.99,
        originalPrice: 39.99,
        image: "/placeholder-image.png",
        brand: "Imported Brand",
        category: "electronics",
        description: "Product imported from external platform",
        inStock: true,
        platformId: selectedPlatform,
        sourceUrl: productUrl,
        importedAt: new Date().toISOString(),
      };

      setImportedProduct(imported);
      setModalOpen(true);
      setProductUrl("");
      setImporting(false);
    } catch (error) {
      console.error("Error importing product:", error);
      alert("Failed to import product. Please check the URL and try again.");
      setImporting(false);
    }
  };

  const handleBulkImport = async () => {
    if (!bulkUrls.trim()) {
      alert("Please enter product URLs");
      return;
    }

    if (!selectedPlatform) {
      alert("Please select a connected platform");
      return;
    }

    const urls = bulkUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) {
      alert("Please enter at least one valid URL");
      return;
    }

    setImporting(true);

    try {
      // In production, this would process all URLs
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert(`Successfully imported ${urls.length} products! Check "My Products" tab.`);
      setBulkUrls("");
      setImporting(false);
    } catch (error) {
      console.error("Error bulk importing:", error);
      alert("Failed to import products. Please try again.");
      setImporting(false);
    }
  };

  const detectPlatformFromUrl = (url) => {
    if (url.includes("daraz")) return "daraz";
    if (url.includes("alibaba")) return "alibaba";
    if (url.includes("aliexpress")) return "aliexpress";
    if (url.includes("amazon")) return "amazon";
    if (url.includes("ebay")) return "ebay";
    return null;
  };

  const handleUrlChange = (url) => {
    setProductUrl(url);
    const detected = detectPlatformFromUrl(url);
    if (detected) {
      const conn = connections.find((c) => c.platformId === detected);
      if (conn) {
        setSelectedPlatform(detected);
      }
    }
  };

  if (connections.length === 0) {
    return (
      <div className="text-center py-12">
        <Link2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium mb-2">No platforms connected</p>
        <p className="text-sm text-gray-500 mb-4">
          Connect to a platform first to import products
        </p>
        <Button
          onClick={() => {
            // Switch to platforms tab - in production, use router or state management
            window.location.hash = "platforms";
          }}
          className="bg-[#F36E16] hover:bg-[#e06212]"
        >
          Go to Platforms
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <Alert>
        <Link2 className="h-4 w-4" />
        <AlertDescription>
          Import products from connected platforms by pasting product URLs. Set your own pricing and profit margin after import.
        </AlertDescription>
      </Alert>

      {/* Platform Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Platform</CardTitle>
          <CardDescription>Choose which platform to import from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {connections.map((conn) => (
              <Button
                key={conn.id}
                variant={selectedPlatform === conn.platformId ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform(conn.platformId)}
                className={
                  selectedPlatform === conn.platformId
                    ? "bg-[#F36E16] hover:bg-[#e06212]"
                    : ""
                }
              >
                {conn.platformName}
                {selectedPlatform === conn.platformId && (
                  <CheckCircle2 className="h-3 w-3 ml-2" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Import Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Import Products</CardTitle>
          <CardDescription>Choose how you want to import products</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={importMethod} onValueChange={setImportMethod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">
                <Link2 className="h-4 w-4 mr-2" />
                Single URL
              </TabsTrigger>
              <TabsTrigger value="bulk">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="productUrl">Product URL</Label>
                <Input
                  id="productUrl"
                  placeholder="Paste product URL here (e.g., https://www.daraz.com/product/...)"
                  value={productUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Paste the full URL of the product page from the selected platform
                </p>
              </div>

              <Button
                onClick={handleImportFromUrl}
                disabled={!productUrl.trim() || !selectedPlatform || importing}
                className="w-full bg-[#F36E16] hover:bg-[#e06212]"
              >
                {importing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4 mr-2" />
                    Import Product
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="bulkUrls">Product URLs (one per line)</Label>
                <Textarea
                  id="bulkUrls"
                  placeholder="Paste multiple product URLs, one per line:&#10;https://www.daraz.com/product/1&#10;https://www.daraz.com/product/2&#10;https://www.daraz.com/product/3"
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Paste multiple product URLs, one per line. Up to 100 products at a time.
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {bulkUrls.split("\n").filter((url) => url.trim().length > 0).length} URLs detected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkUrls("")}
                >
                  Clear
                </Button>
              </div>

              <Button
                onClick={handleBulkImport}
                disabled={!bulkUrls.trim() || !selectedPlatform || importing}
                className="w-full bg-[#F36E16] hover:bg-[#e06212]"
              >
                {importing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing {bulkUrls.split("\n").filter((url) => url.trim().length > 0).length} products...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import All Products
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Import Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            Import Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Make sure the platform is connected before importing</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Use the full product page URL, not shortened links</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>After import, set your pricing and profit margin</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Bulk import supports up to 100 products at once</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      <AddDropshippingProductModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={importedProduct}
      />
    </div>
  );
}

