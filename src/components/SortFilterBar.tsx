import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProjectStatus, ProjectType } from '@/services/api';
import {
  CalendarIcon,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'status';

export interface SortFilterOptions {
  search: string;
  type_projet: ProjectType | 'all';
  status: ProjectStatus | 'all';
  date: Date | undefined;
  sort: SortOption;
}

interface SortFilterBarProps {
  options: SortFilterOptions;
  onChange: (options: SortFilterOptions) => void;
}

export function SortFilterBar({ options, onChange }: SortFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const updateOptions = (updates: Partial<SortFilterOptions>) => {
    onChange({ ...options, ...updates });
  };

  const clearFilters = () => {
    onChange({
      search: '',
      type_projet: 'all',
      status: 'all',
      date: undefined,
      sort: 'newest',
    });
  };

  // Check if any active filters
  const hasActiveFilters =
    options.type_projet !== 'all' ||
    options.status !== 'all' ||
    options.date !== undefined;

  return (
    <div className="bg-white/60 backdrop-blur-md border rounded-xl p-4 mb-6 shadow-sm transition-all-200">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2 w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={options.search}
              onChange={(e) => updateOptions({ search: e.target.value })}
              className="pl-9 bg-background/80"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'transition-all-200',
              hasActiveFilters && 'border-primary text-primary bg-primary/5'
            )}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Select
            value={options.sort}
            onValueChange={(value) =>
              updateOptions({ sort: value as SortOption })
            }
          >
            <SelectTrigger className="w-[180px] bg-background/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="alphabetical">Alphabetical (A-Z)</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 animate-fade-in">
            <Select
              value={options.type_projet}
              onValueChange={(value) =>
                updateOptions({ type_projet: value as ProjectType | 'all' })
              }
            >
              <SelectTrigger className="bg-background/80">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="research">Research</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={options.status}
              onValueChange={(value) =>
                updateOptions({ status: value as ProjectStatus | 'all' })
              }
            >
              <SelectTrigger className="bg-background/80">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal w-full bg-background/80',
                      options.date && 'text-primary'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {options.date
                      ? format(options.date, 'PPP')
                      : 'Filter by date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={options.date}
                    onSelect={(date) => updateOptions({ date })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFilters}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
