import React, { Component } from 'react';
import DeleteSvg from './Svg/DeleteSvg';
import EditSvg from './Svg/EditSvg';

class Author extends Component{
	constructor(props) {
        super(props);
        this.state ={
	    	name: props.author.name,
	    	surname: props.author.surname,
	    	id: props.author.id,
	    	edit: false,
  		}
  		this.onEdit = this.onEdit.bind(this);
      this.onConfirmDelete = this.onConfirmDelete.bind(this);
  	
  	};

    onEdit(e){
    	e.preventDefault();
      this.props.onEdit(this.props.author)
  
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
        <div className="col col-action"><a href="#" onClick={this.onEdit}><EditSvg /></a> | <a href="#" onClick={this.onConfirmDelete}><DeleteSvg /></a></div>
      </div>
			
		
        
      )}
				 	
}

export default Author