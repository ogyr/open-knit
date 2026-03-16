import {OcrProviderType} from "@ocr/types/OcrProviderType.ts";
import {OcrResultStatus} from "@ocr/types/OcrResultStatus.ts";

export interface OcrResult {
  uuid: string;
  userId: string;
  provider: OcrProviderType;
  filename: string;
  instructionTitle: string | null;
  instructionTextSnapshot: string;
  status: OcrResultStatus;
  resultText: string | null;
  errorMessage: string | null;
  createdDate: string;
}
