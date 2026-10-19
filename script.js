// =================== PERSONALIZE AQUI ===================
// Troque pela data em que vocês começaram a namorar.
// Formato: ano, mês (0 = janeiro, 1 = fevereiro...), dia, hora, minuto.
const DATA_INICIO_NAMORO = new Date(2024, 4, 3, 14, 10);

// Para adicionar música:
// 1. Crie a pasta "musica" dentro do projeto.
// 2. Coloque nela um arquivo chamado "musica.mp3".
// 3. No index.html, descomente a linha <source src="musica/musica.mp3" type="audio/mpeg">.
// ========================================================

const $ = (seletor) => document.querySelector(seletor);
const backgroundMusic = $("#backgroundMusic");
const musicToggle = $("#musicToggle");
const musicLabel = $("#musicLabel");
const toast = $("#toast");
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2600);
}

// Música: navegadores exigem que o usuário interaja antes de iniciar áudio.
musicToggle.addEventListener("click", async () => {
  if (backgroundMusic.paused) {
    if (!backgroundMusic.querySelector("source")) {
      showToast("Agrega tu canción en musica/musica.mp3 y activa la línea en index.html 🎵");
      return;
    }
    try {
      await backgroundMusic.play();
      musicToggle.setAttribute("aria-pressed", "true");
      musicLabel.textContent = "Pausar la música";
    } catch {
      showToast("No pude reproducir la canción. Revisa el archivo musica/musica.mp3.");
    }
  } else {
    backgroundMusic.pause();
    musicToggle.setAttribute("aria-pressed", "false");
    musicLabel.textContent = "Poner la música";
  }
});

// Contador desde o início do namoro.
function updateCounter() {
  const now = new Date();
  let difference = now - DATA_INICIO_NAMORO;
  if (difference < 0) difference = 0;

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  $("#days").textContent = String(days).padStart(3, "0");
  $("#hours").textContent = String(hours).padStart(2, "0");
  $("#minutes").textContent = String(minutes).padStart(2, "0");
  $("#seconds").textContent = String(seconds).padStart(2, "0");
}
updateCounter();
setInterval(updateCounter, 1000);

// Carta: abre em uma janela de diálogo.
const letterDialog = $("#letterDialog");
$("#openLetter").addEventListener("click", () => {
  letterDialog.showModal();
  $(".envelope").classList.add("open");
});
document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.close);
    dialog.close();
    if (dialog === letterDialog) $(".envelope").classList.remove("open");
  });
});
[letterDialog, $("#surpriseDialog")].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
      if (dialog === letterDialog) $(".envelope").classList.remove("open");
    }
  });
});

// Bolo: cada vela pode ser apagada. A surpresa só libera após apagar as três.
const candles = [...document.querySelectorAll(".candle")];
const surpriseButton = $("#surpriseButton");
const cakeInstruction = $("#cakeInstruction");
candles.forEach((candle) => {
  candle.addEventListener("click", () => {
    if (candle.classList.contains("blown")) return;
    candle.classList.add("blown");
    candle.setAttribute("aria-label", "Vela apagada");
    const remaining = candles.filter((item) => !item.classList.contains("blown")).length;

    if (remaining > 0) {
      cakeInstruction.textContent = `¡Eso es! Falta${remaining === 1 ? "" : "m"} ${remaining} velita${remaining === 1 ? "" : "s"} ✨`;
    } else {
      cakeInstruction.textContent = "¡Ya lo pedí! Que todos tus deseos se hagan realidad. 💗";
      surpriseButton.disabled = false;
      showToast("¡Ya se apagaron todas las velitas! Tu sorpresa está lista 💌");
      createConfetti();
    }
  });
});
surpriseButton.addEventListener("click", () => {
  $("#surpriseDialog").showModal();
  createConfetti();
});

// Confetes em corações e estrelinhas, sem biblioteca externa.
function createConfetti() {
  const symbols = ["♥", "✦", "♡", "✧"];
  for (let i = 0; i < 32; i++) {
    const piece = document.createElement("span");
    piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    piece.style.position = "fixed";
    piece.style.zIndex = "50";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.top = "-30px";
    piece.style.color = ["#f0c9d0", "#d98d9f", "#ffd9a0", "#fff2e8"][Math.floor(Math.random() * 4)];
    piece.style.fontSize = `${12 + Math.random() * 18}px`;
    piece.style.pointerEvents = "none";
    piece.style.transition = `transform ${2 + Math.random() * 2}s linear, opacity 2.8s ease`;
    document.body.appendChild(piece);
    requestAnimationFrame(() => {
      piece.style.transform = `translate(${Math.random() * 140 - 70}px, ${window.innerHeight + 80}px) rotate(${Math.random() * 600 - 300}deg)`;
      piece.style.opacity = "0";
    });
    setTimeout(() => piece.remove(), 4300);
  }
}

// Se uma imagem externa falhar, mostra uma cor de fundo em vez de quebrar o layout.
document.querySelectorAll(".photo-card img").forEach((img) => {
  img.addEventListener("error", () => {
    img.style.display = "none";
    img.parentElement.style.background = "linear-gradient(135deg, #633047, #c77b8e)";
    img.parentElement.style.minHeight = "180px";
  });
});
