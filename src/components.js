import React, { useReducer, useContext, useEffect, useState } from "react";
import "./style.css";
import assets from "../img/*.png";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";

const { GETData, postData } = require('./fetch.js');

let bool = 0;

function Pagina(props) {
  return (
    <div className="Pagina">

      <nav class="navbar sticky-top navbar-light bg-light">
        <img src={assets.Logo} width="160" height="30" class="d-inline-block align-top" alt="" />
        <div className="Titolo">
          PRENOTAZIONE TAMPONI
        </div>
        <form class="form-inline my-2 my-lg-0">
        <Link to="/LogIn"><button class="btn btn-primary my-2 my-sm-0">Accedi</button></Link>
        </form>
      </nav>
      {/*
        <div className="container">
          <div className="row">
            <div className="col">
              <Logo />
            </div>

            <div className="col Titolo">

              PRENOTAZIONE TAMPONI
            </div>
            <div className="col">
              <Link to="/LogIn">
                <button className="btn btn-primary LogIn">Accedi</button>
              </Link>
            </div>
          </div>
        </div>
        */}
      {props.body}
      <footer>Footer</footer>
    </div>
  );
}

export function HomePage(params) {
  const { state, dispatch } = useContext(params.contesto);
  function carica() {
    if (bool == 0) {
      bool = 1;
      GETData("Presidi.php", {}).then((r) => {
        let a = new Array();
        for (let i in r) a.push(r[i].nome);
        let elencoPresidi = a;
        console.log(elencoPresidi);
        dispatch({ type: "Carica presidi", payload: elencoPresidi });
      });
    }
  }
  carica();
  return (
    <Pagina
      body={
        <div className="corpo">
          <div className="container">
            <div className="row row-cols-3">
              <div className="col-lg-4 col-sm-12 col-12">
                <Card
                  nome="prenota"
                  titolo="Prenota"
                  testo="Esegui la tua prenotazione"
                  contesto={params.contesto}
                  immagine={assets.prenota}
                />
              </div>
              <div className="col-lg-4 col-sm-12 col-12">
                <Card
                  nome="controlla"
                  titolo="Controlla"
                  testo="Controlla, annulla o stampa la tua prenotazione"
                  contesto={params.contesto}
                  immagine={assets.controlla}
                />
              </div>
              <div className="col-lg-4 col-sm-12 col-12">
                <Card
                  nome="esito"
                  titolo="Esito"
                  testo="Controlla l'esito del tampone"
                  contesto={params.contesto}
                  immagine={assets.esito}
                />
              </div>
            </div>
          </div>
          {/*<Link to="/areaRiservata"><Card nome="areaRiservata"/></Link>*/}
        </div>
      }
    />
  );
}

function Card(params) {
  const { state, dispatch } = useContext(params.contesto);
  let link = "/" + params.nome;
  return (
    <div className="card">
      <h5 className="card-header">{params.titolo}</h5>
      <div className="card-body">
        <Link to={link}><Image immagine={params.immagine} /></Link>
        <p className="card-text">{params.testo}</p>
        <Link to={link}>
          <button className="btn btn-primary" style={{ "font-size": "20px" }}>{params.titolo}</button>
        </Link>
      </div>
    </div>
  );
}

let codiceUnivoco;

//Pagina per la prenotazione di un tampone (scelta di data e presidio)
export function Prenota(params) {
  const { state, dispatch } = useContext(params.contesto);
  const history = useHistory();
  return (
    <Pagina
      body={
        <div className="Form">
          <form>
            <div className="mb-3">
              <label htmlFor="CodiceFiscale" className="form-label">
                Codice Fiscale
              </label>
              <input
                type="text"
                className="form-control"
                id="CodiceFiscale"
                aria-describedby="CodiceFiscaleHelp"
                required
              ></input>
              <div id="CodiceFiscaleHelp" className="form-text">
                Inserisci il tuo codice fiscale (lettere maiuscole).
              </div>
            </div>
            <div className="mb-3 Presidi">
              <label htmlFor="Presidi" className="form-label">
                Presidi Disponibili
              </label>
              <SelettorePresidi contesto={params.contesto} />
              <div id="CodiceFiscaleHelp" className="form-text">
                Scegli il presidio in cui effettuare il tampone.
              </div>
            </div>
            <div className="mb-3 Giorni">
              <label htmlFor="CodiceFiscale" className="form-label">
                Giorni Disponibili
              </label>
              <select
                className="form-select"
                id="Giorni"
                aria-describedby="GiorniHelp"
                required
              >
                <Giorni contesto={params.contesto} />
              </select>
              <div id="CodiceFiscaleHelp" className="form-text">
                Scegli il giorno in cui effettuare il tampone (
                <b>presidi diversi hanno disponibilità diverse</b>).
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              id="submitPrenota"
              onClick={() => {
                let codiceFiscale = document.getElementById("CodiceFiscale").value;
                console.log(codiceFiscale);
                let e = document.getElementById("Presidi");
                let valorePresidio = e.options[e.selectedIndex].value;
                e = document.getElementById("Giorni");
                let valoreGiorno = e.options[e.selectedIndex].value;
                postData("prenota.php", {
                  codice: codiceFiscale,
                  presidio: valorePresidio,
                  giorno: valoreGiorno,
                }).then(r => {
                  document.getElementById("CodiceFiscale").value = "";
                  if (r == "Errore") {
                    console.log("Errore");
                    history.push("/prenota");
                    alert("Errore nell'inserimento. Controllare di aver inserito correttamente tutti i parametri.");
                  }
                  else {
                    codiceUnivoco = r;
                    history.push("/EsitoPrenotazione");

                  }
                })
              }}

            >
              Submit
            </button>
            <Link to="/">
              <button className="btn btn-primary" style={{ marginLeft: "5px" }}>
                Torna alla Home
              </button>
            </Link>
          </form>
        </div>
      }
    />
  );
}

function SelettorePresidi(params) {
  const { state, dispatch } = useContext(params.contesto);

  return (
    <select
      className="form-select"
      id="Presidi"
      aria-describedby="PresidiHelp"
      required
      onClick={() => {
        cercaGiorni(dispatch);

      }}
    >
      <Presidi contesto={params.contesto} />
    </select>
  );
}

function cercaGiorni(dispatch) {
  let e = document.getElementById("Presidi");
  let valore = e.options[e.selectedIndex].value;

  GETData('GiorniPresidio.php', { "presidio": valore }).then(r => {
    let a = new Array();
    for (let i in r)
      a.push(r[i].data);
    dispatch({ type: "caricaGiorni", payload: a });
  });
}

export function EsitoPrenotazione(params) {
  return (
    <Pagina body={
      <div>
        Il tuo codice è {codiceUnivoco};
      </div>
    } />
  )
}

function Presidi(params) {
  let Selettore = [];
  const { state, dispatch } = useContext(params.contesto);
  let presidi = state.presidi;
  presidi.forEach((element, i) => {
    Selettore[Selettore.length] = (
      <option value={rimuoviSpazi(element)} key={i}>
        {element}
      </option>
    );
  });

  return <>{Selettore}</>;
}

function rimuoviSpazi(stringa) {
  return stringa.replace(/\s/g, "");
}

function Giorni(params) {
  let giorni = [];
  const { state, dispatch } = useContext(params.contesto);
  let date = state.giorniDisponibili;
  date.forEach((element, i) => {
    giorni[giorni.length] = (
      <option value={element} key={i}>
        {element}
      </option>
    );
  });

  return <>{giorni}</>;
}

export function Controlla() {
  return (
    <Pagina
      body={
        <div className="Form">
          <form>
            <div className="mb-3">
              <label htmlFor="CodiceFiscale" className="form-label">
                Codice Prenotazione
              </label>
              <input
                type="text"
                className="form-control"
                id="CodicePrenotazione"
              ></input>
            </div>
            <button type="submit" className="btn btn-primary">
              Controlla
            </button>
            <Link to="/">
              <button className="btn btn-primary" style={{ marginLeft: "5px" }}>
                Torna alla Home
              </button>
            </Link>
          </form>
        </div>
      }
    />
  );
}
export function Esito() {
  return (
    <Pagina
      body={
        <div className="Form">
          <form>
            <div className="mb-3">
              <label htmlFor="CodiceFiscale" className="form-label">
                Codice Prenotazione
              </label>
              <input
                type="text"
                className="form-control"
                id="CodicePrenotazione"
              ></input>
            </div>
            <button type="submit" className="btn btn-primary">
              Visualizza l'esito
            </button>
            <Link to="/">
              <button className="btn btn-primary" style={{ marginLeft: "5px" }}>
                Torna alla Home
              </button>
            </Link>
          </form>
        </div>
      }
    />
  );
}
export function AreaRiservata() {
  return <div className="pagina"></div>;
}
export function LogIn() {
  return (
    <Pagina
      body={
        <div className="Form">
          <form>
            <div className="mb-3">
              <label htmlFor="CodiceFiscale" className="form-label">
                Nome Utente
              </label>
              <input type="text" className="form-control" id="NomeUtente"></input>
            </div>
            <div className="mb-3">
              <label htmlFor="CodiceFiscale" className="form-label">
                Password
              </label>
              <input type="password" className="form-control" id="Password"></input>
            </div>
            <button type="submit" className="btn btn-primary">
              Accedi
            </button>
            <Link to="/">
              <button className="btn btn-primary" style={{ margiLeft: "5px" }}>
                Torna alla Home
              </button>
            </Link>
          </form>
        </div>
      }
    />
  );
}

function Image(props) {
  return <img src={props.immagine} className="immagineCard" />;
}

function Logo(props) {
  return <img src={assets.Logo} style={{ width: 160, height: 35 }} />;
}
