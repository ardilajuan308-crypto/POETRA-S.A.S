// Catálogo Oficial POETRA S.A.S. - 3 Piezas de Autor
const products = [
    {
        id: 1,
        name: "Mesa Auxiliar Naipes",
        price: 450000,
        image: "imagenes/productos/Producto 1.jpeg",
        description: "Mesa de centro conceptual inspirada en la geometría de los naipes de cartas. Construida con un bastidor en guadua estructural y revestida con un aglomerado ecológico de fibra de Ojo de Poeta y matriz de almidón.",
    },
    {
        id: 2,
        name: "Asiento Modular Galletas",
        price: 320000,
        image: "imagenes/productos/Producto 2.jpeg",
        description: "> Pieza de diseño de autor con una original silueta inspirada en galletas apiladas. Elaborada con una estructura interna de guadua y un recubrimiento rígido texturizado a partir del biocompuesto de Ojo de Poeta.",
    },
    {
        id: 3,
        name: "Espejo Escultórico Tipo Carta",
        price: 280000,
        image: "imagenes/productos/Producto 3.jpeg",
        description: "Espejo de pared de gran formato con un marco conceptual inspirado en el diseño icónico de las cartas de juego. Fabricado con un panel rígido de alta resistencia y un acabado estético excepcional.",
    }
];

/// Función para renderizar el catálogo en Grilla de 3 Columnas (Sin la etiqueta flotante)
function renderProducts() {
    const container = document.getElementById("products-container");
    if (!container) return;

    container.innerHTML = "";

    products.forEach(product => {
        container.innerHTML += `
            <div class="bg-white rounded-3xl overflow-hidden shadow-xl border border-[#0B5A18]/10 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group h-full">
                <!-- Contenedor de imagen limpio (sin la etiqueta de material) -->
                <div class="relative overflow-hidden h-72 shrink-0 bg-[#F4F1EA] p-4 flex items-center justify-center cursor-pointer" onclick="openDetailModal(${product.id})">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500">
                </div>
                
                <div class="p-6 flex flex-col justify-between flex-1 space-y-5">
                    <div class="space-y-2.5">
                        <h3 class="font-serif font-bold text-[#0B5A18] text-base sm:text-lg cursor-pointer hover:text-poetraOrange transition-colors" 
                            style="white-space: normal !important; overflow: visible !important; text-overflow: clip !important; word-break: break-word !important; display: block !important; line-height: 1.3 !important;"
                            onclick="openDetailModal(${product.id})">
                            ${product.name}
                        </h3>
                        <p class="text-poetraText/80 text-xs leading-relaxed font-light">
                            ${product.description}
                        </p>
                    </div>
                    
                    <div class="pt-4 border-t border-[#0B5A18]/10 flex items-center justify-between shrink-0">
                        <span class="text-lg font-bold text-[#F47A13]">
                            $${product.price.toLocaleString('es-CO')} COP
                        </span>
                        <button onclick="addToCart(${product.id})" class="btn-pulsing bg-[#0B5A18] hover:bg-[#F47A13] text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md active:scale-95">
                            <i class="fa-solid fa-cart-shopping cart-icon-wiggle"></i>
                            <span>Agregar</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Carrito de compras
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
});

function toggleCart() {
    const modal = document.getElementById("cart-modal");
    if (modal) {
        modal.classList.toggle("hidden");
        if (!modal.classList.contains("hidden")) {
            updateCartUI();
        }
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartBadge();
    showToast(`¡${product.name} agregado al carrito!`);
    animateCartButton(); // Animación activada al agregar al carrito
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    updateCartBadge();
}

function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll("#cart-badge, #cart-count").forEach(badge => {
        badge.innerText = totalItems;
    });
}

function updateCartUI() {
    const container = document.getElementById("cart-items-container");
    const totalContainer = document.getElementById("cart-total");

    if (!container || !totalContainer) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 space-y-3">
                <i class="fa-solid fa-basket-shopping text-4xl text-poetraEarth"></i>
                <p class="text-sm text-poetraText/60">Tu carrito está vacío. ¡Explora nuestra colección eco-sostenible!</p>
            </div>
        `;
        totalContainer.innerText = "$0 COP";
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="py-4 flex items-center justify-between gap-4">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl border border-poetraEarth">
            <div class="flex-1">
                <h4 class="font-serif font-bold text-sm text-poetraGreen">${item.name}</h4>
                <p class="text-xs text-poetraText/60">$${item.price.toLocaleString('es-CO')} COP</p>
                <div class="flex items-center gap-2 mt-2">
                    <button onclick="changeQuantity(${item.id}, -1)" class="w-6 h-6 rounded bg-poetraEarth text-poetraGreen flex items-center justify-center text-xs hover:bg-poetraOrange hover:text-white transition-colors">-</button>
                    <span class="text-xs font-bold">${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)" class="w-6 h-6 rounded bg-poetraEarth text-poetraGreen flex items-center justify-center text-xs hover:bg-poetraOrange hover:text-white transition-colors">+</button>
                </div>
            </div>
            <div class="text-right">
                <span class="text-sm font-bold text-poetraGreen">$${(item.price * item.quantity).toLocaleString('es-CO')} COP</span>
                <button onclick="removeFromCart(${item.id})" class="block text-xs text-red-500 hover:text-red-700 mt-2"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join("");

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalContainer.innerText = `$${total.toLocaleString('es-CO')} COP`;
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        showToast("Tu carrito está vacío");
        return;
    }

    const eHoja = String.fromCodePoint(0x1F33F);
    const eCaja = String.fromCodePoint(0x1F3E6);
    const eBolsa = String.fromCodePoint(0x1F4B1);
    const eNotas = String.fromCodePoint(0x1F4DD);
    const eEstrella = String.fromCodePoint(0x2728);

    let message = `${eHoja} *¡Hola, equipo POETRA!* ${eHoja}\n`;
    message += "Me encantaron sus piezas y quiero solicitar el siguiente pedido de diseño ecológico:\n\n";
    message += "─────────────────────\n";
    message += `${eCaja} *DETALLE DE MI PEDIDO:*\n\n`;

    cart.forEach(item => {
        message += `• *${item.quantity}x* ${item.name}\n`;
        message += `  └ Valor: *$${(item.price * item.quantity).toLocaleString('es-CO')} COP*\n\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    message += "─────────────────────\n";
    message += `${eBolsa} *TOTAL ESTIMADO:* *$${total.toLocaleString('es-CO')} COP*\n`;
    message += "─────────────────────\n\n";

    message += `${eNotas} *DATOS PARA LA ENTREGA:*\n`;
    message += "• *Nombre completo:* \n";
    message += "• *Ciudad / Municipio:* \n";
    message += "• *Dirección / Observaciones:* \n\n";
    message += `${eEstrella} *¡Quedo atento(a) para coordinar el pago y el envío!*`;

    const phoneNumber = "573229098734"; 
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
}

// Modal Detalle Producto
function openDetailModal(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById("detail-modal");
    const content = document.getElementById("detail-content");

    if (!modal || !content) return;

    content.innerHTML = `
        <div class="aspect-square rounded-2xl overflow-hidden bg-poetraEarth/30">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
        </div>
        <div class="space-y-4">
            <span class="bg-poetraGreen/10 text-poetraGreen text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Colección de Autor
            </span>
            <h3 class="font-serif font-bold text-2xl text-poetraGreen">${product.name}</h3>
            <p class="text-sm text-poetraText/70 leading-relaxed">${product.description}</p>
            <div class="bg-poetraEarth/50 p-3 rounded-xl text-xs space-y-1">
                <p class="font-semibold text-poetraGreen"><i class="fa-solid fa-seedling"></i> Material principal:</p>
                <p class="text-poetraText/80">${product.material}</p>
            </div>
            <div class="flex items-center justify-between pt-2">
                <span class="text-2xl font-bold text-poetraGreen">$${product.price.toLocaleString('es-CO')} COP</span>
                <button onclick="addToCart(${product.id}); closeDetailModal();" class="bg-poetraOrange hover:bg-poetraOrangeDark text-white font-semibold px-6 py-3 rounded-xl shadow transition-all flex items-center gap-2 text-sm cursor-pointer">
                    <i class="fa-solid fa-bag-shopping"></i> Agregar
                </button>
            </div>
        </div>
    `;
    modal.classList.remove("hidden");
}

function closeDetailModal() {
    const modal = document.getElementById("detail-modal");
    if (modal) {
        modal.classList.add("hidden");
    }
}

function showToast(text) {
    const toast = document.getElementById("toast-message");
    const toastText = document.getElementById("toast-text");
    if (toast && toastText) {
        toastText.innerText = text;
        toast.classList.remove("translate-y-32", "opacity-0");
        setTimeout(() => {
            toast.classList.add("translate-y-32", "opacity-0");
        }, 3500);
    }
}

// Animación de rebote al presionar el botón del carrito
function animateCartButton() {
    const cartBtns = document.querySelectorAll('#cart-btn, .cart-btn-animated');
    cartBtns.forEach(btn => {
        btn.classList.add('scale-125', 'rotate-12');
        setTimeout(() => {
            btn.classList.remove('scale-125', 'rotate-12');
        }, 300);
    });
}


// Estela Interactiva de Hojas con Detalle Botánico
document.addEventListener("DOMContentLoaded", () => {
    const dot = document.getElementById("custom-cursor-dot");
    const ring = document.getElementById("custom-cursor-ring");

    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let lastSpawnTime = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;

        // Generar estela de hojas detalladas cada 60ms
        const currentTime = Date.now();
        if (currentTime - lastSpawnTime > 60) {
            spawnLeafTrail(mouseX, mouseY);
            lastSpawnTime = currentTime;
        }
    });

    function renderCursor() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;

        requestAnimationFrame(renderCursor);
    }
    renderCursor();

   function spawnLeafTrail(x, y) {
        const leaf = document.createElement("div");
        leaf.className = "cursor-leaf-trail";
        
        // Desplazamiento corto para que nazcan cerquita del cursor
        const offsetX = (Math.random() - 0.5) * 12;
        const offsetY = (Math.random() - 0.5) * 12;
        
        leaf.style.left = `${x + offsetX}px`;
        leaf.style.top = `${y + offsetY}px`;

        // Rotación aleatoria
        const rotation = Math.random() * 360;
        leaf.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0.9)`;

        document.body.appendChild(leaf);

        // Se desvanecen y encogen rápidamente para que no estorben
        setTimeout(() => {
            leaf.style.transform = `translate(-50%, -50%) rotate(${rotation + 30}deg) scale(0.1)`;
            leaf.style.opacity = "0";
        }, 40);

        setTimeout(() => {
            leaf.remove();
        }, 500);
    }
    
    // Hover sobre elementos interactivos
    const interactiveElements = "a, button, input, select, textarea, .cursor-pointer, [onclick]";
    
    document.addEventListener("mouseover", (e) => {
        if (e.target.closest(interactiveElements)) {
            document.body.classList.add("cursor-hover");
        }
    });

    document.addEventListener("mouseout", (e) => {
        if (e.target.closest(interactiveElements)) {
            document.body.classList.remove("cursor-hover");
        }
    });
});