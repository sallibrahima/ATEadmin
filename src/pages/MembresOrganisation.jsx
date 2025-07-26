import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users as UsersIcon, Plus, Edit, Trash2, Search, Eye, MoreVertical } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription as AlertDesc,
  AlertDialogFooter as AlertDFooter,
  AlertDialogHeader as AlertDHeader,
  AlertDialogTitle as AlertDTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import MembresForm from '@/components/event/MembresForm';
import MembresDetailModal from '@/components/event/MembresDetailModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MembresOrganisation = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentMember, setCurrentMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedMembers = JSON.parse(localStorage.getItem('organisationMembers') || '[]');
    setMembers(storedMembers);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('organisationMembers', JSON.stringify(members));
    }
  }, [members, isLoading]);

  const handleAddMember = () => {
    setCurrentMember(null);
    setIsFormDialogOpen(true);
  };

  const handleEditMember = (member) => {
    setCurrentMember(member);
    setIsFormDialogOpen(true);
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setIsDetailModalOpen(true);
  };

  const handleDeleteMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
    toast({ title: "Membre supprimé", description: "Le membre a été retiré de l'organisation." });
  };

  const handleSubmitMember = (formData) => {
    if (currentMember) {
      setMembers(members.map(m =>
        m.id === currentMember.id
          ? { ...formData, id: m.id, registrationDate: m.registrationDate }
          : m
      ));
      toast({ title: "Membre mis à jour", description: "Les informations du membre ont été modifiées." });
    } else {
      setMembers([
        ...members,
        {
          ...formData,
          id: Date.now().toString(),
          registrationDate: new Date().toISOString()
        }
      ]);
      toast({ title: "Membre ajouté", description: "Le nouveau membre a été ajouté à l'organisation." });
    }
    setIsFormDialogOpen(false);
  };

  const filteredMembers = members.filter(m =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone?.includes(searchTerm) ||
    m.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Membres</h2>
          <p className="text-muted-foreground">Gérez les membres de votre organisation.</p>
        </div>
        <Button onClick={handleAddMember} className="sm:w-auto w-full">
          <Plus className="mr-2 h-4 w-4" /> Ajouter
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom, email, téléphone..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredMembers.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card shadow-sm rounded-lg border overflow-x-auto"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Nom</TableHead>
                <TableHead className="min-w-[200px]">Email</TableHead>
                <TableHead className="min-w-[150px]">Téléphone</TableHead>
                <TableHead className="min-w-[200px]">Adresse</TableHead>
                <TableHead className="text-right min-w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map(m => (
                <TableRow key={m.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium py-3" onClick={() => handleViewMember(m)}>{m.name}</TableCell>
                  <TableCell onClick={() => handleViewMember(m)}>{m.email}</TableCell>
                  <TableCell onClick={() => handleViewMember(m)}>{m.phone}</TableCell>
                  <TableCell onClick={() => handleViewMember(m)}>{m.address}</TableCell>
                  <TableCell className="text-right py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewMember(m)}>
                          <Eye className="mr-2 h-4 w-4" /> Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditMember(m)}>
                          <Edit className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDHeader>
                              <AlertDTitle>Supprimer {m.name} ?</AlertDTitle>
                              <AlertDesc>Cette action est irréversible.</AlertDesc>
                            </AlertDHeader>
                            <AlertDFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteMember(m.id)} className="bg-destructive hover:bg-destructive/90">
                                Supprimer
                              </AlertDialogAction>
                            </AlertDFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-card rounded-lg border shadow-sm p-6">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <UsersIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Aucun membre trouvé</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm ? "Aucun membre ne correspond à vos filtres." : "Commencez par ajouter des membres."}
          </p>
          <Button onClick={handleAddMember} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un membre
          </Button>
        </div>
      )}

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentMember ? 'Modifier le membre' : 'Ajouter un membre'}</DialogTitle>
          </DialogHeader>
          <MembresForm
            member={currentMember}
            onSubmit={handleSubmitMember}
            onCancel={() => setIsFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <MembresDetailModal
        member={selectedMember}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        organisationName="Nom de votre organisation"
      />
    </div>
  );
};

export default MembresOrganisation;
