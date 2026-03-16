import {AxiosInstance} from "axios";
import {baseConfig} from "@common/config/AxiosConfig.ts";
import AuthService from "@identity/auth/services/AuthService.ts";
import {PagedRequest} from "@common/model/PagedRequest.ts";
import {PagedResponse} from "@common/model/PagedResponse.ts";
import {Document} from "@document/types/model/Document.ts";
import {axiosRequestConfigOf} from "@common/utils/PaginationUtils.ts";

class UserDocumentClient {
    private axios: AxiosInstance;

    constructor() {
        this.axios = AuthService.createAuthenticatedClientInstance(baseConfig, "/documents");
    }

    async getDocuments(request: PagedRequest<void>) {
        return this.axios.get<PagedResponse<Document>>("", axiosRequestConfigOf(request));
    }

    async getDocument(documentId: string) {
        return this.axios.get<Document>(`/${documentId}`);
    }

    async uploadDocuments(files: File[]) {
        const formData = new FormData();
        for (const file of files) {
            formData.append("files", file);
        }

        return this.axios.post<Document[]>("", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
    }

    async downloadDocument(documentId: string) {
        return this.axios.get<Blob>(`/${documentId}/download`, {
            responseType: "blob",
        });
    }

    async deleteDocument(documentId: string) {
        return this.axios.delete(`/${documentId}`);
    }
}

export default new UserDocumentClient();
