'use client';
// The 3D house: rendered rooms you move between, with a page of text for each room.
// React renders every piece; the house controller (lib/house/controller.js) plays the frame
// sequences with three.js and choreographs fades, hotspots, the Contact and case-study windows.
import { useEffect, useRef, useState } from 'react';
import Splash from './Splash';
import Scene from './Scene';
import Hotspots from './Hotspots';
import RoomUI from './RoomUI';
import ContactModal from './ContactModal';
import KitchenBlog from './KitchenBlog';
import { createHouseController } from '@/lib/house/controller';

export default function House() {
  const refs = {
    splash: useRef(null), indicator: useRef(null), percent: useRef(null),
    scene: useRef(null), canvasA: useRef(null), canvasB: useRef(null), backdrop: useRef(null), stage: useRef(null),
    ui: useRef(null), tooltip: useRef(null), contactModal: useRef(null), kitchen: useRef(null),
  };
  const [controller, setController] = useState(null);
  const [roomState, setRoomState] = useState({ title: 'Freedom', nav: 'home' });
  const [hotspots, setHotspots] = useState({ room: null, epoch: 0 });

  useEffect(() => {
    const dom = Object.fromEntries(Object.entries(refs).map(([k, r]) => [k, r.current]));
    const c = createHouseController(dom, {
      setRoomState,
      setHotspots,
      setContactOpen: () => {},
    });
    setController(c);
    c.start();
    return () => c.destroy();
    // Runs once per page load, like the original script.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Splash refs={refs} />
      <Scene refs={refs}>
        <Hotspots room={hotspots.room} epoch={hotspots.epoch} controller={controller} />
      </Scene>
      <RoomUI refs={refs} title={roomState.title} activeNav={roomState.nav} controller={controller} />
      <ContactModal modalRef={refs.contactModal} onClose={() => controller && controller.closeContact()} />
      <KitchenBlog stageRef={refs.kitchen} />
      <div id="interaction-tooltip" className="interaction-tooltip" ref={refs.tooltip} />
    </>
  );
}
