import {OcrProviderType} from "@ocr/types/OcrProviderType.ts";

export interface UpdateOcrProviderConfigRequest {
  provider: OcrProviderType;
  apiKey: string;
}
