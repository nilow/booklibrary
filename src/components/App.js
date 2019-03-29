import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import axios from 'axios';
//import Home from './Home';
import Users from './Users';
import Books from './Books';
import Specimens from './Specimens.js';
import Availablespecimens from './Availablespecimens.js';
import Bookspecimens from './Bookspecimens.js';
import Borrows from './Borrows';
import Currentborrows from './Currentborrows';
import Userborrows from './Userborrows';
import Header from './Header';
//import Teams from './Teams';
//import Teamsgeneral from './Teamsgeneral';
//import Trainingsgeneral from './Trainingsgeneral';
//import Players from './Players';
//import Playersgeneral from './Playersgeneral';
//import News from './News';
//import Newsgeneral from './Newsgeneral';
//import Trainings from './Trainings';
//import Newsmore from './Newsmore';
//import Trainingdetails from './Trainingdetails';
//import Playerdetails from './Playerdetails';
import Login from './Login';
import Authors from './Authors';
import NoMatch from './NoMatch';

const AuthService = {
  checkAuth() {
    const token =  localStorage.getItem('token');
    const date = localStorage.getItem('expiration');
    if(token && date && (date.valueOf() > new Date().valueOf())){
      return true;
    }
    return false;
  }
  
}

const SecretRoute = ({ path, exact, component: Component, ...rest }) => (
  <Route path={path}
    exact={exact} render={(props) => (
    
    AuthService.checkAuth() === true
      ? <Component {...props} {...rest} />
      : <Redirect to='/' />
  )} />
);

const RouteWithProps = ({ path, exact, component: Component, ...rest }) => (
  <Route path={path}
    exact={exact} render={(props) => (
     <Component {...props} {...rest} />
  )} />
);
class App extends Component {

constructor() {
  super();
  this.state ={
  user:'',
  user_role:''    
  }
 
this.test = this.test.bind(this); 
this.getUser = this.getUser.bind(this); 
}

test(){
 
   this.getUser();
    
}

getUser(){
  const token = localStorage.getItem('token');
  if(token){
  axios.get('http://backng.nilow13.usermd.net/api/loggeduser' + '?token=' + token)
            .then(response => {
             console.log(response);
             const user= response.data.user;
            const user_role = response.data.roles;
            this.setState({ user: user });
            this.setState({ user_role: user_role }); 
            
            })
            .catch(e => {
              console.log(e)
            });
          }
}

componentDidMount(){
  this.getUser();
}



  render() {
    return (
      <Router>
      <div>
      <Header user={this.state.user} user_role={this.state.user_role} />

       <Switch>
	     <RouteWithProps exact path="/" component={Login} onTest={this.test} />
       <SecretRoute path="/authors" component={Authors} />
       <SecretRoute path="/users" component={Users} />
       <SecretRoute path="/books" component={Books} />
       <SecretRoute path="/bookspecimens/:id" component={Bookspecimens} />
       <SecretRoute path="/specimens" component={Specimens} />
       <SecretRoute path="/availablespecimens" component={Availablespecimens} />
       <SecretRoute path="/currentborrows" component={Currentborrows} />
       <SecretRoute path="/borrows" component={Borrows} />
       <SecretRoute path="/userborrows/:id" component={Userborrows} />
       
       <SecretRoute component={NoMatch} />
       </Switch>

	  </div>
  </Router>
    );
  }
}

export default App;

