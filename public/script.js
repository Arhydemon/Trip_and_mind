document.addEventListener('DOMContentLoaded', () => {

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in, .fade-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // ================= HERO SLIDER =================
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const heroSlider = document.querySelector('.hero-slider');

    let current = 0;
    let autoSlide;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        if (slides[n]) slides[n].classList.add('active');
    }

    function nextSlide() {
        current = (current + 1) % slides.length;
        showSlide(current);
    }

    function prevSlide() {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
    }

    function startAutoSlide() {
        autoSlide = setInterval(nextSlide, 4800);
    }

    function stopAutoSlide() {
        clearInterval(autoSlide);
    }

    if (slides.length > 0) {
        showSlide(0);
        startAutoSlide();
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', stopAutoSlide);
        heroSlider.addEventListener('mouseleave', startAutoSlide);
    }

    // ================= ГАЛЕРЕЯ + НОВОСТИ =================
    async function loadData() {
        try {
            const [galRes, newsRes] = await Promise.all([
                fetch('/data/gallery.json'),
                fetch('/data/news.json')
            ]);

            const gallery = await galRes.json();
            const news = await newsRes.json();

            const galleryEl = document.getElementById('gallery-list');
            const newsEl = document.getElementById('news-list');

            if (galleryEl) {
                galleryEl.innerHTML = gallery.map(item => `
                    <div class="gallery-item fade-in">
                        <img src="${item.img}" alt="${item.title}">
                        <div style="padding: 16px 12px;">
                            <h3 style="margin: 0 0 6px 0; color: #ffd33d;">${item.title}</h3>
                            ${item.desc ? `<p style="margin:0; font-size:0.95rem; opacity:0.9;">${item.desc}</p>` : ''}
                        </div>
                    </div>
                `).join('');
            }

            if (newsEl) {
                newsEl.innerHTML = news.map(item => `
                    <div class="news-item fade-in">
                        <img src="${item.img}" 
                             alt="${item.title}" 
                             style="width:100%; height:200px; object-fit:cover; border-radius: 16px 16px 0 0;">
                        <div style="padding: 20px;">
                            <small style="color:#ffd33d; font-weight:500;">${item.date}</small>
                            <h3 style="margin:10px 0 8px; font-size:20px;">${item.title}</h3>
                            <p style="margin:0; line-height:1.65; opacity:0.92;">${item.text}</p>
                        </div>
                    </div>
                `).join('');
            }

            document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
            console.log('Галерея и новости успешно загружены');

        } catch (err) {
            console.error('Ошибка загрузки данных:', err);
        }
    }

    loadData();

    // ================= ФОРМА ОБРАТНОЙ СВЯЗИ =================
    const form = document.getElementById('feedback-form');
    const status = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (status) {
                status.textContent = 'Отправляем...';
                status.style.color = '#35f7e0';
                status.classList.remove('success', 'error');
            }

            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(new FormData(form))
                });

                const result = await res.json();

                if (result.success) {
                    if (status) {
                        status.innerHTML = `
                            Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время<br>
                        `;
                        status.classList.add('success');
                    }
                    form.reset();
                } else {
                    if (status) {
                        status.textContent = result.message || 'Ошибка отправки';
                        status.classList.add('error');
                    }
                }
            } catch (err) {
                console.error(err);
                if (status) {
                    status.textContent = 'Не удалось отправить. Проверь сервер.';
                    status.classList.add('error');
                }
            }
        });
    }

});