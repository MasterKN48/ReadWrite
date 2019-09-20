import React, { Component } from "react"; 
import {isAuthenticated} from '../auth';
import {Redirect} from 'react-router-dom';
import {remove} from './apiUser';
import {logout} from '../auth';
class DeleteUser extends Component {
  state={
    redirect:false
  }
  deleteAccount=()=>{
    const userId=this.props.userId;
    const token=isAuthenticated().token;
    remove(userId,token).then(data => {
      logout(() => console.log('signout'))
      this.setState({redirect:true});
    })
    .catch(err => console.log(err))
  }
  deleteConfirm=()=>{
    let ans=window.confirm("Are u sure to delete account?");
    if(ans){
      this.deleteAccount();
    }

  }
  render() {
    if(this.state.redirect){
      return <Redirect to='/'/>
    }
    return (
     <button onClick={this.deleteConfirm} className='btn btn-raised btn-danger'>Delete</button>
    );
  }
}

export default DeleteUser;