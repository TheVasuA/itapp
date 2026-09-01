'use client';

// SidebarTrigger — opens the topic-sidebar drawer below the `lg` breakpoint.

import { useDispatch } from 'react-redux';
import { PanelLeft } from 'lucide-react';

import { toggleSidebarDrawer } from '@/store/slices/uiSlice';

export default function SidebarTrigger() {
  const dispatch = useDispatch();
  return (
    <button
      type="button"
      onClick={() => dispatch(toggleSidebarDrawer())}
      className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
    >
      <PanelLeft className="h-4 w-4" aria-hidden="true" />
      Topics
    </button>
  );
}
