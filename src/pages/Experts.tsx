import React, { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
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
  const [formData, setFormData] = useState<Omit<Expert, 'id'>>(defaultFormData);

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
    setFormData(defaultFormData);
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleView = (item: Expert) => {
    setFormData({
      name: item.name,
      email: item.email,
      specialization: item.specialization,
      experience: item.experience
    });
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (item: Expert) => {
    setItems(items.filter((i) => i.id !== item.id));
    toast.success("Expert deleted successfully");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "View/Edit Expert" : "Add New Expert"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialization" className="text-right">
                Specialization
              </Label>
              <Input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="experience" className="text-right">
                Experience
              </Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => handleSave(formData)}>
              {selectedItem ? "Update Expert" : "Add Expert"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Experts;
