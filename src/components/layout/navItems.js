import { LayoutDashboard, MessageSquareText, Workflow } from 'lucide-react';

export const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: 'Chat', icon: MessageSquareText },
  { to: '/pipelines/retail-sales-enrichment', label: 'Pipelines', icon: Workflow, match: '/pipelines' },
];
