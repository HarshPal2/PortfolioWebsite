'use client';
// Clickable shapes drawn over the rendered room (doors, the PC, the kitchen island, Harsh in the office).
// The stage is sized by the controller to match the drawn frame; shapes use % of that frame.
import { HOTSPOTS } from '@/lib/house/data';

function Shape({ config, handlers }) {
  const common = {
    className: 'glow-shape',
    role: 'button',
    'aria-label': config.label || config.id,
    style: { cursor: config.cursor || 'pointer' },
    ...handlers,
  };
  if (config.shape === 'polygon' && config.polygon) return <polygon points={config.polygon} {...common} />;
  if (config.shape === 'path' && config.path) return <path d={config.path} {...common} />;
  return <rect x="2" y="2" width="96" height="96" rx="4" {...common} />;
}

function Hotspot({ config, controller }) {
  const supportsHover = config.interactionType === 'hover' || config.interactionType === 'both';
  const supportsClick = config.interactionType === 'click' || config.interactionType === 'both';

  const setHovered = (e, on) => {
    const shapeEl = e.currentTarget;
    const objEl = shapeEl.closest('.interactive-object');
    shapeEl.classList.toggle('is-hovered', on);
    if (objEl) objEl.classList.toggle('is-hovered', on);
  };

  const handlers = {};
  if (supportsHover) {
    handlers.onMouseEnter = (e) => { if (controller.hotspots.enter(config, e)) setHovered(e, true); };
    handlers.onMouseMove = (e) => controller.hotspots.move(e);
    handlers.onMouseLeave = (e) => { setHovered(e, false); controller.hotspots.leave(); };
  }
  if (supportsClick) {
    handlers.onClick = (e) => { e.preventDefault(); e.stopPropagation(); controller.hotspots.activate(config); };
    handlers.onKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); controller.hotspots.activate(config); }
    };
  }

  return (
    <div
      className="interactive-object"
      id={`obj-${config.id}`}
      data-object-id={config.id}
      style={{
        left: config.bounds.left, top: config.bounds.top, width: config.bounds.width, height: config.bounds.height,
        '--obj-glow': config.glowColor, '--obj-glow-soft': config.glowSoftColor,
        '--obj-fill': config.fillColor, '--obj-stroke': config.strokeColor,
      }}
    >
      <svg viewBox={config.viewBox || '0 0 100 100'} preserveAspectRatio={config.preserveAspectRatio || 'none'}>
        <Shape config={config} handlers={handlers} />
      </svg>
    </div>
  );
}

export default function Hotspots({ room, epoch, controller }) {
  if (!controller || !room) return null;
  return Object.values(HOTSPOTS)
    .filter((c) => c.room === room)
    .map((c) => <Hotspot key={`${epoch}-${c.id}`} config={c} controller={controller} />);
}
