import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import SimpleReactValidator from 'simple-react-validator';

class Login extends Component{

  	constructor(props) {
      super(props);
      this.state ={
    	login: '',
    	password: '',
    	passproblem: false
  	}

  	this.handleLogin = this.handleLogin.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validator = new SimpleReactValidator({
  messages: {
    required: 'Proszę wypełnić to pole',
    email: 'Podaj poprawny adres email',
  },
});
    }

    handleLogin(e) {
    this.setState({login: e.target.value});
	}

	handlePassword(e) {
	    this.setState({password: e.target.value});
	}

    handleSubmit(e) {
    	e.preventDefault();

    	 if (this.validator.allValid()) {
 
     	axios.post('http://backng.nilow13.usermd.net/api/user/signin', {email: this.state.login, password: this.state.password})
            .then(response => {
              
                if(response.status === 200){
                const token = response.data.token;
                const base64Url = token.split(".")[1];
                const base64 = base64Url.replace("-","+").replace("_","/");
                const decoded = JSON.parse(window.atob(base64));
                //console.log(decoded);
                const date = new Date(0); 
                const utc = date.setUTCSeconds(decoded.exp);
                //const date = decoded.exp; 
                localStorage.setItem('token', token);
                localStorage.setItem('expiration', utc);
                this.props.onTest();
                this.props.history.push("/authors");
              }
              
            })
            .catch(e => {
              console.log(e);
              	this.setState({passproblem: true});
              
            });
            this.validator.hideMessages();
  } else {
    this.validator.showMessages();
    // rerender to show messages for the first time
    this.forceUpdate();
  }
 
  }


	render(){

		return(
      <div>
			  <div className="loginWrapper"></div>
				<div className="formWrapper">
				  <div className="formWrapperInner">
				  <h1 className="text-center mb-3">Biblioteka<br /> panel administracyjny</h1>
						 <form onSubmit={this.handleSubmit}>
							  <div className="form-group">
							    <label htmlFor="email">Email:</label>
							    <input type="email" className="form-control" name="email" id="email" onChange={this.handleLogin} />
							    {this.validator.message('email', this.state.login, 'required|email')}
							  </div>
							  <div className="form-group">
							    <label htmlFor="pwd">Hasło:</label>
							    <input type="password" className="form-control" name="pwd" id="pwd" onChange={this.handlePassword} />
							    {this.validator.message('pwd', this.state.password, 'required')}
							  </div>
							  
							  <button type="submit" className="btn btn-primary">Zaloguj się</button>
						</form> 
            {this.state.passproblem && <div class="alert alert-danger" role="alert">Nieprawidłowe dane logowania</div>}
				  </div>
			  </div>
        </div>
			
		);
	}
}
export default Login
