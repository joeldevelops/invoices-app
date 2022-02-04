import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Route, Routes, Link } from "react-router-dom";

import InvoiceList from './components/InvoiceList/InvoiceList';
import LateInvoiceList from './components/LateInvoiceList/LateInvoiceList';
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import NewInvoice from './components/NewInvoice/NewInvoice';

function setToken(token) {
  localStorage.setItem('token', token);
}

function getToken() {
  return localStorage.getItem('token')
}

function App() {
  const token = getToken();

  if (!token) console.log('No token in memory');

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/"}>Invoices</Link>
          <div className="navbar-items">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/past-due"}>Past Due</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/new-invoice"}>New Invoice</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-in"}>Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route exact path='/' element={<InvoiceList getToken={getToken} />} />
        <Route path="/past-due" element={<LateInvoiceList getToken={getToken} />} />
        <Route path="/new-invoice" element={<NewInvoice getToken={getToken} />} />
        <Route path="/sign-up" element={<SignUp setToken={setToken} />} />
        <Route path="/sign-in" element={<Login setToken={setToken} />} />
      </Routes>
    </div>
  );
}

export default App;