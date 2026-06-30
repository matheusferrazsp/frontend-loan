import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import {
  CreditCard,
  ExternalLink,
  Info,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { useEffect, useState } from "react";
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

  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [isSendingForgot, setIsSendingForgot] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<any>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const userId = getAuthenticatedUserId();
    if (userId) {
      api
        .get(`/users/${userId}`)
        .then((res) => {
          setSubscriptionData(res.data);

          // Atualiza o cache local para evitar flicker nos próximos reloads
          const stored = localStorage.getItem(USER_STORAGE_KEY);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              localStorage.setItem(
                USER_STORAGE_KEY,
                JSON.stringify({ ...parsed, ...res.data }),
              );
            } catch (e) {
              console.error(e);
            }
          }
        })
        .catch(console.error);
    }
  }, []);

  async function handleOpenPortal() {
    try {
      setIsPortalLoading(true);
      const response = await api.post("/api/billing-portal");
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error(
        "Erro ao abrir portal do cliente. Verifique se você já possui uma assinatura.",
      );
    } finally {
      setIsPortalLoading(false);
    }
  }

  async function handleCheckout() {
    try {
      setIsPortalLoading(true);
      const response = await api.post("/api/checkout");
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error("Erro ao iniciar checkout.");
    } finally {
      setIsPortalLoading(false);
    }
  }

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

  async function handleForgotPassword() {
    try {
      setIsSendingForgot(true);
      await api.post("/forgot-password", { email: storedUser.email });
      toast.success("Link de redefinição de senha enviado para o seu e-mail!");
    } catch (error: unknown) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Erro ao solicitar redefinição. Tente novamente.",
        ),
      );
    } finally {
      setIsSendingForgot(false);
    }
  }

  const isBlocked =
    subscriptionData &&
    !subscriptionData.isLifetime &&
    ["pending", "past_due", "canceled", "unpaid"].includes(
      subscriptionData.subscriptionStatus,
    );

  async function handleVerifyPayment() {
    try {
      setIsVerifyingPayment(true);
      const userId = getAuthenticatedUserId();
      const response = await api.get(`/users/${userId}/status-check`);
      if (response.data?.subscriptionStatus === "active") {
        localStorage.setItem("user", JSON.stringify(response.data));
        setSubscriptionData(response.data);
        toast.success("Assinatura confirmada! Acesso liberado.");
        window.location.href = "/";
      } else {
        toast.error("O pagamento ainda não foi processado ou está pendente.");
      }
    } catch (e) {
      toast.error("Erro ao verificar assinatura.");
    } finally {
      setIsVerifyingPayment(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Minha conta</title>
      </Helmet>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {isBlocked && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-lg">Acesso Restrito</h2>
              <p className="text-sm opacity-90">
                Sua assinatura encontra-se com o pagamento pendente ou inativo.
                Por favor, regularize sua situação abaixo para acessar as demais
                funcionalidades.
              </p>
            </div>
            <Button
              onClick={handleVerifyPayment}
              disabled={isVerifyingPayment}
              variant="default"
              className="bg-rose-600 hover:bg-rose-700 text-white shrink-0"
            >
              Já paguei / Verificar Sistema
            </Button>
          </div>
        )}

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
            <CardTitle>Assinatura e Cobrança</CardTitle>
            <CardDescription>
              Gerencie sua assinatura, atualize seu cartão de crédito e
              visualize o histórico de faturas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 items-start">
            {subscriptionData?.isLifetime ? (
              <div className="flex items-center gap-3 p-4 border rounded-lg w-full bg-green-500/10 border-green-500/20">
                <div className="flex flex-col">
                  <span className="font-semibold text-green-700 dark:text-green-400">
                    Acesso Vitalício Ativo
                  </span>
                  <span className="text-sm text-green-600 dark:text-green-500 mt-1">
                    Você é um cliente vitalício. Nenhuma cobrança é necessária e
                    seu acesso é garantido para sempre.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center gap-3 p-4 border rounded-lg w-full bg-muted/30">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      Assinatura VeroFlux
                    </span>
                    <span className="text-sm text-muted-foreground">
                      R$ 29,90 / mês
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full my-2">
                  {subscriptionData?.subscriptionStatus === "trialing" && (
                    <div className="flex items-start gap-3 p-4 border rounded-lg w-full bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400 text-sm">
                      <Info className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>
                        Você está no seu{" "}
                        <strong>período de teste gratuito</strong>. Nenhuma
                        cobrança foi realizada no momento.
                      </p>
                    </div>
                  )}

                  {(!subscriptionData ||
                    !["active", "trialing"].includes(
                      subscriptionData.subscriptionStatus,
                    )) && (
                    <div className="flex items-start gap-3 p-4 border rounded-lg w-full bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm">
                      <Info className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>
                        <strong>Fique tranquilo!</strong> Seus dados de cartão
                        são usados apenas para pagamentos futuros e você pode
                        cancelar a qualquer momento.
                        <strong> Você não será cobrado</strong> durante os dias
                        de teste gratuito.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  {(!subscriptionData ||
                    !["active", "trialing"].includes(
                      subscriptionData.subscriptionStatus,
                    )) && (
                    <Button
                      onClick={handleCheckout}
                      disabled={isPortalLoading}
                      className="w-full sm:w-auto gap-2"
                    >
                      {isPortalLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-4 h-4" />
                      )}
                      Assinar Plano
                    </Button>
                  )}
                  <Button
                    onClick={handleOpenPortal}
                    disabled={isPortalLoading}
                    variant="outline"
                    className="w-full sm:w-auto gap-2"
                  >
                    {isPortalLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                    Gerenciar Assinatura (Portal)
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
                  disabled
                  className="bg-muted/50 cursor-not-allowed"
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

              <div className="flex justify-between items-center mt-4">
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-blue-500 hover:text-blue-600"
                  onClick={handleForgotPassword}
                  disabled={isSendingForgot}
                >
                  {isSendingForgot ? "Enviando..." : "Esqueci minha senha"}
                </Button>
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
