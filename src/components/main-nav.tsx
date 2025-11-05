'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building, FileText, ClipboardList } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (props: any) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  { href: '/log-waste', label: 'Log Waste', icon: ClipboardList },
  { href: '/sites', label: 'Project Sites', icon: Building },
  { href: '/reports', label: 'Reports', icon: FileText },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="flex-1">
      {navItems.map(({ href, label, icon: Icon }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === href}
            tooltip={label}
            size="lg"
          >
            <Link href={href}>
              <Icon
                className={
                  pathname === href
                    ? 'text-primary h-6 w-6'
                    : 'text-sidebar-foreground h-6 w-6'
                }
              />
              <span>{label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
