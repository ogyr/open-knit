package bitecode.modules.document.config.properties;

import bitecode.modules.document.model.enums.DocumentStorageType;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = DocumentProperties.PREFIX)
public class DocumentProperties {
    public static final String PREFIX = "bitecode.document.storage";

    private DocumentStorageType defaultStorageType = DocumentStorageType.LOCAL;
    private LocalStorageProperties local = new LocalStorageProperties();
    private S3StorageProperties s3 = new S3StorageProperties();

    @Data
    public static class LocalStorageProperties {
        private String basePath = "./storage/documents";
    }

    @Data
    public static class S3StorageProperties {
        private String bucket;
        private String region = "us-east-1";
        private String endpoint;
        private String accessKey;
        private String secretKey;
        private boolean forcePathStyle = true;
    }
}
