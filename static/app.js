// Получаем элементы управления
const leftBtn = document.getElementById('left');
const rightBtn = document.getElementById('right');
const cards = document.getElementById('cards');
const search = document.getElementById('search');
const search_input = document.getElementById('search_input');
const seriesBtn = document.getElementById('Series'); 
const moviesBtn = document.getElementById('Movies'); 

// Обработчик клика на левую кнопку прокрутки
leftBtn.addEventListener('click', () => {
  cards.scrollLeft -= 354; // Прокручиваем влево на 354px
});

// Обработчик клика на правую кнопку прокрутки
rightBtn.addEventListener('click', () => {
  cards.scrollLeft += 354; // Прокручиваем вправо на 354px
});

// URL JSON-файла с данными
let json_url = "static/movie.json";
let allData = []; // Переменная для хранения всех данных

// Функция для извлечения ID из YouTube URL
function getYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Функция для создания карточек
function renderCards(data) {
  cards.innerHTML = ''; // Очищаем контейнер перед добавлением новых карточек
  data.forEach((ele, i) => {
    let { name, imdb, description, product, date, sposter, bposter, genre, type, url, trailer, low, medium, high } = ele;
    let card = document.createElement('a');
    card.classList.add("card");
    card.href = url;
    card.innerHTML = `
      <img src="${sposter}" alt="${name}" class="poster">
      <div class="rest_card">
          <img src="${bposter}" alt="">
          <div class="cont">
              <h4>${name}</h4>
              <div class="sub">
                  <p>${genre}, ${date}</p>
                  <h3><span>IMBD </span> <i class="bi bi-star-fill"></i> ${imdb}</h3>
              </div>
          </div>
      </div>
    `;
    cards.appendChild(card);
  });
}

// Функция для обновления главного контента
function updateMainContent(item) {
  // Получаем элемент видео (предполагается, что это <video> или <iframe>)
  const videoElement = document.getElementById('video');
  
  // Если это HTML5 <video> элемент
  if (videoElement.tagName === 'VIDEO') {
    videoElement.src = item.trailer;
    videoElement.load(); // Перезагружаем видео
  } 
  // Если это YouTube iframe
  else if (videoElement.tagName === 'IFRAME') {
    // Для YouTube нужно обновить src iframe
    videoElement.src = `https://www.youtube.com/embed/${getYouTubeId(item.trailer)}`;
  }
  // Если это просто текст (как в вашем оригинальном коде)
  else {
    videoElement.innerText = item.trailer;
  }

  // Обновляем остальную информацию
  document.getElementById('play').href = item.url;
  document.getElementById('title').innerText = item.name;
  document.getElementById('description').innerText = item.description;
  document.getElementById('gen').innerText = item.genre;
  document.getElementById('date').innerText = item.date;
  document.getElementById('rate').innerHTML = `<span>IMBD </span> <i class="bi bi-star-fill"></i>${item.imdb}`;
  document.getElementById('product').innerText = item.product;
}


// Функция для инициализации поиска (всегда использует все данные)
function initSearch() {
  search.innerHTML = ''; // Очищаем результаты поиска
  allData.forEach(element => {
    let { name, imdb, description, product, date, sposter, bposter, genre, type, url, trailer, low, medium, high } = element;
    let card = document.createElement('a');
    card.classList.add("card");
    card.href = url;
    card.innerHTML = `
      <img src="${sposter}" alt="${name}">
      <div class="cont">
          <h3>${name}</h3>
          <p>${genre}, ${date}  <span>IMBD </span> <i class="bi bi-star-fill"></i> ${imdb}</p>
      </div>
    `;
    search.appendChild(card);
  });
}

// Загружаем JSON-файл
fetch(json_url)
  .then(response => response.json())
  .then(data => {
    allData = data; // Сохраняем данные для дальнейшего использования
    
    // Инициализация при загрузке
    renderCards(allData);
    if (allData.length > 0) {
      updateMainContent(allData[0]);
    }
    initSearch(); // Инициализируем поиск по всем данным
    
    // Обработчик поиска
    search_input.addEventListener('keyup', () => {
      let filter = search_input.value.toUpperCase();
      let a = search.getElementsByTagName('a');
      let hasVisibleCards = false;

      for (let i = 0; i < a.length; i++) {
        let b = a[i].getElementsByClassName('cont')[0];
        let TextValue = b.textContent || b.innerText;
        if (TextValue.toUpperCase().indexOf(filter) > -1) {
          a[i].style.display = "flex";
          hasVisibleCards = true;
        } else {
          a[i].style.display = "none";
        }
      }

      if (search_input.value !== "") {
        search.style.visibility = hasVisibleCards ? "visible" : "hidden";
        search.style.opacity = hasVisibleCards ? 1 : 0;
      } else {
        search.style.visibility = "hidden";
        search.style.opacity = 0;
      }
    });
    
    // Обработчик для кнопки "Сериалы"
    seriesBtn.addEventListener('click', () => {
      const seriesData = allData.filter(item => item.type === 'series');
      renderCards(seriesData);
      if (seriesData.length > 0) {
        updateMainContent(seriesData[0]);
      }
      // Не обновляем поиск - он остается по всем данным
    });

    // Обработчик для кнопки "Фильмы"
    moviesBtn.addEventListener('click', () => {
      const moviesData = allData.filter(item => item.type === 'movie');
      renderCards(moviesData);
      if (moviesData.length > 0) {
        updateMainContent(moviesData[0]);
      }
      // Не обновляем поиск - он остается по всем данным
    });

    // Обработчик для кнопки "Все" (если есть)
    const allBtn = document.getElementById('HOME');
    if (allBtn) {
      allBtn.addEventListener('click', () => {
        renderCards(allData);
        if (allData.length > 0) {
          updateMainContent(allData[0]);
        }
      });
    }
  })
  .catch(error => {
    console.error('Ошибка при загрузке данных:', error);
  });