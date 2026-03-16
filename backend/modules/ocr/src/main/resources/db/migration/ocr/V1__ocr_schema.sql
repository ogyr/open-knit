CREATE TABLE ocr.ocr_instruction
(
    id               BIGSERIAL PRIMARY KEY,
    uuid             UUID                     NOT NULL UNIQUE,
    user_id          UUID                     NOT NULL,
    title            VARCHAR(255)             NOT NULL,
    instruction_text TEXT                     NOT NULL,
    created_date     TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_date     TIMESTAMP WITH TIME ZONE
);

CREATE TABLE ocr.ocr_result
(
    id                       BIGSERIAL PRIMARY KEY,
    uuid                     UUID                     NOT NULL UNIQUE,
    user_id                  UUID                     NOT NULL,
    provider                 VARCHAR(64)              NOT NULL,
    filename                 VARCHAR(512)             NOT NULL,
    instruction_title        VARCHAR(255),
    instruction_text_snapshot TEXT                    NOT NULL,
    status                   VARCHAR(32)              NOT NULL,
    result_text              TEXT,
    error_message            TEXT,
    created_date             TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_date             TIMESTAMP WITH TIME ZONE
);

CREATE TABLE ocr.ocr_provider_config
(
    id           BIGSERIAL PRIMARY KEY,
    uuid         UUID                     NOT NULL UNIQUE,
    provider     VARCHAR(64)              NOT NULL UNIQUE,
    api_key      TEXT,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_ocr_instruction_user_id ON ocr.ocr_instruction (user_id);
CREATE INDEX idx_ocr_result_user_id ON ocr.ocr_result (user_id);
CREATE INDEX idx_ocr_result_created_date ON ocr.ocr_result (created_date);
