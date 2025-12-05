// VERSIÓN MÍNIMA Y FUNCIONAL
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sliders
    initSliders();
    
    // Cargar carrito
    loadCart();
    
    // Configurar eventos
    setupEvents();
});

function initSliders() {
    new Swiper(".mySwiper-1", {
        slidesPerView: 1, loop: true,
        pagination: { el: ".swiper-pagination" },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }
    });
    
    new Swiper(".mySwiper-2", {
        slidesPerView: 3, loop: true,
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        breakpoints: { 0: { slidesPerView: 1 }, 520: { slidesPerView: 2 }, 950: { slidesPerView: 3 } }
    });
}

let cart = [];

function setupEvents() {
    // Click en "Agregar al carrito"
    document.addEventListener('click', e => {
        if (e.target.classList.contains('agregar-carrito')) {
            e.preventDefault();
            addToCart(e.target);
        }
        
        if (e.target.id === 'vaciar-carrito') {
            e.preventDefault();
            clearCart();
        }
        
        if (e.target.classList.contains('borrar')) {
            e.preventDefault();
            removeFromCart(e.target.dataset.id);
        }
    });
}

function addToCart(button) {
    const product = {
        id: button.dataset.id,
        name: button.closest('.categoria, .product').querySelector('h3').textContent,
        price: button.closest('.categoria, .product').querySelector('.precio').textContent,
        image: button.closest('.categoria, .product').querySelector('img').src
    };
    
    cart.push(product);
    saveCart();
    renderCart();
    alert('Producto agregado al carrito!');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

function clearCart() {
    if (confirm('¿Vaciar carrito?')) {
        cart = [];
        saveCart();
        renderCart();
    }
}

function renderCart() {
    const tbody = document.querySelector('#lista-carrito tbody');
    tbody.innerHTML = '';
    
    cart.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${item.image}" width="50"></td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td><a href="#" class="borrar" data-id="${item.id}">X</a></td>
            </tr>
        `;
    });
    
    // Mostrar mensaje si está vacío
    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#747474;">Carrito vacío</td></tr>';
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
        renderCart();
    }
}