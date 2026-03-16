import React, {useMemo, useRef, useState} from "react";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {GenericButton} from "@common/components/blocks/GenericButton.tsx";
import {showToast} from "@common/components/blocks/ToastManager.tsx";
import {GenericFormTextarea} from "@common/components/forms/GenericFormTextArea.tsx";
import {GenericFormTextInput} from "@common/components/forms/GenericFormTextInput.tsx";
import {formatDate} from "@common/utils/DateFormatterUtils.ts";
import OcrClient from "@ocr/clients/OcrClient.ts";
import OcrService from "@ocr/services/OcrService.ts";
import {OcrInstruction} from "@ocr/types/OcrInstruction.ts";

interface OcrWorkspaceFormData {
  instructionTitle: string;
  instructionText: string;
}

const ocrWorkspaceSchema = z.object({
  instructionTitle: z.string(),
  instructionText: z.string().trim().min(1, "Instruction is required"),
});

const initialFormValues: OcrWorkspaceFormData = {
  instructionTitle: "",
  instructionText: "",
};

export function OcrWorkspaceSection() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedInstructionId, setSelectedInstructionId] = useState<string | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [lastRunResultId, setLastRunResultId] = useState<string | null>(null);

  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setValue,
    formState: {errors},
  } = useForm<OcrWorkspaceFormData>({
    mode: "onBlur",
    resolver: zodResolver(ocrWorkspaceSchema),
    defaultValues: initialFormValues,
  });

  const {data: instructions} = useQuery({
    queryKey: OcrService.QUERY_KEYS.GET_INSTRUCTIONS(),
    queryFn: async () => await OcrClient.getInstructions({
      page: {
        page: 0,
        size: 50,
        sort: [{property: "updatedDate", direction: "DESC"}],
      },
    }),
  });

  const sortedInstructions = useMemo(() => instructions?.content ?? [], [instructions]);

  const runOcrMutation = useMutation({
    mutationFn: async (formData: OcrWorkspaceFormData) => {
      if (!selectedFile) {
        throw new Error("Select a file before running OCR");
      }

      return await OcrClient.runOcr({
        provider: "OPEN_AI",
        instructionId: selectedInstructionId,
        instructionTitle: selectedInstructionId ? undefined : formData.instructionTitle.trim() || undefined,
        instructionText: selectedInstructionId ? undefined : formData.instructionText.trim(),
      }, selectedFile);
    },
    onSuccess: async (result) => {
      setLastRunResultId(result.uuid);
      showToast("success", "OCR finished and the result was stored");
      await queryClient.invalidateQueries({queryKey: OcrService.QUERY_KEYS.INVALIDATE_RESULTS()});
    },
    onError: (error) => {
      console.log(error);
      showToast("error", error instanceof Error ? error.message : "OCR processing failed");
    },
  });

  const saveInstructionMutation = useMutation({
    mutationFn: async () => {
      const {instructionTitle, instructionText} = getValues();

      if (!instructionTitle.trim()) {
        throw new Error("Instruction title is required to save");
      }
      if (!instructionText.trim()) {
        throw new Error("Instruction text is required to save");
      }

      return await OcrClient.createInstruction({
        title: instructionTitle.trim(),
        instructionText: instructionText.trim(),
      });
    },
    onSuccess: async (instruction) => {
      setSelectedInstructionId(instruction.uuid);
      showToast("success", "Instruction saved");
      await queryClient.invalidateQueries({queryKey: OcrService.QUERY_KEYS.INVALIDATE_INSTRUCTIONS()});
    },
    onError: (error) => {
      console.log(error);
      showToast("error", error instanceof Error ? error.message : "Could not save instruction");
    },
  });

  const deleteInstructionMutation = useMutation({
    mutationFn: async (instructionId: string) => await OcrClient.deleteInstruction(instructionId),
    onSuccess: async (_, instructionId) => {
      if (selectedInstructionId === instructionId) {
        setSelectedInstructionId(undefined);
      }
      showToast("success", "Instruction deleted");
      await queryClient.invalidateQueries({queryKey: OcrService.QUERY_KEYS.INVALIDATE_INSTRUCTIONS()});
    },
    onError: (error) => {
      console.log(error);
      showToast("error", "Could not delete instruction");
    },
  });

  const applyInstruction = (instruction: OcrInstruction) => {
    setSelectedInstructionId(instruction.uuid);
    setValue("instructionTitle", instruction.title, {shouldDirty: true});
    setValue("instructionText", instruction.instructionText, {shouldDirty: true, shouldValidate: true});
  };

  const clearCurrentInstruction = () => {
    setSelectedInstructionId(undefined);
    reset(initialFormValues);
  };

  const onSubmit: SubmitHandler<OcrWorkspaceFormData> = async (formData) => {
    await runOcrMutation.mutateAsync(formData);
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-gray-900">Run OCR</h3>
          <p className="text-sm text-gray-500">Upload a file, choose or write an instruction, and send it to the OCR provider.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900">Uploaded file</div>
            <button
              type="button"
              className="flex min-h-32 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition hover:border-primary-400 hover:bg-primary-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-sm font-medium text-gray-900">
                {selectedFile ? selectedFile.name : "Choose a file for OCR"}
              </span>
              <span className="mt-1 text-xs text-gray-500">
                {selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : "Accepted validation is handled by the OCR provider on the backend."}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            />
          </div>

          <Controller
            name="instructionTitle"
            control={control}
            render={({field}) => (
              <GenericFormTextInput
                field={{
                  ...field,
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                    setSelectedInstructionId(undefined);
                    field.onChange(event);
                  },
                }}
                errors={errors}
                label="Instruction title"
                placeholder="Invoice totals extraction"
              />
            )}
          />

          <Controller
            name="instructionText"
            control={control}
            render={({field}) => (
              <GenericFormTextarea
                field={{
                  ...field,
                  onChange: (value: string) => {
                    setSelectedInstructionId(undefined);
                    field.onChange(value);
                  },
                }}
                errors={errors}
                label="Instruction"
                rows={10}
                placeholder="Describe what should be extracted from the uploaded file."
              />
            )}
          />

          <div className="flex flex-wrap gap-3">
            <GenericButton
              type="submit"
              text="Run OCR"
              isPending={runOcrMutation.isPending}
            />
            <GenericButton
              type="button"
              color="alternative"
              text="Save instruction"
              isPending={saveInstructionMutation.isPending}
              onClick={() => saveInstructionMutation.mutate()}
            />
            <GenericButton
              type="button"
              color="alternative"
              text="Clear"
              onClick={clearCurrentInstruction}
            />
          </div>

          {selectedInstructionId && (
            <p className="text-xs text-primary-700">Saved instruction selected. Editing title or text switches the run to ad hoc mode.</p>
          )}
          {lastRunResultId && (
            <p className="text-xs text-gray-500">Latest stored OCR result ID: {lastRunResultId}</p>
          )}
        </form>
      </section>

      <aside className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-5 space-y-1">
          <h3 className="text-lg font-semibold text-gray-900">Saved instructions</h3>
          <p className="text-sm text-gray-500">Reuse previously persisted OCR instructions without rewriting them.</p>
        </div>

        <div className="space-y-3">
          {sortedInstructions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
              No instructions saved yet.
            </div>
          ) : (
            sortedInstructions.map((instruction) => (
              <article
                key={instruction.uuid}
                className={`rounded-2xl border p-4 transition ${selectedInstructionId === instruction.uuid ? "border-primary-500 bg-primary-50" : "border-gray-200 bg-white"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-gray-900">{instruction.title}</h4>
                    <p className="mt-1 text-xs text-gray-500">Updated {formatDate(instruction.updatedDate)}</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-4 text-sm text-gray-600 whitespace-pre-wrap break-words">{instruction.instructionText}</p>
                <div className="mt-4 flex gap-2">
                  <GenericButton
                    size="xs"
                    text="Use"
                    onClick={() => applyInstruction(instruction)}
                  />
                  <GenericButton
                    size="xs"
                    color="alternative"
                    text="Delete"
                    isPending={deleteInstructionMutation.isPending && deleteInstructionMutation.variables === instruction.uuid}
                    onClick={() => deleteInstructionMutation.mutate(instruction.uuid)}
                  />
                </div>
              </article>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
