import React, { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  getExperts,
  createExpert,
  updateExpert,
  deleteExpert,
  CreateExpert,
} from '@/services/experts';
import { useQuery, useMutation } from '@tanstack/react-query';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Loader2 } from 'lucide-react';

export interface Expert {
  id: string;
  nom: string;
  specialite: string;
  tel: string;
}

const defaultFormData: Omit<Expert, 'id'> = {
  nom: '',
  specialite: '',
  tel: '',
};

const formSchema = z.object({
  nom: z.string().min(2, {
    message: 'Nom must be at least 2 characters.',
  }),
  specialite: z.string().min(2, {
    message: 'Specialite must be at least 2 characters.',
  }),
  tel: z.string().min(2, {
    message: 'Telephone must be at least 8 characters.',
  }),
});

const Experts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Expert | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expertToDelete, setExpertToDelete] = useState<Expert | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormData,
    mode: 'onChange',
  });

  const {
    isLoading,
    isFetching,
    data: experts,
    refetch,
  } = useQuery({
    queryKey: ['experts'],
    queryFn: getExperts,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createExpert,
    onSuccess: () => {
      refetch();
      toast.success('Expert added successfully');
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateExpert,
    onSuccess: () => {
      refetch();
      toast.success('Expert updated successfully');
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpert,
    onSuccess: () => {
      refetch();
      toast.success('Expert deleted successfully');
      setExpertToDelete(null);
      setDeleteDialogOpen(false);
    },
  });

  const columns = [
    {
      id: 'nom',
      header: 'Name',
      cell: (item: Expert) => item.nom,
    },
    {
      id: 'specialite',
      header: 'Specialite',
      cell: (item: Expert) => item.specialite,
    },
    {
      id: 'tel',
      header: 'Tel',
      cell: (item: Expert) => item.tel,
    },
  ];

  const handleAddNew = () => {
    setSelectedItem(null);
    form.reset(defaultFormData);
    setIsDialogOpen(true);
  };

  const handleView = (item: Expert) => {
    setSelectedItem(item);
    form.reset(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (item: Expert) => {
    setExpertToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (expertToDelete) {
      deleteMutation.mutate(expertToDelete.id);
    }
  };

  const handleSave = (formData: CreateExpert) => {
    if (!formData.nom || !formData.specialite || !formData.tel) {
      toast.error('All fields are required');
      return;
    }

    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, payload: formData });
    } else {
      const newItem: CreateExpert = {
        nom: formData.nom,
        specialite: formData.specialite,
        tel: formData.tel,
      };
      createMutation.mutate(newItem);
    }
  };

  return (
    <div className="page-container">
      <DataTable
        title="Experts"
        columns={columns}
        data={experts?.data || []}
        onAddNew={handleAddNew}
        onView={handleView}
        onDelete={handleDelete}
        loading={isLoading || isFetching}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {(createMutation.isPending || updateMutation.isPending) && (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-md">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'View/Edit Expert' : 'Add New Expert'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem
                ? 'Update expert details.'
                : 'Add a new expert to the list.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Expert nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialite</FormLabel>
                    <FormControl>
                      <Input placeholder="Specialite" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tel</FormLabel>
                    <FormControl>
                      <Input placeholder="77 .. .. .. " {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {selectedItem ? 'Update Expert' : 'Add Expert'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={`Delete ${expertToDelete?.nom}`}
        isLoading={deleteMutation.isPending}
        description="Are you sure you want to delete this expert? This action cannot be undone."
      />
    </div>
  );
};

export default Experts;
