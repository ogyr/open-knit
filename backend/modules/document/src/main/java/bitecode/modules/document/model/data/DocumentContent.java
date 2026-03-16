package bitecode.modules.document.model.data;

public record DocumentContent(
        String filename,
        String fileType,
        long fileSize,
        byte[] content
) {
}
