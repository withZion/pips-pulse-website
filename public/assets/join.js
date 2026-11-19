/* Pips Pulse /join page: the WhatsApp buttons and today's count. No dependencies.
   Joining and paying happen in the bot (t.me/PipsPulseBot?start=join; worker/pips-pay.js in the Pips Pulse repo):
   one plan, $15 a month (card or crypto) or ₦19,950 (bank transfer or naira card), paid once, nothing renews. */
(() => {
  /* ---- Configuration ---- */
  const WHATSAPP_NUMBER = "2348160777496"; // Zion's WhatsApp (from his wa.link/zrnax9)
  const from = new URLSearchParams(location.search).get("utm_source") === "zchart" ? "\nI came from ZChart." : "";

  /* ---- WhatsApp buttons: a message ready ---- */
  document.querySelectorAll("[data-wa]").forEach((a) => {
    const text = `Hello Zion,\nI'd like to ask about Pips Pulse before I join.${from}`;
    if (!WHATSAPP_NUMBER) return;
    a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* ---- Live from the channel: how many setups went out today (count only, from the Pips Pulse service) ---- */
  const todayEl = document.querySelector("[data-today]");
  if (todayEl) {
    fetch("https://pips-pulse-bot.zion-ojuwonlo.workers.dev/today.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((t) => {
        if (!t || !t.day) return;
        // The channel's day runs on Zion's clock; a count from yesterday isn't today's.
        const now = new Date(Date.now() + (Number(t.tz) || 0) * 3_600_000).toISOString().slice(0, 10);
        if (t.day !== now || !(t.sent > 0)) return;
        todayEl.textContent = `${t.sent} setup${t.sent === 1 ? "" : "s"} sent to members so far today.`;
      })
      .catch(() => {}); // keeps the standing line
  }
})();
