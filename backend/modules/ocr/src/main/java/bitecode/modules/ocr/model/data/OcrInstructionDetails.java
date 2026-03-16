package bitecode.modules.ocr.model.data;

import java.time.Instant;
import java.util.UUID;

public record OcrInstructionDetails(
        UUID uuid,
        UUID userId,
        String title,
        String instructionText,
        Instant createdDate,
        Instant updatedDate
) {
}
