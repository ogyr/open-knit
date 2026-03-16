import React from "react";
import {AdminLayoutModuleConfig} from "@common/_scaffolder/AdminLayoutModuleConfig.ts";
import PrinterIcon from "@common/assets/dashboard/printer-icon.svg?react";
import {OcrConfigurationPage} from "@ocr/pages/OcrConfigurationPage.tsx";

const breadcrumbsLabels: Record<string, string> = {
  ocrsettings: "OCR",
};

const routes = [
  {path: "ocrsettings", element: <OcrConfigurationPage/>},
  {path: "ocrsettings/history", element: <OcrConfigurationPage/>},
  {path: "ocrsettings/settings", element: <OcrConfigurationPage/>},
];

const sidebarItems = [
  {path: "admin/ocrsettings", icon: PrinterIcon, children: "OCR"},
] as AdminLayoutModuleConfig["sidebarItems"];

export const ocrAdminLayoutConfig: AdminLayoutModuleConfig = {
  breadcrumbsLabels,
  routes,
  sidebarItems,
};
