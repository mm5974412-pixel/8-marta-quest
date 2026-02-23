<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Тени Топкапы — интерактивная сага</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div class="bg-layer"></div>
    <div class="particles" aria-hidden="true"></div>

    <main class="app">
      <header class="topbar panel">
        <div>
          <h1>Тени Топкапы</h1>
          <p class="subtitle">Дворцовая драма о власти, любви и цене выбора</p>
        </div>
        <div class="top-actions">
          <button id="soundBtn" class="ghost-btn">🔈 Звук: вкл</button>
          <button id="restartBtn" class="ghost-btn">Начать заново</button>
        </div>
      </header>

      <section class="hero panel">
        <img src="assets/topkapi-arch.svg" alt="Интерьер дворца Топкапы" class="hero-image" />
        <div class="hero-overlay">
          <span id="chapterTag" class="tag">Пролог</span>
          <span id="weekTag" class="tag alt">Неделя 1</span>
          <span id="archetypeTag" class="tag alt">Выбор роли</span>
        </div>
      </section>

      <section class="grid">
        <aside class="panel side-left">
          <h2>Характеристики</h2>
          <div id="stats"></div>

          <h2>Ресурсы интриг</h2>
          <div id="resources"></div>

          <h2>Действующие клятвы</h2>
          <ul id="pledges" class="small-list"></ul>
        </aside>

        <section class="panel story-panel">
          <h2 id="sceneTitle">Под сводами Топкапы</h2>
          <p id="sceneText" class="typewriter"></p>
          <ul id="consequences" class="consequences"></ul>
          <div id="choices" class="choices"></div>
        </section>

        <aside class="panel side-right">
          <h2>Отношения при дворе</h2>
          <div id="relations"></div>

          <div class="portraits">
            <img src="assets/portrait-sultan.svg" alt="Портрет султана" />
            <img src="assets/portrait-valide.svg" alt="Портрет валиде" />
          </div>

          <h2>Лента последствий</h2>
          <ul id="eventLog" class="small-list"></ul>
        </aside>
      </section>
    </main>

    <script>window.__TOPKAPI_BOOTED = false;</script>
    <script src="./game.js?v=hotfix2"></script>
    <script>
      setTimeout(function () {
        if (window.__TOPKAPI_BOOTED) return;

        var stats = document.getElementById("stats");
        var resources = document.getElementById("resources");
        var relations = document.getElementById("relations");
        var sceneTitle = document.getElementById("sceneTitle");
        var sceneText = document.getElementById("sceneText");
        var choices = document.getElementById("choices");
        var log = document.getElementById("eventLog");

        if (sceneTitle) sceneTitle.textContent = "Режим восстановления";
        if (sceneText) sceneText.textContent = "Основной скрипт игры не загрузился (обычно это кэш/локальное открытие файла). Временный режим активирован: вы можете начать сюжет прямо сейчас.";

        if (stats) stats.innerHTML = '<div class="metric"><label><span>Влияние</span><span>40</span></label><div class="bar"><div class="fill" style="width:40%"></div></div></div>';
        if (resources) resources.innerHTML = '<div class="metric"><label><span>Тайные сведения</span><span>1</span></label><div class="bar"><div class="fill" style="width:20%"></div></div></div>';
        if (relations) relations.innerHTML = '<div class="metric"><label><span>Султан</span><span>0</span></label><div class="bar"><div class="fill" style="width:50%"></div></div></div>';
        if (log) log.innerHTML = '<li>Включен резервный режим: обновите страницу с Ctrl+F5.</li><li>Если открываете файл напрямую, лучше запустите локальный сервер.</li>';

        if (choices) {
          choices.innerHTML = '';
          var a = document.createElement('button');
          a.className = 'choice-btn';
          a.textContent = 'Начать пролог (резервно)';
          a.onclick = function () {
            sceneTitle.textContent = 'Под сводами Топкапы';
            sceneText.textContent = 'Вы входите во дворец как неизвестная фигура. Первый шепот уже несет угрозу и шанс.';
            choices.innerHTML = '';
            var b = document.createElement('button');
            b.className = 'choice-btn';
            b.textContent = 'Сделать осторожный ход';
            b.onclick = function () {
              sceneTitle.textContent = 'Первый союз';
              sceneText.textContent = 'Вы нашли союзника среди слуг. История запущена — попробуйте перезагрузить страницу, чтобы включить полный режим.';
              choices.innerHTML = '';
            };
            choices.appendChild(b);
          };
          choices.appendChild(a);
        }
      }, 250);
    </script>
  </body>
</html>
