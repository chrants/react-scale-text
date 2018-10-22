/* eslint-disable no-param-reassign */
import { doesOverflow } from "./dom-utils";

// Determine the font-size to set on the element `el` that will
// allow the first child of that element to fill the maximum height
// and width without causing overflow
export default function getFillSize(
  el,
  minFontSize,
  maxFontSize,
  mode,
  factor = 1
) {
  // Make an initial guess at font-size that fits width
  let fontSize = maxFontSize;

  // Math.max(
  //   Math.min(Number(el.offsetWidth) / (factor * 10), maxFontSize),
  //   minFontSize
  // );

  const step = 1;
  let complete;

  while (!complete) {
    el.style.fontSize = `${fontSize}px`;
    const [overflowWidth, overflowHeight] = doesOverflow(el);

    if (fontSize <= minFontSize) {
      // because start at max, if less than min, exhausted all values
      fontSize = minFontSize;
      complete = true;
    } else if (overflowHeight || overflowWidth) {
      fontSize -= step;
    } else {
      complete = true;
    }
  }
  return fontSize;
}
/* eslint-enable no-param-reassign */

// Calculate height without padding.
// export function innerHeight(el) {
//   const style = window.getComputedStyle(el, null);
//   return (
//     el.clientHeight -
//     parseInt(style.getPropertyValue("padding-top"), 10) -
//     parseInt(style.getPropertyValue("padding-bottom"), 10)
//   );
// }

// // Calculate width without padding.
// export function innerWidth(el) {
//   const style = window.getComputedStyle(el, null);
//   return (
//     el.clientWidth -
//     parseInt(style.getPropertyValue("padding-left"), 10) -
//     parseInt(style.getPropertyValue("padding-right"), 10)
//   );
// }

// function assertElementFitsWidth(el, width) {
//   // -1: temporary bugfix, will be refactored soon
//   return el.scrollWidth - 1 <= width;
// }

// function assertElementFitsHeight(el, height) {
//   // -1: temporary bugfix, will be refactored soon
//   return el.scrollHeight - 1 <= height;
// }

// const { min, max, mode, forceSingleModeWidth, onReady } = this.props;
// const el = this._parent;
// const wrapper = this._child;

// const originalWidth = innerWidth(el);
// const originalHeight = innerHeight(el);

// if (originalHeight <= 0 || isNaN(originalHeight)) {
//   console.warn(
//     "Can not process element without height. Make sure the element is displayed and has a static height."
//   );
//   return;
// }

// if (originalWidth <= 0 || isNaN(originalWidth)) {
//   console.warn(
//     "Can not process element without width. Make sure the element is displayed and has a static width."
//   );
//   return;
// }

// const pid = uniqueId();
// this.pid = pid;

// const shouldCancelProcess = () => pid !== this.pid;

// const testPrimary =
//   mode === "multi"
//     ? () => assertElementFitsHeight(wrapper, originalHeight)
//     : () => assertElementFitsWidth(wrapper, originalWidth);

// const testSecondary =
//   mode === "multi"
//     ? () => assertElementFitsWidth(wrapper, originalWidth)
//     : () => assertElementFitsHeight(wrapper, originalHeight);

// let mid;
// let low = min;
// let high = max;

// this.setState({ ready: false });

// series(
//   [
//     // Step 1:
//     // Binary search to fit the element's height (multi line) / width (single line)
//     stepCallback =>
//       whilst(
//         () => low <= high,
//         whilstCallback => {
//           if (shouldCancelProcess()) return whilstCallback(true);
//           mid = parseInt((low + high) / 2, 10);
//           this._parent.style.fontSize = mid;
//           this.setState({ fontSize: mid }, () => {
//             if (shouldCancelProcess()) return whilstCallback(true);
//             if (testPrimary()) low = mid + 1;
//             else high = mid - 1;
//             return whilstCallback();
//           });
//         },
//         stepCallback
//       ),
//     // Step 2:
//     // Binary search to fit the element's width (multi line) / height (single line)
//     // If mode is single and forceSingleModeWidth is true, skip this step
//     // in order to not fit the elements height and decrease the width
//     stepCallback => {
//       if (mode === "single" && forceSingleModeWidth) return stepCallback();
//       if (testSecondary()) return stepCallback();
//       low = min;
//       high = mid;
//       return whilst(
//         () => low < high,
//         whilstCallback => {
//           if (shouldCancelProcess()) return whilstCallback(true);
//           mid = parseInt((low + high) / 2, 10);
//           this._parent.style.fontSize = mid;
//           this.setState({ fontSize: mid }, () => {
//             if (pid !== this.pid) return whilstCallback(true);
//             if (testSecondary()) low = mid + 1;
//             else high = mid - 1;
//             return whilstCallback();
//           });
//         },
//         stepCallback
//       );
//     },
//     // Step 3
//     // Limits
//     stepCallback => {
//       // We break the previous loop without updating mid for the final time,
//       // so we do it here:
//       mid = Math.min(low, high);

//       // Ensure we hit the user-supplied limits
//       mid = Math.max(mid, min);
//       mid = Math.min(mid, max);

//       // Sanity check:
//       mid = Math.max(mid, 0);

//       if (shouldCancelProcess()) return stepCallback(true);
//       this._parent.style.fontSize = mid;
//       this.setState({ fontSize: mid }, stepCallback);
//     }
//   ],
//   err => {
//     // err will be true, if another process was triggered
//     if (err || shouldCancelProcess()) return;
//     this.setState({ ready: true }, () => onReady(mid));
//   }
// );

// /**
//  * Returns a new function that, when invoked, invokes `func` at most once per `wait` milliseconds.
//  * Taken from https://github.com/component/throttle v1.0.0
//  *
//  * @param {Function} func Function to wrap.
//  * @param {Number} wait Number of milliseconds that must elapse between `func` invocations.
//  * @return {Function} A new function that wraps the `func` function passed in.
//  */

// export default function throttle(func, wait) {
//   let ctx;
//   let args;
//   let rtn;
//   let timeoutID;
//   let last = 0;

//   function call() {
//     timeoutID = 0;
//     last = +new Date();
//     rtn = func.apply(ctx, args);
//     ctx = null;
//     args = null;
//   }

//   return function throttled() {
//     ctx = this;
//     args = arguments;
//     const delta = new Date() - last;
//     if (!timeoutID) {
//       if (delta >= wait) call();
//       else timeoutID = setTimeout(call, wait - delta);
//     }
//     return rtn;
//   };
// }
