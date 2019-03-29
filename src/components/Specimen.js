import React, { Component } from 'react';
import DeleteSvg from './Svg/DeleteSvg';
import EditSvg from './Svg/EditSvg';

class Specimen extends Component{
	constructor(props) {
        super(props);
        this.state ={
            library_code: props.specimen.library_code,
            title: props.specimen.book.title,
            authors: props.specimen.authors,
            isbn: props.specimen.book.isbn,
	    	id: props.specimen.id,
          }
          
  		this.onEdit = this.onEdit.bind(this);
        this.onConfirmDelete = this.onConfirmDelete.bind(this);
  	
  	};

    onEdit(e){
        e.preventDefault();
        this.props.onEdit(this.props.specimen)
  
    }

    
   onConfirmDelete(e){
      e.preventDefault();
      this.props.onConfirm(this.state.id)

    }

	
	render(){
		return(
		    <div className="flex-grid">
                <div className="col">{this.state.library_code}</div>
                <div className="col">{this.state.title}</div>
                <div className="col">{this.state.authors.map((el)=><div key={el.id}>{el.name} {el.surname}</div>)}</div>
                <div className="col">{this.state.isbn}</div>
                <div className="col col-action"><a href="#" onClick={this.onEdit}><EditSvg /></a> | <a href="#" onClick={this.onConfirmDelete}><DeleteSvg /></a></div>
            </div>
      )}
				 	
}

export default Specimen