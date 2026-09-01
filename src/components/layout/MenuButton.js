'use client';

// MenuButton — hamburger trigger that opens the mobile navigation drawer.

import { useDispatch } from 'react-redux';
import { Menu } from 'lucide-react';

import { toggleNavDrawer } from '@/store/slices/uiSlice';

export default function MenuButton() {
  const dispatch = useDispatch();
  return (
    <button
      type="button"
      onClick={() => dispatch(toggleNavDrawer())}
      aria-label="Open navigation"
      className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
    >
      <Menu className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
