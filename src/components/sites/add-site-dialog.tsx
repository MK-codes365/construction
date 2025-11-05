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
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { addProjectSite } from '@/lib/data';
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

const formSchema = z.object({
  name: z.string().min(1, 'Site name is required.'),
  location: z.string().min(1, 'Location is required.'),
  manager: z.string().min(1, 'Manager is required.'),
  squareMeters: z.coerce.number().min(1, 'Area must be greater than 0.'),
  startDate: z.date({ required_error: 'A start date is required.' }),
});

export function AddSiteDialog({ onSiteAdded }: { onSiteAdded: () => void }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      location: '',
      manager: '',
      startDate: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addProjectSite(values);

    toast({
      title: 'Site Added',
      description: `The "${values.name}" site has been successfully created.`,
    });

    onSiteAdded(); // This will re-render the parent component
    setIsOpen(false); // Close the dialog
    form.reset(); // Reset form fields
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Site
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Project Site</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new site to your projects.
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
              Create Site
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
