// Seleção de Elementos do DOM
const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn"); // finalizar pedido
const closeModalBtn = document.getElementById("close-modal-btn"); // fechar modal
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Event Listeners
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";
  updateCartModal();
});

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
    updateCartModal();
  }
});

// Funções de Manipulação do Carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  // se já tem o item
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    // se não tem o item
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
    <div class= "flex items-center justify-between"> 

      <div>
        <p class="font-medium">${item.name}</p>
        <p>Qtd ${item.quantity}</p>
        <p class="font-medium">R$ ${item.price.toFixed(2)}</p>
      </div>
    
      <button class="remove-from-cart-btn" data-name="${
        item.name
      }">Remover</button>

    </div>
    `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    // preciso verificar se o item já existe para remover a quantidade
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.splice(index, 1);
    }

    updateCartModal();
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

// Finalização do Pedido
checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    // Notificação se o restaurante estiver fechado
    Toastify({
      text: "Ops... o restaurente está fechado!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#f50c0c",
      },
    }).showToast();

    return;
  }

  if (cart.length === 0) return;

  if (addressInput.value === "") {
    // Notificação se nenhum endereço for fornecido
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  // Enviar pedido via WhatsApp
  const cartItems = cart
    .map((item) => {
      return `${item.name} Quantidade: ${item.quantity} Preço: R$${item.price} |`;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "5581999400288";

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank"
  );

  // Limpar o carrinho após o pedido ser concluído
  cart = [];
  updateCartModal();
});

// Verificação do Horário de Funcionamento
function checkRestaurantOpen() {
  const date = new Date();
  const hour = date.getHours();
  return hour >= 18 && hour < 22; // retorna true
}

const isOpen = checkRestaurantOpen();

const spamItem = document.getElementById("date-span");

// Atualização visual do horário de funcionamento
if (isOpen) {
  spamItem.classList.remove("bg-red-500");
  spamItem.classList.add("bg-green-600");
} else {
  spamItem.classList.remove("bg-green-600");
  spamItem.classList.add("bg-red-500");
}
