package bitecode.modules.ocr.model.entity;

import bitecode.modules._common.model.entity.UuidBaseEntity;
import bitecode.modules.ocr.model.enums.OcrProviderType;
import bitecode.modules.ocr.model.enums.OcrResultStatus;
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
@Table(schema = "ocr")
public class OcrResult extends UuidBaseEntity {
    private UUID userId;

    @Enumerated(EnumType.STRING)
    private OcrProviderType provider;

    private String filename;
    private String instructionTitle;
    private String instructionTextSnapshot;

    @Enumerated(EnumType.STRING)
    private OcrResultStatus status;

    private String resultText;
    private String errorMessage;
}
