package bitecode.modules.document.config;

import bitecode.modules._common.config.flyway.FlywayMigrationModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DocumentFlywayMigrationConfig {

    @Bean
    public FlywayMigrationModule documentFlywayMigration() {
        return new FlywayMigrationModule("document", "classpath:db/migration/document");
    }
}
