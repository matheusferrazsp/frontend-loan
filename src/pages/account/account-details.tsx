import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { z } from "zod";

import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";

const USER_STORAGE_KEY = "user";

const profileSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: "Senha atual deve ter pelo menos 6 caracteres" }),
    newPassword: z
      .string()
      .min(6, { message: "Nova senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "A nova senha deve ser diferente da senha atual",
    path: ["newPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

type StoredUser = {
  id?: number | string;
  name?: string;
  email?: string;
};

function getAuthenticatedUserId() {
  const userJson = localStorage.getItem(USER_STORAGE_KEY);

  if (!userJson) {
    return null;
  }

  try {
    const parsed = JSON.parse(userJson) as StoredUser;
    const parsedId = Number(parsed.id);

    return Number.isNaN(parsedId) ? null : parsedId;
  } catch {
    return null;
  }
}

function extractApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof AxiosError) {
    const message = (error.response?.data as { error?: string } | undefined)
      ?.error;

    if (message) {
      return message;
    }
  }

  return fallbackMessage;
}

function readStoredUser(): Pick<StoredUser, "name" | "email"> {
  const userJson = localStorage.getItem(USER_STORAGE_KEY);

  if (!userJson) {
    return {
      name: "Usuário",
      email: "",
    };
  }

  try {
    const parsed = JSON.parse(userJson) as StoredUser;
    return {
      name: parsed.name ?? "Usuário",
      email: parsed.email ?? "",
    };
  } catch {
    return {
      name: "Usuário",
      email: "",
    };
  }
}

export function AccountDetails() {
  const storedUser = readStoredUser();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,

    reset: resetProfile,
    formState: {
      errors: profileErrors,
      isSubmitting: isSubmittingProfile,
      isDirty: isProfileDirty,
    },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: storedUser.name,
      email: storedUser.email,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    resetProfile(readStoredUser());
  }, [resetProfile]);

  async function onSaveProfile(data: ProfileFormData) {
    const userId = getAuthenticatedUserId();

    if (!userId) {
      toast.error("Usuário autenticado não encontrado. Faça login novamente.");
      return;
    }

    try {
      const response = await api.put(`/users/${userId}`, {
        name: data.name,
        email: data.email,
      });

      const userJson = localStorage.getItem(USER_STORAGE_KEY);
      const currentUser = userJson ? JSON.parse(userJson) : {};

      const nextUser = {
        ...currentUser,
        ...response.data,
      };

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
      window.dispatchEvent(new Event("user-updated"));

      toast.success("Dados atualizados com sucesso!");
      resetProfile(data);
    } catch (error: unknown) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Erro ao atualizar dados. Tente novamente.",
        ),
      );
    }
  }

  async function onChangePassword(data: PasswordFormData) {
    const userId = getAuthenticatedUserId();

    if (!userId) {
      toast.error("Usuário autenticado não encontrado. Faça login novamente.");
      return;
    }

    try {
      await api.put(`/users/${userId}/change-password`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success("Senha alterada com sucesso!");
      resetPassword();
    } catch (error: unknown) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Erro ao alterar senha. Tente novamente.",
        ),
      );
    }
  }

  return (
    <>
      <Helmet>
        <title>Minha conta</title>
      </Helmet>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Minha conta
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Edite seus dados pessoais e altere sua senha.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados pessoais</CardTitle>
            <CardDescription>
              Essas informações são exibidas no menu da sua conta.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleProfileSubmit(onSaveProfile)}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" type="text" {...registerProfile("name")} />
                {profileErrors.name && (
                  <p className="text-sm text-red-500">
                    {profileErrors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...registerProfile("email")}
                />
                {profileErrors.email && (
                  <p className="text-sm text-red-500">
                    {profileErrors.email.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmittingProfile || !isProfileDirty}
                  className="cursor-pointer"
                >
                  Salvar dados
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>
              Altere sua senha para manter sua conta protegida.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handlePasswordSubmit(onChangePassword)}
              className="grid grid-cols-1 gap-4"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  {...registerPassword("currentPassword")}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-500">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  {...registerPassword("newPassword")}
                />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-500">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...registerPassword("confirmPassword")}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="cursor-pointer"
                >
                  Alterar senha
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
