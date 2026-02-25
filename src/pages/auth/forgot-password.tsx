import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";

import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/axios";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
});

type forgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<forgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function handleForgotPassword(data: forgotPasswordSchema) {
    try {
      await api.post("/forgot-password", {
        email: data.email,
      });

      toast.success(
        "Um link de redefinição de senha foi enviado para o seu e-mail.",
      );
    } catch (error: any) {
      toast.error("Erro ao processar solicitação. Tente novamente.");
    }
  }

  return (
    <>
      <Helmet>
        <title>Esqueci minha senha</title>
      </Helmet>
      <div className="p-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Recuperar acesso
          </h1>
          <p className="space-y-4 text-sm text-muted-foreground">
            Informe seu e-mail para receber um link de redefinição de senha.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="space-y-4"
        >
          <div className="space-y-4 pt-5">
            <Input
              placeholder="Digite o seu e-mail"
              id="email"
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <Button
            disabled={isSubmitting}
            className="w-full cursor-pointer"
            type="submit"
          >
            Enviar link
          </Button>
          <a
            href="/sign-in"
            className="text-blue-500 text-sm hover:underline block text-center mt-4"
          >
            Retornar à página de login
          </a>
        </form>
      </div>
    </>
  );
}
