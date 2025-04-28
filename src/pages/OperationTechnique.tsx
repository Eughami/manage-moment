import { useState, useMemo } from 'react';
import { DataTable } from '@/components/DataTable'; // Assuming reusable DataTable
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'; // For Date Picker
import { Calendar } from '@/components/ui/calendar'; // For Date Picker
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // For Expert selection
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; // Added useQueryClient
import { Loader2, CalendarIcon } from 'lucide-react'; // Added CalendarIcon
import { format } from 'date-fns'; // For date formatting
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import {
  createTechnique,
  deleteTechnique,
  getTechniques,
  updateTechnique,
  CreateTechnique, // Import CreateTechnique type
  UpdateTechnique, // Import UpdateTechniquePayload type
} from '@/services/techniques';
import { getExperts } from '@/services/experts';
import { Expert } from './Experts';

export interface Technique {
  id: string;
  libelle: string;
  date_debut: string;
  date_fin: string;
  project?: { id: string };
  expert?: Partial<Expert>;
}

const defaultTechniqueData: {
  libelle: string;
  date_debut: string;
  date_fin: string;
  expert_id: string;
} = {
  libelle: '',
  date_debut: undefined,
  date_fin: undefined,
  expert_id: '',
};

interface TechniquesProps {
  pid: string; // Project ID
}

const Techniques = ({ pid }: TechniquesProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [techniqueToDelete, setTechniqueToDelete] = useState<Technique | null>(
    null
  );

  const isEditMode = !!selectedTechnique;

  const techniqueSchema = z.object({
    libelle: z.string().min(2, 'libelle must be at least 2 characters.'),
    date_debut: z.string().min(2, 'Date debut is required'),
    date_fin: z.string().min(2, 'date fin is required'),
    expert_id: z.string().uuid('Invalid expert ID'), // assuming it's a UUID
  });

  // Type for the form data based on the schema
  type TechniqueFormData = z.infer<typeof techniqueSchema>;

  // React Hook Form setup
  const form = useForm<TechniqueFormData>({
    resolver: zodResolver(techniqueSchema),
    defaultValues: defaultTechniqueData,
  });

  // Fetch Techniques data using TanStack Query, scoped by project ID (pid)
  const {
    isLoading,
    isFetching,
    data: techniques,
    refetch,
  } = useQuery<{ data: Technique[] }>({
    queryKey: ['techniques', pid],
    queryFn: () => getTechniques(pid), // Pass pid to the fetch function
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!pid,
  });

  const {
    data: experts,
    isLoading: exLoading,
    isFetching: exFetching,
  } = useQuery({
    queryKey: ['experts'],
    queryFn: getExperts,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Mutation for creating a technique entry
  const createMutation = useMutation({
    mutationFn: createTechnique,
    onSuccess: () => {
      refetch();
      toast.success('Technique entry added successfully');
      setIsDialogOpen(false);
      form.reset(defaultTechniqueData);
    },
  });

  // Mutation for updating a technique entry
  const updateMutation = useMutation({
    mutationFn: updateTechnique,
    onSuccess: () => {
      refetch();
      toast.success('Technique entry updated successfully');
      setIsDialogOpen(false);
      setSelectedTechnique(null);
      form.reset(defaultTechniqueData);
    },
  });

  // Mutation for deleting a technique entry
  const deleteMutation = useMutation({
    mutationFn: deleteTechnique,
    onSuccess: () => {
      refetch();
      toast.success('Technique entry deleted successfully');
      setTechniqueToDelete(null);
      setDeleteDialogOpen(false);
    },
  });

  // Define columns for the DataTable, using useMemo
  const columns = [
    {
      id: 'libelle',
      header: 'Libelle',
      cell: (item: Technique) => item.libelle,
    },
    {
      id: 'date_debut',
      header: 'Date Debut',
      cell: (item: Technique) => item.date_debut.split('T')[0],
    },
    {
      id: 'date_fin',
      header: 'Date Fin',
      cell: (item: Technique) => item.date_fin.split('T')[0],
    },
    {
      id: 'expert.name',
      header: 'Expert',
      cell: (item: Technique) => item.expert?.nom,
    },
  ];

  // Handler for opening the dialog in "Add New" mode
  const onAddNew = () => {
    setSelectedTechnique(null);
    form.reset(defaultTechniqueData); // Reset form with defaults
    setIsDialogOpen(true);
  };

  // Handler for opening the dialog in "Edit/View" mode
  const onView = (item: Technique) => {
    setSelectedTechnique(item);
    form.reset({
      libelle: item.libelle,
      date_debut: item.date_debut,
      date_fin: item.date_fin,
      expert_id: item.expert?.id || '',
    });
    setIsDialogOpen(true);
  };

  // Handler for initiating the delete process
  const onDelete = (item: Technique) => {
    setTechniqueToDelete(item);
    setDeleteDialogOpen(true);
  };

  // Handler for confirming deletion
  const handleConfirmDelete = () => {
    if (techniqueToDelete) {
      deleteMutation.mutate(techniqueToDelete.id);
    }
  };

  // Handler for submitting the form (Create or Update)
  const handleSave = (formData: TechniqueFormData) => {
    // Construct payload, including nested project and expert objects
    const payload: Omit<Technique, 'id'> = {
      libelle: formData.libelle,
      date_debut: formData.date_debut,
      date_fin: formData.date_fin,
      project: { id: pid }, // Link to the current project
      expert: { id: formData.expert_id }, // Link to the selected expert
    };

    if (isEditMode && selectedTechnique) {
      updateMutation.mutate({ id: selectedTechnique.id, payload });
    } else {
      // Create new entry - Ensure payload matches CreateTechnique expectation
      createMutation.mutate(payload as CreateTechnique);
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;
  const loading = isLoading || isFetching || exFetching || exLoading;
  return (
    <div className="page-container p-4 md:p-6">
      <DataTable
        title="Operations Technique"
        columns={columns}
        data={techniques?.data || []} // Use fetched data
        onAddNew={onAddNew}
        onView={onView}
        onDelete={onDelete}
        loading={loading}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {isMutating && (
            <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit Technique Entry' : 'Create Technique Entry'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Update the details of this technical record.'
                : 'Add a new technical record for this project.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="libelle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Initial Assessment, Phase 1 Setup"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expert Selection Dropdown */}
              <FormField
                control={form.control}
                name="expert_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expert</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value} // Controlled component
                      disabled={isMutating || loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loading
                                ? 'Loading experts...'
                                : 'Select an expert'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {experts?.data && experts.data.length > 0 ? (
                          experts.data.map((expert: Expert) => (
                            <SelectItem key={expert.id} value={expert.id}>
                              {expert.nom}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-experts" disabled>
                            {loading ? 'Loading...' : 'No experts found'}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Pickers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date_debut"
                  render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                      {/* Added pt-2 for alignment */}
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={`w-full pl-3 text-left font-normal ${
                                !field.value && 'text-muted-foreground'
                              }`}
                              disabled={isMutating}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={(d) => field.onChange(d.toISOString())}
                            disabled={(date) =>
                              date < new Date('1900-01-01') || isMutating
                            } // Example disable logic
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date_fin"
                  render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={`w-full pl-3 text-left font-normal ${
                                !field.value && 'text-muted-foreground'
                              }`}
                              disabled={isMutating}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={(d) => field.onChange(d.toISOString())}
                            // Optionally disable dates before start date
                            disabled={(date) =>
                              (form.getValues('date_debut') &&
                                date <
                                  new Date(form.getValues('date_debut'))) ||
                              isMutating
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isMutating}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isMutating || loading}>
                  {isMutating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isEditMode ? 'Update Technique' : 'Save Technique'}
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
        title={`Delete Technique: ${techniqueToDelete?.libelle || ''}`}
        isLoading={deleteMutation.isPending}
        description="Are you sure you want to delete this technical record? This action cannot be undone."
      />
    </div>
  );
};

export default Techniques;
