import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CollectionModel from '../components/CollectionModel';
import ResultModel from '../components/ResultModel';
import FilterItem from '../components/FilterItem';
import FriendModel from '../components/FriendModel';
import * as Actions from '../actions';
import CollectionDetailModel from '../components/CollectionDetailModel';
import request from 'superagent';

const Menu = require('react-burger-menu').slide;

class Panel extends React.Component {

  componentDidMount() {
    this.props.actions.fetchCollection();
    this.props.actions.fetchFriendRequests();
    this.props.actions.fetchCurrentFriends();
console.log('panel has mounted!!!');
  }

 submitFriendReq(e) {
    e.preventDefault();

    let friendRequest = {
      requestee: document.getElementsByClassName('friendToAdd')[0].value
    }
console.log(friendRequest);
    const data = new Promise((resolve, reject) => {
        request.post('/api/friendRequest')
        .send(friendRequest)
        .end((err, res) => {
          if (err) {
            console.log(err)
            return reject(err);
          }
          //;
          console.log('response test',res.text);
          if (res.text.indexOf('exist')!==-1){
            $(".doesntExist").fadeIn(1000);
            $(".doesntExist").fadeOut(1000);
            //document.getElementsByClassName("doesntExist")[0].style.display='inline';
            console.log('doesnt exist')
          } else if (res.text.indexOf('request sent')!==-1 ){
            $(".requestSent").fadeIn(1000);
            $(".requestSent").fadeOut(1000);
            //document.getElementsByClassName("requestSent")[0].style.display='inline';

            console.log('request  sent!!')
          } else if (res.text.indexOf('already send')!==-1 ){

             $(".alreadySent").fadeIn(1000);
            $(".alreadySent").fadeOut(1000);
            //document.getElementsByClassName("alreadySent")[0].style.display='inline';

            console.log('request already sent')
          } else {
            $(".alreadyAFriend").fadeIn(1000);
            $(".alreadyAFriend").fadeOut(1000);
            document.getElementsByClassName("alreadyAFriend")[0].style.display='inline';
          }
          return resolve(res);
        });
      });


  }



  render() {
    let panelItems;

    this.props.actions.createFilters(this.props.totalCollection, this.props.filters);
console.log(this.props.panelMode)
if (this.props.panelMode === 'friendRequests'){
   
   if (this.props.friendRequests.length===0){

    panelItems=<div>
  <div ><input className = 'friendToAdd 'type='text' placeholder='Add a Friend'/>
  <button className='button' onClick={this.submitFriendReq.bind(this)}>Send Request</button></div>
<div style= {{display:"none",color:"white"}} className='alreadyAFriend'>   Already a friend </div>
<div style= {{display:"none",color:"white"}} className='doesntExist'>   This Person hasn't signed up   </div><br/>
<div style= {{display:"none",color:"white"}} className='requestSent'>   Request Sent!   </div>
<div style= {{display:"none",color:"white"}} className='alreadySent'>   Already sent a friend request  </div>

<p style={{color:"white"}}>No pending friend requests</p>

    </div>
} else {//
      panelItems = <div>  
   <div >
   <input className = 'friendToAdd 'type='text' placeholder='Add a Friend'/>
   <button className='button' onClick={this.submitFriendReq.bind(this)}>Send Request</button>
<div style= {{display:"none",color:"white"}} className='alreadyAFriend'>   Already a friend </div>
<div style= {{display:"none",color:"white"}} className='doesntExist'>   This Person hasn't signed up   </div>
<div style= {{display:"none",color:"white"}} className='requestSent'>   Request Sent!   </div>
<div style= {{display:"none",color:"white"}} className='alreadySent'>   Already sent a friend request  </div>
   </div>
<div>
      {this.props.friendRequests.map((person) => {
        return (<FriendModel item={person} />);
      })}
      </div>

      </div>

}
    }

else if (this.props.panelMode === 'results'){
if (this.props.searchResults.length===0){
  
    panelItems=<div><p style={{color:"white"}}>SEARCH SOMETHING!!!</p></div>
} else {
      panelItems = this.props.searchResults.map((restaurant) => {
        return (<ResultModel item={restaurant}
          viewCollectionItem={this.props.actions.viewCollectionItem}
          key={restaurant.name}/>);
      });
    }
    } else if (this.props.panelMode === 'filter') {

      panelItems = this.props.filters.map((filter) => {
        return (<FilterItem filter={filter}
                            appliedFilters={this.props.filterSelected}
                            toggleFilter={this.props.actions.toggleFilter}
                            collection={this.props.totalCollection}
                            key={filter}/>);
      });
    } else if (this.props.filteredCollection.length !== 0) {

      panelItems = this.props.filteredCollection.map((restaurant) => {
        return (<CollectionModel item={restaurant} key={restaurant.name}/>);
      });
    } else if (this.props.panelMode==='collection') {
if (this.props.totalCollection.length===0){
  
    panelItems=<div ><p style={{color:"white"}}>Add some places to your collection!!!</p></div>
} else {
      panelItems = this.props.totalCollection.map((restaurant) => {
        return (<CollectionModel item={restaurant}
          viewCollectionItem={this.props.actions.viewCollectionItem}
          key={restaurant.name}/>);
      });
     }
    }
    return (
    
      <Menu style={{color:'blue'}}
      id={ 'panel' }
            right
            noOverlay
            customBurgerIcon={ false }
            customCrossIcon={ false }
            isOpen={ this.props.isOpen }>
        {panelItems}

      </Menu>

    );
  }
}

function mapStateToProps(state) {
  return {
    totalCollection: state.CollectionRestaurantsFilters.collection,
    filters: state.FilterSelectedRestaurants.filters,
    filterSelected: state.FilterSelectedRestaurants.filterSelected,
    filteredCollection: state.FilterSelectedRestaurants.filteredRestaurants,
    panelMode: state.PanelMode.panelMode,
    isOpen: state.PanelMode.isOpen,
    searchResults:state.SearchBar.searchResults,
    friendRequests:state.FriendReqs.friendReqs

  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Panel);
