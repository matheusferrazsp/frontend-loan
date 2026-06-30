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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";

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
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "", subscriptionStatus: "" });
  const [isSaving, setIsSaving] = useState(false);

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

  async function handleDeleteUser(userId: number) {
    if (!window.confirm("Tem certeza que deseja excluir este usuário? Todos os clientes e pagamentos dele serão apagados permanentemente.")) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      toast.success("Usuário excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir usuário");
    }
  }

  function openEditModal(user: User) {
    setUserToEdit(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      subscriptionStatus: user.subscriptionStatus || "incomplete"
    });
  }

  async function handleSaveEdit() {
    if (!userToEdit) return;
    try {
      setIsSaving(true);
      const response = await api.put(`/api/admin/users/${userToEdit.id}`, editFormData);
      
      setUsers(users.map(u => 
        u.id === userToEdit.id ? { ...u, ...response.data } : u
      ));
      
      toast.success("Usuário atualizado com sucesso!");
      setUserToEdit(null);
    } catch (error) {
      toast.error("Erro ao atualizar usuário");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Painel Admin Interno</title>
      </Helmet>

      <div className="flex flex-col gap-6 w-full">
        <h1 className="text-3xl font-bold">Gerenciamento de Usuários (Admin)</h1>
        
        <div className="border rounded-md overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Status (Stripe)</TableHead>
                <TableHead>Cliente Vitalício</TableHead>
                <TableHead className="text-right">Ações</TableHead>
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
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditModal(user)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Modal de Edição */}
        <Dialog open={!!userToEdit} onOpenChange={(open) => !open && setUserToEdit(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status da Assinatura</Label>
                <Select
                  value={editFormData.subscriptionStatus}
                  onValueChange={(val) => setEditFormData({ ...editFormData, subscriptionStatus: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="trialing">Teste Grátis</SelectItem>
                    <SelectItem value="past_due">Inadimplente</SelectItem>
                    <SelectItem value="canceled">Cancelado</SelectItem>
                    <SelectItem value="incomplete">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUserToEdit(null)} disabled={isSaving}>Cancelar</Button>
              <Button onClick={handleSaveEdit} disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
