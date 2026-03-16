package bitecode.modules.ocr.model.request;

import jakarta.validation.constraints.NotBlank;

public record CreateOcrInstructionRequest(
        @NotBlank String title,
        @NotBlank String instructionText
) {
}
