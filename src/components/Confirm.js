import React, { Component } from 'react';

class Confirm extends Component{
constructor(props) {
    super(props);
   

    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    
  }

onCancel(){
	this.props.onCancel();
}

onConfirm(){
	this.props.onConfirm();
}

render(){
return(
<div className="confirm-wrapper">
	<div className="confirm-box">
		<h3>Czy na pewno usunąć ten element z listy?</h3>
		<div className="button-container">
			<button className="btn btn-primary" onClick = {this.onConfirm}>Potwierdź</button> 
			<button className="btn btn-primary" onClick = {this.onCancel}>Anuluj</button>
		</div>
	</div>
</div>
)}
}

export default Confirm