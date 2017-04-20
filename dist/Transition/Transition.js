'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _hexRgb = require('../utils/hex-rgb');

var _hexRgb2 = _interopRequireDefault(_hexRgb);

var _rgbHex = require('../utils/rgb-hex');

var _rgbHex2 = _interopRequireDefault(_rgbHex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Transition = function (_Component) {
  _inherits(Transition, _Component);

  function Transition(props) {
    _classCallCheck(this, Transition);

    var _this = _possibleConstructorReturn(this, (Transition.__proto__ || Object.getPrototypeOf(Transition)).call(this, props));

    _this.handleBg = _this.handleBg.bind(_this);
    _this.determineBg = _this.determineBg.bind(_this);
    _this.calcPosition = _this.calcPosition.bind(_this);
    _this.calcColorVector = _this.calcColorVector.bind(_this);
    return _this;
  }

  _createClass(Transition, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.handleBg();
      window.addEventListener('resize', function () {
        return _this2.handleBg();
      });
      window.addEventListener('scroll', function () {
        return _this2.handleBg();
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize');
      window.removeEventListener('scroll');
    }
  }, {
    key: 'handleBg',
    value: function handleBg() {
      // props and fns
      var calcPosition = this.calcPosition,
          calcProgress = this.calcProgress,
          determineBg = this.determineBg,
          _props = this.props,
          from = _props.from,
          to = _props.to,
          eventKey = _props.eventKey,
          handleTransition = _props.handleTransition;

      // position of the elements

      var _calcPosition = calcPosition(),
          vh = _calcPosition.vh,
          beginPos = _calcPosition.beginPos,
          endPos = _calcPosition.endPos;

      // send back the bg color


      if (vh < beginPos) handleTransition(eventKey, from, 'pre');else if (vh > endPos) handleTransition(eventKey, to, 'post');else handleTransition(eventKey, determineBg(calcProgress(beginPos, endPos, vh)), 'current');
    }

    // fns for calculating element position

  }, {
    key: 'calcPosition',
    value: function calcPosition() {
      var begin = this.begin,
          end = this.end,
          position = this.props.position;


      var shouldConfigureVhPos = typeof position === 'number' && position >= 0 && position <= 1;

      var vh = window.innerHeight * (shouldConfigureVhPos ? position : 0.5);
      var beginPos = begin.getBoundingClientRect().bottom;
      var endPos = end.getBoundingClientRect().bottom;

      // window height and offset position of the elements
      return { vh: vh, beginPos: beginPos, endPos: endPos };
    }
  }, {
    key: 'calcProgress',
    value: function calcProgress(begin, end, current) {
      return (current - begin) / (end - begin);
    }
  }, {
    key: 'calcRange',
    value: function calcRange(start, finish) {
      return finish - start;
    }

    /**
    * fns for calculating the bg color
    * progress is determined by element pos
    **/

  }, {
    key: 'calcColorVector',
    value: function calcColorVector(start, finish, progress) {
      return start + this.calcRange(start, finish) * progress;
    }
  }, {
    key: 'determineBg',
    value: function determineBg(progress) {
      var calcColorVector = this.calcColorVector,
          _props2 = this.props,
          from = _props2.from,
          to = _props2.to;

      var _hexToRgb = (0, _hexRgb2.default)(from, to),
          _hexToRgb2 = _slicedToArray(_hexToRgb, 3),
          sR = _hexToRgb2[0],
          sG = _hexToRgb2[1],
          sB = _hexToRgb2[2];

      var _hexToRgb3 = (0, _hexRgb2.default)(to, from),
          _hexToRgb4 = _slicedToArray(_hexToRgb3, 3),
          fR = _hexToRgb4[0],
          fG = _hexToRgb4[1],
          fB = _hexToRgb4[2];

      return '#' + (0, _rgbHex2.default)(calcColorVector(sR, fR, progress), calcColorVector(sG, fG, progress), calcColorVector(sB, fB, progress));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props3 = this.props,
          height = _props3.height,
          children = _props3.children;


      return _jsx('div', {}, void 0, _react2.default.createElement('div', { ref: function ref(node) {
          return _this3.begin = node;
        } }), _react2.default.createElement(
        'div',
        { ref: function ref(node) {
            return _this3.end = node;
          }, style: { height: height } },
        children
      ));
    }
  }]);

  return Transition;
}(_react.Component);

exports.default = Transition;