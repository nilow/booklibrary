import React, { Component } from 'react';
import { NavLink, Redirect, withRouter} from "react-router-dom";
import UserSvg from './Svg/UserSvg';

class Header extends Component{
	constructor(props) {
    super(props);
    this.state ={
			roles: [],	
			showMenu: false,
  	}
	this.handleLogout = this.handleLogout.bind(this);	
	this.handleClick = this.handleClick.bind(this);	
}


handleLogout(){
  localStorage.clear();
  this.props.history.push('/');
}

handleClick(){
  this.setState( (prevState) => ({
		showMenu: !prevState.showMenu
	}));
	console.log(this.state.showMenu)
}

renderAdminMenu(){
  	return(
  		<ul className="navbar-nav">
			     <li className="nav-item">
		          <NavLink exact className="nav-link" to="/authors">Autorzy</NavLink>
		        </li>
		       <li className="nav-item">
		          <NavLink exact className="nav-link" to="/books">Książki</NavLink>
		        </li>
		        <li className="nav-item">
		          <NavLink className="nav-link" to="/specimens">Egzemplarze</NavLink>
		        </li>
		        <li className="nav-item">
		          <NavLink className="nav-link" to="/borrows">Wypożyczenia</NavLink>
		        </li>
		        <li className="nav-item">
		          <NavLink className="nav-link" to="/users">Użytkownicy</NavLink>
		        </li>
		        
			  </ul>
  	)
	}
	
	renderAdminMobMenu(){
  	return(
  		<ul className="navbar-nav-mob">
			     <li className="nav-item">
		          <NavLink exact className="nav-link" to="/authors">Autorzy</NavLink>
		        </li>
		       <li className="nav-item">
		          <NavLink exact className="nav-link" to="/books">Książki</NavLink>
		        </li>
		        <li className="nav-item">
		          <NavLink className="nav-link" to="/specimens">Egzemplarze</NavLink>
		        </li>
		        <li className="nav-item">
		          <NavLink className="nav-link" to="/borrows">Wypożyczenia</NavLink>
		        </li>
		        <li className="nav-item">
		          <NavLink className="nav-link" to="/users">Użytkownicy</NavLink>
		        </li>
		        
			  </ul>
  	)
  }

	render(){
	if(this.props.history.location.pathname !=='/'){

		let menu = this.renderAdminMenu();
		let menumob = this.renderAdminMobMenu();
		

		return(
			<nav>
				<div className="mobile-nav" onClick={this.handleClick}><div className="mobile-nav-inner"><span></span><span></span><span></span></div></div>
				{menu}
				{this.state.showMenu && menumob}
				<div className="ml-auto d-flex align-items-center userdata">
					<UserSvg /> {this.props.user} <button className="btn btn-secondary" onClick={this.handleLogout}>Wyloguj się</button>
				</div>
			</nav>
			
		);
	}
	else{
		return(<div></div>)
	}
	
	}
	
	
}
export default withRouter(Header);