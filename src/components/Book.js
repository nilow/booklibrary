import React, { Component } from 'react';
import { Link } from "react-router-dom";
import DeleteSvg from './Svg/DeleteSvg';
import EditSvg from './Svg/EditSvg';
import BookSvg from './Svg/BookSvg';

class Book extends Component{
	constructor(props) {
        super(props);
        this.state ={
            title: props.book.title,
            isbn: props.book.isbn,
            authors: props.book.authors,
	    	id: props.book.id,
          }
          
  		this.onEdit = this.onEdit.bind(this);
        this.onConfirmDelete = this.onConfirmDelete.bind(this);
  	
  	};

    onEdit(e){
        e.preventDefault();
        this.props.onEdit(this.props.book)
  
    }

    
   onConfirmDelete(e){
      e.preventDefault();
      this.props.onConfirm(this.state.id)

    }

	
	render(){
		return(
		    <div className="flex-grid">
                <div className="col">{this.state.title}</div>
                <div className="col">{this.state.authors.map((el)=><div key={el.id}>{el.name} {el.surname}</div>)}</div>
                <div className="col">{this.state.isbn}</div>
                <div className="col col-action"><Link to={"/bookspecimens/" + this.state.id}><BookSvg /></Link> | <a href="#" onClick={this.onEdit}><EditSvg /></a> | <a href="#" onClick={this.onConfirmDelete}><DeleteSvg /></a></div>
            </div>
      )}
				 	
}

export default Book;