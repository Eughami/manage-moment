
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  role: z.string({ required_error: 'Please select a role.' }),
  status: z.string({ required_error: 'Please select a status.' }),
});

const initialData: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Project Manager', email: 'manager@example.com', role: 'Manager', status: 'Active' },
  { id: '3', name: 'Viewer Account', email: 'viewer@example.com', role: 'Viewer', status: 'Inactive' }
];

const Users = () => {
  const [users, setUsers] = useState<User[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      status: ''
    }
  });

  const columns = [
    {
      id: 'name',
      header: 'Name',
      cell: (user: User) => user.name
    },
    {
      id: 'email',
      header: 'Email',
      cell: (user: User) => user.email
    },
    {
      id: 'role',
      header: 'Role',
      cell: (user: User) => user.role
    },
    {
      id: 'status',
      header: 'Status',
      cell: (user: User) => (
        <span className={user.status === 'Active' ? 'text-green-500' : 'text-red-500'}>
          {user.status}
        </span>
      )
    }
  ];

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentUser(null);
    form.reset({
      name: '',
      email: '',
      role: '',
      status: ''
    });
    setIsDialogOpen(true);
  };

  const handleView = (user: User) => {
    setIsEditing(true);
    setCurrentUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentUser) {
      setUsers(users.filter(u => u.id !== currentUser.id));
      toast.success('User deleted successfully');
      setIsDeleteDialogOpen(false);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditing && currentUser) {
      // Update existing user
      const updatedUsers = users.map(u => 
        u.id === currentUser.id 
          ? { ...u, ...values } 
          : u
      );
      setUsers(updatedUsers);
      toast.success('User updated successfully');
    } else {
      // Add new user
      const newUser: User = {
        id: `${Date.now()}`,
        ...values
      };
      setUsers([...users, newUser]);
      toast.success('User added successfully');
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="container py-10">
      <DataTable
        data={users}
        columns={columns}
        onAddNew={handleAddNew}
        onView={handleView}
        onDelete={handleDelete}
        title="Users"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Edit the user details below.' 
                : 'Enter the user details below to add them to the system.'}
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Viewer">Viewer</SelectItem>
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
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">{isEditing ? 'Update' : 'Add'} User</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete User"
        description={`Are you sure you want to delete ${currentUser?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Users;
