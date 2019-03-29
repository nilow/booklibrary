import React, { Component } from 'react';
import Author from './Author';
import Addauthor from './Add/Addauthor';
import Editauthor from './Edit/Editauthor';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Confirm from './Confirm';
import PlusSvg from './Svg/PlusSvg';


class Authors extends Component{

  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      offset: 0,
      selectedpage: 0,
      perPage: 10,
      pageCount: 1,
      searchtext:'',
      showConfirm: false,
      idToDelete:0,
      authorToEdit: null,
      showFormAdd: false,
      showFormEdit: false,
    }
  	this.authorDeleting = this.authorDeleting.bind(this);
    this.authorAdd= this.authorAdd.bind(this);
    this.authorEdit= this.authorEdit.bind(this);
    this.authorCancelAdd= this.authorCancelAdd.bind(this);
    this.authorCancelEdit= this.authorCancelEdit.bind(this);
    this.authorConfirmDeleting = this.authorConfirmDeleting.bind(this);
    this.authorCancelDeleting = this.authorCancelDeleting.bind(this);
    this.authorSearch = this.authorSearch.bind(this);
    this.authorSearchClear = this.authorSearchClear.bind(this);
    this.authorAdding = this.authorAdding.bind(this);
    this.authorUpdate = this.authorUpdate.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    }


  componentDidMount() {
       this.listPortion();
  }


  listPortion(){
    const token = localStorage.getItem('token');
  	axios.get('http://backng.nilow13.usermd.net/api/authors/'+ this.state.offset +'?token=' + token)
      .then(res => {
        console.log(res.data);
        const authors= res.data.authors;
        const total = res.data.total;
        this.setState({ authors: authors, pageCount:Math.ceil(total / this.state.perPage)  });
      })
      .catch(e => {
        console.log(e)
      });

  }


  listSearch(){
    const token = localStorage.getItem('token');
    axios.get('http://backng.nilow13.usermd.net/api/searchauthors/'+ this.state.searchtext + '/' + this.state.offset + '?token=' + token)
      .then(res => {

        const authors= res.data.authors;
        const total = res.data.total;
        this.setState({ authors: authors, pageCount:Math.ceil(total / this.state.perPage)  });
        //console.log(this.state);
      })
  }


 authorSearch(){
   this.setState({offset: 0, selectedpage: 0},()=>{this.listSearch()});
    //console.log(this.state.searchtext)
    ;
  }

  authorAdd(){
    this.setState({showFormAdd: true})
  }

  authorCancelAdd(){
    this.setState({showFormAdd: false})
  }

  
  authorEdit(author){
    console.log(author);
    this.setState({showFormEdit: true, authorToEdit: author})
  }

  authorCancelEdit(){
    this.setState({showFormEdit: false, authorToEdit: null})
  }

  handleChangeSearch(e) {
    this.setState({searchtext: e.target.value});
  }

  authorSearchClear(e) {
    this.setState({searchtext: '', offset: 0, selectedpage: 0},()=>{this.listPortion()});
  }

  authorAdding(newName, newSurname){
  	//alert(newTeamId);
    const token = localStorage.getItem('token');
  	axios.post('http://backng.nilow13.usermd.net/api/author'+ '?token=' + token,{name: newName, surname: newSurname}) 
      .then(res => {
        this.listPortion();
        
      })
      .catch(e => {
        console.log(e)
      });

  }

  authorUpdate(author){
    const token = localStorage.getItem('token');
    axios.put('http://backng.nilow13.usermd.net/api/author/' + author.id + '?token=' + token, {name: author.name, surname: author.surname })
      .then(res => {
        const position = this.state.authors.findIndex((element) => {
          return element.id == author.id;
        });
        this.state.authors.splice(position, 1);
        const authors= this.state.authors;
        
        this.setState({authors: authors, showFormEdit: false, authorToEdit: null}, ()=>{this.state.searchtext ==='' ? this.listPortion() : this.listSearch()});

      })
      .catch(e => {
        console.log(e)
      });
  }

  authorDeleting(){
  	//alert(teamId);
    const authorId = this.state.idToDelete;
    const token = localStorage.getItem('token');
    axios.delete('http://backng.nilow13.usermd.net/api/author/' + authorId + '?token=' + token)
    .then(response => {
      console.log(response);
      this.setState({ showConfirm: false, idToDelete: 0 }, ()=>{this.state.searchtext ==='' ? this.listPortion() : this.listSearch()});
    })
    .catch(e => {
      console.log(e)
    });
  }

  authorConfirmDeleting(authorId){
    //alert(newsId + "55555");
    this.setState({showConfirm: true, idToDelete: authorId});
  }

  authorCancelDeleting(){
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
          <div><a className="btn-link" onClick={this.authorAdd}><PlusSvg /></a><h3 className="top__title">Autorzy</h3></div>
          <div><input type="text" className="form-control" value={this.state.searchtext} onChange={this.handleChangeSearch}/><button disabled={this.state.searchtext === '' ? true : false} type="button" className="btn btn-primary" onClick={this.authorSearch} >Szukaj</button><button type="button" disabled={this.state.searchtext === '' ? true : false} className="btn btn-primary" onClick={this.authorSearchClear}>X</button></div>
                  
        </div> 

        <div className="flex-grid first">
          <div className="col"><strong>Imię</strong></div>
          <div className="col"><strong>Nazwisko</strong></div>
          <div className="col">&nbsp;</div>
        </div>

        {this.state.authors.map((author)=><Author key={author.id} author={author}  onConfirm={this.authorConfirmDeleting} onEdit={this.authorEdit}/>)}
                  
        <div className="pagination__wrapper">
          {this.renderPagination()}
        </div>

        {this.state.showFormEdit && <Editauthor author={this.state.authorToEdit} onUpdate={this.authorUpdate} onCancel={this.authorCancelEdit}/>}
        {this.state.showFormAdd && <Addauthor onAdd={this.authorAdding} onCancel={this.authorCancelAdd}/>}
        {this.state.showConfirm && <Confirm onCancel={this.authorCancelDeleting} onConfirm={this.authorDeleting}/>}

      </div> 
     

    );
  }
}
export default Authors
