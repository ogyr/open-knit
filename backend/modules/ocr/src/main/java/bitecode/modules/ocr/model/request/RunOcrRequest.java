package bitecode.modules.ocr.model.request;

import bitecode.modules.ocr.model.enums.OcrProviderType;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RunOcrRequest(
        UUID instructionId,
        String instructionText,
        String instructionTitle,
        @NotNull OcrProviderType provider
) {
}
