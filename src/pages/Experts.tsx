
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
    setIsDialogOpen(true);
    form.reset();
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newExpert = {
      id: `${Date.now()}`,
      ...values
    };
    
    setExperts([...experts, newExpert]);
    setIsDialogOpen(false);
    toast.success('Expert added successfully');
  };

  return (
    <div className="container py-10">
      <DataTable
        data={experts}
        columns={columns}
        onAddNew={handleAddNew}
        title="Experts"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expert</DialogTitle>
            <DialogDescription>
              Enter the expert details below to add them to the system.
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
                <Button type="submit">Add Expert</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Experts;
