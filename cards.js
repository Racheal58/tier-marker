const cards = document.querySelectorAll(".card");
const uploadFile = document.querySelector("#choose-files");

// Upload file from computer logic
const uploadFileToBank = (e) => {
  const card = createCard();
  const filesBank = document.querySelector(".files-bank");
  filesBank.appendChild(card);
  // display file bank when adding image
  filesBank.classList.add("show");
};

uploadFile.onclick = uploadFileToBank;

const createCard = (id, cardData) => {
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
  try {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/png,image/gif,image/jpeg,image/jpg");
    input.style.visibility = "hidden";
    input.onchange = () => {
      const image = new Image(82, 82);
      const firstImage = input.files[0];
      const fileName = document.querySelector("#uploaded-image-filename");
      fileName.innerHTML = firstImage.name;

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
        window.localStorage.setItem(
          "card_" + card.id,
          JSON.stringify(cardData)
        );
      };
      reader.readAsDataURL(firstImage);
    };
    input.click();
  } catch (error) {
    console.error("Failed to save rows to localStorage:", error);
    alert(
      "Failed to save image. Please clear localStorage or try using a different browser."
    );
  }
};

//TODO: check the issue with deleting cards;check
const deleteCard = (e) => {
  const onDeleteCard = window.confirm("Do you want to delete this file?");
  if (onDeleteCard) {
    e.target.remove();
    window.localStorage.removeItem(e.target.id);
  }
};

const onDragStart = (e) => {
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
