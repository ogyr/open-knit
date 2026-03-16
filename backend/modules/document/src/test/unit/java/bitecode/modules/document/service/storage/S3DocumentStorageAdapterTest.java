package bitecode.modules.document.service.storage;

import bitecode.modules.document.config.properties.DocumentProperties;
import bitecode.modules.document.model.enums.DocumentStorageType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.UUID;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

public class S3DocumentStorageAdapterTest {

    @Test
    @DisplayName("Should expose S3 storage type")
    void shouldExposeS3StorageType() {
        var adapter = new S3DocumentStorageAdapter(createDocumentPropertiesWithBucket(), mock(S3Client.class));

        assertThat(adapter.storageType(), is(DocumentStorageType.S3));
    }

    @Test
    @DisplayName("Should store document in configured bucket under user directory key")
    void shouldStoreDocumentInBucketUsingUserDirectoryKey() {
        var s3Client = mock(S3Client.class);
        var adapter = new S3DocumentStorageAdapter(createDocumentPropertiesWithBucket(), s3Client);
        var userId = UUID.randomUUID();
        var request = new StoreDocumentRequest(userId, "invoice.pdf-" + UUID.randomUUID(), "file-content".getBytes());
        var putObjectRequestCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
        var requestBodyCaptor = ArgumentCaptor.forClass(RequestBody.class);

        adapter.store(request);

        verify(s3Client).putObject(putObjectRequestCaptor.capture(), requestBodyCaptor.capture());
        assertThat(putObjectRequestCaptor.getValue().bucket(), is("documents-bucket"));
        assertThat(putObjectRequestCaptor.getValue().key(), is(userId + "/" + request.storedFilename()));
        assertThat(requestBodyCaptor.getValue().optionalContentLength().orElseThrow(), is((long) request.fileContent().length));
    }

    @Test
    @DisplayName("Should delete document from configured bucket using user directory key")
    void shouldDeleteDocumentFromBucketUsingUserDirectoryKey() {
        var s3Client = mock(S3Client.class);
        var adapter = new S3DocumentStorageAdapter(createDocumentPropertiesWithBucket(), s3Client);
        var userId = UUID.randomUUID();
        var request = new StoreDocumentRequest(userId, "contract.docx-" + UUID.randomUUID(), new byte[0]);
        var deleteObjectRequestCaptor = ArgumentCaptor.forClass(DeleteObjectRequest.class);

        adapter.delete(request);

        verify(s3Client).deleteObject(deleteObjectRequestCaptor.capture());
        assertThat(deleteObjectRequestCaptor.getValue().bucket(), is("documents-bucket"));
        assertThat(deleteObjectRequestCaptor.getValue().key(), is(userId + "/" + request.storedFilename()));
    }

    @Test
    @DisplayName("Should fail to store document when bucket is missing")
    void shouldFailToStoreDocumentWhenBucketIsMissing() {
        var s3Client = mock(S3Client.class);
        var adapter = new S3DocumentStorageAdapter(new DocumentProperties(), s3Client);
        var request = new StoreDocumentRequest(UUID.randomUUID(), "missing-bucket.txt", "content".getBytes());

        var exception = assertThrows(IllegalStateException.class, () -> adapter.store(request));

        assertThat(exception.getMessage(), is("S3 bucket is not configured for document storage"));
        verifyNoInteractions(s3Client);
    }

    @Test
    @DisplayName("Should fail to delete document when bucket is missing")
    void shouldFailToDeleteDocumentWhenBucketIsMissing() {
        var s3Client = mock(S3Client.class);
        var adapter = new S3DocumentStorageAdapter(new DocumentProperties(), s3Client);
        var request = new StoreDocumentRequest(UUID.randomUUID(), "missing-bucket.txt", new byte[0]);

        var exception = assertThrows(IllegalStateException.class, () -> adapter.delete(request));

        assertThat(exception.getMessage(), is("S3 bucket is not configured for document storage"));
        verifyNoInteractions(s3Client);
    }

    private DocumentProperties createDocumentPropertiesWithBucket() {
        var documentProperties = new DocumentProperties();
        documentProperties.getS3().setBucket("documents-bucket");
        documentProperties.getS3().setRegion("eu-central-1");
        return documentProperties;
    }
}
