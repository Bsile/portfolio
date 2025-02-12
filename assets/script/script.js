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
});






if (typeof window.lenis === 'undefined') {
  window.lenis = null;
}

function initializeLenis() {
  if (window.lenis) {
    window.lenis.destroy(); // Détruire l'ancienne instance de Lenis si elle existe
    /*console.log('Lenis destroyed');*/
  }

  // init lenis
  window.lenis = new Lenis({
    lerp: 0.1,
    smooth: true,
  });

  /*console.log('Lenis initialized');*/

  const loop = (time) => {
    window.lenis.raf(time);
    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);

  window.lenis.on('scroll', (e) => {
    /*console.log(e);*/
  });

  window.lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    window.lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const clickListener = function (e) {
      e.preventDefault();
      window.lenis.scrollTo(this.getAttribute('href'));
    };

    anchor.removeEventListener('click', clickListener);
    anchor.addEventListener('click', clickListener);
  });
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
  $(document).ready(function () {
    console.log('Removing previous event listeners for .popup-vimeo...');
    // Détacher tous les écouteurs d'événements précédemment attachés à .popup-vimeo
    $('.popup-vimeo').off('click.magnificPopup');

    console.log('Adding new event listeners for .popup-vimeo...');
    // Ajouter les nouveaux écouteurs d'événements
    $('.popup-vimeo').magnificPopup({
      type: 'iframe',
      removalDelay: 300,
      mainClass: 'mfp-fade'
    });
  });
}



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
      divTexte.textContent = 'Play';
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
      divTexte.textContent = 'Extra-pixels';
      break;
    case 'legal':
      divTexte.textContent = 'Mentions légales';
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









function reloadVidstackResources() {
  const themeLink = document.querySelector('link[href="https://cdn.vidstack.io/player/theme.css"]');
  const videoLink = document.querySelector('link[href="https://cdn.vidstack.io/player/video.css"]');
  const playerScript = document.querySelector('script[src="https://cdn.vidstack.io/player"]');

  if (themeLink) themeLink.remove();
  if (videoLink) videoLink.remove();
  if (playerScript) playerScript.remove();

  loadPlayerScripts();
}


function loadPlayerScripts() {
  return new Promise((resolve, reject) => {
    // Check if the player script is already loaded
    const existingScript = document.querySelector('script[src="https://cdn.vidstack.io/player"]');
    const existingThemeCSS = document.querySelector('link[href="https://cdn.vidstack.io/player/theme.css"]');
    const existingVideoCSS = document.querySelector('link[href="https://cdn.vidstack.io/player/video.css"]');

    if (existingScript && existingThemeCSS && existingVideoCSS) {
      console.log('Player.js and CSS are already loaded.');
      resolve();
    } else {
      // Create an array to hold promises for loading scripts and styles
      const loadPromises = [];

      // Load player.js script if not already loaded
      if (!existingScript) {
        console.log('Loading Player.js script...');
        const script = document.createElement('script');
        script.src = 'https://cdn.vidstack.io/player';
        script.type = 'module';
        script.onload = () => {
          console.log('Player.js script loaded successfully.');
        };
        script.onerror = () => {
          console.error('Failed to load Player.js script.');
          reject();
        };
        document.head.appendChild(script);
        loadPromises.push(new Promise((res, rej) => {
          script.onload = res;
          script.onerror = rej;
        }));
      }

      // Load player theme CSS if not already loaded
      if (!existingThemeCSS) {
        console.log('Loading Player.js theme CSS...');
        const themeLink = document.createElement('link');
        themeLink.rel = 'stylesheet';
        themeLink.href = 'https://cdn.vidstack.io/player/theme.css';
        document.head.appendChild(themeLink);
        loadPromises.push(new Promise((res, rej) => {
          themeLink.onload = res;
          themeLink.onerror = rej;
        }));
      }

      // Load player video CSS if not already loaded
      if (!existingVideoCSS) {
        console.log('Loading Player.js video CSS...');
        const videoLink = document.createElement('link');
        videoLink.rel = 'stylesheet';
        videoLink.href = 'https://cdn.vidstack.io/player/video.css';
        document.head.appendChild(videoLink);
        loadPromises.push(new Promise((res, rej) => {
          videoLink.onload = res;
          videoLink.onerror = rej;
        }));
      }

      // Resolve the main promise when all scripts and styles are loaded
      Promise.all(loadPromises)
        .then(() => {
          console.log('All Player.js resources loaded successfully.');
          resolve();
        })
        .catch((err) => {
          console.error('Failed to load Player.js resources:', err);
          reject(err);
        });
    }
  });
}









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
    console.log(`🌟 Section active détectée : ${activeSection.id}`);
    // Désactive tous les chapitres avant d'activer celui en cours
    document.querySelectorAll('.chapter').forEach(chap => chap.classList.remove('active'));

    // Active le lien correspondant
    let activeLink = document.querySelector(`.sidebar-chapters-wrapper a[data-target="#${activeSection.id}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
      console.log(`✔️ Activation du chapitre : ${activeLink.textContent.trim()}`);
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
