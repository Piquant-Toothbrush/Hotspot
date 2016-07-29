import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleCollectionList, toggleFilterList, logout, submitSearch, handleChange, /*toggleResultsList*/ } from '../actions/index';

console.log('handleChange', handleChange);

class Nav extends React.Component {

  collectionClick(e) {
    e.preventDefault();
    this.props.actions.toggleCollectionList(this.props.PanelMode, this.props.isOpen);
  }

  filterClick(e) {
    e.preventDefault();
    this.props.actions.toggleFilterList(this.props.PanelMode, this.props.isOpen);
  }

  handleChange(e) {
    e.preventDefault();
    this.props.actions.handleChange(e.target.value);
  }

// showResultsClick(e){
// e.preventDefault();
// this.props.actions.toggleCollectionList(this.props.PanelMode, this.props.isOpen);

// }

  submitSearch(e) {
    e.preventDefault();
    let lat = this.props.coord.lat;
    let lng = this.props.coord.lng;
    let searchQuery = {
      term: this.props.searchInput,
      limit: 10,
      radius: this.props.meter,
      ll: `${lat},${lng}` 
    }
    console.log(searchQuery);
    this.props.actions.submitSearch(searchQuery);
  }

  render() {
    return (
      <nav className="navbar navbar-dark bg-inverse">
          <input onChange={this.handleChange.bind(this)}type="text" placeholder="search here"/>
          <button onClick={this.submitSearch.bind(this)}>search</button>
          <div onClick={this.collectionClick.bind(this)} className='btn btn-default btn-lg' >Collection</div>
          <div onClick={this.filterClick.bind(this)} className='btn btn-default btn-lg'>Filter</div>
            <div *onClick={/*this.showResultsClick.bind(this)*/} className='btn btn-default btn-lg'> Show Search Results</div>
          <a className='btn btn-default btn-lg' href="/logout">Sign Out</a>
      </nav>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({toggleCollectionList, toggleFilterList, logout, submitSearch, handleChange}, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    PanelMode: state.PanelMode.panelMode,
    isOpen: state.PanelMode.isOpen,
    searchInput: state.SearchBar.searchInput,
    coord: state.SearchBar.coord,
    meter: state.SearchBar.meter
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
