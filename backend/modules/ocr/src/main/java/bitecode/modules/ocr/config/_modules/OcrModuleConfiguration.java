package bitecode.modules.ocr.config._modules;

import bitecode.modules.ocr.config.properties.OcrProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(OcrProperties.class)
public class OcrModuleConfiguration {
}
