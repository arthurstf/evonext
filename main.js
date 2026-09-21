/* ==========================================================
   EvoNext — scripts
   ➜ EDITE APENAS O BLOCO "CONFIG" ABAIXO com os dados reais.
   ========================================================== */
const CONFIG = {
  // Número do WhatsApp com código do país e DDD, só dígitos. Ex.: 5561999998888
  whatsapp: "5561998895362",
  // Como o número aparece escrito no site
  phoneDisplay: "(61) 99889-5362",
  email: "contato@seudominio.com.br",
  instagram: "evonext",           // sem o @
  // Newsletter: cole aqui o endereço de um serviço de formulário (ex.: Formspree).
  // Se ficar vazio, o cadastro abre uma conversa no WhatsApp.
  newsletterEndpoint: ""
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---------- links de WhatsApp e dados de contato ---------- */
$$("[data-whatsapp]").forEach((a) => {
  a.href = waLink(a.dataset.msg || "Olá! Vim pelo site da EvoNext.");
  a.target = "_blank";
  a.rel = "noopener";
});

$$("[data-show]").forEach((el) => {
  const kind = el.dataset.show;
  if (kind === "phone") el.textContent = CONFIG.phoneDisplay;
  if (kind === "email") { el.textContent = CONFIG.email; el.href = `mailto:${CONFIG.email}`; }
  if (kind === "instagram") {
    el.textContent = `@${CONFIG.instagram}`;
    el.href = `https://instagram.com/${CONFIG.instagram}`;
  }
});

const year = $("#ano");
if (year) year.textContent = new Date().getFullYear();

/* ---------- menu mobile ---------- */
const burger = $("#burger");
const menu = $("#menu");
if (burger && menu) {
  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
}

/* ---------- borda do header ao rolar ---------- */
const header = $(".site-header");
if (header) {
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- contagem dos números (0 → valor final) ---------- */
const counters = $$("[data-count]");
if (counters.length) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const raf = new WeakMap();
  const fmt = (el, n) => `${n}${el.dataset.suffix || ""}`;

  const run = (el) => {
    cancelAnimationFrame(raf.get(el));
    const end = Number(el.dataset.count);
    const dur = 2200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(el, Math.round(end * eased));
      if (p < 1) raf.set(el, requestAnimationFrame(tick));
    };
    raf.set(el, requestAnimationFrame(tick));
  };
  const reset = (el) => { cancelAnimationFrame(raf.get(el)); el.textContent = fmt(el, 0); };

  if (reduce || !("IntersectionObserver" in window)) {
    counters.forEach((el) => { el.textContent = fmt(el, el.dataset.count); });
  } else {
    counters.forEach(reset);
    // Sempre que a seção aparece na tela, os números recomeçam do zero e sobem até o valor real.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? run(entry.target) : reset(entry.target)));
    }, { threshold: 0.35 });
    counters.forEach((el) => io.observe(el));
  }
}

/* ---------- formulário de contato → WhatsApp ---------- */
const formContato = $("#form-contato");
if (formContato) {
  const msg = $("#contato-msg");
  formContato.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = formContato.nome.value.trim();
    msg.className = "form-msg";
    if (!nome) {
      formContato.nome.classList.add("is-invalid");
      formContato.nome.focus();
      msg.textContent = "Informe o seu nome para continuar.";
      msg.classList.add("is-error");
      return;
    }
    formContato.nome.classList.remove("is-invalid");
    const texto = [
      `Olá! Meu nome é ${nome}.`,
      `Preciso de: ${formContato.servico.value}.`,
      formContato.mensagem.value.trim() && `Sobre o meu negócio: ${formContato.mensagem.value.trim()}`
    ].filter(Boolean).join("\n");
    window.open(waLink(texto), "_blank", "noopener");
    msg.textContent = "Abrimos o WhatsApp em outra aba. É só enviar a mensagem.";
    msg.classList.add("is-ok");
  });
}

/* ---------- newsletter ---------- */
const formNews = $("#form-news");
if (formNews) {
  const msg = $("#news-msg");
  formNews.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = formNews.email.value.trim();
    msg.className = "form-msg";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      formNews.email.classList.add("is-invalid");
      msg.textContent = "Digite um e-mail válido, como nome@empresa.com.";
      msg.classList.add("is-error");
      return;
    }
    formNews.email.classList.remove("is-invalid");

    if (CONFIG.newsletterEndpoint) {
      try {
        const res = await fetch(CONFIG.newsletterEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email })
        });
        if (!res.ok) throw new Error(res.status);
        formNews.reset();
        msg.textContent = "Cadastro feito. Você vai receber as novidades da EvoNext.";
        msg.classList.add("is-ok");
      } catch {
        msg.textContent = "Não foi possível cadastrar agora. Tente de novo em instantes.";
        msg.classList.add("is-error");
      }
    } else {
      window.open(waLink(`Olá! Quero receber novidades e estratégias da EvoNext no e-mail ${email}.`), "_blank", "noopener");
      msg.textContent = "Abrimos o WhatsApp em outra aba. Envie a mensagem para confirmar o cadastro.";
      msg.classList.add("is-ok");
    }
  });
}

/* ==========================================================
   Efeitos visuais e interação
   ========================================================== */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- barra de progresso de rolagem ---------- */
{
  const bar = document.createElement("div");
  bar.className = "progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.prepend(bar);
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    ticking = false;
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* ---------- luz que segue o mouse + brilho nos cartões ---------- */
if (finePointer && !reduceMotion) {
  const root = document.documentElement;
  let pending = null;
  document.addEventListener("pointermove", (e) => {
    pending = e;
    if (pending._raf) return;
    requestAnimationFrame(() => {
      root.style.setProperty("--mx", `${pending.clientX}px`);
      root.style.setProperty("--my", `${pending.clientY}px`);
      const card = pending.target.closest && pending.target.closest(".glow");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--x", `${pending.clientX - r.left}px`);
        card.style.setProperty("--y", `${pending.clientY - r.top}px`);
      }
      pending._raf = false;
    });
    pending._raf = true;
  }, { passive: true });

  $$(".person, .num, .quote, .form, .reasons > div").forEach((el) => el.classList.add("glow"));

  /* inclinação 3D nas imagens dos projetos */
  $$(".proj").forEach((proj) => {
    const shot = $(".shot", proj);
    if (!shot) return;
    proj.addEventListener("pointermove", (e) => {
      const r = proj.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      shot.style.transform = `rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateZ(0)`;
    });
    proj.addEventListener("pointerleave", () => { shot.style.transform = ""; });
  });
}

/* ---------- revelar ao rolar ---------- */
if (!reduceMotion && "IntersectionObserver" in window) {
  const targets = $$(".sec-head, .split-head, .acc details, .about > *, .pillars > div, .person, .process li, .reasons > div, .proj, .quote, .news-in > *, .form, .contact-list li");
  targets.forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => targets.includes(c));
    el.style.setProperty("--d", `${Math.min(sibs.indexOf(el), 5) * 0.08}s`);
    el.classList.add("reveal");
  });
  const rio = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); rio.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  targets.forEach((el) => rio.observe(el));
}

/* ---------- rede de partículas no hero ---------- */
const fx = $("#fx");
if (fx) {
  const ctx = fx.getContext("2d");
  const box = fx.parentElement;
  let w = 0, h = 0, pts = [], running = false;
  const mouse = { x: -9999, y: -9999 };

  const size = () => {
    const r = box.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    fx.width = w * dpr; fx.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.max(28, Math.min(85, Math.round((w * h) / (finePointer ? 15000 : 24000))));
    pts = Array.from({ length: n }, (_, i) => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.4 + 0.8, amber: i % 11 === 0
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const LINK = 135, MOUSE = 190;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (running) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        if (dx * dx + dy * dy < MOUSE * MOUSE) { p.x += dx * 0.004; p.y += dy * 0.004; }
      }
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(120,140,255,${(1 - d / LINK) * 0.32})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < MOUSE) {
        ctx.strokeStyle = `rgba(77,225,255,${(1 - dm / MOUSE) * 0.55})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = p.amber ? "rgba(255,176,32,.95)" : "rgba(160,175,255,.85)";
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
  };

  const loop = () => { if (!running) return; draw(); requestAnimationFrame(loop); };
  const start = () => { if (!running && !reduceMotion) { running = true; loop(); } };
  const stop = () => { running = false; };

  size();
  draw();
  window.addEventListener("resize", () => { size(); draw(); });
  box.addEventListener("pointermove", (e) => {
    const r = box.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  }, { passive: true });
  box.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((en) => (en[0].isIntersecting ? start() : stop()), { threshold: 0 }).observe(box);
  } else start();
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
}
