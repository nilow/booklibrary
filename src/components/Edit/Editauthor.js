import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator';

class Editauthor extends Component{
  constructor(props) {
    super(props);
    this.state = {
      author: this.props.author,
      authornamevalue: this.props.author.name, 
      authorsurnamevalue: this.props.author.surname
    };
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeSurname = this.handleChangeSurname.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.validator = new SimpleReactValidator({
      messages: {
        required: 'Proszę wypełnić to pole'
      },
    });
    //console.log(props.teamslist);
  }

  handleChangeName(e) {
    let value = e.target.value;
    this.setState(prevState => ({
      author: {
          ...prevState.author,
          name: value
      },
      authornamevalue: value
      }))
    
  }

  handleChangeSurname(e) {
    let value = e.target.value;
    this.setState(prevState => ({
      author: {
          ...prevState.author,
          surname: value
      },
      authorsurnamevalue: value
      }))
  }

  handleSubmit(e) {
    //alert('A name was submitted: ' + this.state.teamnamevalue);
    e.preventDefault();
    if (this.validator.allValid()) {
    this.props.onUpdate(this.state.author);
    this.validator.hideMessages();
    }
    else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      this.forceUpdate();
    }  
  }

  handleClose(e) {
      this.props.onCancel();
      this.setState({authornamevalue: '', authorsurnamevalue: ''});
  }


  render(){
    return(
      <div className="modal" id="myModal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edycja autora</h4>
              <button type="button" className="close" onClick={this.handleClose}>&times;</button>
            </div>

            <div className="modal-body">
              <form className="modal-form">
                <div className="row">
                  <div className="form-group col-6">
                    <label htmlFor="authorname">Imię:</label>
                    <input type="text" className="form-control" value={this.state.authornamevalue} onChange={this.handleChangeName}/>
                    {this.validator.message('authorname', this.state.authornamevalue, 'required')}
                  </div>
                  <div className="form-group col-6">
                    <label htmlFor="authorsurname">Nazwisko:</label>
                    <input type="text" className="form-control" value={this.state.authorsurnamevalue} onChange={this.handleChangeSurname}/>
                    {this.validator.message('authorsurname', this.state.authorsurnamevalue, 'required')}
                  </div>
                </div>
                <button onClick={this.handleSubmit} className="btn btn-primary">Zapisz zmiany</button>
              </form> 
            </div>
        </div>
      </div>
    </div>
  )}
}

export default Editauthor