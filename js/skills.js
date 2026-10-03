async function initSkillsPlayground() {
  const arena = document.querySelector('[data-skills-arena]');
  if (!arena || !window.Matter) return;
  await document.fonts.ready;
  const { Engine, Bodies, Body, Composite, Sleeping } = Matter;
  const engine = Engine.create({ enableSleeping: true });
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pills = [...arena.querySelectorAll('.skill-pill')];
  let items = [], visible = false, frame = 0, previous = 0, accumulator = 0, dragging = null, width = 0, height = 0;
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  function paint() {
    items.forEach(({el,body,w,h}) => { el.style.transform = `translate(${body.position.x-w/2}px,${body.position.y-h/2}px) rotate(${body.angle}rad)`; });
  }
  function stopDrag() {
    if (!dragging) return;
    const {item, pointer} = dragging;
    dragging = null;
    item.el.classList.remove('is-dragging');
    if (item.el.hasPointerCapture(pointer)) item.el.releasePointerCapture(pointer);
    Body.setStatic(item.body, motion.matches || document.activeElement === item.el);
    wake();
  }
  function build() {
    stopDrag();
    Composite.clear(engine.world, false);
    Engine.clear(engine);
    previous = 0; accumulator = 0;
    width = arena.clientWidth; height = arena.clientHeight;
    const walls = [Bodies.rectangle(width/2,height+14,width+120,60,{isStatic:true}),Bodies.rectangle(-14,height/2,60,height*3,{isStatic:true}),Bodies.rectangle(width+14,height/2,60,height*3,{isStatic:true}),Bodies.rectangle(width/2,-14,width+120,60,{isStatic:true})];
    Composite.add(engine.world,walls);
    let x = 18, y = 18, rowHeight = 0;
    items = pills.map((el,i) => {
      const w = el.offsetWidth, h = el.offsetHeight;
      if (x+w > width-18) { x=18; y+=rowHeight+12; rowHeight=0; }
      const body = Bodies.rectangle(x+w/2,y+h/2,w,h,{chamfer:{radius:h/2-2},restitution:.35,friction:.45,frictionAir:.018,isStatic:motion.matches});
      x+=w+12; rowHeight=Math.max(rowHeight,h);
      Composite.add(engine.world,body);
      if (!motion.matches) {
        Body.setAngle(body,(i%2?1:-1)*.12);
        Body.setAngularVelocity(body,(i%2?1:-1)*(.035+(i%3)*.015));
        Body.setVelocity(body,{x:(i%5-2)*1.3,y:0});
      }
      return {el,body,w,h};
    });
    arena.classList.add('is-ready');
    paint(); wake();
  }
  function tick(now) {
    frame=0;
    if (!visible || document.hidden || motion.matches) { previous=0; return; }
    accumulator+=Math.min(now-(previous||now),50); previous=now;
    while(accumulator>=1000/60) { Engine.update(engine,1000/60); accumulator-=1000/60; }
    paint();
    if (dragging || items.some(item=>!item.body.isSleeping&&!item.body.isStatic)) frame=requestAnimationFrame(tick);
    else previous=0;
  }
  function wake() { if (!frame && visible && !document.hidden && !motion.matches) { previous=0; frame=requestAnimationFrame(tick); } }
  pills.forEach(el=>{
    el.addEventListener('pointerdown',event=>{
      if (!event.isPrimary || (event.pointerType==='mouse' && event.button!==0)) return;
      stopDrag();
      const item=items.find(item=>item.el===el), rect=arena.getBoundingClientRect();
      if (!item) return;
      el.focus({preventScroll:true});
      Body.setStatic(item.body,true);
      Body.setAngle(item.body,0);
      dragging={item,pointer:event.pointerId,dx:event.clientX-rect.left-item.body.position.x,dy:event.clientY-rect.top-item.body.position.y,last:performance.now(),vx:0,vy:0};
      el.classList.add('is-dragging');
      el.setPointerCapture(event.pointerId);
      wake();
    });
    el.addEventListener('pointermove',event=>{
      if (!dragging || dragging.pointer!==event.pointerId || dragging.item.el!==el) return;
      const {item,dx,dy}=dragging,rect=arena.getBoundingClientRect();
      const position={x:clamp(event.clientX-rect.left-dx,item.w/2+2,width-item.w/2-2),y:clamp(event.clientY-rect.top-dy,item.h/2+2,height-item.h/2-2)};
      const now=performance.now(),dt=Math.max(8,now-dragging.last);
      dragging.vx=clamp((position.x-item.body.position.x)*16.67/dt,-12,12);
      dragging.vy=clamp((position.y-item.body.position.y)*16.67/dt,-12,12);
      dragging.last=now;
      Body.setPosition(item.body,position);
      items.forEach(other=>Sleeping.set(other.body,false));
      paint(); wake();
    });
    const release=()=>{if(dragging?.item.el===el){const {item,vx,vy,last}=dragging;el.blur();stopDrag();if(!motion.matches&&performance.now()-last<120){Body.setVelocity(item.body,{x:vx,y:vy});Body.setAngularVelocity(item.body,vx*.004);}}};
    el.addEventListener('pointerup',release);
    el.addEventListener('pointercancel',release);
    el.addEventListener('lostpointercapture',release);
    el.addEventListener('focus',()=>{
      const item=items.find(item=>item.el===el);if(!item)return;
      Body.setStatic(item.body,true);Body.setAngle(item.body,0);
      Body.setPosition(item.body,{x:clamp(item.body.position.x,item.w/2+18,width-item.w/2-18),y:clamp(item.body.position.y,item.h/2+18,height-item.h/2-18)});paint();
    });
    el.addEventListener('blur',()=>{const item=items.find(item=>item.el===el);if(item&&!dragging){Body.setStatic(item.body,motion.matches);wake();}});
    el.addEventListener('keydown',event=>{
      if(event.key==='Escape'){stopDrag();el.blur();return;}
      const direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
      if(!direction)return;
      event.preventDefault();const item=items.find(item=>item.el===el),step=event.shiftKey?30:12;
      Body.setPosition(item.body,{x:clamp(item.body.position.x+direction[0]*step,item.w/2+2,width-item.w/2-2),y:clamp(item.body.position.y+direction[1]*step,item.h/2+2,height-item.h/2-2)});
      paint();
    });
  });
  new IntersectionObserver(entries => {
    const entered = entries[0].isIntersecting && !visible;
    visible = entries[0].isIntersecting;
    if (!visible) stopDrag();
    // Replay the drop when the panel returns, without interrupting keyboard use.
    if (entered && !motion.matches && !arena.contains(document.activeElement)) build();
    wake();
  }, { threshold: .05 }).observe(arena);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopDrag();wake();});
  motion.addEventListener('change',build);
  new ResizeObserver(()=>{if(arena.clientWidth!==width||arena.clientHeight!==height)build();}).observe(arena);
  build();
}
document.addEventListener('DOMContentLoaded',()=>{initSkillsPlayground().catch(()=>{});});
