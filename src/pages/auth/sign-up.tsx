// Importa o resolver do Zod para conectar validação com react-hook-form
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
// Importa o Zod para fazer validação de dados
import { z } from "zod";

import { Helmet } from "react-helmet-async";
// Importa funções e tipos do react-hook-form para lidar com formulários
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";

// 1. Cria o schema de validação com Zod
const SignUpForm = z
  .object({
    name: z
      .string()
      .min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "E-mail inválido" }),
    password: z
      .string()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// Usa o prório schema do Zod para gerar o tipo TypeScript
type SignUpForm = z.infer<typeof SignUpForm>;

// 3. Componente de Registro
export function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit, // Envia o formulário com os dados validados
    formState: { isSubmitting, errors }, // Controla estado de envio e erros de validação
  } = useForm<SignUpForm>({
    resolver: zodResolver(SignUpForm), // conecta o schema do Zod ao formulário
  });

  // 4. Função chamada quando o formulário é enviado com sucesso
  async function handleRegister(data: SignUpForm) {
    try {
      await api.post("/api/users", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success("Cadastro realizado com sucesso!", {
        action: {
          label: "Login",
          onClick: () => {
            navigate("/sign-in");
          },
        },
      });

      setTimeout(() => navigate("/sign-in"), 2000);
    } catch (error: any) {
      // Trata erro de email duplicado (409) que configuramos no back-end
      if (error.response?.status === 409) {
        toast.error("Este e-mail já está em uso.");
      } else {
        toast.error("Erro ao realizar cadastro. Tente novamente.");
      }
    }
  }

  // 5. Retorno do JSX (interface visual do login)
  return (
    <>
      <Helmet>
        <title>Cadastro de usuário</title>
      </Helmet>

      <div className="p-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
          <p className="text-sm text-muted-foreground pb-4">
            Preencha os dados para criar a sua conta.
          </p>
        </div>
        {/* Formulário */}
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
          {/* Campo de nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Seu nome e sobrenome</Label>
            <Input id="name" type="text" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Campo de email */}
          <div className="space-y-2">
            <Label htmlFor="email">Seu e-mail</Label>
            <Input id="name" type="text" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Campo de senha */}
          <div className="space-y-2">
            <Label htmlFor="password">Sua senha</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* confirmação de senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirme a sua senha</Label>
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

          {/* Botão de envio de formulário */}
          <Button
            disabled={isSubmitting}
            className="w-full cursor-pointer"
            type="submit"
          >
            Criar conta
          </Button>
          <p className="text-sm text-muted-foreground text-center pt-4">
            Já tem uma conta?{" "}
            <a href="/sign-in" className="text-blue-500 hover:underline">
              Faça login
            </a>
          </p>
        </form>
      </div>
    </>
  );
}
