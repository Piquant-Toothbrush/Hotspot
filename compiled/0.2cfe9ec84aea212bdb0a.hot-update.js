webpackHotUpdate(0,{

/***/ 196:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(159);

	var _redux = __webpack_require__(166);

	var _CollectionModel = __webpack_require__(197);

	var _CollectionModel2 = _interopRequireDefault(_CollectionModel);

	var _ResultModel = __webpack_require__(198);

	var _ResultModel2 = _interopRequireDefault(_ResultModel);

	var _FilterItem = __webpack_require__(199);

	var _FilterItem2 = _interopRequireDefault(_FilterItem);

	var _FriendModel = __webpack_require__(200);

	var _FriendModel2 = _interopRequireDefault(_FriendModel);

	var _actions = __webpack_require__(184);

	var Actions = _interopRequireWildcard(_actions);

	var _CollectionDetailModel = __webpack_require__(201);

	var _CollectionDetailModel2 = _interopRequireDefault(_CollectionDetailModel);

	var _superagent = __webpack_require__(185);

	var _superagent2 = _interopRequireDefault(_superagent);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Menu = __webpack_require__(202).slide;

	var Panel = function (_React$Component) {
	  _inherits(Panel, _React$Component);

	  function Panel() {
	    _classCallCheck(this, Panel);

	    return _possibleConstructorReturn(this, (Panel.__proto__ || Object.getPrototypeOf(Panel)).apply(this, arguments));
	  }

	  _createClass(Panel, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.props.actions.fetchCollection();
	      this.props.actions.fetchFriendRequests();
	      this.props.actions.fetchCurrentFriends();
	      console.log('panel has mounted!!!');
	    }
	  }, {
	    key: 'submitFriendReq',
	    value: function submitFriendReq(e) {
	      e.preventDefault();

	      var friendRequest = {
	        requestee: document.getElementsByClassName('friendToAdd')[0].value
	      };
	      console.log(friendRequest);
	      var data = new Promise(function (resolve, reject) {
	        _superagent2.default.post('/api/friendRequest').send(friendRequest).end(function (err, res) {
	          if (err) {
	            console.log(err);
	            return reject(err);
	          }
	          //;
	          console.log('response test', res.text);
	          if (res.text.indexOf('exist') !== -1) {
	            $(".doesntExist").fadeIn(1000);
	            $(".doesntExist").fadeOut(1000);
	            //document.getElementsByClassName("doesntExist")[0].style.display='inline';
	            console.log('doesnt exist');
	          } else if (res.text.indexOf('request sent') !== -1) {
	            $(".requestSent").fadeIn(1000);
	            $(".requestSent").fadeOut(1000);
	            //document.getElementsByClassName("requestSent")[0].style.display='inline';

	            console.log('request  sent!!');
	          } else if (res.text.indexOf('already send') !== -1) {

	            $(".alreadySent").fadeIn(1000);
	            $(".alreadySent").fadeOut(1000);
	            //document.getElementsByClassName("alreadySent")[0].style.display='inline';

	            console.log('request already sent');
	          } else {
	            $(".alreadyAFriend").fadeIn(1000);
	            $(".alreadyAFriend").fadeOut(1000);
	            document.getElementsByClassName("alreadyAFriend")[0].style.display = 'inline';
	          }
	          return resolve(res);
	        });
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var panelItems = void 0;

	      this.props.actions.createFilters(this.props.totalCollection, this.props.filters);
	      console.log(this.props.panelMode);
	      if (this.props.panelMode === 'friendRequests') {

	        if (this.props.friendRequests.length === 0) {

	          panelItems = _react2.default.createElement(
	            'div',
	            null,
	            _react2.default.createElement(
	              'div',
	              null,
	              _react2.default.createElement('input', { className: 'friendToAdd ', type: 'text', placeholder: 'Add a Friend' }),
	              _react2.default.createElement(
	                'button',
	                { className: 'button', onClick: this.submitFriendReq.bind(this) },
	                'Send Request'
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { style: { display: "none", color: "white" }, className: 'alreadyAFriend' },
	              '   Already a friend '
	            ),
	            _react2.default.createElement(
	              'div',
	              { style: { display: "none", color: "white" }, className: 'doesntExist' },
	              '   This Person hasn\'t signed up   '
	            ),
	            _react2.default.createElement(
	              'div',
	              { style: { display: "none", color: "white" }, className: 'requestSent' },
	              '   Request Sent!   '
	            ),
	            _react2.default.createElement(
	              'div',
	              { style: { display: "none", color: "white" }, className: 'alreadySent' },
	              '   Already sent a friend request  '
	            ),
	            _react2.default.createElement(
	              'p',
	              { style: { color: "white" } },
	              'No pending friend requests'
	            )
	          );
	        } else {
	          //
	          panelItems = _react2.default.createElement(
	            'div',
	            null,
	            _react2.default.createElement(
	              'div',
	              null,
	              _react2.default.createElement('input', { className: 'friendToAdd ', type: 'text', placeholder: 'Add a Friend' }),
	              _react2.default.createElement(
	                'button',
	                { className: 'button', onClick: this.submitFriendReq.bind(this) },
	                'Send Request'
	              ),
	              _react2.default.createElement(
	                'div',
	                { style: { display: "none", color: "white" }, className: 'alreadyAFriend' },
	                '   Already a friend '
	              ),
	              _react2.default.createElement(
	                'div',
	                { style: { display: "none", color: "white" }, className: 'doesntExist' },
	                '   This Person hasn\'t signed up   '
	              ),
	              _react2.default.createElement(
	                'div',
	                { style: { display: "none", color: "white" }, className: 'requestSent' },
	                '   Request Sent!   '
	              ),
	              _react2.default.createElement(
	                'div',
	                { style: { display: "none", color: "white" }, className: 'alreadySent' },
	                '   Already sent a friend request  '
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              null,
	              this.props.friendRequests.map(function (person) {
	                return _react2.default.createElement(_FriendModel2.default, { item: person });
	              })
	            )
	          );
	        }
	      } else if (this.props.panelMode === 'results') {
	        if (this.props.searchResults.length === 0) {

	          panelItems = _react2.default.createElement(
	            'div',
	            null,
	            _react2.default.createElement(
	              'p',
	              { style: { color: "white" } },
	              'SEARCH SOMETHING!!!'
	            )
	          );
	        } else {
	          panelItems = this.props.searchResults.map(function (restaurant) {
	            return _react2.default.createElement(_ResultModel2.default, { item: restaurant,
	              viewCollectionItem: _this2.props.actions.viewCollectionItem,
	              key: restaurant.name });
	          });
	        }
	      } else if (this.props.panelMode === 'filter') {

	        panelItems = this.props.filters.map(function (filter) {
	          return _react2.default.createElement(_FilterItem2.default, { filter: filter,
	            appliedFilters: _this2.props.filterSelected,
	            toggleFilter: _this2.props.actions.toggleFilter,
	            collection: _this2.props.totalCollection,
	            key: filter });
	        });
	      } else if (this.props.filteredCollection.length !== 0) {

	        panelItems = this.props.filteredCollection.map(function (restaurant) {
	          return _react2.default.createElement(_CollectionModel2.default, { item: restaurant, key: restaurant.name });
	        });
	      } else if (this.props.panelMode === 'collection') {
	        if (this.props.totalCollection.length === 0) {

	          panelItems = _react2.default.createElement(
	            'div',
	            null,
	            _react2.default.createElement(
	              'p',
	              { style: { color: "white" } },
	              'Add some places to your collection!!!'
	            )
	          );
	        } else {
	          panelItems = this.props.totalCollection.map(function (restaurant) {
	            return _react2.default.createElement(_CollectionModel2.default, { item: restaurant,
	              viewCollectionItem: _this2.props.actions.viewCollectionItem,
	              key: restaurant.name });
	          });
	        }
	      }
	      return _react2.default.createElement(
	        Menu,
	        { style: { color: 'blue' },
	          id: 'panel',
	          right: true,
	          noOverlay: true,
	          customBurgerIcon: false,
	          customCrossIcon: false,
	          isOpen: this.props.isOpen },
	        panelItems
	      );
	    }
	  }]);

	  return Panel;
	}(_react2.default.Component);

	function mapStateToProps(state) {
	  return {
	    totalCollection: state.CollectionRestaurantsFilters.collection,
	    filters: state.FilterSelectedRestaurants.filters,
	    filterSelected: state.FilterSelectedRestaurants.filterSelected,
	    filteredCollection: state.FilterSelectedRestaurants.filteredRestaurants,
	    panelMode: state.PanelMode.panelMode,
	    isOpen: state.PanelMode.isOpen,
	    searchResults: state.SearchBar.searchResults,
	    friendRequests: state.FriendReqs.friendReqs

	  };
	}

	function mapDispatchToProps(dispatch) {
	  return {
	    actions: (0, _redux.bindActionCreators)(Actions, dispatch)
	  };
	}

	exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Panel);

/***/ }

})