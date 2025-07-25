import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, UserPlus, Users as UsersIcon, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import UserForm from '@/components/UserForm';
import ChangePasswordForm from '@/components/ChangePasswordForm';

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const initialUsers = [
    { id: '0', name: 'Sall', email: 'sall@gmail.com', role: 'admin', status: 'active', joinedDate: '2024-01-01', password: 'sall123' },
    { id: '1', name: 'Aminata Diop', email: 'aminata.diop@example.com', role: 'admin', status: 'active', joinedDate: '2024-01-15', password: 'password123' },
    { id: '2', name: 'Moussa Traoré', email: 'moussa.traore@example.com', role: 'editor', status: 'active', joinedDate: '2024-02-20', password: 'password123' },
    { id: '3', name: 'Fatou Ndiaye', email: 'fatou.ndiaye@example.com', role: 'viewer', status: 'inactive', joinedDate: '2024-03-10', password: 'password123' },
    { id: '4', name: 'Samba Fall', email: 'samba.fall@example.com', role: 'editor', status: 'pending', joinedDate: '2024-04-05', password: 'password123' },
  ];

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users, isLoading]);

  const handleAddUser = () => {
    setCurrentUser(null);
    setIsUserFormOpen(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setIsUserFormOpen(true);
  };

  const handleChangePassword = (user) => {
    setCurrentUser(user);
    setIsPasswordFormOpen(true);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé avec succès.",
    });
  };

  const handleSubmitUser = (formData) => {
    if (currentUser) {
      setUsers(users.map(user => 
        user.id === currentUser.id ? { ...currentUser, ...formData } : user
      ));
      toast({ title: "Utilisateur mis à jour", description: "Les informations de l'utilisateur ont été mises à jour." });
    } else {
      const newUser = {
        ...formData,
        id: Date.now().toString(),
        joinedDate: new Date().toISOString().split('T')[0] 
      };
      setUsers([...users, newUser]);
      toast({ title: "Utilisateur créé", description: "Le nouvel utilisateur a été ajouté avec succès." });
    }
    setIsUserFormOpen(false);
  };

  const handlePasswordChangeSubmit = (userId, newPassword) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, password: newPassword } : user
    ));
    toast({ title: "Mot de passe modifié", description: "Le mot de passe de l'utilisateur a été modifié." });
    setIsPasswordFormOpen(false);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleMap = { admin: 'Administrateur', editor: 'Éditeur', viewer: 'Lecteur' };
  const statusMap = { active: 'Actif', inactive: 'Inactif', pending: 'En attente' };
  
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h2>
          <p className="text-muted-foreground">Gérez les utilisateurs et leurs rôles dans l'application.</p>
        </div>
        <Button onClick={handleAddUser} className="sm:w-auto w-full">
          <UserPlus className="mr-2 h-4 w-4" /> Ajouter un utilisateur
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
      ) : filteredUsers.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-sm rounded-lg border"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{roleMap[user.role] || user.role}</TableCell>
                  <TableCell><Badge variant={getStatusBadgeVariant(user.status)}>{statusMap[user.status] || user.status}</Badge></TableCell>
                  <TableCell>{new Date(user.joinedDate).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)} title="Modifier l'utilisateur">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleChangePassword(user)} title="Changer le mot de passe">
                        <KeyRound className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" title="Supprimer l'utilisateur" disabled={user.email === 'sall@gmail.com'}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. L'utilisateur "{user.name}" sera définitivement supprimé.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Supprimer</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      ) : (
         <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-lg border shadow-sm p-6">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <UsersIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Aucun utilisateur trouvé</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm 
              ? "Aucun utilisateur ne correspond à votre recherche." 
              : "Commencez par ajouter votre premier utilisateur."}
          </p>
           {!searchTerm && (
             <Button onClick={handleAddUser} className="mt-4">
                <UserPlus className="mr-2 h-4 w-4" /> Ajouter un utilisateur
            </Button>
           )}
        </div>
      )}

      <Dialog open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentUser ? 'Modifier l\'utilisateur' : 'Ajouter un nouvel utilisateur'}</DialogTitle>
          </DialogHeader>
          <UserForm user={currentUser} onSubmit={handleSubmitUser} onCancel={() => setIsUserFormOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordFormOpen} onOpenChange={setIsPasswordFormOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Changer le mot de passe de {currentUser?.name}</DialogTitle>
          </DialogHeader>
          <ChangePasswordForm 
            userId={currentUser?.id} 
            onSubmit={handlePasswordChangeSubmit} 
            onCancel={() => setIsPasswordFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;