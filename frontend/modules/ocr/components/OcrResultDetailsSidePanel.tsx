import React from "react";
import GenericSideModal from "@common/components/modals/GenericSideModal.tsx";
import {ColoredLabel} from "@common/components/elements/ColoredLabel.tsx";
import {formatDate} from "@common/utils/DateFormatterUtils.ts";
import {enumToReadableText} from "@common/utils/EnumUtils.ts";
import {OcrResult} from "@ocr/types/OcrResult.ts";

interface OcrResultDetailsSidePanelProps {
  showState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  selectedResult: OcrResult | null;
}

const Section = ({title, children}: { title: string; children: React.ReactNode }) => {
  return (
    <section className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      {children}
    </section>
  );
};

const TextBlock = ({value, emptyText = "-"}: { value?: string | null; emptyText?: string }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 whitespace-pre-wrap break-words">
      {value?.trim() ? value : emptyText}
    </div>
  );
};

export function OcrResultDetailsSidePanel({showState, selectedResult}: OcrResultDetailsSidePanelProps) {
  return (
    <GenericSideModal headerText="OCR result details" showState={showState}>
      {!selectedResult ? (
        <p className="text-sm text-gray-500">Select an OCR result to inspect its details.</p>
      ) : (
        <div className="space-y-5">
          <Section title="File details">
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-gray-500">Filename</dt>
                <dd className="font-medium text-gray-900">{selectedResult.filename}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Provider</dt>
                <dd className="font-medium text-gray-900">{enumToReadableText(selectedResult.provider)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Status</dt>
                <dd><ColoredLabel>{enumToReadableText(selectedResult.status)}</ColoredLabel></dd>
              </div>
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="font-medium text-gray-900">{formatDate(selectedResult.createdDate)}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-gray-500">User ID</dt>
                <dd className="font-medium text-gray-900 break-all">{selectedResult.userId}</dd>
              </div>
            </dl>
          </Section>

          <Section title="OCR input">
            <div className="space-y-3">
              <div>
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Instruction title</div>
                <TextBlock value={selectedResult.instructionTitle}/>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Instruction text</div>
                <TextBlock value={selectedResult.instructionTextSnapshot}/>
              </div>
            </div>
          </Section>

          <Section title="OCR output">
            <div className="space-y-3">
              <div>
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Extracted text</div>
                <TextBlock value={selectedResult.resultText}/>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Error message</div>
                <TextBlock value={selectedResult.errorMessage}/>
              </div>
            </div>
          </Section>
        </div>
      )}
    </GenericSideModal>
  );
}
