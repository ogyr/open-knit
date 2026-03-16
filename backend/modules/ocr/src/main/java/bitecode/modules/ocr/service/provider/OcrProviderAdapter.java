package bitecode.modules.ocr.service.provider;

import bitecode.modules.ocr.model.data.RunOcrData;
import bitecode.modules.ocr.model.data.RunOcrResponse;
import bitecode.modules.ocr.model.entity.OcrProviderConfig;
import bitecode.modules.ocr.model.enums.OcrProviderType;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.util.List;

public interface OcrProviderAdapter {

    OcrProviderType providerType();

    List<String> acceptedContentTypes();

    void validateFile(MultipartFile file);

    Mono<RunOcrResponse> runOcr(RunOcrData runOcrData, OcrProviderConfig providerConfig);
}
