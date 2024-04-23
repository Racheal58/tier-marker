const rows = document.querySelectorAll(".tier-row");
const rowDrop = document.querySelectorAll(".drop-zone");

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

const onDragRowStart = (e) => {
  console.log('row dragging')
  const id = e.dataTransfer.setData("id", e.target.id)
  setTimeout(() => {
    e.target.style.visibility = "hidden";
  }, 50);

  console.log('row id', id)
}

const onDragRowEnd = (e) => {
  e.target.style.visibility = "visible";
};

const onRowDragOver = (e) => {
  e.preventDefault()
  console.log("over")
}

const onRowDrop = (e) => {
  e.preventDefault()
  console.log("row dropped", e.target)
  const draggedRowId = e.dataTransfer.getData("id")
  console.log("row dropped", draggedRowId)
  const draggedRow = document.getElementById(draggedRowId)
  e.target.appendChild(draggedRow)
}

rows.forEach((row) => {
  row.ondragstart = onDragRowStart
  row.ondragend = onDragRowEnd

  row.ondragover = onDragOver;
  row.ondrop = onDrop;
});

rowDrop.forEach((rowD) => {
  rowD.ondragover = onRowDragOver;
  rowD.ondrop = onRowDrop;
});
