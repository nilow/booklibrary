import React, { Component } from 'react';
import DeleteSvg from './Svg/DeleteSvg';
import EditSvg from './Svg/EditSvg';

class Borrow extends Component{
	constructor(props) {
        super(props);
        this.state ={
            title: props.borrow.book.title,
            code: props.borrow.specimen.library_code,
            username: props.borrow.user.name,
            usersurname: props.borrow.user.surname,
            start: props.borrow.start,
            end: props.borrow.end,
	    	id: props.borrow.id,
          }
          
  		this.onEdit = this.onEdit.bind(this);
        this.onConfirmDelete = this.onConfirmDelete.bind(this);
  	
  	};

    onEdit(e){
        e.preventDefault();
        this.props.onEdit(this.props.borrow)
  
    }

    
   onConfirmDelete(e){
      e.preventDefault();
      this.props.onConfirm(this.state.id)

    }

	
	render(){
		return(
		    <div className="flex-grid">
                <div className="col">{this.state.code}</div>
                <div className="col">{this.state.title}</div>
                <div className="col">{this.state.username} {this.state.usersurname}</div>
                <div className="col">{this.state.start !== null ? this.state.start.split(' ')[0]:''}</div>
                <div className="col">{this.state.end !== null ? this.state.end.split(' ')[0]:''}</div>
                <div className="col col-action"><a href="#" onClick={this.onEdit}><EditSvg /></a> | <a href="#" onClick={this.onConfirmDelete}><DeleteSvg /></a></div>
            </div>
      )}
				 	
}

export default Borrow