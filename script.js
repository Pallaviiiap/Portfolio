document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const searchResults = document.getElementById('searchResults');
    let debounceTimer;

    // Debounce function to limit API calls
    function debounce(func, delay) {
        return function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
        };
    }

    // Handle search input
    searchInput.addEventListener('input', debounce(function(e) {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            searchSuggestions.style.display = 'none';
            return;
        }

        // Fetch suggestions
        fetch(`search.php?query=${encodeURIComponent(query)}&suggestions=true`)
            .then(response => response.json())
            .then(data => {
                displaySuggestions(data);
            })
            .catch(error => console.error('Error:', error));
    }, 300));

    // Handle suggestion clicks
    searchSuggestions.addEventListener('click', function(e) {
        if (e.target.classList.contains('suggestion-item')) {
            searchInput.value = e.target.textContent;
            searchSuggestions.style.display = 'none';
            performSearch(e.target.textContent);
        }
    });

    // Handle form submission
    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch(searchInput.value);
    });

    // Display suggestions
    function displaySuggestions(suggestions) {
        if (suggestions.length === 0) {
            searchSuggestions.style.display = 'none';
            return;
        }

        searchSuggestions.innerHTML = suggestions
            .map(suggestion => `<div class="suggestion-item">${suggestion}</div>`)
            .join('');
        searchSuggestions.style.display = 'block';
    }

    // Perform search
    function performSearch(query) {
        fetch(`search.php?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                displayResults(data);
            })
            .catch(error => console.error('Error:', error));
    }

    // Display search results
    function displayResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p>No products found.</p>';
            return;
        }

        searchResults.innerHTML = results
            .map(product => `
                <div class="product-item">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">$${product.price}</div>
                    <div class="product-description">${product.description}</div>
                </div>
            `)
            .join('');
    }

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.style.display = 'none';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            // Scroll Down
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            // Scroll Up
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.value-card, .timeline-item, .blog-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('animate');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to a server
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }

    // Add loading animation to blog images
    const blogImages = document.querySelectorAll('.blog-image');
    blogImages.forEach(image => {
        image.style.backgroundImage = `url('https://source.unsplash.com/random/800x600/?${image.parentElement.querySelector('h3').textContent.toLowerCase()}')`;
    });

    // Add hover effect to value cards
    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}); 