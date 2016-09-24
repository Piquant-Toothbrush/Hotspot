import request from 'superagent';
import _ from 'lodash';
import $ from 'jquery';
import Promise from 'bluebird';

const endpoints = {
  logout: '/logout',
  spots: '/api/spots',
  friendReqs:'/api/pendingFriendRequest',
  getFriends:'/api/friends',
  wishes:'/api/wishes'
};

export const NAV_CLICK_COLLECTION = 'NAV_CLICK_COLLECTION';
export const NAV_CLICK_FRIENDREQS = 'NAV_CLICK_FRIENDREQS';
export const NAV_CLICK_FILTER = 'NAV_CLICK_FILTER';
export const PANEL_CLICK_FILTER_ITEM = 'PANEL_CLICK_FILTER_ITEM';
export const MAP_CONFIRM_POINT = 'MAP_CONFIRM_POINT';
export const FETCH_COLLECTION = 'FETCH_COLLECTION';
export const CREATE_FILTERS = 'CREATE_FILTERS';
export const SHOW_RESULTS = 'SHOW_RESULTS';
export const NAV_SEARCH = 'NAV_SEARCH';
export const FETCH_FRIENDREQS = 'FETCH_FRIENDREQS';
export const NAV_FRIEND_NAME = 'NAV_FRIEND_NAME';
export const NAV_SEARCH_RESULTS = 'NAV_SEARCH_RESULTS';
export const MAP_SEARCH_COORD = 'MAP_SEARCH_COORD';
export const MAP_SEARCH_ZOOM = 'MAP_SEARCH_ZOOM';
export const FETCH_FRIENDS ='FETCH_FRIENDS'

export function mapSearchZoom(zoomLevel) {
  let meters;
  let zoomstore = {
    20 : 12,
    19 : 25,
    18 : 50,
    17 : 100,
    16 : 200,
    15 : 400,
    14 : 800,
    13 : 1600,
    12 : 3200,
    11 : 6400,
    10 : 12800,
    9  : 25600
  }
  if (zoomLevel < 9) {
    meters = 40000;
  } else {
    meters = zoomstore[zoomLevel];
  }

  return {
    type: MAP_SEARCH_ZOOM,
    payload: meters
  }
}

export function getUpdate() {
  console.log('calling getUpdate');
  let that = this;
  $.get('/api/wishes', function(req, res) {
    console.log('getting update wishes');
    that.props.actions.fetchCollection();
  })
}

export function mapSearchCoord(coord) {
  return {
    type: MAP_SEARCH_COORD,
    payload: coord
  }
}

export function handleChange(input) {
  return {
    type: NAV_SEARCH,
    payload: {
      searchInput: input
    }
  }
}

export function submitSearch(inputObj) {
console.log('search called', inputObj);
  const data = new Promise((resolve, reject) => {

    request.post('/api/yelpss')
    .send(inputObj)
    .end((err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    });
  });

  console.log('yelp data', data);
  return {
    type: NAV_SEARCH_RESULTS,
    payload: data
  }
}



//click handler for search results panel
export function showSearchResults(panelMode, isOpen) {
  // If panelMode is collection, set it to null.
  if (panelMode === 'results' && isOpen === true) {
    isOpen = false;
  } else {
    // Else set panelMode to collection
    panelMode = 'results';
    isOpen = true;
  }


  return {
    type: SHOW_RESULTS,
    payload: {
      panelMode: panelMode,
      isOpen: isOpen
    }
  };
}



 export function toggleFriendReqList (panelMode, isOpen) {
  // If panelMode is collection, set it to null.
  if (panelMode === 'friendRequests' && isOpen === true) {
    isOpen = false;
  } else {
    // Else set panelMode to collection
    panelMode = 'friendRequests';
    isOpen = true;
  }


  return {
    type: NAV_CLICK_FRIENDREQS,
    payload: {
      panelMode: panelMode,
      isOpen: isOpen
    }
  };
}




// Click Handler for Nav Collection button
export function toggleCollectionList(panelMode, isOpen) {
  // If panelMode is collection, set it to null.
  if (panelMode === 'collection' && isOpen === true) {
    isOpen = false;
  } else {
    // Else set panelMode to collection
    panelMode = 'collection';
    isOpen = true;
  }


  return {
    type: NAV_CLICK_COLLECTION,
    payload: {
      panelMode: panelMode,
      isOpen: isOpen
    }
  };
}

// Click Handler for Nav Filter button
export function toggleFilterList(panelMode, isOpen) {
  // If panelMode is filter, set it to null.
  if (panelMode === 'filter' && isOpen === true) {
    isOpen = false;
  } else {
    // Else set panelMode to filter
    panelMode = 'filter';
    isOpen = true;
  }


  return {
    type: NAV_CLICK_FILTER,
    payload: {
      panelMode: panelMode,
      isOpen: isOpen
    }
  };
}

// Click Handler for Panel Filter item
export function toggleFilter(filter, selectedFilters, collection) {
  // Check if given filter is in filter list
  const index = _.findIndex(selectedFilters, (o) => { return o === filter; });
  if (index === -1) {
    // Add it to the list if not found
    selectedFilters.push(filter);
  } else {
    // remove it if it is not
    selectedFilters.splice(index, index + 1);
  }

  // make a list of the restaurants that match the filter
  let filteredRestaurants = [];
  _.map(collection, (spot) => {
    if (_.findIndex(selectedFilters, (o) => { return o === spot.yelpData.cuisine}) > -1) {
      filteredRestaurants.push(spot);
    }
  });
  return {
    type: PANEL_CLICK_FILTER_ITEM,
    payload: {
      selectedFilters: selectedFilters.slice(),
      filteredRestaurants: filteredRestaurants.slice()
    }
  };
}

// Click Handler for Panel Collection item
export function viewCollectionItem(item) {
  // change current panel view to the collection item
  return {
    type: PANEL_OPEN_COLLECTION_ITEM,
    payload: item
  };
}

// Click Handler for Panel Collection closeup
export function closeCollectionItem(item) {
  // close the current panel view back to the collection
  return {
    type: PANEL_CLOSE_COLLECTION_ITEM
  };
}

export function deleteCollectionItem(item) {
  // delete the collection item from the db
  const collection = request.del(endpoints.spots + '/' + item.id);
  // update the collection and filters
  const filters = filterOrganizer(collection);

  return {
    type: PANEL_DELETE_COLLECTION_ITEM,
    payload: {
      collection: collection.slice(),
      filters: filters.slice()
    }
  };
}

//send a wish submit
export function clickWishListSubmit(name, latitude, longitude, rating) {
  const spotToWish = {
    name: name,
    latitude: latitude,
    longitude: longitude,
    rating: rating
  }
  console.log('new wish, ', spotToWish);

  const data = new Promise((resolve, reject) => {
    request.post(endpoints.wishes)
      .send(spotToWish)
      .end((err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
  });

  console.log('sending wish data', data);
  return {
    type: MAP_CONFIRM_POINT,
    payload: data
  }
}

export function clickLocationSubmit(name, latitude, longitude, rating) {
  // Create object to make DB query
  const spotToAdd = {
    name: name,
    latitude: latitude,
    longitude: longitude,
    rating: rating
  };

  // Add type and image from returned request
  console.log('new spot', spotToAdd);
  // const data = request.post(endpoints.spots).send(spotToAdd).end();
  // const data = request.post(endpoints.spots).send(spotToAdd);

  const data = new Promise((resolve, reject) => {
    request.post(endpoints.spots)
      .send(spotToAdd)
      .end((err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
  });

  console.log('sending data', data);
  return {
    type: MAP_CONFIRM_POINT,
    payload: data
  };
}

export function fetchCollection() {
  // This function should only be called once on startup
  // Query database for user's entire collection
  console.log('fetchCollection')
  const collection = request.get(endpoints.spots);
  // const wishCollection = request.get(endpoints.wishes);
  return {
    type: FETCH_COLLECTION,
    payload: collection
  }
}


export function fetchCurrentFriends() {
  // This function should only be called once on startup
  // Query database for user's friends
  console.log('fetchFriends')
  const currFriends = request.get(endpoints.getFriends);
$.get("/api/friends",function(a,b){
    console.log('these are all my friendsssssss!!!',a,b);
  })
  return {
    type: FETCH_FRIENDS,
    payload: currFriends
  };
}


export function fetchFriendRequests() {
  // This function should only be called once on startup
  // Query database for user's friendRequests;
  console.log('fetchFriendRequests')
  const friendRequests = request.get(endpoints.friendReqs);
  $.get("/api/pendingFriendRequest",function(a,b){
    console.log('these are all my friend requests',a,b);
  })
  return {
    type: FETCH_FRIENDREQS,
    payload: friendRequests
  };
}

export function createFilters(collection, filters) {

  _.map(collection, (spot) => {
    if (_.findIndex(filters, (o) => {
      return o === spot.yelpData.cuisine
    }) === -1) {
      filters.push(spot.yelpData.cuisine);
    }
  });

  return {
    type: CREATE_FILTERS,
    payload: filters
  }
}

function makePostRequest(endpoint, data) {
  console.log('making post request');
  return new Promise((resolve, reject) => {
    request.post(endpoint)
      .send(data)
      .end((err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
  });
}

function makeGetRequest(endpoint) {
  console.log('making get request');
  return new Promise((resolve, reject) => {
    request.get(endpoint)
      .end((err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
  });
}
