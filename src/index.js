import React, { Component } from "react";
import PropTypes from "prop-types";
import warn from "warning";
import { generate as shortId } from "shortid";
import shallowEqual from "./shallow-equal";
import getFillSize from "./get-fillsize";
import { getStyle, css } from "./dom-utils";

class ScaleText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: null
    };

    this._resizing = false;
    this._invalidChild = false;
    this._mounted = false;

    this._handleResize = () => {
      if (!this._resizing) {
        requestAnimationFrame(this.handleResize.bind(this));
      }
      this._resizing = true;
    };
  }

  componentDidMount() {
    const { children } = this.props;
    this._mounted = true;
    this._invalidChild = React.Children.count(children) > 1;

    warn(
      !this._invalidChild,
      `'ScaleText' expects a single node as a child, but we found
      ${React.Children.count(children)} children instead.
      No scaling will be done on this subtree`
    );

    if (this.shouldResize()) {
      this.resize();
      window.addEventListener("resize", this._handleResize);
    }
  }

  componentDidUpdate(prevProps) {
    // compare children's props for change
    if (
      !shallowEqual(prevProps.children.props, this.props.children.props) ||
      prevProps.children !== this.props.children ||
      prevProps !== this.props
    ) {
      this.resize();
    }
  }

  componentWillUnmount() {
    this.clearRuler();
    if (!this.shouldResize()) {
      window.removeEventListener("resize", this._handleResize);
    }
  }

  shouldResize() {
    return !this._invalidChild;
  }

  handleResize() {
    this._resizing = false;
    this.resize();
  }

  resize() {
    const { minFontSize, maxFontSize, mode } = this.props;
    if (!this._mounted || !this._wrapper) return;
    if (this.ruler) {
      this.clearRuler();
    }
    this.createRuler();

    const fontSize = getFillSize(this.ruler, minFontSize, maxFontSize, mode);

    this.setState(
      {
        size: parseFloat(fontSize, 10),
        complete: true
      },
      () => {
        this.clearRuler();
        this.props.onReady();
      }
    );
  }

  createRuler() {
    // Create copy of wrapper for sizing
    this.ruler = this._wrapper.cloneNode(true);
    this.ruler.id = shortId();
    css(this.ruler, {
      position: "absolute",
      top: "0px",
      left: "calc(100vw * 2)",
      width: getStyle(this._wrapper, "width"),
      height: getStyle(this._wrapper, "height"),
      padding: getStyle(this._wrapper, "padding"),
      lineHeight: getStyle(this._wrapper, "line-height"),
      letterSpacing: getStyle(this._wrapper, "letter-spacing"),
      font: getStyle(this._wrapper, "font")
    });
    document.body.appendChild(this.ruler);
  }

  clearRuler() {
    if (this.ruler) {
      document.body.removeChild(this.ruler);
    }
    this.ruler = null;
  }

  render() {
    const { size: fontSize } = this.state;
    const { children, mode } = this.props;

    // TODO: bug
    const overflowStyle =
      mode === "multi"
        ? { overflowY: "visible", overflowX: "hidden", height: "auto" }
        : { overflow: "hidden" };

    const child = React.isValidElement(children) ? (
      React.Children.only(children)
    ) : (
      <span>{children}</span>
    );

    const style = {
      fontSize: fontSize ? `${fontSize.toFixed(2)}px` : "inherit",
      width: "100%",
      height: "100%",
      ...overflowStyle
      // whiteSpace: "nowrap"
      // overflow: 'hidden'
    };
    if (mode === "single") style.whiteSpace = "nowrap";

    const childProps = {
      fontSize: fontSize ? parseFloat(fontSize.toFixed(2)) : "inherit"
    };

    return (
      <div
        className="scaletext-wrapper"
        ref={c => {
          this._wrapper = c;
        }}
        style={style}
      >
        {React.cloneElement(child, childProps)}
      </div>
    );
  }
}

ScaleText.propTypes = {
  children: PropTypes.node.isRequired,
  minFontSize: PropTypes.number.isRequired,
  maxFontSize: PropTypes.number.isRequired,
  mode: PropTypes.oneOf(["single", "multi"]),
  onReady: PropTypes.func
};

ScaleText.defaultProps = {
  minFontSize: 1,
  maxFontSize: Number.POSITIVE_INFINITY,
  mode: "single",
  onReady: () => null
};

// export default ScaleText;
module.exports = ScaleText;
