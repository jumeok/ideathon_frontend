const optionButtons = document.querySelectorAll(".question button");
const questions = document.querySelectorAll(".question");
const nextButton = document.querySelector("#nextButton");

optionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const question = button.closest(".question");
    const buttons = question.querySelectorAll("button");

    buttons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");

    checkAllSelected();
  });
});

function checkAllSelected() {
  const allSelected = [...questions].every((question) =>
    question.querySelector("button.selected")
  );

  nextButton.disabled = !allSelected;
}

nextButton.addEventListener("click", () => {
  if (!nextButton.disabled) {
    window.location.href = "../interests.html";
  }
});