import {OcrProviderType} from "@ocr/types/OcrProviderType.ts";

export interface RunOcrRequest {
  instructionId?: string;
  instructionText?: string;
  instructionTitle?: string;
  provider: OcrProviderType;
}
