document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', function() {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    
    menuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Product Data
    const products = [
        {
            id: 1,
            title: "Quantum Elite Smartwatch",
            category: "wearables",
            price: 599,
            originalPrice: 699,
            image: "images/smartwatch.jpg",
            badge: "BESTSELLER",
            description: "Premium smartwatch with health monitoring and luxury design."
        },
        {
            id: 2,
            title: "Nebula Wireless Earbuds",
            category: "audio",
            price: 349,
            originalPrice: 399,
            image: "images/airpod.jpg",
            badge: "NEW",
            description: "Noise-cancelling wireless earbuds with crystal clear sound."
        },
        {
            id: 3,
            title: "Aurora Smart Light System",
            category: "smart-home",
            price: 249,
            originalPrice: 299,
            image: "images/lamp.jpg",
            description: "Voice-controlled smart lighting for your home."
        },
        {
            id: 4,
            title: "Titanium Power Bank",
            category: "accessories",
            price: 129,
            originalPrice: 149,
            image: "images/pbank.jpg",
            description: "Ultra-slim 10,000mAh power bank with fast charging."
        },
        {
            id: 5,
            title: "Horizon 4K Drone",
            category: "accessories",
            price: 1299,
            originalPrice: 1499,
            image: "images/drone.jpg",
            badge: "SALE",
            description: "Professional 4K drone with 3-axis gimbal."
        },
        {
            id: 6,
            title: "Infinity VR Headset",
            category: "wearables",
            price: 799,
            originalPrice: 899,
            image: "images/vr.jpg",
            description: "Immersive virtual reality experience with 8K resolution."
        },
        {
            id: 7,
            title: "Echo Smart Speaker",
            category: "smart-home",
            price: 199,
            originalPrice: 249,
            image: "images/speaker.jpg",
            description: "Premium sound quality with voice assistant integration."
        },
        {
            id: 8,
            title: "Carbon Fiber Laptop Stand",
            category: "accessories",
            price: 89,
            originalPrice: 99,
            image: "images/stand.jpg",
            description: "Ergonomic laptop stand with premium carbon fiber construction."
        }
    ];

    // Display Products
    const productGrid = document.querySelector('.product-grid');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    function displayProducts(filter = 'all') {
        productGrid.innerHTML = '';
        
        const filteredProducts = filter === 'all' 
            ? products 
            : products.filter(product => product.category === filter);
        
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category.replace('-', ' ')}</span>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price}</span>
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-actions">
                        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                        <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
        
        // Add event listeners to new buttons
        addCartEventListeners();
        addWishlistEventListeners();
    }
    
    // Filter Products by Category
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            displayProducts(category);
        });
    });
    
    // Initialize with all products
    displayProducts();

    // Shopping Cart Functionality
    let cart = [];
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartBtn = document.querySelector('.cart-btn');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalPriceElement = document.querySelector('.total-price');
    
    // Toggle Cart
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        cartSidebar.classList.add('active');
    });
    
    closeCartBtn.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
    });
    
    // Add to Cart
    function addCartEventListeners() {
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                const product = products.find(p => p.id === productId);
                
                // Check if product already in cart
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        ...product,
                        quantity: 1
                    });
                }
                
                updateCart();
                cartSidebar.classList.add('active');
                
                // Animation feedback
                this.textContent = 'Added!';
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                }, 1000);
            });
        });
    }
    
    // Update Cart
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            totalPriceElement.textContent = '$0.00';
            return;
        }
        
        let totalPrice = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <span class="cart-item-price">$${item.price}</span>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Update total price
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        
        // Add event listeners to quantity buttons
        addQuantityEventListeners();
    }
    
    // Quantity Controls
    function addQuantityEventListeners() {
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                const cartItem = cart.find(item => item.id === productId);
                
                if (cartItem.quantity > 1) {
                    cartItem.quantity -= 1;
                } else {
                    cart = cart.filter(item => item.id !== productId);
                }
                
                updateCart();
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                const cartItem = cart.find(item => item.id === productId);
                cartItem.quantity += 1;
                updateCart();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                cart = cart.filter(item => item.id !== productId);
                updateCart();
            });
        });
    }
    
    // Wishlist Functionality
    function addWishlistEventListeners() {
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active');
                const icon = this.querySelector('i');
                
                if (this.classList.contains('active')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    // In a real app, you would add to wishlist array
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    // In a real app, you would remove from wishlist array
                }
            });
        });
    }
    
    // Search Functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchModal = document.querySelector('.search-modal');
    const closeSearchBtn = document.querySelector('.close-search');
    const searchForm = document.querySelector('.search-form');
    const searchResults = document.querySelector('.search-results');
    
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeSearchBtn.addEventListener('click', function() {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = this.querySelector('input').value.toLowerCase();
        
        if (searchTerm.trim() === '') {
            searchResults.innerHTML = '<p class="no-results">Please enter a search term</p>';
            return;
        }
        
        const results = products.filter(product => 
            product.title.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        
        displaySearchResults(results);
    });
    
    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No products found</p>';
            return;
        }
        
        results.forEach(product => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <div class="search-result-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="search-result-details">
                    <h4>${product.title}</h4>
                    <p>$${product.price}</p>
                </div>
            `;
            searchResults.appendChild(resultItem);
            
            // Clicking on result would take you to product page in real app
            resultItem.addEventListener('click', function() {
                alert(`You clicked on ${product.title}. In a real app, this would take you to the product page.`);
                searchModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        
        // In a real app, you would send this to your backend
        alert(`Thank you for subscribing with ${email}!`);
        this.querySelector('input').value = '';
    });
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Testimonial Slider (simple version)
    const testimonialSlides = [
        {
            quote: "The quality of these products is unmatched. TechHub430 has become my go-to for all my tech needs.",
            name: "Michael Johnson",
            role: "Tech Entrepreneur",
            rating: 5
        },
        {
            quote: "Excellent customer service and fast shipping. The products exceeded my expectations.",
            name: "Sarah Williams",
            role: "Digital Marketer",
            rating: 3
        },
        {
            quote: "I'm impressed with the attention to detail in every product. Worth every penny!",
            name: "David Kim",
            role: "Software Engineer",
            rating: 4
        }
    ];
    
    const testimonialSlider = document.querySelector('.testimonial-slider');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        const testimonial = testimonialSlides[index];
        testimonialSlider.innerHTML = `
            <div class="testimonial-slide">
                <div class="testimonial-content">
                    <div class="rating">
                        ${'<i class="fas fa-star"></i>'.repeat(testimonial.rating)}
                    </div>
                    <p>${testimonial.quote}</p>
                    <div class="client-info">
                        <div>
                            <h4>${testimonial.name}</h4>
                            <span>${testimonial.role}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Initialize first testimonial
    showTestimonial(currentTestimonial);
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
        showTestimonial(currentTestimonial);
    }, 5000);
});

// Mobile Menu Toggle - Fixed Version
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

// Toggle mobile menu
menuBtn.addEventListener('click', function() {
    // Check if menu is already open
    if (mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
});

// Close when clicking overlay
mobileMenuOverlay.addEventListener('click', closeMobileMenu);

// Close when clicking any menu link
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close when pressing Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Handle browser back button
window.addEventListener('popstate', function() {
    if (mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add history state to handle back button
    history.pushState({ menuOpen: true }, '');
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // If we pushed a state, go back
    if (history.state && history.state.menuOpen) {
        history.back();
    }
}