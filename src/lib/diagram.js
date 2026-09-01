// Diagram layout — pure, deterministic layered layout for a SystemDesign.
//
// Places every node exactly once into a column determined by its `layer`
// (column order from design.layers), stacks nodes vertically within a column,
// computes SVG edge paths (cubic Béziers; curved back-edges for cycles), and
// returns a viewBox whose width/height bound all node boxes and edge geometry.
// The input `design` is never mutated.

export const NODE_W = 160;
export const NODE_H = 64;
export const COL_GAP = 90;
export const ROW_GAP = 36;
export const PAD = 24;
/** Extra vertical headroom reserved so curved back-edges stay inside the viewBox. */
export const BACK_EDGE_ARC = 48;

/**
 * @param {import('@/lib/projects').SystemDesign} design
 * @returns {{
 *   width: number,
 *   height: number,
 *   nodes: Array<{id:string,label:string,icon?:string,layer:string,x:number,y:number,w:number,h:number}>,
 *   edges: Array<{from:string,to:string,label?:string,path:string,labelX:number,labelY:number,isBack:boolean}>
 * }}
 */
export function layoutSystemDesign(design) {
  const layers = design?.layers || [];
  const inputNodes = design?.nodes || [];
  const inputEdges = design?.edges || [];

  const layerIndex = new Map(layers.map((l, i) => [l, i]));

  // Group nodes by layer, preserving input order for determinism. Nodes whose
  // layer isn't declared fall into a trailing column so they are still placed.
  const columns = layers.map(() => []);
  const extraColumn = [];
  for (const node of inputNodes) {
    const idx = layerIndex.get(node.layer);
    if (idx === undefined) {
      extraColumn.push(node);
    } else {
      columns[idx].push(node);
    }
  }
  if (extraColumn.length) columns.push(extraColumn);

  // Place each node exactly once.
  const placed = new Map();
  let maxRows = 0;
  columns.forEach((colNodes, colIdx) => {
    maxRows = Math.max(maxRows, colNodes.length);
    colNodes.forEach((node, rowIdx) => {
      const x = PAD + colIdx * (NODE_W + COL_GAP);
      const y = PAD + BACK_EDGE_ARC + rowIdx * (NODE_H + ROW_GAP);
      placed.set(node.id, {
        id: node.id,
        label: node.label,
        icon: node.icon,
        layer: node.layer,
        x,
        y,
        w: NODE_W,
        h: NODE_H,
      });
    });
  });

  const nodes = Array.from(placed.values());

  const colCount = columns.length;
  const width =
    PAD * 2 + colCount * NODE_W + Math.max(0, colCount - 1) * COL_GAP;
  const height =
    PAD * 2 + BACK_EDGE_ARC * 2 + maxRows * NODE_H + Math.max(0, maxRows - 1) * ROW_GAP;

  // Build edge paths.
  const edges = inputEdges.map((edge) => {
    const a = placed.get(edge.from);
    const b = placed.get(edge.to);
    // Validation guarantees endpoints exist, but stay defensive.
    if (!a || !b) {
      return {
        from: edge.from,
        to: edge.to,
        label: edge.label,
        path: '',
        labelX: 0,
        labelY: 0,
        isBack: false,
      };
    }

    const aCol = colIndexOf(columns, a.id);
    const bCol = colIndexOf(columns, b.id);
    const isBack = bCol <= aCol;

    let sx;
    let sy = a.y + a.h / 2;
    let ex;
    let ey = b.y + b.h / 2;
    let path;
    let labelX;
    let labelY;

    if (!isBack) {
      // Forward edge: right of A -> left of B with a smooth horizontal Bézier.
      sx = a.x + a.w;
      ex = b.x;
      const cx = (sx + ex) / 2;
      path = `M ${sx} ${sy} C ${cx} ${sy}, ${cx} ${ey}, ${ex} ${ey}`;
      labelX = cx;
      labelY = (sy + ey) / 2 - 6;
    } else {
      // Back edge (or same column): route up and over with a curved arc so the
      // cycle is still visible. Exit/enter from the top of each node.
      sx = a.x + a.w / 2;
      sy = a.y;
      ex = b.x + b.w / 2;
      ey = b.y;
      const arcY = Math.min(sy, ey) - BACK_EDGE_ARC;
      path = `M ${sx} ${sy} C ${sx} ${arcY}, ${ex} ${arcY}, ${ex} ${ey}`;
      labelX = (sx + ex) / 2;
      labelY = arcY - 4;
    }

    return {
      from: edge.from,
      to: edge.to,
      label: edge.label,
      path,
      labelX,
      labelY,
      isBack,
    };
  });

  return { width, height, nodes, edges };
}

/** Column index of a node id within the grouped columns. */
function colIndexOf(columns, id) {
  for (let i = 0; i < columns.length; i += 1) {
    if (columns[i].some((n) => n.id === id)) return i;
  }
  return -1;
}
