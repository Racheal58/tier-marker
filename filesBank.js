const bank = document.querySelector('.files-bank')

const onDropCard = (e) => {
  const id = e.dataTransfer.getData('id')
  bank.appendChild(document.getElementById(id))
}

bank.ondrop = onDropCard
bank.ondragover = (e) => e.preventDefault()