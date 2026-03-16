package bitecode.modules.ocr.model.data;

import bitecode.modules.ocr.model.enums.OcrProviderType;
import bitecode.modules.ocr.model.enums.OcrResultStatus;

import java.time.Instant;
import java.util.UUID;

public record OcrResultDetails(
        UUID uuid,
        UUID userId,
        OcrProviderType provider,
        String filename,
        String instructionTitle,
        String instructionTextSnapshot,
        OcrResultStatus status,
        String resultText,
        String errorMessage,
        Instant createdDate
) {
}
