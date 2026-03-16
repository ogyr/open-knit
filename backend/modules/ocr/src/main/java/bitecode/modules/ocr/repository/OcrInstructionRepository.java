package bitecode.modules.ocr.repository;

import bitecode.modules.ocr.model.entity.OcrInstruction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OcrInstructionRepository extends JpaRepository<OcrInstruction, Long> {

    Page<OcrInstruction> findAllByUserId(UUID userId, Pageable pageable);

    Optional<OcrInstruction> findByUuid(UUID uuid);

    Optional<OcrInstruction> findByUuidAndUserId(UUID uuid, UUID userId);
}
