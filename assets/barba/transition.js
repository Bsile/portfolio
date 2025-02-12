const animation = {
    element: document.querySelector('.pt'),
    text: document.querySelectorAll('.pt_text > h2'),
    duration: 1.2,
    ease: 'expo.inOut',
};


gsap.set(animation.element, {
    yPercent: 100,
    autoAlpha: 1,
});

const showPage = () => {
    gsap.set(animation.text, {
        yPercent: 100,
    });

    return new Promise((resolve) => {
        gsap.timeline({ defaults: { duration: animation.duration, ease: animation.ease } })

            .fromTo(animation.element, { yPercent: 100 }, { yPercent: 0 }

            )
            .to(animation.text, {
                yPercent: 0,
                stagger: 0.032,
                onComplete: resolve,
            },


                0.16
            );
    });
};

const hidePage = () => {
    gsap.timeline({ defaults: { duration: animation.duration, ease: animation.ease } })
        .to(animation.element, { yPercent: -100 })

};

export { showPage, hidePage };