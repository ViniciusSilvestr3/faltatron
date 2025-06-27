document.addEventListener("DOMContentLoaded", () => {
  // Configurações globais
  const allowedAbsences = 5;
  const CARDS_STORAGE_KEY = "faltatron_cards";

  // Elementos principais
  const cardsContainer = document.getElementById("cardsContainer");
  const addCardButton = document.getElementById("addCardButton");

  // Array para armazenar os dados dos cards
  let cardsData = [];

  // --- Funções de utilidade ---

  // Gerar ID único para cada card
  function generateCardId() {
    return "card_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  // Salvar todos os cards no localStorage
  function saveCardsToStorage() {
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cardsData));
  }

  // Carregar cards do localStorage
  function loadCardsFromStorage() {
    const savedCards = localStorage.getItem(CARDS_STORAGE_KEY);
    if (savedCards) {
      cardsData = JSON.parse(savedCards);
    } else {
      // Se não há cards salvos, criar um card inicial
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

  // --- Funções para gerenciar cards ---

  // Criar a estrutura HTML de um card
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
        
        <div class="card-buttons">
          <button class="btn btn-success add-absence-btn" ${
            remaining <= 0 ? 'style="display: none;"' : ""
          }>
            + Adicionar Falta
          </button>
        </div>
      </div>
    `;

    return cardDiv;
  }

  // Atualizar a exibição de um card específico
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

    // Atualizar valores
    totalAbsencesDisplay.textContent = cardData.totalAbsences;

    const remaining = Math.max(0, allowedAbsences - cardData.totalAbsences);
    remainingAbsencesDisplay.textContent = remaining;

    // Atualizar cores
    if (remaining <= 0) {
      remainingAbsencesDisplay.style.color = "red";
      addAbsenceButton.style.display = "none";
    } else if (remaining <= 3) {
      remainingAbsencesDisplay.style.color = "orange";
      addAbsenceButton.style.display = "inline-block";
    } else {
      remainingAbsencesDisplay.style.color = "#007bff";
      addAbsenceButton.style.display = "inline-block";
    }

    // Salvar no localStorage
    saveCardsToStorage();
  }

  // Adicionar falta a um card
  function addAbsence(cardId) {
    const cardData = cardsData.find((card) => card.id === cardId);

    if (cardData && cardData.totalAbsences < allowedAbsences) {
      cardData.totalAbsences++;

      // Verificar se chegou ao limite e mostrar alerta
      if (cardData.totalAbsences === allowedAbsences) {
        alert(
          `🚨 ATENÇÃO! Você atingiu ${allowedAbsences} faltas em ${cardData.subjectName}! TÁ DE DP PAIZÃO! 🚨`
        );
      }

      updateCardDisplay(cardId);
    }
  }

  // Atualizar nome da matéria
  function updateSubjectName(cardId, newName) {
    const cardData = cardsData.find((card) => card.id === cardId);
    if (cardData) {
      cardData.subjectName = newName.trim() || "Nome da Matéria";
      saveCardsToStorage();
    }
  }

  // Excluir um card (esconder com display: none)
  function deleteCard(cardId) {
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    if (cardElement) {
      cardElement.style.display = "none";

      // Também remover do array
      cardsData = cardsData.filter((card) => card.id !== cardId);
      saveCardsToStorage();
    }
  }

  // Adicionar novo card
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

  // Renderizar todos os cards
  function renderAllCards() {
    cardsContainer.innerHTML = "";

    cardsData.forEach((cardData) => {
      const cardElement = createCardHTML(cardData);
      cardsContainer.appendChild(cardElement);

      // Adicionar event listeners para este card
      const editableSubjectName = cardElement.querySelector(
        ".editable-subject-name"
      );
      const addAbsenceBtn = cardElement.querySelector(".add-absence-btn");
      const deleteBtn = cardElement.querySelector(".delete-card-btn");

      // Event listener para salvar o nome da matéria
      editableSubjectName.addEventListener("blur", () => {
        updateSubjectName(cardData.id, editableSubjectName.textContent);
      });

      // Event listener para o botão de adicionar falta
      addAbsenceBtn.addEventListener("click", () => addAbsence(cardData.id));

      // Event listener para o botão de excluir card
      deleteBtn.addEventListener("click", function () {
        deleteCard(cardData.id);
      });
    });
  }

  // --- Inicialização ---

  // Event listener para adicionar novo card
  addCardButton.addEventListener("click", addNewCard);

  // Carregar e renderizar cards
  loadCardsFromStorage();
  renderAllCards();
});
