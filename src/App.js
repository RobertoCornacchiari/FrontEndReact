import React, { useReducer, useContext, useEffect, useState } from "react";
import "./style.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
  HomePage,
  Prenota,
  Controlla,
  Esito,
  AreaRiservata,
  LogIn,
} from "./components.js";

const AppContext = React.createContext(null);

export function App() {
  const [state, dispatch] = useReducer(reducer, {
    presidi: ['gianni', 'martio'],
    giorniDisponibili: new Array(),
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Router>
        <Switch>
          <Route path="/LogIn">
            <LogIn contesto={AppContext}/>
          </Route>
          <Route path="/prenota">
            <Prenota contesto={AppContext}/>
          </Route>
          <Route path="/controlla">
            <Controlla contesto={AppContext}/>
          </Route>
          <Route path="/esito">
            <Esito contesto={AppContext}/>
          </Route>
          <Route path="/areaRiservata">
            <AreaRiservata contesto={AppContext}/>
          </Route>
          <Route path="/">
            <HomePage contesto={AppContext}/>
          </Route>
        </Switch>
      </Router>
    </AppContext.Provider>
  );
}

function reducer(state, action) {
	let newState = { ...state };
  switch (action.type) {
    case "":
      break;
    default:
      break;
  }
  console.log("stato", newState);
	return newState;
}