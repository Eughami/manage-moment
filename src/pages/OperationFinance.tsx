import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import {
  createFinance,
  CreateFinance,
  deleteFinance,
  getFinances,
  updateFinance,
} from '@/services/finances';

interface Finance {
  id: string;
  libelle_finan: string;
  depense: number;
  montant_entree: number;
  gain: number; // This is likely calculated (montant_entree - depense)
  observation: string;
  project?: { id: string };
}

// Default form values (empty state for creation)
const defaultFinanceData: CreateFinance = {
  libelle_finan: '',
  depense: 0,
  montant_entree: 0,
  observation: '',
};

interface FinancesProps {
  pid: string;
}
const Finances = ({ pid }: FinancesProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFinance, setSelectedFinance] = useState<Finance | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [financeToDelete, setFinanceToDelete] = useState<Finance | null>(null);

  const isEditMode = !!selectedFinance;

  const financeSchema = z.object({
    libelle_finan: z.string().min(2, 'Label must be at least 2 characters.'),
    depense: z.coerce.number().min(1, 'Depense must be a positive number'),
    montant_entree: z.coerce
      .number()
      .min(1, 'montant_entree must be a positive number'),
    observation: z.string().optional(),
  });

  type FinanceFormData = z.infer<typeof financeSchema>;

  const form = useForm<FinanceFormData>({
    resolver: zodResolver(financeSchema),
    defaultValues: defaultFinanceData,
  });

  const {
    isLoading,
    isFetching,
    data: financesResponse,
    refetch,
  } = useQuery<{ data: Finance[] }>({
    queryKey: ['finances'],
    queryFn: () => getFinances(pid),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!pid,
  });

  const createMutation = useMutation({
    mutationFn: createFinance,
    onSuccess: () => {
      refetch();
      toast.success('Finance entry added successfully');
      setIsDialogOpen(false);
      form.reset(defaultFinanceData);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateFinance,
    onSuccess: () => {
      refetch();
      toast.success('Finance entry updated successfully');
      setIsDialogOpen(false);
      setSelectedFinance(null);
      form.reset(defaultFinanceData);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFinance,
    onSuccess: () => {
      refetch();
      toast.success('Finance entry deleted successfully');
      setFinanceToDelete(null);
      setDeleteDialogOpen(false);
    },
  });

  const columns = [
    {
      id: 'libelle_finan',
      header: 'Label',
      cell: (item: Finance) => item.libelle_finan,
    },
    {
      id: 'depense',
      header: 'Dépense',
      cell: (item: Finance) => item.depense,
    },
    {
      id: 'montant_entree',
      header: 'Montant Entree',
      cell: (item: Finance) => item.montant_entree,
    },
    {
      id: 'gain',
      header: 'Gain',
      cell: (item: Finance) => item.gain,
    },
    {
      id: 'observation',
      header: 'Observation',
      cell: (item: Finance) => item.observation,
    },
  ];

  const onAddNew = () => {
    setSelectedFinance(null);
    form.reset(defaultFinanceData);
    setIsDialogOpen(true);
  };

  const onView = (item: Finance) => {
    setSelectedFinance(item);

    form.reset({
      libelle_finan: item.libelle_finan,
      depense: item.depense,
      montant_entree: item.montant_entree,
      observation: item.observation || '',
    });
    setIsDialogOpen(true);
  };

  const onDelete = (item: Finance) => {
    setFinanceToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (financeToDelete) {
      deleteMutation.mutate(financeToDelete.id);
    }
  };

  const handleSave = (formData: FinanceFormData) => {
    const payload: Omit<Finance, 'id'> = {
      libelle_finan: formData.libelle_finan,
      depense: formData.depense,
      montant_entree: formData.montant_entree,
      observation: formData.observation || '',
      gain: formData.montant_entree - formData.depense,
      project: { id: pid },
    };

    if (isEditMode && selectedFinance) {
      if (Object.keys(payload).length > 0) {
        updateMutation.mutate({ id: selectedFinance.id, payload });
      } else {
        toast.info('No changes detected.');
        setIsDialogOpen(false);
      }
    } else {
      createMutation.mutate(payload as CreateFinance);
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="page-container p-4 md:p-6">
      {/* Added padding */}
      <DataTable
        title="Operations Finance"
        columns={columns}
        data={financesResponse?.data || []}
        onAddNew={onAddNew}
        onView={onView}
        onDelete={onDelete}
        loading={isLoading || isFetching}
      />
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {/* Adjusted max width */}
          {/* Loading overlay during mutation */}
          {isMutating && (
            <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit Finance Entry' : 'Create Finance Entry'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Update the details of this finance record.'
                : 'Add a new finance record to the system.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="libelle_finan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Libelle finance</FormLabel>
                    <FormControl>
                      <Input placeholder="Libelle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="montant_entree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant Entree</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          step="0.01" // Allow cents
                          {...field}
                          onChange={(event) =>
                            field.onChange(event.target.valueAsNumber || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="depense"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Depense </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          {...field}
                          onChange={(event) =>
                            field.onChange(event.target.valueAsNumber || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="observation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observation (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any relevant notes here..."
                        className="resize-y min-h-[80px]" // Allow vertical resize
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isMutating}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isMutating}>
                  {isMutating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isEditMode ? 'Update' : 'Save'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={`Delete Entry: ${financeToDelete?.libelle_finan || ''}`}
        isLoading={deleteMutation.isPending}
        description="Are you sure you want to delete this finance record? This action cannot be undone."
      />
    </div>
  );
};

export default Finances;
