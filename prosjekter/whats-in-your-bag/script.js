const canvas = document.querySelector(".canvas");
const emptyMessage = document.querySelector(".empty-message");
const stickerGallery = document.querySelector(".sticker-gallery");
const categoryButtons = document.querySelectorAll(".category-tab");
const colorButtons = document.querySelectorAll(".color");
const clearButton = document.querySelector(".clear-button");
const downloadButton = document.querySelector(".download-button");
let activeCategory = "bags";

// Disse teststickerne gjør at spillet virker med én gang.
// Når PNG-filene dine er klare i prosjektet, bruk image i stedet for symbol:
// { name: "Kamera", category: "essentials", image: "bilder/stickers/kamera.png" }
const stickerLibrary = [
  { name: "Tote-bag", category: "bags", image: "bilder/tote.png" },
  { name: "Slengveske", category: "bags", image: "bilder/taske.png" },
  { name: "Handlenett", category: "bags", image: "bilder/veske.png" },
  { name: "Ryggsekk", category: "bags", image: "bilder/reven.png" },
   { name: "Hjerteveske", category: "bags", image: "bilder/hjertebag.png" },

  { name: "Telefon", category: "essentials", image: "bilder/lekemobil.png" },
  { name: "gloss", category: "essentials", image: "bilder/gloss.png"},
  { name: "Vann", category: "essentials", image: "bilder/vann.png" },
  { name: "Pung", category: "essentials", image: "bilder/pung.png" },
  { name: "Nøkler", category: "essentials", image: "bilder/nøkler.png" },
  { name: "Liner", category: "essentials", image: "bilder/liner.png" },
  { name: "Krem", category: "essentials", image: "bilder/krem.png" },
  { name: "Kost", category: "essentials", image: "bilder/kost.png" },
  { name: "Kam", category: "essentials", image: "bilder/kam.png" },
  { name: "Headset", category: "essentials", image: "bilder/headset.png" },
   { name: "Airpods", category: "essentials", image: "bilder/airpods.png" },

  { name: "Sløyfe", category: "decoration", image: "bilder/sløyfe.png" },
  { name: "Hjerter", category: "decoration", image: "bilder/hjerter.png" },
  { name: "Hjerte", category: "decoration", symbol: "♥" },
  { name: "Glitter", category: "decoration", symbol: "✦" },
  { name: "Musikk", category: "decoration", symbol: "♫" },

  { name: "Switch", category: "fun", image: "bilder/switch.png" },
  { name: "Monster", category: "fun", image: "bilder/monser.png" },
  { name: "Mint", category: "fun", image: "bilder/mint.png" },
  { name: "Kamera", category: "fun", image: "bilder/kamra.png" },
  { name: "Bok", category: "fun", image: "bilder/bok.png" },
  { name: "Parfyme", category: "fun", image: "bilder/parfyme.png" },
  { name: "Bamse", category: "fun", image: "bilder/bamse.png" },
];

renderStickerGallery();

function renderStickerGallery() {
  stickerGallery.replaceChildren();

  const visibleStickers = stickerLibrary.filter(
    (sticker) => sticker.category === activeCategory,
  );

  visibleStickers.forEach((stickerData) => {
    const button = document.createElement("button");
    button.className = "sticker-choice";
    button.type = "button";
    button.setAttribute("aria-label", `Legg til ${stickerData.name}`);

    if (stickerData.image) {
      const image = document.createElement("img");
      image.src = stickerData.image;
      image.alt = stickerData.name;
      button.append(image);
    } else {
      const symbol = document.createElement("span");
      symbol.className = "sticker-choice__fallback";
      symbol.textContent = stickerData.symbol;
      button.append(symbol);
    }

    button.addEventListener("click", () => addSticker(stickerData));
    stickerGallery.append(button);
  });
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;

    categoryButtons.forEach((otherButton) => {
      const isActive = otherButton === button;
      otherButton.classList.toggle("is-active", isActive);
      otherButton.setAttribute("aria-selected", String(isActive));
    });

    renderStickerGallery();
  });
});

// Endrer bakgrunnsfargen på arbeidsflaten.
colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.documentElement.style.setProperty(
      "--canvas-color",
      button.dataset.color,
    );

    colorButtons.forEach((otherButton) => {
      otherButton.classList.remove("is-active");
    });

    button.classList.add("is-active");
  });
});

function addSticker(stickerData) {
  const sticker = document.createElement("div");
  const resizeHandle = document.createElement("button");

  sticker.className = "placed-sticker";
  sticker.style.left = "50%";
  sticker.style.top = "50%";

const startSize =
  stickerData.category === "bags" ? 550 : 200;

sticker.style.width = `${startSize}px`;
sticker.style.height = `${startSize}px`;



  if (stickerData.image) {
    const image = document.createElement("img");
    image.src = stickerData.image;
    image.alt = "";
    sticker.append(image);
  } else {
    const symbol = document.createElement("span");
    symbol.className = "placed-sticker__fallback";
    symbol.textContent = stickerData.symbol;
    sticker.append(symbol);
  }

  resizeHandle.className = "resize-handle";
  resizeHandle.type = "button";
  resizeHandle.setAttribute("aria-label", "Endre størrelsen på stickeren");

  sticker.append(resizeHandle);
  canvas.append(sticker);
  emptyMessage.hidden = true;

  makeDraggable(sticker);
  makeResizable(sticker, resizeHandle);
  selectSticker(sticker);

  // Dobbeltklikk på en sticker for å fjerne den.
  sticker.addEventListener("dblclick", (event) => {
    if (event.target === resizeHandle) return;
    sticker.remove();
    updateEmptyMessage();
  });
}

function makeDraggable(sticker) {
  sticker.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".resize-handle")) return;

    selectSticker(sticker);
    sticker.classList.add("is-dragging");
    sticker.setPointerCapture(event.pointerId);

    function moveSticker(moveEvent) {
      const canvasBox = canvas.getBoundingClientRect();

      const x =
        ((moveEvent.clientX - canvasBox.left) / canvasBox.width) * 100;

      const y =
        ((moveEvent.clientY - canvasBox.top) / canvasBox.height) * 100;

      sticker.style.left = `${Math.max(0, Math.min(100, x))}%`;
      sticker.style.top = `${Math.max(0, Math.min(100, y))}%`;
    }

    function stopDragging() {
      sticker.classList.remove("is-dragging");
      sticker.removeEventListener("pointermove", moveSticker);
      sticker.removeEventListener("pointerup", stopDragging);
      sticker.removeEventListener("pointercancel", stopDragging);
    }

    sticker.addEventListener("pointermove", moveSticker);
    sticker.addEventListener("pointerup", stopDragging);
    sticker.addEventListener("pointercancel", stopDragging);
  });
}

function makeResizable(sticker, resizeHandle) {
  resizeHandle.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
    selectSticker(sticker);
    resizeHandle.setPointerCapture(event.pointerId);

    const startX = event.clientX;
    const startY = event.clientY;
    const startSize = sticker.getBoundingClientRect().width;

    function resizeSticker(moveEvent) {
      const horizontalChange = moveEvent.clientX - startX;
      const verticalChange = moveEvent.clientY - startY;
      const change =
        Math.abs(horizontalChange) > Math.abs(verticalChange)
          ? horizontalChange
          : verticalChange;

      // Endre 45 og 320 hvis du vil tillate mindre eller større stickers.
      const newSize = Math.max(45, Math.min(900, startSize + change));

      sticker.style.width = `${newSize}px`;
      sticker.style.height = `${newSize}px`;

      // Gjør at de innebygde testsymbolene skaleres sammen med rammen.
      const fallbackSymbol = sticker.querySelector(
        ".placed-sticker__fallback",
      );

      if (fallbackSymbol) {
        fallbackSymbol.style.fontSize = `${newSize * 0.68}px`;
      }
    }

    function stopResizing() {
      resizeHandle.removeEventListener("pointermove", resizeSticker);
      resizeHandle.removeEventListener("pointerup", stopResizing);
      resizeHandle.removeEventListener("pointercancel", stopResizing);
    }

    resizeHandle.addEventListener("pointermove", resizeSticker);
    resizeHandle.addEventListener("pointerup", stopResizing);
    resizeHandle.addEventListener("pointercancel", stopResizing);
  });
}

function selectSticker(selectedSticker) {
  canvas.querySelectorAll(".placed-sticker").forEach((sticker) => {
    sticker.classList.toggle("is-selected", sticker === selectedSticker);
  });
}

canvas.addEventListener("pointerdown", (event) => {
  if (event.target === canvas) {
    selectSticker(null);
  }
});

clearButton.addEventListener("click", () => {
  canvas.querySelectorAll(".placed-sticker").forEach((sticker) => {
    sticker.remove();
  });

  updateEmptyMessage();
});

function updateEmptyMessage() {
  const hasStickers = canvas.querySelector(".placed-sticker");
  emptyMessage.hidden = Boolean(hasStickers);
}

downloadButton.addEventListener("click", downloadBagAsPdf);

async function downloadBagAsPdf() {
  const hasStickers = canvas.querySelector(".placed-sticker");

  if (!hasStickers) {
    alert("Legg til minst én sticker før du laster ned PDF-en.");
    return;
  }

  if (!window.html2canvas || !window.jspdf) {
    alert("PDF-verktøyet kunne ikke lastes inn.");
    return;
  }

  downloadButton.disabled = true;
  downloadButton.textContent = "Lager PDF …";

  // Fjerner markeringen rundt valgt sticker.
  selectSticker(null);

  // Skjuler skaleringshåndtak og hjelpetekst.
  canvas.classList.add("is-exporting");

  // Venter til nettleseren har oppdatert utseendet.
  await new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });

  try {
    const imageCanvas = await window.html2canvas(canvas, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });

    const width = imageCanvas.width;
    const height = imageCanvas.height;

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
      orientation: width >= height ? "landscape" : "portrait",
      unit: "px",
      format: [width, height],
      hotfixes: ["px_scaling"],
    });

    pdf.addImage(
      imageCanvas.toDataURL("image/png"),
      "PNG",
      0,
      0,
      width,
      height,
    );

    pdf.save("whats-in-my-bag.pdf");
  } catch (error) {
    console.error(error);
    alert("PDF-en kunne ikke lages. Prøv igjen.");
  } finally {
    canvas.classList.remove("is-exporting");

    downloadButton.disabled = false;
    downloadButton.textContent = "Last ned PDF ↓";
  }
}