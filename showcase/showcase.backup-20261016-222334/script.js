"use strict";
document.documentElement.classList.add("js");
document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Scroll progress */
  const bar = $("#progress");
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100 + "%";
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Mobile menu */
  const toggle = $(".menu-toggle"), nav = $("#nav");
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    toggle.textContent = open ? "×" : "☰";
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  /* Reveal on scroll */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add("visible"));

  /* Counters */
  const count = (el) => {
    const target = Number(el.dataset.count), t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / 1100, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && !reduce) {
    const co = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { count(e.target); co.unobserve(e.target); }
    }), { threshold: 0.6 });
    $$("[data-count]").forEach((el) => co.observe(el));
  }

  /* Active nav link */
  const links = $$('.nav-links a[href^="#"]');
  if ("IntersectionObserver" in window) {
    const so = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    }), { rootMargin: "-30% 0px -60% 0px" });
    $$("section[id]").forEach((s) => so.observe(s));
  }

  /* Toast + copy buttons */
  const toast = $(".toast"); let tt;
  const say = (msg) => { toast.textContent = msg; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 1800); };
  $$(".copy").forEach((btn) => btn.addEventListener("click", async () => {
    const src = btn.closest(".cmd")?.querySelector("code") || btn.closest(".panel")?.querySelector("pre code");
    try { await navigator.clipboard.writeText(src.innerText.trim()); say("Copied to clipboard"); }
    catch { say("Copy unavailable, select the text instead"); }
  }));

  /* YAML tabs */
  const tabs = $$(".tab");
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    tabs.forEach((t) => { const on = t === tab; t.classList.toggle("active", on); t.setAttribute("aria-selected", String(on)); });
    $$(".panel").forEach((p) => p.classList.toggle("active", p.id === tab.dataset.tab));
  }));

  /* Lifecycle simulator */
  const state = { empty: false, pvc: false };
  const render = (flag) => {
    $("#out-empty").textContent = "$ ls /cache\n" + (state.empty ? "message.txt" : "(empty)");
    $("#out-pvc").textContent = "$ ls /data\n" + (state.pvc ? "message.txt" : "(empty)");
    ["empty", "pvc"].forEach((k) => $("#vol-" + k).classList.remove("lost", "kept"));
    if (flag) { $("#vol-empty").classList.add(flag.empty); $("#vol-pvc").classList.add(flag.pvc); }
  };
  const log = (m) => ($("#log").textContent = m);
  const acts = {
    write() { state.empty = state.pvc = true; render(); log("message.txt written to both volumes."); },
    restart() {
      if (!state.empty && !state.pvc) return log("Nothing to test yet. Write message.txt first.");
      render({ empty: "kept", pvc: "kept" });
      log("Container restarted. The Pod is unchanged, so both volumes keep their data.");
    },
    delete() {
      if (!state.empty && !state.pvc) return log("Nothing to test yet. Write message.txt first.");
      state.empty = false; render({ empty: "lost", pvc: "kept" });
      log("Pod deleted and recreated. emptyDir was removed with the old Pod; the PVC and its data remained.");
    },
    reset() { state.empty = state.pvc = false; render(); log("Reset. Start by writing a file."); }
  };
  $$("[data-act]").forEach((b) => b.addEventListener("click", () => acts[b.dataset.act]()));
  render();
});
