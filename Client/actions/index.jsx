import request from 'superagent';
import _ from 'lodash';
import $ from 'jquery';
import Promise from 'bluebird';

const endpoints = {
  logout: '/logout',
  spots: '/api/spots',
};

export const NAV_CLICK_COLLECTION = 'NAV_CLICK_COLLECTION';
export const NAV_CLICK_FILTER = 'NAV_CLICK_FILTER';
export const PANEL_CLICK_FILTER_ITEM = 'PANEL_CLICK_FILTER_ITEM';
export const MAP_CONFIRM_POINT = 'MAP_CONFIRM_POINT';
export const FETCH_COLLECTION = 'FETCH_COLLECTION';
export const CREATE_FILTERS = 'CREATE_FILTERS';

export const NAV_SEARCH = 'NAV_SEARCH';
export const NAV_SEARCH_RESULTS = 'NAV_SEARCH_RESULTS';

export const MAP_SEARCH_COORD = 'MAP_SEARCH_COORD';
export const MAP_SEARCH_ZOOM = 'MAP_SEARCH_ZOOM';

export function mapSearchZoom(zoomLevel) {
  let meters;
  let zoomstore = {
    20 : 100,
    19 : 200,
    18 : 400,
    17 : 800,
    16 : 1600,
    15 : 3200,
    14 : 6400,
    13 : 12800,
    12 : 25600
  }
  if (zoomLevel < 12) {
    meters = 40000;
  } else {
    meters = zoomstore[zoomLevel];
  }

  return {
    type: MAP_SEARCH_ZOOM,
    payload: meters
  }
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

  const data = new Promise((resolve, reject) => {
    request.post('/api/yelp')
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


export function toggleResultsList(panelMode, isOpen){
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

  return {
    type: FETCH_COLLECTION,
    payload: collection
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
