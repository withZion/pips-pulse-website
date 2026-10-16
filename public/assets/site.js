/* Pips Pulse landing page. No dependencies. */
(() => {
  /* ---- Configuration: the public link people use to join the channel ---- */
  const CHANNEL_URL = "";   // e.g. "https://t.me/+AbCdEf..." — set this before launch

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Join buttons: use the channel link when it is set; otherwise they scroll to the final call to action.
  if (CHANNEL_URL) {
    document.querySelectorAll("[data-join]").forEach((a) => {
      a.href = CHANNEL_URL; a.target = "_blank"; a.rel = "noopener";
    });
  }

  /* ---- Scroll reveal, staggered within each group ---- */
  const groups = new Map();
  document.querySelectorAll(".reveal").forEach((el) => {
    const parent = el.parentElement;
    const i = groups.get(parent) || 0;
    groups.set(parent, i + 1);
    el.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
  });
  const show = (el) => el.classList.add("in");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(show);
  }

  /* ---- Hero: alerts arrive one after the other, like a live channel ---- */
  const msgs = [...document.querySelectorAll("[data-msg]")];
  msgs.forEach((m, i) => setTimeout(() => show(m), (reduced ? 0 : 700) + i * (reduced ? 0 : 900)));

  /* ---- Anatomy: each explanation lights up its part of the alert ---- */
  const parts = [...document.querySelectorAll(".parts li")];
  const big = document.querySelector(".msg-big");
  if (parts.length && big) {
    const light = (n) => {
      parts.forEach((li) => li.classList.toggle("on", li.dataset.for === n));
      big.querySelectorAll("[data-part]").forEach((el) => el.classList.toggle("on", el.dataset.part === n));
    };
    let idx = 0, timer = 0, userTook = false;
    const cycle = () => { light(parts[idx].dataset.for); idx = (idx + 1) % parts.length; };
    const start = () => { if (!userTook && !timer && !reduced) { cycle(); timer = setInterval(cycle, 2200); } };
    const stop = () => { clearInterval(timer); timer = 0; };
    parts.forEach((li) => {
      li.tabIndex = 0;
      const take = () => { userTook = true; stop(); light(li.dataset.for); };
      li.addEventListener("mouseenter", take);
      li.addEventListener("focus", take);
      li.addEventListener("click", take);
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: .35 }).observe(big);
    }
    if (reduced) light("1");
  }
})();
