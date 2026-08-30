'use client';

import { useEffect } from 'react';

export default function Interactions() {
  useEffect(() => {
    const hdr = document.getElementById('hdr');
    const burger = document.getElementById('burger');
    const nav = hdr ? hdr.querySelector<HTMLElement>('.nav-links') : null;

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- sticky header ---------- */
    const onScroll = () => {
      if (!hdr) return;
      hdr.classList.toggle('stuck', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- scroll reveal ---------- */
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.rv'));
    let observer: IntersectionObserver | null = null;

    if (reduced || typeof IntersectionObserver === 'undefined') {
      reveals.forEach((el) => el.classList.add('in'));
    } else {
      observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              obs.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
      );
      reveals.forEach((el) => observer!.observe(el));
    }

    /* ---------- mobile menu ---------- */
    const closeMenu = () => {
      if (!hdr || !burger) return;
      hdr.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
    };

    const toggleMenu = () => {
      if (!hdr || !burger) return;
      const open = hdr.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    const onNavClick = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('a')) closeMenu();
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };

    burger?.addEventListener('click', toggleMenu);
    nav?.addEventListener('click', onNavClick);
    document.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer?.disconnect();
      burger?.removeEventListener('click', toggleMenu);
      nav?.removeEventListener('click', onNavClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return null;
}
