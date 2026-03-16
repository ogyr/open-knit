package bitecode.modules.ocr.repository;

import bitecode.modules.ocr.model.entity.OcrProviderConfig;
import bitecode.modules.ocr.model.enums.OcrProviderType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OcrProviderConfigRepository extends JpaRepository<OcrProviderConfig, Long> {

    Optional<OcrProviderConfig> findByProvider(OcrProviderType provider);
}
