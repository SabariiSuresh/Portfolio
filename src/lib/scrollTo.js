/* scroll to a section by id, through Lenis when it is running */
export function scrollToId(id, offset = 0) {
  const el = id === 'home' ? null : document.getElementById(id);
  if (window.lenis) {
    if (id === 'home') window.lenis.scrollTo(0, { duration: 1.2 });
    else if (el) window.lenis.scrollTo(el, { offset, duration: 1.3 });
    return;
  }
  if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
  else if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' });
}
