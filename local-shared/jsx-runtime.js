// credits to the preact team for the orignal implementation ,
// the following is a modification that just passes the required
// props to snabbdom
// https://github.com/preactjs/preact/blob/eb3767723d43e8a38453efc28d187810edfa4231/jsx-runtime/src/index.js

import { Fragment, h } from "snabbdom";

export const IS_NON_DIMENSIONAL =
  /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;



const ENCODED_ENTITIES = /["&<]/;

/** @param {string} str */
export function encodeEntities(str) {
  // Skip all work for strings with no entities needing encoding:
  if (str.length === 0 || ENCODED_ENTITIES.test(str) === false) return str;

  let last = 0,
    i = 0,
    out = "",
    ch = "";

  // Seek forward in str until the next entity char:
  for (; i < str.length; i++) {
    switch (str.charCodeAt(i)) {
      case 34:
        ch = "&quot;";
        break;
      case 38:
        ch = "&amp;";
        break;
      case 60:
        ch = "&lt;";
        break;
      default:
        continue;
    }
    // Append skipped/buffered characters and the encoded entity:
    if (i !== last) out += str.slice(last, i);
    out += ch;
    // Start the next seek/buffer after the entity's offset:
    last = i + 1;
  }
  if (i !== last) out += str.slice(last, i);
  return out;
}

const isArray = Array.isArray;
function createVNode(type, props, key, isStaticChildren, __source, __self) {
  if (!props) props = {};

  let children = [];
  if (props.children) {
    children = props.children;
    delete props.children;
  }

  if (props.class) {
    props.className = Object.keys(props.class).join(" ");
    delete props.class;
  }

  const vnode = h(type, { props, key }, children);
  vnode.__source = __source;
  vnode.__self = __self;
  return vnode;
}

function jsxTemplate(templates, ...exprs) {
  const vnode = createVNode(Fragment, { tpl: templates, exprs });
  // Bypass render to string top level Fragment optimization
  vnode.key = vnode._vnode;
  return vnode;
}

const JS_TO_CSS = {};
const CSS_REGEX = /[A-Z]/g;

function jsxAttr(name, value) {
  if (name === "ref" || name === "key") return "";
  if (name === "style" && typeof value === "object") {
    let str = "";
    for (let prop in value) {
      let val = value[prop];
      if (val != null && val !== "") {
        const name =
          prop[0] == "-"
            ? prop
            : JS_TO_CSS[prop] ||
              (JS_TO_CSS[prop] = prop.replace(CSS_REGEX, "-$&").toLowerCase());

        let suffix = ";";
        if (
          typeof val === "number" &&
          // Exclude custom-attributes
          !name.startsWith("--") &&
          !IS_NON_DIMENSIONAL.test(name)
        ) {
          suffix = "px;";
        }
        str = str + name + ":" + val + suffix;
      }
    }
    return name + '="' + str + '"';
  }

  if (
    value == null ||
    value === false ||
    typeof value === "function" ||
    typeof value === "object"
  ) {
    return "";
  } else if (value === true) return name;

  return name + '="' + encodeEntities(value) + '"';
}

function jsxEscape(value) {
  if (
    value == null ||
    typeof value === "boolean" ||
    typeof value === "function"
  ) {
    return null;
  }

  if (typeof value === "object") {
    // Check for VNode
    if (value.constructor === undefined) return value;

    if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        value[i] = jsxEscape(value[i]);
      }
      return value;
    }
  }

  return encodeEntities("" + value);
}

export {
  Fragment,
  createVNode as jsx,
  jsxAttr,
  createVNode as jsxDEV,
  jsxEscape,
  // precompiled JSX transform
  jsxTemplate,
  createVNode as jsxs,
};
