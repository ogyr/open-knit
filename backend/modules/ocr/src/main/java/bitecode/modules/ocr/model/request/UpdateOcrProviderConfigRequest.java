package bitecode.modules.ocr.model.request;

import bitecode.modules.ocr.model.enums.OcrProviderType;
import jakarta.validation.constraints.NotNull;

public record UpdateOcrProviderConfigRequest(
        @NotNull OcrProviderType provider,
        String apiKey
) {
}
