const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, v));

const initialState = () => ({
  archetype: null,
  chapter: "Пролог",
  influence: 35,
  reputation: 45,
  trust: 40,
  love: 25,
  fear: 20,
  cunning: 40,
  dynasty: 50,
  relations: {
    sultan: 0,
    valide: 0,
    rival: 0,
    vizier: 0,
    shehzade: 0,
    ally: 0,
  },
  flags: {
    savedRival: false,
    forgedLetter: false,
    exposedConspiracy: false,
    choseFearPath: false,
  },
  log: [],
});

const relationLabels = {
  sultan: "Султан",
  valide: "Валиде",
  rival: "Главная соперница",
  vizier: "Великий визирь",
  shehzade: "Шехзаде",
  ally: "Тайный союзник",
};

const characterStats = [
  ["influence", "Влияние"],
  ["reputation", "Репутация"],
  ["trust", "Доверие"],
  ["love", "Любовь"],
  ["fear", "Страх"],
  ["cunning", "Хитрость"],
  ["dynasty", "Судьба династии"],
];

let state = initialState();

const scenes = {
  start: {
    chapter: "Пролог",
    title: "Под сводами Топкапы",
    text: "Ночь пахнет розовой водой и воском. Вас проводят через внутренний двор, где шепот служанок сильнее барабанов янычар. Сегодня вы — никто. Завтра вы можете стать чьей-то тайной, чей-то угрозой или жертвой дворцовой памяти.",
    choices: [
      {
        text: "Я — новая девушка в гареме. Я выберу путь сердца и выживания.",
        apply: (s) => {
          s.archetype = "Новая в гареме";
          s.love += 8;
          s.reputation += 5;
          pushLog(s, "Вы входите в гарем как незаметная фигура, но с цепким взглядом.");
        },
        next: "act1_seal",
      },
      {
        text: "Я — молодой приближенный дивана. Я выберу путь власти и расчета.",
        apply: (s) => {
          s.archetype = "Молодой приближенный";
          s.influence += 8;
          s.cunning += 5;
          s.relations.vizier += 10;
          pushLog(s, "Вы начинаете службу при диване, где каждое слово может стать оружием.");
        },
        next: "act1_seal",
      },
    ],
  },
  act1_seal: {
    chapter: "Акт I",
    title: "Обвинение перед праздником",
    text: "Перед главным праздником фаворитку обвиняют в краже дворцовой печати. Валиде требует немедленного решения. Взгляды обращены на вас: от вашей фразы зависит, кто сегодня уцелеет.",
    choices: [
      {
        text: "Открыто защитить обвиняемую и потребовать справедливого суда.",
        effects: [
          ["trust", +12],
          ["reputation", +8],
          ["fear", -4],
          ["relations.valide", -6],
          ["relations.rival", +9],
        ],
        setFlags: { savedRival: true },
        result: [
          ["good", "Вы показали милосердие, и это заметили те, кто устал от жестокости."],
          ["bad", "Валиде считает вас слишком мягким(ой) в опасный момент."],
        ],
        next: "act2_alliance",
      },
      {
        text: "Поддержать обвинение ради дисциплины и порядка.",
        effects: [
          ["fear", +14],
          ["influence", +7],
          ["reputation", -8],
          ["relations.valide", +8],
          ["relations.rival", -14],
        ],
        setFlags: { choseFearPath: true },
        result: [
          ["good", "Сильные фигуры двора ценят вашу решительность."],
          ["bad", "Часть двора шепчет, что вы жестоки ради выгоды."],
        ],
        next: "act2_alliance",
      },
      {
        text: "Тайно отложить вердикт и начать расследование.",
        check: (s) => s.cunning >= 40,
        onFail: [
          ["bad", "Следы оказались подчищены, а ваше колебание сочли слабостью."],
        ],
        failEffects: [
          ["trust", -7],
          ["relations.valide", -5],
        ],
        effects: [
          ["cunning", +10],
          ["trust", +7],
          ["relations.ally", +8],
          ["relations.vizier", +4],
        ],
        result: [["good", "Вы нашли несостыковки и получили ниточку к тайному заговору."]],
        next: "act2_alliance",
      },
      {
        text: "Использовать скандал для шантажа обеих сторон.",
        effects: [
          ["influence", +11],
          ["cunning", +8],
          ["trust", -10],
          ["relations.ally", -8],
        ],
        setFlags: { forgedLetter: true },
        result: [
          ["good", "Вы быстро усилили позиции в кулуарах."],
          ["bad", "Ваши методы вызывают недоверие даже у союзников."],
        ],
        next: "act2_alliance",
      },
    ],
  },
  act2_alliance: {
    chapter: "Акт II",
    title: "Коалиция шепота",
    text: "Двор раскалывается. Визирь предлагает вам протекцию в обмен на лояльность реформам, а в гареме зовут в союз против его людей. Одновременно султан начинает замечать вас — неясно, как фигуру сердца или как фигуру риска.",
    choices: [
      {
        text: "Сделать ставку на визиря и аппарат власти.",
        effects: [
          ["influence", +12],
          ["relations.vizier", +16],
          ["relations.valide", -6],
          ["relations.sultan", +4],
        ],
        result: [["good", "Вы получаете прямой канал к решениям дивана."]],
        next: "act3_crisis",
      },
      {
        text: "Вступить в союз гарема и действовать через социальную сеть дворца.",
        effects: [
          ["trust", +11],
          ["relations.valide", +12],
          ["relations.vizier", -8],
          ["love", +7],
          ["relations.sultan", +5],
        ],
        result: [["good", "Вы становитесь центром неформального влияния во дворце." ]],
        next: "act3_crisis",
      },
      {
        text: "Играть на две стороны, сохраняя видимость нейтралитета.",
        effects: [
          ["cunning", +10],
          ["influence", +7],
          ["trust", -8],
        ],
        result: [
          ["good", "Вы расширяете пространство маневра."],
          ["bad", "Обе стороны начинают проверять вашу верность."],
        ],
        next: "act3_crisis",
      },
    ],
  },
  act3_crisis: {
    chapter: "Акт III",
    title: "Кризис наследования",
    text: "Слухи о покушении на шехзаде превращают двор в поле охоты. У вас в руках — перехваченное письмо с печатью, способное обрушить одну из коалиций. Одно решение может сохранить династию или дать вам рычаг абсолютного контроля.",
    choices: [
      {
        text: "Передать письмо султану и раскрыть заговор открыто.",
        effects: [
          ["dynasty", +15],
          ["reputation", +10],
          ["relations.sultan", +13],
          ["relations.shehzade", +12],
          ["influence", +6],
        ],
        setFlags: { exposedConspiracy: true },
        result: [["good", "Вы спасаете наследника и укрепляете законный порядок." ]],
        next: "act4_final",
      },
      {
        text: "Скрыть письмо и использовать его для тайного контроля над соперниками.",
        effects: [
          ["influence", +14],
          ["fear", +12],
          ["cunning", +8],
          ["dynasty", -12],
          ["trust", -10],
        ],
        setFlags: { forgedLetter: true, choseFearPath: true },
        result: [
          ["good", "Вы получили опасный рычаг давления."],
          ["bad", "Цена — растущий хаос и цепь взаимной мести."],
        ],
        next: "act4_final",
      },
      {
        text: "Уничтожить письмо и попытаться примирить враждующие стороны.",
        effects: [
          ["trust", +12],
          ["love", +10],
          ["fear", -8],
          ["dynasty", +6],
          ["influence", -5],
        ],
        result: [["good", "Вы выбрали людей, а не рычаги власти." ]],
        next: "act4_final",
      },
    ],
  },
  act4_final: {
    chapter: "Акт IV",
    title: "Цена трона",
    text: "Ночь перед решающим советом. Союзники ждут вашего последнего шага: милосердие, закон, страх или любовь. Сегодня двор запомнит не только победителя — но и цену, которой он был куплен.",
    choices: [
      {
        text: "Выбрать путь мудрого баланса: власть через доверие и закон.",
        effects: [
          ["trust", +8],
          ["reputation", +8],
          ["fear", -4],
          ["dynasty", +7],
        ],
        result: [["good", "Вы делаете ставку на устойчивость, а не на мгновенную победу." ]],
        next: "ending",
      },
      {
        text: "Выбрать путь железной руки: подавить противников страхом.",
        effects: [
          ["fear", +16],
          ["influence", +9],
          ["trust", -10],
          ["love", -6],
        ],
        setFlags: { choseFearPath: true },
        result: [["bad", "Двор склоняется перед вами — но с ненавистью в глазах." ]],
        next: "ending",
      },
      {
        text: "Выбрать любовь и личную верность, отказавшись от части власти.",
        effects: [
          ["love", +15],
          ["trust", +7],
          ["influence", -8],
          ["reputation", +4],
        ],
        result: [["good", "Вы сохраняете сердце, жертвуя политической высотой." ]],
        next: "ending",
      },
    ],
  },
};

function pushLog(s, text) {
  s.log.unshift(text);
  s.log = s.log.slice(0, 12);
}

function applyEffect(s, [path, delta]) {
  if (path.startsWith("relations.")) {
    const key = path.split(".")[1];
    s.relations[key] = clamp(s.relations[key] + delta, -100, 100);
  } else {
    s[path] = clamp(s[path] + delta);
  }
}

function applyChoice(choice) {
  const results = [];

  if (choice.apply) {
    choice.apply(state);
  }

  if (choice.check && !choice.check(state)) {
    (choice.failEffects || []).forEach((e) => applyEffect(state, e));
    (choice.onFail || []).forEach((r) => results.push(r));
  } else {
    (choice.effects || []).forEach((e) => applyEffect(state, e));
    if (choice.setFlags) Object.assign(state.flags, choice.setFlags);
    (choice.result || []).forEach((r) => results.push(r));
  }

  if (results.length) {
    results.forEach((r) => pushLog(state, r[1]));
    renderConsequences(results);
  } else {
    renderConsequences([]);
  }

  state.current = choice.next;
  render();
}

function getEnding() {
  const s = state;

  if (s.fear > 75 && s.trust < 35 && s.flags.choseFearPath) {
    return {
      title: "Железная рука",
      text: "Вы удержали двор в кулаке. Приказы выполняются мгновенно, заговорщики исчезают в тишине подвалов. Но рядом с вами не осталось тех, кто смотрит без страха.",
    };
  }

  if (s.love > 70 && s.influence < 55) {
    return {
      title: "Любовь против империи",
      text: "Вы выбрали человека, а не трон. Ваша история стала легендой о верности и утрате: счастливой для сердца, болезненной для большой политики.",
    };
  }

  if (s.dynasty < 35) {
    return {
      title: "Династическая катастрофа",
      text: "Нити интриг оборвались в крови. Слишком много тайных сделок, слишком мало правды — и империя вошла в эпоху смуты.",
    };
  }

  if (s.influence > 75 && s.cunning > 65 && s.trust >= 35) {
    return {
      title: "Тихая победа тени",
      text: "Вы не носите всех титулов, но решения проходят через вас. Двор думает, что служит старым правилам, а на деле живет по вашим.",
    };
  }

  if (s.reputation > 70 && s.trust > 65 && s.dynasty > 55) {
    return {
      title: "Власть через мудрость",
      text: "Вы стали ключевой фигурой Топкапы, сохранив и влияние, и человеческое лицо. Ваше имя произносят с уважением, а не шепотом ужаса.",
    };
  }

  return {
    title: "Падение и ссылка",
    text: "Вы переоценили союзников и недооценили память дворца. Вас удалили от центра власти, оставив только шанс когда-нибудь переписать свою судьбу.",
  };
}

const el = {
  stats: document.getElementById("stats"),
  relations: document.getElementById("relations"),
  eventLog: document.getElementById("eventLog"),
  choices: document.getElementById("choices"),
  sceneText: document.getElementById("sceneText"),
  sceneTitle: document.getElementById("sceneTitle"),
  chapterTag: document.getElementById("chapterTag"),
  archetypeTag: document.getElementById("archetypeTag"),
  consequences: document.getElementById("consequences"),
  restartBtn: document.getElementById("restartBtn"),
};

function renderStats() {
  el.stats.innerHTML = characterStats
    .map(([key, label]) => {
      const value = state[key];
      return `
      <div class="metric">
        <label><span>${label}</span><span>${value}</span></label>
        <div class="bar"><div class="fill" style="width:${value}%"></div></div>
      </div>`;
    })
    .join("");

  el.relations.innerHTML = Object.entries(relationLabels)
    .map(([key, label]) => {
      const value = state.relations[key];
      const normalized = value + 100;
      return `
      <div class="metric">
        <label><span>${label}</span><span>${value}</span></label>
        <div class="bar"><div class="fill" style="width:${normalized / 2}%"></div></div>
      </div>`;
    })
    .join("");
}

function renderLog() {
  el.eventLog.innerHTML = state.log.length
    ? state.log.map((item) => `<li>${item}</li>`).join("")
    : "<li>Пока тихо. Ваши решения скоро изменят двор.</li>";
}

function renderConsequences(items) {
  el.consequences.innerHTML = items
    .map(([type, text]) => `<li class="${type}">${text}</li>`)
    .join("");
}

function renderScene(scene) {
  el.chapterTag.textContent = scene.chapter;
  el.archetypeTag.textContent = state.archetype || "Выбор роли";
  el.sceneTitle.textContent = scene.title;
  el.sceneText.textContent = scene.text;

  el.choices.innerHTML = "";
  scene.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.text;
    btn.addEventListener("click", () => applyChoice(choice));
    el.choices.appendChild(btn);
  });
}

function renderEnding() {
  const ending = getEnding();
  el.chapterTag.textContent = "Финал";
  el.sceneTitle.textContent = ending.title;
  el.sceneText.textContent = ending.text;
  el.choices.innerHTML = `
    <div class="ending-box">
      <p>Итоговые показатели:</p>
      <p>Влияние: ${state.influence}, Доверие: ${state.trust}, Любовь: ${state.love}, Страх: ${state.fear}, Судьба династии: ${state.dynasty}</p>
    </div>
    <button class="choice-btn" id="playAgain">Пройти снова и изменить судьбу</button>
  `;

  document.getElementById("playAgain").addEventListener("click", restart);
}

function render() {
  renderStats();
  renderLog();

  if (state.current === "ending") {
    renderEnding();
    return;
  }

  const scene = scenes[state.current];
  renderScene(scene);
}

function restart() {
  state = { ...initialState(), current: "start" };
  renderConsequences([]);
  render();
}

el.restartBtn.addEventListener("click", restart);
restart();
