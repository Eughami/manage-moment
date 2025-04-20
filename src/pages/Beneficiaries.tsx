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
  DialogTrigger,
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
import { Loader2 } from 'lucide-react';
import {
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
  CreateBeneficiary,
  getBeneficiariess,
} from '@/services/beneficiaries';
import { useQuery, useMutation } from '@tanstack/react-query';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';

export interface Beneficiary {
  id: string;
  nom: string;
  address: string;
  tel: string;
}

const defaultFormData: Omit<Beneficiary, 'id'> = {
  nom: '',
  address: '',
  tel: '',
};

const formSchema = z.object({
  nom: z.string().min(2, {
    message: 'Nom must be at least 2 characters.',
  }),
  address: z.string().min(10, {
    message: 'Address number must be at least 10 characters.',
  }),
  tel: z.string().min(2, {
    message: 'Tel must be at least 8 characters.',
  }),
});

const Beneficiaries = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Beneficiary | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [benficiaryToDelete, setBeneficiaryToDelete] =
    useState<Beneficiary | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormData,
    mode: 'onChange',
  });

  const {
    isLoading,
    isFetching,
    data: beneficiairies,
    refetch,
  } = useQuery({
    queryKey: ['beneficiairies'],
    queryFn: getBeneficiariess,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createBeneficiary,
    onSuccess: () => {
      refetch();
      toast.success('Beneficiary added successfully');
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateBeneficiary,
    onSuccess: () => {
      refetch();
      toast.success('Beneficiary updated successfully');
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBeneficiary,
    onSuccess: () => {
      refetch();
      toast.success('Beneficiary deleted successfully');
      setBeneficiaryToDelete(null);
      setDeleteDialogOpen(false);
    },
  });

  const columns = [
    {
      id: 'nom',
      header: 'Nom',
      cell: (item: Beneficiary) => item.nom,
    },
    {
      id: 'address',
      header: 'Address',
      cell: (item: Beneficiary) => item.address,
    },
    {
      id: 'tel',
      header: 'Tel',
      cell: (item: Beneficiary) => item.tel,
    },
  ];

  const onAddNew = () => {
    setSelectedItem(null);
    form.reset(defaultFormData);
    setIsDialogOpen(true);
  };

  const onView = (item: Beneficiary) => {
    setSelectedItem(item);
    form.reset(item);
    setIsDialogOpen(true);
  };

  const onDelete = (item: Beneficiary) => {
    setBeneficiaryToDelete(item);
    setDeleteDialogOpen(true);
  };
  const handleConfirmDelete = () => {
    if (benficiaryToDelete) {
      deleteMutation.mutate(benficiaryToDelete.id);
    }
  };

  const handleSave = (formData: CreateBeneficiary) => {
    if (!formData.nom || !formData.address || !formData.tel) {
      toast.error('All fields are required');
      return;
    }

    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, payload: formData });
    } else {
      const newItem: CreateBeneficiary = {
        nom: formData.nom,
        address: formData.address,
        tel: formData.tel,
      };
      createMutation.mutate(newItem);
    }
  };

  return (
    <div className="page-container">
      <DataTable
        data={beneficiairies?.data || []}
        columns={columns}
        onAddNew={onAddNew}
        onView={onView}
        onDelete={onDelete}
        title="Beneficiaries"
        loading={isFetching || isLoading}
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
              {selectedItem ? 'View/Edit Beneficiary' : 'Add New Beneficiary'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem
                ? 'View or edit beneficiary details.'
                : 'Create a new beneficiary.'}
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
                      <Input placeholder="Beneficiary nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{' '}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Beneficiary address" {...field} />
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
                      <Input placeholder="77....." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={`Delete ${benficiaryToDelete?.nom}`}
        isLoading={deleteMutation.isPending}
        description="Are you sure you want to delete this beneficiary? This action cannot be undone."
      />
    </div>
  );
};

export default Beneficiaries;
