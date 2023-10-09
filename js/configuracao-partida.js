import "../scss/configuracao-usuarios.scss";
import "../scss/configuracao-partida.scss";
import "../scss/pagina-times.scss";

import JustValidate from "just-validate";
import {
  executarFetch,
  configuracaoFetch,
  limparMensagem,
  api,
} from "./utilidades/configFetch";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import flatpickr from "flatpickr";
import { exibidorImagem } from "./utilidades/previewImagem.js";
import { uploadImagem } from "./utilidades/uploadImagem";
import { notificacaoErro, notificacaoSucesso } from "./utilidades/notificacoes";
import "./utilidades/loader";
import portugues from "./i18n/ptbr/configuracao-partida.json" assert { type: "JSON" };
import ingles from "./i18n/en/configuracao-partida.json" assert { type: "JSON" };
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao";
import * as bootstrap from "bootstrap";

inicializarInternacionalizacao(ingles, portugues);

const loader = document.createElement("app-loader");
document.body.appendChild(loader);

const urlParams = new URLSearchParams(window.location.search),
  matchId = urlParams.get("idM"),
  championshipId = urlParams.get("idC");

let championshipData = null;
const getChampionshipData = async () => {
  const response = await executarFetch(
    `championships/${championshipId}`,
    configuracaoFetch("GET")
  );
  championshipData = response.results;
};

const sessionUserInfo = JSON.parse(localStorage.getItem("user-info"));

const isOrganizer = () => {
  let isOrganizer = false;
  let isChampionshipOrganizer = false;

  isChampionshipOrganizer =
    championshipId == sessionUserInfo?.championshipId ? true : false;

  if (sessionUserInfo?.isOrganizer && isChampionshipOrganizer) {
    isOrganizer = true;
  } else {
    isOrganizer = false;
  }

  return isOrganizer;
};

const configureMatch = async (matchId, championshipData) => {
  const callbackStatus = (data) => {
    notificacaoErro(data.results);
  };

  const configMatchForm = document.querySelector("#config-match-form");

  const configMatchValidator = new JustValidate(configMatchForm, {
    validateBeforeSubmitting: true,
  });

  // get match data
  const matchData = await executarFetch(
      `matches/${matchId}`,
      configuracaoFetch("GET")
    ),
    match = matchData.results;

  // get match team 1
  const team1Data = await executarFetch(
      `teams/${match.homeId}`,
      configuracaoFetch("GET")
    ),
    team1 = team1Data.results;

  // get match team 2
  const team2Data = await executarFetch(
      `teams/${match.visitorId}`,
      configuracaoFetch("GET")
    ),
    team2 = team2Data.results;

  configMatchForm.innerHTML = "";

  configMatchForm.insertAdjacentHTML(
    "beforeend",
    `
    <h2 class="text-center rounded-4 w-100 fw-semibold i18" key="configMatch">${i18next.t(
      "configMatch"
    )}</h2>

	  <div class="row mt-3 justify-content-center">
    
		<h4 class="text-center rounded-4 w-auto p-2 px-3 lvl1-color fw-normal config-match-section-label i18" key="UniformSelection">${i18next.t(
      "UniformSelection"
    )}</h4>
		<span class="i18 mb-0 text-center" key="MatchHomeUniformLabel">${i18next.t(
      "MatchHomeUniformLabel"
    )}</span>
		<div class="col-12 mb-2 text-center"><span>${team1.name}</span></div>
		<div class="col-6 p-0 px-2 form-check d-flex flex-column justify-content-center align-items-center">
		  <img id="team1-home-uniform-img" class="img-fluid selected-uniform mb-2 rounded-5 team-uniform-img cursor-pointer" src="${
        team1.uniformHome
      }" alt="">
		  <input value="${
        team1.uniformHome
      }" class="rounded-pill w-25 form-check-input m-auto d-none" type="radio" id="check-team1-home-uniform" name="team1-uniform-radio" checked>
		</div>
		<div class="col-6 p-0 px-2 form-check d-flex flex-column justify-content-center align-items-center">
		  <img id="team1-away-uniform-img" class="img-fluid rounded-5 mb-2 team-uniform-img cursor-pointer" src="${
        team1.uniformAway
      }" alt="">
		  <input value="${
        team1.uniformAway
      }" class="rounded-pill w-25 form-check-input m-auto d-none" type="radio" id="check-team1-away-uniform" name="team1-uniform-radio">
		</div>
	  </div>
	  <hr class="rounded-pill opacity-50 mx-auto w-50">
	  <div class="row mt-3">
		<span class="i18 mb-0 text-center" key="MatchAwayUniformLabel">${i18next.t(
      "MatchAwayUniformLabel"
    )}</span>
		<div class="col-12 mb-2 text-center"><span>${team2.name}</span></div>
		<div class="col-6 p-0 px-2 form-check d-flex flex-column justify-content-center align-items-center">
		  <img id="team2-home-uniform-img" class="img-fluid rounded-5 mb-2 team-uniform-img cursor-pointer" src="${
        team2.uniformHome
      }" alt="">
		  <input value="${
        team2.uniformHome
      }" class="rounded-pill w-25 form-check-input m-auto d-none" type="radio" id="check-team2-home-uniform" name="team2-uniform-radio">
		</div>
		<div class="col-6 p-0 px-2 form-check d-flex flex-column justify-content-center align-items-center">
		  <img id="team2-away-uniform-img" class="img-fluid selected-uniform rounded-5 mb-2 team-uniform-img cursor-pointer" src="${
        team2.uniformAway
      }" alt="">
		  <input value="${
        team2.uniformAway
      }" class="rounded-pill w-25 form-check-input m-auto d-none" type="radio" id="check-team2-away-uniform" name="team2-uniform-radio" checked>
		</div>
	  </div>
  
	  <div class="row justify-content-center mt-5"><h4 class="text-center config-match-section-label p-2 px-3 rounded-4 w-auto lvl1-color fw-normal i18" key="InfosPartida">${i18next.t(
      "InfosPartida"
    )}</h4></div>
	  <div class="row">
		<div class="col">
		  <label for="match-arbitrator" class="i18 form-label mb-0" key="MatchArbitratorLabel">${i18next.t(
        "MatchArbitratorLabel"
      )}</label>
		  <input type="text" id="match-arbitrator" class="form-control" placeholder="${i18next.t(
        "MatchArbitratorPlaceholder"
      )}">
		</div>
	  </div>
  
	  <div class="row mt-3">
		<div class="col-12 col-md">
		  <label for="match-date" class="i18 form-label mb-0" key="MatchDateLabel">${i18next.t(
        "MatchDateLabel"
      )}</label>
		  <input type="text" id="match-date" class="form-control" placeholder="${i18next.t(
        "MatchDatePlaceholder"
      )}">
		</div>
	  </div>
  
	  <div class="row">
		<div class="col-12 mt-3 col-md">
		  <label for="match-zipcode" class="i18 form-label mb-0" key="MatchZipcodeLabel">${i18next.t(
        "MatchZipcodeLabel"
      )}</label>
		  <input type="text" id="match-zipcode" max="" class="form-control" placeholder="${i18next.t(
        "MatchZipcodePlaceholder"
      )}">
		</div>
		<div class="col-12 mt-3 col-md">
		  <label for="match-city" class="i18 form-label mb-0" key="MatchCityLabel">${i18next.t(
        "MatchCityLabel"
      )}</label>
		  <input type="text" id="match-city" class="form-control" placeholder="${i18next.t(
        "MatchCityPlaceholder"
      )}">
		</div>
	  </div>
  
	  <div class="row">
		<div class="col-12 mt-3 col-md">
		  <label for="match-road" class="i18 form-label mb-0" key="MatchStreetLabel">${i18next.t(
        "MatchStreetLabel"
      )}</label>
		  <input type="text" id="match-road" class="form-control" placeholder="${i18next.t(
        "MatchStreetPlaceholder"
      )}">
		</div>
		<div class="col-12 mt-3 col-md">
		  <label for="match-location-number" class="i18 form-label mb-0" key="MatchLocationNumberLabel">${i18next.t(
        "MatchLocationNumberLabel"
      )}</label>
		  <input type="text" id="match-location-number" class="form-control" placeholder="${i18next.t(
        "MatchLocationNumberPlaceholder"
      )}">
	  </div>

	  <div class="col-12 mt-5 mb-3 d-flex justify-content-center gap-2">
			<button id="salvar" class="col-md-2 order-last btn lvl3-primary-bg rounded-pill i18" key="Salvar" type="submit">${i18next.t("Salvar")}</button>
			<a href="/pages/tabela-chaveamento.html?id=${championshipId}" class="col-md-2 btn btn-outline-info rounded-pill i18" key="Cancelar">${i18next.t("Cancelar")}</a>
		</div> 
	`
  );

  const checkTeam1HomeUniform = configMatchForm.querySelector(
    "#check-team1-home-uniform"
  );
  const checkTeam1AwayUniform = configMatchForm.querySelector(
    "#check-team1-away-uniform"
  );
  const checkTeam2HomeUniform = configMatchForm.querySelector(
    "#check-team2-home-uniform"
  );
  const checkTeam2AwayUniform = configMatchForm.querySelector(
    "#check-team2-away-uniform"
  );

  const team1HomeUniformImg = configMatchForm.querySelector(
    "#team1-home-uniform-img"
  );
  const team1AwayUniformImg = configMatchForm.querySelector(
    "#team1-away-uniform-img"
  );

  const team2HomeUniformImg = configMatchForm.querySelector(
    "#team2-home-uniform-img"
  );
  const team2AwayUniformImg = configMatchForm.querySelector(
    "#team2-away-uniform-img"
  );

  team1HomeUniformImg.addEventListener("click", () => {
    checkTeam1HomeUniform.checked = true;

    team1HomeUniformImg.classList.add("selected-uniform");
    team1AwayUniformImg.classList.remove("selected-uniform");
  });

  team1AwayUniformImg.addEventListener("click", () => {
    checkTeam1AwayUniform.checked = true;

    team1AwayUniformImg.classList.add("selected-uniform");
    team1HomeUniformImg.classList.remove("selected-uniform");
  });

  team2HomeUniformImg.addEventListener("click", () => {
    checkTeam2HomeUniform.checked = true;

    team2HomeUniformImg.classList.add("selected-uniform");
    team2AwayUniformImg.classList.remove("selected-uniform");
  });

  team2AwayUniformImg.addEventListener("click", () => {
    checkTeam2AwayUniform.checked = true;

    team2AwayUniformImg.classList.add("selected-uniform");
    team2HomeUniformImg.classList.remove("selected-uniform");
  });

  const getHomeUniform = () => {
    if (checkTeam1HomeUniform.checked) {
      return checkTeam1HomeUniform.value;
    } else if (checkTeam1AwayUniform.checked) {
      return checkTeam1AwayUniform.value;
    } else {
      return null;
    }
  };

  const getVisitorUniform = () => {
    if (checkTeam2HomeUniform.checked) {
      return checkTeam2HomeUniform.value;
    } else if (checkTeam2AwayUniform.checked) {
      return checkTeam2AwayUniform.value;
    } else {
      return null;
    }
  };

  const matchArbitrator = configMatchForm.querySelector("#match-arbitrator");
  const matchDate = configMatchForm.querySelector("#match-date");
  const matchZipcode = configMatchForm.querySelector("#match-zipcode");
  const matchCity = configMatchForm.querySelector("#match-city");
  const matchRoad = configMatchForm.querySelector("#match-road");
  const matchLocationNumber = configMatchForm.querySelector(
    "#match-location-number"
  );

  // fill inputs with match data
  if (match.arbitrator) {
    matchArbitrator.value = match.arbitrator;
    matchDate.value = match.date;
    matchZipcode.value = match.cep;
    matchCity.value = match.city;
    matchRoad.value = match.road;
    matchLocationNumber.value = match.number;

    if (match.homeUniform == team1.uniformHome) {
      checkTeam1HomeUniform.checked = true;
    } else if (match.homeUniform == team1.uniformAway) {
      checkTeam1AwayUniform.checked = true;
    }

    if (match.visitorUniform == team2.uniformHome) {
      checkTeam2HomeUniform.checked = true;
    } else if (match.visitorUniform == team2.uniformAway) {
      checkTeam2AwayUniform.checked = true;
    }

    if (checkTeam1HomeUniform.checked) {
      team1HomeUniformImg.classList.add("selected-uniform");
      team1AwayUniformImg.classList.remove("selected-uniform");
    }

    if (checkTeam1AwayUniform.checked) {
      team1AwayUniformImg.classList.add("selected-uniform");
      team1HomeUniformImg.classList.remove("selected-uniform");
    }

    if (checkTeam2HomeUniform.checked) {
      team2HomeUniformImg.classList.add("selected-uniform");
      team2AwayUniformImg.classList.remove("selected-uniform");
    }

    if (checkTeam2AwayUniform.checked) {
      team2AwayUniformImg.classList.add("selected-uniform");
      team2HomeUniformImg.classList.remove("selected-uniform");
    }
  }

  matchZipcode.addEventListener("keyup", () => {
    if (matchZipcode.value.length > 8) {
      matchZipcode.value = matchZipcode.value.slice(0, 8);
    }
  });

  let cepURL = "https://viacep.com.br/ws/";
  let cepType = "/json/";

  matchZipcode.addEventListener("blur", async () => {
    let cep = matchZipcode.value;
    cep = cep.replace(/\D/g, "");

    if (cep != "") {
      let validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        matchCity.value = "...";
        matchRoad.value = "...";
        matchCity.disabled = true;
        matchRoad.disabled = true;
        const response = await fetch(cepURL + cep + cepType);
        const data = await response.json();
        if (!("erro" in data)) {
          matchCity.value = data.localidade;
          matchRoad.value = data.logradouro;
          matchCity.disabled = false;
          matchRoad.disabled = false;
        } else {
          matchCity.value = "";
          matchRoad.value = "";
          matchCity.disabled = false;
          matchRoad.disabled = false;
          notificacaoErro(i18next.t("CEPInvalido"));
        }
      } else {
        matchCity.value = "";
        matchRoad.value = "";
        matchCity.disabled = false;
        matchRoad.disabled = false;
        notificacaoErro(i18next.t("CEPInvalido"));
      }
    } else {
      matchCity.value = "";
      matchRoad.value = "";
      matchCity.disabled = false;
      matchRoad.disabled = false;
    }
  });

  let lng = localStorage.getItem("lng");

  flatpickr(matchDate, {
    dateFormat: "Z",
    altFormat: "d/m/Y H:i",
    time_24hr: true,
    locale: lng === "ptbr" ? Portuguese : ingles,
    altInput: true,
    minDate: championshipData.initialDate,
    maxDate: championshipData.finalDate,
  });

  document.addEventListener("nova-lingua", (event) => {
    let lng = localStorage.getItem("lng");

    flatpickr(matchDate, {
      dateFormat: "Z",
      altFormat: "d/m/Y H:i",
      time_24hr: true,
      locale: lng === "ptbr" ? Portuguese : ingles,
      altInput: true,
      minDate: championshipData.initialDate,
      maxDate: championshipData.finalDate,
    });

    configMatchValidator.revalidate();
  });

  configMatchValidator
    .addField(matchArbitrator, [
      {
        rule: "required",
        errorMessage: `<span class="i18" key="ArbitroObrigatorio">${i18next.t(
          "ArbitroObrigatorio"
        )}</span>`,
      },
    ])
    .addField(matchDate, [
      {
        rule: "required",
        errorMessage: `<span class="i18" key="DataObrigatoria">${i18next.t(
          "DataObrigatoria"
        )}</span>`,
      },
    ])
    .addField(matchZipcode, [
      {
        rule: "required",
        errorMessage: `<span class="i18" key="CEPObrigatorio">${i18next.t(
          "CEPObrigatorio"
        )}</span>`,
      },
    ])
    .addField(matchCity, [
      {
        rule: "required",
        errorMessage: `<span class="i18" key="CidadeObrigatoria">${i18next.t(
          "CidadeObrigatoria"
        )}</span>`,
      },
    ])
    .addField(matchRoad, [
      {
        rule: "required",
        errorMessage: `<span class="i18" key="RuaObrigatoria">${i18next.t(
          "RuaObrigatoria"
        )}</span>`,
      },
    ])
    .addField(matchLocationNumber, [
      {
        rule: "required",
        errorMessage: `<span class="i18" key="NumeroObrigatorio">${i18next.t(
          "NumeroObrigatorio"
        )}</span>`,
      },
    ])
    .onSuccess(async (e) => {
      e.preventDefault();

      const body = {
        Id: matchId,
        Cep: matchZipcode.value,
        City: matchCity.value,
        Road: matchRoad.value,
        Number: matchLocationNumber.value,
        HomeUniform: getHomeUniform(),
        VisitorUniform: getVisitorUniform(),
        Date: matchDate.value,
        Arbitrator: matchArbitrator.value,
      };

      loader.show();
      await putMatch(body);
      loader.hide();
    });
};

const putMatch = async (body) => {
  const callbackStatus = (data) => {
    notificacaoErro(data.results);
  };

  loader.show();
  const configFetch = configuracaoFetch("PUT", body),
    response = await executarFetch(`matches`, configFetch, callbackStatus);

  loader.hide();

  if (response.succeed) {
    notificacaoSucesso(i18next.t("SucessoConfigurarPartida"));

    window.location.replace("/pages/tabela-chaveamento.html?id=" + championshipId)
  }
};

document.addEventListener("header-carregado", async () => {
  await getChampionshipData();
  isOrganizer() ? configureMatch(matchId, championshipData) : window.location.replace("/pages/tabela-chaveamento.html?id=" + championshipId);
  window.dispatchEvent(new Event("pagina-load"));
});
