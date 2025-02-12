import { showPage, hidePage } from '/assets/barba/transition.js';

barba.init({
  debug: false,
  transitions: [
    {
      name: 'page-transition',
      once() { },

      async leave(data) {
        await showPage(data);
        data.current.container.remove();
      },

      enter(data) {
        hidePage();
      },

      async beforeEnter(data) {
        ScrollTrigger.getAll().forEach(t => t.kill());
      },
    },
  ],
});

barba.hooks.once((data) => {
  initializeLenis(); // Initialiser Lenis lors du chargement initial
});

barba.hooks.beforeEnter((data) => {
  $('img').attr('draggable', false);
  window.scrollTo(0, 0);
  if (data.next.namespace === 'about') {
    setupXpHover();
    initParallax();
    imgOnHover();
    loadSwiperScripts().then(() => {
      swiperAnimation();
    });
    loadAboutScripts().then(() => {
      webglpixeleffect();
      observeSections();
    });
  }
  if (data.next.namespace === 'home') {
    reloadVidstackResources().then(() => {
      popupvimeo();
      initializeLenis();
    });
  }
  if (data.next.namespace === 'extrapixels') {
    initScroll();
  }
  if (data.next.namespace === 'makebetter') {
    reloadVidstackResources().then(() => {
      initParallax();
      initializeLenis();
      observeSections();
    });
  }
  if (data.next.namespace === 'drime') {
    reloadVidstackResources().then(() => {
      initParallax();
      initializeLenis();
      observeSections();
    });
  }
  if (data.next.namespace === 'upreview') {
    reloadVidstackResources().then(() => {
      initParallax();
      initializeLenis();
      observeSections();
    });
  }
});





barba.hooks.afterEnter((data) => {
  if (data.next.namespace === 'makebetter') {
    const posters = document.querySelectorAll('media-poster');
    posters.forEach(poster => {
      const src = poster.getAttribute('src');
      if (!src) {
        poster.setAttribute('src', 'poster'); // Remplacer avec une miniature par défaut
      }
    });
  }
  if (data.next.namespace === 'drime') {
    const posters = document.querySelectorAll('media-poster');
    posters.forEach(poster => {
      const src = poster.getAttribute('src');
      if (!src) {
        poster.setAttribute('src', 'poster'); // Remplacer avec une miniature par défaut
      }
    });
  }
  if (data.next.namespace === 'upreview') {
    const posters = document.querySelectorAll('media-poster');
    posters.forEach(poster => {
      const src = poster.getAttribute('src');
      if (!src) {
        poster.setAttribute('src', 'poster'); // Remplacer avec une miniature par défaut
      }
    });
  }
});





barba.hooks.afterEnter((data) => {
  const posters = document.querySelectorAll('media-poster');
  posters.forEach(poster => {
    const src = poster.getAttribute('src');
    poster.setAttribute('src', ''); // Supprime temporairement l'image
    poster.setAttribute('src', src); // Recharge l'image
  });
});




barba.hooks.afterLeave((data) => {
  data.current.container.remove();
  if (data.current.namespace === 'about') {
    cleanupWebGL();
    destroySwiper();
    cleanupParallax();
  }
  if (data.current.namespace === 'makebetter') {
    cleanupParallax();
  }
  if (data.current.namespace === 'drime') {
    cleanupParallax();
  }
  if (data.current.namespace === 'upreview') {
    cleanupParallax();
  }
  if (data.current.namespace === 'extrapixels') {
    cleanupScroll();
    destroySwiper();
  }
});

barba.hooks.beforeEnter((data) => {
  $(data.next.container).find('img').attr('draggable', false);
  resetCursor(); // Réinitialiser le curseur avant d'entrer dans la nouvelle page
});

barba.hooks.beforeLeave((data) => {
  $(data.next.container).find('img').attr('draggable', false);
  resetCursor(); // Réinitialiser le curseur avant d'entrer dans la nouvelle page
});

barba.hooks.after((data) => {
  pageentrance();
  growOnHover(); // Réinitialiser les écouteurs d'événements après chaque transition
  initializeLenis(); // Réinitialiser Lenis après chaque transition
});

barba.hooks.afterEnter((data) => {
  var vids = document.querySelectorAll(".vid"); vids.forEach(vid => { var playPromise = vid.play(); if (playPromise !== undefined) { playPromise.then(_ => { }).catch(error => { }); }; });
  ScrollTrigger.refresh();
  window.lenis.update();
});

function leaveAnimation(container) {
  return new Promise(async resolve => {
    await gsap
      .to(container, {
        duration: 1,
        opacity: 0,
      })
      .then();
    resolve();
  });
}
