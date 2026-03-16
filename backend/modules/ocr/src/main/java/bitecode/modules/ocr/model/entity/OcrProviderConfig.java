package bitecode.modules.ocr.model.entity;

import bitecode.modules._common.model.entity.UuidBaseEntity;
import bitecode.modules.ocr.model.enums.OcrProviderType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(schema = "ocr")
public class OcrProviderConfig extends UuidBaseEntity {
    @Enumerated(EnumType.STRING)
    private OcrProviderType provider;
    private String apiKey;
}
