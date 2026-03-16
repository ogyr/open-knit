import React, {useMemo, useState} from "react";
import {Checkbox, DropdownItem} from "flowbite-react";
import {ColumnDef} from "@tanstack/react-table";
import {useQuery} from "@tanstack/react-query";
import {ActionsDropdown} from "@common/components/blocks/ActionsDropdown.tsx";
import {ColoredLabel} from "@common/components/elements/ColoredLabel.tsx";
import GenericTable, {useGenericTablePagination} from "@common/components/tables/GenericTable.tsx";
import GenericTableClipboardCopy from "@common/components/tables/elements/GenericTableClipboardCopy.tsx";
import {formatDate} from "@common/utils/DateFormatterUtils.ts";
import {enumToReadableText} from "@common/utils/EnumUtils.ts";
import OcrClient from "@ocr/clients/OcrClient.ts";
import {OcrResultDetailsSidePanel} from "@ocr/components/OcrResultDetailsSidePanel.tsx";
import OcrService from "@ocr/services/OcrService.ts";
import {OcrResult} from "@ocr/types/OcrResult.ts";

export function OcrHistorySection() {
  const tablePagination = useGenericTablePagination();
  const [currentPage] = tablePagination.currentPageState;
  const [pageSize] = tablePagination.pageSizeState;
  const [showDetails, setShowDetails] = useState(false);
  const [selectedResult, setSelectedResult] = useState<OcrResult | null>(null);

  const {data: results} = useQuery({
    queryKey: OcrService.QUERY_KEYS.GET_RESULTS(currentPage, pageSize),
    queryFn: async () => await OcrClient.getAdminResults({
      page: {
        page: currentPage - 1,
        size: pageSize,
        sort: [{property: "createdDate", direction: "DESC"}],
      },
    }),
  });

  const columns = useMemo<ColumnDef<OcrResult>[]>(() => [
    {
      id: "selection",
      header: ({table}) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({row}) => (
        <div onClick={(event) => event.stopPropagation()}>
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        </div>
      ),
    },
    {
      header: "Filename",
      accessorFn: (row) => row.filename,
      cell: ({getValue}) => <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{getValue<string>()}</span>,
    },
    {
      header: "User ID",
      accessorFn: (row) => row.userId,
      cell: ({getValue}) => <GenericTableClipboardCopy value={getValue<string>()}/>,
    },
    {
      header: "Provider",
      accessorFn: (row) => row.provider,
      cell: ({getValue}) => <ColoredLabel>{enumToReadableText(getValue<string>())}</ColoredLabel>,
    },
    {
      header: "Status",
      accessorFn: (row) => row.status,
      cell: ({getValue}) => <ColoredLabel>{enumToReadableText(getValue<string>())}</ColoredLabel>,
    },
    {
      header: "Created",
      accessorFn: (row) => row.createdDate,
      cell: ({getValue}) => <span className="text-sm text-gray-700 whitespace-nowrap">{formatDate(getValue<string>())}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({row}) => (
        <ActionsDropdown>
          <DropdownItem onClick={() => {
            setSelectedResult(row.original);
            setShowDetails(true);
          }}>
            Details
          </DropdownItem>
        </ActionsDropdown>
      ),
    },
  ], []);

  return (
    <>
      <GenericTable
        columns={columns}
        data={results}
        exportFilename="OcrHistory"
        csvExportKeys={["filename", "userId", "provider", "status", "createdDate"]}
        headerSection="Past OCR results"
        onRowClick={(row) => {
          setSelectedResult(row);
          setShowDetails(true);
        }}
        {...tablePagination}
      />

      <OcrResultDetailsSidePanel
        showState={[showDetails, setShowDetails]}
        selectedResult={selectedResult}
      />
    </>
  );
}
