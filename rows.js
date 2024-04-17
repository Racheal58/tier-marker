const rows = document.querySelectorAll(".tier-row");

const onDragOver = (e) => {
  e.preventDefault();
};

const onDrop = (e) => {
  e.preventDefault();
  const draggedCardId = e.dataTransfer.getData("id")
  const draggedCard = document.getElementById(draggedCardId)
  e.target.appendChild(draggedCard)

  console.log(`dragged, ${e.dataTransfer.getData("id")}`);
};

rows.forEach((row) => {
  row.ondragover = onDragOver;
  row.ondrop = onDrop;
});
