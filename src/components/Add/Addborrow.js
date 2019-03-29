import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import DatePicker from 'react-date-picker';

class Addborrow extends Component{
  constructor(props) {
    super(props);
    this.state = {
      borrowspecimenvalue: '', 
      borrowuservalue: '',
      borrowstartvalue:'',
    };
    this.handleChangeSpecimen = this.handleChangeSpecimen.bind(this);
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.validator = new SimpleReactValidator({
      messages: {
        required: 'Proszę wypełnić to pole'
      },
    });
  }


  handleChangeSpecimen(e) {
      this.setState({borrowspecimenvalue: e.target.value});
  }

  handleChangeUser(e) {
      this.setState({borrowuservalue: e.target.value});
  }

  handleChangeStart(date) {
    let month = date.getMonth()+1;
    let day = date.getDate();
    let ndate = date.getFullYear() + '-' + (month < 10 ? "0"+month : month) + '-' + (day < 10 ? "0"+day : day);
    this.setState({borrowstartvalue: ndate});
}

 
  handleSubmit(e) {
    //alert('A name was submitted: ' + this.state.teamnamevalue);
    e.preventDefault();
    if (this.validator.allValid()) {
        this.props.onAdd(this.state.borrowspecimenvalue, this.state.borrowuservalue, this.state.borrowstartvalue);
        this.setState({borrowuservalue: '', borrowspecimenvalue: '', borrowstartvalue:''});
        
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
    this.setState({borrowuservalue: '', borrowspecimenvalue: '', borrowstartvalue:''});
  }

  render(){
  return(
  <div className="modal" id="myModal">
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Nowe wypożyczenie</h4>
          <button type="button" className="close" onClick={this.handleClose}>&times;</button>
        </div>
        <div className="modal-body">
          <form className="modal-form">
            <div className="row">
              <div className="form-group col-6">
                <label htmlFor="borrowspecimen">Egzemplarz</label>
                <select className="form-control" onChange={this.handleChangeSpecimen} value={this.state.borrowspecimenvalue}>
                <option value="">-Wybierz-</option>
			    {this.props.specimenslist.map((specimen)=><option key={specimen.specimen_id} value={specimen.specimen_id}>{specimen.library_code} | {specimen.title} | {specimen.isbn}</option>)}
			    </select>
                  {this.validator.message('borrowspecimen', this.state.borrowspecimenvalue, 'required')}
              </div>

              <div className="form-group col-6">
                <label htmlFor="borrowuser">Użytkownik</label>
                <select className="form-control" onChange={this.handleChangeUser} value={this.state.borrowuservalue}>
                <option value="">-Wybierz-</option>
			    {this.props.userslist.map((user)=><option key={user.id} value={user.id}>{user.name} {user.surname}</option>)}
			    </select>
                {this.validator.message('borrowuser', this.state.borrowuservalue, 'required')}
              </div>

              <div className="form-group col-6">
			    <label htmlFor="borrowstart">Data wypożyczenia:</label>
                <div>
                    <DatePicker
                    onChange={this.handleChangeStart}
                    value={this.state.borrowstartvalue!=''?new Date(this.state.borrowstartvalue):this.state.borrowstartvalue}
                    className={"birth"}
                    showLeadingZeros={true}
                    calendarClassName={"calendarcustom"}
                    />
                {this.validator.message('borrowstart', this.state.borrowstartvalue, 'required')}
                </div>

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

export default Addborrow