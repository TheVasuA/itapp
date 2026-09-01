'use client';

// TopicSidebar — nested expandable topic tree for the active language. Expanded
// state persists in uiSlice; the current concept is marked active. Below `lg`
// it renders as a dismissible off-canvas drawer that closes on topic selection.
//
// Content gating: the first FREE_TOPIC_LIMIT routable topics are free. When the
// visitor is signed out, later topics are locked — clicking a locked item (or
// the "Sign in to unlock" button) opens the Google sign-in modal. Signing in
// unlocks everything. A small account footer shows the signed-in user.

import { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight, X, Lock, LogIn, LogOut } from 'lucide-react';

import {
  toggleNode,
  setSidebarDrawerOpen,
  setExpandedNodes,
} from '@/store/slices/uiSlice';
import { openSignInModal, signOut } from '@/store/slices/authSlice';
import { writeStoredUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

function TreeNode({
  language,
  node,
  prefix,
  activePath,
  onNavigate,
  gate,
  locked,
}) {
  const dispatch = useDispatch();
  const expandedNodes = useSelector((state) => state.ui.expandedNodes);

  const slugChain = node.slug ? [...prefix, node.slug] : prefix;
  const hasChildren = node.children && node.children.length > 0;
  // Only real content nodes are links. Section headers (no content) are not
  // clickable pages — clicking their row just toggles expansion.
  const isLink = node.hasContent && node.slug;
  const href = isLink ? `/${language}/${slugChain.join('/')}` : null;
  const isExpanded = !!expandedNodes[node.id];
  const isActive = href && activePath === slugChain.join('/');

  // A content node is locked when the gate says so. When a parent is locked,
  // children are locked too (propagated via `locked`).
  const isLocked = isLink ? locked || gate.isLocked(node.id) : locked;

  const handleLockedClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(openSignInModal());
  };

  return (
    <li>
      <div className="flex items-center">
        {hasChildren ? (
          <button
            type="button"
            onClick={() => dispatch(toggleNode(node.id))}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? `Collapse ${node.title}` : `Expand ${node.title}`}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform motion-reduce:transition-none',
                isExpanded && 'rotate-90'
              )}
              aria-hidden="true"
            />
          </button>
        ) : (
          <span className="inline-block h-8 w-8 shrink-0" />
        )}

        {isLink ? (
          isLocked ? (
            <button
              type="button"
              onClick={handleLockedClick}
              aria-label={`${node.title} — sign in to unlock`}
              className="group flex min-h-8 flex-1 items-center gap-1.5 rounded px-2 py-1 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <span className="flex-1 truncate">{node.title}</span>
              <Lock
                className="h-3.5 w-3.5 shrink-0 opacity-60 group-hover:opacity-100"
                aria-hidden="true"
              />
            </button>
          ) : (
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex min-h-8 flex-1 items-center rounded px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground',
                isActive && 'bg-accent font-medium text-accent-foreground'
              )}
            >
              {node.title}
            </Link>
          )
        ) : hasChildren ? (
          // Section header: clicking the label toggles its children.
          <button
            type="button"
            onClick={() => dispatch(toggleNode(node.id))}
            className="flex min-h-8 flex-1 items-center rounded px-2 py-1 text-left text-sm font-semibold text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            {node.title}
          </button>
        ) : (
          <span className="flex-1 px-2 py-1 text-sm font-medium">
            {node.title}
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <ul className="ml-4 border-l border-border pl-2">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              language={language}
              node={child}
              prefix={slugChain}
              activePath={activePath}
              onNavigate={onNavigate}
              gate={gate}
              locked={isLocked}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function TreeList({ language, nodes, activePath, onNavigate, gate }) {
  return (
    <ul className="space-y-0.5">
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          language={language}
          node={node}
          prefix={[]}
          activePath={activePath}
          onNavigate={onNavigate}
          gate={gate}
          locked={false}
        />
      ))}
    </ul>
  );
}

/**
 * Build a gate that, given the tree and free limit, knows which routable node
 * ids are locked. Routable nodes are numbered in depth-first order; the first
 * `limit` are free, the rest are locked when signed out. When signed in nothing
 * is locked. Also reports how many topics remain locked, for the CTA.
 */
function buildGate(tree, limit, signedIn) {
  const lockedIds = new Set();
  let routableCount = 0;
  let index = 0;

  const walk = (nodes) => {
    for (const node of nodes || []) {
      // Only real content pages count toward the free/locked limit.
      if (node.hasContent && node.slug) {
        routableCount += 1;
        if (!signedIn && index >= limit) lockedIds.add(node.id);
        index += 1;
      }
      if (node.children && node.children.length) walk(node.children);
    }
  };
  walk(tree);

  const lockedCount = signedIn ? 0 : Math.max(0, routableCount - limit);
  return {
    isLocked: (id) => lockedIds.has(id),
    lockedCount,
    routableCount,
  };
}

/**
 * Collect the ids of every node along the path to the active slug (including
 * the active node itself when it has children). These are the nodes that must
 * be expanded so the current topic is revealed in the tree.
 */
function ancestorIdsForActive(nodes, activeSlug, prefix = [], acc = []) {
  for (const node of nodes || []) {
    const chain = node.slug ? [...prefix, node.slug] : prefix;
    const chainStr = chain.join('/');
    const activeStr = activeSlug.join('/');
    // On the path to (or at) the active node.
    if (activeStr === chainStr || activeStr.startsWith(chainStr + '/')) {
      if (node.children && node.children.length) acc.push(node.id);
      if (node.children && node.children.length) {
        ancestorIdsForActive(node.children, activeSlug, chain, acc);
      }
    }
  }
  return acc;
}

export default function Sidebar({ language, tree, activeSlug = [], freeLimit = 7 }) {
  const dispatch = useDispatch();
  const drawerOpen = useSelector((state) => state.ui.sidebarDrawerOpen);
  const user = useSelector((state) => state.auth.user);
  const activePath = activeSlug.join('/');

  const gate = buildGate(tree, freeLimit, !!user);

  // Auto-expand the tree down to the active topic. Runs on load and whenever
  // the active topic changes (e.g. clicking "Next topic"), so the current
  // section and its subtopics are always revealed and the active tab is shown.
  useEffect(() => {
    if (!activePath) return;
    const ids = ancestorIdsForActive(tree, activeSlug);
    if (ids.length === 0) return;
    const map = {};
    for (const id of ids) map[id] = true;
    dispatch(setExpandedNodes(map));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePath, language]);

  // Close drawer on Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') dispatch(setSidebarDrawerOpen(false));
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen, dispatch]);

  const closeDrawer = () => dispatch(setSidebarDrawerOpen(false));

  const handleSignOut = () => {
    writeStoredUser(null);
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch {
        /* ignore */
      }
    }
    dispatch(signOut());
  };

  // Account / unlock footer shown at the bottom of the side menu.
  const authFooter = user ? (
    <div className="mt-4 border-t border-border pt-3">
      <div className="flex items-center gap-2 px-1">
        {user.picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.picture}
            alt=""
            className="h-8 w-8 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {(user.name || user.email || '?').slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Sign out"
          title="Sign out"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  ) : gate.lockedCount > 0 ? (
    <div className="mt-4 border-t border-border pt-3">
      <button
        type="button"
        onClick={() => dispatch(openSignInModal())}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <LogIn className="h-4 w-4" aria-hidden="true" />
        Sign in to unlock
      </button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        {gate.lockedCount} more{' '}
        {gate.lockedCount === 1 ? 'topic' : 'topics'} locked
      </p>
    </div>
  ) : null;

  const inner = (
    <nav aria-label="Topics" className="text-foreground">
      <TreeList
        language={language}
        nodes={tree}
        activePath={activePath}
        onNavigate={closeDrawer}
        gate={gate}
      />
      {authFooter}
    </nav>
  );

  return (
    <>
      {/* Desktop: static sidebar column */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
          {inner}
        </div>
      </aside>

      {/* Mobile/tablet: off-canvas drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close topics"
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/50"
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] overflow-y-auto bg-background p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-lg font-semibold">Topics</span>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close topics"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            {inner}
          </div>
        </div>
      )}
    </>
  );
}
