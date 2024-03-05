"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@shared/lib/api-client";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { useToast } from "@ui/hooks/use-toast";
import { ApiOutput } from "api/trpc/router";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3).max(32),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateTeamForm({
  onSuccess,
  defaultName,
}: {
  onSuccess: (team: ApiOutput["team"]["create"]) => void;
  defaultName?: string;
}) {
  const t = useTranslations();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultName,
    },
  });

  const createTeamMutation = apiClient.team.create.useMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const newTeam = await createTeamMutation.mutateAsync({
        name: data.name,
      });

      // redirect to team settings page
      toast({
        variant: "success",
        title: t("createTeam.notifications.success"),
      });

      onSuccess(newTeam);
    } catch (e) {
      toast({
        title: t("createTeam.notifications.error"),
        variant: "error",
      });
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label className="mb-2 block text-sm font-medium">
          {t("createTeam.name")}
        </label>
        <Input type="text" {...register("name", { required: true })} />
      </div>

      <Button className="mt-4 w-full" type="submit" loading={isSubmitting}>
        {t("createTeam.submit")}
      </Button>
    </form>
  );
}
