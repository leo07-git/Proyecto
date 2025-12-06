// Espera a que toda la página cargue antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function() {

    initSliders();     // Inicializa los sliders de Swiper
    loadCart();        // Carga el carrito desde localStorage
    setupEvents();     // Activa los eventos de los botones (agregar, borrar, vaciar)
});

//     CONFIGURACIÓN DE SLIDERS
function initSliders() {

    // Inicializa el slider principal (mySwiper-1)
    new Swiper(".mySwiper-1", {
        slidesPerView: 1,         // Muestra 1 slide a la vez
        loop: true,               // Repite infinitamente
        pagination: { el: ".swiper-pagination" },   // Indicadores de página
        navigation: {             // Botones adelante / atrás
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        }
    });

    // Inicializa el slider de productos (mySwiper-2)
    new Swiper(".mySwiper-2", {
        slidesPerView: 3,         // Muestra 3 productos por defecto
        loop: true,               // Repite infinitamente
        navigation: {             // Botones de navegación
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },
        breakpoints: {            // Cambia la cantidad visible según la pantalla
            0: { slidesPerView: 1 },
            520: { slidesPerView: 2 },
            950: { slidesPerView: 3 }
        }
    });
}


// Array donde se guardan los productos agregados al carrito
let cart = [];


//     EVENTOS PRINCIPALES DE LA PÁGINA
function setupEvents() {

    // Detecta cualquier clic en toda la página
    document.addEventListener('click', e => {

        // Si el clic es en un botón de "Agregar al carrito"
        if (e.target.classList.contains('agregar-carrito')) {
            e.preventDefault();      // Evita que se recargue la página
            addToCart(e.target);     // Llama a la función para agregar el producto
        }

        // Si el clic es en el botón "Vaciar carrito"
        if (e.target.id === 'vaciar-carrito') {
            e.preventDefault();
            clearCart();             // Limpia todo el carrito
        }

        // Si el clic es en una "X" de borrar producto
        if (e.target.classList.contains('borrar')) {
            e.preventDefault();
            removeFromCart(e.target.dataset.id); // Borra el producto por su ID
        }
    });
}


//     AGREGA UN PRODUCTO AL CARRITO (leer datos del HTML)
function addToCart(button) {

    // Construye un objeto con los datos del producto
    const product = {
        id: button.dataset.id,   // ID del producto según el HTML
        name: button.closest('.categoria, .product')
                     .querySelector('h3').textContent,   // Obtiene el título
        price: button.closest('.categoria, .product')
                     .querySelector('.precio').textContent, // Obtiene el precio
        image: button.closest('.categoria, .product')
                     .querySelector('img').src  // Obtiene la imagen
    };
    
    cart.push(product);    // Añade el producto al arreglo
    saveCart();            // Guarda el carrito en localStorage
    renderCart();          // Actualiza la tabla visual del carrito
    alert('Producto agregado al carrito!');  // Mensaje al usuario
}


//     ELIMINA UN PRODUCTO DEL CARRITO POR SU ID
function removeFromCart(id) {

    // Filtra todos los productos excepto el que se quiere borrar
    cart = cart.filter(item => item.id !== id);

    saveCart();   // Guarda los cambios en localStorage
    renderCart(); // Vuelve a pintar el carrito en pantalla
}


//     LIMPIA TODO EL CARRITO COMPLETO
function clearCart() {

    // Muestra una confirmación antes de borrar todo
    if (confirm('¿Vaciar carrito?')) {
        cart = [];        // Vacía el array
        saveCart();       // Actualiza localStorage
        renderCart();     // Actualiza la visualización
    }
}


//     PINTA EL CARRITO EN LA TABLA HTML
function renderCart() {

    const tbody = document.querySelector('#lista-carrito tbody'); // Obtiene el cuerpo de la tabla
    tbody.innerHTML = '';  // Limpia la tabla antes de volver a dibujar
    
    // Recorre cada producto del carrito
    cart.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${item.image}" width="50"></td>   <!-- Imagen -->
                <td>${item.name}</td>                           <!-- Nombre -->
                <td>${item.price}</td>                          <!-- Precio -->
                <td><a href="#" class="borrar" data-id="${item.id}">X</a></td> <!-- Botón borrar -->
            </tr>
        `;
    });
    
    // Si no hay productos en el carrito, muestra un mensaje
    if (cart.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;color:#747474;">
                    Carrito vacío
                </td>
            </tr>
        `;
    }
}


//     GUARDA EL CARRITO COMPLETO EN localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart)); // Convierte a texto y guarda
}


//     CARGA EL CARRITO DESDE localStorage
function loadCart() {

    const saved = localStorage.getItem('cart'); // Obtiene el carrito guardado

    if (saved) {            // Si existía un carrito antes...
        cart = JSON.parse(saved);  // Lo convierte de texto a array
        renderCart();       // Lo muestra en pantalla
    }
}
