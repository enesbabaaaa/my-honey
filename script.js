const canvas = document.getElementById("matrix-canvas");
const page = document.getElementById("matrix-page");
const display = document.getElementById("love-display");
const eyebrow = document.getElementById("love-eyebrow");
const word = document.getElementById("love-word");
const subword = document.getElementById("love-subword");
const hint = document.getElementById("stage-hint");
const ripple = document.getElementById("tap-ripple");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const context = canvas?.getContext("2d");
const rainAlphabet = "ILOVEYOUSENISEVIYORUMASKIM♡01";
let columns = [];
let fontSize = 16;
let animationFrame;
let phraseIndex = 0;

const phrases = [
  { eyebrow: "I", word: "LOVE", subword: "YOU" },
  { eyebrow: "I", word: "CHOOSE", subword: "YOU" },
  { eyebrow: "SENİ", word: "SEVİ", subword: "YORUM" },
];

function resizeCanvas() {
  if (!canvas || !context) return;
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * scale);
  canvas.height = Math.floor(window.innerHeight * scale);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(scale, 0, 0, scale, 0, 0);
  fontSize = Math.max(12, Math.min(18, Math.round(window.innerWidth / 92)));
  const count = Math.ceil(window.innerWidth / fontSize);
  columns = Array.from({ length: count }, (_, index) => ({
    x: index * fontSize,
    y: Math.random() * -window.innerHeight,
    speed: 0.4 + Math.random() * 1.2,
    alpha: 0.16 + Math.random() * 0.5,
  }));
}

function drawRain() {
  if (!context) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  context.fillStyle = "rgba(5, 5, 9, 0.18)";
  context.fillRect(0, 0, width, height);
  context.font = `${fontSize}px monospace`;
  context.textAlign = "center";

  columns.forEach((column) => {
    const character = rainAlphabet[Math.floor(Math.random() * rainAlphabet.length)];
    const y = column.y;
    const head = Math.random() > 0.92;
    context.fillStyle = head
      ? `rgba(255, 255, 255, ${Math.min(0.88, column.alpha + 0.3)})`
      : `rgba(220, 224, 230, ${column.alpha})`;
    context.fillText(character, column.x + fontSize / 2, y);
    column.y += fontSize * column.speed * (reducedMotion.matches ? 0.35 : 1);
    if (column.y > height + fontSize * 2 && Math.random() > 0.965) {
      column.y = Math.random() * -height * 0.7;
      column.speed = 0.4 + Math.random() * 1.2;
    }
  });

  animationFrame = window.requestAnimationFrame(drawRain);
}

function changePhrase() {
  phraseIndex = (phraseIndex + 1) % phrases.length;
  const next = phrases[phraseIndex];
  [eyebrow, word, subword].forEach((element) => element?.classList.add("is-changing"));
  window.setTimeout(() => {
    if (eyebrow) eyebrow.textContent = next.eyebrow;
    if (word) word.textContent = next.word;
    if (subword) subword.textContent = next.subword;
    [eyebrow, word, subword].forEach((element) => element?.classList.remove("is-changing"));
  }, reducedMotion.matches ? 0 : 180);
  if (hint) hint.textContent = phraseIndex === phrases.length - 1 ? "kalbimden sana" : "bir kez daha dokun";
}

function showRipple(event) {
  if (!ripple) return;
  const rect = page.getBoundingClientRect();
  ripple.style.left = `${event.clientX - rect.left}px`;
  ripple.style.top = `${event.clientY - rect.top}px`;
  ripple.classList.remove("is-active");
  void ripple.offsetWidth;
  ripple.classList.add("is-active");
}

function init() {
  if (!canvas || !context || !page) return;
  resizeCanvas();
  drawRain();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  display?.addEventListener("click", (event) => {
    changePhrase();
    showRipple(event);
  });

  page.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    showRipple(event);
  });

  window.addEventListener("beforeunload", () => window.cancelAnimationFrame(animationFrame));
}

init();
