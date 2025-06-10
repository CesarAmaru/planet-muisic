const body = document.querySelector("body");
        sidebar = body.querySelector(".sidebar"),
        toggle = body.querySelector(".toggle"),

        toggle.addEventListener("click", () => {
            sidebar.classList.toggle("close");
        });

document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais
    let currentSlide = 0;
    let slideInterval;
    let currentDepoimento = 0;
    let carouselPosition = 0;
    
    // Inicialização
    initSlideshow();
    initCarousel();
    initDepoimentos();
    initAccessibility();
    initScrollAnimations();
    initFormValidation();
    initMenuToggle();
    initBackToTop();
    
    // ===================================================================
    // FUNÇÕES
    // ===================================================================
    
    // Carrossel de produtos (COM CORREÇÃO FINAL)
    function initCarousel() {
        const carouselContainer = document.querySelector('#destaque .carousel-container');
        if (!carouselContainer) return;

        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        prevBtn.addEventListener('click', () => moveCarousel(-1));
        nextBtn.addEventListener('click', () => moveCarousel(1));
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToCarouselSlide(index));
        });
        
        // A função updateCarouselTrack() foi removida daqui, pois causava conflitos.
        window.addEventListener('resize', () => goToCarouselSlide(carouselPosition));
    }

    // ESTA FUNÇÃO FOI INTENCIONALMENTE DEIXADA VAZIA
    // O código original dela conflitava com o CSS e quebrava o carrossel.
    function updateCarouselTrack() {
        // NADA AQUI
    }

    // Função auxiliar para pegar a largura total do slide (incluindo margens)
    function getFullSlideWidth() {
        const slides = document.querySelectorAll('.carousel-slide');
        if (slides.length === 0) return 0;

        const slide = slides[0];
        const style = window.getComputedStyle(slide);
        const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        
        return slide.getBoundingClientRect().width + margin;
    }

    // Função corrigida para mover o carrossel
    function moveCarousel(direction) {
        const track = document.querySelector('.carousel-track');
        const slides = document.querySelectorAll('.carousel-slide');
        if (!track || slides.length === 0) return;

        const totalSlideWidth = getFullSlideWidth();
        const visibleSlides = getVisibleSlides();
        const limit = slides.length - visibleSlides;

        carouselPosition += direction;
        
        if (carouselPosition < 0) {
            carouselPosition = 0;
        } else if (carouselPosition > limit) {
            carouselPosition = limit;
        }
        
        track.style.transform = `translateX(-${totalSlideWidth * carouselPosition}px)`;
        updateCarouselIndicators();
    }
    
    function goToCarouselSlide(index) {
        const track = document.querySelector('.carousel-track');
        const slides = document.querySelectorAll('.carousel-slide');
        if (!track || slides.length === 0) return;

        const totalSlideWidth = getFullSlideWidth();
        const visibleSlides = getVisibleSlides();
        const limit = slides.length - visibleSlides;
        
        // Garante que o índice não ultrapasse o limite ao redimensionar
        if (index > limit) index = limit;
        
        carouselPosition = index;
        track.style.transform = `translateX(-${totalSlideWidth * carouselPosition}px)`;
        updateCarouselIndicators();
    }
    
    function updateCarouselIndicators() {
        const indicators = document.querySelectorAll('.carousel-indicator');
        if (!indicators || indicators.length === 0) return;
        
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
        });

        // Apenas ativa o indicador correspondente se ele existir
        if (indicators[carouselPosition]) {
            indicators[carouselPosition].classList.add('active');
        }
    }
    
    function getVisibleSlides() {
        if (window.innerWidth >= 1200) return 3;
        if (window.innerWidth >= 992) return 2;
        return 1;
    }

    // --- Demais funções sem alteração ---

    function initSlideshow() {
        const slideshowContainer = document.querySelector('.slideshow-container');
        if (!slideshowContainer) return;
        showSlide(currentSlide);
        startSlideInterval();
        document.querySelector('.prev').addEventListener('click', () => { clearInterval(slideInterval); showSlide(currentSlide - 1); startSlideInterval(); });
        document.querySelector('.next').addEventListener('click', () => { clearInterval(slideInterval); showSlide(currentSlide + 1); startSlideInterval(); });
        document.querySelectorAll('.dot').forEach((dot, index) => dot.addEventListener('click', () => { clearInterval(slideInterval); showSlide(index); startSlideInterval(); }));
    }
    function showSlide(n) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        if (slides.length === 0) return;
        if (n >= slides.length) currentSlide = 0;
        else if (n < 0) currentSlide = slides.length - 1;
        else currentSlide = n;
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    function startSlideInterval() {
        slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
    }
    function initDepoimentos() {
        const depoimentosContainer = document.querySelector('.depoimentos-container');
        if (!depoimentosContainer) return;
        const dots = document.querySelectorAll('.depoimento-dot');
        const depoimentos = document.querySelectorAll('.depoimento-card');
        showDepoimento(0);
        dots.forEach((dot, index) => dot.addEventListener('click', () => showDepoimento(index)));
        setInterval(() => showDepoimento((currentDepoimento + 1) % depoimentos.length), 8000);
    }
    function showDepoimento(index) {
        const depoimentos = document.querySelectorAll('.depoimento-card');
        const dots = document.querySelectorAll('.depoimento-dot');
        if (depoimentos.length === 0) return;
        depoimentos.forEach(depoimento => depoimento.style.display = 'none');
        dots.forEach(dot => dot.classList.remove('active'));
        depoimentos[index].style.display = 'flex';
        dots[index].classList.add('active');
        currentDepoimento = index;
    }
    function initAccessibility() {
        const accessibilityBtn = document.getElementById('accessibility-btn');
        if (!accessibilityBtn) return;
        const accessibilityMenu = document.querySelector('.accessibility-menu');
        accessibilityBtn.addEventListener('click', () => accessibilityMenu.classList.toggle('active'));
        document.addEventListener('click', (event) => { if (!event.target.closest('.accessibility-toggle')) accessibilityMenu.classList.remove('active'); });
        document.getElementById('contrast-toggle').addEventListener('click', () => document.body.classList.toggle('high-contrast'));
    }
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        if (elements.length === 0) return;
        const checkVisibleElements = () => {
            const windowHeight = window.innerHeight;
            elements.forEach(element => { if (element.getBoundingClientRect().top < windowHeight - 150) element.classList.add('animated'); });
        };
        elements.forEach(el => el.classList.add('animate-on-scroll'));
        checkVisibleElements();
        window.addEventListener('scroll', checkVisibleElements);
    }
    function initFormValidation() {
        const form = document.getElementById('contato-form');
        if (!form) return;
        const successMessage = document.querySelector('.form-success-message');
        const closeBtn = document.querySelector('.btn-close');
        const setErrorFor = (input) => input.parentElement.classList.add('error');
        const setSuccessFor = (input) => input.parentElement.classList.remove('error');
        const isValidEmail = (email) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            let isValid = true;
            const fields = { nome: document.getElementById('nome'), email: document.getElementById('email'), assunto: document.getElementById('assunto'), mensagem: document.getElementById('mensagem') };
            if (fields.nome.value.trim() === '') { setErrorFor(fields.nome); isValid = false; } else { setSuccessFor(fields.nome); }
            if (!isValidEmail(fields.email.value)) { setErrorFor(fields.email); isValid = false; } else { setSuccessFor(fields.email); }
            if (fields.assunto.value === '') { setErrorFor(fields.assunto); isValid = false; } else { setSuccessFor(fields.assunto); }
            if (fields.mensagem.value.trim() === '') { setErrorFor(fields.mensagem); isValid = false; } else { setSuccessFor(fields.mensagem); }
            if (isValid) { form.reset(); successMessage.classList.add('active'); }
        });
        if (closeBtn) closeBtn.addEventListener('click', () => successMessage.classList.remove('active'));
    }
    function initMenuToggle() {
        const menuToggle = document.querySelector('.menu-toggle');
        if (!menuToggle) return;
        const navLinks = document.querySelector('.nav-links');
        menuToggle.addEventListener('click', () => { menuToggle.classList.toggle('active'); navLinks.classList.toggle('active'); });
    }
    function initBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;
        window.addEventListener('scroll', () => { backToTopBtn.classList.toggle('active', window.pageYOffset > 300); });
        backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
});