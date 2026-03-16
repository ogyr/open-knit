import {AxiosInstance} from "axios";
import {adminBaseConfig, baseConfig} from "@common/config/AxiosConfig.ts";
import {axiosRequestConfigOf} from "@common/utils/PaginationUtils.ts";
import {PagedRequest} from "@common/model/PagedRequest.ts";
import {PagedResponse} from "@common/model/PagedResponse.ts";
import AuthService from "@identity/auth/services/AuthService.ts";
import {OcrInstruction} from "@ocr/types/OcrInstruction.ts";
import {OcrProviderConfig} from "@ocr/types/OcrProviderConfig.ts";
import {OcrProviderType} from "@ocr/types/OcrProviderType.ts";
import {OcrResult} from "@ocr/types/OcrResult.ts";
import {CreateOcrInstructionRequest} from "@ocr/types/request/CreateOcrInstructionRequest.ts";
import {RunOcrRequest} from "@ocr/types/request/RunOcrRequest.ts";
import {UpdateOcrProviderConfigRequest} from "@ocr/types/request/UpdateOcrProviderConfigRequest.ts";

class OcrClient {
  private userAxios: AxiosInstance;
  private adminAxios: AxiosInstance;

  constructor() {
    this.userAxios = AuthService.createAuthenticatedClientInstance(baseConfig, "/ocr");
    this.adminAxios = AuthService.createAuthenticatedClientInstance(adminBaseConfig, "/ocr");
  }

  async getInstructions(request: PagedRequest<void>): Promise<PagedResponse<OcrInstruction>> {
    const response = await this.userAxios.get<PagedResponse<OcrInstruction>>("/instructions", axiosRequestConfigOf(request));
    return response.data;
  }

  async createInstruction(request: CreateOcrInstructionRequest): Promise<OcrInstruction> {
    const response = await this.userAxios.post<OcrInstruction>(
      "/instructions",
      JSON.stringify(request),
      {
        headers: {"Content-Type": "application/json"},
      },
    );
    return response.data;
  }

  async deleteInstruction(instructionId: string): Promise<void> {
    await this.userAxios.delete(`/instructions/${instructionId}`);
  }

  async runOcr(request: RunOcrRequest, file: File): Promise<OcrResult> {
    const formData = new FormData();
    formData.append("request", new Blob([JSON.stringify(request)], {type: "application/json"}));
    formData.append("file", file);

    const response = await this.userAxios.post<OcrResult>("/results", formData, {
      timeout: 120_000,
      headers: {"Content-Type": "multipart/form-data"},
    });
    return response.data;
  }

  async getAdminResults(request: PagedRequest<void>): Promise<PagedResponse<OcrResult>> {
    const response = await this.adminAxios.get<PagedResponse<OcrResult>>("/results", axiosRequestConfigOf(request));
    return response.data;
  }

  async getProviderConfig(provider: OcrProviderType): Promise<OcrProviderConfig> {
    const response = await this.adminAxios.get<OcrProviderConfig>(`/providers/${provider}`);
    return response.data;
  }

  async updateProviderConfig(request: UpdateOcrProviderConfigRequest): Promise<OcrProviderConfig> {
    const response = await this.adminAxios.patch<OcrProviderConfig>(
      "/providers",
      JSON.stringify(request),
      {
        headers: {"Content-Type": "application/json"},
      },
    );
    return response.data;
  }
}

export default new OcrClient();
