package bitecode.modules.ocr.model.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateOcrInstructionRequest(
        @NotBlank String title,
        @NotBlank String instructionText
) {
}
