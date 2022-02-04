import axios from "axios";
import React, { useState } from "react";
import PropTypes from 'prop-types';

async function registerUser(user) {
  const res = await axios.post('http://localhost:8080/api/v1.0/users/register', user, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  console.log(res);

  if (!res) console.error('failed to register.');

  const creds = {
    email: user.email,
    password: user.password
  }

  const authRes = await axios.post('http://localhost:8080/api/v1.0/auth', creds, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return authRes.data;
}

export default function SignUp({ setToken }) {
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await registerUser({
      firstname,
      lastname,
      email,
      password
    })
    console.log(token);
    setToken(token);
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
            <h3>Sign Up</h3>

            <div className="form-group">
                <label>First name</label>
                <input type="text" className="form-control" placeholder="First name" onChange={e => setFirstname(e.target.value)} />
            </div>

            <div className="form-group">
                <label>Last name</label>
                <input type="text" className="form-control" placeholder="Last name" onChange={e => setLastname(e.target.value)} />
            </div>

            <div className="form-group">
                <label>Email address</label>
                <input type="email" className="form-control" placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Enter password" onChange={e => setPassword(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
            <p className="forgot-password text-right">
                Already registered <a href="/sign-in">sign in?</a>
            </p>
        </form>
      </div>
    </div>
  );
}

SignUp.propTypes = {
  setToken: PropTypes.func.isRequired
}