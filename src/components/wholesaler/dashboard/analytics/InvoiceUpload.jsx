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
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          Invoice Upload (Tax Purpose)
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm mt-1">
          Upload invoices for accounting and tax reporting. Essential for tax declaration and providing supporting documents for purchases and sales.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center transition-colors ${
            dragActive
              ? "border-[#F36E16] bg-orange-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Upload Invoices</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            Drag and drop your invoice files here, or click to browse
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Label htmlFor="invoice-upload" className="cursor-pointer">
              <Button
                type="button"
                className="bg-[#F36E16] hover:bg-[#e06212] text-xs sm:text-sm"
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
            <p className="text-xs text-gray-500 text-center sm:text-left">
              Supported formats: PDF, JPG, PNG, DOC, DOCX
            </p>
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs sm:text-sm text-blue-900">
            <p className="font-semibold mb-1">Why upload invoices?</p>
            <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 text-blue-800">
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
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Uploaded Invoices</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto scrollbar-hide">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">File Name</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Type</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                      <TableHead className="text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadedFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{file.fileName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant={
                              file.type === "Purchase" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {file.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs sm:text-sm">{file.date}</TableCell>
                        <TableCell className="text-xs sm:text-sm">${file.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              file.status === "Verified"
                                ? "default"
                                : "outline"
                            }
                            className={`text-xs ${
                              file.status === "Verified"
                                ? "bg-green-100 text-green-800"
                                : ""
                            }`}
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
                            className="text-red-600 hover:text-red-700 h-7 w-7 sm:h-8 sm:w-8 p-0"
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {uploadedFiles.length === 0 && (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
            <p className="text-sm sm:text-base">No invoices uploaded yet</p>
            <p className="text-xs sm:text-sm mt-1">
              Upload your first invoice to get started
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

