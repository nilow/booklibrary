import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import DatePicker from 'react-date-picker';

class Editborrow extends Component{
  constructor(props) {
    super(props);
    this.state = {
        borrow: this.props.borrow,
        borrowendvalue: '',

    };
    
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.validator = new SimpleReactValidator({
      messages: {
        required: 'Proszę wypełnić to pole'
      },
    });
    //console.log(props.teamslist);
  }


  handleChangeEnd(date) {
    let month = date.getMonth()+1;
    let day = date.getDate();
    let ndate = date.getFullYear() + '-' + (month < 10 ? "0"+month : month) + '-' + (day < 10 ? "0"+day : day);

    this.setState(prevState => ({
        borrow: {
            ...prevState.borrow,
            end: ndate
        },
        borrowendvalue: ndate
      })) 
  }

  
  handleSubmit(e) {
    //alert('A name was submitted: ' + this.state.teamnamevalue);
    e.preventDefault();
    if (this.validator.allValid()) {
      this.props.onUpdate(this.state.borrow);
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
      this.setState({specimencodevalue: '', specimenbookvalue: ''});
  }


  render(){
    return(
        <div className="modal" id="myModal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{this.state.borrow.book.title} | {this.state.borrow.specimen.library_code}
              </h4>
              <h4 className="modal-title">Wypożyczający: {this.state.borrow.user.name} {this.state.borrow.user.surname} </h4>
              <h4 className="modal-title">Data wypożyczenia: {this.state.borrow.start} </h4>
              <button type="button" className="close" onClick={this.handleClose}>&times;</button>
            </div>
            <div className="modal-body">
                <form className="modal-form">
                    <div className="row">
                    <div className="form-group col-6">
                        <label htmlFor="borrowstart">Data zwrotu:</label>
                        <div>
                            <DatePicker
                            onChange={this.handleChangeEnd}
                            value={this.state.borrowendvalue!=''?new Date(this.state.borrowendvalue):this.state.borrowendvalue}
                            className={"birth"}
                            showLeadingZeros={true}
                            calendarClassName={"calendarcustom"}
                            />
                       
                        </div>

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

export default Editborrow