// House data: frame sequences, the room graph, navigation names and the clickable hotspots.
// Ported from the original script.js (values unchanged).

// --- Animation sequences (24 fps .avif frames in public/Media) ---
export const SEQUENCES = {
  'entrance': { folder: 'Media/Entrance/', prefix: 'Entrance', start: 1, count: 96 },
  'living_bedroom': { folder: 'Media/Living_Bedroom/', prefix: 'LivingToBedroom', start: 97, count: 48 },
  'living_kitchen': { folder: 'Media/Living_Kitchen/', prefix: 'LivingToKitchen', start: 146, count: 24 },
  'living_pool': { folder: 'Media/Living_Pool/', prefix: 'LivingToPool', start: 171, count: 48 },
  'living_office': { folder: 'Media/Living_Office/', prefix: 'LivingToOffice', start: 220, count: 48 },
  'office_bedroom': { folder: 'Media/Office_Bedroom/', prefix: 'OfficeToBedroom', start: 268, count: 48 },
  'bedroom_kitchen': { folder: 'Media/Bedroom_Kitchen/', prefix: 'BedroomToKitchen', start: 318, count: 24 },
  'kitchen_pool': { folder: 'Media/Kitchen_Pool/', prefix: 'KitchenToPool', start: 343, count: 48 },
  'pool_office': { folder: 'Media/Pool_Office/', prefix: 'PoolToOffice', start: 392, count: 48 },
  'office_kitchen': { folder: 'Media/Office_Kitchen/', prefix: 'OfficetoKitchen', start: 441, count: 48 },
  'pool_bedroom': { folder: 'Media/Pool_Bedroom/', prefix: 'PoolToBedroom', start: 490, count: 48 },
  'bedroom_pc': { folder: 'Media/BedroomToPCScreen/', prefix: 'BedroomtoPc', start: 539, count: 24 }
};

export const IMG_EXT = '.avif';

// --- Room <-> navigation ---
export const ROOM_TO_NAV = {
  'living': 'home',
  'bedroom': 'projects',
  'kitchen': 'blog',
  'poolroom': 'about-me',
  'office': 'contact'
};

export const NAV_TO_ROOM = {
  'home': 'living',
  'about': 'living',
  'projects': 'bedroom',
  'blog': 'kitchen',
  'blogs': 'kitchen',
  'about-me': 'poolroom',
  'aboutme': 'poolroom',
  'reviews': 'poolroom',
  'contact': 'office'
};

function getRoomFromHash() {
  try {
    const hash = window.location.hash.replace(/^#/, '').toLowerCase().trim();
    if (!hash) return null;
    if (navToRoom[hash]) return navToRoom[hash];
    if (['living', 'bedroom', 'kitchen', 'poolroom', 'office'].includes(hash)) return hash;
  } catch (e) {}
  return null;
}

export const ROOM_TITLES = {
  'living': 'Freedom',
  'bedroom': 'Projects',
  'kitchen': 'Case Study',
  'poolroom': 'About Me',
  'office': 'Contact'
};

export const ALL_ROOMS = ['living', 'bedroom', 'kitchen', 'poolroom', 'office'];

// --- Complete bidirectional room-to-room animation graph ---
export const ROOM_CONNECTIONS = {
  'living-bedroom': { seq: 'living_bedroom', reverse: false },
  'bedroom-living': { seq: 'living_bedroom', reverse: true },

  'living-kitchen': { seq: 'living_kitchen', reverse: false },
  'kitchen-living': { seq: 'living_kitchen', reverse: true },

  'living-poolroom': { seq: 'living_pool', reverse: false },
  'poolroom-living': { seq: 'living_pool', reverse: true },

  'living-office': { seq: 'living_office', reverse: false },
  'office-living': { seq: 'living_office', reverse: true },

  'bedroom-kitchen': { seq: 'bedroom_kitchen', reverse: false },
  'kitchen-bedroom': { seq: 'bedroom_kitchen', reverse: true },

  'bedroom-poolroom': { seq: 'pool_bedroom', reverse: true },
  'poolroom-bedroom': { seq: 'pool_bedroom', reverse: false },

  'office-bedroom': { seq: 'office_bedroom', reverse: false },
  'bedroom-office': { seq: 'office_bedroom', reverse: true },

  'kitchen-poolroom': { seq: 'kitchen_pool', reverse: false },
  'poolroom-kitchen': { seq: 'kitchen_pool', reverse: true },

  'office-kitchen': { seq: 'office_kitchen', reverse: false },
  'kitchen-office': { seq: 'office_kitchen', reverse: true },

  'poolroom-office': { seq: 'pool_office', reverse: false },
  'office-poolroom': { seq: 'pool_office', reverse: true }
};

// Circular scroll loop order
export const SCROLL_CIRCLE = ['living', 'bedroom', 'kitchen', 'poolroom', 'office'];

// --- Background loading: which transitions leave each room, and which matter most ---
export const ROOM_ADJACENCY = {
    'living': ['living_bedroom', 'living_office', 'living_kitchen', 'living_pool'],
    'bedroom': ['bedroom_pc', 'bedroom_kitchen', 'office_bedroom', 'pool_bedroom', 'living_bedroom'],
    'kitchen': ['bedroom_kitchen', 'office_kitchen', 'kitchen_pool', 'living_kitchen'],
    'poolroom': ['pool_bedroom', 'kitchen_pool', 'pool_office', 'living_pool'],
    'office': ['living_office', 'office_bedroom', 'office_kitchen', 'pool_office']
  
};

export const ROOM_PRIORITY = {
    'living': ['living_bedroom', 'living_kitchen'],
    'bedroom': ['bedroom_pc', 'bedroom_kitchen', 'living_bedroom'],
    'kitchen': ['living_kitchen', 'bedroom_kitchen'],
    'poolroom': ['living_pool', 'kitchen_pool'],
    'office': ['living_office', 'pool_office']
  
};

// --- Clickable hotspots drawn over the rendered rooms ---
export const HOTSPOTS = {
  // Living Room (About Me) -> Corridor / Doorway leading to Bedroom (Projects)
  livingBedroomDoor: Object.freeze({
    id: 'livingBedroomDoor',
    room: 'living',
    label: 'Projects',
    shape: 'polygon',
    bounds: Object.freeze({
      left: '8%',
      top: '18%',
      width: '24%',
      height: '62%'
    }),
    polygon: '12,36 47,40 46,80.5 9.5,88.5',
    interactionType: 'both',
    cursor: 'pointer',
    glowColor: '#ffffff',
    glowSoftColor: 'rgba(255, 255, 255, 0.45)',
    fillColor: 'rgba(255, 255, 255, 0.08)',
    strokeColor: 'rgb(255, 255, 255)',
    action: Object.freeze({
      type: 'navigate',
      targetRoom: 'bedroom',
      animation: null
    })
  }),

  // Living Room (About Me) -> Corridor / Doorway leading to Office (Contact Me)
  livingOfficeDoor: Object.freeze({
    id: 'livingOfficeDoor',
    room: 'living',
    label: 'Contact Me',
    shape: 'polygon',
    bounds: Object.freeze({
      left: '82.3%',
      top: '42.5%',
      width: '9.4%',
      height: '27.9%'
    }),
    polygon: '0.0,0.0 97.8,-7.5 100.0,109.0 2,92.0',
    interactionType: 'both',
    cursor: 'pointer',
    glowColor: '#ffffff',
    glowSoftColor: 'rgba(255, 255, 255, 0.45)',
    fillColor: 'rgba(255, 255, 255, 0.08)',
    strokeColor: 'rgb(255, 255, 255)',
    action: Object.freeze({
      type: 'navigate',
      targetRoom: 'office',
      animation: null
    })
  }),


  // Bedroom (Projects) -> PC Screen Interaction Animation (Hold on last frame test)
  bedroomPC: Object.freeze({
    id: 'bedroomPC',
    room: 'bedroom',
    label: 'PC',
    shape: 'polygon',
    bounds: Object.freeze({
      left: '39.8%',
      top: '49.0%',
      width: '6.8%',
      height: '4.6%'
    }),
    polygon: '2,20 85,20 88,88 2,94',
    interactionType: 'both',
    cursor: 'pointer',
    glowColor: '#ffffff',
    glowSoftColor: 'rgba(255, 255, 255, 0.45)',
    fillColor: 'rgba(255, 255, 255, 0.08)',
    strokeColor: 'rgb(255, 255, 255)',
    action: Object.freeze({
      type: 'url',
      sequence: 'bedroom_pc',
      url: 'projects/'
    })
  }),

  // Contact Room (Office) -> Harsh Figure Interaction (from Media/Colliders/OfficeCollider.svg)
  officeContact: Object.freeze({
    id: 'officeContact',
    room: 'office',
    label: 'Contact Me',
    shape: 'path',
    bounds: Object.freeze({
      left: '0%',
      top: '0%',
      width: '100%',
      height: '100%'
    }),
    viewBox: '0 0 480 480',
    preserveAspectRatio: 'none',
    path: 'M276.74,270.78c-.06-.07-.05-.19-.04-.44.01-.68.02-1.36.04-2.04.05-2.72.1-5.43.15-8.15.1-5.43.19-10.86.29-16.29.05-2.77.1-5.54.15-8.31.02-.96.04-1.94.33-2.86.95-2.96,4.29-4.31,7.24-5.28.72-2.81-1.26-5.66-1.12-8.56.05-1.03.37-2.05.93-2.92,1.04-1.61,2.92-2.67,4.84-2.62s3.78,1.26,4.52,3.03c.8,1.89.3,4.09-.53,5.97-.63,1.43-1.45,2.77-2.42,3.99,2.55.37,5.05,1.09,7.4,2.15.36.16.73.34.99.64.31.35.42.83.52,1.29.45,2.22.55,4.5.65,6.76.15,3.48.31,6.95.46,10.43.05,1.13.1,2.28-.12,3.39-.22,1.13-.71,2.18-1.08,3.27-.76,2.27-.97,4.69-1.17,7.07-.36,4.21-.72,8.43-.6,12.66-5.36-.78-10.72-1.56-16.08-2.34-1.34-.2-2.68-.39-4.02-.59-.32-.05-.64-.09-.96-.14-.2-.03-.3-.05-.35-.11Z',
    interactionType: 'both',
    cursor: 'pointer',
    glowColor: '#ffffff',
    glowSoftColor: 'rgba(255, 255, 255, 0.45)',
    fillColor: 'rgba(255, 255, 255, 0.08)',
    strokeColor: 'rgb(255, 255, 255)',
    action: Object.freeze({
      type: 'contact'
    })
  }),

  // Kitchen Room -> Island Counter Blog Interaction
  kitchenBlog: Object.freeze({
    id: 'kitchenBlog',
    room: 'kitchen',
    label: 'Case Study',
    shape: 'rect',
    bounds: Object.freeze({
      left: '41%',
      top: '54%',
      width: '26%',
      height: '22%'
    }),
    interactionType: 'both',
    cursor: 'pointer',
    glowColor: '#ff7a18',
    glowSoftColor: 'rgba(255, 122, 24, 0.45)',
    fillColor: 'rgba(255, 122, 24, 0.08)',
    strokeColor: '#ff7a18',
    action: Object.freeze({
      type: 'kitchen_blog'
    })
  })
};
