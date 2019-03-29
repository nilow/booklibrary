import React, { Component } from 'react';
import Borrow from './Borrow';
import Addborrow from './Add/Addborrow';
import Editborrow from './Edit/Editborrow';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Confirm from './Confirm';
import PlusSvg from './Svg/PlusSvg';

class UserBorrows extends Component{

  constructor(props) {
    super(props);
    this.state = {
      borrows: [],
      specimenslist:[],
      userslist:[],
      offset: 0,
      selectedpage: 0,
      perPage: 10,
      pageCount: 1,
      searchtext:'',
      showConfirm: false,
      idToDelete: 0,
      borrowToEdit: null,
      showFormAdd: false,
      showFormEdit: false,
    }
  	this.borrowDeleting = this.borrowDeleting.bind(this);
    this.borrowAdd= this.borrowAdd.bind(this);
    this.borrowEdit= this.borrowEdit.bind(this);
    this.borrowCancelAdd= this.borrowCancelAdd.bind(this);
    this.borrowCancelEdit= this.borrowCancelEdit.bind(this);
    this.borrowConfirmDeleting = this.borrowConfirmDeleting.bind(this);
    this.borrowCancelDeleting = this.borrowCancelDeleting.bind(this);
    this.borrowSearch = this.borrowSearch.bind(this);
    this.borrowSearchClear = this.borrowSearchClear.bind(this);
    this.borrowAdding = this.borrowAdding.bind(this);
    this.borrowUpdate = this.borrowUpdate.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.listAllUsers();
    this.listAvailableSpecimens();
    }

    listAllUsers(){
        const token = localStorage.getItem('token');
          axios.get('http://backng.nilow13.usermd.net/api/userslistall'+ '?token=' + token)
          .then(res => {
            const users= res.data.users;
            this.setState({ userslist: users});
            
          })
    }

    listAvailableSpecimens(){
        const token = localStorage.getItem('token');
          axios.get('http://backng.nilow13.usermd.net/api/specimenslistall'+ '?token=' + token)
          .then(res => {
            const specimens= res.data.specimens;
            this.setState({ specimenslist: specimens});
            
          })
    }


  componentDidMount() {
       this.listPortion();
  }


  listPortion(){
    const token = localStorage.getItem('token');
  	axios.get('http://backng.nilow13.usermd.net/api/userborrows2/'+ this.props.match.params.id +'/'+ this.state.offset +'?token=' + token)
      .then(res => {
        console.log(res.data);
        const borrows= res.data.borrows;
        const total = res.data.total;
        this.setState({ borrows: borrows, pageCount:Math.ceil(total / this.state.perPage)  });
      })
      .catch(e => {
        console.log(e)
      });

  }


  listSearch(){
    const token = localStorage.getItem('token');
    axios.get('http://backng.nilow13.usermd.net/api/searchuserborrows2/'+ this.props.match.params.id +'/'+ this.state.searchtext + '/' + this.state.offset + '?token=' + token)
      .then(res => {

        const borrows= res.data.borrows;
        const total = res.data.total;
        this.setState({ borrows: borrows, pageCount:Math.ceil(total / this.state.perPage)  });
        //console.log(this.state);
      })
  }


 borrowSearch(){
    this.setState({offset: 0, selectedpage: 0},()=>{this.listSearch()});
  }

  borrowAdd(){
    this.setState({showFormAdd: true})
  }

  borrowCancelAdd(){
    this.setState({showFormAdd: false})
  }

  
  borrowEdit(borrow){
    console.log(borrow);
    this.setState({showFormEdit: true, borrowToEdit: borrow})
  }

  borrowCancelEdit(){
    this.setState({showFormEdit: false, borrowToEdit: null})
  }

  handleChangeSearch(e) {
    this.setState({searchtext: e.target.value});
  }

  borrowSearchClear(e) {
    this.setState({searchtext: '', offset: 0, selectedpage: 0},()=>{this.listPortion()});
  }

  borrowAdding(newSpecimenid, newUserid, newStart){
  	//alert(newTeamId);
    const token = localStorage.getItem('token');
    const position = this.state.specimenslist.findIndex((element) => {
        return element.specimen_id === Number(newSpecimenid);
    });
    this.state.specimenslist.splice(position, 1);
    const specimenslist= this.state.specimenslist;
    this.setState({specimenslist: specimenslist});

  	axios.post('http://backng.nilow13.usermd.net/api/borrow'+ '?token=' + token, {user_id: newUserid, specimen_id: newSpecimenid, start:newStart}) 
      .then(res => {
        this.listPortion();
      })
      .catch(e => {
        console.log(e)
      });

  }

  borrowUpdate(borrow){
    const token = localStorage.getItem('token');
    axios.put('http://backng.nilow13.usermd.net/api/borrow/' + borrow.id + '?token=' + token, {end: borrow.end})
      .then(res => {
        const position = this.state.borrows.findIndex((element) => {
          return element.id == borrow.id;
        });
        this.state.borrows.splice(position, 1);
        const borrows= this.state.borrows;
        
        this.setState({borrows: borrows, showFormEdit: false, borrowToEdit: null}, ()=>{this.state.searchtext ==='' ? this.listPortion() : this.listSearch(); this.listAvailableSpecimens()});

      })
      .catch(e => {
        console.log(e)
      });
  }

  borrowDeleting(){
  	//alert(teamId);
    const borrowId = this.state.idToDelete;
    const token = localStorage.getItem('token');
    axios.delete('http://backng.nilow13.usermd.net/api/borrow/' + borrowId + '?token=' + token)
    .then(response => {
      console.log(response);
      this.setState({ showConfirm: false, idToDelete: 0 }, ()=>{this.state.searchtext ==='' ? this.listPortion() : this.listSearch(); this.listAvailableSpecimens()});
    })
    .catch(e => {
      console.log(e)
    });
    ;
  }

  borrowConfirmDeleting(borrowId){
    //alert(newsId + "55555");
    this.setState({showConfirm: true, idToDelete: borrowId});
  }

  borrowCancelDeleting(){
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
          <div><a className="btn-link" onClick={this.borrowAdd}><PlusSvg/></a><h3 className="top__title">Wypożyczenia</h3></div>
          <div><input type="text" className="form-control" value={this.state.searchtext} onChange={this.handleChangeSearch}/><button disabled={this.state.searchtext === '' ? true : false} type="button" className="btn btn-primary" onClick={this.borrowSearch} >Szukaj</button><button type="button" disabled={this.state.searchtext === '' ? true : false} className="btn btn-primary" onClick={this.borrowSearchClear}>X</button></div>
                  
        </div> 

        <div className="flex-grid first">
          <div className="col"><strong>Kod egzemplarza</strong></div>
          <div className="col"><strong>Tytuł</strong></div>
          <div className="col"><strong>Użytkownik</strong></div>
          <div className="col"><strong>Data wypożyczenia</strong></div>
          <div className="col"><strong>Data zwrotu</strong></div>
          <div className="col">&nbsp;</div>
        </div>

        {this.state.borrows.map((borrow)=><Borrow key={borrow.id} borrow={borrow}  onConfirm={this.borrowConfirmDeleting} onEdit={this.borrowEdit}/>)}
                  
        <div className="pagination__wrapper">
          {this.renderPagination()}
        </div>

        {this.state.showFormEdit && <Editborrow borrow={this.state.borrowToEdit} onUpdate={this.borrowUpdate} onCancel={this.borrowCancelEdit}/>}
        {this.state.showFormAdd && <Addborrow userslist={this.state.userslist} specimenslist={this.state.specimenslist} onAdd={this.borrowAdding} onCancel={this.borrowCancelAdd}/>}
        {this.state.showConfirm && <Confirm onCancel={this.borrowCancelDeleting} onConfirm={this.borrowDeleting}/>}

      </div> 
    );
  }
}
export default UserBorrows
