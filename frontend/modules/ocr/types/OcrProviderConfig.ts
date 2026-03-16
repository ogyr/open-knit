import {OcrProviderType} from "@ocr/types/OcrProviderType.ts";

export interface OcrProviderConfig {
  uuid: string;
  provider: OcrProviderType;
  apiKey: string | null;
}
