document.addEventListener('DOMContentLoaded', function() {

    initSliders(); 
    loadCart();  
    setupEvents();    
});

function initSliders() {

    //Inicializa el slider principal
    new Swiper(".mySwiper-1", {
        slidesPerView: 1, 
        loop: true,             
        pagination: { el: ".swiper-pagination" },
        navigation: {         
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        }
    });

    //Inicializa el slider de productos
    new Swiper(".mySwiper-2", {
        slidesPerView: 3, 
        loop: true,  
        navigation: {         
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },
        breakpoints: {            //Cambia la cantidad visible según la pantalla
            0: { slidesPerView: 1 },
            520: { slidesPerView: 2 },
            950: { slidesPerView: 3 }
        }
    });
}

let cart = [];


//Eventos principales de la página
function setupEvents() {
    document.addEventListener('click', e => { //Esto es una delegacion de eventos
        if (e.target.classList.contains('agregar-carrito')) {
            e.preventDefault();
            addToCart(e.target);    
        }

        //Si el clic es en el botón "Vaciar carrito"
        if (e.target.id === 'vaciar-carrito') {
            e.preventDefault();
            clearCart();             //Limpia todo el carrito
        }

        //Si el clic es en una "X" de borrar producto
        if (e.target.classList.contains('borrar')) {
            e.preventDefault();
            removeFromCart(e.target.dataset.id); //Borra el producto por su ID
        }
    });
}


//Agrega un producto al carrito
function addToCart(button) {

    //Construye un objeto con los datos del producto
    const product = {
        id: button.dataset.id,   //ID del producto según el HTML
        name: button.closest('.categoria, .product')
                     .querySelector('h3').textContent,   
        price: button.closest('.categoria, .product')
                     .querySelector('.precio').textContent, 
        image: button.closest('.categoria, .product')
                     .querySelector('img').src 
    };
    
    cart.push(product);    //Es un arreglo que añade el producto al final del carrito
    saveCart();  
    renderCart();         
    alert('Producto agregado al carrito!');  
}

function removeFromCart(id) {

    //Es un arreglo que filtra todos los productos excepto el que se quiere borrar
    cart = cart.filter(item => item.id !== id);

    saveCart();   
    renderCart();
}

function clearCart() {

    //Muestra una confirmación antes de borrar todo
    if (confirm('¿Vaciar carrito?')) {
        cart = [];        //Vacía el arreglo
        saveCart();     
        renderCart();   
    }
}


//Mostrar los productos en el carrito
function renderCart() {

    const tbody = document.querySelector('#lista-carrito tbody'); //Obtiene el cuerpo de la tabla
    tbody.innerHTML = '';  //Limpia la tabla para evitar duplicacion
    
    //Por cada producto agregamos una fila HTML
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
    
    //Si no hay productos en el carrito, muestra un mensaje
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


//Guardar el carroto en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart)); //Convierte a texto y guarda
}


//Cargar el carrito en localStorage
function loadCart() {

    const saved = localStorage.getItem('cart'); //Es para recuperar el carrito al recargar la página

    if (saved) {  //Si existía un carrito antes convierte el texto en arreglo
        cart = JSON.parse(saved);  
        renderCart();     
    }
}
