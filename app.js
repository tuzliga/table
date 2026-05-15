const SHEET_ID =
  "1Pax-uq-WIefiiInGaYvvECl0Mlg_hGvLtEzZDzIJT1g";

const API_KEY =
  "AIzaSyDUMMY"; // пока не нужен

const TABLE_URL =
`https://opensheet.elk.sh/${SHEET_ID}/ТУРНИРНАЯ ТАБЛИЦА`;

const SETTINGS_URL =
`https://opensheet.elk.sh/${SHEET_ID}/НАСТРОЙКИ`;

const TEAMS_URL =
`https://opensheet.elk.sh/${SHEET_ID}/СПИСОК КОМАНД`;

let standings = [];
let teams = {};
let settings = {};
let currentMode = "short";

async function loadData() {

  const [
    standingsRes,
    settingsRes,
    teamsRes
  ] = await Promise.all([
    fetch(TABLE_URL),
    fetch(SETTINGS_URL),
    fetch(TEAMS_URL)
  ]);

  standings = await standingsRes.json();

  const settingsData =
    await settingsRes.json();

  const teamsData =
    await teamsRes.json();

  settingsData.forEach(item => {
    settings[item.A] = item.B;
  });

  teamsData.forEach(team => {
    teams[team.КОМАНДА] =
      team.ЛОГО || "";
  });

  renderHeader();
  renderTable();
}

function renderHeader() {

  document.getElementById(
    "league-logo"
  ).src =
    settings["ЛОГО_ЛИГИ"];

  document.getElementById(
    "league-name"
  ).innerText =
    settings["НАЗВАНИЕ"];

  document.getElementById(
    "season"
  ).innerText =
    `СЕЗОН ${settings["СЕЗОН"]}`;
}

function renderTable() {

  const container =
    document.getElementById(
      "table-container"
    );

  let html =
    `<div class="table-card">`;

  if(currentMode === "short") {

    html += `
      <div class="row short-row header-row">
        <div>#</div>
        <div>КОМАНДА</div>
        <div>И</div>
        <div>+/-</div>
        <div>ОЧКИ</div>
      </div>
    `;

    standings.forEach(team => {

      const rm =
        Number(team.РМ);

      html += `
      <div class="row short-row">

        <div>${team.№}</div>

        <div class="team-box">

          <img
            class="team-logo"
            src="${
              teams[team.КОМАНДА]
              || 'https://cdn-icons-png.flaticon.com/512/54/54481.png'
            }"
          />

          <span>
            ${team.КОМАНДА}
          </span>

        </div>

        <div>${team.И}</div>

        <div class="${
          rm >= 0
          ? "positive"
          : "negative"
        }">
          ${rm > 0 ? "+" : ""}
          ${rm}
        </div>

        <div class="points">
          ${team.ОЧКИ}
        </div>

      </div>
      `;
    });
  }

  if(currentMode === "full") {

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

        <div>${team.№}</div>

        <div>
          ${team.КОМАНДА}
        </div>

        <div>${team.И}</div>
        <div>${team.В}</div>
        <div>${team.Н}</div>
        <div>${team.П}</div>
        <div>${team.ЗМ}</div>
        <div>${team.ПМ}</div>
        <div>${team.РМ}</div>

        <div class="points">
          ${team.ОЧКИ}
        </div>

      </div>
      `;
    });
  }

  if(currentMode === "form") {

    html += `
    <div class="row form-row header-row">
      <div>#</div>
      <div></div>
      <div>КОМАНДА</div>
      <div>ФОРМА</div>
    </div>
    `;

    standings.forEach(team => {

      const form =
        (team.ФОРМА || "")
        .split("");

      html += `
      <div class="row form-row">

        <div>${team.№}</div>

        <img
          class="team-logo"
          src="${
            teams[team.КОМАНДА]
            || 'https://cdn-icons-png.flaticon.com/512/54/54481.png'
          }"
        />

        <div>
          ${team.КОМАНДА}
        </div>

        <div class="form">
          ${form.map(letter => {

            let cls = "";

            if(letter === "W")
              cls = "win";

            if(letter === "D")
              cls = "draw";

            if(letter === "L")
              cls = "loss";

            const text =
              letter === "W"
              ? "В"
              : letter === "D"
              ? "Н"
              : "П";

            return `
            <div
              class="circle ${cls}"
            >
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

document
.querySelectorAll(".mode")
.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      document
      .querySelectorAll(".mode")
      .forEach(btn =>
        btn.classList
        .remove("active")
      );

      button.classList
      .add("active");

      currentMode =
        button.dataset.mode;

      renderTable();
    }
  );
});

loadData();
