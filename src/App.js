import React, {Component} from 'react';
import {HashRouter, Route, Redirect} from 'react-router-dom';
import {firebaseApp, auth, provider} from './Firebase';
import Dashboard from './components/Dashboard'
import Login from './components/Login'

class App extends Component {

    constructor() {
        super();
        this.state = {
            authed: false,
            userid: null,
            email: null
        };
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    logout() {
      auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
    }

    login() {
      auth.signInWithPopup(provider) 
        .then((result) => {
          const user = result.user;
          this.setState({
            user
          });
        });
    }

    componentDidMount() {
        this.removeFirebaseEvent = firebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({authed: true, userid: user.uid, email: user.email})
            } else {
                this.setState({
                    authed: false,
                })
            }
        })
    }

    componentWillUnmount() {
        this.removeFirebaseEvent()
    }

    render() {
        return (
            <HashRouter>
                <div>
                    {!this.state.authed ?
                        <div className="login-screen">
                            <Login login={this.login}></Login>
                        </div>:
                        <div className="app">
                            <nav className="navbar navbar-default navbar-fixed-top">
                                <a className="navbar-brand">Priority Queue</a> 
                                <a>{this.state.authed ?
                                    <button className="login btn btn-primary" onClick={this.logout}>Log Out</button>                
                                    :
                                    <button className="login btn btn-primary" onClick={this.login}>Log In</button>              
                                }</a>
                            </nav>
                            {!this.state.authed ? <div className="container info-text"><h4>Please login for use this app.</h4>
                            </div> : ''}
                            <div>
                                <Route path='/' render={()=>this.state.authed ? <Redirect to='/dashboard'/> : <div></div>}/>
                                <Route path='/dashboard'
                                        render={()=>this.state.authed ?
                                            <Dashboard userid={this.state.userid} email={this.state.email}/> :
                                            <Redirect to='/'/>}/>
                            </div>
                        </div>
                    }
                </div>
            </HashRouter>
        );
    }
}

export default App;
