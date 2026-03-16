package bitecode.modules.ocr.service;

import bitecode.modules.ocr.model.data.OcrInstructionDetails;
import bitecode.modules.ocr.model.entity.OcrInstruction;
import bitecode.modules.ocr.model.mapper.OcrMapper;
import bitecode.modules.ocr.model.request.CreateOcrInstructionRequest;
import bitecode.modules.ocr.model.request.UpdateOcrInstructionRequest;
import bitecode.modules.ocr.repository.OcrInstructionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;

import java.util.UUID;

@Service
public class OcrInstructionService {
    private final OcrInstructionRepository ocrInstructionRepository;
    private final OcrMapper ocrMapper;

    public OcrInstructionService(OcrInstructionRepository ocrInstructionRepository, OcrMapper ocrMapper) {
        this.ocrInstructionRepository = ocrInstructionRepository;
        this.ocrMapper = ocrMapper;
    }

    @Transactional(readOnly = true)
    public Page<OcrInstructionDetails> findUserInstructions(UUID userId, Pageable pageable) {
        return ocrInstructionRepository.findAllByUserId(userId, pageable)
                .map(ocrMapper::toOcrInstructionDetails);
    }

    @Transactional
    public OcrInstructionDetails createInstruction(UUID userId, CreateOcrInstructionRequest request) {
        var ocrInstruction = new OcrInstruction();
        ocrInstruction.setUserId(userId);
        ocrInstruction.setTitle(request.title());
        ocrInstruction.setInstructionText(request.instructionText());
        return ocrMapper.toOcrInstructionDetails(ocrInstructionRepository.save(ocrInstruction));
    }

    @Transactional
    public OcrInstructionDetails updateInstruction(UUID instructionId, UUID userId, UpdateOcrInstructionRequest request) {
        var ocrInstruction = getUserInstructionEntity(instructionId, userId);
        ocrInstruction.setTitle(request.title());
        ocrInstruction.setInstructionText(request.instructionText());
        return ocrMapper.toOcrInstructionDetails(ocrInstructionRepository.save(ocrInstruction));
    }

    @Transactional
    public void deleteInstruction(UUID instructionId, UUID userId) {
        ocrInstructionRepository.delete(getUserInstructionEntity(instructionId, userId));
    }

    @Transactional(readOnly = true)
    public OcrInstruction getUserInstructionEntity(UUID instructionId, UUID userId) {
        return ocrInstructionRepository.findByUuidAndUserId(instructionId, userId)
                .orElseThrow(() -> new HttpClientErrorException(HttpStatus.NOT_FOUND));
    }
}
