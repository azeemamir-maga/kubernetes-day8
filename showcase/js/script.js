/*
 * AZEEM AMIR | Kubernetes Day 08
 * Interactive Storage Lab Showcase
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  /* ---------------------------------
     1. Scroll progress indicator
  --------------------------------- */

  const progress = $("#progress");
  let scrollScheduled = false;

  function updateScrollProgress() {
    if (!progress) return;

    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage =
      scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

    progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    scrollScheduled = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (scrollScheduled) return;

      scrollScheduled = true;
      window.requestAnimationFrame(updateScrollProgress);
    },
    { passive: true }
  );

  updateScrollProgress();

  /* ---------------------------------
     2. Mobile navigation
  --------------------------------- */

  const menuToggle = $(".menu-toggle");
  const nav = $("#nav");

  function closeMenu() {
    if (!menuToggle || !nav) return;

    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    $$("a", nav).forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ---------------------------------
     3. Reveal elements on scroll
  --------------------------------- */

  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* ---------------------------------
     4. Animated statistics
  --------------------------------- */

  const statElements = $$("[data-count]");

  function animateCounter(element) {
    if (element.dataset.counted === "true") return;

    element.dataset.counted = "true";

    const target = Number(element.dataset.count);

    if (!Number.isFinite(target)) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.textContent = String(target);
      return;
    }

    const duration = 900;
    const startTime = performance.now();

    function frame(now) {
      const elapsed = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);

      element.textContent = String(Math.round(target * eased));

      if (elapsed < 1) {
        window.requestAnimationFrame(frame);
      } else {
        element.textContent = String(target);
      }
    }

    window.requestAnimationFrame(frame);
  }

  if ("IntersectionObserver" in window && statElements.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    statElements.forEach((element) => {
      counterObserver.observe(element);
    });
  } else {
    statElements.forEach(animateCounter);
  }

  /* ---------------------------------
     5. Toast notifications
  --------------------------------- */

  const toast = $(".toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }

  /* ---------------------------------
     6. Copy buttons
  --------------------------------- */

  async function copyText(text) {
    if (!text) {
      throw new Error("Nothing to copy.");
    }

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";

    document.body.appendChild(textarea);
    textarea.select();

    const copied = document.execCommand("copy");

    textarea.remove();

    if (!copied) {
      throw new Error("Clipboard access is unavailable.");
    }
  }

  $$(".copy").forEach((button) => {
    button.addEventListener("click", async () => {
      const container =
        button.closest(".cmd") ||
        button.closest(".panel-bar")?.parentElement ||
        button.closest(".panel-bar");

      const code = container ? $("code", container) : null;
      const pre = container ? $("pre", container) : null;

      const text = code
        ? code.innerText
        : pre
          ? pre.innerText
          : "";

      try {
        await copyText(text);

        const originalLabel = button.textContent;
        button.textContent = "Copied!";

        showToast("Copied to clipboard.");

        window.setTimeout(() => {
          button.textContent = originalLabel;
        }, 1400);
      } catch (error) {
        console.error("Copy failed:", error);
        showToast("Copy unavailable. Please select and copy manually.");
      }
    });
  });

  /* ---------------------------------
     7. YAML explorer tabs
  --------------------------------- */

  const tabs = $$(".tab");
  const panels = $$(".panel");

  function activateTab(tab) {
    const panelId = tab.dataset.tab;

    tabs.forEach((item) => {
      const selected = item === tab;

      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.setAttribute("tabindex", selected ? "0" : "-1");
    });

    panels.forEach((panel) => {
      const selected = panel.id === panelId;

      panel.classList.toggle("active", selected);
      panel.hidden = !selected;
    });
  }

  if (tabs.length && panels.length) {
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(tab));

      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
          return;
        }

        event.preventDefault();

        let nextIndex = index;

        if (event.key === "ArrowRight") {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === "ArrowLeft") {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabs.length - 1;
        }

        tabs[nextIndex].focus();
        activateTab(tabs[nextIndex]);
      });
    });

    const initiallyActive = $(".tab.active") || tabs[0];
    activateTab(initiallyActive);
  }

  /* ---------------------------------
     8. Educational storage simulator
     This does NOT modify the real cluster.
  --------------------------------- */

  const lab = $(".lab");

  if (lab) {
    const emptyOutput = $("#out-empty");
    const pvcOutput = $("#out-pvc");
    const log = $("#log");
    const emptyVolume = $("#vol-empty");
    const pvcVolume = $("#vol-pvc");

    let emptyFiles = [];
    let pvcFiles = [];
    let podExists = true;
    let containerRestarts = 0;
    let podRecreations = 0;

    function renderLab(message) {
      if (emptyOutput) {
        emptyOutput.textContent =
          "$ ls /cache\n" +
          (podExists && emptyFiles.length
            ? emptyFiles.join("\n")
            : "(no files)");
      }

      if (pvcOutput) {
        pvcOutput.textContent =
          "$ ls /data\n" +
          (pvcFiles.length ? pvcFiles.join("\n") : "(no files)");
      }

      if (log) log.textContent = message;

      if (emptyVolume) {
        emptyVolume.classList.toggle("is-empty", emptyFiles.length === 0);
      }

      if (pvcVolume) {
        pvcVolume.classList.toggle("is-empty", pvcFiles.length === 0);
      }
    }

    function handleLabAction(action) {
      switch (action) {
        case "write":
          if (!podExists) {
            showToast("Recreate the Pods before writing.");
            renderLab("The Pods are absent. Recreate them first.");
            return;
          }

          if (!emptyFiles.includes("message.txt")) {
            emptyFiles.push("message.txt");
          }

          if (!pvcFiles.includes("message.txt")) {
            pvcFiles.push("message.txt");
          }

          renderLab(
            "Simulation: message.txt written to both volumes. " +
            "This is an educational model, not a live cluster operation."
          );
          break;

        case "restart":
          if (!podExists) {
            renderLab("The Pods are absent. Recreate them first.");
            return;
          }

          containerRestarts++;

          /*
           * A container restart does not delete the Pod.
           * Therefore, an emptyDir volume normally remains intact.
           * PVC-backed files also remain.
           */
          renderLab(
            `Simulated container restart #${containerRestarts}: ` +
            "both emptyDir and PVC data remain because the Pod still exists."
          );
          break;

        case "delete":
          /*
           * Deleting a Pod removes its emptyDir volume.
           * The PVC is a separate resource, so its data can remain.
           */
          emptyFiles = [];
          podExists = true;
          podRecreations++;

          renderLab(
            `Simulation: Pod deleted and recreated (#${podRecreations}). ` +
            "emptyDir starts empty again; PVC-backed files remain. " +
            "Actual persistence depends on the storage configuration."
          );
          break;

        case "reset":
          emptyFiles = [];
          pvcFiles = [];
          podExists = true;
          containerRestarts = 0;
          podRecreations = 0;

          renderLab(
            "Simulator reset. No real Kubernetes resources were changed."
          );
          break;

        default:
          renderLab("Unknown simulator action.");
      }
    }

    $$("[data-act]", lab).forEach((button) => {
      button.addEventListener("click", () => {
        handleLabAction(button.dataset.act);
      });
    });

    renderLab(
      "Educational simulation ready. Select an action to explore storage behavior."
    );
  }

  /* ---------------------------------
     9. Active navigation link
  --------------------------------- */

  const navLinks = $$("#nav a[href^='#']");
  const observedSections = navLinks
    .map((link) => $(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", isActive);
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    observedSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* ---------------------------------
     10. Footer year
  --------------------------------- */

  const yearElement = $("#year");

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  console.info(
    "AZEEM AMIR | Kubernetes Day 08 showcase initialized."
  );
});
