// Portfolio JavaScript with API Integration
class PortfolioAPI {
    constructor() {
        this.apiEndpoint = 'https://api.quotable.io/quotes/random';
        this.init();
    }

    init() {
        this.setupScrollEffects();
        this.setupProgressBars();
        this.setupContactForm();
        this.loadInspirationalQuote();
        this.setupSmoothScrolling();
    }

    // Carregar citação inspiracional
    async loadInspirationalQuote() {
        try {
            const response = await fetch(`${this.apiEndpoint}?tags=technology,motivational,success&limit=1`);
            const data = await response.json();
            
            if (data && data.length > 0) {
                const quote = data[0];
                this.renderQuote(quote);
            } else {
                this.renderDefaultQuote();
            }
        } catch (error) {
            console.error('Erro ao carregar citação:', error);
            this.renderDefaultQuote();
        }
    }

    renderQuote(quote) {
        const quoteElement = document.getElementById('inspiration-quote');
        const authorElement = document.getElementById('inspiration-author');
        
        if (quoteElement && authorElement) {
            quoteElement.textContent = quote.content;
            authorElement.textContent = quote.author;
            
            // Animação de fade-in
            quoteElement.parentElement.style.opacity = '0';
            setTimeout(() => {
                quoteElement.parentElement.style.opacity = '1';
                quoteElement.parentElement.style.transition = 'opacity 0.5s ease';
            }, 100);
        }
    }

    renderDefaultQuote() {
        const quoteElement = document.getElementById('inspiration-quote');
        const authorElement = document.getElementById('inspiration-author');
        
        if (quoteElement && authorElement) {
            quoteElement.textContent = "O sucesso é a soma de pequenos esforços repetidos dia após dia.";
            authorElement.textContent = "Robert Collier";
        }
    }

    // Configurar efeitos de scroll
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observar todos os cards e elementos animáveis
        const animatedElements = document.querySelectorAll('.card, .timeline-item, .section-title');
        animatedElements.forEach(el => observer.observe(el));
    }

    // Configurar barras de progresso
    setupProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const targetWidth = progressBar.getAttribute('data-width') || progressBar.style.width;
                    
                    // Animar a barra de progresso
                    setTimeout(() => {
                        progressBar.style.width = targetWidth;
                    }, 300);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => {
            // Salvar a largura target e resetar
            const targetWidth = bar.style.width;
            bar.setAttribute('data-width', targetWidth);
            bar.style.width = '0%';
            
            progressObserver.observe(bar);
        });
    }

    // Configurar formulário de contato
    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });

        // Validação em tempo real
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;
        let isValid = true;
        let errorMessage = '';

        // Remover classes de erro anteriores
        field.classList.remove('is-invalid');

        // Validações específicas
        if (!value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório.';
        } else if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, insira um email válido.';
            }
        } else if (name === 'phone') {
            const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, insira um telefone válido.';
            }
        } else if (name === 'message' && value.length < 10) {
            isValid = false;
            errorMessage = 'A mensagem deve ter pelo menos 10 caracteres.';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        // Remover feedback anterior
        const existingFeedback = field.parentNode.querySelector('.invalid-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Adicionar novo feedback
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = message;
        field.parentNode.appendChild(feedback);
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.remove();
        }
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validar todos os campos
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showAlert('Por favor, corrija os erros no formulário.', 'danger');
            return;
        }

        // Mostrar indicador de carregamento
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        try {
            // Simular envio (substituir por integração real)
            await this.simulateFormSubmission(data);
            
            // Sucesso
            this.showAlert('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
            form.reset();
            
            // Abrir cliente de email como fallback
            this.openEmailClient(data);
            
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            this.showAlert('Erro ao enviar mensagem. Tente novamente.', 'danger');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async simulateFormSubmission(data) {
        // Simular delay de rede
        return new Promise(resolve => setTimeout(resolve, 1500));
    }

    openEmailClient(data) {
        const subject = encodeURIComponent('Contato pelo Portfólio');
        const body = encodeURIComponent(
            `Nome: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Telefone: ${data.phone || 'Não informado'}\n\n` +
            `Mensagem:\n${data.message}`
        );
        
        const mailtoLink = `mailto:jessica.sousa.dev@email.com?subject=${subject}&body=${body}`;
        window.open(mailtoLink);
    }

    showAlert(message, type = 'info') {
        // Remover alertas existentes
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Criar novo alerta
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} custom-alert position-fixed`;
        alert.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;

        document.body.appendChild(alert);

        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }

    // Configurar scroll suave
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.navbar-nav a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Método público para recarregar citação
    refreshQuote() {
        this.loadInspirationalQuote();
    }
}

// Utilidades adicionais
class PortfolioUtils {
    static formatPhoneNumber(phone) {
        // Remove caracteres não numéricos
        const cleaned = phone.replace(/\D/g, '');
        
        // Formatar como (XX) XXXXX-XXXX
        if (cleaned.length === 11) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        } else if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
        }
        
        return phone;
    }

    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Texto copiado para a área de transferência');
        }).catch(err => {
            console.error('Erro ao copiar texto:', err);
        });
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar o portfolio
    window.portfolio = new PortfolioAPI();
    
    // Adicionar funcionalidades extras
    const phoneInputs = document.querySelectorAll('input[name="phone"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', PortfolioUtils.debounce((e) => {
            e.target.value = PortfolioUtils.formatPhoneNumber(e.target.value);
        }, 300));
    });
    
    // Configurar navbar transparente no scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
});

// Adicionar CSS dinâmico para navbar scrolled
const style = document.createElement('style');
style.textContent = `
    .navbar-scrolled {
        background: rgba(102, 126, 234, 0.95) !important;
        backdrop-filter: blur(10px);
    }
`;
document.head.appendChild(style);

// Expor funções globalmente se necessário
window.PortfolioUtils = PortfolioUtils;