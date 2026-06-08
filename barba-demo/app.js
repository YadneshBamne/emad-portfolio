// Set initial state of overlay and branding text on page load
gsap.set('.transition-overlay', { yPercent: 100 });
gsap.set('.branding-text', { opacity: 0, scale: 1.1 });

// Initialize Barba.js
barba.init({
  // Enable debug mode to see lifecycle logs in console (optional, helpful for debugging)
  debug: true,
  
  transitions: [
    {
      name: 'cinematic-block-wipe',
      
      // Hook: Reset scroll to top before entering the new page
      beforeEnter(data) {
        window.scrollTo(0, 0);
      },
      
      // Hook: Leave current page (triggered on link click)
      leave(data) {
        // Retrieve the done function callback to signal transition completion
        const done = this.async();
        
        // Create GSAP Timeline for the curtain pull
        const tl = gsap.timeline({
          onComplete: done
        });
        
        // 1. Animate the red overlay moving up to cover the screen (yPercent: 0)
        tl.to('.transition-overlay', {
          yPercent: 0,
          duration: 0.8,
          ease: 'power4.inOut',
          force3D: true // Hardware acceleration
        });
        
        // 2. Slightly stagger the branding text fading in & scaling down
        // It starts slightly before the overlay hits the top for a fluid, punchy impact
        tl.to('.branding-text', {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.35');
      },
      
      // Hook: Enter new page (triggered when the new container is ready)
      enter(data) {
        // Retrieve the done function callback
        const done = this.async();
        
        // Create GSAP Timeline for revealing the new page
        const tl = gsap.timeline({
          onComplete: () => {
            // 3. Reset the overlay back to yPercent: 100 immediately after the timeline completes
            // This prepares it off-screen at the bottom for the next transition
            gsap.set('.transition-overlay', { yPercent: 100 });
            done();
          }
        });
        
        // 1. Fade out the branding text very quickly
        tl.to('.branding-text', {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.out'
        });
        
        // 2. Animate overlay continuing its upward momentum off the top of the screen (yPercent: -100)
        tl.to('.transition-overlay', {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut',
          force3D: true
        }, '-=0.15'); // Small overlap for cinematic pacing
      }
    }
  ]
});
