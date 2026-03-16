import React from "react";
import {AdminLayoutModuleConfig} from "@common/_scaffolder/AdminLayoutModuleConfig.ts";
import {DocumentsPage} from "@document/pages/DocumentsPage.tsx";
import {DocumentDetailsPage} from "@document/pages/DocumentDetailsPage.tsx";
import BookIcon from "@common/assets/dashboard/book-icon.svg?react";

const breadcrumbsLabels: Record<string, string> = {
    documents: "Documents",
};

const routes = [
    {path: "documents", element: <DocumentsPage/>},
    {path: "documents/:id", element: <DocumentDetailsPage/>},
];

const sidebarItems = [
    {path: "admin/documents", icon: BookIcon, children: "Documents"},
] as AdminLayoutModuleConfig["sidebarItems"];

export const documentsAdminLayoutConfig: AdminLayoutModuleConfig = {
    breadcrumbsLabels,
    routes,
    sidebarItems,
};
