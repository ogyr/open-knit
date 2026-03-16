package bitecode.modules.ocr.service;

import bitecode.modules.ocr.model.data.OcrResultDetails;
import bitecode.modules.ocr.model.data.RunOcrData;
import bitecode.modules.ocr.model.entity.OcrResult;
import bitecode.modules.ocr.model.enums.OcrProviderType;
import bitecode.modules.ocr.model.enums.OcrResultStatus;
import bitecode.modules.ocr.model.mapper.OcrMapper;
import bitecode.modules.ocr.model.request.RunOcrRequest;
import bitecode.modules.ocr.repository.OcrResultRepository;
import bitecode.modules.ocr.service.provider.OcrProviderAdapter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class OcrResultService {
    private final OcrResultRepository ocrResultRepository;
    private final OcrInstructionService ocrInstructionService;
    private final OcrProviderConfigService ocrProviderConfigService;
    private final OcrMapper ocrMapper;
    private final Map<OcrProviderType, OcrProviderAdapter> providerAdaptersByType;

    public OcrResultService(OcrResultRepository ocrResultRepository,
                            OcrInstructionService ocrInstructionService,
                            OcrProviderConfigService ocrProviderConfigService,
                            OcrMapper ocrMapper,
                            List<OcrProviderAdapter> providerAdapters) {
        this.ocrResultRepository = ocrResultRepository;
        this.ocrInstructionService = ocrInstructionService;
        this.ocrProviderConfigService = ocrProviderConfigService;
        this.ocrMapper = ocrMapper;
        this.providerAdaptersByType = new EnumMap<>(OcrProviderType.class);
        for (var providerAdapter : providerAdapters) {
            this.providerAdaptersByType.put(providerAdapter.providerType(), providerAdapter);
        }
    }

    @Transactional(readOnly = true)
    public Page<OcrResultDetails> findUserResults(UUID userId, Pageable pageable) {
        return ocrResultRepository.findAllByUserId(userId, pageable)
                .map(ocrMapper::toOcrResultDetails);
    }

    @Transactional(readOnly = true)
    public Page<OcrResultDetails> findAllResults(Pageable pageable) {
        return ocrResultRepository.findAll(pageable)
                .map(ocrMapper::toOcrResultDetails);
    }

    public Mono<OcrResultDetails> runOcr(UUID userId, RunOcrRequest request, MultipartFile file) {
        var providerAdapter = resolveProviderAdapter(request.provider());
        var resolvedInstructionTitle = resolveInstructionTitle(userId, request);
        var resolvedInstructionText = resolveInstructionText(userId, request);
        providerAdapter.validateFile(file);

        var providerConfig = ocrProviderConfigService.findProviderConfigEntity(request.provider())
                .orElseThrow(() -> new HttpClientErrorException(HttpStatus.NOT_FOUND, "OCR provider config not found"));

        var runOcrData = new RunOcrData(
                userId,
                request.provider(),
                resolvedInstructionTitle,
                resolvedInstructionText,
                file
        );

        return providerAdapter.runOcr(runOcrData, providerConfig)
                .map(runOcrResponse -> buildSuccessResult(runOcrData, runOcrResponse.resultText()))
                .onErrorResume(throwable -> Mono.just(buildErrorResult(runOcrData, throwable)))
                .flatMap(ocrResult -> Mono.fromCallable(() -> ocrMapper.toOcrResultDetails(ocrResultRepository.save(ocrResult)))
                        .subscribeOn(Schedulers.boundedElastic()));
    }

    @Transactional
    public void deleteResultAsAdmin(UUID resultId) {
        ocrResultRepository.delete(findResultEntity(resultId));
    }

    @Transactional(readOnly = true)
    public OcrResult findResultEntity(UUID resultId) {
        return ocrResultRepository.findByUuid(resultId)
                .orElseThrow(() -> new HttpClientErrorException(HttpStatus.NOT_FOUND));
    }

    private OcrProviderAdapter resolveProviderAdapter(OcrProviderType providerType) {
        var providerAdapter = providerAdaptersByType.get(providerType);
        if (providerAdapter == null) {
            throw new IllegalStateException("OCR provider adapter is not configured for provider: " + providerType);
        }
        return providerAdapter;
    }

    private String resolveInstructionText(UUID userId, RunOcrRequest request) {
        if (request.instructionId() != null) {
            return ocrInstructionService.getUserInstructionEntity(request.instructionId(), userId).getInstructionText();
        }
        if (!StringUtils.hasText(request.instructionText())) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "instructionText or instructionId is required");
        }
        return request.instructionText();
    }

    private String resolveInstructionTitle(UUID userId, RunOcrRequest request) {
        if (request.instructionId() != null) {
            return ocrInstructionService.getUserInstructionEntity(request.instructionId(), userId).getTitle();
        }
        return request.instructionTitle();
    }

    private OcrResult buildSuccessResult(RunOcrData runOcrData, String resultText) {
        var ocrResult = new OcrResult();
        ocrResult.setUserId(runOcrData.userId());
        ocrResult.setProvider(runOcrData.provider());
        ocrResult.setFilename(resolveOriginalFilename(runOcrData.file()));
        ocrResult.setInstructionTitle(runOcrData.instructionTitle());
        ocrResult.setInstructionTextSnapshot(runOcrData.instructionTextSnapshot());
        ocrResult.setStatus(OcrResultStatus.SUCCESS);
        ocrResult.setResultText(resultText);
        return ocrResult;
    }

    private OcrResult buildErrorResult(RunOcrData runOcrData, Throwable throwable) {
        var ocrResult = new OcrResult();
        ocrResult.setUserId(runOcrData.userId());
        ocrResult.setProvider(runOcrData.provider());
        ocrResult.setFilename(resolveOriginalFilename(runOcrData.file()));
        ocrResult.setInstructionTitle(runOcrData.instructionTitle());
        ocrResult.setInstructionTextSnapshot(runOcrData.instructionTextSnapshot());
        ocrResult.setStatus(OcrResultStatus.ERROR);
        ocrResult.setErrorMessage(throwable.getMessage());
        return ocrResult;
    }

    private String resolveOriginalFilename(MultipartFile file) {
        if (file == null || !StringUtils.hasText(file.getOriginalFilename())) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Filename is required");
        }
        return file.getOriginalFilename();
    }
}
