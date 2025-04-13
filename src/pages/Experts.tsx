
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';

interface Expert {
  id: string;
  name: string;
  specialization: string;
  email: string;
  experience: string;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  specialization: z.string().min(2, { message: 'Specialization must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  experience: z.string().min(1, { message: 'Experience is required.' }),
});

const initialData: Expert[] = [
  { id: '1', name: 'Dr. Jane Wilson', specialization: 'Environmental Science', email: 'jane@example.com', experience: '15 years' },
  { id: '2', name: 'Prof. Robert Chen', specialization: 'Urban Planning', email: 'robert@example.com', experience: '20 years' },
  { id: '3', name: 'Dr. Lisa Rodriguez', specialization: 'Sustainable Energy', email: 'lisa@example.com', experience: '12 years' }
];

const Experts = () => {
  const [experts, setExperts] = useState<Expert[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentExpert, setCurrentExpert] = useState<Expert | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      specialization: '',
      email: '',
      experience: ''
    }
  });

  const columns = [
    {
      id: 'name',
      header: 'Name',
      cell: (expert: Expert) => expert.name
    },
    {
      id: 'specialization',
      header: 'Specialization',
      cell: (expert: Expert) => expert.specialization
    },
    {
      id: 'email',
      header: 'Email',
      cell: (expert: Expert) => expert.email
    },
    {
      id: 'experience',
      header: 'Experience',
      cell: (expert: Expert) => expert.experience
    }
  ];

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentExpert(null);
    form.reset({
      name: '',
      specialization: '',
      email: '',
      experience: ''
    });
    setIsDialogOpen(true);
  };

  const handleView = (expert: Expert) => {
    setIsEditing(true);
    setCurrentExpert(expert);
    form.reset({
      name: expert.name,
      specialization: expert.specialization,
      email: expert.email,
      experience: expert.experience
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (expert: Expert) => {
    setCurrentExpert(expert);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentExpert) {
      setExperts(experts.filter(e => e.id !== currentExpert.id));
      toast.success('Expert deleted successfully');
      setIsDeleteDialogOpen(false);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditing && currentExpert) {
      // Update existing expert
      const updatedExperts = experts.map(e => 
        e.id === currentExpert.id 
          ? { ...e, ...values } 
          : e
      );
      setExperts(updatedExperts);
      toast.success('Expert updated successfully');
    } else {
      // Add new expert
      const newExpert: Expert = {
        id: `${Date.now()}`,
        ...values
      };
      setExperts([...experts, newExpert]);
      toast.success('Expert added successfully');
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="container py-10">
      <DataTable
        data={experts}
        columns={columns}
        onAddNew={handleAddNew}
        onView={handleView}
        onDelete={handleDelete}
        title="Experts"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Expert' : 'Add New Expert'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Edit the expert details below.' 
                : 'Enter the expert details below to add them to the system.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter specialization" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                      <Input placeholder="Years of experience" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">{isEditing ? 'Update' : 'Add'} Expert</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Expert"
        description={`Are you sure you want to delete ${currentExpert?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Experts;
