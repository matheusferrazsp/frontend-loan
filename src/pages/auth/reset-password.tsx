import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";

import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 🧠 Validação das senhas
const resetPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "A senha deve ter pelo menos 6 caracteres",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Captura o token da URL manualmente
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("email");

  async function handleResetPassword(data: ResetPasswordForm) {
    if (!token) {
      toast.error("Token inválido ou ausente.");
      return;
    }

    try {
      await axios.post("http://localhost:3333/api/reset-password", {
        token: token, // O token que veio da URL
        password: data.password, // A nova senha validada pelo Zod
      });

      toast.success("Senha redefinida com sucesso!");

      // Redireciona para o login após o sucesso
      setTimeout(() => navigate("/sign-in"), 2000);
    } catch (error) {
      toast.error("Erro ao redefinir a senha. Tente novamente.");
    }
  }

  return (
    <>
      <Helmet>
        <title>Redefinir Senha</title>
      </Helmet>
      <div className="p-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Redefinir senha
          </h1>
          <p className="text-sm text-muted-foreground pb-4">
            Escolha sua nova senha de acesso.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            disabled={isSubmitting}
            className="w-full cursor-pointer"
            type="submit"
          >
            Redefinir senha
          </Button>
        </form>
      </div>
    </>
  );
}
