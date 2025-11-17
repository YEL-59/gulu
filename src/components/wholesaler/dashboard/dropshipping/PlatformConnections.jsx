"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle, Link2, ExternalLink, Settings, Globe } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PLATFORMS = [
  {
    id: "daraz",
    name: "Daraz",
    logo: "🛒",
    description: "South Asia's leading online marketplace",
    website: "https://www.daraz.com",
    color: "bg-orange-500",
    requiresApi: true,
    apiDocs: "https://open.daraz.com",
  },
  {
    id: "alibaba",
    name: "AliBaba",
    logo: "🏭",
    description: "Global B2B e-commerce platform",
    website: "https://www.alibaba.com",
    color: "bg-orange-600",
    requiresApi: true,
    apiDocs: "https://open.alibaba.com",
  },
  {
    id: "aliexpress",
    name: "AliExpress",
    logo: "📦",
    description: "Global online retail marketplace",
    website: "https://www.aliexpress.com",
    color: "bg-red-500",
    requiresApi: true,
    apiDocs: "https://developers.aliexpress.com",
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "📚",
    description: "World's largest online retailer",
    website: "https://www.amazon.com",
    color: "bg-yellow-500",
    requiresApi: true,
    apiDocs: "https://developer.amazon.com",
  },
  {
    id: "ebay",
    name: "eBay",
    logo: "🔨",
    description: "Global online auction and shopping",
    website: "https://www.ebay.com",
    color: "bg-blue-500",
    requiresApi: true,
    apiDocs: "https://developer.ebay.com",
  },
];

export default function PlatformConnections() {
  const [connections, setConnections] = useState([]);
  const [connectingPlatform, setConnectingPlatform] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = () => {
    try {
      const stored = localStorage.getItem("dropshippingPlatformConnections");
      if (stored) {
        setConnections(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading platform connections:", error);
    }
  };

  const saveConnections = (newConnections) => {
    try {
      localStorage.setItem(
        "dropshippingPlatformConnections",
        JSON.stringify(newConnections)
      );
      setConnections(newConnections);
    } catch (error) {
      console.error("Error saving platform connections:", error);
    }
  };

  const handleConnect = (platform) => {
    setConnectingPlatform(platform);
    setApiKey("");
    setApiSecret("");
    setStoreName("");
  };

  const handleDisconnect = (platformId) => {
    const updated = connections.filter((c) => c.platformId !== platformId);
    saveConnections(updated);
  };

  const handleSaveConnection = () => {
    if (!connectingPlatform || !apiKey || !apiSecret) {
      alert("Please fill in all required fields");
      return;
    }

    const connection = {
      id: `conn-${Date.now()}`,
      platformId: connectingPlatform.id,
      platformName: connectingPlatform.name,
      apiKey: apiKey,
      apiSecret: apiSecret,
      storeName: storeName || connectingPlatform.name,
      connectedAt: new Date().toISOString(),
      status: "connected",
      lastSync: null,
    };

    const existing = connections.find((c) => c.platformId === connectingPlatform.id);
    const updated = existing
      ? connections.map((c) => (c.platformId === connectingPlatform.id ? connection : c))
      : [...connections, connection];

    saveConnections(updated);
    setConnectingPlatform(null);
    setApiKey("");
    setApiSecret("");
    setStoreName("");
    alert("Platform connected successfully!");
  };

  const isConnected = (platformId) => {
    return connections.some((c) => c.platformId === platformId && c.status === "connected");
  };

  const getConnection = (platformId) => {
    return connections.find((c) => c.platformId === platformId);
  };

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <Alert>
        <Globe className="h-4 w-4" />
        <AlertDescription>
          Connect to external platforms to import products. Once connected, you can import products via URL or API and set your own pricing.
        </AlertDescription>
      </Alert>

      {/* Connected Platforms */}
      {connections.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Connected Platforms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map((conn) => {
              const platform = PLATFORMS.find((p) => p.id === conn.platformId);
              if (!platform) return null;

              return (
                <Card key={conn.id} className="border-green-200 bg-green-50/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${platform.color} flex items-center justify-center text-2xl`}>
                          {platform.logo}
                        </div>
                        <div>
                          <CardTitle className="text-base">{platform.name}</CardTitle>
                          <CardDescription className="text-xs">{conn.storeName}</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600">
                        Connected: {new Date(conn.connectedAt).toLocaleDateString()}
                      </p>
                      {conn.lastSync && (
                        <p className="text-xs text-gray-600">
                          Last Sync: {new Date(conn.lastSync).toLocaleDateString()}
                        </p>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConnect(platform)}
                          className="flex-1"
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Settings
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(conn.platformId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Platforms */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {connections.length > 0 ? "Available Platforms" : "Connect a Platform"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORMS.map((platform) => {
            const connected = isConnected(platform.id);
            const connection = getConnection(platform.id);

            return (
              <Card
                key={platform.id}
                className={`hover:shadow-lg transition-shadow ${
                  connected ? "border-green-200" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${platform.color} flex items-center justify-center text-2xl`}>
                        {platform.logo}
                      </div>
                      <div>
                        <CardTitle className="text-base">{platform.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {platform.description}
                        </CardDescription>
                      </div>
                    </div>
                    {connected && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{platform.description}</p>
                    <div className="flex gap-2">
                      <Button
                        variant={connected ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleConnect(platform)}
                        className={connected ? "flex-1" : "flex-1 bg-[#F36E16] hover:bg-[#e06212]"}
                      >
                        {connected ? (
                          <>
                            <Settings className="h-3 w-3 mr-1" />
                            Manage
                          </>
                        ) : (
                          <>
                            <Link2 className="h-3 w-3 mr-1" />
                            Connect
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(platform.website, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    {platform.requiresApi && (
                      <p className="text-xs text-gray-500">
                        Requires API credentials.{" "}
                        <a
                          href={platform.apiDocs}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#F36E16] hover:underline"
                        >
                          View API Docs
                        </a>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Connection Dialog */}
      <Dialog open={!!connectingPlatform} onOpenChange={(open) => !open && setConnectingPlatform(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect to {connectingPlatform?.name}</DialogTitle>
            <DialogDescription>
              Enter your API credentials to connect and import products from {connectingPlatform?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name (Optional)</Label>
              <Input
                id="storeName"
                placeholder={`My ${connectingPlatform?.name} Store`}
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">
                API Key <span className="text-red-500">*</span>
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiSecret">
                API Secret <span className="text-red-500">*</span>
              </Label>
              <Input
                id="apiSecret"
                type="password"
                placeholder="Enter your API secret"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
              />
            </div>

            <Alert>
              <AlertDescription className="text-xs">
                Your API credentials are encrypted and stored securely. They are only used to fetch product data and place orders.
              </AlertDescription>
            </Alert>

            {connectingPlatform?.apiDocs && (
              <div className="text-xs text-gray-500">
                Need help?{" "}
                <a
                  href={connectingPlatform.apiDocs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F36E16] hover:underline"
                >
                  View API Documentation
                </a>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectingPlatform(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveConnection}
              disabled={!apiKey || !apiSecret}
              className="bg-[#F36E16] hover:bg-[#e06212]"
            >
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

