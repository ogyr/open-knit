import {PagedRequest} from "@common/model/PagedRequest.ts";
import AdminDocumentClient from "@document/clients/http/AdminDocumentClient.ts";
import UserDocumentClient from "@document/clients/http/UserDocumentClient.ts";
import {Document} from "@document/types/model/Document.ts";
import {PagedResponse} from "@common/model/PagedResponse.ts";
import {AxiosResponse} from "axios";
import {axiosCallWrapper} from "@common/config/AxiosUtil.ts";

class DocumentService {
    public QUERY_KEYS = {
        GET_DOCUMENTS: (isAdmin: boolean, page: number, pageSize: number) => [isAdmin ? "admin-documents" : "user-documents", page, pageSize] as const,
        GET_DOCUMENT: (isAdmin: boolean, documentId: string) => [isAdmin ? "admin-document" : "user-document", documentId] as const,
        INVALIDATE_DOCUMENTS: (isAdmin: boolean) => [isAdmin ? "admin-documents" : "user-documents"] as const,
    };

    public async getDocuments(request: PagedRequest<void>, isAdmin: boolean): Promise<PagedResponse<Document>> {
        return this.resolveClient(isAdmin)
            .getDocuments(request)
            .then(response => response.data);
    }

    public async getDocument(documentId: string, isAdmin: boolean): Promise<Document> {
        return this.resolveClient(isAdmin)
            .getDocument(documentId)
            .then(response => response.data);
    }

    public async uploadDocuments(files: File[], isAdmin: boolean): Promise<Document[]> {
        return this.resolveClient(isAdmin)
            .uploadDocuments(files)
            .then(response => response.data);
    }

    public async downloadDocument(documentId: string, isAdmin: boolean): Promise<AxiosResponse<Blob>> {
        return this.resolveClient(isAdmin).downloadDocument(documentId);
    }

    public async deleteDocument(documentId: string, isAdmin: boolean) {
        return axiosCallWrapper<void>(() => this.resolveClient(isAdmin).deleteDocument(documentId));
    }

    private resolveClient(isAdmin: boolean) {
        return isAdmin ? AdminDocumentClient : UserDocumentClient;
    }
}

export default new DocumentService();
