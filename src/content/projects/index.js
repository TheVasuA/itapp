// Projects registry — the source of every project in the catalog.
//
// To add a project: create `src/content/projects/<slug>.js` exporting a Project,
// then import and register it here.
//
// Data shapes (see `@/lib/projects` for full JSDoc typedefs):
//   Project:       { slug, title, icon, summary, difficulty, tags, stack: StackLayer[], design: SystemDesign }
//   StackLayer:    { layer, label, techs: TechRef[] }
//   TechRef:       { name, icon, reason, languageKey (nullable — links to /{languageKey}) }
//   SystemDesign:  { nodes: DesignNode[], edges: DesignEdge[], layers: string[] }
//   DesignNode:    { id, label, layer, icon }
//   DesignEdge:    { from, to, label (optional) }

import ecommerce from './ecommerce';
import urlShortener from './url-shortener';
import realtimeChat from './realtime-chat';
import socialFeed from './social-feed';
import rideSharing from './ride-sharing';
import videoStreaming from './video-streaming';
import foodDelivery from './food-delivery';
import bookingReservations from './booking-reservations';
import bloggingCms from './blogging-cms';
import kanbanPm from './kanban-pm';
import codeEditor from './code-editor';
import musicStreaming from './music-streaming';
import photoSharing from './photo-sharing';
import notificationSystem from './notification-system';
import paymentGateway from './payment-gateway';
import searchAutocomplete from './search-autocomplete';
import jobBoard from './job-board';
import lms from './lms';
import iotTelemetry from './iot-telemetry';
import multiplayerGame from './multiplayer-game';

/** @type {import('@/lib/projects').Project[]} */
export const projects = [
  ecommerce,
  realtimeChat,
  socialFeed,
  urlShortener,
  rideSharing,
  videoStreaming,
  foodDelivery,
  bookingReservations,
  bloggingCms,
  kanbanPm,
  codeEditor,
  musicStreaming,
  photoSharing,
  notificationSystem,
  paymentGateway,
  searchAutocomplete,
  jobBoard,
  lms,
  iotTelemetry,
  multiplayerGame,
];

export default projects;
