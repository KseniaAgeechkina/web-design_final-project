'use strict';

// Each standalone application initializes only the controls in its own document.
(() => {
  const data = window.PLANET_BRAND;
  const $ = id => document.getElementById(id);
  const asset = file => 'assets/brand/' + file;
  function node(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function picture(src, alt = '') {
    const img = new Image();
    img.src = src; img.alt = alt;
    return img;
  }
  function action(label, listener, className) {
    const button = node('button',className,label);
    button.type = 'button';
    button.addEventListener('click',listener);
    return button;
  }
  function pressed(button, yes) { button.setAttribute('aria-pressed',String(yes)); }
  function announce(text) { $('status-message').textContent = text; }
  function toggleButtons(container, key, selected) {
    container.querySelectorAll('button').forEach(b => pressed(b,b.dataset[key] === selected));
  }

  let context, muted = false;
  try { muted = JSON.parse(localStorage.getItem('planetexe.muted')) === true; } catch { /* Storage may be disabled. */ }
  function chime(frequency = 659) {
    if (muted || !(window.AudioContext || window.webkitAudioContext)) return;
    try {
      context ||= new (window.AudioContext || window.webkitAudioContext)();
      if (context.state === 'suspended') context.resume().catch(() => {});
      const osc = context.createOscillator(), amp = context.createGain(), t = context.currentTime;
      osc.frequency.setValueAtTime(frequency,t);
      amp.gain.setValueAtTime(.0001,t); amp.gain.exponentialRampToValueAtTime(.03,t+.015);
      amp.gain.exponentialRampToValueAtTime(.0001,t+.13);
      osc.connect(amp); amp.connect(context.destination); osc.start(t); osc.stop(t+.14);
      osc.onended = () => { osc.disconnect(); amp.disconnect(); };
    } catch { /* The page remains usable when audio output is unavailable. */ }
  }
  function muteLabel() {
    $('book-mute').textContent = muted ? 'Sound off' : 'Sound on';
    $('book-mute').setAttribute('aria-label',muted ? 'Unmute sound' : 'Mute sound');
    pressed($('book-mute'),muted);
  }
  $('book-mute').addEventListener('click',() => {
    muted = !muted;
    try { localStorage.setItem('planetexe.muted',JSON.stringify(muted)); } catch {}
    muteLabel(); if (!muted) chime();
  });
  muteLabel();
  function clock() { $('book-clock').textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',hour12:false}); }
  clock(); setInterval(clock,10000);
  function setMenu(open, restoreFocus = false) {
    $('book-menu').hidden = !open;
    $('start').setAttribute('aria-expanded',String(open));
    if (open) $('book-menu').querySelector('a').focus();
    else if (restoreFocus) $('start').focus();
  }
  $('start').addEventListener('click',() => setMenu($('book-menu').hidden));
  document.addEventListener('click',e => {
    if (!e.target.closest('#start,#book-menu')) setMenu(false);
    if (e.target.closest('button,a') && !e.target.closest('#book-mute')) chime();
  });
  document.addEventListener('keydown',e => {
    if (e.key === 'Escape' && !$('book-menu').hidden) setMenu(false,true);
  });
  const viewer = $('image-viewer');
  function enlarge(item) {
    $('viewer-title').textContent = item.name;
    $('viewer-image').src = item.src;
    $('viewer-image').alt = item.name;
    $('viewer-caption').textContent = item.note;
    viewer.showModal();
    $('viewer-close').focus();
  }
  $('viewer-close').addEventListener('click',() => viewer.close());
  viewer.addEventListener('click',e => {
    if (e.target !== viewer) return;
    const r = viewer.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) viewer.close();
  });

  function logoEditor() {
    let mode = 'marks', surface = 'lagoon';
    const chosen = {marks:0,elements:0,patterns:0};
    const catalogs = {marks:data.marks,elements:data.elements,patterns:data.patterns};
    const canvas = $('artboard'), object = $('draw-object');
    function updateCanvas() {
      const item = catalogs[mode][chosen[mode]];
      object.replaceChildren();
      canvas.dataset.surface = surface;
      canvas.classList.toggle('show-guides',mode === 'marks' && $('guides').checked);
      $('guides-field').hidden = mode !== 'marks';
      $('note-heading').textContent = item.name;
      $('editor-note').textContent = item.note;
      if (mode === 'marks') {
        const lock = node('div','brand-lock ' + item.id);
        lock.append(picture(asset(item.file),'Orbital biosphere emblem'));
        if (item.id !== 'compact') {
          const word = node('strong','','PLANET'); word.append(node('em','','.EXE')); lock.append(word);
        }
        object.append(lock);
        $('doc-name').textContent = 'orbit_' + item.id + '.master';
        $('doc-spec').textContent = 'Vector master';
        $('draw-caption').textContent = $('guides').checked ? 'Construction view' : 'Identity artwork';
      } else if (mode === 'elements') {
        const img = picture(item.file,item.name); img.className = 'element-proof'; object.append(img);
        $('doc-name').textContent = item.file.split('/').pop();
        $('doc-spec').textContent = 'Transparent artwork';
        $('draw-caption').textContent = 'Collage library';
      } else {
        const sample = node('div','pattern-art pattern-' + item.id);
        sample.append(node('span','','PLANET.EXE')); object.append(sample);
        $('doc-name').textContent = item.id + '_repeat.pattern';
        $('doc-spec').textContent = 'Applied pattern';
        $('draw-caption').textContent = item.use;
      }
      toggleButtons($('surfaces'),'surface',surface);
      toggleButtons($('variants'),'index',String(chosen[mode]));
    }
    function setMode(next) {
      mode = next; toggleButtons($('logo-modes'),'mode',mode);
      $('variant-label').textContent = {marks:'Logo version',elements:'Graphics library',patterns:'Pattern proof'}[mode];
      $('variants').replaceChildren(...catalogs[mode].map((item,i) => {
        const b = action(item.name,() => {
          chosen[mode] = i;
          if (mode === 'marks') {
            if (item.id === 'reverse') surface = 'night';
            else if (surface === 'night' && item.id === 'ink') surface = 'paper';
          }
          updateCanvas(); announce(item.name);
        }); b.dataset.index = String(i); return b;
      }));
      updateCanvas();
    }
    for (const b of $('logo-modes').querySelectorAll('button')) b.addEventListener('click',() => setMode(b.dataset.mode));
    for (const [id,name] of [['lagoon','Lagoon'],['paper','Paper'],['night','Night']]) {
      const b = action(name,() => { surface = id; updateCanvas(); announce(name + ' background'); });
      b.dataset.surface = id; $('surfaces').append(b);
    }
    $('guides').addEventListener('change',updateCanvas);
    setMode('marks');
  }

  function fontCabinet() {
    let family = 0, tab = 'glyph';
    const sample = $('live-type');
    const glyphs = [
      ['Uppercase','ABCDEFGHIJKLMNOPQRSTUVWXYZ'],['Lowercase','abcdefghijklmnopqrstuvwxyz'],
      ['Cyrillic','АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'],
      ['Numerals','0123456789'],['Symbols','! ? @ # $ € ₽ % & * ( ) [ ] { } + = / — №']
    ];
    function row(css,label,example) {
      const div = node('div',css);
      div.append(node('small','',label),node('span','',example)); return div;
    }
    function drawSheet() {
      const sheet = $('type-sheet'); sheet.replaceChildren();
      toggleButtons($('proof-tabs'),'proof',tab);
      if (tab === 'glyph') {
        for (const [label,example] of glyphs) sheet.append(row('glyph-row',label,example));
      } else if (tab === 'weight') {
        for (const [name,bold,italic] of [['Regular',false,false],['Italic',false,true],['Bold',true,false],['Bold italic',true,true]]) {
          const line = row('weight-row',name,'Biosphere / Биосфера');
          line.lastChild.style.fontStyle = italic ? 'italic' : 'normal';
          line.lastChild.style.fontWeight = bold ? '700' : '400'; sheet.append(line);
        }
      } else {
        for (const [size,role,example,stack,weight,style] of [
          [34,'Display','PLANET.EXE',data.families[0].stack,900,'normal'],
          [24,'Voice','Nature is our operating system.',data.families[1].stack,700,'italic'],
          [16,'Body','Welcome to the biosphere.',data.families[0].stack,400,'normal'],
          [12,'Caption','PLANET OS · BIOSPHERE EDITION',data.families[0].stack,700,'normal']
        ]) {
          const line = row('hier-row',role,example);
          Object.assign(line.lastChild.style,{fontSize:size+'px',fontFamily:stack,fontWeight:weight,fontStyle:style}); sheet.append(line);
        }
      }
      sheet.style.fontFamily = data.families[family].stack;
    }
    function render() {
      const f = data.families[family], style = $('font-style').value;
      const size = $('font-size').value;
      sample.textContent = $('font-text').value;
      Object.assign(sample.style,{fontFamily:f.stack,fontSize:size+'px',fontWeight:style.includes('bold')?'700':'400',fontStyle:style.includes('italic')?'italic':'normal'});
      $('size-label').textContent = size + ' px';
      $('proof-family').textContent = f.name + ' / ' + $('font-style').selectedOptions[0].text;
      $('proof-role').textContent = f.role + ' family';
      $('font-description').textContent = f.note;
      toggleButtons($('family-list'),'family',String(family));
    }
    for (const [i,f] of data.families.entries()) {
      const b = action('',() => { family=i;render();drawSheet(); },'family-choice');
      b.dataset.family=String(i);
      const mark = node('b','','Aa'); mark.style.fontFamily=f.stack;
      const text = node('span','',f.name); text.append(node('small','',f.role));
      b.append(mark,text); $('family-list').append(b);
    }
    for (const b of $('proof-tabs').querySelectorAll('button')) b.addEventListener('click',() => { tab=b.dataset.proof;drawSheet(); });
    for (const id of ['font-size','font-text','font-style']) $(id).addEventListener('input',render);
    $('type-reset').addEventListener('click',() => {family=0;tab='glyph';$('font-style').value='regular';$('font-size').value='52';$('font-text').value='Nature is our operating system.';render();drawSheet();announce('Specimen reset');});
    render();drawSheet();
  }

  function prismLab() {
    let color = data.palettes[0], photo = 0, view = 'archive';
    function rgb(hex) { return [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)); }
    function updateSwatch() {
      const channels = rgb(color.hex), sample = $('ink-sample');
      const [r,g,b] = channels.map(c => (c/255 <= .04045 ? c/255/12.92 : ((c/255+.055)/1.055)**2.4));
      sample.style.backgroundColor = color.hex;
      sample.style.color = .2126*r+.7152*g+.0722*b > .35 ? '#102f45' : '#fff';
      $('ink-name').textContent = color.name; $('ink-use').textContent = color.use;
      $('copy-hex').querySelector('strong').textContent = color.hex;
      $('copy-rgb').querySelector('strong').textContent = channels.join(', ');
      toggleButtons($('palette-rows'),'hex',color.hex);
    }
    async function copy(value) {
      let ok=false;
      try { await navigator.clipboard.writeText(value); ok=true; } catch {
        const focus = document.activeElement, input=node('textarea','copy-fallback');
        input.value=value; input.style.cssText='position:fixed;top:0;left:-1000px';document.body.append(input);input.select();
        try { ok=document.execCommand('copy'); } catch {}
        input.remove();focus?.focus({preventScroll:true});
      }
      const msg = ok ? 'Copied ' + value : 'Select and copy: ' + value;
      announce(msg);$('copy-result').textContent=msg;
    }
    const feedback=node('p','copy-result','Select a swatch to copy its HEX code.');feedback.id='copy-result';
    document.querySelector('.code-buttons').after(feedback);
    for (const group of new Set(data.palettes.map(p => p.group))) {
      const line = node('div','swatch-row');
      $('palette-rows').append(node('h3','',group),line);
      for (const p of data.palettes.filter(p => p.group===group)) {
        const b = action('',() => {color=p;updateSwatch();copy(p.hex);});
        b.title=p.name+' · '+p.hex; b.setAttribute('aria-label','Select '+p.name+' and copy HEX');b.dataset.hex=p.hex;b.style.background=p.hex;line.append(b);
      }
    }
    $('copy-hex').addEventListener('click',() => copy(color.hex));
    $('copy-rgb').addEventListener('click',() => copy('rgb('+rgb(color.hex).join(', ')+')'));
    function drawRecipes(mode) {
      toggleButtons($('mix-tabs'),'mix',mode);
      const list=$('blends');list.replaceChildren();
      if (mode==='pairs') {
        for (const pair of data.pairs) {
          const row=node('div','colour-pair');
          const swatch=node('b','','Aa');swatch.style.color=pair.foreground;swatch.style.background=pair.background;
          row.append(swatch,node('span','',pair.name),node('code','',pair.foreground+' / '+pair.background));
          list.append(row);
        }
      } else {
        for (const blend of data.blends) {
          const row=node('div','blend'), ribbon=node('i');
          ribbon.style.background='linear-gradient(90deg,'+blend.colors.join(',')+')';
          ribbon.title=blend.colors.join(' / ');row.append(node('span','',blend.name),ribbon);list.append(row);
        }
      }
    }
    for(const b of $('mix-tabs').querySelectorAll('button')) b.addEventListener('click',()=>drawRecipes(b.dataset.mix));
    drawRecipes('pairs');
    function photoButton(item,label) {
      const b=action('',()=>enlarge(item),'zoom-target');
      b.setAttribute('aria-label','Enlarge '+item.name);
      b.append(picture(item.src,item.name),node('span',label==='Enlarge +'?'lens-label':'',label));return b;
    }
    function drawPhotos(refocus=false) {
      toggleButtons($('photo-tabs'),'view',view);
      const panel=$('photo-view'); panel.replaceChildren();
      if (view==='mood') {
        const grid=node('div','mood-grid');
        for(const item of data.photos) grid.append(photoButton(item,item.subject));
        panel.append(grid);return;
      }
      const item=data.photos[photo],hero=photoButton(item,'Enlarge +');hero.classList.add('photo-main');
      const caption=node('div','photo-caption');caption.append(node('h2','',item.name),node('p','',item.note));
      const strip=node('div','filmstrip');
      data.photos.forEach((f,i)=>{
        const button=action('',()=>{photo=i;drawPhotos(true);});
        button.append(picture(f.src),node('span','',f.subject));pressed(button,i===photo);strip.append(button);
      });
      panel.append(hero,caption,strip);
      if (refocus) strip.children[photo].focus({preventScroll:true});
    }
    for(const b of $('photo-tabs').querySelectorAll('button')) b.addEventListener('click',()=>{view=b.dataset.view;drawPhotos();});
    updateSwatch();drawPhotos();
  }

  function mediaLibrary() {
    let visible=data.applications, selected=0;
    function select(i) {
      selected=(i+visible.length)%visible.length;
      const item=visible[selected];
      $('media-image').src=item.src;$('media-image').alt=item.name;
      $('media-name').textContent=item.name;$('media-desc').textContent=item.note;
      $('media-material').textContent=item.material;$('media-kind').textContent=item.medium+' / '+item.kind;
      $('media-filename').textContent=item.file+'.webp';$('file-count').textContent=(selected+1)+' of '+visible.length;
      toggleButtons($('file-list'),'file',String(selected));
      $('media-prev').disabled=$('media-next').disabled=visible.length<2;
    }
    function filter() {
      const medium=$('media-filter').value, previous=visible[selected];
      visible=data.applications.filter(a => medium==='All'||a.medium===medium);
      $('file-list').replaceChildren(...visible.map((item,i)=>{
        const b=action('',()=>select(i),'file-choice');
        b.dataset.file=String(i);
        const text=node('span');text.append(node('b','',item.short),node('small','',item.kind));
        b.append(picture(item.src),text);return b;
      }));
      select(Math.max(0,visible.indexOf(previous)));
    }
    $('media-filter').addEventListener('change',filter);
    $('media-prev').addEventListener('click',()=>select(selected-1));
    $('media-next').addEventListener('click',()=>select(selected+1));
    $('media-enlarge').addEventListener('click',()=>enlarge(visible[selected]));
    filter();
  }
  const applications={logo:logoEditor,type:fontCabinet,color:prismLab,media:mediaLibrary};
  applications[document.body.dataset.page]();
})();
