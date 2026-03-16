import {AxiosResponse} from "axios";

export function downloadDocumentResponse(response: AxiosResponse<Blob>, filename: string) {
    const contentType = response.headers["content-type"] ?? response.data.type;
    const isPdfDocument = contentType?.includes("application/pdf") || filename.toLowerCase().endsWith(".pdf");
    const fileUrl = URL.createObjectURL(response.data);

    if (isPdfDocument) {
        window.open(fileUrl, "_blank", "noopener,noreferrer");
        window.setTimeout(() => URL.revokeObjectURL(fileUrl), 60_000);
        return;
    }

    const anchor = document.createElement("a");
    anchor.href = fileUrl;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(fileUrl);
}
