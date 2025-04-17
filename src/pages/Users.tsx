import React, { useEffect, useState } from 'react';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createUser, deleteUser, getUsers, updateUser } from '@/services/users';
import { CreateUser } from '@/services/api';
import { Eye, EyeOff } from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Loader2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  password: string;
}

const defaultFormData: Omit<User, 'id'> = {
  name: '',
  role: '',
  email: '',
  password: '',
};

const Users = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const isEditMode = !!selectedItem;

  const dynamicSchema = z.object({
    name: z.string().min(2, {
      message: 'Name must be at least 2 characters.',
    }),
    email: z.string().email({
      message: 'Invalid email address.',
    }),
    role: z.string().min(2, {
      message: 'Role must be at least 2 characters.',
    }),
    password: isEditMode
      ? z.string().optional()
      : z.string().min(4, {
          message: 'Password must be at least 4 characters',
        }),
  });

  const {
    isLoading,
    isFetching,
    data: users,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      refetch();
      toast.success('User added successfully');
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      refetch();
      toast.success('User updated successfully');
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      refetch();
      toast.success('User deleted successfully');
      setUserToDelete(null);
      setDeleteDialogOpen(false);
    },
  });

  const form = useForm<z.infer<typeof dynamicSchema>>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: defaultFormData,
  });

  const columns = [
    {
      id: 'name',
      header: 'Nom',
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
      deleteMutation.mutate(userToDelete.id);
    }
  };

  const handleSave = (formData: CreateUser) => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.role ||
      (!formData.password && !selectedItem)
    ) {
      toast.error('All fields are required');
      return;
    }

    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, payload: formData });
    } else {
      const newItem: CreateUser = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password,
      };
      createMutation.mutate(newItem);
    }
  };

  return (
    <div className="page-container">
      <DataTable
        title="Users"
        columns={columns}
        data={users?.data || []}
        onAddNew={onAddNew}
        onView={onView}
        onDelete={onDelete}
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
              {selectedItem ? 'Edit User' : 'Create User'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem
                ? 'Update user details.'
                : 'Add a new user to the list.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="space-y-4"
            >
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

              {!selectedItem && (
                <FormField
                  control={form.control}
                  name="password"
                  disabled={selectedItem ? true : false}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="User Password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            tabIndex={-1} // avoid interfering with tab flow
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
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
        title={`Delete ${userToDelete?.email}`}
        isLoading={deleteMutation.isPending}
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
};

export default Users;
