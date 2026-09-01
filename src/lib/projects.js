// Projects Access Layer — pure, synchronous resolution of project slugs and
// route enumeration, plus build-time validation of project data integrity.

import { projects } from '@/content/projects';
import { getLanguages } from '@/lib/content';

/**
 * A reference to a recommended technology within a stack layer.
 * @typedef {Object} TechRef
 * @property {string} name - Display name of the technology
 * @property {string} icon - Lucide icon name
 * @property {string} reason - Short justification for choosing this tech
 * @property {string|null} languageKey - Links to /{languageKey} when non-null; null otherwise
 */

/**
 * A layer in a project's recommended tech stack (e.g. "frontend", "backend").
 * @typedef {Object} StackLayer
 * @property {string} layer - Machine-readable layer key (e.g. "frontend", "backend", "database")
 * @property {string} label - Human-readable layer heading (e.g. "Frontend", "Backend")
 * @property {TechRef[]} techs - Technologies recommended for this layer
 */

/**
 * A node in a system-design graph.
 * @typedef {Object} DesignNode
 * @property {string} id - Unique identifier within the project
 * @property {string} label - Display label
 * @property {string} layer - Layer this node belongs to (must be in SystemDesign.layers)
 * @property {string} icon - Lucide icon name
 */

/**
 * A directed edge in a system-design graph.
 * @typedef {Object} DesignEdge
 * @property {string} from - Source node id
 * @property {string} to - Target node id
 * @property {string} [label] - Optional edge label
 */

/**
 * The system-design data model for a project.
 * @typedef {Object} SystemDesign
 * @property {DesignNode[]} nodes - All design nodes
 * @property {DesignEdge[]} edges - All directed edges
 * @property {string[]} layers - Ordered layer names for column layout
 */

/**
 * A real-world project with a recommended stack and system-design graph.
 * @typedef {Object} Project
 * @property {string} slug - URL-friendly identifier, routable at /projects/{slug}
 * @property {string} title - Display title
 * @property {string} icon - Lucide icon name
 * @property {string} summary - One-line project description
 * @property {string} difficulty - Difficulty level (e.g. "Beginner", "Intermediate", "Advanced")
 * @property {string[]} tags - Categorization tags
 * @property {StackLayer[]} stack - Recommended tech-stack layers
 * @property {SystemDesign} design - System-design graph data
 */

/**
 * Returns all registered projects.
 * @returns {Project[]}
 */
export function getProjects() {
  return projects;
}

/**
 * Returns a single project by slug, or null if not found.
 * @param {string} slug
 * @returns {Project|null}
 */
export function getProject(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

/**
 * Returns an array of all registered project slugs.
 * @returns {string[]}
 */
export function getAllProjectSlugs() {
  return projects.map((p) => p.slug);
}

/** @type {boolean} one-time validation flag */
let projectsValidated = false;

/** Run project validation once per process (memoized). */
export function ensureValidProjects() {
  if (!projectsValidated) {
    validateProjects();
    projectsValidated = true;
  }
}

/**
 * Validate every project's design graph and stack links. Throws (failing the
 * build) naming the offending project slug/edge or languageKey.
 * @returns {boolean} true when all projects are valid
 */
export function validateProjects() {
  const languageKeys = new Set(getLanguages());

  for (const project of projects) {
    const { slug, design, stack } = project;

    // Every edge endpoint must reference an existing node id.
    const nodeIds = new Set((design?.nodes || []).map((n) => n.id));
    for (const edge of design?.edges || []) {
      if (!nodeIds.has(edge.from)) {
        throw new Error(
          `[projects:${slug}] edge references non-existent node "${edge.from}" (from)`
        );
      }
      if (!nodeIds.has(edge.to)) {
        throw new Error(
          `[projects:${slug}] edge references non-existent node "${edge.to}" (to)`
        );
      }
    }

    // Every node's layer must be declared in design.layers.
    const layerSet = new Set(design?.layers || []);
    for (const node of design?.nodes || []) {
      if (!layerSet.has(node.layer)) {
        throw new Error(
          `[projects:${slug}] node "${node.id}" has undeclared layer "${node.layer}"`
        );
      }
    }

    // Every non-null TechRef.languageKey must be a registered language.
    for (const layer of stack || []) {
      for (const tech of layer.techs || []) {
        if (
          tech.languageKey != null &&
          !languageKeys.has(tech.languageKey)
        ) {
          throw new Error(
            `[projects:${slug}] TechRef "${tech.name}" has unknown languageKey "${tech.languageKey}"`
          );
        }
      }
    }
  }
  return true;
}
