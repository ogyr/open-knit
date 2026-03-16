package bitecode.modules.ocr.model.data;

import bitecode.modules.ocr.model.enums.OcrProviderType;

import java.util.UUID;

public record OcrProviderConfigDetails(
        UUID uuid,
        OcrProviderType provider,
        String apiKey
) {
}
