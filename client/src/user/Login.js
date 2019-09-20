import React, {useState} from 'react'
import {Link,Redirect} from 'react-router-dom';
import axios from "axios";
import {authenticate} from '../auth';
import SocialLogin from "./SocialLogin";

const Login = () => {
    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
        redirectToReferrer: false
    });

    const { email, password, redirectToReferrer,loading, error } = values;
    
    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };
    const clickSubmit = event => {
        event.preventDefault();
        const user={email,password};
        setValues({ ...values, error: false, loading: true });
        axios
          .post("/api/signin",user)
          .then(res => {
                //console.log(res);
                authenticate(res.data,()=>{
                    setValues({redirectToReferrer:true})
                })
          })
          .catch(err => {
              setValues({...values,error:err});
          });
    };
    const showError = () => (
        <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
        >
            {error}
        </div>
    );
    const redirect=()=>{
        if(redirectToReferrer){
            return <Redirect to='/' />
        }
    }
    const showLoading = () =>
        loading && (
            <div className="alert alert-info">
                <h4>Loading...</h4>
            </div>
        );


    return (
      <div className="container" style={{marginTop:'1vh',padding:'5vw'}}>
        <div className='container'>
           <div className="card cloudy-knoxville-gradient">
            <h5 className="card-header info-color white-text text-center py-4">
            <strong>Log In</strong>
            </h5>
            {showError()}
            {showLoading()}
            {redirect()}
            <div className="card-body px-lg-5 pt-0">
            <form className="text-center" style={{color: '#757575'}} onSubmit={clickSubmit}>
                <div className="md-form">
                <input
                    type="email"
                    id="materialLoginFormEmail"
                    className="form-control"
                    onChange={handleChange('email')}
                    value={email}
                    required
                    autoComplete="email"
                />
                <label htmlFor="materialLoginFormEmail">Email</label>
                </div>
                <div className="md-form">
                <input
                    type="password"
                    id="materialLoginFormPassword"
                    className="form-control"
                    onChange={handleChange('password')}
                    value={password}
                    required
                    autoComplete='password'
                />
                <label htmlFor="materialLoginFormPassword">Password</label>
                </div>
                <button
                className="btn btn-outline-info btn-rounded btn-block my-4 waves-effect z-depth-0"
                type="submit"
                >
                Log in
                </button>
                <p>
                <Link to="/forgot-password" className="text-danger">
                    {" "}
                    Forgot Password
                </Link>
                </p>
                <p>
                Not a member?
                <Link to='/signup'>Signup</Link>
                </p>
            </form>
            <p>or sign in with:</p>
                <SocialLogin />
            </div>
        </div>
        </div>
      </div>
    );
}

export default Login