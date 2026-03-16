class OcrService {
  public QUERY_KEYS = {
    GET_INSTRUCTIONS: () => ["ocr-instructions"] as const,
    GET_RESULTS: (currentPage: number, pageSize: number) => ["ocr-results", currentPage, pageSize] as const,
    GET_PROVIDER_CONFIG: (provider: string) => ["ocr-provider-config", provider] as const,
    INVALIDATE_INSTRUCTIONS: () => ["ocr-instructions"] as const,
    INVALIDATE_RESULTS: () => ["ocr-results"] as const,
    INVALIDATE_PROVIDER_CONFIG: () => ["ocr-provider-config"] as const,
  };
}

export default new OcrService();
