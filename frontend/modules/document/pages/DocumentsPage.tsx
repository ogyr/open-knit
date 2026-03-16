import React from "react";
import {DocumentsTable} from "@document/components/DocumentsTable.tsx";

export function DocumentsPage() {
    return (
        <div className="flex flex-col gap-4">
            <DocumentsTable/>
        </div>
    );
}
