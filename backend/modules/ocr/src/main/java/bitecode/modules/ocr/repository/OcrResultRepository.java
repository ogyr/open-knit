package bitecode.modules.ocr.repository;

import bitecode.modules.ocr.model.entity.OcrResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OcrResultRepository extends JpaRepository<OcrResult, Long> {

    Page<OcrResult> findAllByUserId(UUID userId, Pageable pageable);

    Optional<OcrResult> findByUuid(UUID uuid);

    Optional<OcrResult> findByUuidAndUserId(UUID uuid, UUID userId);
}
