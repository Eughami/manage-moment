import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Project, ProjectStatus, ProjectType } from '@/services/api';
import { toast } from 'sonner';
import { Beneficiary } from '@/pages/Beneficiaries';
import { Expert } from '@/pages/Experts';

const formSchema = z.object({
  // id: z.string().uuid(), // or just z.string() if it's not always a UUID
  nom: z.string().min(1, 'Nom is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['active', 'completed', 'on-hold', 'cancelled']), // assuming these are the possible ProjectStatus values
  type_projet: z.enum(['development', 'design', 'marketing', 'research']), // assuming these are the ProjectType values
  date_acquisition: z.string().min(1, "Date d'acquisition is required"),
  date_debut: z.string().min(1, 'Date de début is required'),
  date_fin: z.string().min(1, 'Date de fin is required'),
  date_cloture: z.string().min(1, 'Date de clôture is required'),
  beneficiaire_id: z.string().uuid('Invalid beneficiary ID'), // assuming it's a UUID
  expert_id: z.string().uuid('Invalid expert ID'), // assuming it's a UUID
  budget: z.coerce.number().min(0, 'Budget must be a positive number'),
});

interface CreateProjectDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  initialData?: Project;
  mode?: 'create' | 'edit';
  beneficiairies: Beneficiary[];
  experts: Expert[];
  loading: boolean;
}

export function CreateProjectDialog({
  open,
  setOpen,
  onSubmit,
  initialData,
  mode = 'create',
  beneficiairies = [],
  experts = [],
  loading = false,
}: CreateProjectDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          nom: initialData.nom,
          description: initialData.description,
          status: initialData.status,
          budget: initialData.budget,
          type_projet: initialData.type_projet,
          beneficiaire_id: initialData.beneficiaire_id,
          expert_id: initialData.expert_id,
          date_acquisition: initialData.date_acquisition,
          date_cloture: initialData.date_cloture,
          date_debut: initialData.date_debut,
          date_fin: initialData.date_fin,
        }
      : {},
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] w-full h-full sm:h-auto max-h-screen sm:max-h-[90vh] flex flex-col p-0">
        <div className="p-6 border-b">
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Create New Project' : 'Edit Project'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create'
                ? 'Add a new project to your dashboard.'
                : 'Edit your project details.'}
            </DialogDescription>
          </DialogHeader>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du Projet</FormLabel>
                    <FormControl>
                      <Input
                        key="nom"
                        placeholder="Enter nom du projet"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter project description"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input
                        key="budget"
                        type="number"
                        placeholder="Enter project budget"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type_projet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="development">
                            Development
                          </SelectItem>
                          <SelectItem key="design" value="design">
                            Design
                          </SelectItem>
                          <SelectItem key="marketing" value="marketing">
                            Marketing
                          </SelectItem>
                          <SelectItem key="research" value="research">
                            Research
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem key="active" value="active">
                            Active
                          </SelectItem>
                          <SelectItem key="completed" value="completed">
                            Completed
                          </SelectItem>
                          <SelectItem key="on-hold" value="on-hold">
                            On Hold
                          </SelectItem>
                          <SelectItem key="cancelled" value="cancelled">
                            Cancelled
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date Fields - One per row */}
                <FormField
                  control={form.control}
                  name="date_acquisition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date d'acquisition</FormLabel>
                      <FormControl>
                        <Input key="d_ac" type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_debut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de début</FormLabel>
                      <FormControl>
                        <Input key="d_db" type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_fin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de fin</FormLabel>
                      <FormControl>
                        <Input key="d_fi" type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_cloture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de clôture</FormLabel>
                      <FormControl>
                        <Input key="d_cl" type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Beneficiaire Select */}
              <FormField
                control={form.control}
                name="beneficiaire_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bénéficiaire</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un bénéficiaire" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {beneficiairies.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expert Select */}
              <FormField
                control={form.control}
                name="expert_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expert</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un expert" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {experts.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? 'Saving...'
                  : mode === 'create'
                  ? 'Create Project'
                  : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
