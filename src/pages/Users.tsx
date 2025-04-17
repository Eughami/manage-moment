
import React, { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  status: string;
}

const defaultFormData: Omit<User, 'id'> = {
  name: '',
  role: '',
  email: '',
  status: ''
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  status: z.string().min(2, {
    message: "Status must be at least 2 characters.",
  }),
})

const Users = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [items, setItems] = useState<User[]>([
    {
      id: 'user-1',
      name: 'John Doe',
      role: 'Admin',
      email: 'john.doe@example.com',
      status: 'Active',
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      role: 'Editor',
      email: 'jane.smith@example.com',
      status: 'Inactive',
    },
  ]);
  const [selectedItem, setSelectedItem] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormData,
  })

  const columns = [
    {
      id: 'name',
      header: 'Name',
      cell: (item: User) => item.name,
    },
    {
      id: 'role',
      header: 'Role',
      cell: (item: User) => item.role,
    },
    {
      id: 'email',
      header: 'Email',
      cell: (item: User) => item.email,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (item: User) => item.status,
    },
  ];

  const onAddNew = () => {
    setSelectedItem(null);
    form.reset(defaultFormData);
    setIsDialogOpen(true);
  };

  const onView = (item: User) => {
    setSelectedItem(item);
    form.reset(item);
    setIsDialogOpen(true);
  };

  const onDelete = (item: User) => {
    setUserToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setItems(items.filter((i) => i.id !== userToDelete.id));
      toast.success('User deleted successfully');
      setUserToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleSave = (formData: Partial<User>) => {
    if (!formData.name || !formData.email || !formData.role || !formData.status) {
      toast.error("All fields are required");
      return;
    }
    
    if (selectedItem) {
      const updatedData = items.map(item =>
        item.id === selectedItem.id ? { ...item, ...formData } : item
      );
      setItems(updatedData);
      toast.success("User updated successfully");
    } else {
      const newItem: User = {
        id: `user-${items.length + 1}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status
      };
      setItems([...items, newItem]);
      toast.success("User added successfully");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="page-container">
      <DataTable
        title="Users"
        columns={columns}
        data={items}
        onAddNew={onAddNew}
        onView={onView}
        onDelete={onDelete}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit User' : 'Create User'}</DialogTitle>
            <DialogDescription>
              {selectedItem ? 'Update user details.' : 'Add a new user to the list.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="User name" {...field} />
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
                      <Input placeholder="user@example.com" {...field} />
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
                    <FormControl>
                      <Input placeholder="User role" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
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
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
};

export default Users;
