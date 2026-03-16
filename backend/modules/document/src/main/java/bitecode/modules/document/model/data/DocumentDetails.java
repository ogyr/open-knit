package bitecode.modules.document.model.data;

import bitecode.modules.document.model.enums.DocumentStorageType;

import java.time.Instant;
import java.util.UUID;

public record DocumentDetails(
        UUID uuid,
        UUID userId,
        String filename,
        String checksum,
        Instant createdDate,
        Long fileSize,
        String fileType,
        DocumentStorageType storageType
) {
}
