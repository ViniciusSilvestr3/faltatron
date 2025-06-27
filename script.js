
document.addEventListener("DOMContentLoaded", () => {
  const allowedAbsences = 5;
  const CARDS_STORAGE_KEY = "faltatron_cards";
  const cardsContainer = document.getElementById("cardsContainer");
  const addCardButton = document.getElementById("addCardButton");
  let cardsData = [];

  function generateCardId() {
    return "card_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  function saveCardsToStorage() {
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cardsData));
  }

  function loadCardsFromStorage() {
    const savedCards = localStorage.getItem(CARDS_STORAGE_KEY);
    if (savedCards) {
      cardsData = JSON.parse(savedCards);
    } else {
      cardsData = [
        {
          id: generateCardId(),
          subjectName: "Nome da Matéria",
          totalAbsences: 0,
        },
      ];
      saveCardsToStorage();
    }
  }

  function createCardHTML(cardData) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.dataset.cardId = cardData.id;
    const remaining = Math.max(0, allowedAbsences - cardData.totalAbsences);
    let remainingColor = "#007bff";
    if (remaining <= 0) remainingColor = "red";
    else if (remaining <= 3) remainingColor = "orange";
    cardDiv.innerHTML = `
      <button class="delete-card-btn" title="Excluir matéria">×</button>
      <h2 contenteditable="true" class="editable-subject-name">${
        cardData.subjectName
      }</h2>
      <span class="divisoria"></span>
      <div class="card-content">
        <div>
          <span>Número total de faltas: </span>
          <span class="total-absences-display">${cardData.totalAbsences}</span>
        </div>
        <p>Número de faltas que sobraram: </p>
        <p class="remaining-absences-display" style="color: ${remainingColor}">${remaining}</p>
    ${ cardData.totalAbsences >= allowedAbsences?'<span class="dpcheck">Mais uma é DP paizão...</span>': ''}
        <div class="card-buttons">
          <button class="btn btn-success add-absence-btn" >+ Adicionar Falta</button>
        </div>
      </div>`;
    return cardDiv;
  }

  function updateCardDisplay(cardId) {
    const cardData = cardsData.find((card) => card.id === cardId);
    if (!cardData) return;
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    if (!cardElement) return;
    const totalAbsencesDisplay = cardElement.querySelector(
      ".total-absences-display"
    );
    const remainingAbsencesDisplay = cardElement.querySelector(
      ".remaining-absences-display"
    );
    const addAbsenceButton = cardElement.querySelector(".add-absence-btn");
    totalAbsencesDisplay.textContent = cardData.totalAbsences;
    const remaining = Math.max(0, allowedAbsences - cardData.totalAbsences);
    remainingAbsencesDisplay.textContent = remaining;
    if (cardData.totalAbsences >= allowedAbsences) {
      remainingAbsencesDisplay.style.color = "red";
      
      // const dpCheck = document.createElement("span");
      // dpCheck.className = "dpcheck";
      // dpCheck.textContent = "Mais uma é DP paizão...";
      // cardElement.appendChild(dpCheck);
      // cardElement.removeChild(addAbsenceButton);  
  
    } else if (remaining <= 3) {
      remainingAbsencesDisplay.style.color = "orange";
      addAbsenceButton.style.display = "inline-block";
    } else {
      remainingAbsencesDisplay.style.color = "#007bff";
      addAbsenceButton.style.display = "inline-block";
    }

    saveCardsToStorage();
  }

  function addAbsence(cardId) {
    const cardData = cardsData.find((card) => card.id === cardId);
    if (cardData) {
      if (cardData.totalAbsences >= allowedAbsences) {
        alert(
          `🚨 ATENÇÃO! Você já atingiu o limite de ${allowedAbsences} faltas em ${cardData.subjectName}! MAIS UMA É DP PAIZÃO! 🚨`
        );
        return;
      }
      cardData.totalAbsences++;
      updateCardDisplay(cardId);
    }
  }

  function updateSubjectName(cardId, newName) {
    const cardData = cardsData.find((card) => card.id === cardId);
    if (cardData) {
      cardData.subjectName = newName.trim() || "Nome da Matéria";
      saveCardsToStorage();
    }
  }

  function deleteCard(cardId) {
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    if (cardElement) {
      cardElement.style.display = "none";
      cardsData = cardsData.filter((card) => card.id !== cardId);
      saveCardsToStorage();
    }
  }

  function addNewCard() {
    const newCard = {
      id: generateCardId(),
      subjectName: "Nova Matéria",
      totalAbsences: 0,
    };
    cardsData.push(newCard);
    saveCardsToStorage();
    renderAllCards();
  }

  function renderAllCards() {
    cardsContainer.innerHTML = "";
    cardsData.forEach((cardData) => {
      const cardElement = createCardHTML(cardData);
      cardsContainer.appendChild(cardElement);
      const editableSubjectName = cardElement.querySelector(
        ".editable-subject-name"
      );
      const addAbsenceBtn = cardElement.querySelector(".add-absence-btn");
      const deleteBtn = cardElement.querySelector(".delete-card-btn");
      editableSubjectName.addEventListener("blur", () => {
        updateSubjectName(cardData.id, editableSubjectName.textContent);
      });
      addAbsenceBtn.addEventListener("click", () => addAbsence(cardData.id));
      deleteBtn.addEventListener("click", function () {
        deleteCard(cardData.id);
      });
    });
  }

  addCardButton.addEventListener("click", addNewCard);
  loadCardsFromStorage();
  renderAllCards();
});
