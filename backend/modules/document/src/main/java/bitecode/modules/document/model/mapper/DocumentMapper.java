package bitecode.modules.document.model.mapper;

import bitecode.modules.document.model.data.DocumentDetails;
import bitecode.modules.document.model.entity.Document;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface DocumentMapper {

    DocumentDetails toDocumentDetails(Document document);
}
