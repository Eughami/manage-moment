
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

interface Beneficiary {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters.' }),
  location: z.string().min(2, { message: 'Location must be at least 2 characters.' })
});

const initialData: Beneficiary[] = [
  { id: '1', name: 'John Smith', email: 'john@example.com', phone: '123-456-7890', location: 'New York, NY' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '234-567-8901', location: 'Chicago, IL' },
  { id: '3', name: 'Michael Brown', email: 'michael@example.com', phone: '345-678-9012', location: 'Los Angeles, CA' }
];

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBeneficiary, setCurrentBeneficiary] = useState<Beneficiary | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      location: ''
    }
  });

  const columns = [
    {
      id: 'name',
      header: 'Name',
      cell: (beneficiary: Beneficiary) => beneficiary.name
    },
    {
      id: 'email',
      header: 'Email',
      cell: (beneficiary: Beneficiary) => beneficiary.email
    },
    {
      id: 'phone',
      header: 'Phone',
      cell: (beneficiary: Beneficiary) => beneficiary.phone
    },
    {
      id: 'location',
      header: 'Location',
      cell: (beneficiary: Beneficiary) => beneficiary.location
    }
  ];

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentBeneficiary(null);
    form.reset({
      name: '',
      email: '',
      phone: '',
      location: ''
    });
    setIsDialogOpen(true);
  };

  const handleView = (beneficiary: Beneficiary) => {
    setIsEditing(true);
    setCurrentBeneficiary(beneficiary);
    form.reset({
      name: beneficiary.name,
      email: beneficiary.email,
      phone: beneficiary.phone,
      location: beneficiary.location
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (beneficiary: Beneficiary) => {
    setCurrentBeneficiary(beneficiary);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentBeneficiary) {
      setBeneficiaries(beneficiaries.filter(b => b.id !== currentBeneficiary.id));
      toast.success('Beneficiary deleted successfully');
      setIsDeleteDialogOpen(false);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditing && currentBeneficiary) {
      // Update existing beneficiary
      const updatedBeneficiaries = beneficiaries.map(b => 
        b.id === currentBeneficiary.id 
          ? { ...b, ...values } 
          : b
      );
      setBeneficiaries(updatedBeneficiaries);
      toast.success('Beneficiary updated successfully');
    } else {
      // Add new beneficiary
      const newBeneficiary: Beneficiary = {
        id: `${Date.now()}`,
        ...values
      };
      setBeneficiaries([...beneficiaries, newBeneficiary]);
      toast.success('Beneficiary added successfully');
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="container py-10">
      <DataTable
        data={beneficiaries}
        columns={columns}
        onAddNew={handleAddNew}
        onView={handleView}
        onDelete={handleDelete}
        title="Beneficiaries"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Beneficiary' : 'Add New Beneficiary'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Edit the beneficiary details below.' 
                : 'Enter the beneficiary details below to add them to the system.'}
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">{isEditing ? 'Update' : 'Add'} Beneficiary</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Beneficiary"
        description={`Are you sure you want to delete ${currentBeneficiary?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Beneficiaries;
