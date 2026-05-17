const interestButtons = document.querySelectorAll(".interest-button");
const btnNext = document.querySelector(".btn-next");

const etcButton = document.querySelector(".etc-button");
const etcSheet = document.querySelector("#etcSheet");
const keywordInput = document.querySelector("#keywordInput");
const addKeywordBtn = document.querySelector("#addKeywordBtn");
const customKeywords = document.querySelector("#customKeywords");

let keywords = [];

interestButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.stopPropagation();

    if (button.classList.contains("etc-button")) {
      if (etcSheet.classList.contains("hidden")) {
        openSheet();
      } else {
        closeSheet();
      }
      return;
    }

    button.classList.toggle("selected");
    toggleIcon(button);
    checkSelected();
  });
});

function openSheet() {
  etcSheet.classList.remove("hidden");

  setTimeout(() => {
    keywordInput.focus();
  }, 100);
}

function closeSheet() {
  etcSheet.classList.add("hidden");
}

function toggleIcon(button) {
  const image = button.querySelector(".icon img");

  const normalSrc = image.dataset.normal || image.src;
  image.dataset.normal = normalSrc;

  if (button.classList.contains("selected")) {
    image.src = normalSrc.replace(".svg", "_select.svg");
  } else {
    image.src = normalSrc;
  }
}

function addKeyword() {
  const value = keywordInput.value.trim();

  if (value === "") return;
  if (keywords.includes(value)) return;

  keywords.push(value);
  keywordInput.value = "";

  renderKeywords();

  etcButton.classList.add("selected");
  toggleIcon(etcButton);

  checkSelected();
}

function removeKeyword(keyword) {
  keywords = keywords.filter((item) => item !== keyword);

  renderKeywords();

  if (keywords.length === 0) {
    etcButton.classList.remove("selected");
    toggleIcon(etcButton);
  }

  checkSelected();
}

function renderKeywords() {
  customKeywords.innerHTML = "";

  keywords.forEach((keyword) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "keyword-chip";
    chip.innerHTML = `- ${keyword}`;

    chip.addEventListener("click", (e) => {
      e.stopPropagation();
      removeKeyword(keyword);
    });

    customKeywords.appendChild(chip);
  });
}

function checkSelected() {
  const selectedCount = document.querySelectorAll(".interest-button.selected").length;
  btnNext.disabled = selectedCount === 0;
}

addKeywordBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  addKeyword();
});

keywordInput.addEventListener("click", (e) => {
  e.stopPropagation();
});

keywordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addKeyword();
  }
});

etcSheet.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("click", () => {
  closeSheet();
});

btnNext.addEventListener("click", () => {
  window.location.href = "../html/partner.html";
});

const btnBack = document.querySelector(".btn-back");

btnBack.addEventListener("click", () => {
  window.location.href = "../html/partner.html";
});