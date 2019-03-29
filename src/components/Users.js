import React, { Component } from 'react';
import User from './User';
import Adduser from './Add/Adduser';
import Edituser from './Edit/Edituser';
import axios from 'axios';
import Confirm from './Confirm';
import ReactPaginate from 'react-paginate';
import PlusSvg from './Svg/PlusSvg';

class Users extends Component{

  constructor(props) {
    super(props);
    this.state ={
      users: [],
      offset: 0,
      selectedpage: 0,
      perPage: 10,
      pageCount: 1,
      searchtext:'',
      showConfirm: false,
      idToDelete:0,
      userToEdit: null,
      showFormAdd: false,
      showFormEdit: false,
    }

    this.userDeleting = this.userDeleting.bind(this);
    this.userAdd= this.userAdd.bind(this);
    this.userEdit= this.userEdit.bind(this);
    this.userCancelAdd= this.userCancelAdd.bind(this);
    this.userCancelEdit= this.userCancelEdit.bind(this);
    this.userConfirmDeleting = this.userConfirmDeleting.bind(this);
    this.userCancelDeleting = this.userCancelDeleting.bind(this);
    this.userSearch = this.userSearch.bind(this);
    this.userSearchClear = this.userSearchClear.bind(this);
    this.userAdding = this.userAdding.bind(this);
    this.userUpdate = this.userUpdate.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentDidMount() {
    this.listPortion();
  }


  listPortion(){
    const token = localStorage.getItem('token');
    axios.get('http://backng.nilow13.usermd.net/api/users/'+ this.state.offset +'?token=' + token)
    .then(res => {
      console.log(res.data);
      const users= res.data.users;
      const total = res.data.total;
      this.setState({ users: users, pageCount:Math.ceil(total / this.state.perPage)  });
    })
    .catch(e => {
      console.log(e)
    });
  }

  listSearch(){
    const token = localStorage.getItem('token');
    axios.get('http://backng.nilow13.usermd.net/api/searchusers/'+ this.state.searchtext + '/' + this.state.offset + '?token=' + token)
    .then(res => {
      const users= res.data.users;
      const total = res.data.total;
      this.setState({ users: users, offset:0, pageCount:Math.ceil(total / this.state.perPage)  });
        //console.log(this.state);
    })
  }

  userSearch(){
    this.setState({offset: 0, selectedpage: 0},()=>{this.listSearch()});
  }

  userAdd(){
    this.setState({showFormAdd: true})
  }

  userCancelAdd(){
    this.setState({showFormAdd: false})
  }

  userEdit(user){
    console.log(user);
    this.setState({showFormEdit: true, userToEdit: user})
  }

  userCancelEdit(){
    this.setState({showFormEdit: false, userToEdit: null})
  }

  handleChangeSearch(e) {
    this.setState({searchtext: e.target.value});
  }

  userSearchClear(e) {
    this.setState({searchtext: '', offset: 0, selectedpage: 0},()=>{this.listPortion()});
  }

  userAdding(newName, newSurname, newEmail, newPhone){
    //alert(newTeamId);
    const token = localStorage.getItem('token');
    axios.post('http://backng.nilow13.usermd.net/api/user'+ '?token=' + token,{name: newName, surname: newSurname, email: newEmail, address: '', phone: newPhone}) 
    .then(res => {
      this.listPortion();
        
    })
    .catch(e => {
      console.log(e)
    });
  }

  userUpdate(user){
    const token = localStorage.getItem('token');
    axios.put('http://backng.nilow13.usermd.net/api/user/' + user.id + '?token=' + token, {name: user.name, surname: user.surname, email: user.email, phone: user.phone })
    .then(res => {
      const position = this.state.users.findIndex((element) => {
        return element.id == user.id;
      });
      this.state.users.splice(position, 1);
      const users= this.state.users;
      this.setState({users: users, showFormEdit: false, userToEdit: null}, ()=>{this.state.searchtext ==='' ? this.listPortion() : this.listSearch()});
    })
    .catch(e => {
      console.log(e)
    });
  }

  userDeleting(){
    const userId = this.state.idToDelete;
    const token = localStorage.getItem('token');
    axios.delete('http://backng.nilow13.usermd.net/api/user/' + userId + '?token=' + token)
    .then(response => {
      this.setState({ showConfirm: false, idToDelete: 0 }, ()=>{this.state.searchtext ==='' ? this.listPortion() : this.listSearch()});
    })
    .catch(e => {
       console.log(e)
    });  
  }

  userConfirmDeleting(userId){
    this.setState({showConfirm: true, idToDelete: userId});
  }

  userCancelDeleting(){
    this.setState({showConfirm: false, idToDelete: 0});
  }

  handlePageClick(data){
    console.log('klik');
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
          <div><a className="btn-link" onClick={this.userAdd}><PlusSvg/></a><h3 className="top__title">Użytkownicy</h3></div>
          <div><input type="text" className="form-control" value={this.state.searchtext} onChange={this.handleChangeSearch}/><button disabled={this.state.searchtext === '' ? true : false} type="button" className="btn btn-primary" onClick={this.userSearch} >Szukaj</button><button type="button" disabled={this.state.searchtext === '' ? true : false} className="btn btn-primary" onClick={this.userSearchClear}>X</button></div>   
        </div> 

        <div className="flex-grid">
          <div className="col"><strong>Imię</strong></div>
          <div className="col"><strong>Nazwisko</strong></div>
          <div className="col"><strong>Email</strong></div>
          <div className="col">&nbsp;</div>
        </div>
            
        {this.state.users.map((user)=><User key={user.id} user={user}  onConfirm={this.userConfirmDeleting} onEdit={this.userEdit}/>)}
                
        <div className="pagination__wrapper">
          {this.renderPagination()}
        </div>
        {this.state.showFormEdit && <Edituser user={this.state.userToEdit} onUpdate={this.userUpdate} onCancel={this.userCancelEdit}/>}
        {this.state.showFormAdd && <Adduser onAdd={this.userAdding} onCancel={this.userCancelAdd}/>}
        {this.state.showConfirm && <Confirm onCancel={this.userCancelDeleting} onConfirm={this.userDeleting}/>}
      </div>
      
    );
  }
}

export default Users
