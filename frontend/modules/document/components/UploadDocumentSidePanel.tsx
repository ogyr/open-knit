import React, {Dispatch, SetStateAction} from "react";
import GenericSideModal from "@common/components/modals/GenericSideModal.tsx";
import {z} from "zod";
import {useController, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ExistingFile, GenericFormMultiFileInput} from "@common/components/forms/GenericFormMultiFileInput.tsx";
import {GenericButton} from "@common/components/blocks/GenericButton.tsx";
import PlusIcon from "@common/assets/common/plus-icon.svg?react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import DocumentService from "@document/services/DocumentService.ts";
import {showToast} from "@common/components/blocks/ToastManager.tsx";
import type {Document as UploadedDocument} from "@document/types/model/Document.ts";

export interface UploadDocumentSidePanelProps {
    showState: [boolean, Dispatch<SetStateAction<boolean>>];
    isAdmin: boolean;
}

interface UploadDocumentsFormData {
    existingFiles: ExistingFile[];
    newFiles: File[];
}

const uploadDocumentsSchema: z.ZodType<UploadDocumentsFormData> = z.object({
    existingFiles: z.array(z.object({
        id: z.string(),
        name: z.string(),
        sizeBytes: z.number(),
    })),
    newFiles: z.array(z.instanceof(File)).min(1, "Add at least one document"),
});

export function UploadDocumentSidePanel({showState, isAdmin}: UploadDocumentSidePanelProps) {
    const queryClient = useQueryClient();
    const [, setIsOpen] = showState;

    const {
        control,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<UploadDocumentsFormData>({
        mode: "onBlur",
        resolver: zodResolver(uploadDocumentsSchema),
        defaultValues: {
            existingFiles: [],
            newFiles: [],
        }
    });

    const existingFilesField = useController({name: "existingFiles", control}).field;
    const newFilesField = useController({name: "newFiles", control}).field;

    const {mutate, isPending, isSuccess} = useMutation<UploadedDocument[], unknown, File[]>({
        mutationFn: (files: File[]) => DocumentService.uploadDocuments(files, isAdmin),
        onSuccess: async (uploadedDocuments) => {
            showToast("success", `${uploadedDocuments.length} document${uploadedDocuments.length === 1 ? "" : "s"} uploaded`);
            await queryClient.invalidateQueries({queryKey: DocumentService.QUERY_KEYS.INVALIDATE_DOCUMENTS(isAdmin)});
            handleClose();
        },
        onError: () => {
            showToast("error", "Failed to upload documents");
        }
    });

    const handleClose = () => {
        setIsOpen(false);
        reset({
            existingFiles: [],
            newFiles: [],
        });
    };

    const onSubmit = ({newFiles}: UploadDocumentsFormData) => {
        mutate(newFiles);
    };

    return (
        <GenericSideModal headerText="Upload document" showState={showState} onClose={handleClose}>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <GenericFormMultiFileInput
                    label="Documents"
                    tooltip="Upload one or more documents. PDF files open in a new tab when downloaded."
                    existingFilesField={existingFilesField}
                    newFilesField={newFilesField}
                    errors={errors}
                    addButtonText="Add file"
                    emptyStateText="Drag documents here or use the button below"
                    accept=".pdf,.doc,.docx,.txt,.csv,.png,.jpg,.jpeg,.webp"
                />

                <GenericButton
                    type="submit"
                    className="w-full"
                    text="Upload documents"
                    icon={PlusIcon}
                    isPending={isPending}
                    isSuccess={isSuccess}
                />
                <GenericButton
                    color="alternative"
                    className="w-full"
                    text="Go back"
                    onClick={handleClose}
                />
            </form>
        </GenericSideModal>
    );
}
