// Smooth scrolling para los enlaces de navegación
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                    // Cerrar menú móvil si está abierto
                    closeMenu();
                }
            });
        });

        // Menú hamburguesa
        const hamburger = document.getElementById('hamburger');
        const mainNav = document.querySelector('.main-nav');
        const navOverlay = document.getElementById('navOverlay');

        function openMenu() {
            hamburger.classList.add('active');
            mainNav.classList.add('active');
            navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevenir scroll
        }

        function closeMenu() {
            hamburger.classList.remove('active');
            mainNav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar scroll
        }

        hamburger.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Cerrar menú al hacer click en el overlay
        navOverlay.addEventListener('click', closeMenu);

        // Cerrar menú al redimensionar ventana (si se vuelve a desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });

        // Efecto parallax suave en el hero
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroImage = document.querySelector('.hero-image');
            if (heroImage) {
                heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        });

        // Animación de aparición de los productos
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Aplicar animación a los productos
        document.querySelectorAll('.product-item').forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(item);
        });

        // Manejo del formulario de contacto
        const contactForm = document.getElementById('contactForm');
        const mensajeEstado = document.getElementById('mensajeEstado');

        function mostrarMensaje(mensaje, tipo) {
            mensajeEstado.style.display = 'block';
            mensajeEstado.textContent = mensaje;
            
            if (tipo === 'success') {
                mensajeEstado.style.background = 'linear-gradient(135deg, #4CAF50, #66bb6a)';
                mensajeEstado.style.color = 'white';
            } else {
                mensajeEstado.style.background = 'linear-gradient(135deg, #f44336, #ef5350)';
                mensajeEstado.style.color = 'white';
            }
            
            // Scroll al mensaje
            mensajeEstado.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('input[type="submit"]');
            
            // Deshabilitar botón y mostrar loading
            submitButton.disabled = true;
            submitButton.value = 'Enviando...';
            
            try {
                const response = await fetch('procesar_contacto.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json(); // ⚠️ Esto lanza si la respuesta NO es JSON

                if (result.success) {
                    mostrarMensaje(result.message, 'success');
                    contactForm.reset();
                } else {
                    mostrarMensaje(result.message || 'Error al enviar el mensaje', 'error');
                }

            } catch (error) {
                console.error('Error:', error);
                mostrarMensaje('Error de conexión o formato de respuesta inválido.', 'error');
            }
            finally {
                // Restaurar botón
                submitButton.disabled = false;
                submitButton.value = 'Enviar Mensaje';
            }
        });