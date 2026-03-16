package bitecode.modules.ocr.service;

import bitecode.modules.ocr.model.data.OcrProviderConfigDetails;
import bitecode.modules.ocr.model.entity.OcrProviderConfig;
import bitecode.modules.ocr.model.enums.OcrProviderType;
import bitecode.modules.ocr.model.mapper.OcrMapper;
import bitecode.modules.ocr.model.request.UpdateOcrProviderConfigRequest;
import bitecode.modules.ocr.repository.OcrProviderConfigRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class OcrProviderConfigService {
    private final OcrProviderConfigRepository ocrProviderConfigRepository;
    private final OcrMapper ocrMapper;

    public OcrProviderConfigService(OcrProviderConfigRepository ocrProviderConfigRepository, OcrMapper ocrMapper) {
        this.ocrProviderConfigRepository = ocrProviderConfigRepository;
        this.ocrMapper = ocrMapper;
    }

    @PostConstruct
    public void init() {
        var existingProviders = ocrProviderConfigRepository.findAll().stream()
                .collect(Collectors.toMap(OcrProviderConfig::getProvider, Function.identity()));
        for (var providerType : OcrProviderType.values()) {
            if (existingProviders.get(providerType) == null) {
                var ocrProviderConfig = new OcrProviderConfig();
                ocrProviderConfig.setProvider(providerType);
                ocrProviderConfigRepository.save(ocrProviderConfig);
            }
        }
    }

    @Transactional(readOnly = true)
    public List<OcrProviderConfigDetails> findAllProviderConfigs() {
        return ocrProviderConfigRepository.findAll().stream()
                .map(ocrMapper::toOcrProviderConfigDetails)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<OcrProviderConfig> findProviderConfigEntity(OcrProviderType providerType) {
        return ocrProviderConfigRepository.findByProvider(providerType);
    }

    @Transactional(readOnly = true)
    public OcrProviderConfigDetails findProviderConfig(OcrProviderType providerType) {
        return findProviderConfigEntity(providerType)
                .map(ocrMapper::toOcrProviderConfigDetails)
                .orElseThrow(() -> new HttpClientErrorException(HttpStatus.NOT_FOUND));
    }

    @Transactional
    public OcrProviderConfigDetails updateProviderConfig(UpdateOcrProviderConfigRequest request) {
        var ocrProviderConfig = findProviderConfigEntity(request.provider())
                .orElseThrow(() -> new HttpClientErrorException(HttpStatus.NOT_FOUND));
        ocrProviderConfig.setApiKey(request.apiKey());
        return ocrMapper.toOcrProviderConfigDetails(ocrProviderConfigRepository.save(ocrProviderConfig));
    }
}
