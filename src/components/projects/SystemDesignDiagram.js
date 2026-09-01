// SystemDesignDiagram — server component emitting accessible inline SVG from a
// SystemDesign. No client JS. Uses layoutSystemDesign() for geometry, wraps
// wide diagrams in a bounded horizontally-scrolling container so only the
// diagram (not the page) scrolls on narrow viewports.

import { layoutSystemDesign, NODE_W, NODE_H } from '@/lib/diagram';

/**
 * Simple SVG icon paths keyed by icon name. Each renders at 16×16 within the
 * node box. These are minimal representations — just enough to visually
 * distinguish node types.
 */
const ICON_PATHS = {
  Globe: 'M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM2.5 8h3A12 12 0 0 1 6 4.5 5.5 5.5 0 0 0 2.5 8Zm11 0a5.5 5.5 0 0 0-3.5-3.5A12 12 0 0 1 10.5 8h3ZM8 2.1A10 10 0 0 1 9.4 8H6.6A10 10 0 0 1 8 2.1ZM6.6 9h2.8A10 10 0 0 1 8 13.9 10 10 0 0 1 6.6 9Zm-1.1 0h-3a5.5 5.5 0 0 0 3.5 3.5A12 12 0 0 1 5.5 9Zm5 0a12 12 0 0 1-.5 3.5 5.5 5.5 0 0 0 3.5-3.5h-3Z',
  Server: 'M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3Zm1 5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3Zm8 2a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0-6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  Database: 'M8 1C4.7 1 2 2.1 2 3.5v9C2 13.9 4.7 15 8 15s6-1.1 6-2.5v-9C14 2.1 11.3 1 8 1Zm0 1.5c2.8 0 4.5.8 4.5 1s-1.7 1-4.5 1-4.5-.8-4.5-1 1.7-1 4.5-1ZM3.5 5.3C4.7 5.9 6.3 6.2 8 6.2s3.3-.3 4.5-.9v2.2c0 .2-1.7 1-4.5 1s-4.5-.8-4.5-1V5.3Zm0 4c1.2.6 2.8.9 4.5.9s3.3-.3 4.5-.9v2.2c0 .2-1.7 1-4.5 1s-4.5-.8-4.5-1V9.3Z',
  Cloud: 'M4.5 13A3.5 3.5 0 0 1 2 7.7a4 4 0 0 1 7.4-2A3 3 0 0 1 13 8.5a2.5 2.5 0 0 1-1 4.5H4.5Z',
  Network: 'M8 2a2 2 0 0 1 1.7 3H12a1 1 0 0 1 1 1v2.3a2 2 0 1 1-1.5 0V6.5H9.7a2 2 0 0 1-3.4 0H4.5v1.8a2 2 0 1 1-1.5 0V6a1 1 0 0 1 1-1h2.3A2 2 0 0 1 8 2Z',
  Package: 'M8 1L2 4v8l6 3 6-3V4L8 1Zm0 1.5 4 2-4 2-4-2 4-2ZM3.5 5.4l4 2V13l-4-2V5.4Zm9 0v5.2l-4 2V7.4l4-2Z',
  Zap: 'M9.5 1L3 9h4.5l-1 6L13 7H8.5l1-6Z',
  CreditCard: 'M2 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1H2V4Zm0 3h12v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7Zm2 2v1h3V9H4Z',
  Boxes: 'M2 3h5v5H2V3Zm7 0h5v5H9V3ZM2 9h5v5H2V9Zm7 0h5v5H9V9Z',
  Lock: 'M5 7V5a3 3 0 1 1 6 0v2h1a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1Zm1.5 0h3V5a1.5 1.5 0 0 0-3 0v2Z',
  Users: 'M5.5 4a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0ZM8 8c-2.5 0-4.5 1.3-4.5 3v1h9v-1c0-1.7-2-3-4.5-3Zm4-3a2 2 0 1 1 0 4M13 9c1.5.5 2.5 1.5 2.5 3v1h-2',
  Mail: 'M2 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4Zm1.3.5L8 8l4.7-3.5M2.5 11l3.5-3m7.5 3-3.5-3',
  Code: 'M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5M9 3l-2 10',
  Cpu: 'M5 3h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm1 3h4v4H6V6ZM8 1v2m0 10v2M1 8h2m10 0h2M3 3l1.5 1.5M11.5 11.5 13 13M13 3l-1.5 1.5M4.5 11.5 3 13',
  Layers: 'M8 2L2 5.5 8 9l6-3.5L8 2ZM2 8l6 3.5L14 8M2 10.5l6 3.5 6-3.5',
  Shield: 'M8 1.5l-5 2v4c0 3.5 2.2 6 5 7 2.8-1 5-3.5 5-7v-4l-5-2Z',
};

/** Icon size used inside node boxes. */
const ICON_SIZE = 16;

/**
 * Renders a simple SVG icon path for a given icon name.
 * Falls back to a generic circle if the icon name isn't recognized.
 */
function renderIcon(iconName, x, y) {
  const pathData = ICON_PATHS[iconName];
  if (pathData) {
    return (
      <path
        d={pathData}
        fill="hsl(var(--primary))"
        transform={`translate(${x}, ${y})`}
      />
    );
  }
  // Fallback: simple filled circle
  return (
    <circle
      cx={x + ICON_SIZE / 2}
      cy={y + ICON_SIZE / 2}
      r={6}
      fill="hsl(var(--primary))"
    />
  );
}

export default function SystemDesignDiagram({ design, title, description }) {
  if (!design || !design.nodes || design.nodes.length === 0) return null;

  const { width, height, nodes, edges } = layoutSystemDesign(design);
  const desc =
    description ||
    `Architecture with ${nodes.length} components across ${design.layers.length} layers.`;

  // Use a simple hash for unique IDs to support multiple diagrams on a page
  const idPrefix = `sdd-${(title || 'diagram').replace(/\s+/g, '-').toLowerCase().slice(0, 20)}`;

  return (
    <div className="my-6 max-w-full overflow-x-auto">
      <svg
        role="img"
        aria-labelledby={`${idPrefix}-title ${idPrefix}-desc`}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        width={width}
        height={height}
        className="h-auto max-w-none"
        style={{ minWidth: Math.min(width, 320) }}
      >
        <title id={`${idPrefix}-title`}>{title || 'System Design Diagram'}</title>
        <desc id={`${idPrefix}-desc`}>{desc}</desc>

        <defs>
          <marker
            id={`${idPrefix}-arrow`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--muted-foreground))" />
          </marker>
        </defs>

        {/* Edges first so node boxes sit on top */}
        <g fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5">
          {edges.map((edge, i) =>
            edge.path ? (
              <g key={`${edge.from}-${edge.to}-${i}`}>
                <path
                  d={edge.path}
                  markerEnd={`url(#${idPrefix}-arrow)`}
                  strokeDasharray={edge.isBack ? '4 3' : undefined}
                />
                {edge.label && (
                  <text
                    x={edge.labelX}
                    y={edge.labelY}
                    textAnchor="middle"
                    fontSize="11"
                    fill="hsl(var(--muted-foreground))"
                    stroke="none"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            ) : null
          )}
        </g>

        {/* Node boxes with icons and labels */}
        <g>
          {nodes.map((node) => {
            // Position icon centered above the label text
            const iconX = node.x + (node.w / 2) - (ICON_SIZE / 2);
            const iconY = node.y + 12;
            const labelY = node.y + ICON_SIZE + 24;

            return (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={node.h}
                  rx="8"
                  fill="hsl(var(--card))"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.5"
                />
                {/* Embedded icon */}
                <g aria-hidden="true">
                  <svg
                    x={iconX}
                    y={iconY}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    {renderIcon(node.icon, 0, 0)}
                  </svg>
                </g>
                {/* Label */}
                <text
                  x={node.x + node.w / 2}
                  y={labelY}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="hsl(var(--card-foreground))"
                >
                  {truncate(node.label, NODE_W)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

/** Crude label truncation so long labels don't overflow the box. */
function truncate(label, boxWidth) {
  const maxChars = Math.floor(boxWidth / 8);
  if (label.length <= maxChars) return label;
  return `${label.slice(0, maxChars - 1)}…`;
}
