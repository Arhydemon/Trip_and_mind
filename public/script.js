const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let current = 1;
// current — индекс центральной карточки
// стартуем со 2-й картинки, чтобы слева и справа уже были соседи

function updateSlider() {
  const total = slides.length;

  slides.forEach((slide, index) => {
    slide.classList.remove(
      "pos-hidden-left",
      "pos-left",
      "pos-center",
      "pos-right",
      "pos-hidden-right"
    );

    // Считаем позицию с учетом зацикливания
    let diff = index - current;

    if (diff < -2) diff += total;
    if (diff > 2) diff -= total;

    if (diff === 0) {
      slide.classList.add("pos-center");
    } else if (diff === -1) {
      slide.classList.add("pos-left");
    } else if (diff === 1) {
      slide.classList.add("pos-right");
    } else if (diff === -2) {
      slide.classList.add("pos-hidden-left");
    } else if (diff === 2) {
      slide.classList.add("pos-hidden-right");
    } else {
      slide.classList.add("pos-hidden-right");
    }
  });
}

nextBtn.addEventListener("click", () => {
  current = (current + 1) % slides.length;
  updateSlider();
});

prevBtn.addEventListener("click", () => {
  current = (current - 1 + slides.length) % slides.length;
  updateSlider();
});

updateSlider();