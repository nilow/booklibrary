import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator';

class Adduser extends Component{
  constructor(props) {
    super(props);
    this.state = {
      usernamevalue: '', 
      usersurnamevalue: '',
      useremailvalue: '',
      userphonevalue: '',
    };
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeSurname = this.handleChangeSurname.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePhone = this.handleChangePhone.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.validator = new SimpleReactValidator({
      messages: {
        required: 'Proszę wypełnić to pole',
        email: 'Proszę podać poprawny adres email'
      },
    });
  }


  handleChangeName(e) {
      this.setState({usernamevalue: e.target.value});
  }

  handleChangeSurname(e) {
      this.setState({usersurnamevalue: e.target.value});
  }

  handleChangeEmail(e) {
    this.setState({useremailvalue: e.target.value});
  }

  handleChangePhone(e) {
    this.setState({userphonevalue: e.target.value});
  }

  handleSubmit(e) {
    //alert('A name was submitted: ' + this.state.teamnamevalue);
    e.preventDefault();
    if (this.validator.allValid()) {
      this.props.onAdd(this.state.usernamevalue, this.state.usersurnamevalue, this.state.useremailvalue, this.state.userphonevalue);
      this.setState({usernamevalue: '', usersurnamevalue: '', useremailvalue: '', userphonevalue: ''});
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
    this.setState({usernamevalue: '', usersurnamevalue: '', useremailvalue: ''});
  }

  render(){
  return(
  <div className="modal" id="myModal">
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Dodanie nowego użytkownika</h4>
          <button type="button" className="close" onClick={this.handleClose}>&times;</button>
        </div>
        <div className="modal-body">
          <form className="modal-form">
            <div className="row">
              <div className="form-group col-6">
                <label htmlFor="username">Imię:</label>
                <input type="text" className="form-control" value={this.state.usernamevalue} onChange={this.handleChangeName}/>
                  {this.validator.message('username', this.state.usernamevalue, 'required')}
              </div>
              <div className="form-group col-6">
                <label htmlFor="usersurname">Nazwisko:</label>
                <input type="text" className="form-control" value={this.state.usersurnamevalue} onChange={this.handleChangeSurname}/>
                {this.validator.message('usersurname', this.state.usersurnamevalue, 'required')}
              </div>
              <div className="form-group col-6">
                <label htmlFor="useremail">Adres email:</label>
                <input type="text" className="form-control" value={this.state.useremailvalue} onChange={this.handleChangeEmail}/>
                {this.validator.message('useremail', this.state.useremailvalue, 'required|email')}
              </div>
              <div className="form-group col-6">
                <label htmlFor="useremail">Telefon:</label>
                <input type="text" className="form-control" value={this.state.userphonevalue} onChange={this.handleChangePhone}/>
                {this.validator.message('useremail', this.state.userphonevalue, 'required')}
              </div>
            </div>
            <button onClick={this.handleSubmit} className="btn btn-primary">Dodaj</button>
          </form> 
        </div>
      </div>
    </div>
  </div>
  )}
}


export default Adduser