'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, UploadCloud } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { projectSites, materialTypes, wasteCauses } from '@/lib/data';
import { addWasteLogAR } from '@/services/arService';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  materialType: z.string({ required_error: 'Please select a material.' }),
  quantity: z.coerce.number().min(0.1, 'Quantity must be greater than 0.'),
  date: z.date({ required_error: 'A date is required.' }),
  site: z.string({ required_error: 'Please select a site.' }),
  disposalMethod: z.enum(['Recycled', 'Disposed'], {
    required_error: 'You need to select a disposal method.',
  }),
  photo: z.any().optional(),
  binId: z.string().optional(),
  cause: z.string({ required_error: 'Please select a cause.' }),
});

export function WasteLogForm() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      disposalMethod: 'Recycled',
      quantity: 0,
      site: '',
      materialType: '',
      binId: '',
      cause: '',
      photo: null,
    },
  });

  useEffect(() => {
    if (isClient) {
      form.reset({
        date: new Date(),
        disposalMethod: 'Recycled',
        quantity: 0,
        site: '',
        materialType: '',
        binId: '',
        cause: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const log = {
      materialType: values.materialType,
      quantity: values.quantity,
      date: values.date,
      site: values.site,
      disposalMethod: values.disposalMethod,
      binId: values.binId,
      cause: values.cause,
      photo: values.photo,
    };
    const result = await addWasteLogAR(log);
    if (result.status === 'ok') {
      toast({
        title: 'Log Submitted',
        description: 'Your waste log has been successfully recorded.',
      });
      router.push('/dashboard');
    } else {
      toast({
        title: 'Error',
        description: 'Failed to submit waste log: ' + (result.error || 'Unknown error'),
        variant: 'destructive',
      });
    }
  }

  if (!isClient) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="site"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Site</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project site" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projectSites.map((site) => (
                    <SelectItem key={site.id} value={site.name}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="materialType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a material" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {materialTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity (kg)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 150.5" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <FormField
            control={form.control}
            name="cause"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cause of Waste</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a cause" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {wasteCauses.map((cause) => (
                      <SelectItem key={cause} value={cause}>
                        {cause}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="binId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bin ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., BIN-04A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Logging</FormLabel>
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
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="disposalMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Disposal Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Recycled" />
                    </FormControl>
                    <FormLabel className="font-normal">Recycled</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Disposed" />
                    </FormControl>
                    <FormLabel className="font-normal">Disposed</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="photo"
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <FormItem>
              <FormLabel>Photo Verification</FormLabel>
              <FormControl>
                <div className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-6 text-center hover:bg-accent/50">
                  <UploadCloud className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  <Input
                    type="file"
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    onChange={(e) => onChange(e.target.files)}
                    onBlur={onBlur}
                    name={name}
                    ref={ref}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Upload an image of the waste for verification.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit Log
        </Button>
      </form>
    </Form>
  );
}
