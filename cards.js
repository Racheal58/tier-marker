const cards = document.querySelectorAll(".card");

const onDragStart = (e) => {
  console.log("dragging element");
  e.dataTransfer.setData("id", e.target.id);

  setTimeout(() => {
    e.target.style.visibility = "hidden";
  }, 50);
};

const onDragEnd = (e) => {
  e.target.style.visibility = "visible";
};

cards.forEach((card) => {
  card.ondragstart = onDragStart;
  card.ondragend = onDragEnd;
});
