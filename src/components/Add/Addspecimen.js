import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator';

class Addspecimen extends Component{
  constructor(props) {
    super(props);
    this.state = {
      specimencodevalue: '', 
      specimenbookvalue: '',

    };
    this.handleChangeCode = this.handleChangeCode.bind(this);
    this.handleChangeBook = this.handleChangeBook.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.validator = new SimpleReactValidator({
      messages: {
        required: 'Proszę wypełnić to pole'
      },
    });
  }


  handleChangeCode(e) {
      this.setState({specimencodevalue: e.target.value});
  }

  handleChangeBook(e) {
      this.setState({specimenbookvalue: e.target.value});
  }

 
  handleSubmit(e) {
    //alert('A name was submitted: ' + this.state.teamnamevalue);
    e.preventDefault();
    if (this.validator.allValid()) {
        this.props.onAdd(this.state.specimencodevalue, this.state.specimenbookvalue);
        this.setState({specimencodevalue: '', specimenbookvalue: ''});
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
          <h4 className="modal-title">Dodanie nowego egzemplarza</h4>
          <button type="button" className="close" onClick={this.handleClose}>&times;</button>
        </div>
        <div className="modal-body">
          <form className="modal-form">
            <div className="row">
              <div className="form-group col-6">
                <label htmlFor="specimencode">Kod egzemplarza</label>
                <input type="text" className="form-control" value={this.state.specimencodevalue} onChange={this.handleChangeCode}/>
                  {this.validator.message('specimencode', this.state.specimencodevalue, 'required')}
              </div>

              <div className="form-group col-6">
                <label htmlFor="specimenbook">Książka</label>
                <select className="form-control" onChange={this.handleChangeBook} value={this.state.specimenbookvalue}>
                <option value="">-Wybierz-</option>
			    {this.props.bookslist.map((book)=><option key={book.id} value={book.id}>{book.title} | {book.authors.map((el)=>el.fullname + " ")} | {book.isbn}</option>)}
			    </select>
                {this.validator.message('specimenbook', this.state.specimenbookvalue, 'required')}
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

export default Addspecimen