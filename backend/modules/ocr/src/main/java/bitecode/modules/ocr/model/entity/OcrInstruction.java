package bitecode.modules.ocr.model.entity;

import bitecode.modules._common.model.entity.UuidBaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(schema = "ocr")
public class OcrInstruction extends UuidBaseEntity {
    private UUID userId;
    private String title;
    private String instructionText;
}
