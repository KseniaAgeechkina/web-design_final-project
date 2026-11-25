'use strict';

// Replace the demo artwork, captions and palettes here. Paths are relative to the HTML pages.
window.PLANET_BRAND = {
  pages: [
    {id:'logo', file:'index2.html', title:'Logo & Graphics', app:'OrbitDraw', icon:'logo-icon.png'},
    {id:'type', file:'index3.html', title:'Typography', app:'Font Cabinet', icon:'type-icon.png'},
    {id:'color', file:'index4.html', title:'Colors & Imagery', app:'Prism Lab', icon:'color-icon.png'},
    {id:'media', file:'index5.html', title:'Brand Applications', app:'Media Library', icon:'media-icon.png'}
  ],
  marks: [
    {id:'primary',name:'Primary lockup',note:'The orbit and the wordmark travel together on packaging, posters and system splash screens.',file:'orbit-color.svg'},
    {id:'stacked',name:'Stacked signature',note:'Centre the emblem over the name on square labels and narrow front panels. Keep the same 1x gap between them.',file:'orbit-color.svg'},
    {id:'compact',name:'Compact emblem',note:'Use the emblem alone for a device badge, small desktop shortcut or disc hub.',file:'orbit-color.svg'},
    {id:'ink',name:'One-colour ink',note:'The deep-blue master keeps the orbit legible in a single ink on light stock.',file:'orbit-ink.svg'},
    {id:'reverse',name:'Reverse white',note:'Use the white master on dark housings, night-blue panels and solid colour fields.',file:'orbit-white.svg'}
  ],
  elements: [
    {name:'Water lens',file:'assets/water-orb.webp',note:'A single refracting sphere gives a composition depth. Keep its rim clear of text.'},
    {name:'Dew leaf',file:'assets/leaf.png',note:'Place the leaf at a lower edge to connect the digital surface with the living world.'},
    {name:'Optical disc',file:'assets/info.png',note:'Use the silver disc as a directional accent. Its prismatic edge picks up the palette.'}
  ],
  patterns:[
    {id:'orbit',name:'Orbital mesh',use:'Wrap band',note:'Offset rings repeat across the sleeve. Leave the top panel quiet for the wordmark.'},
    {id:'ripple',name:'Water ripples',use:'Disc label',note:'Concentric blue rings follow the disc hub and open out toward the label edge.'},
    {id:'sprout',name:'Spore field',use:'Stationery strip',note:'A fine field of leaf-green dots runs along the foot of a printed note.'}
  ],
  families:[
    {name:'Arial',role:'Primary',stack:'Arial, Helvetica, sans-serif',note:'Compact, direct letterforms for wordmarks, interface labels and device markings.'},
    {name:'Georgia',role:'Secondary',stack:'Georgia, "Times New Roman", serif',note:'Soft curves and expressive italics for the brand voice and editorial captions.'}
  ],
  palettes:[
    {group:'Primary',name:'Pelagic Blue',hex:'#07589F',use:'Title bars and system navigation'},
    {group:'Primary',name:'Lagoon',hex:'#12B9CB',use:'Glass, water and illuminated surfaces'},
    {group:'Primary',name:'Leaf',hex:'#9AD943',use:'Activation and small living accents'},
    {group:'Primary',name:'Deep Ink',hex:'#113653',use:'Wordmark and primary text'},
    {group:'Secondary',name:'Glacier',hex:'#DDF5FA',use:'Light canvas and paper stock'},
    {group:'Secondary',name:'Tangerine',hex:'#FF833F',use:'A warm accent borrowed from reef fish'},
    {group:'Secondary',name:'Alloy',hex:'#AABBCD',use:'Brushed metal and interface frames'},
    {group:'Secondary',name:'Foam',hex:'#FAFCF4',use:'Reverse type and quiet backgrounds'}
  ],
  blends:[
    {name:'Deep current',colors:['#113653','#07589F','#12B9CB']},
    {name:'Sunlit leaf',colors:['#07589F','#12B9CB','#9AD943']},
    {name:'Shell chrome',colors:['#AABBCD','#FAFCF4','#AABBCD']}
  ],
  pairs:[
    {name:'System label',foreground:'#FAFCF4',background:'#07589F'},
    {name:'Activation',foreground:'#113653',background:'#9AD943'},
    {name:'Paper caption',foreground:'#113653',background:'#DDF5FA'}
  ],
  photos:[
    {name:'Dew study',subject:'Nature',src:'assets/brand/macro.webp',note:'Shoot close enough to see the veins in a leaf. Let a single droplet catch the light.'},
    {name:'Sunlit reef',subject:'Water',src:'assets/reef.webp',note:'Keep the water luminous and the middle distance clear. Coral introduces a warm counterpoint.'},
    {name:'Aqua Probe',subject:'Eco technology',src:'assets/brand/gadget.webp',note:'Use translucent shells, soft shadows and a visible waterline to explain what a device does.'},
    {name:'Terminal glow',subject:'Digital culture',src:'assets/brand/digital.webp',note:'Keep a physical screen and its reflections in frame. Blue glass belongs beside natural light.'}
  ],
  applications:[
    {name:'Aqua Probe / retail kit',short:'Retail kit',kind:'Packaging',medium:'Physical',src:'assets/brand/packaging.webp',file:'aqua-probe_kit',material:'Printed sleeve · moulded pulp',note:'A restrained sleeve carries the master lockup. The moulded insert gives the sensor its own protected space.'},
    {name:'Aqua Probe / water sensor',short:'Water sensor',kind:'Product',medium:'Physical',src:'assets/brand/gadget.webp',file:'aqua-probe_shell',material:'Translucent shell · LCD',note:'A translucent turquoise housing exposes the electronics. The compact mark sits beside the display.'},
    {name:'Biosphere / waterfront poster',short:'Posters',kind:'Campaign',medium:'Physical',src:'assets/brand/poster.webp',file:'biosphere_poster',material:'Backlit outdoor print',note:'A single large image and a short headline hold their shape behind the glass of a street display.'},
    {name:'Field Office / media kit',short:'Stationery',kind:'Stationery',medium:'Physical',src:'assets/brand/stationery.webp',file:'field-office_kit',material:'Paper goods · optical disc',note:'The disc label, pass and printed cards share an orbital motif and a consistent dark-blue signature.'},
    {name:'Planet OS / boot screen',short:'Boot screen',kind:'Interface',medium:'Digital',src:'assets/brand/digital.webp',file:'planet-os_boot',material:'Desktop display · startup identity',note:'On screen, light replaces ink. The mark is centred in the safe area and the glass picks up the surrounding colour.'}
  ]
};
