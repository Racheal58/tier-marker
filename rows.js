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

//TODO: figure out row drag and drop
let draggedRow = null;

const onRowDragStart = (e) => {
  draggedRow = e.target;
  e.dataTransfer.setData("text/plain", "");
};

const onRowDragOver = (e) => {
  e.preventDefault();
  const afterRow = getDragAfterRow(rowContainer, e.clientY);
  // const currentRow = getDraggedRow(e.target)

  if (
    draggedRow &&
    (afterRow === null || afterRow === draggedRow.nextSibling)
  ) {
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
function moveRowUp(row) {
  const currentRow = row.parentNode;
  const prevRow = currentRow.previousElementSibling;
  if (!prevRow) return; // If there's no previous item, exit

  rowContainer.insertBefore(currentRow, prevRow);
}

function moveRowDown(row) {
  const currentRow = row.parentNode;
  const nextRow = currentRow.nextElementSibling;
  if (!nextRow) return; // If there's no next item, exit

  rowContainer.insertBefore(currentRow, nextRow.nextElementSibling);
}

const deleteRow = (row) => {
  const onDeleteRow = window.confirm("Do you want to delete this Row?");
  if (onDeleteRow) {
    row.remove();
  }
}

buttonUp.forEach((button) => {
  button.addEventListener("click", () => {
    const parentListItem = button.parentNode.parentNode;
    moveRowUp(parentListItem);
  });
});

buttonDown.forEach((button) => {
  button.addEventListener("click", () => {
    const parentListItem = button.parentNode.parentNode;
    moveRowDown(parentListItem);
  });
});

rowContainer.addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("delete-button")) {
    const row = target.closest(".tier-row");
    deleteRow(row);
  }
});

const eventListeners = [
  { event: "dragstart", handler: onRowDragStart },
  { event: "dragover", handler: onRowDragOver },
  { event: "drop", handler: onRowDrop },
];

eventListeners.forEach(({ e, handler }) => {
  rowContainer.addEventListener(e, handler);
});

// Add event listener for delete buttons using event delegation
rowContainer.addEventListener("click", (e) => {
  const deleteButton = e.target.closest(".delete-button");
  if (deleteButton) {
    const row = deleteButton.closest(".tier-row");
    deleteRow(row);
  }
});

rows.forEach((row) => {
  row.ondragover = onDragOver;
  row.ondrop = onDrop;

  //TODO: style the modal:check, include fields needed (deleting rows, creating rows, clearing all images, add rows above or below), update label text and color
  const dialog = document.createElement("dialog");
  const showButton = row.querySelector("#settings-gear");
  const label = row.querySelector(".label");
  
  dialog.innerHTML = `
  <div class="modal-container">
  <span class="close-button">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="icon icon-tabler icon-tabler-x"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="#000000"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  </span>
  <h4>Edit Label Text Below:</h4>
  <textarea>${label.textContent}</textarea>
  <span class="button-container">
    <button class="delete-button">Delete Row</button>
    <button>Clear Row Images</button>
  </span>
  <span class="button-container">
    <button>Add a Row Above</button>
    <button>Add a Row Below</button>
  </span>
</div>
  `;

  // Add the dialog to the tier row
  row.appendChild(dialog);

  const closeButton = dialog.querySelector(".close-button");

  showButton.addEventListener("click", () => {
    dialog.showModal();
  });

  closeButton.addEventListener("click", () => {
    dialog.close();
  });
});
