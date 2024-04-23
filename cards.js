const cards = document.querySelectorAll(".card");
const uploadFile = document.querySelector("#choose-files");

// Upload file from computer logic
const uploadFileToBank = (e) => {
  console.log("try upload");

  const card = createCard();
  const filesBank = document.querySelector(".files-bank");
  filesBank.appendChild(card);
  // display file bank when adding image
  filesBank.classList.add("show")
};

uploadFile.onclick = uploadFileToBank;

const createCard = () => {
  console.log("try create");
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("draggable", "true");
  card.id = Date.now();
  card.ondragstart = onDragStart;
  card.ondragend = onDragEnd;
  card.onclick = deleteCard;
  appendImage(card);

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
