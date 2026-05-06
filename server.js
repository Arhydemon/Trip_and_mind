const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// ====================== MIDDLEWARE ======================
// Эти строки ДОЛЖНЫ быть в самом начале!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Раздаём статические файлы (css, js, images)
app.use(express.static(path.join(__dirname, 'public')));

// ====================== РОУТЫ ======================

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// JSON файлы
app.get('/data/gallery.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'gallery.json'));
});

app.get('/data/news.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'news.json'));
});

// ==================== ФОРМА ====================
app.post('/api/contact', (req, res) => {
    console.log('Получено тело запроса:', req.body); // ← для отладки

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'Заполните все поля!' 
        });
    }

    const entry = {
        date: new Date().toLocaleString('ru-RU'),
        name: name.trim(),
        email: email.trim(),
        message: message.trim()
    };

    const messagesPath = path.join(__dirname, 'messages.json');

    fs.readFile(messagesPath, 'utf8', (err, data) => {
        let messages = [];
        if (!err && data) {
            try { messages = JSON.parse(data); } catch(e) {}
        }

        messages.push(entry);

        fs.writeFile(messagesPath, JSON.stringify(messages, null, 2), (err) => {
            if (err) {
                console.error('Ошибка сохранения:', err);
                return res.status(500).json({ success: false, message: 'Ошибка сервера' });
            }

            console.log('НОВАЯ ЗАЯВКА СОХРАНЕНА:');
            console.table(entry);

            res.json({ 
                success: true, 
                message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.' 
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});