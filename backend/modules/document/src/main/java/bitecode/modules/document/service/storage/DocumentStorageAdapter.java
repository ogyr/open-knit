package bitecode.modules.document.service.storage;

import bitecode.modules.document.model.enums.DocumentStorageType;

public interface DocumentStorageAdapter {

    DocumentStorageType storageType();

    void store(StoreDocumentRequest request);

    byte[] load(StoreDocumentRequest request);

    void delete(StoreDocumentRequest request);
}
