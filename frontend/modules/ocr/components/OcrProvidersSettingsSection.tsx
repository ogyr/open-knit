import React, {useEffect, useState} from "react";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {GenericButton} from "@common/components/blocks/GenericButton.tsx";
import {showToast} from "@common/components/blocks/ToastManager.tsx";
import {GenericFormTextInput} from "@common/components/forms/GenericFormTextInput.tsx";
import OcrClient from "@ocr/clients/OcrClient.ts";
import OcrService from "@ocr/services/OcrService.ts";

interface OcrSettingsFormData {
  apiKey: string;
}

const formSchema = z.object({
  apiKey: z.union([z.literal(""), z.string()]),
});

export function OcrProvidersSettingsSection() {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<OcrSettingsFormData>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
    },
  });

  const {data: providerConfig} = useQuery({
    queryKey: OcrService.QUERY_KEYS.GET_PROVIDER_CONFIG("OPEN_AI"),
    queryFn: async () => await OcrClient.getProviderConfig("OPEN_AI"),
  });

  useEffect(() => {
    if (providerConfig) {
      reset({apiKey: providerConfig.apiKey ?? ""});
    }
  }, [providerConfig, reset]);

  const onSubmit: SubmitHandler<OcrSettingsFormData> = async ({apiKey}) => {
    setIsPending(true);
    try {
      await OcrClient.updateProviderConfig({provider: "OPEN_AI", apiKey});
      showToast("success", "OCR settings successfully updated");
      await queryClient.invalidateQueries({queryKey: OcrService.QUERY_KEYS.INVALIDATE_PROVIDER_CONFIG()});
    } catch (error) {
      console.log(error);
      showToast("error", "Could not update OCR settings");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-5 space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">Provider settings</h3>
        <p className="text-sm text-gray-500">Store the OpenAI API key used by OCR processing.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="apiKey"
          control={control}
          render={({field}) => (
            <GenericFormTextInput
              field={field}
              label="OpenAI API key"
              type="password"
              errors={errors}
              wrapperClassName="max-w-xl"
            />
          )}
        />

        <GenericButton type="submit" text="Save changes" isPending={isPending}/>
      </form>
    </section>
  );
}
