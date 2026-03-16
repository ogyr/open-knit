package bitecode.modules.document.repository;

import bitecode.modules.document.model.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    Page<Document> findAllByUserId(UUID userId, Pageable pageable);

    Optional<Document> findByUuid(UUID uuid);

    Optional<Document> findByUuidAndUserId(UUID uuid, UUID userId);
}
