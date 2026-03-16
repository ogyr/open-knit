import React, {useMemo, useState} from "react";
import {Checkbox, DropdownItem} from "flowbite-react";
import {ColumnDef} from "@tanstack/react-table";
import {useQuery} from "@tanstack/react-query";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "@identity/auth/contexts/AuthContext.tsx";
import GenericTable, {useGenericTablePagination} from "@common/components/tables/GenericTable.tsx";
import {ActionsDropdown} from "@common/components/blocks/ActionsDropdown.tsx";
import {GenericButton} from "@common/components/blocks/GenericButton.tsx";
import PlusIcon from "@common/assets/common/plus-icon.svg?react";
import {ColoredLabel} from "@common/components/elements/ColoredLabel.tsx";
import {formatDate} from "@common/utils/DateFormatterUtils.ts";
import {MobileRowTemplate} from "@common/components/tables/types/MobileRowTemplate.ts";
import GenericTableClipboardCopy from "@common/components/tables/elements/GenericTableClipboardCopy.tsx";
import {enumToReadableText} from "@common/utils/EnumUtils.ts";
import {UploadDocumentSidePanel} from "@document/components/UploadDocumentSidePanel.tsx";
import DocumentService from "@document/services/DocumentService.ts";
import {Document} from "@document/types/model/Document.ts";
import {formatFileSize} from "@document/utils/formatFileSize.ts";

export function DocumentsTable() {
    const navigate = useNavigate();
    const {user} = useAuth();
    const isAdmin = user?.roles.includes("ROLE_ADMIN") === true;
    const tablePagination = useGenericTablePagination();
    const [currentPage] = tablePagination.currentPageState;
    const [pageSize] = tablePagination.pageSizeState;
    const [showUploadModal, setShowUploadModal] = useState(false);

    const detailsBasePath = isAdmin ? "/admin/documents" : "/documents";

    const columns = useMemo<ColumnDef<Document>[]>(() => {
        const baseColumns: ColumnDef<Document>[] = [
            {
                id: "selection",
                header: ({table}) => (
                    <Checkbox
                        {...{
                            checked: table.getIsAllPageRowsSelected(),
                            indeterminate: table.getIsSomePageRowsSelected(),
                            onChange: table.getToggleAllPageRowsSelectedHandler(),
                        }}
                    />
                ),
                cell: ({row}) => (
                    <Checkbox
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                ),
            },
            {
                id: "filename",
                header: "Filename",
                accessorKey: "filename",
                cell: ({getValue}) => (
                    <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{getValue() as string}</span>
                ),
            },
        ];

        if (isAdmin) {
            baseColumns.push({
                id: "userId",
                header: "User ID",
                accessorKey: "userId",
                cell: ({getValue}) => <GenericTableClipboardCopy value={getValue() as string}/>
            });
        }

        baseColumns.push(
            {
                id: "fileType",
                header: "Type",
                accessorKey: "fileType",
                cell: ({getValue}) => (
                    <ColoredLabel>{(getValue() as string) || "-"}</ColoredLabel>
                ),
            },
            {
                id: "fileSize",
                header: "Size",
                accessorKey: "fileSize",
                cell: ({getValue}) => (
                    <span className="text-sm text-gray-700 whitespace-nowrap">{formatFileSize(getValue() as number)}</span>
                ),
            },
            {
                id: "storageType",
                header: "Storage",
                accessorKey: "storageType",
                cell: ({getValue}) => (
                    <ColoredLabel>{enumToReadableText(getValue() as string, "-")}</ColoredLabel>
                ),
            },
            {
                id: "createdDate",
                header: "Created",
                accessorKey: "createdDate",
                cell: ({getValue}) => (
                    <span className="text-sm text-gray-700 whitespace-nowrap">{formatDate(getValue() as string)}</span>
                ),
            },
            {
                id: "actions",
                header: "Actions",
                accessorKey: "uuid",
                cell: ({getValue}) => {
                    const documentId = getValue() as string;
                    return (
                        <ActionsDropdown>
                            <Link to={`${detailsBasePath}/${documentId}`}>
                                <DropdownItem>Details</DropdownItem>
                            </Link>
                        </ActionsDropdown>
                    );
                },
            }
        );

        return baseColumns;
    }, [detailsBasePath, isAdmin]);

    const mobileRowTemplate: MobileRowTemplate<"default"> = {
        version: "default",
        config: {
            header: {
                headerColumnId: "filename",
                rightColumnId: "storageType",
            },
            cellsColumnIds: isAdmin ? ["userId", "fileSize", "createdDate"] : ["fileType", "fileSize", "createdDate"]
        }
    };

    const {data} = useQuery({
        queryKey: DocumentService.QUERY_KEYS.GET_DOCUMENTS(isAdmin, currentPage, pageSize),
        queryFn: async () => await DocumentService.getDocuments({
            page: {
                page: currentPage - 1,
                size: pageSize,
                sort: [{property: "createdDate", direction: "DESC"}]
            }
        }, isAdmin)
    });

    return (
        <div>
            <GenericTable
                columns={columns}
                data={data}
                mobileRowTemplate={mobileRowTemplate}
                exportFilename="Documents"
                csvExportKeys={isAdmin
                    ? ["filename", "userId", "fileType", "fileSize", "storageType", "createdDate"]
                    : ["filename", "fileType", "fileSize", "storageType", "createdDate"]}
                headerSection={
                    <div className="flex justify-between gap-3">
                        <h5 className="text-gray-900 text-xl font-semibold">Documents</h5>
                        <GenericButton color="alternative" onClick={() => setShowUploadModal(true)}>
                            <div className="flex items-center gap-1">
                                <PlusIcon/>
                                Upload document
                            </div>
                        </GenericButton>
                    </div>
                }
                onRowClick={(documentRow) => navigate(`${detailsBasePath}/${documentRow.uuid}`)}
                {...tablePagination}
            />

            <UploadDocumentSidePanel showState={[showUploadModal, setShowUploadModal]} isAdmin={isAdmin}/>
        </div>
    );
}
