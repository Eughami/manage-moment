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
  DialogTrigger,
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from 'sonner';

interface Beneficiary {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
}

const defaultFormData: Omit<Beneficiary, 'id'> = {
  name: '',
  email: '',
  phone: '',
  location: ''
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
})

const Beneficiaries = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [items, setItems] = useState<Beneficiary[]>([
    {
      id: "beneficiary-1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      location: "New York"
    },
    {
      id: "beneficiary-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "987-654-3210",
      location: "Los Angeles"
    }
  ]);
  const [selectedItem, setSelectedItem] = useState<Beneficiary | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormData,
    mode: "onChange"
  })

  const columns = [
    {
      id: "name",
      header: "Name",
      cell: (item: Beneficiary) => item.name,
    },
    {
      id: "email",
      header: "Email",
      cell: (item: Beneficiary) => item.email,
    },
    {
      id: "phone",
      header: "Phone",
      cell: (item: Beneficiary) => item.phone,
    },
    {
      id: "location",
      header: "Location",
      cell: (item: Beneficiary) => item.location,
    },
  ];

  const onAddNew = () => {
    setSelectedItem(null);
    form.reset(defaultFormData);
    setIsDialogOpen(true);
  };

  const onView = (item: Beneficiary) => {
    setSelectedItem(item);
    form.reset(item);
    setIsDialogOpen(true);
  };

  const onDelete = (item: Beneficiary) => {
    setItems(items.filter((i) => i.id !== item.id));
    toast.success("Beneficiary deleted successfully");
  };

  const handleSave = (formData: Partial<Beneficiary>) => {
    if (!formData.name || !formData.email || !formData.phone || !formData.location) {
      toast.error("All fields are required");
      return;
    }
    
    if (selectedItem) {
      const updatedData = items.map(item =>
        item.id === selectedItem.id ? { ...item, ...formData } : item
      );
      setItems(updatedData);
      toast.success("Beneficiary updated successfully");
    } else {
      const newItem: Beneficiary = {
        id: `beneficiary-${items.length + 1}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location
      };
      setItems([...items, newItem]);
      toast.success("Beneficiary added successfully");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="page-container">
      <DataTable
        data={items}
        columns={columns}
        onAddNew={onAddNew}
        onView={onView}
        onDelete={onDelete}
        title="Beneficiaries"
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "View/Edit Beneficiary" : "Add New Beneficiary"}</DialogTitle>
            <DialogDescription>
              {selectedItem ? "View or edit beneficiary details." : "Create a new beneficiary."}
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
                      <Input placeholder="Beneficiary name" {...field} />
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
                      <Input placeholder="john.doe@example.com" type="email" {...field} />
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
                      <Input placeholder="123-456-7890" {...field} />
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
                      <Input placeholder="New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Beneficiaries;
