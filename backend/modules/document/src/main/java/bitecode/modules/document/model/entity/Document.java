package bitecode.modules.document.model.entity;

import bitecode.modules._common.model.entity.UuidBaseEntity;
import bitecode.modules.document.model.enums.DocumentStorageType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "document", schema = "document")
public class Document extends UuidBaseEntity {

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 512)
    private String filename;

    @Column(nullable = false, length = 700)
    private String storedFilename;

    @Column(nullable = false, length = 64)
    private String checksum;

    @Column(nullable = false)
    private Long fileSize;

    @Column(length = 255)
    private String fileType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private DocumentStorageType storageType;
}
