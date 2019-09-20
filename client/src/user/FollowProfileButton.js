import React, { Component } from "react"; 
import {follow,unfollow} from './apiUser';
class FollowProfileButton extends Component {
    followClick=()=>{
        console.log('i m follow');
        this.props.onButtonClick(follow);
    }
    unfollowClick=()=>{
        console.log('i m unfollow');
        this.props.onButtonClick(unfollow);
    }
  render() {
    return (
     <div className='d-inline-block mt-2'>
         { !this.props.following ? <button onClick={this.followClick} className='btn btn-success btn-raised mt-5'>Follow</button>: <button onClick={this.unfollowClick} className='btn btn-success btn-raised mt-5'>UnFollow</button>
         }
     </div>
    );
  }
}

export default FollowProfileButton;