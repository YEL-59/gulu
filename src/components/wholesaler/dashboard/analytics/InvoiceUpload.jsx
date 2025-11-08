"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function InvoiceUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 1,
      fileName: "invoice_jan_2024.pdf",
      type: "Purchase",
      date: "2024-01-15",
      amount: 5000,
      status: "Verified",
    },
    {
      id: 2,
      fileName: "invoice_feb_2024.pdf",
      type: "Sale",
      date: "2024-02-20",
      amount: 7500,
      status: "Pending",
    },
  ]);

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    // In a real app, this would upload to the server
    Array.from(files).forEach((file) => {
      const newFile = {
        id: Date.now(),
        fileName: file.name,
        type: "Purchase", // Default, can be changed
        date: new Date().toISOString().split("T")[0],
        amount: 0,
        status: "Pending",
      };
      setUploadedFiles((prev) => [...prev, newFile]);
    });
  };

  const handleDelete = (id) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Invoice Upload (Tax Purpose)
        </CardTitle>
        <CardDescription>
          Upload invoices for accounting and tax reporting. Essential for tax declaration and providing supporting documents for purchases and sales.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-[#F36E16] bg-orange-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Upload Invoices</h3>
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop your invoice files here, or click to browse
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Label htmlFor="invoice-upload" className="cursor-pointer">
              <Button
                type="button"
                className="bg-[#F36E16] hover:bg-[#e06212]"
                asChild
              >
                <span>Select Files</span>
              </Button>
              <Input
                id="invoice-upload"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
                onChange={handleFileInput}
              />
            </Label>
            <p className="text-xs text-gray-500">
              Supported formats: PDF, JPG, PNG, DOC, DOCX
            </p>
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Why upload invoices?</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Required for tax declaration and reporting</li>
              <li>Provides supporting documents for purchases and sales</li>
              <li>Essential for accounting and financial records</li>
              <li>Helps with audit compliance</li>
            </ul>
          </div>
        </div>

        {/* Uploaded Files Table */}
        {uploadedFiles.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Uploaded Invoices</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadedFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          {file.fileName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            file.type === "Purchase" ? "default" : "secondary"
                          }
                        >
                          {file.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{file.date}</TableCell>
                      <TableCell>${file.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            file.status === "Verified"
                              ? "default"
                              : "outline"
                          }
                          className={
                            file.status === "Verified"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {file.status === "Verified" && (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                          )}
                          {file.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(file.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {uploadedFiles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No invoices uploaded yet</p>
            <p className="text-sm mt-1">
              Upload your first invoice to get started
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

