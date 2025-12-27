const categories = [
  { id: 'album', name: 'Альбом года' },
  { id: 'ep', name: 'EP / Макси-сингл года' },
  { id: 'single', name: 'Сингл года' },
  { id: 'hit', name: 'Хит года' },
  { id: 'fit', name: 'Фит года' },
  { id: 'fail', name: 'Провал года' },
  { id: 'cover', name: 'Обложка года' },
  { id: 'artist', name: 'Артист года' },
  { id: 'fresh', name: 'Фрешмен года' },
  { id: 'comeback', name: 'Камбэк года' },
  { id: 'cringe', name: 'Кринж года' }
];

const form = document.getElementById('yearForm');

categories.forEach(cat => {
  const block = document.createElement('div');
  block.className = 'category';

  const header = document.createElement('div');
  header.className = 'dropdown-header';
  header.textContent = cat.name;

  const list = document.createElement('div');
  list.className = 'dropdown-list';

  DATA[cat.id].forEach(item => {
    const card = document.createElement('div');
    card.className = 'cover-card';

    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.name;

    const span = document.createElement('span');
    span.textContent = item.name;

    card.append(img, span);

    card.onclick = () => {
      card.classList.toggle('selected');
    };

    list.appendChild(card);
  });

  header.onclick = () => {
    list.classList.toggle('open');
  };

  block.append(header, list);
  form.appendChild(block);
});

document.getElementById('sendBtn').onclick = async () => {
  const result = {};

  categories.forEach(cat => {
    const selected = Array.from(
      document.querySelectorAll('.category .cover-card.selected')
    )
      .filter(card =>
        card.closest('.category')
          .querySelector('.dropdown-header')
          .textContent === cat.name
      )
      .map(card => card.querySelector('span').textContent);

    result[cat.name] = selected;
  });

  // Формируем текст
  let text = "🎵 *Итоги года*\n\n";
  for (const key in result) {
    if (result[key].length) {
      text += `*${key}:*\n`;
      result[key].forEach(item => {
        text += `• ${item}\n`;
      });
      text += "\n";
    }
  }

  // 🔴 ТВОЙ ТОКЕН И CHAT_ID
  const TOKEN = "8584752558:AAH_FAFKhuTzp7E8AP9oelHTl_TZoX5LLEg";
  const CHAT_ID = "743385247";

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: "Markdown"
        })
      }
    );

    const data = await response.json();

    if (data.ok) {
      alert("Итоги отправлены!");
    } else {
      console.error(data);
      alert("Ошибка отправки");
    }
  } catch (e) {
    console.error(e);
    alert("Ошибка соединения с Telegram");
  }
};
