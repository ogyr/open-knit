package bitecode.modules.document._config;

import bitecode.modules._common.BaseIntegrationTest;
import bitecode.modules._common.utils.TestDataFactory;
import bitecode.modules.document.config.properties.DocumentProperties;
import bitecode.modules.document.repository.DocumentRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;

public class DocumentIntegrationTest extends BaseIntegrationTest {

    @Autowired
    protected TestDataFactory testDataFactory;

    @Autowired
    protected DocumentRepository documentRepository;

    @Autowired
    protected DocumentProperties documentProperties;

    @BeforeEach
    void cleanBeforeEach() throws IOException {
        documentRepository.deleteAll();
        deleteStorageDirectory();
    }

    @AfterEach
    void cleanAfterEach() throws IOException {
        documentRepository.deleteAll();
        deleteStorageDirectory();
    }

    protected Path getStorageBasePath() {
        return Path.of(documentProperties.getLocal().getBasePath()).toAbsolutePath().normalize();
    }

    private void deleteStorageDirectory() throws IOException {
        var storageBasePath = getStorageBasePath();
        if (!Files.exists(storageBasePath)) {
            return;
        }

        try (var pathStream = Files.walk(storageBasePath)) {
            pathStream.sorted(Comparator.reverseOrder())
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException e) {
                            throw new IllegalStateException("Failed to cleanup test storage path: " + path, e);
                        }
                    });
        }
    }
}
