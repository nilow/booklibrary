import React, { Component } from 'react';
import Book from './Book';
import Addbook from './Add/Addbook';
import Editbook from './Edit/Editbook';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Confirm from './Confirm';
import PlusSvg from './Svg/PlusSvg';

class Books extends Component{

  constructor(props) {
    super(props);
    this.state = {
      books: [],
      authorslist:[],
      offset: 0,
      selectedpage: 0,
      perPage: 10,
      pageCount: 1,
      searchtext:'',
      showConfirm: false,
      idToDelete:0,
      bookToEdit: null,
      showFormAdd: false,
      showFormEdit: false,
    }
  	this.bookDeleting = this.bookDeleting.bind(this);
    this.bookAdd= this.bookAdd.bind(this);
    this.bookEdit= this.bookEdit.bind(this);
    this.bookCancelAdd= this.bookCancelAdd.bind(this);
    this.bookCancelEdit= this.bookCancelEdit.bind(this);
    this.bookConfirmDeleting = this.bookConfirmDeleting.bind(this);
    this.bookCancelDeleting = this.bookCancelDeleting.bind(this);
    this.bookSearch = this.bookSearch.bind(this);
    this.bookSearchClear = this.bookSearchClear.bind(this);
    this.bookAdding = this.bookAdding.bind(this);
    this.bookUpdate = this.bookUpdate.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.listAllAuthors();
    }

    listAllAuthors(){
        const token = localStorage.getItem('token');
          axios.get('http://backng.nilow13.usermd.net/api/authorslistall'+ '?token=' + token)
          .then(res => {
            const authors= res.data.authors;
            this.setState({ authorslist: authors});
            
          })
      }


  componentDidMount() {
       this.listPortion();
  }


  listPortion(){
    const token = localStorage.getItem('token');
  	axios.get('http://backng.nilow13.usermd.net/api/books2/'+ this.state.offset +'?token=' + token)
      .then(res => {
        console.log(res.data);
        const books= res.data.books;
        const total = res.data.total;
        this.setState({ books: books, pageCount:Math.ceil(total / this.state.perPage)  });
      })
      .catch(e => {
        console.log(e)
      });

  }


  listSearch(){
    const token = localStorage.getItem('token');
    axios.get('http://backng.nilow13.usermd.net/api/searchbooks2/'+ this.state.searchtext + '/' + this.state.offset + '?token=' + token)
      .then(res => {

        const books= res.data.books;
        const total = res.data.total;
        this.setState({ books: books, pageCount:Math.ceil(total / this.state.perPage)  });
        //console.log(this.state);
      })
  }


 bookSearch(){
    this.setState({offset: 0, selectedpage: 0},()=>{this.listSearch()});
  }

  bookAdd(){
    this.setState({showFormAdd: true})
  }

  bookCancelAdd(){
    this.setState({showFormAdd: false})
  }

  
  bookEdit(book){
    console.log(book);
    this.setState({showFormEdit: true, bookToEdit: book})
  }

  bookCancelEdit(){
    this.setState({showFormEdit: false, bookToEdit: null})
  }

  handleChangeSearch(e) {
    this.setState({searchtext: e.target.value});
  }

  bookSearchClear(e) {
    this.setState({searchtext: '', offset: 0, selectedpage: 0},()=>{this.listPortion()});
  }

  bookAdding(newTitle, newIsbn, newPubyear, newPubhouse, newAuthors, newFilename){
  	//alert(newTeamId);
    const token = localStorage.getItem('token');
  	axios.post('http://backng.nilow13.usermd.net/api/book'+ '?token=' + token,{title: newTitle, isbn: newIsbn, publication_year: newPubyear, publishing_house: newPubhouse, authorid: newAuthors, cover_file: newFilename}) 
      .then(res => {
        this.listPortion();
        
      })
      .catch(e => {
        console.log(e)
      });

  }

  bookUpdate(book){
    const token = localStorage.getItem('token');
    axios.put('http://backng.nilow13.usermd.net/api/book/' + book.id + '?token=' + token, {title: book.title, isbn: book.isbn, publication_year: book.publication_year, publishing_house: book.publishing_house, cover_file: book.cover_file, authors: book.authors.map((el)=>el.id)})
      .then(res => {
        const position = this.state.books.findIndex((element) => {
          return element.id == book.id;
        });
        this.state.books.splice(position, 1);
        const books= this.state.books;
        
        this.setState({books: books, showFormEdit: false, bookToEdit: null}, ()=>{this.state.searchtext ==='' ? this.listPortion() : this.listSearch()});

      })
      .catch(e => {
        console.log(e)
      });
  }

  bookDeleting(){
  	//alert(teamId);
    const bookId = this.state.idToDelete;
    const token = localStorage.getItem('token');
    axios.delete('http://backng.nilow13.usermd.net/api/book/' + bookId + '?token=' + token)
    .then(response => {
      console.log(response);
      this.setState({ showConfirm: false, idToDelete: 0 }, ()=>{this.state.searchtext ==='' ? this.listPortion() : this.listSearch()});
    })
    .catch(e => {
      console.log(e)
    });
  }

  bookConfirmDeleting(bookId){
    //alert(newsId + "55555");
    this.setState({showConfirm: true, idToDelete: bookId});
  }

  bookCancelDeleting(){
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
          <div><a className="btn-link" onClick={this.bookAdd}><PlusSvg/></a><h3 className="top__title">Książki</h3></div>
          <div><input type="text" className="form-control" value={this.state.searchtext} onChange={this.handleChangeSearch}/><button disabled={this.state.searchtext === '' ? true : false} type="button" className="btn btn-primary" onClick={this.bookSearch} >Szukaj</button><button type="button" disabled={this.state.searchtext === '' ? true : false} className="btn btn-primary" onClick={this.bookSearchClear}>X</button></div>
                  
        </div> 

        <div className="flex-grid first">
          <div className="col"><strong>Tytuł</strong></div>
          <div className="col"><strong>Autor</strong></div>
          <div className="col"><strong>ISBN</strong></div>
          <div className="col">&nbsp;</div>
        </div>

        {this.state.books.map((book)=><Book key={book.id} book={book}  onConfirm={this.bookConfirmDeleting} onEdit={this.bookEdit}/>)}
                  
        <div className="pagination__wrapper">
          {this.renderPagination()}
        </div>

        {this.state.showFormEdit && <Editbook authorslist={this.state.authorslist} book={this.state.bookToEdit} onUpdate={this.bookUpdate} onCancel={this.bookCancelEdit}/>}
        {this.state.showFormAdd && <Addbook authorslist={this.state.authorslist} onAdd={this.bookAdding} onCancel={this.bookCancelAdd}/>}
        {this.state.showConfirm && <Confirm onCancel={this.bookCancelDeleting} onConfirm={this.bookDeleting}/>}

      </div> 
    );
  }
}
export default Books
