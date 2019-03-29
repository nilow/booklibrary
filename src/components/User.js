import React, { Component } from 'react';
import { Link } from "react-router-dom";
import DeleteSvg from './Svg/DeleteSvg';
import EditSvg from './Svg/EditSvg';
import Book2Svg from './Svg/Book2Svg';

class User extends Component{
	constructor(props) {
        super(props);
        this.state ={
	    	name: props.user.name,
				surname: props.user.surname,
				email: props.user.email,
	    	id: props.user.id,
  		}
  		this.onEdit = this.onEdit.bind(this);
      this.onConfirmDelete = this.onConfirmDelete.bind(this);
  	
  	};

    onEdit(e){
    	e.preventDefault();
      this.props.onEdit(this.props.user)
  
    }

  
   onConfirmDelete(e){
      e.preventDefault();
      this.props.onConfirm(this.state.id)

    }

	 
	render(){
		const edit = this.state.edit;
		return(

			<div className="flex-grid">
        <div className="col">{this.state.name}</div>
        <div className="col">{this.state.surname}</div>
				<div className="col">{this.state.email}</div>
        <div className="col col-action"><Link to={"/userborrows/" + this.state.id}><Book2Svg /></Link> | <a href="#" onClick={this.onEdit}><EditSvg /></a> | <a href="#" onClick={this.onConfirmDelete}><DeleteSvg /></a></div>
      </div>
			
		
        
      )}
				 	
}

export default User