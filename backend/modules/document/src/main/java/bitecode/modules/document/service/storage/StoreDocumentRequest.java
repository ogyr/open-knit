package bitecode.modules.document.service.storage;

import java.util.UUID;

public record StoreDocumentRequest(
        UUID userId,
        String storedFilename,
        byte[] fileContent
) {
}
