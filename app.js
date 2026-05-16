const SHEET_ID =
"1Pax-uq-WIefiiInGaYvvECl0Mlg_hGvLtEzZDzIJT1g";

const BASE_URL =
`https://opensheet.elk.sh/${SHEET_ID}`;

const TABLE_URL =
`${BASE_URL}/${encodeURIComponent("ТУРНИРНАЯ ТАБЛИЦА")}`;

const SETTINGS_URL =
`${BASE_URL}/${encodeURIComponent("НАСТРОЙКИ")}`;

const TEAMS_URL =
`${BASE_URL}/${encodeURIComponent("СПИСОК КОМАНД")}`;

const MATCHES_URL =
`${BASE_URL}/${encodeURIComponent("МАТЧИ")}`;

let standings = [];
let teams = {};
let settings = {};
let matches = [];
let currentMode = "short";
let currentTab = "table";

async function loadData() {
  try {

    const [
      standingsRes,
      settingsRes,
      teamsRes,
      matchesRes
    ] = await Promise.all([
      fetch(TABLE_URL),
      fetch(SETTINGS_URL),
      fetch(TEAMS_URL),
      fetch(MATCHES_URL)
      
    ]);

    standings =
      await standingsRes.json();

    const settingsData =
      await settingsRes.json();

    const teamsData =
      await teamsRes.json();
    matches =
      await matchesRes.json();

    // настройки
    settingsData.forEach(row => {

      const values =
        Object.values(row);

      const key =
        values[0];

      const value =
        values[1];

      settings[key] = value;
    });

    // логотипы команд
    teamsData.forEach(team => {

      const teamName =
        team["КОМАНДА"];

      const logo =
        team["ЛОГО"];

      teams[teamName] =
        logo || "";
    });

    renderHeader();
    renderTable();

  } catch (error) {
    console.error(error);
  }
}

function renderHeader() {

  const logo =
    settings["ЛОГО_ЛИГИ"];

  const leagueName =
    settings["НАЗВАНИЕ"] ||
    "ТУЗЛИГА";

  const season =
    settings["СЕЗОН"] ||
    "2026";

  // логотип
  const logoElement =
    document.getElementById(
      "league-logo"
    );

  if (logoElement && logo) {
    logoElement.src = logo;
  }

  // название
  document.getElementById(
    "league-name"
  ).innerText =
    leagueName;

  // сезон
  document.getElementById(
    "season"
  ).innerText =
    `${season}`;
}

function getDefaultLogo() {
  return "https://cdn-icons-png.flaticon.com/512/54/54481.png";
}

function renderTable() {

  const container =
    document.getElementById(
      "table-container"
    );
 const modeSwitch =
  document.querySelector(
    ".mode-switch"
  );

if (modeSwitch) {

  const showModes =
    currentTab ===
    "table";

  modeSwitch.style.visibility =
    showModes
      ? "visible"
      : "hidden";

  modeSwitch.style.height =
    showModes
      ? ""
      : "0";

  modeSwitch.style.margin =
    showModes
      ? ""
      : "0";

  modeSwitch.style.overflow =
    "hidden";
}
  const modeTabs =
  document.querySelector(
    ".modes"
  );

if (modeTabs) {

  modeTabs.style.display =
    currentTab ===
    "matches"
      ? "none"
      : "flex";
}

  let html = "";;
// MATCHES SCREEN

if (currentTab === "matches") {

 html += `
  <div class="matches-wrap">
`;

 let currentTour = "";
  let currentDate = "";

matches.forEach(match => {

  const groupKey =
    `${match["ТУР"]}-${match["ДАТА"]}`;

const tour =
  match["ТУР"];

const date =
  match["ДАТА"];

if (
  currentTour !==
  tour
) {

  currentTour =
    tour;

  currentDate =
    "";

  html += `
    <div style="
      text-align:center;
      padding:
        22px 0 10px;
    ">

      <div style="
        color:#efbb35;
        font-size:18px;
        font-weight:700;
      ">
        ${tour} ТУР
      </div>

    </div>
  `;
}

if (
  currentDate !==
  date
) {

  currentDate =
    date;

html += `
  <div style="
    text-align:center;

    color:white;

    font-size:15px;
    font-weight:500;

    margin:
      4px 0 18px;
  ">

      ${date}

    </div>
  `;
}

  const finished =
  match[
    "СТАТУС МАТЧА"
  ] === "Завершен";

html += `
  <div style="
    display:grid;

    grid-template-columns:
      minmax(0,1fr)
      120px
      minmax(0,1fr);

    align-items:center;

    padding:
      18px 26px;

    width:100%;

    box-sizing:border-box;
  ">

    <div style="
      display:flex;
      align-items:center;
      justify-content:flex-end;

      gap:10px;

      min-width:0;
    ">

      <div style="
        color:white;
        font-size:14px;
        font-weight:500;

        white-space:nowrap;
      ">

        ${
          match[
            "КОМАНДА 1"
          ]
        }

      </div>

      <img
        src="${
          teams[
            match[
              "КОМАНДА 1"
            ]
          ] ||
          getDefaultLogo()
        }"

        style="
          width:42px;
          height:42px;
          object-fit:contain;
          flex-shrink:0;
        "
      />

    </div>

    <div style="
      text-align:center;
      width:120px;
    ">

      ${
        finished

        ? `

        <div style="
          color:white;
          font-size:20px;
          font-weight:700;
        ">

          ${
            match["ГОЛЫ 1"]
          }
          -
          ${
            match["ГОЛЫ 2"]
          }

        </div>

        <div style="
          font-size:10px;
          color:#8d96a1;
          margin-top:2px;
        ">
          ЗАВЕРШЕН
        </div>

        `

        : `

        <div style="
          color:white;
          font-size:16px;
          font-weight:600;
        ">
          ${
            match["ВРЕМЯ"]
          }
        </div>

        <div style="
          font-size:10px;
          color:#8d96a1;
          margin-top:2px;
        ">
          VS
        </div>

        `
      }

    </div>

    <div style="
      display:flex;
      align-items:center;
      justify-content:flex-start;

      gap:10px;

      min-width:0;
    ">

      <img
        src="${
          teams[
            match[
              "КОМАНДА 2"
            ]
          ] ||
          getDefaultLogo()
        }"

        style="
          width:42px;
          height:42px;
          object-fit:contain;
          flex-shrink:0;
        "
      />

      <div style="
        color:white;
        font-size:14px;
        font-weight:500;

        white-space:nowrap;
      ">

        ${
          match[
            "КОМАНДА 2"
          ]
        }

      </div>

    </div>

  </div>
`;

  html += `
      </div>
  `;

  container.innerHTML =
    html;

  return;
}
  html += `
  <div class="table-card">
`;
  // ВКРАТЦЕ
  if (currentMode === "short") {

    html += `
    <div class="row short-row header-row">
      <div>#</div>
      <div>КОМАНДА</div>
      <div>ИГРЫ</div>
      <div>+/-</div>
      <div>ОЧКИ</div>
    </div>
    `;

    standings.forEach(team => {

      const rm =
        Number(team["РМ"] || 0);

      const logo =
        teams[team["КОМАНДА"]] ||
        getDefaultLogo();

      html += `
      <div class="row short-row">

        <div>
          ${team["№"]}
        </div>

        <div class="team-box">

          <img
            class="team-logo"
            src="${logo}"
          />

          <span>
            ${team["КОМАНДА"]}
          </span>

        </div>

        <div>
          ${team["И"]}
        </div>

        <div class="${
          rm >= 0
          ? "positive"
          : "negative"
        }">

          ${rm > 0 ? "+" : ""}
          ${rm}

        </div>

        <div class="points">
          ${team["ОЧКИ"]}
        </div>

      </div>
      `;
    });
  }

  // ПОЛНОСТЬЮ
if (currentMode === "full") {

  html += `
  <div class="row full-row full-header">
    <div>#</div>
    <div>КОМАНДА</div>
    <div>И</div>
    <div>В</div>
    <div>Н</div>
    <div>П</div>
    <div>ЗМ</div>
    <div>ПМ</div>
    <div>+/-</div>
    <div>ОЧКИ</div>
  </div>
  `;

  standings.forEach(team => {

    const rm =
      Number(team["РМ"] || 0);

    html += `
    <div class="
      row
      full-row
      rank-${team["№"]}
    ">

      <div>
        ${team["№"]}
      </div>

      <div class="team-box">

  <img
    class="team-logo"
    src="${
      teams[team["КОМАНДА"]] ||
      getDefaultLogo()
    }"
  />

  <span>
    ${team["КОМАНДА"]}
  </span>

</div>

      <div>${team["И"]}</div>
      <div class="wins">
  ${team["В"]}
</div>

<div class="draws">
  ${team["Н"]}
</div>

<div class="losses">
  ${team["П"]}
</div>
      <div>${team["ЗМ"]}</div>
      <div>${team["ПМ"]}</div>

      <div class="${
        rm >= 0
        ? "positive"
        : "negative"
      }">

        ${rm > 0 ? "+" : ""}
        ${rm}

      </div>

      <div class="points">
        ${team["ОЧКИ"]}
      </div>

    </div>
    `;
  });
}
    html += `</div>`;

  container.innerHTML = html;
}
// ФОРМА
if (currentMode === "form") {

  html += `
    <div class="table-card">

      <div class="row form-row form-header">
        <div>#</div>
        <div>КОМАНДА</div>
        <div>ФОРМА</div>
      </div>
  `;

  standings.forEach(team => {

    const logo =
      teams[team["КОМАНДА"]] ||
      getDefaultLogo();

    html += `
      <div class="
        row
        form-row
        rank-${team["№"]}
      ">

        <div>
          ${team["№"]}
        </div>

        <div class="team-box">

          <img
            class="team-logo"
            src="${logo}"
          />

          <span>
            ${team["КОМАНДА"]}
          </span>

        </div>

        <div class="form-box">

          <div class="form-circle win">
            В
          </div>

          <div class="form-circle draw">
            Н
          </div>

          <div class="form-circle loss">
            П
          </div>

        </div>

      </div>
    `;
  });
}
/* TOP TABS */

document
.querySelectorAll(".tab")
.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      document
      .querySelectorAll(".tab")
      .forEach(btn =>
        btn.classList.remove(
          "active"
        )
      );

      button.classList.add(
        "active"
      );

      currentTab =
        button.dataset.tab;

      console.log(
        currentTab
      );

      renderTable();
    }
  );
});
/* SWITCH TABS */

document
.querySelectorAll(".mode")
.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      document
      .querySelectorAll(".mode")
      .forEach(btn =>
        btn.classList.remove(
          "active"
        )
      );

      button.classList.add(
        "active"
      );

      currentMode =
        button.dataset.mode;

      renderTable();
    }
  );
});


loadData();
