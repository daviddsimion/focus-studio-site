// Animații la scroll (simplu și eficient)
const sections = document.querySelectorAll('section');

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;

  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top < triggerBottom) {
      section.style.opacity = 1;
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
const input = document.getElementById("chat-input");
const box = document.getElementById("chat-box");

const raspunsuri = [
    "📸 Momentul perfect? Îl prind eu, stai liniștit.",
    "🎬 Îți place vibe-ul cinematic? Facem magie împreună!",
    "🔧 Editare profi, fără compromisuri!",
    "💬 Spune-mi ce vrei și adaptăm stilul tău!",
    "🔥 Pozele tale o să rupă Instagram-ul, garantat!",
    "😎 Vrei și filmare verticală pentru TikTok? Se rezolvă!"
];

input.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && input.value.trim()) {
        const userMsg = document.createElement("div");
        userMsg.className = "user-msg";
        userMsg.innerText = input.value;
        box.appendChild(userMsg);

        const botMsg = document.createElement("div");
        botMsg.className = "bot-msg";
        botMsg.innerText = "David tastează...";

        box.appendChild(botMsg);
        box.scrollTop = box.scrollHeight;

        const index = Math.floor(Math.random() * raspunsuri.length);
        const reply = raspunsuri[index];

        setTimeout(() => {
            botMsg.innerText = reply;
            box.scrollTop = box.scrollHeight;
        }, 1000);

        input.value = "";
    }
});
document.addEventListener('DOMContentLoaded', () => {
    let lastScrollTop = 0;
    const header = document.querySelector('.main-header');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scroll în jos și după 100px, ascunde header-ul
            header.classList.add('hide');
        } else {
            // Scroll în sus, arată header-ul
            header.classList.remove('hide');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
});
