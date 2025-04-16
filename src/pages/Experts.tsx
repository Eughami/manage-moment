
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
  DialogClose 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from 'sonner';

interface Expert {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: string;
}

const defaultFormData: Omit<Expert, 'id'> = {
  name: '',
  email: '',
  specialization: '',
  experience: ''
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  specialization: z.string().min(2, {
    message: "Specialization must be at least 2 characters.",
  }),
  experience: z.string().min(2, {
    message: "Experience must be at least 2 characters.",
  }),
})

const Experts = () => {
  const [items, setItems] = useState<Expert[]>([
    {
      id: "expert-1",
      name: "Dr. Jane Doe",
      email: "jane.doe@example.com",
      specialization: "Artificial Intelligence",
      experience: "10 years"
    },
    {
      id: "expert-2",
      name: "Prof. John Smith",
      email: "john.smith@example.com",
      specialization: "Biotechnology",
      experience: "15 years"
    },
    {
      id: "expert-3",
      name: "Emily White",
      email: "emily.white@example.com",
      specialization: "Renewable Energy",
      experience: "8 years"
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Expert | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormData,
    mode: "onChange"
  })

  const columns = [
    {
      id: "name",
      header: "Name",
      cell: (item: Expert) => item.name,
    },
    {
      id: "email",
      header: "Email",
      cell: (item: Expert) => item.email,
    },
    {
      id: "specialization",
      header: "Specialization",
      cell: (item: Expert) => item.specialization,
    },
    {
      id: "experience",
      header: "Experience",
      cell: (item: Expert) => item.experience,
    },
  ];

  const handleAddNew = () => {
    setSelectedItem(null);
    form.reset(defaultFormData);
    setIsDialogOpen(true);
  };

  const handleView = (item: Expert) => {
    setSelectedItem(item);
    form.reset(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (item: Expert) => {
    setItems(items.filter((i) => i.id !== item.id));
    toast.success("Expert deleted successfully");
  };

  const handleSave = (formData: Partial<Expert>) => {
    if (!formData.name || !formData.email || !formData.specialization || !formData.experience) {
      toast.error("All fields are required");
      return;
    }
    
    if (selectedItem) {
      const updatedData = items.map(item =>
        item.id === selectedItem.id ? { ...item, ...formData } : item
      );
      setItems(updatedData);
      toast.success("Expert updated successfully");
    } else {
      const newItem: Expert = {
        id: `expert-${items.length + 1}`,
        name: formData.name,
        email: formData.email,
        specialization: formData.specialization,
        experience: formData.experience
      };
      setItems([...items, newItem]);
      toast.success("Expert added successfully");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="page-container">
      <DataTable
        title="Experts"
        columns={columns}
        data={items}
        onAddNew={handleAddNew}
        onView={handleView}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "View/Edit Expert" : "Add New Expert"}</DialogTitle>
            <DialogDescription>
              {selectedItem ? "Update expert details." : "Add a new expert to the list."}
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
                      <Input placeholder="Expert name" {...field} />
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
                      <Input placeholder="expert@example.com" type="email" {...field} />
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
                      <Input placeholder="Expert specialization" {...field} />
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
              <div className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {selectedItem ? "Update Expert" : "Add Expert"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Experts;

