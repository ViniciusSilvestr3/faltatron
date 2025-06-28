document.addEventListener("DOMContentLoaded", () => {
  const CARDS_STORAGE_KEY = "faltatron_cards";
  const ATTENDANCE_STORAGE_KEY = "faltatron_attendance_percentage";
  const cardsContainer = document.getElementById("cardsContainer");
  const addCardButton = document.getElementById("addCardButton");
  const attendanceInput = document.getElementById("attendancePercentage");
  let cardsData = [];

  function getMaxAbsences(totalClasses = 20) {
    const attendancePercentage = parseInt(attendanceInput.value) || 75;
    const maxAbsences = Math.floor(
      (totalClasses * (100 - attendancePercentage)) / 100
    );
    return Math.max(1, maxAbsences);
  }

  function saveAttendancePercentage() {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, attendanceInput.value);
  }

  function loadAttendancePercentage() {
    const saved = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (saved) {
      attendanceInput.value = saved;
    }
  }

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
          subjectName: "📝 Clique para editar o nome da matéria",
          totalAbsences: 0,
          totalClasses: 20,
        },
      ];
      saveCardsToStorage();
    }
  }

  function createCardHTML(cardData) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.dataset.cardId = cardData.id;

    // Adicionar classe para animação de entrada se for um novo card
    if (cardData.isNew) {
      cardDiv.classList.add("new-card");
      delete cardData.isNew;
    }

    const totalClasses = cardData.totalClasses || 20;
    const allowedAbsences = getMaxAbsences(totalClasses);
    const remaining = Math.max(0, allowedAbsences - cardData.totalAbsences);
    const attendedClasses = totalClasses - cardData.totalAbsences;
    const currentPercentage =
      totalClasses > 0
        ? ((attendedClasses / totalClasses) * 100).toFixed(1)
        : 100;
    const requiredPercentage = parseInt(attendanceInput.value) || 75;

    let remainingColor = "#007bff";
    let percentageColor = "#28a745";

    // Adicionar destaque visual se estiver próximo do limite
    if (remaining <= 2 && remaining > 0) {
      cardDiv.classList.add("warning-highlight");
    }

    if (remaining <= 0) {
      remainingColor = "red";
      percentageColor = "red";
    } else if (remaining <= 3) {
      remainingColor = "orange";
      percentageColor = "orange";
    }

    if (parseFloat(currentPercentage) < requiredPercentage) {
      percentageColor = "red";
    }

    cardDiv.innerHTML = `
      <button class="delete-card-btn" title="Excluir matéria">×</button>
      <h2 contenteditable="true" class="editable-subject-name" title="Clique para editar o nome da matéria" data-placeholder="Clique para editar...">${
        cardData.subjectName
      }</h2>
      <span class="divisoria"></span>
      <div class="card-content">
        <div class="total-classes-input">
          <label>Total de aulas:</label>
          <input type="number" class="total-classes-field" value="${totalClasses}" min="1" max="100">
        </div>
        <div class="attendance-info">
          <div class="percentage-display">
            <span>Presença atual: </span>
            <span class="current-percentage" style="color: ${percentageColor}; font-weight: bold;">${currentPercentage}%</span>
            <span class="required-info">(mín: ${requiredPercentage}%)</span>
          </div>
        </div>
        <div>
          <span>Número total de faltas: </span>
          <span class="total-absences-display">${cardData.totalAbsences}</span>
        </div>
        <p>Número de faltas que sobraram: </p>
        <p class="remaining-absences-display" style="color: ${remainingColor}">${remaining}</p>
    ${
      cardData.totalAbsences >= allowedAbsences
        ? '<span class="dpcheck">Mais uma é DP paizão...</span>'
        : ""
    }
        <div class="card-buttons">
          <div class="absence-input-group">
            <input type="number" class="absence-quantity" value="1" min="1" max="10" title="Número de faltas para adicionar">
            <button class="btn btn-success add-absence-btn">+ Adicionar Falta(s)</button>
          </div>
        </div>
      </div>`;
    return cardDiv;
  }

  function updateCardDisplay(cardId) {
    const cardData = cardsData.find((card) => card.id === cardId);
    if (!cardData) return;
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    if (!cardElement) return;
    const totalClasses = cardData.totalClasses || 20;
    const allowedAbsences = getMaxAbsences(totalClasses);
    const attendedClasses = totalClasses - cardData.totalAbsences;
    const currentPercentage =
      totalClasses > 0
        ? ((attendedClasses / totalClasses) * 100).toFixed(1)
        : 100;
    const requiredPercentage = parseInt(attendanceInput.value) || 75;

    const totalAbsencesDisplay = cardElement.querySelector(
      ".total-absences-display"
    );
    const remainingAbsencesDisplay = cardElement.querySelector(
      ".remaining-absences-display"
    );
    const addAbsenceButton = cardElement.querySelector(".add-absence-btn");
    const currentPercentageDisplay = cardElement.querySelector(
      ".current-percentage"
    );
    const requiredInfo = cardElement.querySelector(".required-info");

    totalAbsencesDisplay.textContent = cardData.totalAbsences;
    const remaining = Math.max(0, allowedAbsences - cardData.totalAbsences);
    remainingAbsencesDisplay.textContent = remaining;

    if (currentPercentageDisplay) {
      currentPercentageDisplay.textContent = `${currentPercentage}%`;
    }

    if (requiredInfo) {
      requiredInfo.textContent = `(mín: ${requiredPercentage}%)`;
    }

    // Atualizar cores da porcentagem
    if (currentPercentageDisplay) {
      if (parseFloat(currentPercentage) < requiredPercentage) {
        currentPercentageDisplay.style.color = "red";
      } else if (remaining <= 3) {
        currentPercentageDisplay.style.color = "orange";
      } else {
        currentPercentageDisplay.style.color = "#28a745";
      }
    }

    if (cardData.totalAbsences >= allowedAbsences) {
      remainingAbsencesDisplay.style.color = "red";
    } else if (remaining <= 3) {
      remainingAbsencesDisplay.style.color = "orange";
      addAbsenceButton.style.display = "inline-block";
    } else {
      remainingAbsencesDisplay.style.color = "#007bff";
      addAbsenceButton.style.display = "inline-block";
    }
    saveCardsToStorage();
  }

  function addAbsence(cardId, quantity = 1) {
    const cardData = cardsData.find((card) => card.id === cardId);
    if (cardData) {
      const totalClasses = cardData.totalClasses || 20;
      const allowedAbsences = getMaxAbsences(totalClasses);
      const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);

      // Verificar se já está no limite
      if (cardData.totalAbsences >= allowedAbsences) {
        alert(
          `🚨 ATENÇÃO! Você já atingiu o limite de ${allowedAbsences} faltas em ${cardData.subjectName}! MAIS UMA É DP PAIZÃO! 🚨`
        );
        return;
      }

      // Verificar se a quantidade solicitada não ultrapassa o limite
      const remainingAbsences = allowedAbsences - cardData.totalAbsences;
      if (quantity > remainingAbsences) {
        const confirmAdd = confirm(
          `⚠️ ATENÇÃO! Você está tentando adicionar ${quantity} faltas, mas só pode adicionar ${remainingAbsences} em ${cardData.subjectName} antes da DP.\n\nDeseja adicionar apenas ${remainingAbsences} falta(s)?`
        );
        if (confirmAdd) {
          cardData.totalAbsences += remainingAbsences;
        } else {
          return;
        }
      } else {
        cardData.totalAbsences += quantity;
      }

      // Adicionar feedback visual
      if (cardElement) {
        // Efeito de sucesso temporário
        cardElement.classList.add("success-highlight");
        setTimeout(() => {
          cardElement.classList.remove("success-highlight");
        }, 1000);

        // Animação no botão
        const addBtn = cardElement.querySelector(".add-absence-btn");
        if (addBtn) {
          addBtn.classList.add("interactive-element");
        }
      }

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

  function updateTotalClasses(cardId, totalClasses) {
    const cardData = cardsData.find((card) => card.id === cardId);
    if (cardData) {
      cardData.totalClasses = parseInt(totalClasses) || 20;
      saveCardsToStorage();
      updateCardDisplay(cardId);
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
      subjectName: "📝 Clique para editar o nome da matéria",
      totalAbsences: 0,
      totalClasses: 20,
      isNew: true, // Marca como novo para animação
    };
    cardsData.push(newCard);
    saveCardsToStorage();
    renderAllCards();

    // Adicionar um pequeno delay para a animação
    setTimeout(() => {
      const newCardElement = document.querySelector(
        `[data-card-id="${newCard.id}"]`
      );
      if (newCardElement) {
        newCardElement.classList.add("interactive-element");
        // Dar foco ao campo de nome para edição imediata
        const nameField = newCardElement.querySelector(
          ".editable-subject-name"
        );
        if (nameField) {
          nameField.focus();
          // Selecionar todo o texto placeholder
          const range = document.createRange();
          range.selectNodeContents(nameField);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }, 100);
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
      const totalClassesInput = cardElement.querySelector(
        ".total-classes-field"
      );
      const absenceQuantityInput =
        cardElement.querySelector(".absence-quantity");

      editableSubjectName.addEventListener("blur", () => {
        updateSubjectName(cardData.id, editableSubjectName.textContent);
      });
      addAbsenceBtn.addEventListener("click", () => {
        const quantity = parseInt(absenceQuantityInput.value) || 1;
        addAbsence(cardData.id, quantity);
      });
      deleteBtn.addEventListener("click", function () {
        deleteCard(cardData.id);
      });
      totalClassesInput.addEventListener("change", () => {
        updateTotalClasses(cardData.id, totalClassesInput.value);
      });
    });
  }

  addCardButton.addEventListener("click", addNewCard);

  attendanceInput.addEventListener("change", () => {
    saveAttendancePercentage();
    renderAllCards(); // Re-renderizar para atualizar os cálculos
  });

  loadAttendancePercentage();
  loadCardsFromStorage();
  renderAllCards();

  // Controle do modal de doação
  const donationBox = document.getElementById("donationBox");
  const donationModal = document.getElementById("donationModal");
  const closeModal = document.getElementById("closeModal");

  // Abrir modal ao clicar na caixa de doação
  donationBox.addEventListener("click", () => {
    donationModal.classList.add("show");
    document.body.style.overflow = "hidden"; // Impede scroll do body
  });

  // Fechar modal ao clicar no X
  closeModal.addEventListener("click", () => {
    donationModal.classList.remove("show");
    document.body.style.overflow = "auto"; // Restaura scroll do body
  });

  // Fechar modal ao clicar fora do conteúdo
  donationModal.addEventListener("click", (e) => {
    if (e.target === donationModal) {
      donationModal.classList.remove("show");
      document.body.style.overflow = "auto";
    }
  });

  // Fechar modal com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && donationModal.classList.contains("show")) {
      donationModal.classList.remove("show");
      document.body.style.overflow = "auto";
    }
  });

  // Melhorias de interação e experiência do usuário
  // Adicionar efeito de sombra dinâmica baseada na posição do mouse
  function addDynamicShadow(element) {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const shadowX = -x / 10;
      const shadowY = -y / 10;

      element.style.boxShadow = `
        ${shadowX}px ${shadowY}px 30px rgba(102, 126, 234, 0.3),
        0 8px 32px rgba(0, 0, 0, 0.1)
      `;
    });

    element.addEventListener("mouseleave", () => {
      element.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
    });
  }

  // Aplicar efeito de sombra dinâmica em cards
  function applyDynamicEffects() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      if (!card.hasAttribute("data-dynamic-shadow")) {
        addDynamicShadow(card);
        card.setAttribute("data-dynamic-shadow", "true");
      }
    });
  }

  // Observer para novos cards
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        applyDynamicEffects();
      }
    });
  });

  // Observar mudanças no container de cards
  const cardsContainerElement = document.getElementById("cardsContainer");
  if (cardsContainerElement) {
    observer.observe(cardsContainerElement, { childList: true, subtree: true });
  }

  // Aplicar efeitos iniciais
  applyDynamicEffects();

  // Melhorar feedback tátil para todos os elementos interativos
  function enhanceInteractiveElements() {
    const interactiveElements = document.querySelectorAll(
      'button, input, [contenteditable="true"]'
    );
    interactiveElements.forEach((element) => {
      if (!element.classList.contains("interactive-element")) {
        element.classList.add("interactive-element");
      }
    });
  }

  // Aplicar melhorias periodicamente para elementos criados dinamicamente
  setInterval(enhanceInteractiveElements, 1000);

  // Efeito de digitação mais suave para campos editáveis
  document.addEventListener("input", (e) => {
    if (e.target.contentEditable === "true") {
      e.target.style.transform = "scale(1.01)";
      setTimeout(() => {
        e.target.style.transform = "";
      }, 150);
    }
  });

  // Melhorar navegação por teclado
  document.addEventListener("keydown", (e) => {
    // Enter em campos editáveis para confirmar edição
    if (e.key === "Enter" && e.target.contentEditable === "true") {
      e.target.blur();
    }

    // Tab navigation melhorada
    if (e.key === "Tab") {
      const focusedElement = document.activeElement;
      if (
        focusedElement &&
        focusedElement.classList.contains("interactive-element")
      ) {
        focusedElement.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.5)";
        setTimeout(() => {
          focusedElement.style.boxShadow = "";
        }, 300);
      }
    }
  });

  // Animação suave para scroll
  if (window.scrollTo) {
    const originalScrollTo = window.scrollTo;
    window.scrollTo = function (x, y) {
      if (typeof x === "object") {
        return originalScrollTo.call(this, { ...x, behavior: "smooth" });
      }
      return originalScrollTo.call(this, {
        left: x,
        top: y,
        behavior: "smooth",
      });
    };
  }

  // Feedback visual para ações de salvamento
  function showSaveIndicator() {
    const header = document.querySelector(".header");
    if (header) {
      const indicator = document.createElement("div");
      indicator.textContent = "💾 Salvo automaticamente";
      indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(40, 167, 69, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
      `;

      document.body.appendChild(indicator);

      setTimeout(() => {
        indicator.style.opacity = "1";
        indicator.style.transform = "translateX(0)";
      }, 10);

      setTimeout(() => {
        indicator.style.opacity = "0";
        indicator.style.transform = "translateX(100px)";
        setTimeout(() => {
          document.body.removeChild(indicator);
        }, 300);
      }, 2000);
    }
  }

  // Interceptar chamadas de localStorage para mostrar indicador
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    const result = originalSetItem.call(this, key, value);
    if (key.includes("faltatron")) {
      showSaveIndicator();
    }
    return result;
  };
});
