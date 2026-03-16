CREATE TABLE document.document
(
    id              BIGSERIAL PRIMARY KEY,
    uuid            UUID                     NOT NULL UNIQUE,
    user_id         UUID                     NOT NULL,
    filename        VARCHAR(512)             NOT NULL,
    stored_filename VARCHAR(700)             NOT NULL,
    checksum        VARCHAR(64)              NOT NULL,
    created_date    TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_date    TIMESTAMP WITH TIME ZONE,
    file_size       BIGINT                   NOT NULL,
    file_type       VARCHAR(255),
    storage_type    VARCHAR(32)              NOT NULL
);

CREATE INDEX idx_document_user_id ON document.document (user_id);
CREATE INDEX idx_document_created_date ON document.document (created_date);
