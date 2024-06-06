// Function to attach event listeners
const attachEventListeners = () => {
  // Select all settings-gear icons and attach click event listener to each
  const settingsGearIcons = document.querySelectorAll("#settings-gear");
  settingsGearIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const dialog = icon.closest(".tier-row").querySelector("dialog");
      if (dialog) {
        dialog.setAttribute("open", true);
      }
    });
  });

  // Select all direction buttons and attach click event listener to each
  const directionButtons = document.querySelectorAll(
    ".direction-buttons button"
  );
  directionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const parentRow = button.closest(".tier-row");
      if (button.id === "direction-button-up") {
        moveRowUp(parentRow);
      } else if (button.id === "direction-button-down") {
        moveRowDown(parentRow);
      }
    });
  });

  // Add the event listener for closing dialogs
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("icon-tabler-x")) {
      const dialog = e.target.closest("dialog");
      if (dialog) {
        dialog.removeAttribute("open");
      }
    }
  });
};

const attachCardEventListeners = (card) => {
  card.ondragstart = onDragStart;
  card.ondragend = onDragEnd;
  card.onclick = deleteCard;
};

const loadRows = () => {
  const rowData = JSON.parse(window.localStorage.getItem("rows"));

  if (rowData) {
    const container = document.getElementById("tier-container");
    container.innerHTML = rowData.map((data) => data.html).join("");
    adjustContainerHeight(); // Call adjustContainerHeight after loading rows

    // Set label text and background color
    const rows = document.querySelectorAll(".tier-row");
    rows.forEach((row, index) => {
      const label = row.querySelector(".label");
      const savedData = rowData.find((data) => data.id === `row-${index}`);
      if (savedData) {
        // Set label text to default if saved text is empty
        const defaultText = label.textContent; // Retrieve default text from dataset
        label.textContent = savedData.labelText || defaultText;
        label.style.backgroundColor = savedData.labelColor;
      }
    });
  }

  const openDialogs = document.querySelectorAll("dialog[open]");
  openDialogs.forEach((dialog) => {
    dialog.removeAttribute("open");
  });

  // Attach event listeners for color spans and textarea
  const rows = document.querySelectorAll(".tier-row");
  rows.forEach((row) => {
    const colorSpans = row.querySelectorAll(".color-picker");
    const label = row.querySelector(".label");
    const textArea = row.querySelector(".label-input");

    colorSpans.forEach((span) => {
      span.addEventListener("click", () => {
        colorSpans.forEach((s) => s.classList.remove("selected-color"));
        span.classList.add("selected-color");

        const color = span.style.backgroundColor;
        label.style.backgroundColor = color;
        saveRows(); // Save rows after color change
      });
    });

    textArea.addEventListener("input", () => {
      label.textContent = textArea.value;
      saveRows(); // Save rows after text change
    });
  });
};

const loadCards = () => {
  const cardBank = document.querySelector(".files-bank");
  const keys = Object.keys(window.localStorage);
  const cardKeys = keys.filter((key) => key.startsWith("card_"));

  if (cardKeys.length > 0) {
    cardKeys.forEach((key) => {
      const cardId = key.replace("card_", ""); // Remove the "card_" prefix
      const cardData = JSON.parse(window.localStorage.getItem(key));
      const loadedCard = createCard(cardId, cardData);
      const rows = document.querySelectorAll(".tier-row");
      const correctRow = Array.from(rows).find((row) => {
        return row.querySelector(".label").innerText === cardData.row;
      });

      if (correctRow) {
        correctRow.appendChild(loadedCard);
        attachCardEventListeners(loadedCard); // Attach event listeners to the loaded card
      } else {
        cardBank.appendChild(loadedCard);
        attachCardEventListeners(loadedCard); // Attach event listeners to the loaded card
      }
    });
  }

  // display file bank when adding image
  cardBank.classList.add("show");
};

// Logic when window first loads
window.onload = () => {
  loadCards(); // Load cards from localStorage
  loadRows(); // Load rows from localStorage
  attachEventListeners(); // Attach event listeners
};
