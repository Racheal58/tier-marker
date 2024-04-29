const rows = document.querySelectorAll(".tier-row");
const rowContainer = document.querySelector(".tier-container");
const buttonUp = document.querySelectorAll("#direction-button-up");
const buttonDown = document.querySelectorAll("#direction-button-down");

const onDragOver = (e) => {
  e.preventDefault();
};

const onDrop = (e) => {
  e.preventDefault();
  const draggedCardId = e.dataTransfer.getData("id");
  const draggedCard = document.getElementById(draggedCardId);
  e.target.appendChild(draggedCard);

  console.log(`dragged, ${e.dataTransfer.getData("id")}`);
};

let draggedRow = null;

const onRowDragStart = (e) => {
  draggedRow = e.target;
  e.dataTransfer.setData("text/plain", "");
};

const onRowDragOver = (e) => {
  e.preventDefault();
  const afterRow = getDragAfterRow(rowContainer, e.clientY);
  // const currentRow = getDraggedRow(e.target)

  if (draggedRow && (afterRow === null || afterRow === draggedRow.nextSibling)) {
    return;
  }
  rowContainer.insertBefore(draggedRow, afterRow);
};

const onRowDrop = (e) => {
  e.preventDefault();
};

const getDragAfterRow = (container, y) => {
  const draggableElements = [...container.querySelectorAll(".tier-row")];

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
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
};

// const getDraggedRow = (row) => {
//   while (!row.classList.contains("tier-row") && row.parentNode) {
//     row = row.parentNode;
//   }
//   return row;
// }

// Move rows (tier-row) up or down with the arrows
function moveItemUp(item) {
  const currentItem = item.parentNode;
  const prevItem = currentItem.previousElementSibling;
  if (!prevItem) return; // If there's no previous item, exit

  rowContainer.insertBefore(currentItem, prevItem);
}

function moveItemDown(item) {
  const currentItem = item.parentNode;
  const nextItem = currentItem.nextElementSibling;
  if (!nextItem) return; // If there's no next item, exit

  rowContainer.insertBefore(currentItem, nextItem.nextElementSibling);
}

buttonUp.forEach((button) => {
  button.addEventListener("click", () => {
    const parentListItem = button.parentNode.parentNode;
    moveItemUp(parentListItem);
  });
});

buttonDown.forEach((button) => {
  button.addEventListener("click", () => {
    const parentListItem = button.parentNode.parentNode;
    moveItemDown(parentListItem);
  });
});

const eventListeners = [
  { event: "dragstart", handler: onRowDragStart },
  { event: "dragover", handler: onRowDragOver },
  { event: "drop", handler: onRowDrop }
];

eventListeners.forEach(({ event, handler }) => {
  rowContainer.addEventListener(event, handler);
});

rows.forEach((row) => {
  row.ondragover = onDragOver;
  row.ondrop = onDrop;
});
