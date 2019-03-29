import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator';

class Edituser extends Component{
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      usernamevalue: this.props.user.name, 
      usersurnamevalue: this.props.user.surname,
      useremailvalue: this.props.user.email,
      userphonevalue: this.props.user.phone,
    };
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeSurname = this.handleChangeSurname.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
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
      user: {
          ...prevState.user,
          name: value
      },
      usernamevalue: value
      }))
    
  }

  handleChangeSurname(e) {
    let value = e.target.value;
    this.setState(prevState => ({
      user: {
          ...prevState.user,
          surname: value
      },
      usersurnamevalue: value
      }))
  }

  handleChangeEmail(e) {
    let value = e.target.value;
    this.setState(prevState => ({
      user: {
          ...prevState.user,
          email: value
      },
      useremailvalue: value
      }))
    
  }

  handleSubmit(e) {
    //alert('A name was submitted: ' + this.state.teamnamevalue);
    e.preventDefault();
    if (this.validator.allValid()) {
    this.props.onUpdate(this.state.user);
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
      this.setState({usernamevalue: '', usersurnamevalue: ''});
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
                    <label htmlFor="useremail">Email:</label>
                    <input type="text" className="form-control" value={this.state.useremailvalue} onChange={this.handleChangeSurname}/>
                    {this.validator.message('useremail', this.state.useremailvalue, 'required')}
                  </div>
                  <div className="form-group col-6">
                    <label htmlFor="userphone">Nazwisko:</label>
                    <input type="text" className="form-control" value={this.state.userphonevalue} onChange={this.handleChangeSurname}/>
                    {this.validator.message('userphone', this.state.userphonevalue, 'required')}
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

export default Edituser