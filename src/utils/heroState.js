let inMemoryHeroSeen = false;

export const getHasSeenHeroIntro = () => {
  if (inMemoryHeroSeen) return true;
  try {
    return sessionStorage.getItem('hero_intro_completed') === 'true';
  } catch {
    return false;
  }
};

export const setHasSeenHeroIntro = (seen = true) => {
  inMemoryHeroSeen = seen;
  try {
    if (seen) {
      sessionStorage.setItem('hero_intro_completed', 'true');
    } else {
      sessionStorage.removeItem('hero_intro_completed');
    }
  } catch {
    // Ignore storage errors in private browsing/sandboxes
  }
};
