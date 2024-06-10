const rows = document.querySelectorAll(".tier-row");
const rowContainer = document.querySelector(".tier-container");
const buttonUp = document.querySelectorAll("#direction-button-up");
const buttonDown = document.querySelectorAll("#direction-button-down");

const onDragOver = (e) => {
  e.preventDefault();
};

const onDrop = (e) => {
  try {
    e.preventDefault();
    const draggedCardId = e.dataTransfer.getData("id");
    const draggedCard = document.getElementById(draggedCardId);

    const cardData = {
      imageSrc: draggedCard.querySelector("img").src,
      row: e.target.previousElementSibling.innerText,
    };

    window.localStorage.setItem(
      "card_" + draggedCard.id,
      JSON.stringify(cardData)
    );

    e.target.appendChild(draggedCard);
  } catch (error) {
    console.error("Failed to save rows to localStorage:", error);
    alert(
      "Failed to save Image. Please clear localStorage or try using a different browser."
    );
  }
};

// Attach event listener for drop event on the parent container
rowContainer.addEventListener("drop", onDrop);

// Attach event listener for dragover event on the parent container
rowContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});

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

//TODO: change to arrow functions;check
// Move rows (tier-row) up or down with the arrows
const moveRowUp = (row) => {
  const prevRow = row.previousElementSibling;
  if (!prevRow) return; // If there's no previous item, exit

  row.parentNode.insertBefore(row, prevRow);
  saveRows(); // Save updated rows to local storage
}

const moveRowDown = (row) => {
  const nextRow = row.nextElementSibling;
  if (!nextRow) return; // If there's no next item, exit

  row.parentNode.insertBefore(nextRow, row);
  saveRows(); // Save updated rows to local storage
}

const adjustContainerHeight = () => {
  // Calculate the total height of the remaining rows
  let totalHeight = 0;
  document.querySelectorAll(".tier-row").forEach((row) => {
    totalHeight += row.offsetHeight;
  });

  // Set the height of the tier-container element
  rowContainer.style.height = `${totalHeight}px`;
};

const deleteRow = (row) => {
  const rowId = row.dataset.id; // Assuming the unique ID is stored in the dataset

  const onDeleteRow = window.confirm("Do you want to delete this Row?");
  if (onDeleteRow) {
    row.remove();
    window.localStorage.removeItem(rowId);
    saveRows(); // Save updated rows to local storage
    adjustContainerHeight();
  }
};

// Select all arrow buttons
const allArrowButtons = document.querySelectorAll(
  ".tier-row .direction-buttons button"
);

// Attach event listeners to all arrow buttons
allArrowButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const parentRow = button.closest(".tier-row");
    if (button.id === "direction-button-up") {
      moveRowUp(parentRow);
    } else if (button.id === "direction-button-down") {
      moveRowDown(parentRow);
    }
  });
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

const clearAllImages = (images, clearButton) => {
  const onDeleteRow = window.confirm(
    "Do you want to delete images in this Row?"
  );
  if (onDeleteRow) {
    images.forEach((image) => {
      image.remove();
    });
    if (images.length === 0) {
      clearButton.setAttribute("disabled", true);
    } else {
      clearButton.removeAttribute("disabled");
    }
  }
};

rowContainer.addEventListener("click", (e) => {
  const clearButton = e.target.closest(".clear-button");
  if (clearButton) {
    const row = clearButton.closest(".tier-row");
    const cards = row.querySelectorAll(".card");
    if (cards.length > 0) {
      clearAllImages(cards, clearButton);
    }
  }
});

const createDialog = (row) => {
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
      <h3>Choose a Label Background Color:</h3>
      <div class="color-container">
        <span style="background-color: #FF7F7F;" class="color-picker"></span>
        <span style="background-color: #FFBF7F;" class="color-picker"></span>
        <span style="background-color: #FFDF7F;" class="color-picker"></span>
        <span style="background-color: #FFFF7F;" class="color-picker"></span>
        <span style="background-color: #BFFF7F;" class="color-picker"></span>
        <span style="background-color: #7FFF7F;" class="color-picker"></span>
        <span style="background-color: #7FFFFF;" class="color-picker"></span>
        <span style="background-color: #7FBFFF;" class="color-picker"></span>
        <span style="background-color: #7F7FFF;" class="color-picker"></span>
        <span style="background-color: #FF7FFF;" class="color-picker"></span>
        <span style="background-color: #BF7FBF;" class="color-picker"></span>
        <span style="background-color: #3B3B3B;" class="color-picker"></span>
        <span style="background-color: #858585;" class="color-picker"></span>
        <span style="background-color: #CFCFCF;" class="color-picker"></span>
        <span style="background-color: #F7F7F7;" class="color-picker"></span>
      </div>
      <h4>Edit Label Text Below:</h4>
      <textarea class="label-input">${label.innerText}</textarea>
      <span class="button-container">
        <button class="delete-button">Delete Row</button>
        <button class="clear-button">Clear Row Images</button>
      </span>
      <span class="button-container">
        <button id="add-button-above">Add a Row Above</button>
        <button id="add-button-below">Add a Row Below</button>
      </span>
    </div>
  `;

  // Add the dialog to the tier row
  row.appendChild(dialog);

  const closeButton = dialog.querySelector(".close-button");

  showButton.addEventListener("click", () => {
    // dialog.showModal();
    dialog.setAttribute("open", true);
  });

  closeButton.addEventListener("click", () => {
    // dialog.close();
    dialog.removeAttribute("open");
  });

  // Add event listener to label & textarea when content changes
  const textArea = dialog.querySelector(".label-input");

  label.addEventListener("input", () => {
    // Update the value of the textarea with the content of the label div
    textArea.value = label.textContent;
  });

  textArea.addEventListener("input", () => {
    // Update the content of the label div with the value of the textarea
    label.textContent = textArea.value;
  });

  // Color picker for tier labels
  const colorSpans = row.querySelectorAll(".color-picker");

  colorSpans.forEach((span) => {
    span.addEventListener("click", () => {
      // Remove the selected-color class from all spans
      colorSpans.forEach((s) => s.classList.remove("selected-color"));
      // Add the selected-color class to the clicked span
      span.classList.add("selected-color");

      const color = span.style.backgroundColor;
      label.style.backgroundColor = color;
    });
  });
};

const addRow = (position, referenceRow) => {
  const tierRow = document.createElement("div");
  tierRow.classList.add("tier-row");
  tierRow.innerHTML = `
    <div class="label" contenteditable="true">NEW</div>
    <div class="sort"></div>
    <div class="settings-control">
      <div class="setting">
        <svg
          id="settings-gear"
          class="icon icon-tabler icon-tabler-settings-filled"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#ffffff"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z"
            stroke-width="0"
            fill="currentColor"
          />
        </svg>
      </div>
      <div class="setting direction-buttons">
        <button id="direction-button-up">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-arrow-badge-up-filled"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#000000"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M11.375 6.22l-5 4a1 1 0 0 0 -.375 .78v6l.006 .112a1 1 0 0 0 1.619 .669l4.375 -3.501l4.375 3.5a1 1 0 0 0 1.625 -.78v-6a1 1 0 0 0 -.375 -.78l-5 -4a1 1 0 0 0 -1.25 0z"
              stroke-width="0"
              fill="currentColor"
            />
          </svg>
        </button>
  
        <button id="direction-button-down">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-arrow-badge-down-filled"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#000000"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M16.375 6.22l-4.375 3.498l-4.375 -3.5a1 1 0 0 0 -1.625 .782v6a1 1 0 0 0 .375 .78l5 4a1 1 0 0 0 1.25 0l5 -4a1 1 0 0 0 .375 -.78v-6a1 1 0 0 0 -1.625 -.78z"
              stroke-width="0"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  `;
  rowContainer.appendChild(tierRow);

  // Add event listeners for newly created rows arrow buttons
  const buttonUp = tierRow.querySelector("#direction-button-up");
  const buttonDown = tierRow.querySelector("#direction-button-down");

  buttonUp.addEventListener("click", () => {
    moveRowUp(tierRow);
  });

  buttonDown.addEventListener("click", () => {
    moveRowDown(tierRow);
  });

  if (position === "above") {
    referenceRow.insertAdjacentElement("beforebegin", tierRow);
  } else if (position === "below") {
    referenceRow.insertAdjacentElement("afterend", tierRow);
  }

  adjustContainerHeight();

  // Call attachEventListeners() after adding a new row
  attachEventListeners();

  const Dialog = createDialog(tierRow);

  return Dialog;
};

// Function to save row data to localStorage
const saveRows = () => {
  try {
    // Redefined this so it will add all(from HTML file & dynamically created) the rows to localstorage
    const rows = document.querySelectorAll(".tier-row");
    const rowData = [];
    rows.forEach((row, index) => {
      // Generate a unique ID for each row
      const rowId = `row-${index}`;

      // Get label text and background color
      const label = row.querySelector(".label");
      const labelColor = label.style.backgroundColor;
      const labelText = label.textContent;

      // Update the label color and text in the row's data object
      const rowOldData = JSON.parse(window.localStorage.getItem(rowId)) || {};

      rowData.push({
        id: rowId,
        html: row.outerHTML,
        position: index,
        labelColor: labelColor || rowOldData.labelColor || "",
        labelText: labelText || rowOldData.labelText || "",
      });
    });

    window.localStorage.setItem("rows", JSON.stringify(rowData));
  } catch (error) {
    console.error("Failed to save rows to localStorage:", error);
    alert(
      "Failed to save rows. Please clear localStorage or try using a different browser."
    );
  }
};

document.addEventListener("click", (e) => {
  const addButtonAbove = e.target.closest("#add-button-above");
  const addButtonBelow = e.target.closest("#add-button-below");

  if (addButtonAbove) {
    const row = e.target.closest(".tier-row");
    addRow("above", row);
    saveRows(); // Save rows after adding a new row
  } else if (addButtonBelow) {
    const row = e.target.closest(".tier-row");
    addRow("below", row);
    saveRows(); // Save rows after adding a new row
  }
});

rows.forEach((row) => {
  row.ondragover = onDragOver;
  row.ondrop = onDrop;

  //TODO: style the modal:check, include fields needed (deleting rows:check, creating rows, clearing all images:check, disable clear image button when row is empty:check, adding rows:check:;add rows above or below:check), update label text:check and color:check
  const Dialog = createDialog(row);

  return Dialog;
});
