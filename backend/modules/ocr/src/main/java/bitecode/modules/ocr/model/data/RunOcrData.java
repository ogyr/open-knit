package bitecode.modules.ocr.model.data;

import bitecode.modules.ocr.model.enums.OcrProviderType;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public record RunOcrData(
        UUID userId,
        OcrProviderType provider,
        String instructionTitle,
        String instructionTextSnapshot,
        MultipartFile file
) {
}
