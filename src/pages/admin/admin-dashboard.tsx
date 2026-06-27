import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type User = {
  id: number;
  name: string;
  email: string;
  subscriptionStatus: string | null;
  isLifetime: boolean;
  createdAt: string;
};

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setIsLoading(true);
      const response = await api.get("/api/admin/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("Erro ao buscar usuários. Você tem permissão?");
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleLifetime(userId: number, currentStatus: boolean) {
    try {
      const response = await api.put(`/api/admin/users/${userId}/lifetime`, {
        isLifetime: !currentStatus
      });
      
      setUsers(users.map(u => 
        u.id === userId ? { ...u, isLifetime: response.data.isLifetime } : u
      ));
      
      toast.success("Status atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  }

  return (
    <>
      <Helmet>
        <title>Painel Admin Interno</title>
      </Helmet>

      <div className="flex flex-col gap-6 p-8">
        <h1 className="text-3xl font-bold">Gerenciamento de Usuários (Admin)</h1>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Status (Stripe)</TableHead>
                <TableHead>Cliente Vitalício</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Carregando...</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Nenhum usuário encontrado.</TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.subscriptionStatus === 'active' && <Badge className="bg-emerald-500 hover:bg-emerald-600">Ativo</Badge>}
                      {user.subscriptionStatus === 'past_due' && <Badge variant="destructive">Inadimplente</Badge>}
                      {user.subscriptionStatus === 'canceled' && <Badge variant="secondary">Cancelado</Badge>}
                      {(!user.subscriptionStatus || user.subscriptionStatus === 'incomplete') && <Badge variant="outline">Pendente</Badge>}
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={user.isLifetime}
                        onCheckedChange={() => toggleLifetime(user.id, user.isLifetime)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
