webpackHotUpdate(0,{

/***/ 184:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.FETCH_FRIENDS = exports.MAP_SEARCH_ZOOM = exports.MAP_SEARCH_COORD = exports.NAV_SEARCH_RESULTS = exports.NAV_FRIEND_NAME = exports.FETCH_FRIENDREQS = exports.NAV_SEARCH = exports.SHOW_RESULTS = exports.CREATE_FILTERS = exports.FETCH_COLLECTION = exports.MAP_CONFIRM_POINT = exports.PANEL_CLICK_FILTER_ITEM = exports.NAV_CLICK_FILTER = exports.NAV_CLICK_FRIENDREQS = exports.NAV_CLICK_COLLECTION = undefined;
	exports.mapSearchZoom = mapSearchZoom;
	exports.getUpdate = getUpdate;
	exports.mapSearchCoord = mapSearchCoord;
	exports.handleChange = handleChange;
	exports.submitSearch = submitSearch;
	exports.showSearchResults = showSearchResults;
	exports.toggleFriendReqList = toggleFriendReqList;
	exports.toggleCollectionList = toggleCollectionList;
	exports.toggleFilterList = toggleFilterList;
	exports.toggleFilter = toggleFilter;
	exports.viewCollectionItem = viewCollectionItem;
	exports.closeCollectionItem = closeCollectionItem;
	exports.deleteCollectionItem = deleteCollectionItem;
	exports.clickWishListSubmit = clickWishListSubmit;
	exports.clickLocationSubmit = clickLocationSubmit;
	exports.fetchCollection = fetchCollection;
	exports.fetchCurrentFriends = fetchCurrentFriends;
	exports.fetchFriendRequests = fetchFriendRequests;
	exports.createFilters = createFilters;

	var _superagent = __webpack_require__(185);

	var _superagent2 = _interopRequireDefault(_superagent);

	var _lodash = __webpack_require__(190);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _jquery = __webpack_require__(192);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _bluebird = __webpack_require__(193);

	var _bluebird2 = _interopRequireDefault(_bluebird);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var endpoints = {
	  logout: '/logout',
	  spots: '/api/spots',
	  friendReqs: '/api/pendingFriendRequest',
	  getFriends: '/api/friends',
	  wishes: '/api/wishes'
	};

	var NAV_CLICK_COLLECTION = exports.NAV_CLICK_COLLECTION = 'NAV_CLICK_COLLECTION';
	var NAV_CLICK_FRIENDREQS = exports.NAV_CLICK_FRIENDREQS = 'NAV_CLICK_FRIENDREQS';
	var NAV_CLICK_FILTER = exports.NAV_CLICK_FILTER = 'NAV_CLICK_FILTER';
	var PANEL_CLICK_FILTER_ITEM = exports.PANEL_CLICK_FILTER_ITEM = 'PANEL_CLICK_FILTER_ITEM';
	var MAP_CONFIRM_POINT = exports.MAP_CONFIRM_POINT = 'MAP_CONFIRM_POINT';
	var FETCH_COLLECTION = exports.FETCH_COLLECTION = 'FETCH_COLLECTION';
	var CREATE_FILTERS = exports.CREATE_FILTERS = 'CREATE_FILTERS';
	var SHOW_RESULTS = exports.SHOW_RESULTS = 'SHOW_RESULTS';
	var NAV_SEARCH = exports.NAV_SEARCH = 'NAV_SEARCH';
	var FETCH_FRIENDREQS = exports.FETCH_FRIENDREQS = 'FETCH_FRIENDREQS';
	var NAV_FRIEND_NAME = exports.NAV_FRIEND_NAME = 'NAV_FRIEND_NAME';
	var NAV_SEARCH_RESULTS = exports.NAV_SEARCH_RESULTS = 'NAV_SEARCH_RESULTS';
	var MAP_SEARCH_COORD = exports.MAP_SEARCH_COORD = 'MAP_SEARCH_COORD';
	var MAP_SEARCH_ZOOM = exports.MAP_SEARCH_ZOOM = 'MAP_SEARCH_ZOOM';
	var FETCH_FRIENDS = exports.FETCH_FRIENDS = 'FETCH_FRIENDS';

	function mapSearchZoom(zoomLevel) {
	  var meters = void 0;
	  var zoomstore = {
	    20: 12,
	    19: 25,
	    18: 50,
	    17: 100,
	    16: 200,
	    15: 400,
	    14: 800,
	    13: 1600,
	    12: 3200,
	    11: 6400,
	    10: 12800,
	    9: 25600
	  };
	  if (zoomLevel < 9) {
	    meters = 40000;
	  } else {
	    meters = zoomstore[zoomLevel];
	  }

	  return {
	    type: MAP_SEARCH_ZOOM,
	    payload: meters
	  };
	}

	function getUpdate() {
	  console.log('calling getUpdate');
	  var that = this;
	  _jquery2.default.get('/api/wishes', function (req, res) {
	    console.log('getting update wishes');
	    that.props.actions.fetchCollection();
	  });
	}

	function mapSearchCoord(coord) {
	  return {
	    type: MAP_SEARCH_COORD,
	    payload: coord
	  };
	}

	function handleChange(input) {
	  return {
	    type: NAV_SEARCH,
	    payload: {
	      searchInput: input
	    }
	  };
	}

	function submitSearch(inputObj) {

	  var data = new _bluebird2.default(function (resolve, reject) {
	    _superagent2.default.post('/api/yelp').send(inputObj).end(function (err, res) {
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
	  };
	}

	//click handler for search results panel
	function showSearchResults(panelMode, isOpen) {
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

	function toggleFriendReqList(panelMode, isOpen) {
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
	function toggleCollectionList(panelMode, isOpen) {
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
	function toggleFilterList(panelMode, isOpen) {
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
	function toggleFilter(filter, selectedFilters, collection) {
	  // Check if given filter is in filter list
	  var index = _lodash2.default.findIndex(selectedFilters, function (o) {
	    return o === filter;
	  });
	  if (index === -1) {
	    // Add it to the list if not found
	    selectedFilters.push(filter);
	  } else {
	    // remove it if it is not
	    selectedFilters.splice(index, index + 1);
	  }

	  // make a list of the restaurants that match the filter
	  var filteredRestaurants = [];
	  _lodash2.default.map(collection, function (spot) {
	    if (_lodash2.default.findIndex(selectedFilters, function (o) {
	      return o === spot.yelpData.cuisine;
	    }) > -1) {
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
	function viewCollectionItem(item) {
	  // change current panel view to the collection item
	  return {
	    type: PANEL_OPEN_COLLECTION_ITEM,
	    payload: item
	  };
	}

	// Click Handler for Panel Collection closeup
	function closeCollectionItem(item) {
	  // close the current panel view back to the collection
	  return {
	    type: PANEL_CLOSE_COLLECTION_ITEM
	  };
	}

	function deleteCollectionItem(item) {
	  // delete the collection item from the db
	  var collection = _superagent2.default.del(endpoints.spots + '/' + item.id);
	  // update the collection and filters
	  var filters = filterOrganizer(collection);

	  return {
	    type: PANEL_DELETE_COLLECTION_ITEM,
	    payload: {
	      collection: collection.slice(),
	      filters: filters.slice()
	    }
	  };
	}

	//send a wish submit
	function clickWishListSubmit(name, latitude, longitude, rating) {
	  var spotToWish = {
	    name: name,
	    latitude: latitude,
	    longitude: longitude,
	    rating: rating
	  };
	  console.log('new wish, ', spotToWish);

	  var data = new _bluebird2.default(function (resolve, reject) {
	    _superagent2.default.post(endpoints.wishes).send(spotToWish).end(function (err, res) {
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
	  };
	}

	function clickLocationSubmit(name, latitude, longitude, rating) {
	  // Create object to make DB query
	  var spotToAdd = {
	    name: name,
	    latitude: latitude,
	    longitude: longitude,
	    rating: rating
	  };

	  // Add type and image from returned request
	  console.log('new spot', spotToAdd);
	  // const data = request.post(endpoints.spots).send(spotToAdd).end();
	  // const data = request.post(endpoints.spots).send(spotToAdd);

	  var data = new _bluebird2.default(function (resolve, reject) {
	    _superagent2.default.post(endpoints.spots).send(spotToAdd).end(function (err, res) {
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

	function fetchCollection() {
	  // This function should only be called once on startup
	  // Query database for user's entire collection
	  console.log('fetchCollection');
	  var collection = _superagent2.default.get(endpoints.spots);
	  // const wishCollection = request.get(endpoints.wishes);
	  return {
	    type: FETCH_COLLECTION,
	    payload: collection
	  };
	}

	function fetchCurrentFriends() {
	  // This function should only be called once on startup
	  // Query database for user's friends
	  console.log('fetchFriends');
	  var currFriends = _superagent2.default.get(endpoints.getFriends);
	  _jquery2.default.get("/api/friends", function (a, b) {
	    console.log('these are all my friendsssssss!!!', a, b);
	  });
	  return {
	    type: FETCH_FRIENDS,
	    payload: currFriends
	  };
	}

	function fetchFriendRequests() {
	  // This function should only be called once on startup
	  // Query database for user's friendRequests;
	  console.log('fetchFriendRequests');
	  var friendRequests = _superagent2.default.get(endpoints.friendReqs);
	  _jquery2.default.get("https://boiling-ridge-66714.herokuapp.com/api/pendingFriendRequest", function (a, b) {
	    console.log('these are all my friend requests', a, b);
	  });
	  return {
	    type: FETCH_FRIENDREQS,
	    payload: friendRequests
	  };
	}

	function createFilters(collection, filters) {

	  _lodash2.default.map(collection, function (spot) {
	    if (_lodash2.default.findIndex(filters, function (o) {
	      return o === spot.yelpData.cuisine;
	    }) === -1) {
	      filters.push(spot.yelpData.cuisine);
	    }
	  });

	  return {
	    type: CREATE_FILTERS,
	    payload: filters
	  };
	}

	function makePostRequest(endpoint, data) {
	  console.log('making post request');
	  return new _bluebird2.default(function (resolve, reject) {
	    _superagent2.default.post(endpoint).send(data).end(function (err, res) {
	      if (err) {
	        return reject(err);
	      }
	      return resolve(res);
	    });
	  });
	}

	function makeGetRequest(endpoint) {
	  console.log('making get request');
	  return new _bluebird2.default(function (resolve, reject) {
	    _superagent2.default.get(endpoint).end(function (err, res) {
	      if (err) {
	        return reject(err);
	      }
	      return resolve(res);
	    });
	  });
	}

/***/ }

})