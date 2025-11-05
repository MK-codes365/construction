import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { useSidebar } from './ui/sidebar';

export function UserNav() {
  const { state } = useSidebar();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="https://picsum.photos/seed/user-avatar/40/40"
              alt="User avatar"
              data-ai-hint="person face"
            />
            <AvatarFallback>SE</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium">Site Engineer</span>
            <span className="text-xs text-muted-foreground">
              engineer@greentrack.com
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      {state === 'expanded' && (
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Site Engineer</p>
              <p className="text-xs leading-none text-muted-foreground">
                engineer@greentrack.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
