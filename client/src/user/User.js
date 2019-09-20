import React, { Component } from "react"; 
import {list} from './apiUser';
import Default from './Default.png';
import {Link} from 'react-router-dom';
class User extends Component {
    constructor(){
        super();
        this.state={
            users:[]
        }
    }
    componentDidMount(){
        list().then(data =>{
            this.setState({users:data})
        }).catch(err => console.log(err.response.data.error))
    }
  render() {
      const {users}=this.state;
    return (
     <div className='container'>
       <h2 className='mt-5 mb-5'>Users</h2>
       <div className='card-deck'>
            {users.map((user,i) =>(
                <div key={i} className='card testimonial-card'>
                    <div className="card-up indigo lighten-1"></div>
                    <div className="avatar mx-auto white">
                        <img alt='avatar' src={user._id ? `/api/user/photo/${user._id}`:Default} className="rounded-circle"/>
                    </div>
                    <div className="card-body">
                        <h4 className="card-title">{user.name}</h4>
                        <hr/>
                        <p><i className="fas fa-quote-left"></i> Email: {user.email}</p>
                        <Link to={`/user/${user._id}`}>View Profile</Link>
                    </div>
                </div>
            ))}
       </div>
     </div>
    );
  }
}

export default User;