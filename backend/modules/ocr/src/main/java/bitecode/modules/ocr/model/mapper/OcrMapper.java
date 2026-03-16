package bitecode.modules.ocr.model.mapper;

import bitecode.modules.ocr.model.data.OcrInstructionDetails;
import bitecode.modules.ocr.model.data.OcrProviderConfigDetails;
import bitecode.modules.ocr.model.data.OcrResultDetails;
import bitecode.modules.ocr.model.entity.OcrInstruction;
import bitecode.modules.ocr.model.entity.OcrProviderConfig;
import bitecode.modules.ocr.model.entity.OcrResult;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface OcrMapper {

    OcrInstructionDetails toOcrInstructionDetails(OcrInstruction ocrInstruction);

    OcrResultDetails toOcrResultDetails(OcrResult ocrResult);

    OcrProviderConfigDetails toOcrProviderConfigDetails(OcrProviderConfig ocrProviderConfig);
}
