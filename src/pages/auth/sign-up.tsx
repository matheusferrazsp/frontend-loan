import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";

const SignUpForm = z
  .object({
    name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "E-mail inválido" }),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof SignUpForm>;

export function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(SignUpForm),
  });

  async function handleRegister(data: SignUpForm) {
    try {
      await api.post("/users", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // Auto login
      const loginResp = await api.post("/login", {
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("token", loginResp.data.token);
      localStorage.setItem("user", JSON.stringify(loginResp.data.user));

      toast.success("Conta criada! Seu teste grátis de 3 dias começou!");
      
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Este e-mail já está em uso.");
      } else {
        toast.error("Erro ao realizar cadastro. Tente novamente.");
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Cadastro - Teste Grátis</title>
      </Helmet>

      <div className="p-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
          <p className="text-sm text-muted-foreground pb-4">
            Cadastre-se e inicie seu teste grátis de 3 dias no VeroFlux!
          </p>
        </div>
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Seu nome completo</Label>
            <Input id="name" type="text" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Seu e-mail</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Sua senha</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

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

          <Button
            disabled={isSubmitting}
            className="w-full cursor-pointer mt-4"
            type="submit"
          >
            Criar Conta e Iniciar Teste (3 Dias Grátis)
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
