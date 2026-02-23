const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const initialState = () => ({
  week: 1,
  current: "start",
  archetype: null,
  chapter: "Пролог",
  stats: {
    influence: 36,
    reputation: 46,
    trust: 42,
    love: 28,
    fear: 18,
    cunning: 41,
    dynasty: 50,
  },
  resources: {
    secrets: 1,
    favors: 1,
    leverage: 0,
  },
  tensions: {
    harem: 28,
    divan: 28,
    suspicion: 18,
  },
  relations: {
    sultan: 0,
    valide: 0,
    rival: 0,
    vizier: 0,
    shehzade: 0,
    ally: 0,
  },
  pledges: [],
  delayed: [],
  flags: {
    alliance: null,
    romance: false,
    mercyPath: false,
    fearPath: false,
    lawPath: false,
  },
  log: [],
  soundOn: true,
});

let state = initialState();

const relNames = {
  sultan: "Султан",
  valide: "Валиде",
  rival: "Соперница",
  vizier: "Визирь",
  shehzade: "Шехзаде",
  ally: "Тайный союзник",
};

const statNames = {
  influence: "Влияние",
  reputation: "Репутация",
  trust: "Доверие",
  love: "Любовь",
  fear: "Страх",
  cunning: "Хитрость",
  dynasty: "Судьба династии",
};

const resourceNames = {
  secrets: "Тайные сведения",
  favors: "Долги и услуги",
  leverage: "Компромат",
};

const scenes = {
  start: {
    chapter: "Пролог",
    weekJump: 0,
    title: "Первый шаг под сводами дворца",
    text: (s) =>
      "Вас проводят через галереи, где каждый шепот имеет цену. В Топкапы не побеждают одним ходом — здесь судьбу меняют осторожные уступки, запомненные обещания и чужие слабости.",
    choices: [
      {
        text: "Путь гарема: действовать через доверие, внимание и эмоциональные союзы.",
        apply: (s) => {
          s.archetype = "Новая в гареме";
          modStat(s, "love", +7);
          modStat(s, "trust", +5);
          modRel(s, "valide", +4);
          modRel(s, "rival", +2);
          addPledge(s, "Вы обещали служанке Зейнеп защиту в обмен на слухи.");
          log(s, "Вы выбрали мягкую силу — через сеть людей, а не приказы.");
        },
        next: "seal_trial",
      },
      {
        text: "Путь дивана: действовать через должности, документы и власть слова.",
        apply: (s) => {
          s.archetype = "Молодой приближенный";
          modStat(s, "influence", +7);
          modStat(s, "cunning", +5);
          modRel(s, "vizier", +6);
          addPledge(s, "Вы пообещали визирю поддержать его кандидатуру в диване.");
          log(s, "Вы вошли в игру, где печать иногда сильнее клинка.");
        },
        next: "seal_trial",
      },
    ],
  },

  seal_trial: {
    chapter: "Акт I",
    weekJump: 1,
    title: "Дело о печати",
    text: (s) =>
      `Перед праздником фаворитку обвиняют в краже печати. ${
        s.archetype === "Новая в гареме"
          ? "Вы видите страх в глазах женщин: сегодня могут наказать невиновную."
          : "Вы понимаете: вердикт станет сигналом для всех фракций дворца."
      }`,
    choices: [
      {
        text: "Защитить обвиняемую и потребовать тайное расследование перед приговором.",
        gradual: true,
        apply: (s) => {
          modStat(s, "trust", +8);
          modStat(s, "reputation", +6);
          modStat(s, "fear", -3);
          modRel(s, "rival", +6);
          modRel(s, "valide", -3);
          modTension(s, "harem", -4);
          modTension(s, "suspicion", +3);
          s.flags.mercyPath = true;
          queueDelayed(s, 2, {
            text: "Спасенная фаворитка тайно передает вам имя писца, подделывавшего распоряжения.",
            type: "good",
            run: () => {
              modResource(s, "secrets", +1);
              modRel(s, "ally", +5);
            },
          });
          log(s, "Вы не ломаете систему сразу — вы смещаете ее в сторону справедливости.");
        },
        next: "night_market",
      },
      {
        text: "Поддержать обвинение, но добиться смягченного наказания вместо казни.",
        gradual: true,
        apply: (s) => {
          modStat(s, "fear", +6);
          modStat(s, "influence", +5);
          modStat(s, "reputation", -2);
          modRel(s, "valide", +5);
          modRel(s, "rival", -7);
          modTension(s, "harem", +5);
          modTension(s, "divan", -3);
          s.flags.fearPath = true;
          queueDelayed(s, 2, {
            text: "Наказанная сторона не забыла вашего решения и готовит холодную месть.",
            type: "bad",
            run: () => {
              modRel(s, "rival", -5);
              modTension(s, "suspicion", +6);
            },
          });
          log(s, "Вы показали жесткость, но не перешли к необратимой жестокости.");
        },
        next: "night_market",
      },
      {
        text: "Не объявлять приговор: собрать улики через людей кухни, писцов и евнухов.",
        gradual: true,
        requires: (s) => s.stats.cunning >= 40,
        failText: "Не все ниточки удалось сохранить: часть улик уничтожили до вашего приказа.",
        fail: (s) => {
          modStat(s, "trust", -4);
          modTension(s, "suspicion", +5);
        },
        apply: (s) => {
          modStat(s, "cunning", +7);
          modResource(s, "secrets", +1);
          modRel(s, "ally", +6);
          modTension(s, "harem", -2);
          modTension(s, "divan", +2);
          log(s, "Вы выбрали медленный путь: сначала информация, потом удар.");
        },
        next: "night_market",
      },
    ],
  },

  night_market: {
    chapter: "Акт I",
    weekJump: 1,
    title: "Ночная ярмарка слухов",
    text: () =>
      "На закрытой ярмарке при дворце продают не ткани, а лояльность. Слухи о наследнике, долгах визиря и ревности в гареме можно направить в нужную сторону — если платить не только золотом, но и обещаниями.",
    choices: [
      {
        text: "Потратить услугу, чтобы выкупить список тайных встреч соперницы.",
        requires: (s) => s.resources.favors >= 1,
        failText: "Без услуг двери остаются закрытыми, а шепот обрывается на полуслове.",
        fail: (s) => modTension(s, "suspicion", +2),
        apply: (s) => {
          modResource(s, "favors", -1);
          modResource(s, "leverage", +1);
          modRel(s, "rival", -3);
          modStat(s, "cunning", +4);
          queueDelayed(s, 4, {
            text: "Компромат на соперницу пригодился в кризисе наследования.",
            type: "good",
            run: () => modStat(s, "influence", +6),
          });
          log(s, "Вы получили рычаг, который сработает позже, когда ставки вырастут.");
        },
        next: "garden_conversation",
      },
      {
        text: "Поддержать бедных служащих и создать сеть благодарных свидетелей.",
        apply: (s) => {
          modStat(s, "reputation", +7);
          modStat(s, "trust", +5);
          modRel(s, "ally", +4);
          modTension(s, "harem", -4);
          addPledge(s, "Вы обещали добиться повышения жалования дворцовой страже.");
          queueDelayed(s, 3, {
            text: "Стражник, которому вы помогли, предупредил вас о грядущем обыске покоев.",
            type: "good",
            run: () => {
              modResource(s, "secrets", +1);
              modStat(s, "trust", +3);
            },
          });
        },
        next: "garden_conversation",
      },
      {
        text: "Посеять осторожный слух о коррумпированном казначее (без открытого обвинения).",
        apply: (s) => {
          modStat(s, "influence", +5);
          modStat(s, "fear", +3);
          modTension(s, "divan", +4);
          modTension(s, "suspicion", +3);
          queueDelayed(s, 3, {
            text: "Слух подействовал: казначей ищет, кто стоял за его унижением.",
            type: "bad",
            run: () => modTension(s, "suspicion", +5),
          });
          log(s, "Вы тронули баланс денег — двор это запомнил.");
        },
        next: "garden_conversation",
      },
    ],
  },

  garden_conversation: {
    chapter: "Акт II",
    weekJump: 1,
    title: "Разговор в саду фонтанов",
    text: (s) =>
      `Вечером ${s.relations.sultan >= 4 ? "султан" : "шехзаде"} приглашает вас на прогулку без свидетелей. Речь идет не только о чувствах: рядом с признанием всегда стоит вопрос лояльности.`,
    choices: [
      {
        text: "Говорить искренне о страхе потери и цене власти.",
        apply: (s) => {
          modStat(s, "love", +10);
          modStat(s, "trust", +4);
          modRel(s, "sultan", +6);
          modRel(s, "shehzade", +5);
          s.flags.romance = true;
          queueDelayed(s, 5, {
            text: "Личная близость дает вам редкую аудиенцию перед финальным советом.",
            type: "good",
            run: () => modStat(s, "influence", +5),
          });
        },
        next: "coalition_choice",
      },
      {
        text: "Сохранить дистанцию и попросить официальную роль при дворе.",
        apply: (s) => {
          modStat(s, "influence", +8);
          modStat(s, "love", -2);
          modRel(s, "vizier", +5);
          modRel(s, "sultan", +3);
          s.flags.lawPath = true;
          log(s, "Вы выбрали статус вместо признаний.");
        },
        next: "coalition_choice",
      },
      {
        text: "Ничего не просить, а слушать — и собрать политические слабости собеседника.",
        apply: (s) => {
          modStat(s, "cunning", +6);
          modResource(s, "secrets", +1);
          modRel(s, "ally", +4);
          modTension(s, "suspicion", +2);
        },
        next: "coalition_choice",
      },
    ],
  },

  coalition_choice: {
    chapter: "Акт II",
    weekJump: 1,
    title: "Выбор коалиции",
    text: () =>
      "Двор делится на три лагеря: реформаторы визиря, традиционалисты гарема и те, кто хочет сыграть на обоих столах. Нельзя получить всё сразу — каждый союз приносит силу и новый риск.",
    choices: [
      {
        text: "Союз с визирем: продвигать реформы и централизацию власти.",
        apply: (s) => {
          s.flags.alliance = "vizier";
          modRel(s, "vizier", +12);
          modRel(s, "valide", -5);
          modStat(s, "influence", +8);
          modTension(s, "divan", -4);
          modTension(s, "harem", +5);
          addPledge(s, "Вы пообещали визирю поддержать новый налоговый указ.");
        },
        next: "festival_incident",
      },
      {
        text: "Союз с валиде: укреплять традиции и внутренний порядок дворца.",
        apply: (s) => {
          s.flags.alliance = "valide";
          modRel(s, "valide", +12);
          modRel(s, "vizier", -5);
          modStat(s, "trust", +7);
          modTension(s, "harem", -5);
          modTension(s, "divan", +4);
          addPledge(s, "Вы пообещали валиде удержать соперниц от открытой войны.");
        },
        next: "festival_incident",
      },
      {
        text: "Тонкий нейтралитет: помогать всем, но подписывать минимум обязательств.",
        apply: (s) => {
          s.flags.alliance = "neutral";
          modStat(s, "cunning", +7);
          modStat(s, "trust", -4);
          modTension(s, "suspicion", +6);
          modResource(s, "secrets", +1);
        },
        next: "festival_incident",
      },
    ],
  },

  festival_incident: {
    chapter: "Акт III",
    weekJump: 1,
    title: "Пожар в крыле архивов",
    text: (s) =>
      `Во время торжества загорается архивное крыло. ${
        s.resources.secrets >= 3
          ? "Вы заранее знаете, какие документы пытались уничтожить."
          : "Вы не уверены, что было целью пожара: компромат или случайность."
      }`,
    choices: [
      {
        text: "Спасти реестры наследования и выйти с уликами публично.",
        apply: (s) => {
          modStat(s, "dynasty", +10);
          modStat(s, "reputation", +8);
          modStat(s, "influence", +4);
          modRel(s, "sultan", +7);
          modRel(s, "shehzade", +6);
          resolvePledge(s, "налоговый указ", false);
          log(s, "Вы укрепили законность, но обидели тех, кто рассчитывал на тишину.");
        },
        next: "heir_crisis",
      },
      {
        text: "Сначала вывести людей и слуг, документы оставить спасателям.",
        apply: (s) => {
          modStat(s, "trust", +8);
          modStat(s, "love", +6);
          modStat(s, "dynasty", +3);
          modStat(s, "influence", -2);
          modTension(s, "harem", -3);
          s.flags.mercyPath = true;
          log(s, "Вы спасли жизни — и потеряли часть доказательств.");
        },
        next: "heir_crisis",
      },
      {
        text: "Использовать суматоху, чтобы перехватить личную переписку соперников.",
        requires: (s) => s.resources.secrets >= 2,
        failText: "Попытка сорвалась: слишком много глаз и слишком мало времени.",
        fail: (s) => modTension(s, "suspicion", +4),
        apply: (s) => {
          modResource(s, "leverage", +2);
          modStat(s, "cunning", +6);
          modStat(s, "fear", +5);
          modTension(s, "suspicion", +5);
          queueDelayed(s, 7, {
            text: "Компромат позволил вам сорвать объединение враждебных фракций.",
            type: "good",
            run: () => modStat(s, "influence", +7),
          });
        },
        next: "heir_crisis",
      },
    ],
  },

  heir_crisis: {
    chapter: "Акт III",
    weekJump: 1,
    title: "Кризис наследования",
    text: (s) =>
      `Шехзаде обвиняют в тайной переписке с противниками двора. Напряжение растет постепенно: сначала намеки, затем улики, потом требование немедленного суда. Подозрение: ${s.tensions.suspicion}/100.`,
    choices: [
      {
        text: "Собрать закрытый совет и разбирать обвинения по пунктам (медленный законный путь).",
        apply: (s) => {
          modStat(s, "trust", +7);
          modStat(s, "dynasty", +8);
          modStat(s, "reputation", +5);
          modStat(s, "fear", -2);
          modTension(s, "suspicion", -6);
          s.flags.lawPath = true;
          log(s, "Вы тянете процесс к праву, не к панике.");
        },
        next: "act4_council",
      },
      {
        text: "Тайно надавить на свидетелей и заставить их отозвать показания.",
        requires: (s) => s.resources.leverage >= 1,
        failText: "Свидетели испугались, но не замолчали — слухи стали громче.",
        fail: (s) => {
          modStat(s, "trust", -5);
          modTension(s, "suspicion", +6);
        },
        apply: (s) => {
          modResource(s, "leverage", -1);
          modStat(s, "fear", +8);
          modStat(s, "influence", +5);
          modStat(s, "dynasty", -4);
          s.flags.fearPath = true;
        },
        next: "act4_council",
      },
      {
        text: "Признать часть вины двора и предложить политический брак как мирный компромисс.",
        apply: (s) => {
          modStat(s, "love", +5);
          modStat(s, "trust", +6);
          modStat(s, "influence", +2);
          modStat(s, "dynasty", +5);
          modRel(s, "valide", +5);
          modRel(s, "vizier", +2);
          queueDelayed(s, 7, {
            text: "Политический брак снизил риск раскола и дал династии передышку.",
            type: "good",
            run: () => modStat(s, "dynasty", +4),
          });
        },
        next: "act4_council",
      },
    ],
  },

  act4_council: {
    chapter: "Акт IV",
    weekJump: 1,
    title: "Последний совет",
    text: (s) =>
      `Перед финальным решением сходятся все старые обещания. Напряжение гарема: ${s.tensions.harem}, дивана: ${s.tensions.divan}. Союз: ${
        s.flags.alliance === "vizier" ? "реформаторы" : s.flags.alliance === "valide" ? "традиционалисты" : "нейтралитет"
      }.`,
    choices: [
      {
        text: "Объявить программу постепенных реформ: сначала стабилизация, потом чистки.",
        apply: (s) => {
          modStat(s, "influence", +7);
          modStat(s, "trust", +6);
          modStat(s, "dynasty", +6);
          modTension(s, "divan", -5);
          modTension(s, "harem", -3);
          resolveAllPledges(s, true);
        },
        next: "ending",
      },
      {
        text: "Выстроить режим страха: немедленные аресты и демонстративные наказания.",
        apply: (s) => {
          modStat(s, "fear", +15);
          modStat(s, "influence", +6);
          modStat(s, "trust", -9);
          modStat(s, "love", -5);
          modStat(s, "dynasty", -4);
          s.flags.fearPath = true;
          resolveAllPledges(s, false);
        },
        next: "ending",
      },
      {
        text: "Сделать ставку на личные связи: амнистии, примирение и брачные союзы.",
        apply: (s) => {
          modStat(s, "love", +10);
          modStat(s, "trust", +8);
          modStat(s, "reputation", +6);
          modStat(s, "fear", -4);
          modStat(s, "influence", -2);
          s.flags.mercyPath = true;
          resolveAllPledges(s, true);
        },
        next: "ending",
      },
    ],
  },
};

function modStat(s, key, delta) {
  s.stats[key] = clamp(s.stats[key] + delta, 0, 100);
}

function modRel(s, key, delta) {
  s.relations[key] = clamp(s.relations[key] + delta, -100, 100);
}

function modResource(s, key, delta) {
  s.resources[key] = clamp(s.resources[key] + delta, 0, 9);
}

function modTension(s, key, delta) {
  s.tensions[key] = clamp(s.tensions[key] + delta, 0, 100);
}

function addPledge(s, text) {
  if (!s.pledges.includes(text)) s.pledges.push(text);
}

function resolvePledge(s, keyword, success) {
  const idx = s.pledges.findIndex((p) => p.includes(keyword));
  if (idx >= 0) {
    const [resolved] = s.pledges.splice(idx, 1);
    log(s, `${success ? "✅" : "⚠️"} Клятва: ${resolved}`);
    modStat(s, "reputation", success ? +3 : -3);
    modStat(s, "trust", success ? +2 : -2);
  }
}

function resolveAllPledges(s, mostlySuccess) {
  while (s.pledges.length) {
    const pledge = s.pledges.shift();
    const success = mostlySuccess || Math.random() > 0.6;
    log(s, `${success ? "✅" : "⚠️"} Клятва: ${pledge}`);
    modStat(s, "reputation", success ? +2 : -2);
  }
}

function queueDelayed(s, triggerWeek, payload) {
  s.delayed.push({ triggerWeek, payload });
}

function applyDelayed(s) {
  const remaining = [];
  const outcomes = [];
  for (const item of s.delayed) {
    if (item.triggerWeek <= s.week) {
      item.payload.run();
      outcomes.push([item.payload.type, item.payload.text]);
      log(s, item.payload.text);
    } else {
      remaining.push(item);
    }
  }
  s.delayed = remaining;
  return outcomes;
}

function log(s, message) {
  s.log.unshift(message);
  s.log = s.log.slice(0, 16);
}

function endingByState(s) {
  const st = s.stats;
  const stableEmpire = st.dynasty > 65 && st.trust > 60 && s.tensions.suspicion < 45;
  const ironRule = st.fear > 70 && st.trust < 40 && s.flags.fearPath;
  const romanceEnding = st.love > 70 && st.influence < 60 && s.flags.romance;
  const shadowEnding = st.cunning > 70 && st.influence > 72 && s.resources.leverage >= 2;
  const collapse = st.dynasty < 35 || s.tensions.suspicion > 80;

  if (collapse)
    return {
      title: "Династическая смута",
      text: "Слишком много недосказанности и запоздалых решений. Двор распался на группы, и империя вошла в годы тревожного передела.",
    };

  if (ironRule)
    return {
      title: "Железная рука",
      text: "Вы победили страхом, и это сработало. Но во дворце замолчали не враги — замолчала жизнь.",
    };

  if (romanceEnding)
    return {
      title: "Любовь против трона",
      text: "Вы выбрали человека и сохранили сердце. История о вашей верности пережила политику.",
    };

  if (shadowEnding)
    return {
      title: "Тихая власть тени",
      text: "Титулы принадлежат другим, но решения проходят через вас. Вы стали невидимым центром дворца.",
    };

  if (stableEmpire)
    return {
      title: "Власть через мудрость",
      text: "Вы удержали баланс между законом, милостью и силой. Ваше имя вошло в хроники как имя строителя, а не палача.",
    };

  return {
    title: "Падение и изгнание",
    text: "Вы не выдержали веса собственных коалиций. Двор закрыл перед вами двери, оставив лишь память и шанс когда-нибудь вернуться.",
  };
}

const el = {
  stats: document.getElementById("stats"),
  resources: document.getElementById("resources"),
  relations: document.getElementById("relations"),
  pledges: document.getElementById("pledges"),
  eventLog: document.getElementById("eventLog"),
  sceneTitle: document.getElementById("sceneTitle"),
  sceneText: document.getElementById("sceneText"),
  choices: document.getElementById("choices"),
  consequences: document.getElementById("consequences"),
  chapterTag: document.getElementById("chapterTag"),
  weekTag: document.getElementById("weekTag"),
  archetypeTag: document.getElementById("archetypeTag"),
  restartBtn: document.getElementById("restartBtn"),
  soundBtn: document.getElementById("soundBtn"),
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function beep(freq = 440, type = "sine", duration = 0.06, gain = 0.03) {
  if (!state.soundOn) return;
  const osc = audioCtx.createOscillator();
  const vol = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  vol.gain.value = gain;
  osc.connect(vol);
  vol.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function renderBarSection(target, entries, rangeShift = 0) {
  target.innerHTML = entries
    .map(([key, label, value]) => {
      const normalized = rangeShift ? value + rangeShift : value;
      const width = rangeShift ? normalized / 2 : value;
      return `
      <div class="metric">
        <label><span>${label}</span><span>${value}</span></label>
        <div class="bar"><div class="fill" style="width:${clamp(width, 0, 100)}%"></div></div>
      </div>`;
    })
    .join("");
}

function renderSidePanels() {
  renderBarSection(
    el.stats,
    Object.entries(statNames).map(([k, label]) => [k, label, state.stats[k]])
  );

  renderBarSection(
    el.resources,
    Object.entries(resourceNames).map(([k, label]) => [k, label, state.resources[k] * 11])
  );

  renderBarSection(
    el.relations,
    Object.entries(relNames).map(([k, label]) => [k, label, state.relations[k]]),
    100
  );

  el.pledges.innerHTML = state.pledges.length
    ? state.pledges.map((p) => `<li>${p}</li>`).join("")
    : "<li>Нет активных клятв.</li>";

  el.eventLog.innerHTML = state.log.length
    ? state.log.map((line) => `<li>${line}</li>`).join("")
    : "<li>Двор ждет вашего первого шага.</li>";
}

function renderConsequences(list) {
  el.consequences.innerHTML = list.map(([type, text]) => `<li class="${type}">${text}</li>`).join("");
}

function sceneObject() {
  return scenes[state.current];
}

function renderScene() {
  if (state.current === "ending") return renderEnding();

  const scene = sceneObject();
  state.chapter = scene.chapter;
  el.chapterTag.textContent = scene.chapter;
  el.weekTag.textContent = `Неделя ${state.week}`;
  el.archetypeTag.textContent = state.archetype || "Выбор роли";
  el.sceneTitle.textContent = scene.title;
  el.sceneText.textContent = scene.text(state);
  el.sceneText.classList.remove("typewriter");
  void el.sceneText.offsetWidth;
  el.sceneText.classList.add("typewriter");

  el.choices.innerHTML = "";
  scene.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.text;
    const allowed = choice.requires ? choice.requires(state) : true;
    if (!allowed) {
      btn.classList.add("locked");
      btn.title = choice.failText || "Недостаточно ресурсов/условий";
    }
    btn.addEventListener("click", () => handleChoice(choice));
    el.choices.appendChild(btn);
  });
}

function handleChoice(choice) {
  beep(470, "triangle", 0.05, 0.035);
  const outcomes = [];
  const allowed = choice.requires ? choice.requires(state) : true;

  if (!allowed) {
    if (choice.fail) choice.fail(state);
    outcomes.push(["bad", choice.failText || "Вы пока не можете выполнить это действие."]);
    log(state, outcomes[0][1]);
    renderConsequences(outcomes);
    render();
    return;
  }

  choice.apply(state);

  const scene = sceneObject();
  state.week += scene.weekJump || 0;
  state.current = choice.next;

  const delayedOutcomes = applyDelayed(state);
  outcomes.push(...delayedOutcomes);
  if (choice.gradual) outcomes.push(["good", "Последствия начали разворачиваться постепенно. Их полный эффект проявится позже."]);

  renderConsequences(outcomes);
  render();
}

function renderEnding() {
  const ending = endingByState(state);
  el.chapterTag.textContent = "Финал";
  el.weekTag.textContent = `Неделя ${state.week}`;
  el.sceneTitle.textContent = ending.title;
  el.sceneText.textContent = ending.text;

  const score = `Влияние ${state.stats.influence}, Доверие ${state.stats.trust}, Любовь ${state.stats.love}, Страх ${state.stats.fear}, Династия ${state.stats.dynasty}`;

  el.choices.innerHTML = `
    <div class="panel" style="padding:0.7rem;border-radius:10px; border:1px solid rgba(217,185,120,.3)">
      <p style="margin:.2rem 0;color:#d9b978">Итоговые показатели</p>
      <p style="margin:.2rem 0;color:#cebfa7">${score}</p>
    </div>
    <button class="choice-btn" id="againBtn">Пройти снова</button>
  `;
  document.getElementById("againBtn").addEventListener("click", restart);
}

function render() {
  renderSidePanels();
  renderScene();
}

function restart() {
  state = initialState();
  state.current = "start";
  renderConsequences([]);
  render();
}

el.restartBtn.addEventListener("click", () => {
  beep(320, "square", 0.08, 0.03);
  restart();
});

el.soundBtn.addEventListener("click", () => {
  state.soundOn = !state.soundOn;
  el.soundBtn.textContent = state.soundOn ? "🔈 Звук: вкл" : "🔇 Звук: выкл";
  if (state.soundOn) beep(620, "sine", 0.04, 0.03);
});

document.body.addEventListener(
  "click",
  () => {
    if (audioCtx.state === "suspended") audioCtx.resume();
  },
  { once: true }
);

restart();
