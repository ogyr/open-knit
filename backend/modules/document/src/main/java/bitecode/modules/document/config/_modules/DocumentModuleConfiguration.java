package bitecode.modules.document.config._modules;

import bitecode.modules.document.config.properties.DocumentProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(DocumentProperties.class)
public class DocumentModuleConfiguration {
}
