const cards = document.querySelectorAll(".card");
const uploadFile = document.querySelector("#choose-files");

// Upload file from computer logic
const uploadFileToBank = (e) => {
  console.log("try upload");

  const card = createCard();
  const filesBank = document.querySelector(".files-bank");
  filesBank.appendChild(card);
  // display file bank when adding image
  filesBank.classList.add("show");
};

uploadFile.onclick = uploadFileToBank;

const createCard = (id, cardData) => {
  console.log("try create");
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("draggable", "true");
  card.id = id || Date.now();
  card.ondragstart = onDragStart;
  card.ondragend = onDragEnd;
  card.onclick = deleteCard;
  if (cardData && cardData.imageSrc) {
    const image = new Image(82, 82);
    image.src = cardData.imageSrc;
    image.style.pointerEvents = "none";
    card.appendChild(image);
  } else {
    appendImage(card);
  }

  return card;
};

const appendImage = (card) => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/png,image/gif,image/jpeg,image/jpg");
  input.style.visibility = "hidden";
  input.onchange = () => {
    const image = new Image(82, 82);
    const firstImage = input.files[0];
    const fileName = document.querySelector("#uploaded-image-filename");
    fileName.innerHTML = firstImage.name;
    console.log(firstImage, firstImage.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      image.src = e.target.result;
      image.style.pointerEvents = "none";
      card.appendChild(image);

      // Save Data to Local Storage
      const cardData = {
        imageSrc: image.src,
        row: card.parentNode.querySelector(".label")?.innerText,
      };
      window.localStorage.setItem(card.id, JSON.stringify(cardData));
    };
    reader.readAsDataURL(firstImage);
  };
  input.click();
};

const deleteCard = (e) => {
  console.log("delete");
  const onDeleteCard = window.confirm("Do you want to delete this file?");
  if (onDeleteCard) {
    e.target.remove();
    window.localStorage.removeItem(e.target.id);
  }
};

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

// Logic when window first loads
window.onload = () => {
  const cardBank = document.querySelector(".files-bank");
  const keys = Object.keys(window.localStorage);

  keys.forEach((key) => {
    const cardData = JSON.parse(window.localStorage.getItem(key));
    const loadedCard = createCard(key, cardData);
    const rows = document.querySelectorAll(".tier-row");
    const correctRow = Array.from(rows).find((row) => {
      return row.querySelector(".label").innerText === cardData.row;
    });

    if (correctRow) {
      correctRow.appendChild(loadedCard);
    } else {
      cardBank.appendChild(loadedCard);
    }
  });

  // display file bank when adding image
  cardBank.classList.add("show");

  const rowData = JSON.parse(window.localStorage.getItem("rows"));
  //TODO: figure out why dialog still shows on the page after reloading
  const openDialog = document.querySelector("dialog");

  console.log("di", openDialog);
  if (openDialog && rowData) {
    openDialog.removeAttribute("open");
    const container = document.getElementById("tier-container");
    container.innerHTML = rowData.map((data) => data.html).join("");
  }

};
