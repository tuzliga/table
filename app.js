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

let standings = [];
let teams = {};
let settings = {};
let currentMode = "short";

async function loadData() {
  try {

    const [
      standingsRes,
      settingsRes,
      teamsRes
    ] = await Promise.all([
      fetch(TABLE_URL),
      fetch(SETTINGS_URL),
      fetch(TEAMS_URL)
    ]);

    standings =
      await standingsRes.json();

    const settingsData =
      await settingsRes.json();

    const teamsData =
      await teamsRes.json();

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
    `СЕЗОН ${season}`;
}

function getDefaultLogo() {
  return "https://cdn-icons-png.flaticon.com/512/54/54481.png";
}

function renderTable() {

  const container =
    document.getElementById(
      "table-container"
    );

  let html =
    `<div class="table-card">`;

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
    <div class="row full-row header-row">
      <div>#</div>
      <div>КОМ</div>
      <div>И</div>
      <div>В</div>
      <div>Н</div>
      <div>П</div>
      <div>ЗМ</div>
      <div>ПМ</div>
      <div>РМ</div>
      <div>О</div>
    </div>
    `;

    standings.forEach(team => {

      html += `
      <div class="row full-row">

        <div>${team["№"]}</div>
        <div>${team["КОМАНДА"]}</div>
        <div>${team["И"]}</div>
        <div>${team["В"]}</div>
        <div>${team["Н"]}</div>
        <div>${team["П"]}</div>
        <div>${team["ЗМ"]}</div>
        <div>${team["ПМ"]}</div>
        <div>${team["РМ"]}</div>

        <div class="points">
          ${team["ОЧКИ"]}
        </div>

      </div>
      `;
    });
  }

  // ФОРМА
  if (currentMode === "form") {

    html += `
    <div class="row form-row header-row">
      <div>#</div>
      <div></div>
      <div>КОМАНДА</div>
      <div>ФОРМА</div>
    </div>
    `;

    standings.forEach(team => {

      const logo =
        teams[team["КОМАНДА"]] ||
        getDefaultLogo();

      const form =
        (team["ФОРМА"] || "")
        .split("");

      html += `
      <div class="row form-row">

        <div>
          ${team["№"]}
        </div>

        <img
          class="team-logo"
          src="${logo}"
        />

        <div>
          ${team["КОМАНДА"]}
        </div>

        <div class="form">

          ${form.map(letter => {

            let cls = "";
            let text = "";

            if (letter === "W") {
              cls = "win";
              text = "В";
            }

            if (letter === "D") {
              cls = "draw";
              text = "Н";
            }

            if (letter === "L") {
              cls = "loss";
              text = "П";
            }

            return `
              <div class="circle ${cls}">
                ${text}
              </div>
            `;
          }).join("")}

        </div>

      </div>
      `;
    });
  }

  html += `</div>`;

  container.innerHTML = html;
}

// переключение вкладок
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
