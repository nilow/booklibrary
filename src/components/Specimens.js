import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Specimen from './Specimen';
import Addspecimen from './Add/Addspecimen';
import Editspecimen from './Edit/Editspecimen';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Confirm from './Confirm';
import PlusSvg from './Svg/PlusSvg';
import OkSvg from './Svg/OkSvg';

class Specimens extends Component{

  constructor(props) {
    super(props);
    this.state = {
      specimens: [],
      bookslist:[],
      offset: 0,
      selectedpage: 0,
      perPage: 10,
      pageCount: 1,
      searchtext:'',
      showConfirm: false,
      idToDelete:0,
      specimenToEdit: null,
      showFormAdd: false,
      showFormEdit: false,
    }
  	this.specimenDeleting = this.specimenDeleting.bind(this);
    this.specimenAdd= this.specimenAdd.bind(this);
    this.specimenEdit= this.specimenEdit.bind(this);
    this.specimenCancelAdd= this.specimenCancelAdd.bind(this);
    this.specimenCancelEdit= this.specimenCancelEdit.bind(this);
    this.specimenConfirmDeleting = this.specimenConfirmDeleting.bind(this);
    this.specimenCancelDeleting = this.specimenCancelDeleting.bind(this);
    this.specimenSearch = this.specimenSearch.bind(this);
    this.specimenSearchClear = this.specimenSearchClear.bind(this);
    this.specimenAdding = this.specimenAdding.bind(this);
    this.specimenUpdate = this.specimenUpdate.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.listAllBooks();
    }

    listAllBooks(){
        const token = localStorage.getItem('token');
          axios.get('http://backng.nilow13.usermd.net/api/bookslistall'+ '?token=' + token)
          .then(res => {
            const books= res.data.books;
            this.setState({ bookslist: books});
            
          })
      }


  componentDidMount() {
   
       this.listPortion();
   
  }


  listPortion(){
    const token = localStorage.getItem('token');
  	axios.get('http://backng.nilow13.usermd.net/api/specimens2/'+ this.state.offset +'?token=' + token)
      .then(res => {
        console.log(res.data);
        const specimens= res.data.specimens;
        const total = res.data.total;
        this.setState({ specimens: specimens, pageCount:Math.ceil(total / this.state.perPage)  });
      })
      .catch(e => {
        console.log(e)
      });

  }


  listSearch(){
    const token = localStorage.getItem('token');
    axios.get('http://backng.nilow13.usermd.net/api/searchspecimens2/'+ this.state.searchtext + '/' + this.state.offset + '?token=' + token)
      .then(res => {

        const specimens= res.data.specimens;
        const total = res.data.total;
        this.setState({ specimens: specimens, pageCount:Math.ceil(total / this.state.perPage)  });
        //console.log(this.state);
      })
  }


  specimenSearch(){
    this.setState({offset: 0, selectedpage: 0},()=>{this.listSearch()});
  }

  specimenAdd(){
    this.setState({showFormAdd: true})
  }

  specimenCancelAdd(){
    this.setState({showFormAdd: false})
  }

  
  specimenEdit(specimen){
    console.log(specimen);
    this.setState({showFormEdit: true, specimenToEdit: specimen})
  }

  specimenCancelEdit(){
    this.setState({showFormEdit: false, specimenToEdit: null})
  }

  handleChangeSearch(e) {
    this.setState({searchtext: e.target.value});
  }

  specimenSearchClear(e) {
    this.setState({searchtext: '', offset: 0, selectedpage: 0},()=>{this.listPortion()});
  }

  specimenAdding(newCode, newBookid){
    const token = localStorage.getItem('token');
  	axios.post('http://backng.nilow13.usermd.net/api/specimen'+ '?token=' + token, {library_code: newCode, book_id: newBookid}) 
      .then(res => {
        this.listPortion();
      })
      .catch(e => {
        console.log(e)
      });

  }

  specimenUpdate(specimen){
    const token = localStorage.getItem('token');
    axios.put('http://backng.nilow13.usermd.net/api/specimen/' + specimen.id + '?token=' + token, {library_code: specimen.library_code, book_id: specimen.book_id})
      .then(res => {
        const position = this.state.specimens.findIndex((element) => {
          return element.id == specimen.id;
        });
        this.state.specimens.splice(position, 1);
        const specimens= this.state.specimens;
        
        this.setState({specimens: specimens, showFormEdit: false, specimenToEdit: null}, ()=>{this.state.searchtext ==='' ? this.listPortion() : this.listSearch()});

      })
      .catch(e => {
        console.log(e)
      });
  }

  specimenDeleting(){
  	//alert(teamId);
    const specimenId = this.state.idToDelete;
    const token = localStorage.getItem('token');
    axios.delete('http://backng.nilow13.usermd.net/api/specimen/' + specimenId + '?token=' + token)
    .then(response => {
      console.log(response);
      this.setState({ showConfirm: false, idToDelete: 0 }, ()=>{this.state.searchtext ==='' ? this.listPortion() : this.listSearch()});
    })
    .catch(e => {
      console.log(e)
    });
  }

  specimenConfirmDeleting(specimenId){
    //alert(newsId + "55555");
    this.setState({showConfirm: true, idToDelete: specimenId});
  }

  specimenCancelDeleting(){
    this.setState({showConfirm: false, idToDelete: 0});
  }

  handlePageClick(data){
    let selected = data.selected;
    let offset = Math.ceil(selected * this.state.perPage);
    this.setState({offset: offset, selectedpage: selected},()=>{this.state.searchtext ==='' ? this.listPortion() : this.listSearch()});
  }

  renderPagination(){
    if(this.state.pageCount > 1) {  
      return(
      <ReactPaginate
        breakClassName="page-item"
        breakLabel={<a className="page-link">...</a>}
        pageClassName="page-item"
        previousClassName="page-item"
        nextClassName="page-item"
        pageLinkClassName="page-link"
        previousLinkClassName="page-link"
        nextLinkClassName="page-link"
        containerClassName={"pagination"}
        onPageChange={this.handlePageClick}
        pageCount={this.state.pageCount}
        previousLabel="&laquo;"
        nextLabel="&raquo;" 
        forcePage={this.state.selectedpage}
      />
    )
  }
  }

  render(){
    return(
      <div className="container">
        <div className="top">
          <div><Link to={"/availablespecimens"} className="btn-link"><OkSvg/></Link><a className="btn-link" onClick={this.specimenAdd}><PlusSvg/></a><h3 className="top__title">Egzemplarze</h3></div>
          <div><input type="text" className="form-control" value={this.state.searchtext} onChange={this.handleChangeSearch}/><button disabled={this.state.searchtext === '' ? true : false} type="button" className="btn btn-primary" onClick={this.specimenSearch} >Szukaj</button><button type="button" disabled={this.state.searchtext === '' ? true : false} className="btn btn-primary" onClick={this.specimenSearchClear}>X</button></div>
                  
        </div> 

        <div className="flex-grid first">
          <div className="col"><strong>Numer</strong></div>
          <div className="col"><strong>Tytuł</strong></div>
          <div className="col"><strong>Autor</strong></div>
          <div className="col"><strong>ISBN</strong></div>
          <div className="col">&nbsp;</div>
        </div>

        {this.state.specimens.map((specimen)=><Specimen key={specimen.id} specimen={specimen}  onConfirm={this.specimenConfirmDeleting} onEdit={this.specimenEdit}/>)}
                  
        <div className="pagination__wrapper">
          {this.renderPagination()}
        </div>

        {this.state.showFormEdit && <Editspecimen bookslist={this.state.bookslist} specimen={this.state.specimenToEdit} onUpdate={this.specimenUpdate} onCancel={this.specimenCancelEdit}/>}
        {this.state.showFormAdd && <Addspecimen bookslist={this.state.bookslist} onAdd={this.specimenAdding} onCancel={this.specimenCancelAdd}/>}
        {this.state.showConfirm && <Confirm onCancel={this.specimenCancelDeleting} onConfirm={this.specimenDeleting}/>}

      </div> 
    );
  }
}
export default Specimens
