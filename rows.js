const rows = document.querySelectorAll(".tier-row");
const rowConatiner = document.querySelector(".tier-container");

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

let draggedRow = null;

const onRowDragStart = (e) => {
  draggedRow = e.target
  e.dataTransfer.setData("text/plain", "");
}

const onRowDragOver = (e) => {
  e.preventDefault()
  const afterRow = getDragAfterRow(rowConatiner, e.clientY);
  // const currentRow = getDraggedRow(e.target)

  if (
    afterRow === null ||
    afterRow === draggedRow.nextSibling
  ) {
    return;
  }
  rowConatiner.insertBefore(draggedRow, afterRow);
}

const onRowDrop = (e) => {
  e.preventDefault()
}

const getDragAfterRow = (container, y) => {
  const draggableElements = [
    ...container.querySelectorAll(".tier-row"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY,
    }
  ).element;
}

// const getDraggedRow = (row) => {
//   while (!row.classList.contains("tier-row") && row.parentNode) {
//     row = row.parentNode;
//   }
//   return row;
// }

rowConatiner.addEventListener("dragstart", onRowDragStart);
rowConatiner.addEventListener("dragover", onRowDragOver);
rowConatiner.addEventListener("drop", onRowDrop);

rows.forEach((row) => {
  // row.ondragstart = onDragRowStart
  // row.ondragend = onDragRowEnd

  row.ondragover = onDragOver;
  row.ondrop = onDrop;
});
