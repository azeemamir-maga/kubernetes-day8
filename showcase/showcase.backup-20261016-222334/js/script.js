/* PROFESSIONAL MOTION UPGRADE */

body {
  background-image:
    linear-gradient(rgba(201,164,73,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(201,164,73,.025) 1px, transparent 1px);
  background-size: 45px 45px;
  animation: gridDrift 25s linear infinite;
}

@keyframes gridDrift {
  from { background-position: 0 0; }
  to { background-position: 45px 45px; }
}

.hero .eyebrow {
  animation: eyebrowGlow 3s ease-in-out infinite;
}

@keyframes eyebrowGlow {
  0%, 100% { text-shadow: 0 0 0 transparent; }
  50% { text-shadow: 0 0 16px rgba(244,215,131,.65); }
}

.terminal-card {
  animation: terminalFloat 5s ease-in-out infinite;
}

@keyframes terminalFloat {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -10px; }
}

.architecture-card {
  position: relative;
  overflow: hidden;
}

.architecture-card::after,
.manifest-card::after,
.lesson-card::after,
.timeline-content::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(
    280px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(201,164,73,.13),
    transparent 75%
  );
  transition: opacity .3s;
}

.architecture-card:hover::after,
.manifest-card:hover::after,
.lesson-card:hover::after,
.timeline-content:hover::after {
  opacity: 1;
}

.architecture-card,
.manifest-card,
.lesson-card,
.timeline-content {
  position: relative;
  overflow: hidden;
}

.storage-node {
  animation: storagePulse 2.8s ease-in-out infinite;
}

@keyframes storagePulse {
  0%, 100% {
    box-shadow: 0 0 0 rgba(201,164,73,0);
    border-color: #78612f;
  }
  50% {
    box-shadow: 0 0 22px rgba(201,164,73,.17);
    border-color: #f4d783;
  }
}

.timeline-number {
  animation: numberPulse 3s ease-in-out infinite;
}

@keyframes numberPulse {
  0%, 100% { box-shadow: 0 0 0 rgba(201,164,73,0); }
  50% { box-shadow: 0 0 17px rgba(201,164,73,.18); }
}

.button-gold {
  background-size: 200% 100%;
  animation: goldShimmer 5s ease-in-out infinite;
}

@keyframes goldShimmer {
  0%, 100% { background-position: 100% 0; }
  50% { background-position: 0 0; }
}

@media (prefers-reduced-motion: reduce) {
  body,
  .terminal-card,
  .storage-node,
  .timeline-number,
  .button-gold,
  .hero .eyebrow {
    animation: none !important;
  }
}

