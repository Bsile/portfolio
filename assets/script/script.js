$('img').attr('draggable', false);






document.addEventListener('DOMContentLoaded', function () {
  function isAboutPage() {
    return window.location.pathname.endsWith('about.html');
  }
  function isSandboxPage() {
    return window.location.pathname.endsWith('sandbox.html');
  }
  function isHomePage() {
    return window.location.pathname.endsWith('index.html');
  }
  function isMakebetterPage() {
    return window.location.pathname.endsWith('makebetter.html');
  }
  function isDrimePage() {
    return window.location.pathname.endsWith('drime.html');
  }
  function isUpreviewPage() {
    return window.location.pathname.endsWith('upreview.html');
  }
  function isAdsPage() {
    return window.location.pathname.endsWith('ads.html');
  }

  if (isHomePage()) {
    popupvimeo();
  }

  if (isAboutPage()) {
    loadAboutScripts().then(() => {
      webglpixeleffect();
      imgOnHover();
      setupXpHover();
      swiperAnimation();
      initParallax();
    });
  }

  if (isSandboxPage()) {
    initScroll();
  }

  if (isMakebetterPage()) {
    initParallax();
  }

  if (isDrimePage()) {
    initParallax();
  }

  if (isUpreviewPage()) {
    initParallax();
  }

  if (isAdsPage()) {
    initAds();
  }
});






if (typeof window.lenis === 'undefined') {
  window.lenis = null;
}

function initializeLenis() {
  if (window.lenis) {
    window.lenis.destroy(); // Détruire l'ancienne instance de Lenis (transitions Barba)
  }

  // Respecte la préférence système « réduire les animations »
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // smoothWheel = bon nom d'option en Lenis 1.x ("smooth" n'existe pas et était ignoré).
  // Le tactile reste natif (momentum natif = plus fluide sur mobile que le smooth simulé).
  window.lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: !prefersReducedMotion,
  });

  window.lenis.on('scroll', ScrollTrigger.update);

  // IMPORTANT : piloter Lenis avec UNE SEULE boucle, ajoutée une seule fois.
  // Avant, chaque transition Barba empilait une boucle rAF + un gsap.ticker -> Lenis était
  // piloté plusieurs fois par frame -> scroll saccadé, voire totalement figé.
  if (!window._lenisTickerBound) {
    gsap.ticker.add((time) => {
      if (window.lenis) window.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    window._lenisTickerBound = true;
  }
}

// Scroll fluide des ancres internes : un seul écouteur délégué (attaché une fois,
// survit aux transitions Barba, pas d'accumulation, gère aussi les futurs liens).
if (!window._anchorScrollBound) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.length < 2) return;
    // Toujours empêcher le saut natif vers l'ancre (c'est lui qui "téléporte" en haut
    // et se bat avec le smooth scroll, ex. nav chapitres avec href="#main").
    e.preventDefault();
    // Si un onclick gère déjà le scroll (liens chapitres : onclick="lenis.scrollTo(...)"),
    // on le laisse faire pour ne pas déclencher deux scrolls contradictoires.
    const onclick = a.getAttribute('onclick') || '';
    if (onclick.includes('scrollTo')) return;
    const target = document.querySelector(href);
    if (target && window.lenis) window.lenis.scrollTo(target);
  });
  window._anchorScrollBound = true;
}

// Liens Cal.com (bouton Contact) : l'embed Cal ouvre la modale au clic mais ne bloque
// pas la navigation native. Les liens gardent un href de repli (cal.com) pour le cas
// sans JS ; quand JS tourne, on annule la navigation pour conserver l'overlay.
// Écouteur délégué unique -> survit aux transitions Barba.
if (!window._calLinkBound) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[data-cal-link]');
    if (a) e.preventDefault();
  });
  window._calLinkBound = true;
}

initializeLenis();







let mouseMoveListener;
let hoverListeners = [];
let textHoverListeners = [];

function growOnHover() {
  const hoverables = document.querySelectorAll('#link');
  const texthoverables = document.querySelectorAll('#textlink');
  const textinteraction = document.querySelectorAll('#hoverinteraction')

  if (mouseMoveListener) {
    document.body.removeEventListener('mousemove', mouseMoveListener);
  }
  mouseMoveListener = onMouseMove;
  document.body.addEventListener('mousemove', mouseMoveListener);

  hoverListeners.forEach(listener => {
    listener.element.removeEventListener('mouseenter', listener.mouseEnter);
    listener.element.removeEventListener('mouseleave', listener.mouseLeave);
  });
  hoverListeners = [];

  for (let i = 0; i < hoverables.length; i++) {
    hoverListeners.push({
      element: hoverables[i],
      mouseEnter: onMouseHover,
      mouseLeave: onMouseHoverOut
    });
    hoverables[i].addEventListener('mouseenter', onMouseHover);
    hoverables[i].addEventListener('mouseleave', onMouseHoverOut);
  }

  textHoverListeners.forEach(listener => {
    listener.element.removeEventListener('mouseenter', listener.mouseEnter);
    listener.element.removeEventListener('mouseleave', listener.mouseLeave);
  });
  textHoverListeners = [];

  for (let i = 0; i < texthoverables.length; i++) {
    textHoverListeners.push({
      element: texthoverables[i],
      mouseEnter: textOnMouseHover,
      mouseLeave: textOnMouseHoverOut
    });
    texthoverables[i].addEventListener('mouseenter', textOnMouseHover);
    texthoverables[i].addEventListener('mouseleave', textOnMouseHoverOut);
  }

  function onMouseMove(e) {
    TweenMax.to(mouse, 0.5, {
      x: e.clientX - 0,
      y: e.clientY - 0
    });
  }

  function onMouseHover() {
    TweenMax.to(mouse, .3, {
      scale: 1,
    });
    TweenMax.to(textinteraction, .3, {
      scale: 1,
    });
  }

  function onMouseHoverOut() {
    TweenMax.to(mouse, .3, {
      scale: 0.5,
    });
    TweenMax.to(textinteraction, .3, {
      scale: 0,
    });
  }

  function textOnMouseHover() {
    TweenMax.to(mouse, .3, {
      scale: 1,
    });
    TweenMax.to(mouse, 0, {
      backdropFilter: 'invert(1) grayscale(1)',
      backgroundColor: 'var(--contenthover)',
    });
  }

  function textOnMouseHoverOut() {
    TweenMax.to(mouse, .3, {
      scale: 0.5,
    });
    TweenMax.to(mouse, 0, {
      backdropFilter: 'none',
      backgroundColor: 'var(--content)',
    });
  }
}
growOnHover();


function resetCursor() {
  TweenMax.to(mouse, .3, {
    scale: 0.5,
    backdropFilter: 'none',
    backgroundColor: 'var(--content)'
  })
  TweenMax.to(mouse, 1, {
    x: e.clientX - 0,
    y: e.clientY - 0
  });
}





function updateThemeColor() {
  // Récupère l'état actuel du mode
  const isDarkMode = document.body.classList.contains('dark-mode');

  // Sélectionne ou crée la balise meta theme-color
  let metaThemeColor = document.querySelector("meta[name='theme-color']");
  if (!metaThemeColor) {
    metaThemeColor = document.createElement('meta');
    metaThemeColor.setAttribute('name', 'theme-color');
    document.head.appendChild(metaThemeColor);
  }

  // Définit la couleur en fonction du mode
  const themeColor = isDarkMode ? '#f0f0f0' : '#090B0C'; // Correspond à --background pour chaque mode
  metaThemeColor.setAttribute('content', themeColor);
}

function darkmode() {
  const wasDarkmode = localStorage.getItem('darkmode') === 'true';
  localStorage.setItem('darkmode', !wasDarkmode);

  const element = document.body;
  element.classList.toggle('dark-mode', !wasDarkmode);

  // Met à jour la couleur du fond du navigateur
  updateThemeColor();
}

function onload() {
  const isDarkMode = localStorage.getItem('darkmode') === 'true';
  document.body.classList.toggle('dark-mode', isDarkMode);

  // Met à jour la couleur du fond du navigateur au chargement
  updateThemeColor();
}

// Appelle `onload` lors du chargement de la page
window.onload = onload;





function popupvimeo() {
  console.log('Removing previous event listeners for .popup-vimeo...');
  $('.popup-vimeo').off('click.magnificPopup'); // Nettoie les anciens écouteurs

  console.log('Adding new event listeners for .popup-vimeo...');
  $('.popup-vimeo').magnificPopup({
    type: 'iframe',
    removalDelay: 300,
    mainClass: 'mfp-fade'
  });
}
document.addEventListener("DOMContentLoaded", popupvimeo);



function textanimation() {

  // Split text into spans
  let typeSplit = new SplitType("[text-split]", {
    types: "lines, words",
    tagName: "span",
    wordClass: 'word'
  });


  // Text animation
  const textrev = gsap.timeline();

  textrev.from(".word", {
    y: 120,
    stagger: 0.03,
    duration: 1,
    ease: "circ.out",
  });

  gsap.set("[text-split]", { opacity: 1 });

}




function textOnHover(text) {
  const divTexte = document.getElementById('hoverinteraction');

  switch (text) {
    case 'reel':
      // Texte dynamique : "Pause" si la vidéo joue, "Play" sinon (+ écoute des changements d'état)
      setupReelCursorText();
      break;
    case 'project':
      divTexte.textContent = 'Voir';
      break;
    case 'btn':
      divTexte.textContent = ' ';
      break;
    case 'dark':
      divTexte.textContent = ' ';
      break;
    case 'swiper':
      divTexte.textContent = '< >';
      break;
    case 'loading':
      divTexte.textContent = ' ';
      break;
    default:
      break;
  }

}




function changeText(text) {
  const divTexte = document.getElementById('pagename');

  switch (text) {
    case 'work':
      divTexte.textContent = 'Work';
      break;
    case 'about':
      divTexte.textContent = 'About';
      break;
    case 'upreview':
      divTexte.textContent = 'Up Review';
      break;
    case 'drime':
      divTexte.textContent = 'Drime';
      break;
    case 'makebetter':
      divTexte.textContent = 'MakeBetter.app';
      break;
    case 'sandbox':
      divTexte.textContent = 'Extra-projects';
      break;
    case 'legal':
      divTexte.textContent = 'Mentions légales';
      break;
    case 'ads':
      divTexte.textContent = 'Ads collection';
      break;
    default:
      break;
  }

}




function introanimation() {
  var tl = gsap.timeline()
  tl.set("#loader h3", {
    visibility: "visible"
  })
    .set(".intro1", {
      yPercent: 50,
    })
    .set(".intro2", {
      yPercent: 20,
    })
  tl.from("#loader h3", {
    yPercent: 100,
    opacity: 1,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out",
  })
  tl.add('start')
  tl.to("#loader h3", {
    opacity: 1,
    yPercent: -100,
    duration: 1,
    stagger: 0.1,
    ease: "expo.inOut",
  }, 'start')
  tl.to(".intro1", {
    yPercent: 0,
    duration: 1,
    ease: "expo.inOut",
  }, 'start')
  tl.to(".intro2", {
    yPercent: 0,
    duration: 1.1,
    ease: "expo.inOut",
  }, 'start')
  tl.to("#loader", {
    yPercent: -100,
    duration: 1,
    ease: "expo.inOut",
  }, 'start')
  tl.to("#loader", {
    display: "none"
  })
  // clearProps CIBLÉ sur les players v10 uniquement (fix Safari : retire leur transform résiduel).
  // PAS sur tous les .intro1 : ça cassait le bloc-conteneur des absolus (barre de progression sandbox -> bas de page).
  tl.set(".v10-player", { clearProps: "transform" })
}
introanimation()




function pageentrance() {
  var tl = gsap.timeline();
  tl.set(".intro1", {
    yPercent: 50,
  })
    .set(".intro2", {
      yPercent: 20,
    });
  tl.add('start');
  tl.to(".intro1", {
    yPercent: 0,
    duration: 1,
    ease: "expo.inOut",
  }, 'start');
  tl.to(".intro2", {
    yPercent: 0,
    duration: 1.1,
    ease: "expo.inOut",
  }, 'start');
  tl.set(".v10-player", { clearProps: "transform" });  // clearProps CIBLÉ v10 (fix Safari), pas tous les .intro1 (cf. sandbox)
  tl.delay(0.1);
}






function loadAboutScripts() {
  return new Promise((resolve, reject) => {
    if (typeof THREE !== 'undefined') {
      console.log('Three.js is already loaded.');
      resolve();
    } else {
      // Check if the script is already being loaded
      const existingScript = document.querySelector('script[src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r79/three.min.js"]');
      if (existingScript) {
        console.log('Three.js script is already being loaded.');
        existingScript.addEventListener('load', resolve);
        existingScript.addEventListener('error', reject);
      } else {
        console.log('Loading Three.js script...');
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r79/three.min.js';
        script.onload = () => {
          console.log('Three.js script loaded successfully.');
          resolve();
        };
        script.onerror = () => {
          console.error('Failed to load Three.js script.');
          reject();
        };
        document.head.appendChild(script);
      }
    }
  });
}



let renderer, scene, camera, planeMesh;
let animationFrameId = null;

function webglpixeleffect() {
  console.log('Initializing WebGL effect...');
  const imageContainer = document.getElementById("imageContainer");
  const imageElement = document.getElementById("webglpixeleffect");

  let easeFactor = 0.02;
  let mousePosition = { x: 0.5, y: 0.5 };
  let targetMousePosition = { x: 0.5, y: 0.5 };
  let aberrationIntensity = 0.0;
  let prevPosition = { x: 0.5, y: 0.5 };

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D u_texture;
    uniform vec2 u_mouse;
    uniform vec2 u_prevMouse;
    uniform float u_aberrationIntensity;

    void main() {
        vec2 gridUV = floor(vUv * vec2(20.0, 20.0)) / vec2(20.0, 20.0);
        vec2 centerOfPixel = gridUV + vec2(1.0/20.0, 1.0/20.0);

        vec2 mouseDirection = u_mouse - u_prevMouse;

        vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
        float pixelDistanceToMouse = length(pixelToMouseDirection);
        float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);

        vec2 uvOffset = strength * - mouseDirection * 0.2;
        vec2 uv = vUv - uvOffset;

        vec4 colorR = texture2D(u_texture, uv + vec2(strength * u_aberrationIntensity * 0.01, 0.0));
        vec4 colorG = texture2D(u_texture, uv);
        vec4 colorB = texture2D(u_texture, uv - vec2(strength * u_aberrationIntensity * 0.01, 0.0));

        gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, 1.0);
    }
  `;

  function initializeScene(texture) {
    console.log('Initializing scene...');
    scene = new THREE.Scene();

    const imageAspect = imageElement.naturalWidth / imageElement.naturalHeight;
    const containerAspect = imageContainer.offsetWidth / imageContainer.offsetHeight;

    camera = new THREE.OrthographicCamera(
      -containerAspect, containerAspect, 1, -1, 0.01, 10
    );
    camera.position.z = 1;

    const shaderUniforms = {
      u_mouse: { type: "v2", value: new THREE.Vector2() },
      u_prevMouse: { type: "v2", value: new THREE.Vector2() },
      u_aberrationIntensity: { type: "f", value: 0.0 },
      u_texture: { type: "t", value: texture }
    };

    let planeWidth, planeHeight;
    if (containerAspect > imageAspect) {
      planeWidth = 2 * containerAspect;
      planeHeight = planeWidth / imageAspect;
    } else {
      planeHeight = 2;
      planeWidth = planeHeight * imageAspect;
    }

    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

    planeMesh = new THREE.Mesh(
      geometry,
      new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader,
        fragmentShader
      })
    );

    scene.add(planeMesh);

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(imageContainer.offsetWidth, imageContainer.offsetHeight);

    imageContainer.appendChild(renderer.domElement);
  }

  function onResize() {
    console.log('Resizing...');
    const containerAspect = imageContainer.offsetWidth / imageContainer.offsetHeight;
    const imageAspect = imageElement.naturalWidth / imageElement.naturalHeight;

    camera.left = -containerAspect;
    camera.right = containerAspect;
    camera.top = 1;
    camera.bottom = -1;
    camera.updateProjectionMatrix();

    let planeWidth, planeHeight;
    if (containerAspect > imageAspect) {
      planeWidth = 2 * containerAspect;
      planeHeight = planeWidth / imageAspect;
    } else {
      planeHeight = 2;
      planeWidth = planeHeight * imageAspect;
    }

    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

    renderer.setSize(imageContainer.offsetWidth, imageContainer.offsetHeight);
  }

  window.addEventListener('resize', onResize);

  initializeScene(new THREE.TextureLoader().load(imageElement.src));

  function animateScene() {
    animationFrameId = requestAnimationFrame(animateScene);

    if (!renderer || !scene || !camera) return;

    mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor;
    mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor;

    planeMesh.material.uniforms.u_mouse.value.set(
      mousePosition.x,
      1.0 - mousePosition.y
    );

    planeMesh.material.uniforms.u_prevMouse.value.set(
      prevPosition.x,
      1.0 - prevPosition.y
    );

    aberrationIntensity = Math.max(0.0, aberrationIntensity - 0.05);

    planeMesh.material.uniforms.u_aberrationIntensity.value = aberrationIntensity;

    renderer.render(scene, camera);
  }

  animateScene();

  // Définitions de fonctions pour les écouteurs d'événements
  function handleMouseMove(event) {
    easeFactor = 0.02;
    let rect = imageContainer.getBoundingClientRect();
    prevPosition = { ...targetMousePosition };

    targetMousePosition.x = (event.clientX - rect.left) / rect.width;
    targetMousePosition.y = (event.clientY - rect.top) / rect.height;

    aberrationIntensity = 1;
  }

  function handleMouseEnter(event) {
    easeFactor = 0.02;
    let rect = imageContainer.getBoundingClientRect();

    mousePosition.x = targetMousePosition.x = (event.clientX - rect.left) / rect.width;
    mousePosition.y = targetMousePosition.y = (event.clientY - rect.top) / rect.height;
  }

  function handleMouseLeave() {
    easeFactor = 0.05;
    targetMousePosition = { ...prevPosition };
  }

  // Ajout des nouveaux event listeners
  console.log('Adding new event listeners...');
  imageContainer.addEventListener("mousemove", handleMouseMove);
  imageContainer.addEventListener("mouseenter", handleMouseEnter);
  imageContainer.addEventListener("mouseleave", handleMouseLeave);

  // Nettoyage
  function cleanupWebGL() {
    if (renderer) {
      console.log('Cleaning up WebGL...');
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;

      // Suppression des event listeners de imageContainer
      console.log('Removing event listeners...');
      imageContainer.removeEventListener("mousemove", handleMouseMove);
      imageContainer.removeEventListener("mouseenter", handleMouseEnter);
      imageContainer.removeEventListener("mouseleave", handleMouseLeave);

      // Suppression de l'écouteur d'événements resize
      window.removeEventListener('resize', onResize);

      // Suppression de l'élément renderer de imageContainer
      if (renderer.domElement) {
        renderer.domElement.remove();
      }

      // Dispose du renderer Three.js
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.context = null;
      renderer.domElement = null;
      renderer = null;

      // Nettoyage de la scène Three.js
      if (scene) {
        while (scene.children.length > 0) {
          const child = scene.children[0];
          scene.remove(child);
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        }
      }

      scene = null;
      camera = null;
      planeMesh = null;
    }
  }

  // Assurez-vous d'ajouter cleanupWebGL à la portée globale pour pouvoir l'appeler depuis l'extérieur
  window.cleanupWebGL = cleanupWebGL;
}








let imgMouseMoveListener;
let imgHoverListeners = [];

function imgOnHover() {
  const imghover = document.querySelectorAll('#imghover');
  const imgbehind = document.querySelector('#imgbehind');

  if (imgMouseMoveListener) {
    document.body.removeEventListener('mousemove', imgMouseMoveListener);
  }
  imgMouseMoveListener = onMouseMove;
  document.body.addEventListener('mousemove', imgMouseMoveListener);

  imgHoverListeners.forEach(listener => {
    listener.element.removeEventListener('mouseenter', listener.mouseEnter);
    listener.element.removeEventListener('mouseleave', listener.mouseLeave);
  });
  imgHoverListeners = [];

  for (let i = 0; i < imghover.length; i++) {
    imgHoverListeners.push({
      element: imghover[i],
      mouseEnter: imgOnMouseHover,
      mouseLeave: imgOnMouseHoverOut
    });
    imghover[i].addEventListener('mouseenter', imgOnMouseHover);
    imghover[i].addEventListener('mouseleave', imgOnMouseHoverOut);
  }

  function onMouseMove(e) {
    TweenMax.to(imgbehind, 1, {
      x: e.pageX,
      y: e.pageY
    });
  }

  function imgOnMouseHover() {
    TweenMax.to(imgbehind, .2, {
      scale: 1,
    });
  }

  function imgOnMouseHoverOut() {
    TweenMax.to(imgbehind, .2, {
      scale: 0,
    });
  }
}





let xpHoverListeners = [];

function setupXpHover() {
  const columns = document.querySelectorAll('.xpcolumn');

  // Clear previous listeners to avoid duplication
  xpHoverListeners.forEach(listener => {
    listener.element.removeEventListener('mouseenter', listener.mouseEnter);
    listener.element.removeEventListener('mouseleave', listener.mouseLeave);
  });
  xpHoverListeners = [];

  columns.forEach(column => {
    const targetClass = column.getAttribute('data-target');
    const targetElements = document.querySelectorAll(targetClass);

    const mouseEnter = () => {
      targetElements.forEach(element => element.classList.add('hovered'));
    };

    const mouseLeave = () => {
      targetElements.forEach(element => element.classList.remove('hovered'));
    };

    xpHoverListeners.push({
      element: column,
      mouseEnter: mouseEnter,
      mouseLeave: mouseLeave
    });

    column.addEventListener('mouseenter', mouseEnter);
    column.addEventListener('mouseleave', mouseLeave);
  });
}








let swiperInstance;

function loadSwiperScripts() {
  return new Promise((resolve, reject) => {
    if (typeof Swiper !== 'undefined') {
      console.log('Swiper.js is already loaded.');
      resolve();
    } else {
      // Check if the script is already being loaded
      const existingScript = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"]');
      if (existingScript) {
        console.log('Swiper.js script is already being loaded.');
        existingScript.addEventListener('load', resolve);
        existingScript.addEventListener('error', reject);
      } else {
        console.log('Loading Swiper.js script...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
        script.onload = () => {
          console.log('Swiper.js script loaded successfully.');
          resolve();
        };
        script.onerror = () => {
          console.error('Failed to load Swiper.js script.');
          reject();
        };
        document.head.appendChild(script);

        // Load Swiper CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
        document.head.appendChild(link);
      }
    }
  });
}

function swiperAnimation() {
  if (swiperInstance) {
    console.log('Swiper instance already exists.');
    return;
  }

  swiperInstance = new Swiper(".mySwiper", {
    autoHeight: true,
    grabCursor: true,
    scrollbar: {
      el: ".swiper-scrollbar",
      draggable: false,
    },
    speed: 400,
    slidesPerView: 1,
    spaceBetween: 10,
    // Responsive breakpoints
    breakpoints: {
      900: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 2,
        spaceBetween: 50,
      },
    },
  });
}

function destroySwiper() {
  if (swiperInstance) {
    swiperInstance.destroy(true, true);
    swiperInstance = null;
    console.log('Swiper instance destroyed.');
  }
}

function initSwiper() {
  loadSwiperScripts().then(() => {
    swiperAnimation();
  }).catch((error) => {
    console.error('Error loading Swiper scripts:', error);
  });
}






function initParallax() {
  gsap.utils.toArray(".parallax").forEach((section, i) => {
    const heightDiff = 50; // Valeur fixe, ajustez selon vos besoins
    const scaleAmount = 1; // Agrandissement initial de l'image

    gsap.fromTo(section, {
      y: heightDiff,
      scale: scaleAmount,
    }, {
      scrollTrigger: {
        trigger: section,
        scrub: true
      },
      y: -1, // Valeur finale de déplacement Y lors du scroll
      scale: scaleAmount, // Maintient l'agrandissement initial
      ease: "none"
    });
  });
}

function cleanupParallax() {
  console.log('Nettoyage du parallaxe en cours...');

  gsap.utils.toArray(".parallax-container .parallax").forEach((section, i) => {
    const tweens = gsap.getTweensOf(section);

    if (tweens.length > 0) {
      console.log(`Arrêt des animations pour l'élément ${section}`);
      tweens.forEach(tween => {
        tween.kill(); // Arrête toutes les animations associées à la section
      });
    } else {
      console.log(`Aucune animation trouvée pour l'élément ${section}`);
    }
  });

  console.log('Nettoyage du parallaxe terminé.');
}


/* ===================== ADS COLLECTION (ads.html) ===================== */

/* ---- Interrupteurs (un seul mot à changer, puis `npm run build`) ----
   ADS_CROSSFADE_MS : fondu entre deux créas dans la modale. **0 = désactivé**,
     état actuel. Testé sur iPhone le 2026-07-30 et rejeté : la couche de fondu
     est insérée SOUS le panneau bas, qui porte un `backdrop-filter: blur(30px)`
     → iOS recompose son arrière-plan à l'insertion puis au retrait de la
     couche, d'où un flash au niveau du panneau. Non reproductible en Chrome
     (compositing propre à iOS), donc non corrigeable à l'aveugle depuis ici.
     Le code reste derrière l'interrupteur : pour réessayer il faudrait une
     couche PERMANENTE dans le DOM (aucune insertion/retrait, donc aucune
     recomposition) ou une couche clippée pour ne jamais passer sous le panneau.
   ADS_PANEL_PERF   : contain + will-change sur le panneau bas mobile.
     **false = désactivé**, état actuel. Reculé le 2026-07-30 : le glissé du
     panneau a été rapporté saccadé pendant que ces règles étaient actives, et
     `will-change: transform` sur un élément qui porte DÉJÀ un
     `backdrop-filter` peut coûter plus qu'il ne rapporte. Retour à la
     référence connue avant de retenter autre chose. */
const ADS_CROSSFADE_MS = 0;
const ADS_PANEL_PERF = false;

let _adsCards = [];
let _adsCurrentIndex = -1;
let _adsMoveHandlers = [];
let _adsVideoHandlers = [];
let _adsModalHandlers = [];
let _adsDocBound = false;
let _adsThumbAnim = false;
let _adsPreviewObserver = null;   // autoplay des previews vidéo de la galerie quand elles sont visibles
let _adsResizeHandler = null;     // recalcul de la safe-area au resize/orientation
let _adsThumbRaf = null;          // animation de snap du carrousel (rAF), annulable

// Décalage vertical des contrôles du player : ils se posent 10px au-dessus du
// panneau de détails et le suivent. La valeur = px de détails révélés (+ rebond).
// Lue par le CSS injecté dans le shadow des players de la modale (ADS_CTRL_CSS) :
// les propriétés personnalisées franchissent la frontière du shadow DOM.
function adsSetCtrlShift(modal, px) {
  if (modal) modal.style.setProperty('--ads-ctrl-shift', (px || 0) + 'px');
}

// Remet le bottom-sheet (détails) replié, instantanément (sans transition)
function adsResetSheet(modal) {
  const info = modal.querySelector('.adsmodal-info');
  const details = modal.querySelector('.adsmodal-details');
  if (info) { info.style.setProperty('--sheet', '0'); info.style.transform = ''; info.classList.remove('is-dragging'); }
  // Contrôles remis à leur place basse sans animation, comme les détails.
  modal.style.setProperty('--ads-ctrl-dur', '0s');
  adsSetCtrlShift(modal, 0);
  if (details) {
    details.style.transition = 'none';
    details.style.height = '0px';
    void details.offsetHeight; // reflow → applique le 0 sans animation
    details.style.transition = '';
  }
  requestAnimationFrame(() => modal.style.removeProperty('--ads-ctrl-dur'));
}

// Position du ✕ en plein écran mobile. env(safe-area-inset-top) est peu fiable sur
// iOS (il rapporte 0 par intermittence selon l'état de la toolbar), donc on détecte
// les iPhone à encoche / dynamic island (UA + ratio d'écran > 2) et on pose une
// valeur fixe ; sur les autres appareils on la retire et le CSS retombe sur env().
//
// 15px = même écart en haut qu'à droite (`right: 15px`), demandé par l'utilisateur :
// à 40px le retrait du haut faisait presque le triple de celui de droite, le ✕ ne
// lisait pas comme posé dans le coin. ⚠️ À 15px le ✕ (37px de haut, donc y = 15→52)
// croise la bande où iOS dessine l'heure et la batterie (y ≈ 17→30) : il est à
// droite donc jamais sous la dynamic island, mais il passe sous l'indicateur de
// batterie. Si ça gêne à l'usage, 34px est la valeur la plus haute qui dégage
// complètement la barre de statut. Seul nombre à toucher.
//
// Il n'y a plus de --ads-safe-min : le voile dégradé du haut a été retiré le
// 2026-07-30 (la créa monte jusqu'au bord de l'écran), c'était son seul usage.
function adsSetSafeMin() {
  const s = window.screen || {};
  const ratio = (s.width && s.height) ? Math.max(s.width, s.height) / Math.min(s.width, s.height) : 0;
  const notched = /iPhone|iPod/.test(navigator.userAgent) && ratio > 2;
  if (notched) document.documentElement.style.setProperty('--ads-close-top', '15px');
  else document.documentElement.style.removeProperty('--ads-close-top');
}

// Mesure la hauteur du panneau REPLIÉ (détails exclus) et la pose en --ads-sheet-h
// sur la modale. La créa mobile s'en sert pour se centrer sur la zone visible
// (au-dessus du panneau replié). En soustrayant la hauteur des détails, la valeur
// reste CONSTANTE même panneau déployé → la créa ne bouge pas quand on ouvre les
// détails, le panneau la recouvre simplement davantage.
// Le prolongement du panneau sous l'écran est un ::after (position:absolute), donc
// il n'entre pas dans offsetHeight : la mesure reste juste.
function adsSyncSheetHeight() {
  const modal = document.getElementById('adsmodal');
  if (!modal) return;
  const info = modal.querySelector('.adsmodal-info');
  const details = modal.querySelector('.adsmodal-details');
  if (!info) return;
  const h = info.offsetHeight - (details ? details.offsetHeight : 0);
  if (h > 0) modal.style.setProperty('--ads-sheet-h', h + 'px');
}

// Position de scroll qui met une vignette pile au centre du carrousel.
function adsThumbScrollTarget(wrap, el) {
  return Math.round(el.offsetLeft + el.offsetWidth / 2 - wrap.clientWidth / 2);
}

// Anime scrollLeft du carrousel jusqu'à `to` (scrollLeft n'est pas animable en CSS).
// Easing out-quart : départ franc, atterrissage long et doux, le ressenti d'une
// inertie qui se pose, cohérent avec les autres mouvements du site. Durée
// proportionnelle à la distance (bornée) pour qu'un petit ajustement reste vif.
// _adsThumbAnim suspend le settle au scroll pendant l'animation.
function adsAnimateThumbs(wrap, to, done) {
  if (_adsThumbRaf) { cancelAnimationFrame(_adsThumbRaf); _adsThumbRaf = null; }
  const from = wrap.scrollLeft;
  const dist = to - from;
  const finish = () => { _adsThumbRaf = null; _adsThumbAnim = false; if (done) done(); };
  if (Math.abs(dist) < 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    wrap.scrollLeft = to;
    finish();
    return;
  }
  const dur = Math.min(420, Math.max(180, Math.abs(dist) * 1.1));
  const t0 = performance.now();
  _adsThumbAnim = true;
  const step = (t) => {
    const p = Math.min(1, (t - t0) / dur);
    wrap.scrollLeft = from + dist * (1 - Math.pow(1 - p, 4));
    if (p < 1) _adsThumbRaf = requestAnimationFrame(step);
    else finish();
  };
  _adsThumbRaf = requestAnimationFrame(step);
}

function adsSetCardLight(card, e) {
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
  card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
}

function adsCloseCta() {
  const cta = document.querySelector('.cta.open');
  if (!cta) return;
  cta.classList.remove('open');
  const trigger = cta.querySelector('.cta-trigger');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function adsOpenModal(index, thumbMode) {
  const modal = document.getElementById('adsmodal');
  const card = _adsCards[index];
  if (!modal || !card) return;
  const wasOpen = modal.classList.contains('open');
  const prevCard = _adsCurrentIndex >= 0 ? _adsCards[_adsCurrentIndex] : null;
  _adsCurrentIndex = index;
  // Retire le focus (et l'outline navigateur) de la card cliquée derrière la modale
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  const d = card.dataset;

  modal.querySelector('.adsmodal-brandname').textContent = d.brand || '';
  const dot = modal.querySelector('.adsmodal-brand-dot');
  if (dot) dot.style.background = d.accent || 'var(--content)';
  modal.querySelectorAll('.adsmodal-v').forEach((el) => {
    el.textContent = d[el.dataset.field] || 'Non précisé';
  });

  const tagWrap = modal.querySelector('.adsmodal-tags');
  tagWrap.innerHTML = '';
  (d.tags || '').split(',').map((t) => t.trim()).filter(Boolean).forEach((t) => {
    const s = document.createElement('span');
    s.className = 'adtag';
    s.textContent = t;
    tagWrap.appendChild(s);
  });

  const stage = modal.querySelector('.adsmodal-creative');

  // Fondu entre créas : on fige la créa sortante en une simple <img> (son poster)
  // qu'on garde AU-DESSUS de la nouvelle, puis on la dissout. La nouvelle est déjà
  // opaque dessous → aucune latence ajoutée et aucun flash de fond, contrairement
  // à un fade-out puis fade-in. Le poster suffit : sur 140 ms, l'écart avec la
  // frame vidéo en cours est imperceptible. Rollback : ADS_CROSSFADE_MS = 0.
  const fadePoster = prevCard && prevCard !== card ? (prevCard.dataset.poster || prevCard.dataset.src) : null;
  const doFade = ADS_CROSSFADE_MS > 0 && wasOpen && fadePoster
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.V10) V10.cleanup();            // démonte le player v10 de la créa précédente
  stage.classList.remove('v10-player');
  stage.innerHTML = '';
  stage.style.background = d.accent || 'var(--box)';
  if (d.type === 'video' && d.src) {
    // Player Video.js v10 (HLS auto-hébergé) dans <video-player><video-skin>, même système que les héros.
    stage.classList.add('v10-player');
    const player = document.createElement('video-player');
    const skin = document.createElement('video-skin');
    const media = document.createElement('hlsjs-video');
    media.setAttribute('src', d.src);        // master.m3u8
    media.setAttribute('playsinline', '');
    media.setAttribute('loop', '');
    if (d.vtt) {                              // storyboard : miniatures au survol de la barre de progression
      const track = document.createElement('track');
      track.setAttribute('kind', 'metadata');
      track.setAttribute('src', d.vtt);
      track.setAttribute('default', '');
      media.appendChild(track);
    }
    skin.appendChild(media);
    if (d.poster) {
      const poster = document.createElement('media-poster');
      const pimg = document.createElement('img');  // v10 rend le poster via son CONTENU (enfant), pas l'attribut src
      pimg.src = d.poster;
      pimg.alt = '';
      poster.appendChild(pimg);
      skin.appendChild(poster);
    }
    player.appendChild(skin);
    stage.appendChild(player);
    if (window.V10) V10.init(modal);         // monte le player v10 de la modale (+ pause auto des autres)
  } else if (d.src) {
    const img = document.createElement('img');
    img.src = d.src;
    img.alt = d.brand ? 'Créa publicitaire ' + d.brand : 'Créa publicitaire';
    stage.appendChild(img);
  }

  if (doFade) {
    const out = document.createElement('img');
    out.className = 'adsmodal-fade';        // absolute inset:0, z-index 1, pointer-events:none
    out.src = fadePoster;
    out.alt = '';
    stage.appendChild(out);
    // Web Animations plutôt qu'une transition CSS : la durée reste définie au seul
    // endroit qui compte (ADS_CROSSFADE_MS) et le nettoyage est branché sur finished.
    const anim = out.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ADS_CROSSFADE_MS, easing: 'linear' });
    anim.finished.then(() => out.remove(), () => out.remove());
  }

  // Carrousel mobile (boucle infinie) : marque toutes les copies de la vignette
  // active. Recentrage selon le mode :
  //  - 'skip'   : pas de scroll (scroll-settle ; clic déjà géré à part)
  //  - 'smooth' : scroll animé vers la copie la plus proche (swipe créa, flèches)
  //  - défaut   : centre la copie du milieu, instantané (ouverture fraîche)
  const wrap = modal.querySelector('.adsmodal-thumbs');
  const thumbs = wrap ? wrap.querySelectorAll('.adsthumb') : [];
  const nThumbs = _adsCards.length;
  thumbs.forEach((t) => t.classList.toggle('active', parseInt(t.dataset.idx, 10) === index));
  if (thumbMode !== 'skip' && thumbs.length) {
    if (thumbMode === 'smooth') {
      // Suspend le saut de boucle le temps de l'animation, puis anime vers la
      // copie de `index` la plus proche du centre (≈ un pas pour un swipe ±1).
      _adsThumbAnim = true;
      const mid = wrap.getBoundingClientRect().left + wrap.clientWidth / 2;
      let target = null, bd = Infinity;
      thumbs.forEach((t) => {
        if (parseInt(t.dataset.idx, 10) !== index) return;
        const r = t.getBoundingClientRect();
        const dd = Math.abs(r.left + r.width / 2 - mid);
        if (dd < bd) { bd = dd; target = t; }
      });
      if (target) adsAnimateThumbs(wrap, adsThumbScrollTarget(wrap, target));
      else _adsThumbAnim = false;
    } else {
      const target = thumbs[nThumbs + index] || thumbs[index];
      if (target) target.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'auto' });
    }
  }

  if (wasOpen) {
    // Switch de créa (panneau déjà ouvert) : réajuste la hauteur du panneau à la
    // hauteur du nouveau contenu, animée par la transition CSS (les détails
    // peuvent différer d'une créa à l'autre).
    const infoEl = modal.querySelector('.adsmodal-info');
    const detailsEl = modal.querySelector('.adsmodal-details');
    const innerEl = modal.querySelector('.adsmodal-details-inner');
    if (infoEl && detailsEl && innerEl) {
      const p = parseFloat(infoEl.style.getPropertyValue('--sheet')) || 0;
      if (p > 0) {
        const revele = p * innerEl.offsetHeight;
        detailsEl.style.height = revele + 'px';
        adsSetCtrlShift(modal, revele);   // les contrôles suivent la nouvelle hauteur
      }
    }
  } else {
    // Ouverture "fraîche" : détails repliés
    adsResetSheet(modal);
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.documentElement.classList.add('ads-modal-open');
  document.body.classList.add('ads-modal-open');
  if (window.lenis) window.lenis.stop();
  // Mesure la zone visible (mobile) une fois la modale posée : la créa s'y centre.
  if (!wasOpen) requestAnimationFrame(adsSyncSheetHeight);
}

// Peuple le carrousel de vignettes (une par créa), mobile only.
// 3 copies identiques → carrousel en boucle (ni début ni fin visibles). Chaque
// vignette porte data-idx = index de la vraie créa.
function adsBuildThumbs() {
  const wrap = document.querySelector('#adsmodal .adsmodal-thumbs');
  if (!wrap) return;
  wrap.innerHTML = '';
  const make = (i) => {
    const d = _adsCards[i].dataset;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'adsthumb';
    b.dataset.idx = i;
    b.setAttribute('aria-label', 'Voir la créa ' + (i + 1));
    if (d.poster) {
      const img = document.createElement('img');
      img.src = d.poster;
      img.alt = '';
      img.loading = 'lazy';
      b.appendChild(img);
    } else if (d.accent) {
      b.style.background = d.accent;
    }
    b.addEventListener('click', () => {
      // Tap (pas un drag) : la créa s'ouvre tout de suite (geste explicite, on
      // veut la réponse immédiate) et le carrousel recentre la vignette en
      // parallèle. _adsThumbAnim suspend le saut de boucle pendant l'animation.
      adsOpenModal(i, 'skip');
      adsAnimateThumbs(wrap, adsThumbScrollTarget(wrap, b));
    });
    return b;
  };
  for (let copy = 0; copy < 3; copy++) {
    for (let i = 0; i < _adsCards.length; i++) wrap.appendChild(make(i));
  }
}

function adsCloseModal() {
  const modal = document.getElementById('adsmodal');
  if (!modal) return;
  // Coupe un snap de carrousel en cours (sinon le rAF survit à la fermeture et
  // à la transition Barba). cleanupAds() passe aussi par ici.
  if (_adsThumbRaf) { cancelAnimationFrame(_adsThumbRaf); _adsThumbRaf = null; }
  _adsThumbAnim = false;
  const stage = modal.querySelector('.adsmodal-creative');
  if (stage) {
    if (window.V10) V10.cleanup();           // démonte + stoppe le player v10 s'il y en a un
    stage.classList.remove('v10-player');
    stage.innerHTML = '';
  }
  adsResetSheet(modal);
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.documentElement.classList.remove('ads-modal-open');
  document.body.classList.remove('ads-modal-open');
  _adsCurrentIndex = -1;
  if (window.lenis) window.lenis.start();
}

function adsModalStep(dir) {
  if (!_adsCards.length) return;
  let i = _adsCurrentIndex + dir;
  if (i < 0) i = _adsCards.length - 1;
  if (i >= _adsCards.length) i = 0;
  adsOpenModal(i, 'smooth');
}

function adsGridBatch() {
  if (window.matchMedia('(max-width: 740px)').matches) return 8;
  if (window.matchMedia('(max-width: 1280px)').matches) return 12;
  return 15;
}

function adsRevealMore() {
  const hidden = document.querySelectorAll('#adsgrid .adcard.is-hidden');
  const batch = adsGridBatch();
  for (let i = 0; i < batch && i < hidden.length; i++) hidden[i].classList.remove('is-hidden');
  adsUpdateMoreVisibility();
  if (typeof refreshScrollSystems === 'function') setTimeout(refreshScrollSystems, 150);
}

function adsUpdateMoreVisibility() {
  const more = document.querySelector('.adsmore');
  if (!more) return;
  const remaining = document.querySelectorAll('#adsgrid .adcard.is-hidden').length;
  more.classList.toggle('is-done', remaining === 0);
}

function adsDocClick(e) {
  if (!e.target.closest('.cta')) adsCloseCta();
}

function adsDocKey(e) {
  const modal = document.getElementById('adsmodal');
  const modalOpen = modal && modal.classList.contains('open');
  if (e.key === 'Escape') {
    if (modalOpen) adsCloseModal();
    else adsCloseCta();
    return;
  }
  if (!modalOpen) return;
  // Flèches / espace : navigation entre créas quand la modale est ouverte
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault();
    adsModalStep(1);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    adsModalStep(-1);
  }
}

function initAds() {
  const grid = document.getElementById('adsgrid');
  if (!grid) return;

  // Mobile : les ads "flottantes" du hero (les meilleures) rejoignent la tête
  // de la grille au lieu d'être masquées → aucun contenu perdu. On retire les
  // classes .adsfloat* : elles redeviennent de simples .adcard (rendu identique
  // aux autres cards de la grille, sans conflit de positionnement/affichage).
  if (window.matchMedia('(max-width: 740px)').matches) {
    Array.from(document.querySelectorAll('#adshero .adsfloat')).reverse().forEach((f) => {
      f.classList.remove('adsfloat', 'adsfloat--tl', 'adsfloat--tr', 'adsfloat--bl', 'adsfloat--br');
      grid.insertBefore(f, grid.firstChild);
    });
  }

  _adsCards = Array.from(document.querySelectorAll('.adcard'));

  // Nombre de cards visibles initialement (desktop 5x3=15, tablette 3x4=12, mobile 2x4=8)
  const initialVisible = adsGridBatch();
  Array.from(grid.querySelectorAll('.adcard')).forEach((c, i) => {
    c.classList.toggle('is-hidden', i >= initialVisible);
  });

  // Preview galerie : joue les vidéos visibles, pause hors écran (respecte
  // prefers-reduced-motion → poster figé, pas d'autoplay).
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  _adsPreviewObserver = (!reduce && 'IntersectionObserver' in window)
    ? new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting) { const p = v.play(); if (p && p.catch) p.catch(() => { }); }
        else v.pause();
      });
    }, { rootMargin: '150px 0px' })
    : null;

  _adsCards.forEach((card, i) => {
    card.addEventListener('click', () => adsOpenModal(i));
    const move = (e) => adsSetCardLight(card, e);
    card.addEventListener('mousemove', move);
    _adsMoveHandlers.push({ el: card, fn: move });

    // Preview animée : le <video.adcard-video> est déjà dans la card (HTML).
    // On l'observe pour l'autoplay-quand-visible (au lieu d'un hover).
    if (card.dataset.type === 'video') {
      const vid = card.querySelector('.adcard-video');
      if (vid && _adsPreviewObserver) _adsPreviewObserver.observe(vid);
    }
  });

  const trigger = document.querySelector('.cta-trigger');
  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const cta = trigger.closest('.cta');
      const open = cta.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const more = document.querySelector('.adsmore');
  if (more) {
    more.addEventListener('click', adsRevealMore);
    more.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); adsRevealMore(); }
    });
  }
  adsUpdateMoreVisibility();

  const modal = document.getElementById('adsmodal');
  if (modal) {
    modal.querySelector('.adsmodal-close').addEventListener('click', adsCloseModal);
    modal.querySelector('.adsmodal-backdrop').addEventListener('click', adsCloseModal);
    modal.querySelector('.adsmodal-prev').addEventListener('click', () => adsModalStep(-1));
    modal.querySelector('.adsmodal-next').addEventListener('click', () => adsModalStep(1));

    adsBuildThumbs();

    // ----- Interactions mobile. Inertes en desktop (pas de touch). -----
    const info = modal.querySelector('.adsmodal-info');
    const details = modal.querySelector('.adsmodal-details');
    const detailsInner = modal.querySelector('.adsmodal-details-inner');
    const creative = modal.querySelector('.adsmodal-creative');
    const thumbsWrap = modal.querySelector('.adsmodal-thumbs');

    // Bottom-sheet : la hauteur des détails suit le doigt (--sheet 0→1),
    // qui pilote aussi l'apparition ligne par ligne. Rubber-band à la limite
    // haute + réglage lissé (easeOut) au relâcher.
    if (info && details) {
      const readSheet = () => parseFloat(info.style.getPropertyValue('--sheet')) || 0;
      const contentH = () => (detailsInner && detailsInner.offsetHeight) || 1;
      // --sheet pilote le masque de fondu ; la hauteur (px) pilote la taille
      // (animée par transition CSS hors glissé → lissage + resize au switch).
      // `rb` = dépassement du rebond, pour que les contrôles suivent le panneau
      // même pendant le rubber-band (sinon ils décrocheraient aux limites).
      const applySheet = (p, h, rb) => {
        info.style.setProperty('--sheet', p);
        const revele = p * (h || contentH());
        details.style.height = revele + 'px';
        adsSetCtrlShift(modal, revele + (rb || 0));
      };

      let dragging = false, moved = false, startY = 0, startSheet = 0, H = 1, curRb = 0;

      const onStart = (e) => {
        if (e.target.closest('.adsmodal-thumbs, .adsmodal-close, a, button')) return;
        dragging = true; moved = false; curRb = 0;
        startY = e.touches[0].clientY;
        startSheet = readSheet();
        H = contentH();
        info.classList.add('is-dragging'); // suit le doigt : transitions coupées
        modal.style.setProperty('--ads-ctrl-dur', '0s'); // idem pour les contrôles du player
      };
      const onMove = (e) => {
        if (!dragging) return;
        const dy = e.touches[0].clientY - startY;
        if (!moved && Math.abs(dy) > 5) moved = true;
        if (!moved) return;
        e.preventDefault();
        let raw = startSheet - dy / H;
        curRb = 0;
        // Rubber-band aux DEUX limites (rebond identique à l'ouverture ET à la
        // fermeture) : dépassement borné à 28px, ressort au relâcher (transition).
        if (raw > 1) { curRb = Math.min((raw - 1) * H * 0.2, 28); raw = 1; }
        else if (raw < 0) { curRb = Math.max(raw * H * 0.2, -28); raw = 0; }
        applySheet(raw, H, curRb);
        info.style.transform = curRb ? `translateY(${-curRb}px)` : '';
      };
      const onEnd = (e) => {
        if (!dragging) return;
        dragging = false;
        info.classList.remove('is-dragging'); // réactive les transitions (lissage)
        modal.style.removeProperty('--ads-ctrl-dur'); // idem : les contrôles relissent
        info.style.transform = '';             // rubber-band : retour lissé (transition)
        if (!moved) {
          // Tap simple : ouvre/ferme (sauf tap dans le contenu détaillé)
          if (e.target.closest('.adsmodal-details-inner')) return;
          applySheet(startSheet > 0.5 ? 0 : 1, H);
          return;
        }
        const dy = e.changedTouches[0].clientY - startY;
        let to;
        if (Math.abs(dy) > 40) to = dy < 0 ? 1 : 0;
        else to = readSheet() > 0.5 ? 1 : 0;
        applySheet(to, H);
      };

      info.addEventListener('touchstart', onStart, { passive: true });
      info.addEventListener('touchmove', onMove, { passive: false });
      info.addEventListener('touchend', onEnd);
      _adsModalHandlers.push({ el: info, type: 'touchstart', fn: onStart });
      _adsModalHandlers.push({ el: info, type: 'touchmove', fn: onMove });
      _adsModalHandlers.push({ el: info, type: 'touchend', fn: onEnd });
    }

    // Carrousel : au relâcher du drag, la course se prolonge selon l'inertie du
    // geste puis se COLLE (snap) pile au centre sur la vignette la plus proche,
    // qui devient la créa active.
    if (thumbsWrap) {
      const nT = _adsCards.length;
      let scrollTimer = null;
      let thumbDragging = false;

      // Colle sur la vignette la plus proche de `projScroll` (position projetée
      // par l'inertie, pas la position au relâcher) et l'amène EXACTEMENT au
      // centre. Recentre d'abord la boucle : on reste dans la copie du milieu, le
      // saut est invisible (les 3 copies sont identiques) ; la projection est
      // décalée du même montant pour rester cohérente.
      const snapTo = (projScroll) => {
        const items = thumbsWrap.querySelectorAll('.adsthumb');
        if (!items.length) return;
        if (nT > 0 && items.length >= 3 * nT) {
          const setW = items[nT].offsetLeft - items[0].offsetLeft;
          if (setW > 0) {
            while (projScroll < setW * 0.5) { projScroll += setW; thumbsWrap.scrollLeft += setW; }
            while (projScroll > setW * 2.5) { projScroll -= setW; thumbsWrap.scrollLeft -= setW; }
          }
        }
        const mid = projScroll + thumbsWrap.clientWidth / 2;
        let best = null, bd = Infinity;
        items.forEach((t) => {
          const d = Math.abs(t.offsetLeft + t.offsetWidth / 2 - mid);
          if (d < bd) { bd = d; best = t; }
        });
        if (!best) return;
        const idx = parseInt(best.dataset.idx, 10);
        // La vignette grandit dès le départ du mouvement (retour immédiat, et le
        // scale ne déplace aucune position), mais la créa n'est construite qu'à
        // l'arrivée : monter un player HLS en pleine animation la faisait saccader.
        items.forEach((t) => t.classList.toggle('active', parseInt(t.dataset.idx, 10) === idx));
        if (scrollTimer) { clearTimeout(scrollTimer); scrollTimer = null; }
        adsAnimateThumbs(thumbsWrap, adsThumbScrollTarget(thumbsWrap, best), () => {
          if (scrollTimer) { clearTimeout(scrollTimer); scrollTimer = null; }
          if (idx !== _adsCurrentIndex) adsOpenModal(idx, 'skip');
        });
      };

      const onScroll = () => {
        // Pendant le drag ou l'animation de snap : aucun effet (ni recentrage ni
        // reconstruction de créa) → mouvement fluide. Ne sert donc que de filet
        // pour un scroll non piloté par le drag (molette en desktop).
        if (thumbDragging || _adsThumbAnim) return;
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => snapTo(thumbsWrap.scrollLeft), 120);
      };
      thumbsWrap.addEventListener('scroll', onScroll, { passive: true });
      _adsModalHandlers.push({ el: thumbsWrap, type: 'scroll', fn: onScroll });

      // Drag du carrousel en Pointer Events + setPointerCapture : capture le geste
      // quels que soient les ancêtres (contourne le quirk iOS où le listener
      // touchmove non-passif du bottom-sheet empêche le scroll tactile natif). On
      // pilote scrollLeft (touch-action:none), delta incrémental → suivi fluide du doigt.
      let pDown = false, pDrag = false, pId = null, pStartX = 0, pLastX = 0;
      let pVel = 0, pLastT = 0;              // vélocité lissée (px/ms) pour l'inertie
      const pdown = (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        // Reprendre la main en plein glissement : on coupe le snap en cours.
        if (_adsThumbRaf) { cancelAnimationFrame(_adsThumbRaf); _adsThumbRaf = null; _adsThumbAnim = false; }
        pDown = true; pDrag = false; pId = e.pointerId; pStartX = pLastX = e.clientX;
        pVel = 0; pLastT = performance.now();
      };
      const pmove = (e) => {
        if (!pDown || e.pointerId !== pId) return;
        if (!pDrag) {
          if (Math.abs(e.clientX - pStartX) < 6) return; // seuil : tap vs drag (préserve le clic de sélection)
          pDrag = true; thumbDragging = true;
          if (scrollTimer) { clearTimeout(scrollTimer); scrollTimer = null; } // annule un snap en attente
          try { thumbsWrap.setPointerCapture(pId); } catch (_) { }
        }
        const now = performance.now();
        const dx = e.clientX - pLastX;
        const dt = now - pLastT;
        // Moyenne mobile : assez lissée pour ignorer le bruit d'une frame, assez
        // réactive pour capter le coup de pouce final du doigt.
        if (dt > 0) { pVel = pVel * 0.7 + (dx / dt) * 0.3; pLastT = now; }
        thumbsWrap.scrollLeft -= dx;
        pLastX = e.clientX;
      };
      const pup = (e) => {
        if (e.pointerId !== pId) return;
        const wasDrag = pDrag;
        if (pDrag) { try { thumbsWrap.releasePointerCapture(pId); } catch (_) { } }
        pDown = false; pDrag = false; pId = null;
        if (!wasDrag) return;
        thumbDragging = false;
        // Doigt immobilisé avant le relâcher → pas d'inertie : l'utilisateur a
        // choisi de s'arrêter là, on colle simplement sur la plus proche.
        if (performance.now() - pLastT > 80) pVel = 0;
        // ADS_THUMB_FLICK (90 ms) = fenêtre de projection de l'inertie.
        // Plus haut = un flick emmène plus loin.
        snapTo(thumbsWrap.scrollLeft - pVel * 90);
      };
      thumbsWrap.addEventListener('pointerdown', pdown);
      thumbsWrap.addEventListener('pointermove', pmove);
      thumbsWrap.addEventListener('pointerup', pup);
      thumbsWrap.addEventListener('pointercancel', pup);
      _adsModalHandlers.push({ el: thumbsWrap, type: 'pointerdown', fn: pdown });
      _adsModalHandlers.push({ el: thumbsWrap, type: 'pointermove', fn: pmove });
      _adsModalHandlers.push({ el: thumbsWrap, type: 'pointerup', fn: pup });
      _adsModalHandlers.push({ el: thumbsWrap, type: 'pointercancel', fn: pup });
    }

    // Swipe horizontal sur la créa : change de créa (recentre le carrousel)
    if (creative) {
      let cx = 0, cy = 0;
      const cts = (e) => { cx = e.touches[0].clientX; cy = e.touches[0].clientY; };
      const cte = (e) => {
        const dx = e.changedTouches[0].clientX - cx;
        const dy = e.changedTouches[0].clientY - cy;
        if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
        adsModalStep(dx < 0 ? 1 : -1);
      };
      creative.addEventListener('touchstart', cts, { passive: true });
      creative.addEventListener('touchend', cte);
      _adsModalHandlers.push({ el: creative, type: 'touchstart', fn: cts });
      _adsModalHandlers.push({ el: creative, type: 'touchend', fn: cte });
    }
  }

  if (!_adsDocBound) {
    document.addEventListener('click', adsDocClick);
    document.addEventListener('keydown', adsDocKey);
    _adsDocBound = true;
  }

  // viewport-fit=cover est posé en dur dans ads.html. Position du ✕ (--ads-close-top)
  // et hauteur du panneau replié (--ads-sheet-h) recalculées au resize/rotation.
  adsSetSafeMin();
  _adsResizeHandler = () => { adsSetSafeMin(); adsSyncSheetHeight(); };
  window.addEventListener('resize', _adsResizeHandler);
  window.addEventListener('orientationchange', _adsResizeHandler);

  // Optimisations de rendu du panneau bas mobile, portées par une seule classe →
  // ADS_PANEL_PERF = false suffit à toutes les désactiver (voir le CSS .ads-perf).
  const modalEl = document.getElementById('adsmodal');
  if (modalEl) modalEl.classList.toggle('ads-perf', ADS_PANEL_PERF);
}

function cleanupAds() {
  if (_adsPreviewObserver) { _adsPreviewObserver.disconnect(); _adsPreviewObserver = null; }
  // On quitte la page ads (Barba ne recharge pas le <head>) : on retire
  // viewport-fit=cover pour ne pas l'imposer aux autres pages.
  const vp = document.querySelector('meta[name="viewport"]');
  if (vp) vp.setAttribute('content', (vp.getAttribute('content') || '').replace(/,?\s*viewport-fit\s*=\s*cover/i, ''));
  if (_adsResizeHandler) {
    window.removeEventListener('resize', _adsResizeHandler);
    window.removeEventListener('orientationchange', _adsResizeHandler);
    _adsResizeHandler = null;
  }
  document.documentElement.style.removeProperty('--ads-close-top');
  _adsMoveHandlers.forEach(({ el, fn }) => el.removeEventListener('mousemove', fn));
  _adsVideoHandlers.forEach(({ el, enter, leave }) => {
    el.removeEventListener('mouseenter', enter);
    el.removeEventListener('mouseleave', leave);
  });
  _adsModalHandlers.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
  _adsMoveHandlers = [];
  _adsVideoHandlers = [];
  _adsModalHandlers = [];
  if (_adsDocBound) {
    document.removeEventListener('click', adsDocClick);
    document.removeEventListener('keydown', adsDocKey);
    _adsDocBound = false;
  }
  adsCloseModal();
  _adsCards = [];
}


const lerp = (f0, f1, t) => (1 - t) * f0 + t * f1;
const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

class DragScroll {

  constructor(obj) {
    this.el = document.querySelector(obj.el);
    this.wrap = document.querySelector(obj.wrap);
    this.items = document.querySelectorAll(obj.item);
    this.bar = document.querySelector(obj.bar);
    this.init();
  }

  init() {
    this.progress = 0;
    this.speed = 0;
    this.oldX = 0;
    this.x = 0;
    this.playrate = 0;

    this.bindings();
    this.events();
    this.calculate(); // Calcul initial
    this.resetProgress(); // Ajouté pour gérer les transitions Barba.js
  }

  resetProgress() {
    if (!this.el || !this.wrap || !this.bar) return; // Vérifications de sécurité

    this.calculate(); // Recalculer la largeur du slider
    this.progress = this.maxScroll * 0.0018; // Ajustez ici le pourcentage initial (0.18 % de maxScroll)
    this.x = this.progress;

    // Réinitialiser la position et la taille de la progress bar
    const initialScale = this.progress / this.maxScroll;
    this.bar.style.transform = `scaleX(${initialScale})`;
  }




  updateProgressBar() {
    // Force la position initiale de la barre selon la progression
    const initialPlayrate = this.progress / this.maxScroll;
    this.bar.style.transform = `scaleX(${0.18 + initialPlayrate * 0.82})`;
  }

  bindings() {
    [
      "events",
      "calculate",
      "raf",
      "handleWheel",
      "move",
      "handleTouchStart",
      "handleTouchMove",
      "handleTouchEnd",
    ].forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  calculate() {
    this.progress = 0;

    // Calcul de la largeur totale
    this.wrapWidth = Array.from(this.items).reduce((totalWidth, item) => {
      return totalWidth + item.clientWidth;
    }, 0);
    this.wrap.style.width = `${this.wrapWidth}px`;

    this.maxScroll = this.wrapWidth - this.el.clientWidth;

    // Ajout pour recalculer la position de la progress bar
    const progressParent = this.bar.parentElement;
    const parentWidth = progressParent.clientWidth;

    this.bar.style.transform = `scaleX(${this.progress / this.maxScroll})`; // Reset bar
    this.bar.style.left = `${(parentWidth - this.bar.clientWidth) / 2}px`; // Centrer
  }


  // Recalcule les largeurs (ex. après chargement d'images) SANS réinitialiser la position
  recalc() {
    if (!this.el || !this.wrap) return;
    const savedProgress = this.progress;
    const savedX = this.x;
    this.wrapWidth = Array.from(this.items).reduce((t, item) => t + item.clientWidth, 0);
    this.wrap.style.width = `${this.wrapWidth}px`;
    this.maxScroll = this.wrapWidth - this.el.clientWidth;
    // Restaure la position courante, bornée au nouveau maxScroll
    this.progress = clamp(savedProgress, 0, this.maxScroll);
    this.x = clamp(savedX, 0, this.maxScroll);
  }

  handleWheel(e) {
    this.progress += e.deltaY;
    this.move();
  }

  handleTouchStart(e) {
    e.preventDefault();
    this.dragging = true;
    this.startX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
  }

  handleTouchMove(e) {
    if (!this.dragging) return false;
    const x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
    if (x !== undefined) {
      this.progress += (this.startX - x) * 2.5;
      this.startX = x;
      this.move();
    }
  }

  handleTouchEnd() {
    this.dragging = false;
  }

  move() {
    this.progress = clamp(this.progress, 0, this.maxScroll);
  }

  events() {
    window.addEventListener("resize", this.calculate);
    window.addEventListener("wheel", this.handleWheel);

    this.el.addEventListener("touchstart", this.handleTouchStart);
    window.addEventListener("touchmove", this.handleTouchMove);
    window.addEventListener("touchend", this.handleTouchEnd);

    window.addEventListener("mousedown", this.handleTouchStart);
    window.addEventListener("mousemove", this.handleTouchMove);
    window.addEventListener("mouseup", this.handleTouchEnd);
    document.body.addEventListener("mouseleave", this.handleTouchEnd);
  }

  removeEvents() {
    window.removeEventListener("resize", this.calculate);

    // Remove wheel scroll listener
    window.removeEventListener("wheel", this.handleWheel);

    // Remove touch events
    this.el.removeEventListener("touchstart", this.handleTouchStart);
    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleTouchEnd);

    // Remove mouse events
    window.removeEventListener("mousedown", this.handleTouchStart);
    window.removeEventListener("mousemove", this.handleTouchMove);
    window.removeEventListener("mouseup", this.handleTouchEnd);

    // Remove mouse leave event for body
    document.body.removeEventListener("mouseleave", this.handleTouchEnd);

    // Remove forced load listener
    window.removeEventListener("load", this.calculate); // Assuming added previously

    // Cancel any running animation frames
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Clear any custom timers or timeouts (if used)
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }

    console.log("All listeners and timers removed");
  }


  raf() {
    this.x = lerp(this.x, this.progress, 0.1);
    this.playrate = this.x / this.maxScroll;

    this.wrap.style.transform = `translatex(${-this.x}px)`;

    // Inclure l'offset initial de 0.18
    this.bar.style.transform = `scaleX(${0.18 + this.playrate * (1 - 0.18)})`;

    this.speed = Math.min(100, this.oldX - this.x);
    this.oldX = this.x;

    this.scale = lerp(this.scale, this.speed, 0.1);

    this.items.forEach((item) => {
      item.style.transform = `scale(${1 - Math.abs(this.speed) * 0.005})`;

      const img = item.querySelector("img");
      if (img) {
        img.style.transform = `scaleX(${1 + Math.abs(this.speed) * 0.004})`;
      }

      const video = item.querySelector("video");
      if (video) {
        video.style.transform = `scaleX(${1 + Math.abs(this.speed) * 0.004})`;
      }
    });
  }
}

window.addEventListener("load", () => {
  if (scroll) {
    scroll.calculate();
    scroll.resetProgress();
  }
});


let scroll = null;

const initScroll = () => {
  scroll = new DragScroll({
    el: ".sandboxslider",
    wrap: ".sandboxslider-wrapper",
    item: ".sandboxslider-item",
    bar: ".sandboxslider-progress-bar",
  });

  scroll.resetProgress(); // Appel explicite pour définir l'état initial

  const animateScroll = () => {
    if (scroll) {
      requestAnimationFrame(animateScroll);
      scroll.raf();
    }
  };

  animateScroll();
};



const cleanupScroll = () => {
  if (scroll) {
    scroll.removeEvents();
    scroll = null;
    console.log("Listeners and scroll instance removed");
  }
};







var {
  OverlayScrollbars,
  ScrollbarsHidingPlugin,
  SizeObserverPlugin,
  ClickScrollPlugin
} = OverlayScrollbarsGlobal;

const osInstance = OverlayScrollbars(document.querySelector('body'), {
  paddingAbsolute: false,
  showNativeOverlaidScrollbars: false,
  cancel: {
    nativeScrollbarsOverlaid: true,
  },
  overflow: {
    x: 'hidden',
  },
  scrollbars: {
    theme: 'scrollbar',
    autoHide: 'never',
    autoHideSuspend: true,
  },
});









// [Migration Vidstack → Video.js v10] Les loaders Vidstack (reloadVidstackResources / loadPlayerScripts)
// ont été retirés : le player v10 est auto-hébergé et chargé une fois via <script type="module"> dans le <head>.
// Le comportement du player v10 est géré par le module window.V10 (init/cleanup par namespace Barba, plus bas).









let observer;

function observeSections() {
  const sections = document.querySelectorAll(".sidebar-chapters-wrapper a[data-target]");
  const sidebarLinks = document.querySelectorAll(".chapter");

  console.log("Sections trouvées :", sections.length);

  // Déconnexion de l'ancien observer si existant
  if (observer) {
    observer.disconnect();
    console.log("Ancien observer déconnecté.");
  }

  // Initialisation de l'observateur
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      let margin = entry.target.id === "main" ? "-10% 0px -90% 0px" : "0px 0px -80% 0px";
      observer.rootMargin = margin;  // Ajuste dynamiquement

      console.log("Observée :", entry.target.id, "rootMargin:", margin, "Visible:", entry.isIntersecting);
      
      if (entry.isIntersecting) {
        // Suppression de l'active de tous les liens
        sidebarLinks.forEach(link => link.classList.remove("active"));

        // Ajout de l'active au lien correspondant
        const matchingLink = document.querySelector(`.sidebar-chapters-wrapper a[data-target="#${entry.target.id}"]`);
        if (matchingLink) {
          matchingLink.classList.add("active");
          console.log("Ajout de active à :", matchingLink.textContent.trim());
        }
      }
    });
  }, { rootMargin: "0px 0px -80% 0px", threshold: 0.2 });

  // Observer uniquement les sections pertinentes liées aux div spécifiques
  sections.forEach(link => {
    const sectionId = link.getAttribute("data-target").substring(1);
    const section = document.getElementById(sectionId);
    if (section) {
      observer.observe(section);
      console.log("Observation de la section :", sectionId);
    } else {
      console.log("⚠️ Aucune section trouvée pour l'ID :", sectionId);
    }
  });
}

// Fonction améliorée pour détecter la section la plus proche du centre
function updateActiveChapter() {
  console.log("Mise à jour des chapitres actifs...");

  const sections = document.querySelectorAll(".sidebar-chapters-wrapper a[data-target]");
  let minDistance = Infinity;
  let activeSection = null;
  let screenCenter = window.innerHeight / 2;

  sections.forEach(section => {
    const sectionId = section.getAttribute("data-target").substring(1);
    const targetSection = document.getElementById(sectionId);

    if (targetSection) {
      const rect = targetSection.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(sectionCenter - screenCenter);

      // Vérifier que la section est bien dans la fenêtre visible
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        console.log(`Section: ${sectionId}, Centre: ${sectionCenter}, Distance from center: ${distanceFromCenter}`);

        // Sélectionner la section la plus proche du centre de l'écran
        if (distanceFromCenter < minDistance) {
          minDistance = distanceFromCenter;
          activeSection = targetSection;
        }
      }
    }
  });

  if (activeSection) {
    console.log(`Section active détectée : ${activeSection.id}`);
    // Désactive tous les chapitres avant d'activer celui en cours
    document.querySelectorAll('.chapter').forEach(chap => chap.classList.remove('active'));

    // Active le lien correspondant
    let activeLink = document.querySelector(`.sidebar-chapters-wrapper a[data-target="#${activeSection.id}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
      console.log(`Activation du chapitre : ${activeLink.textContent.trim()}`);
    }
  }
}

// Appel initial au chargement de la page


// Déclenche la détection au scroll
window.addEventListener("scroll", updateActiveChapter);

// Nettoyage au changement de page
function clearObserver() {
  if (observer) {
    observer.disconnect();
    console.log("Observer nettoyé.");
  }
}


/* ----------------------------------------------------------------------------
   Curseur du showreel : affiche "Pause" quand la vidéo joue, "Play" sinon.
   Appelé au survol de #reel (textOnHover('reel')) ; ré-interroge le lecteur à
   chaque survol (il est recréé par Barba) et écoute play/pause pour un suivi live.
---------------------------------------------------------------------------- */
function setupReelCursorText() {
  const reel = document.querySelector('#reel');
  const hover = document.getElementById('hoverinteraction');
  if (!hover) return;
  const player = document.querySelector('#reel media-player');

  const isPaused = () => {
    if (player && typeof player.paused === 'boolean') return player.paused;
    if (player && player.state && typeof player.state.paused === 'boolean') return player.state.paused;
    return true; // par défaut : en pause -> "Play"
  };
  const apply = () => { hover.textContent = isPaused() ? 'Play' : 'Pause'; };

  apply();

  // Mise à jour live tant que le curseur survole le lecteur (une seule liaison par lecteur)
  if (player && !player._reelCursorBound) {
    const update = () => { if (reel && reel.matches(':hover')) apply(); };
    player.addEventListener('play', update);
    player.addEventListener('playing', update);
    player.addEventListener('pause', update);
    player._reelCursorBound = true;
  }
}


/* ----------------------------------------------------------------------------
   Hauteur de page & scroll : les images en lazy-load modifient la hauteur après
   coup, ce qui fausse les bornes de Lenis / ScrollTrigger / DragScroll (sandbox).
   On recalcule donc ces systèmes dès qu'une image ou vidéo finit de charger.
---------------------------------------------------------------------------- */
function refreshScrollSystems() {
  try { if (window.lenis && window.lenis.resize) window.lenis.resize(); } catch (e) { }
  try { if (window.ScrollTrigger && window.ScrollTrigger.refresh) window.ScrollTrigger.refresh(); } catch (e) { }
  // DragScroll (slider horizontal sandbox) : recalcule les largeurs sans réinitialiser la position
  try {
    if (typeof scroll !== 'undefined' && scroll && typeof scroll.recalc === 'function') {
      scroll.recalc();
    }
  } catch (e) { }
}

let _mediaRefreshTimer = null;
function _scheduleScrollRefresh() {
  clearTimeout(_mediaRefreshTimer);
  _mediaRefreshTimer = setTimeout(refreshScrollSystems, 150);
}

// Écouteur délégué unique (le 'load' des <img>/<video> ne bulle pas -> phase de capture)
document.addEventListener('load', (e) => {
  const t = e.target;
  if (t && (t.tagName === 'IMG' || t.tagName === 'VIDEO')) _scheduleScrollRefresh();
}, true);

// Filet de sécurité : recalcul une fois toutes les ressources chargées
window.addEventListener('load', _scheduleScrollRefresh);


/* ----------------------------------------------------------------------------
   Cloudflare "Email Address Obfuscation" : Cloudflare remplace les emails par
   <a class="__cf_email__" data-cfemail="..."> et les décode via son propre script
   au chargement. En SPA (Barba), le contenu injecté lors d'une transition n'est
   jamais re-décodé -> on relance le décodage nous-mêmes (même algo que Cloudflare).
---------------------------------------------------------------------------- */
function cfDecodeEmail(encoded) {
  let email = '';
  const key = parseInt(encoded.substr(0, 2), 16);
  for (let n = 2; n < encoded.length; n += 2) {
    email += String.fromCharCode(parseInt(encoded.substr(n, 2), 16) ^ key);
  }
  return email;
}

function decodeCfEmails(root) {
  const scope = root || document;
  scope.querySelectorAll('.__cf_email__[data-cfemail]').forEach((el) => {
    try {
      const email = cfDecodeEmail(el.getAttribute('data-cfemail'));
      el.textContent = email;
      if (el.tagName === 'A') el.setAttribute('href', 'mailto:' + email);
      el.removeAttribute('data-cfemail');
      el.classList.remove('__cf_email__');
    } catch (e) { }
  });
  // Liens protégés type href="/cdn-cgi/l/email-protection#<hash>"
  scope.querySelectorAll('a[href*="/cdn-cgi/l/email-protection#"]').forEach((el) => {
    try {
      const hash = el.getAttribute('href').split('#')[1];
      if (!hash) return;
      const email = cfDecodeEmail(hash);
      el.setAttribute('href', 'mailto:' + email);
      if (el.textContent.includes('[email')) el.textContent = email;
    } catch (e) { }
  });
}

// Décodage au chargement initial (filet de sécurité ; les transitions Barba sont gérées dans barba-transition.js)
document.addEventListener('DOMContentLoaded', () => decodeCfEmails());


/* ----------------------------------------------------------------------------
   Indicateur de chargement sur les players Vidstack : au clic (event 'play'),
   la vidéo (surtout Vimeo) peut mettre plusieurs secondes à démarrer. On affiche
   un spinner (.is-loading) dès la demande de lecture, masqué quand ça joue vraiment.
   Un délai de 180ms évite tout flash sur les vidéos qui démarrent instantanément.
---------------------------------------------------------------------------- */
function setupPlayerLoading(player) {
  if (!player || player._loadingBound) return;
  player._loadingBound = true;

  // Overlay spinner injecté comme dernier enfant -> peint au-dessus du media-poster
  if (!player.querySelector(':scope > .player-spinner')) {
    const overlay = document.createElement('div');
    overlay.className = 'player-spinner';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = '<span class="player-spinner__ring"></span>';
    player.appendChild(overlay);
  }

  const show = () => {
    clearTimeout(player._loadTimer);
    player._loadTimer = setTimeout(() => player.classList.add('is-loading'), 180);
  };
  const hide = () => {
    clearTimeout(player._loadTimer);
    player.classList.remove('is-loading');
  };

  player.addEventListener('play', show);     // lecture demandée (immédiat au clic)
  player.addEventListener('waiting', show);  // re-buffering en cours de lecture
  player.addEventListener('playing', hide);  // les images défilent réellement
  player.addEventListener('can-play', hide);
  player.addEventListener('pause', hide);
  player.addEventListener('ended', hide);
  player.addEventListener('error', hide);

  // Curseur "Play"/"Pause" au survol de n'importe quel player (pas seulement le showreel)
  const cursorUpdate = () => { if (player.matches(':hover')) updateCursorPlayPause(player); };
  player.addEventListener('mouseenter', () => updateCursorPlayPause(player));
  player.addEventListener('play', cursorUpdate);
  player.addEventListener('playing', cursorUpdate);
  player.addEventListener('pause', cursorUpdate);

  // Clic n'importe où dans le player -> play/pause. (Les gestes natifs vidstack sont désactivés
  // en CSS car ils ne déclenchent pas le chargement avec load="play" et diffèrent souris/tactile.)
  // On laisse passer les vrais contrôles (boutons, sliders, menus) pour ne pas double-déclencher.
  player.addEventListener('click', (e) => {
    // Laisse passer les vrais contrôles vidstack (boutons custom .vds-button, sliders, menus)
    if (e.target.closest('.vds-button, .vds-slider, .vds-controls-group, .vds-menu, media-menu, [role="slider"], [role="menuitem"], button, a, input, select')) return;
    try {
      if (player.paused) player.play(); else player.pause();
    } catch (err) { }
  });

  // Curseur : sur les CONTRÔLES (icônes play/volume/fullscreen + slider de volume) -> état "bouton"
  // (curseur qui inverse, sans texte) ; sur le reste du player -> "Play"/"Pause".
  // mouseover bubble -> on détecte dynamiquement la cible (uniquement les icônes, pas le conteneur).
  player.addEventListener('mouseover', (e) => {
    const cursorEl = document.querySelector('#mouse');
    if (!cursorEl || typeof TweenMax === 'undefined') return;
    const cursorTxt = document.querySelector('#hoverinteraction');
    if (e.target.closest('.vds-button, .vds-slider')) {
      TweenMax.to(cursorEl, 0.3, { scale: 1 });
      TweenMax.to(cursorEl, 0, { backdropFilter: 'invert(1) grayscale(1)', backgroundColor: 'var(--contenthover)' });
      if (cursorTxt) TweenMax.to(cursorTxt, 0.2, { scale: 0 });
    } else {
      TweenMax.to(cursorEl, 0, { backdropFilter: 'none', backgroundColor: 'var(--content)' });
      if (cursorTxt) TweenMax.to(cursorTxt, 0.2, { scale: 1 });
    }
  });
}

// Met le texte du curseur (#hoverinteraction) à "Pause" si la vidéo joue, "Play" sinon
function updateCursorPlayPause(player) {
  const hover = document.getElementById('hoverinteraction');
  if (!hover || !player) return;
  let paused = true;
  if (typeof player.paused === 'boolean') paused = player.paused;
  else if (player.state && typeof player.state.paused === 'boolean') paused = player.state.paused;
  hover.textContent = paused ? 'Play' : 'Pause';
}

function setupAllPlayersLoading(root) {
  const scope = root || document;
  scope.querySelectorAll('media-player').forEach(setupPlayerLoading);
}

document.addEventListener('DOMContentLoaded', () => setupAllPlayersLoading());


/* ----------------------------------------------------------------------------
   Player Video.js v10 : module window.V10 (montage/démontage par namespace Barba).
   V10.init(root) : monte les .v10-player de `root` + comportements custom
                    (miniature animée, volume 50%, loop, PiP/AirPlay off, hitbox 44px,
                     bouton play central tactile, maintien menu ~4s).
   V10.cleanup()  : démonte tout (listeners/timers/intervals tracés) sans fuite.
   Curseur : ADDITIF au système du site (growOnHover gère position + grossissement hors player).
             Ici on ne touche au dot QUE sur un .v10-player : label Play/Pause sur la zone vidéo,
             et masquage (scale 0) sur les contrôles (shadow-DOM). Hors player -> on ne fait rien.
---------------------------------------------------------------------------- */
(function () {
  var TOUCH = window.matchMedia('(hover: none)').matches;
  // "contrôles" = boutons/sliders/conteneurs de barre|menu (PAS media-container/gesture/poster qui couvrent la vidéo)
  var CTRL = /(-button|slider|^media-(controls|control-bar|menu|tooltip|popover|time|volume|seek-indicator|status-indicator|playback-rate|quality|audio-track))/i;
  // :not(#zz) booste la spécificité pour battre le outline:focus-visible de v10
  var SHADOW_CSS = 'media-pip-button,media-airplay-button{display:none!important}' +
    '*{-webkit-tap-highlight-color:transparent!important}' +
    ':focus:not(#zz),:focus-visible:not(#zz){outline:0!important;outline-color:transparent!important}' +
    'media-container{cursor:pointer!important}' +  // garde le curseur natif macOS visible (v10 met cursor:none en lecture)
    // fond de la barre boutons/menus = pastille sombre (icônes blanches lisibles sur fond clair ET sombre). L'arrondi du player est géré en light-DOM via --media-border-radius.
    '.media-default-skin--video{--media-surface-background-color:oklch(0% 0 0 / .25)!important}' +
    // Le <video> DANS le shadow de hlsjs-video est décalé vers le bas sur Safari (résolution height:100% vs aspect-ratio).
    // On le cale en absolu (inset:0) pour qu'il remplisse son conteneur quelle que soit la taille, comme le media-poster (qui marche sur Safari).
    'video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:contain!important}' +
    // (PAS de transform sur la vidéo : un translateZ décale la <video> vers le bas sur Safari. Le noir Safari est réglé
    //  en amont par le clearProps du transform d'intro sur #video ; cf. introanimation()/pageentrance() dans script.js.)
    // ±10s masqués (ta demande). AUCUN hack flex/nowrap/container-query : layout responsive NATIF de v10 (2 rangées
    // timeline + boutons, comme la page de test) -> ne saute pas au resize, se réagence proprement.
    'media-seek-button{display:none!important}' +
    // Preview storyboard : elle déborde en haut du player sur petit player. On la réduit VISUELLEMENT via la propriété
    // `scale` (n'change PAS la taille de layout -> v10 ne recalcule pas le sprite <img>, qui deviendrait noir sur Safari).
    // v10 centre via `translate:-50%` (propriété distincte) -> le centrage horizontal est préservé. Origine en bas =
    // reste ancrée au-dessus de la progression. Paliers progressifs (mobile/tablette réels ~22-26rem) ; desktop = naturel.
    '@container media-root (width < 26rem){.media-thumbnail{transform-origin:center bottom!important;scale:.85!important}}' +
    '@container media-root (width < 22rem){.media-thumbnail{scale:.7!important}}' +
    '@container media-root (width < 19rem){.media-thumbnail{scale:.56!important}}' +
    '@media (hover:none){media-play-button,media-mute-button,media-fullscreen-button,media-playback-rate-button,media-captions-button,media-cast-button{min-width:44px;min-height:44px}}';
  // rule pour masquer le contrôle du son sur les players sans audio (classe .v10-no-audio)
  var NO_AUDIO_CSS = 'media-mute-button,media-volume-slider{display:none!important}';
  // dans la modale ads (mobile) : la créa 9:16 doit REMPLIR la zone visible (rognée
  // haut+bas), pas être letterboxée → cover au lieu du contain global du shadow.
  var ADS_COVER_CSS = 'video{object-fit:cover!important;object-position:center!important}';
  // Modale ads en MOBILE uniquement : les contrôles se posent 10px au-dessus du
  // panneau de détails et le suivent quand il s'ouvre/se ferme.
  //   media-controls est en position:absolute;bottom:8px dans le shadow de v10.
  //   Le bas de la boîte du player est à --ads-sheet-h/2 SOUS le haut du panneau
  //   replié (cf. le centrage de .adsmodal-creative), d'où le `bottom` de base.
  //   La part variable passe par un translateY : propriété compositée, donc pas de
  //   relayout par frame, contrairement à une animation de `bottom`.
  //   --ads-ctrl-shift (px révélés du panneau + rebond) et --ads-ctrl-dur (0s
  //   pendant le glissé pour coller au doigt) sont posés sur #adsmodal par le
  //   bloc ADS : les propriétés personnalisées franchissent le shadow DOM.
  // Menus ouvrants (réglages/qualité, popover du volume) : v10 les positionne en
  // CSS anchor positioning (`bottom: calc(anchor(top))`, ancré au bouton). Deux
  // raisons pour ne pas s'y fier ici : ce sont des `popover` → au top layer, donc
  // INSENSIBLES au transform de media-controls ; et anchor() n'est pas fiable sur
  // Safari, où la déclaration est alors ignorée et le menu retombe sur le bas du
  // viewport. On repose donc leur `bottom` sur le viewport (ils sont en
  // position:fixed), sans anchor() : `!important` en feuille de style bat le style
  // inline sans !important que pose v10.
  //   Repère : bas de la boîte du player = 100dvh - --ads-sheet-h/2, contrôles à
  //   --ads-sheet-h/2 + 10px au-dessus, et le bouton Réglages culmine 46px au-dessus
  //   du bas des contrôles (36px de bouton + 10px de padding interne v10) ; +8px =
  //   l'écart que v10 met lui-même entre le bouton et son menu. D'où 10 + 54.
  var ADS_MENU_BOTTOM = 'calc(var(--ads-sheet-h, 115px) + 10px + 54px + var(--ads-ctrl-shift, 0px))';
  var ADS_CTRL_CSS = '@media (max-width:740px){media-controls{' +
    'bottom:calc(var(--ads-sheet-h, 115px) / 2 + 10px)!important;' +
    'transform:translateY(calc(-1 * var(--ads-ctrl-shift, 0px)))!important;' +
    'transition:transform var(--ads-ctrl-dur, .38s) cubic-bezier(.67,.01,.27,1)!important}' +
    'media-menu[popover],media-popover[popover]{' +
    'top:auto!important;bottom:' + ADS_MENU_BOTTOM + '!important;' +
    'transition:bottom var(--ads-ctrl-dur, .38s) cubic-bezier(.67,.01,.27,1)!important}}';
  function playerExtraCSS(o) {
    var ex = o.noAudio ? NO_AUDIO_CSS : '';
    if (o.p && o.p.closest && o.p.closest('#adsmodal')) ex += ADS_COVER_CSS + ADS_CTRL_CSS;
    return ex;
  }
  function inject(root, extra) { if (!root || root.__p) return; try { var s = document.createElement('style'); s.textContent = SHADOW_CSS + (extra || ''); root.appendChild(s); root.__p = 1; } catch (e) { } }
  function walkShadows(node, extra) { if (!node || !node.querySelectorAll) return; node.querySelectorAll('*').forEach(function (el) { if (el.shadowRoot) { inject(el.shadowRoot, extra); walkShadows(el.shadowRoot, extra); } }); }
  function findInShadows(root, sel) { if (!root) return null; var f = root.querySelector(sel); if (f) return f; var els = root.querySelectorAll('*'); for (var i = 0; i < els.length; i++) { if (els[i].shadowRoot) { var r = findInShadows(els[i].shadowRoot, sel); if (r) return r; } } return null; }
  function GS() { return window.gsap || window.TweenMax; }  // le site expose gsap (et TweenMax en compat)

  var S = null;  // état monté (null = démonté)

  function init(root) {
    root = root || document;
    if (S) cleanup();  // idempotent : jamais deux montages superposés
    var found = root.querySelectorAll ? root.querySelectorAll('.v10-player') : [];
    if (!found.length) return;  // page sans player v10 -> aucun listener global posé
    var mouse = document.getElementById('mouse');
    var label = document.getElementById('hoverinteraction');
    S = { players: [], hovered: null, listeners: [], timeouts: [], intervals: [], cursorState: '', mouse: mouse, label: label };
    function addL(t, ev, fn, opts) { t.addEventListener(ev, fn, opts); S.listeners.push([t, ev, fn, opts]); }
    function addT(fn, ms) { var id = setTimeout(fn, ms); S.timeouts.push(id); return id; }
    function addI(fn, ms) { var id = setInterval(fn, ms); S.intervals.push(id); return id; }
    // Un seul player à la fois : au démarrage d'une vidéo, met en pause TOUTES les autres (jamais d'audios/vidéos superposés sur les pages multi-players).
    function pauseOthers(except) { if (!S) return; S.players.forEach(function (o) { if (o === except) return; try { var v = o.video && o.video(); if (v && !v.paused) v.pause(); } catch (e) { } }); }

    found.forEach(function (p) {
      var media = p.querySelector('hlsjs-video, vimeo-video');
      var plain = media ? null : p.querySelector('video-skin > video, video-player > video');  // provider <video> natif (sound-design), PAS le poster (media-poster > video)
      var o = { p: p, media: media, playing: false, controls: null, controlsHidden: false, lastActivity: 0, noAudio: p.classList.contains('v10-no-audio') };
      S.players.push(o);
      function video() { return plain || (media && media.shadowRoot && media.shadowRoot.querySelector('video')); }
      o.video = video;
      function play() { try { var v = video(); v && v.play(); } catch (e) { } }
      o.play = play;
      // bouton play central (affiché en tactile avant la 1re lecture)
      var badge = document.createElement('button');
      badge.className = 'play-badge'; badge.setAttribute('aria-label', 'Lire');
      badge.innerHTML = '<svg viewBox="0 0 18 18" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="m14.051 10.723-7.985 4.964a1.98 1.98 0 0 1-2.758-.638A2.06 2.06 0 0 1 3 13.964V4.036C3 2.91 3.895 2 5 2c.377 0 .747.109 1.066.313l7.985 4.964a2.057 2.057 0 0 1 .627 2.808c-.16.257-.373.475-.627.637"/></svg>';
      addL(badge, 'click', function (e) { e.stopPropagation(); play(); });
      p.appendChild(badge);
      o.setPlaying = function (v) { o.playing = v; p.classList.toggle('is-playing', v); if (v) { p.classList.add('started'); if (o.controls && o.controlsHidden) { o.controls.style.display = ''; o.controlsHidden = false; } } if (S && S.hovered === o && label) label.textContent = v ? 'Pause' : 'Play'; };
      function bindState() {
        var v = video(); if (!v) return false;
        try { v.loop = true; } catch (e) { }
        try { v.volume = 0.5; } catch (e) { }
        addL(v, 'loadedmetadata', function () { try { v.volume = 0.5; } catch (e) { } });
        addL(v, 'playing', function () { o.setPlaying(true); pauseOthers(o); });
        addL(v, 'play', function () { o.setPlaying(true); pauseOthers(o); });
        addL(v, 'pause', function () { o.setPlaying(false); });
        return true;
      }
      if (!bindState()) { var iv = addI(function () { if (bindState()) clearInterval(iv); }, 300); addT(function () { clearInterval(iv); }, 8000); }
    });

    function injectPlayers() { S.players.forEach(function (o) { walkShadows(o.p, playerExtraCSS(o)); }); }
    function hideBeforeFirstPlay() { S.players.forEach(function (o) { if (!o.controls) { var skin = o.p.querySelector('video-skin'); o.controls = findInShadows(skin && skin.shadowRoot, 'media-controls'); } if (TOUCH && o.controls && !o.p.classList.contains('started') && !o.controlsHidden) { o.controls.style.display = 'none'; o.controlsHidden = true; } }); }
    [0, 300, 800, 1500, 3000].forEach(function (d) { addT(function () { if (!S) return; injectPlayers(); hideBeforeFirstPlay(); }, d); });
    addL(document, 'pointerdown', function (e) { if (!S) return; for (var i = 0; i < S.players.length; i++) { if (S.players[i].p.contains(e.target)) { var pl = S.players[i].p, ex = playerExtraCSS(S.players[i]); walkShadows(pl, ex); addT(function () { walkShadows(pl, ex); }, 60); break; } } }, true);

    // maintien menu : garde les contrôles ouverts ~4s après la dernière activité tant qu'un menu est ouvert
    function menuOpen(o) { var skin = o.p.querySelector('video-skin'); if (!skin || !skin.shadowRoot) return false; var found = false; (function scan(rt) { if (!rt || found) return; (rt.querySelectorAll('media-popover, media-menu-view, [role="menu"]') || []).forEach(function (e) { if (e.offsetHeight > 0 || e.offsetWidth > 0) found = true; }); rt.querySelectorAll('*').forEach(function (e) { if (e.shadowRoot) scan(e.shadowRoot); }); })(skin.shadowRoot); return found; }
    ['pointerdown', 'pointermove', 'keydown', 'touchstart'].forEach(function (ev) {
      addL(document, ev, function (e) { if (!e.isTrusted || !S) return; for (var i = 0; i < S.players.length; i++) { if (S.players[i].p.contains(e.target)) { S.players[i].lastActivity = Date.now(); break; } } }, true);
    });
    addI(function () { if (!S) return; S.players.forEach(function (o) { if (!o.playing || !menuOpen(o)) return; if (Date.now() - o.lastActivity >= 4000) return; var skin = o.p.querySelector('video-skin'); var mc = findInShadows(skin && skin.shadowRoot, 'media-container'); if (mc) { try { mc.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 1, clientY: 1 })); } catch (e) { } } }); }, 500);

    // Curseur additif : ne touche au dot que sur un .v10-player
    var g = GS();
    if (g && mouse && label) {
      addL(document.body, 'mousemove', function (e) {
        if (!S) return;
        var path = e.composedPath ? e.composedPath() : [], player = null, onCtrl = false;
        for (var i = 0; i < path.length; i++) { var el = path[i]; if (!el || !el.tagName) continue; if (CTRL.test(el.tagName)) onCtrl = true; if (el.classList && el.classList.contains('v10-player')) { player = el; break; } }
        var ns = !player ? 'out' : (onCtrl ? 'ctrl' : 'video');
        if (ns === S.cursorState) return; S.cursorState = ns;
        if (ns === 'video') { S.hovered = S.players.filter(function (x) { return x.p === player; })[0] || null; label.textContent = (S.hovered && S.hovered.playing) ? 'Pause' : 'Play'; g.to(mouse, { duration: 0.3, scale: 1 }); g.to(label, { duration: 0.3, scale: 1 }); }
        else if (ns === 'ctrl') { S.hovered = null; g.to(mouse, { duration: 0.3, scale: 0 }); g.to(label, { duration: 0.15, scale: 0 }); }
        else { S.hovered = null; g.to(mouse, { duration: 0.3, scale: 0.5 }); g.to(label, { duration: 0.2, scale: 0 }); }  // hors player : réinitialise le dot (les containers case study ne sont pas des #link -> growOnHover ne le réinitialise pas)
      });
    }
  }

  function cleanup() {
    if (!S) return;
    S.listeners.forEach(function (l) { try { l[0].removeEventListener(l[1], l[2], l[3]); } catch (e) { } });
    S.timeouts.forEach(function (id) { clearTimeout(id); });
    S.intervals.forEach(function (id) { clearInterval(id); });
    S.players.forEach(function (o) { try { var v = o.video && o.video(); if (v) { v.pause(); v.removeAttribute('src'); } } catch (e) { } });  // stoppe le flux ; v10 finit au disconnect (Barba retire le container)
    var g = GS();
    if (g && S.mouse) { try { g.to(S.mouse, { duration: 0.2, scale: 0.5 }); } catch (e) { } }
    if (g && S.label) { try { g.to(S.label, { duration: 0.2, scale: 0 }); } catch (e) { } }
    S = null;
  }

  window.V10 = { init: init, cleanup: cleanup };
})();
