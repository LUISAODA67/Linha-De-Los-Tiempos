document.addEventListener('DOMContentLoaded', function() {
    // Get the background music element
    const backgroundMusic = document.getElementById('background-music-1');
    
    // Keep track of sound state - start muted
    let isMuted = true;
    
    if (backgroundMusic) {
        // Set volume - start with volume 0 (muted)
        backgroundMusic.volume = 0;
        
        // Loop the track
        backgroundMusic.loop = true;
        
        // Setup sound toggle button
        const soundToggle = document.getElementById('sound-toggle');
        const volumeUpIcon = soundToggle ? soundToggle.querySelector('.fa-volume-up') : null;
        const volumeMuteIcon = soundToggle ? soundToggle.querySelector('.fa-volume-mute') : null;
        
        // Set initial icon state to muted
        if (volumeUpIcon && volumeMuteIcon) {
            volumeUpIcon.style.display = 'none';
            volumeMuteIcon.style.display = 'inline';
        }
        
        // Add click event to sound toggle button
        if (soundToggle) {
            soundToggle.addEventListener('click', function() {
                if (isMuted) {
                    // Unmute audio
                    backgroundMusic.volume = 0.2;
                    if (volumeUpIcon && volumeMuteIcon) {
                        volumeUpIcon.style.display = 'inline';
                        volumeMuteIcon.style.display = 'none';
                    }
                    isMuted = false;
                } else {
                    // Mute audio
                    backgroundMusic.volume = 0;
                    if (volumeUpIcon && volumeMuteIcon) {
                        volumeUpIcon.style.display = 'none';
                        volumeMuteIcon.style.display = 'inline';
                    }
                    isMuted = true;
                }
            });
        }
        
        // Play music when user interacts with the page (to comply with autoplay policies)
        const playMusic = () => {
            backgroundMusic.play().catch(error => {
                console.log('Auto-play was prevented. User interaction is required:', error);
            });
            
            // Make sure volume is properly set based on muted state
            backgroundMusic.volume = isMuted ? 0 : 0.2;
            
            // Remove the event listeners once music starts playing
            document.removeEventListener('click', playMusic);
            document.removeEventListener('keydown', playMusic);
            document.removeEventListener('touchstart', playMusic);
        };
        
        // Try to play immediately (may be blocked by browser)
        playMusic();
        
        // Add event listeners for user interaction to start music
        document.addEventListener('click', playMusic);
        document.addEventListener('keydown', playMusic);
        document.addEventListener('touchstart', playMusic);
        
        // Handle page visibility changes to restart music if needed
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible' && !isMuted) {
                backgroundMusic.play().catch(e => console.log('Could not auto-resume music:', e));
            }
        });
    }

    // Adicionar classe fade-in a todos os itens da timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.classList.add('fade-in');
        // Adicionar um atraso progressivo para criar um efeito cascata
        item.style.transitionDelay = `${index * 0.15}s`;
    });

    // Função para verificar se um elemento está visível na viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }

    // Função para mostrar elementos quando estiverem visíveis
    function showVisibleItems() {
        const items = document.querySelectorAll('.fade-in');
        items.forEach(item => {
            if (isElementInViewport(item)) {
                item.classList.add('visible');
            }
        });
    }

    // Executar a primeira verificação após um pequeno atraso
    setTimeout(showVisibleItems, 300);

    // Adicionar event listener para verificar ao rolar a página
    window.addEventListener('scroll', showVisibleItems);
    
    // Animação suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Ajustar para a navbar fixa
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Adicionar funcionalidade para ampliar imagens ao clicar
    const timelineImages = document.querySelectorAll('.timeline-img');
    timelineImages.forEach(img => {
        img.addEventListener('click', function() {
            // Criar um modal para mostrar a imagem ampliada
            const modal = document.createElement('div');
            modal.classList.add('image-modal');
            
            const modalImg = document.createElement('img');
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.classList.add('modal-close');
            
            modal.appendChild(closeBtn);
            modal.appendChild(modalImg);
            document.body.appendChild(modal);
            
            // Adicionar efeito fade-in
            setTimeout(() => {
                modal.classList.add('visible');
            }, 10);
            
            // Fechar o modal ao clicar no botão ou fora da imagem
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            // Função para fechar o modal
            function closeModal() {
                modal.classList.remove('visible');
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            }
        });
    });
    
    // Adicionar estilo para o modal de imagem
    const style = document.createElement('style');
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .image-modal.visible {
            opacity: 1;
        }
        
        .image-modal img {
            max-width: 90%;
            max-height: 90%;
            border-radius: 8px;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
        }
        
        .modal-close {
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 40px;
            color: white;
            background: transparent;
            border: none;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
    
    // Adicionar contador de visualização das seções
    let hasVisitedSections = {};
    
    function trackSectionVisits() {
        const sections = document.querySelectorAll('section.timeline-item');
        
        sections.forEach((section, index) => {
            if (isElementInViewport(section) && !hasVisitedSections[index]) {
                hasVisitedSections[index] = true;
                
                // Opcional: Registrar de alguma forma que o usuário viu esta seção
                console.log(`Usuário visualizou a seção de ${section.querySelector('h3')?.textContent || 'Sem título'}`);
            }
        });
    }
    
    window.addEventListener('scroll', trackSectionVisits);
    
    // Verificar links de "ver mais" e adicionar funcionalidade
    document.querySelectorAll('.btn-outline-primary').forEach(btn => {
        if (btn.textContent.includes('Ver mais')) {
            btn.addEventListener('click', function() {
                const content = this.closest('.timeline-content');
                const hiddenContent = content.querySelector('.hidden-content');
                
                if (hiddenContent) {
                    hiddenContent.classList.toggle('show');
                    this.innerHTML = hiddenContent.classList.contains('show') ? 
                        '<i class="fas fa-minus-circle me-2"></i>Ver menos' : 
                        '<i class="fas fa-plus-circle me-2"></i>Ver mais';
                }
            });
        }
    });

    // Adicionar código para fechar menu automático em dispositivos móveis
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const menuToggle = document.getElementById('navbarNav');
    if (menuToggle && window.bootstrap) {
        const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) { // Se estiver em visualização mobile
                    bsCollapse.hide();
                }
            });
        });
    }

    // Inicializar EmailJS e adicionar manipulador de formulário
    (function() {
        // Modo de demonstração - sem EmailJS
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                const formStatus = document.getElementById('formStatus');
                const formSuccess = document.getElementById('formSuccess');
                const formError = document.getElementById('formError');
                const submitBtn = this.querySelector('button[type="submit"]');
                
                // Desabilitar o botão de envio para simular o processo
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
                
                // Obter dados do formulário (para demonstração)
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const subject = document.getElementById('subject').value;
                const message = document.getElementById('message').value;
                
                // Registrar no console os dados que seriam enviados
                console.log('Dados do formulário:', { name, email, subject, message });
                
                // Simular processo de envio
                setTimeout(function() {
                    // Simular sucesso
                    formStatus.classList.remove('d-none');
                    formSuccess.classList.remove('d-none');
                    formError.classList.add('d-none');
                    
                    // Resetar o formulário
                    document.getElementById('contactForm').reset();
                    
                    // Restaurar o botão após 2 segundos
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = 'Enviar Mensagem';
                        
                        // Fechar o modal após 3 segundos
                        setTimeout(() => {
                            const contactModal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
                            if (contactModal) {
                                contactModal.hide();
                            }
                            
                            // Ocultar mensagem de status após fechar o modal
                            setTimeout(() => {
                                formStatus.classList.add('d-none');
                                formSuccess.classList.add('d-none');
                            }, 500);
                        }, 3000);
                    }, 2000);
                }, 1500); // Simular atraso de rede
            });
        }
    })();
});