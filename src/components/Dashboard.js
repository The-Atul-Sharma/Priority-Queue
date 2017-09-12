import React, {Component} from 'react';
import {usersWishlist} from '../Firebase';

var placeholder = document.createElement("li");
placeholder.className = "placeholder";

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wishlist: '',
            completeWishlist: []
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleEnterClick = this.handleEnterClick.bind(this);  
        this.dragStart = this.dragStart.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
        this.dragOver = this.dragOver.bind(this); 
    }

    dragStart(e) {
        this.dragged = e.currentTarget;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.dragged);
    }
    
    dragEnd(e) {
        this.dragged.style.display = 'block';
        this.dragged.parentNode.removeChild(placeholder);
    
        // update state
        var data = this.state.completeWishlist;
        var from = Number(this.dragged.dataset.id);
        var to = Number(this.over.dataset.id);
        if(from < to) to--;
        data.splice(to, 0, data.splice(from, 1)[0]);
        this.setState({completeWishlist: data});
        const {userid} = this.props;
        const thisUser = usersWishlist.child(userid);
        thisUser.set({data});
    }

    dragOver(e) {
        e.preventDefault();
        this.dragged.style.display = "none";
        if(e.target.className === 'placeholder') return;
        this.over = e.target;
        e.target.parentNode.insertBefore(placeholder, e.target);
    }

    removeWishlist = (index) => {
        const {userid} = this.props;
        const thisUser = usersWishlist.child(userid);
        let completeWishlist = this.state.completeWishlist.slice();
        completeWishlist.splice(index,1)
        this.setState({completeWishlist: completeWishlist})
        thisUser.set({completeWishlist});
    }

    addWishlist = ()=> {
        const {userid} = this.props;
        const thisUser = usersWishlist.child(userid);
        const {wishlist} = this.state;
        const {completeWishlist} = this.state;
        if(wishlist !== '') {
            completeWishlist.push(wishlist);
            this.setState({completeWishlist: completeWishlist, wishlist: ''})
            thisUser.set({completeWishlist});
        }
    }

    handleUserInput(e){ 
        this.setState({
            wishlist: e.target.value, // the value of the text input
        })
    }

    handleEnterClick(e) {
        if (e.key === 'Enter') {
          this.addWishlist();
        }
    }

    componentDidMount() {
        const {userid} = this.props;
        const thisUser = usersWishlist.child(userid);
        thisUser.on('value', (snap, i)=> {
            snap.forEach((d, i)=> this.setState({completeWishlist: d.val()}))

      })
    }

    renderWishlist() {
        return this.state.completeWishlist.map((item, index)=> {
            return (
                <li className="list-group-item" key={index}
                    data-id={index}
                    draggable='true'
                    onDragEnd={this.dragEnd}
                    onDragStart={this.dragStart}>{item}
                    <button className="btn btn-danger del-wishlist"
                        onClick={this.removeWishlist.bind(this,index)}> Delete
                    </button>
                </li>
            )
        })
    }

    render() {
        return (
            <div className="dashboard" >
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <input className="form-control"
                                placeholder="Add your task"
                                maxLength="70"
                                value={this.state.wishlist} 
                                onChange={this.handleUserInput} 
                                onKeyUp={this.handleEnterClick} />
                            <button className="btn btn-primary"
                                style={{margin: '15px'}}
                                onClick={this.addWishlist}>
                                Add
                            </button>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <ul onDragOver={this.dragOver} className="list-group wishlist">
                            {this.renderWishlist()}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;