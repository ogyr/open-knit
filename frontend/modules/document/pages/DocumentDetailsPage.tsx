import React, {useState} from "react";
import {Label} from "flowbite-react";
import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useAuth} from "@identity/auth/contexts/AuthContext.tsx";
import {GenericButton} from "@common/components/blocks/GenericButton.tsx";
import {showToast} from "@common/components/blocks/ToastManager.tsx";
import {formatDate} from "@common/utils/DateFormatterUtils.ts";
import {ColoredLabel} from "@common/components/elements/ColoredLabel.tsx";
import {enumToReadableText} from "@common/utils/EnumUtils.ts";
import DocumentService from "@document/services/DocumentService.ts";
import {formatFileSize} from "@document/utils/formatFileSize.ts";
import {downloadDocumentResponse} from "@document/utils/documentDownload.ts";
import {DoubleButtonActionModal} from "@common/components/modals/DoubleButtonActionModal.tsx";

function LabeledField({label, children, value}: { label: string; children?: React.ReactNode; value?: string }) {
    return (
        <div className="flex flex-col gap-y-0.5">
            <Label>{label}</Label>
            {children ?? <div className="text-gray-500 text-sm break-all">{value ?? "-"}</div>}
        </div>
    );
}

export function DocumentDetailsPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {user} = useAuth();
    const isAdmin = user?.roles.includes("ROLE_ADMIN") === true;
    const listPath = isAdmin ? "/admin/documents" : "/documents";
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const {data: documentDetails} = useQuery({
        queryKey: DocumentService.QUERY_KEYS.GET_DOCUMENT(isAdmin, id ?? ""),
        queryFn: async () => await DocumentService.getDocument(id!, isAdmin),
        enabled: !!id,
    });

    const {mutate: deleteDocument, isPending: isDeleting} = useMutation({
        mutationFn: async () => await DocumentService.deleteDocument(id!, isAdmin),
        onSuccess: async (result) => {
            if (result.error) {
                showToast("error", "Failed to delete document");
                return;
            }

            showToast("success", "Document deleted");
            await queryClient.invalidateQueries({queryKey: DocumentService.QUERY_KEYS.INVALIDATE_DOCUMENTS(isAdmin)});
            navigate(listPath);
        },
        onError: () => {
            showToast("error", "Failed to delete document");
        }
    });

    const {mutate: downloadDocument, isPending: isDownloading} = useMutation({
        mutationFn: async () => await DocumentService.downloadDocument(id!, isAdmin),
        onSuccess: (response) => {
            downloadDocumentResponse(response, documentDetails?.filename ?? "document");
        },
        onError: () => {
            showToast("error", "Failed to download document");
        }
    });

    return (
        <div className="flex flex-col gap-y-6">
            <div>
                <h2 className="text-xl font-semibold">Document details</h2>
                <p className="text-sm text-gray-500">Review metadata, download the file, or delete the document.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <LabeledField label="Document ID" value={documentDetails?.uuid}/>
                <LabeledField label="User ID" value={documentDetails?.userId}/>
                <LabeledField label="Filename" value={documentDetails?.filename}/>
                <LabeledField label="Checksum" value={documentDetails?.checksum}/>
                <LabeledField label="Created date" value={formatDate(documentDetails?.createdDate)}/>
                <LabeledField label="File size" value={formatFileSize(documentDetails?.fileSize)}/>
                <LabeledField label="File type" value={documentDetails?.fileType || "-"}/>
                <LabeledField label="Storage type">
                    <ColoredLabel>{enumToReadableText(documentDetails?.storageType, "-")}</ColoredLabel>
                </LabeledField>
            </div>

            <div className="flex flex-col-reverse gap-2 pt-2 md:flex-row md:justify-end">
                <GenericButton color="red" outline spinnerColor="black" text="Delete document" isPending={isDeleting} onClick={() => setShowDeleteModal(true)}/>
                <GenericButton color="alternative" text="Download" isPending={isDownloading} onClick={() => downloadDocument()}/>
            </div>

            <DoubleButtonActionModal headerText="Delete document?"
                                     message="This action cannot be undone. The document file and its metadata will be permanently deleted."
                                     showModal={showDeleteModal}
                                     setShowModal={setShowDeleteModal}
                                     actionButtonText="Delete document"
                                     actionButtonColor="red"
                                     cancelButtonColor="light"
                                     onCancel={() => setShowDeleteModal(false)}
                                     onClose={() => setShowDeleteModal(false)}
                                     onAction={() => deleteDocument()}/>
        </div>
    );
}
