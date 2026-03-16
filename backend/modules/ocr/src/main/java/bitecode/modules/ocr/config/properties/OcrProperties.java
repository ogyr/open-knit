package bitecode.modules.ocr.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "bitecode.ocr")
public class OcrProperties {
    private OpenAiProperties openAi = new OpenAiProperties();

    @Data
    public static class OpenAiProperties {
        private String model = "gpt-4o-mini";
    }
}
