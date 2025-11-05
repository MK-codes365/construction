'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { updateProjectSite } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProjectSite } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(1, 'Site name is required.'),
  location: z.string().min(1, 'Location is required.'),
  manager: z.string().min(1, 'Manager is required.'),
  squareMeters: z.coerce.number().min(1, 'Area must be greater than 0.'),
  startDate: z.date({ required_error: 'A start date is required.' }),
});

type EditSiteDialogProps = {
  site: ProjectSite;
  onSiteUpdated: () => void;
  children?: React.ReactNode;
  asChild?: boolean;
};

export function EditSiteDialog({ site, onSiteUpdated, asChild=true, children }: EditSiteDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: site.name,
      location: site.location,
      manager: site.manager,
      startDate: site.startDate,
      squareMeters: site.squareMeters,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateProjectSite({ ...site, ...values });
    toast({
      title: 'Site Updated',
      description: `The "${values.name}" site has been successfully updated.`,
    });
    onSiteUpdated();
    setIsOpen(false);
  }
  
  const Trigger = asChild ? DialogTrigger : 'div';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
       <Trigger onClick={() => setIsOpen(true)} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          <Pencil className="mr-2 h-4 w-4" />
          <span>Edit</span>
      </Trigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project Site</DialogTitle>
          <DialogDescription>
            Update the details for the "{site.name}" site below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Northridge Mall" {...field} />
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
                    <Input
                      placeholder="e.g., 123 Construction Ave"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Manager</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="squareMeters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel className="mb-1">Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
