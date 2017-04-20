'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Transition = require('../Transition/Transition');

var _Transition2 = _interopRequireDefault(_Transition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AnimatedBg = function (_Component) {
  _inherits(AnimatedBg, _Component);

  function AnimatedBg(props) {
    _classCallCheck(this, AnimatedBg);

    var _this = _possibleConstructorReturn(this, (AnimatedBg.__proto__ || Object.getPrototypeOf(AnimatedBg)).call(this, props));

    _this.handleTransition = _this.handleTransition.bind(_this);
    _this.findTransitionsNum = _this.findTransitionsNum.bind(_this);

    _this.colors = [];
    _this.keyNum = 0;
    _this.state = {
      backgroundColor: 'transparent'
    };
    return _this;
  }

  _createClass(AnimatedBg, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.findTransitionsNum(this.props.children);
      this.childrenWithTransition(this.props.children);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.findTransitionsNum(nextProps.children);
      this.childrenWithTransition(nextProps.children);
    }
  }, {
    key: 'handleTransition',
    value: function handleTransition(eventKey, color, activity) {
      this.colors[eventKey] = { color: color, activity: activity };

      if (this.colors.length === this.keyNum) {
        var colorArr = this.colors.reverse();
        this.colors = [];

        for (var i = 0; i < this.keyNum; i++) {
          var _colorArr$i = colorArr[i],
              _color = _colorArr$i.color,
              _activity = _colorArr$i.activity;


          if (_activity === 'pre' && i + 1 !== this.keyNum) continue;
          if (_color !== this.state.backgroundColor) this.setState({
            backgroundColor: _color
          });

          break;
        }
      }
    }
  }, {
    key: 'findTransitionsNum',
    value: function findTransitionsNum(children) {
      var _this2 = this;

      this.keyNum = 0;
      _react2.default.Children.forEach(children, function (child) {
        if (child.type === _Transition2.default) _this2.keyNum += 1;
      });
    }
  }, {
    key: 'childrenWithTransition',
    value: function childrenWithTransition(children) {
      var handleTransition = this.handleTransition;

      var eventKey = -1;

      this.children = _react2.default.Children.map(children, function (child) {
        if (child.type === _Transition2.default) {
          eventKey += 1;
          return _react2.default.cloneElement(child, { eventKey: eventKey, handleTransition: handleTransition });
        }

        return child;
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var backgroundColor = this.state.backgroundColor;


      return _jsx('div', {
        style: { backgroundColor: backgroundColor }
      }, void 0, this.children);
    }
  }]);

  return AnimatedBg;
}(_react.Component);

exports.default = AnimatedBg;