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

// ✅ 1. Cria o schema de validação com Zod
const signInForm = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

// ✅ 2. Gera o tipo TypeScript com base no schema
type SignInForm = z.infer<typeof signInForm>;

// ✅ 3. Componente de Login
export function SignIn() {
  const navigate = useNavigate();
  // useForm configura o formulário com os tipos e a validação do Zod
  const {
    register,
    handleSubmit, // Envia o formulário com os dados validados
    formState: { isSubmitting, errors }, // Controla estado de envio e erros de validação
  } = useForm<SignInForm>({
    resolver: zodResolver(signInForm), // conecta o schema do Zod ao formulário
  });

  // ✅ 4. Função chamada quando o formulário é enviado com sucesso
  async function handleSignIn(data: SignInForm) {
    try {
      await axios.post("http://localhost:3333/api/login", {
        email: data.email,
        password: data.password,
      });

      toast.success(
        "Login realizado com sucesso! Redirecionando para o seu Dashboard.",
        {
          action: {
            label: "Ir para o Dashboard",
            onClick: () => {
              navigate("/");
            },
          },
        },
      );
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Credenciais inválidas.");
      } else {
        toast.error("Erro ao realizar login. Tente novamente.");
      }
    }
  }

  // ✅ 5. Retorno do JSX (interface visual do login)
  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <div className="p-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Acessar Painel
          </h1>
          <p className="text-sm text-muted-foreground pb-4">
            Acompanhe seus empréstimos no seu dashboard.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
          {/* Campo de e-mail */}
          <div className="space-y-2">
            <Label htmlFor="email">Seu e-mail</Label>
            <Input id="email" type="email" {...register("email")} />
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

          {/* Botão de enviar */}
          <Button
            disabled={isSubmitting}
            className="w-full cursor-pointer"
            type="submit"
          >
            Acessar Painel
          </Button>
          <p className="text-center text-sm">
            <a
              href="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Esqueci minha senha
            </a>
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Não tem uma conta?{" "}
            <a href="/sign-up" className="text-blue-500 hover:underline">
              Crie uma conta
            </a>
          </p>
        </form>
      </div>
    </>
  );
}
