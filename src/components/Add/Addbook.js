import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';


class Addbook extends Component{
  constructor(props) {
    super(props);
    this.state = {
      booktitlevalue: '', 
      bookisbnvalue: '',
      bookpublicationyearvalue: '',
      bookpublishinghousevalue: '',
      bookauthorvalues: [],
      fileSelected:null, 
      percent:0, 
      uploadshow:false
    };
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeIsbn = this.handleChangeIsbn.bind(this);
    this.handleChangeAuthor = this.handleChangeAuthor.bind(this);
    this.handleChangePublicationyear = this.handleChangePublicationyear.bind(this);
    this.handleChangePublishinghouse = this.handleChangePublishinghouse.bind(this);
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.validator = new SimpleReactValidator({
      messages: {
        required: 'Proszę wypełnić to pole'
      },
    });
  }


  handleChangeTitle(e) {
      this.setState({booktitlevalue: e.target.value});
  }

  handleChangeIsbn(e) {
      this.setState({bookisbnvalue: e.target.value});
  }

  handleChangeAuthor(e) {
	let options = e.target.options;
  	let values = [];
  	for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
            values.push(options[i].value);
        }
    }
    this.setState({bookauthorvalues: values});
  }

  handleChangePublicationyear(e) {
    this.setState({bookpublicationyearvalue: e.target.value});
  }
  handleChangePublishinghouse(e) {
    this.setState({bookpublishinghousevalue: e.target.value});
  }

  handleSubmit(e) {
    //alert('A name was submitted: ' + this.state.teamnamevalue);
    e.preventDefault();
    if (this.validator.allValid()) {
        let filename = '';
        if(this.state.fileSelected !== null){
          filename = this.state.fileSelected.name;
        }
        
        this.props.onAdd(this.state.booktitlevalue, this.state.bookisbnvalue,  this.state.bookpublicationyearvalue,
        this.state.bookpublishinghousevalue, this.state.bookauthorvalues, filename);
        this.setState({booktitlevalue: '', bookisbnvalue: '', bookpublicationyearvalue:'', bookpublishinghousevalue:'', bookauthorvalues: [], percent: 0});
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
    this.setState({ booktitlevalue: '', bookisbnvalue: '', bookpublicationyearvalue: '',bookpublishinghousevalue: '', bookauthorvalues: []});
  }


  fileSelectedHandler(e) {
    this.setState({fileSelected: e.target.files[0], uploadshow: true})

  }

  fileUpload(e) {
    e.preventDefault();
    const fd = new FormData();
    const token = localStorage.getItem('token');
    fd.append('image', this.state.fileSelected, this.state.fileSelected.name);
    axios.post('http://backng.nilow13.usermd.net/api/bookupload'+ '?token='+ token, fd,{
      onUploadProgress: uploadEvent=>{
        this.setState({'percent':  Math.round((uploadEvent.loaded / uploadEvent.total)*100)})
      }

    })
      .then(response => {
        console.log(response);
        this.setState({uploadshow:false})

      })
      .catch(e => {
        console.log(e)
      });
}

  render(){
  return(
  <div className="modal" id="myModal">
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Dodanie nowej książki</h4>
          <button type="button" className="close" onClick={this.handleClose}>&times;</button>
        </div>
        <div className="modal-body">
          <form className="modal-form">
            <div className="row">
              <div className="form-group col-6">
                <label htmlFor="booktitle">Tytuł</label>
                <input type="text" className="form-control" value={this.state.booktitlevalue} onChange={this.handleChangeTitle}/>
                  {this.validator.message('booktitle', this.state.booktitlevalue, 'required')}
              </div>

              <div className="form-group col-6">
                <label htmlFor="bookauthor">Autor</label>
                <select multiple="multiple" className="form-control" onChange={this.handleChangeAuthor} value={this.state.bookauthorvalues}>
			          {this.props.authorslist.map((author)=><option key={author.id} value={author.id}>{author.surname} {author.name} </option>)}
			          </select>
                {this.validator.message('bookauthor', this.state.bookauthorvalues, 'required')}
              </div>
              <div className="form-row">
                <div className="form-group col-6">
                  <label htmlFor="bookisbn">Isbn:</label>
                  <input type="text" className="form-control" value={this.state.bookisbnvalue} onChange={this.handleChangeIsbn}/>
                  {this.validator.message('bookisbn', this.state.bookisbnvalue, 'required')}
                </div>
                <div className="form-group col-6">
                  <label htmlFor="bookpubyear">Rok wydania:</label>
                  <input type="text" className="form-control" value={this.state.bookpublicationyearvalue} onChange={this.handleChangePublicationyear}/>
                  {this.validator.message('bookpubyear', this.state.bookpublicationyearvalue, 'required')}
                </div>
                <div className="form-group col-6">
                  <label htmlFor="bookpubhouse">Dom Wydawniczy:</label>
                  <input type="text" className="form-control" value={this.state.bookpublishinghousevalue} onChange={this.handleChangePublishinghouse}/>
                  {this.validator.message('bookpubhouse', this.state.bookpublishinghousevalue, 'required')}
                </div>
              </div>
         
              <div className="form-group col-6">
                <label htmlFor="bookfile">Okładka:</label>
                <input style={{display:'none'}} type="file" onChange={this.fileSelectedHandler} ref={fileInput => this.fileInput = fileInput}/>
                <div className="form-row">
                <button className="btn btn-primary" onClick={(e) => {this.fileInput.click(); e.preventDefault();}}>Wybierz plik</button>
                <button className="btn btn-primary" onClick={this.fileUpload} disabled={!this.state.uploadshow}>Wgraj plik <span>{this.state.percent} %</span></button>
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

export default Addbook