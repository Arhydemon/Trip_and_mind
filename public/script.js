document.addEventListener('DOMContentLoaded', () => {
    // это специальный наблюдатель который смотрит когда элементы появляются на экране при прокрутке
    // он нужен чтобы элементы красиво выезжали а не просто сразу были видны
    const observer = new IntersectionObserver((entries) => {
        // entries это массив всех элементов которые мы сейчас наблюдаем
        // forEach это цикл который берет каждый элемент по очереди
        entries.forEach(entry => {
            // isIntersecting значит что элемент сейчас видно на экране хотя бы на 15 процентов
            if (entry.isIntersecting) {
                // если видно то добавляем класс show который в css делает элемент видимым
                // без этого класса элемент обычно прозрачный или сдвинутый
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.15 });  // threshold 0.15 = 15 процентов элемента должно быть видно чтобы сработало

    // ищем все элементы с классами fade-in и fade-on-scroll
    // querySelectorAll возвращает список всех таких элементов на странице
    document.querySelectorAll('.fade-in, .fade-on-scroll').forEach(el => {
        // для каждого найденного элемента говорим наблюдателю за ним следить
        observer.observe(el);
    });

    // HERO SLIDER
    const slides = document.querySelectorAll('.slide');
    // prevBtn это кнопка назад которую мы нашли по id
    const prevBtn = document.getElementById('prevBtn');
    // nextBtn это кнопка вперед
    const nextBtn = document.getElementById('nextBtn');
    // heroSlider это весь блок со слайдером
    const heroSlider = document.querySelector('.hero-slider');

    // current это номер текущего слайда начинаем с нуля
    let current = 0;
    // autoSlide это таймер автоматического переключения
    let autoSlide;

    // функция которая показывает слайд под номером n
    function showSlide(n) {
        // сначала убираем класс active у всех слайдов чтобы они все стали невидимыми
        slides.forEach(slide => slide.classList.remove('active'));
        // проверяем что слайд с таким номером вообще существует
        if (slides[n]) {
            // если существует то добавляем ему класс active и он становится видимым
            slides[n].classList.add('active');
        }
    }

    // функция для переключения на следующий слайд
    function nextSlide() {
        // увеличиваем current на 1 а если дошли до конца то % slides length вернет нас в начло
        // цикл
        current = (current + 1) % slides.length;
        // вызываем showSlide чтобы показать новый слайд
        showSlide(current);
    }

    // функция для переключения на предыдущий слайд
    function prevSlide() {
        // уменьшаем current на 1 а если ушли в минус то + slides.length вернет нас в конец
        current = (current - 1 + slides.length) % slides.length;
        // показываем предыдущий слайд
        showSlide(current);
    }

    // функция которая запускает автоматическое перелистывание слайдов
    function startAutoSlide() {
        // setInterval вызывает nextSlide каждые 4.8 секунды
        autoSlide = setInterval(nextSlide, 4800);
    }

    // функция которая останавливает автоматическое перелистывание
    function stopAutoSlide() {
        // clearInterval останавливает таймер который мы запустили выше
        clearInterval(autoSlide);
    }

    // провка что слайды вообще есть на странице
    if (slides.length > 0) {
        // показываем самый первый слайд
        showSlide(0);
        // запускаем авто переключение
        startAutoSlide();
    }

    // если кнопка nextBtn существует то при клике на нее вызываем nextSlide
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    // то же самое для кнопки назад
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // если весь блок heroSlider существует то настраиваем паузу при наведении мыши
    if (heroSlider) {
        // когда мышка заехала на слайдер останавливаем авто
        heroSlider.addEventListener('mouseenter', stopAutoSlide);
        // когда мышка уехала запускаем авто снова
        heroSlider.addEventListener('mouseleave', startAutoSlide);
    }

    // ГАЛЕРЕЯ + НОВОСТИ
    async function loadData() {
        try {
            const [galRes, newsRes] = await Promise.all([
                // fetch это способ попросить данные с сервера по адресу
                fetch('/data/gallery.json'),
                fetch('/data/news.json')
            ]);
            const gallery = await galRes.json();
            const news = await newsRes.json();
            // находим на странице место куда будем вставлять галерею
            const galleryEl = document.getElementById('gallery-list');
            // то же самое для новостей они кстати у меня дебильные 
            const newsEl = document.getElementById('news-list');
            // если место для галереи существует то вставляем туда хтмл
            if (galleryEl) {
                // map это цикл фор в питончике
                galleryEl.innerHTML = gallery.map(item => `
                    <div class="gallery-item fade-in">
                        <img src="${item.img}" alt="${item.title}">
                        <div style="padding: 16px 12px;">
                            <h3 style="margin: 0 0 6px 0; color: #ffd33d;">${item.title}</h3>
                            ${item.desc ? `<p style="margin:0; font-size:0.95rem; opacity:0.9;">${item.desc}</p>` : ''}
                        </div>
                    </div>
                `).join('');  // соединяет все кусочки в одну большую строку html
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

            // после того как вставили новые элементы снова настраиваем на них наблюдатель
            // чтобы они тоже красиво появлялись при прокрутке
            document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
            console.log('Галерея и новости успешно загружены');

        } catch (err) {
            console.error('Ошибка загрузки данных:', err);
        }
    }

    // функци загрузки данных
    loadData();

    // ФОРМА ОБРАТНОЙ СВЯЗИ
    // тут код для формы где человек пишет имя почту и сообщение
    const form = document.getElementById('feedback-form');
    const status = document.getElementById('form-status');

    // если форма существует то настраиваем что будет при отправке
    if (form) {
        form.addEventListener('submit', async (e) => {
            // e.preventDefault() отменяет обычное поведение формы
            // без этого страница перезагрузилась бы и все данные пропали
            e.preventDefault();

            if (status) {
                // данные отправляются
                status.textContent = 'Отправляем...';
                status.style.color = '#35f7e0';
                status.classList.remove('success', 'error');
            }

            try {
                // отправляем данные на сервер по адресу /api/contact методом POST
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    // FormData собирает все поля из формы а URLSearchParams делает из них строку
                    body: new URLSearchParams(new FormData(form))
                });
                // превращаем ответ сервера в объект
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
                    // если сервер сказал что ошибка то сообщение
                    if (status) {
                        status.textContent = result.message || 'Ошибка отправки';
                        status.classList.add('error');
                    }
                }
            } catch (err) {
                // если вообще ниче не получилось связаться с сервером
                console.error(err);
                if (status) {
                    status.textContent = 'Не удалось отправить. Проверь сервер.';
                    status.classList.add('error');
                }
            }
        });
    }

});