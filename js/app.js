/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 25);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AbstractElement = /** @class */ (function () {
    function AbstractElement() {
    }
    AbstractElement.prototype.free = function () { };
    return AbstractElement;
}());
exports.AbstractElement = AbstractElement;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(8);
exports.HyperValue = core_1.HyperValue;
var scopes = __webpack_require__(34);
exports.scopes = scopes;
var debug_1 = __webpack_require__(4);
exports.tracer = debug_1.tracer;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dispatcher_1 = __webpack_require__(15);
var debug_1 = __webpack_require__(4);
var BaseScope = /** @class */ (function () {
    function BaseScope() {
        this.watcherList = {};
        this.children = [];
    }
    BaseScope.prototype.watch = function (hv, fn) {
        var hvId = typeof hv === 'number'
            ? hv
            : hv.id;
        var watcherId = dispatcher_1.globalDispatcher.watch(hvId, fn);
        var watcherSet = this.watcherList[hvId];
        if (!watcherSet) {
            watcherSet = {};
            this.watcherList[hvId] = watcherSet;
        }
        watcherSet[watcherId] = watcherId;
        return watcherId;
    };
    BaseScope.prototype.unwatch = function (hv, watcherId, tolerate) {
        var hvId = typeof hv === 'number'
            ? hv
            : hv.id;
        var watcherSet = this.watcherList[hvId];
        if (!watcherSet) {
            if (tolerate) {
                return;
            }
            throw new Error('incorrect hv ID');
        }
        delete watcherSet[watcherId];
        dispatcher_1.globalDispatcher.unwatch(hvId, watcherId);
    };
    BaseScope.prototype.catch = function (hv, catcher) {
        var hvId = typeof hv === 'number'
            ? hv
            : hv.id;
        dispatcher_1.globalDispatcher.catch(hvId, catcher);
    };
    BaseScope.prototype.fail = function (hv, error, details) {
        var hvId = typeof hv === 'number'
            ? hv
            : hv.id;
        dispatcher_1.globalDispatcher.fail(hvId, error, details);
    };
    BaseScope.prototype.free = function () {
        for (var hvId in this.watcherList) {
            var watcherSet = this.watcherList[hvId];
            for (var watcherId in watcherSet) {
                this.unwatch(Number(hvId), Number(watcherId));
            }
        }
        this.watcherList = {};
        this.children.forEach(function (child) { return child.free(); });
    };
    BaseScope.prototype.regChild = function (child) {
        this.children.push(child);
    };
    BaseScope = __decorate([
        debug_1.scopeDebug
    ], BaseScope);
    return BaseScope;
}());
exports.BaseScope = BaseScope;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var uniqObjects = new WeakMap();
var currentId = 0;
function hash(obj) {
    if (obj === null || obj === undefined) {
        return _a = {}, _a[String(obj)] = true, _a;
    }
    if (typeof obj === 'boolean' ||
        typeof obj === 'string' ||
        typeof obj === 'number') {
        return obj;
    }
    var cached = uniqObjects.get(obj);
    if (cached !== undefined) {
        return cached;
    }
    var id = currentId;
    currentId++;
    var result = { o: id };
    uniqObjects.set(obj, result);
    return result;
    var _a;
}
exports.hash = hash;
function stringify(hr) {
    return JSON.stringify(hr);
}
exports.stringify = stringify;
function hashDict(obj) {
    var res = {};
    var keys = Object.keys(obj).sort();
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var name = keys_1[_i];
        res[name] = hash(obj[name]);
    }
    return res;
}
exports.hashDict = hashDict;
function hashArray(arr) {
    return arr.map(function (item) { return hash(item); });
}
exports.hashArray = hashArray;
function hashBlock(params) {
    return JSON.stringify(params);
}
exports.hashBlock = hashBlock;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var toBeReported = [];
function report(obj, msg) {
    if (toBeReported.length === 0) {
        setTimeout(outputWarns, 1000);
    }
    toBeReported.push({ obj: obj, msg: msg });
}
exports.report = report;
function outputWarns() {
    if (toBeReported.length === 0) {
        return;
    }
    var objList = [];
    var warns = toBeReported.filter(function (_a) {
        var obj = _a.obj;
        var has = objList.indexOf(obj) !== -1;
        if (!has) {
            objList.push(obj);
        }
        return !has;
    });
    for (var _i = 0, warns_1 = warns; _i < warns_1.length; _i++) {
        var w = warns_1[_i];
        console.warn(w.msg, w.obj, w.obj._debug);
    }
    toBeReported = [];
}
var scope_1 = __webpack_require__(27);
exports.scopeDebug = scope_1.scopeDebug;
var hv_1 = __webpack_require__(28);
exports.hvDebug = hv_1.hvDebug;
exports.traceHv = hv_1.traceHv;
exports.tracer = hv_1.tracer;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(8);
var base_1 = __webpack_require__(2);
var AutoScope = /** @class */ (function (_super) {
    __extends(AutoScope, _super);
    function AutoScope() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AutoScope.prototype.bind = function (hv, fn, init) {
        var _this = this;
        if (init === void 0) { init = true; }
        var depList = [];
        var watchDeps = function (hvIdList) {
            return hvIdList.map(function (hvId) {
                return {
                    hvId: hvId,
                    watcherId: _this.watch(hvId, watcher.bind(null, true))
                };
            });
        };
        var watcher = function (needInit) {
            // do we need it still?
            for (var _i = 0, depList_1 = depList; _i < depList_1.length; _i++) {
                var dep = depList_1[_i];
                _this.unwatch(dep.hvId, dep.watcherId, true);
            }
            var value, deps;
            try {
                _a = core_1.record(fn), value = _a[0], deps = _a[1];
            }
            catch (error) {
                _this.fail(hv, error, {
                    oldValue: hv.$
                });
                depList = watchDeps(depList.map(function (dep) { return dep.hvId; }));
                return;
            }
            depList = watchDeps(deps.map(function (hv) { return hv.id; }));
            if (needInit) {
                hv.s(value);
            }
            var _a;
        };
        watcher(init);
    };
    AutoScope.prototype.auto = function (fn) {
        var hv = new core_1.HyperValue(null);
        this.bind(hv, fn, true);
        return hv;
    };
    return AutoScope;
}(base_1.BaseScope));
exports.AutoScope = AutoScope;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var abstract_1 = __webpack_require__(0);
exports.AbstractElement = abstract_1.AbstractElement;
var component_1 = __webpack_require__(21);
exports.Component = component_1.Component;
exports.closestComponent = component_1.closestComponent;
var jsx_1 = __webpack_require__(38);
exports.jsx = jsx_1.jsx;
var common_1 = __webpack_require__(7);
exports.targetRenderChildren = common_1.targetRenderChildren;
var element_1 = __webpack_require__(24);
exports.registerGlobalProp = element_1.registerGlobalProp;
var debug_1 = __webpack_require__(11);
exports.debugTargetProxy = debug_1.debugTargetProxy;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var hv_1 = __webpack_require__(1);
var abstract_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(12);
var string_1 = __webpack_require__(36);
var zone_1 = __webpack_require__(22);
var placeholder_1 = __webpack_require__(37);
function normalizeNodeSet(hs, children) {
    if (typeof children === 'string') {
        return [new string_1.StringElm(children)];
    }
    if (typeof children === 'number') {
        return [new string_1.StringElm(String(children))];
    }
    if (!children) {
        return [new placeholder_1.PlaceholderElm()];
    }
    if (children instanceof abstract_1.AbstractElement) {
        return [children];
    }
    var normalize = function (children) { return normalizeNodeSet(hs, children); };
    if (Array.isArray(children)) {
        var array = utils_1.flatArray(children.map(normalize));
        return array.length > 0
            ? array
            : [new placeholder_1.PlaceholderElm()];
    }
    if (children instanceof hv_1.HyperValue) {
        var content = hs.proxy(children, normalize);
        return [new zone_1.HyperZone(content)];
    }
    throw new Error('invalid child');
}
exports.normalizeNodeSet = normalizeNodeSet;
function targetRenderChildren(meta, children) {
    var hs = new hv_1.scopes.ProxyScope();
    return utils_1.flatArray(normalizeNodeSet(hs, children)
        .map(function (node) { return node.targetRender(meta); }));
}
exports.targetRenderChildren = targetRenderChildren;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(13);
exports.HyperValue = core_1.HyperValue;
var record_1 = __webpack_require__(14);
exports.record = record_1.record;
exports.recordAsync = record_1.recordAsync;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(13);
var base_1 = __webpack_require__(2);
var CastScope = /** @class */ (function (_super) {
    __extends(CastScope, _super);
    function CastScope() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CastScope.prototype.cast = function (hv) {
        return hv instanceof core_1.HyperValue
            ? hv
            : new core_1.HyperValue(hv);
    };
    CastScope.prototype.read = function (hv) {
        return hv instanceof core_1.HyperValue
            ? hv.g()
            : hv;
    };
    return CastScope;
}(base_1.BaseScope));
exports.CastScope = CastScope;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var auto_1 = __webpack_require__(5);
var ProxyScope = /** @class */ (function (_super) {
    __extends(ProxyScope, _super);
    function ProxyScope() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProxyScope.prototype.proxy = function (hv, getter, setter) {
        var result = this.auto(function () { return getter(hv.$); });
        if (setter) {
            this.bind(hv, function () { return setter(result.$); }, false);
        }
        return result;
    };
    return ProxyScope;
}(auto_1.AutoScope));
exports.ProxyScope = ProxyScope;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
var hv_1 = __webpack_require__(1);
if (typeof global.performance === 'undefined') {
    global.performance = {
        now: function () { return Date.now(); }
    };
}
// function genReport(renderStack: RenderInfo): FlameReport {
//     const name = renderStack.name;
//     const value = isNaN(renderStack.time)
//         ? (renderStack.children || []).reduce((total, cur) => total + cur.time, 0)
//         : renderStack.time;
//     if (!renderStack.children || renderStack.children.length <= 0) {
//         return {name, value};
//     }
//     const children = renderStack.children.map(genReport);
//     return {name, value, children};
// }
// type DebugObject = Component<any> | HyperZone;
// function extractObjectInfo(comp: DebugObject) {
//     return (comp.constructor as any).name;
// }
// function now(): number {
//     return Math.round(performance.now() * 100) / 100;
// }
// function callLog<T>(comp: DebugObject, fn: () => T): T {
//     const subInfo = {
//         name: extractObjectInfo(comp),
//         children: [],
//         parent: renderStack,
//         time: NaN,
//         instance: comp
//     };
//     if (renderStack === null) {
//         throw new Error('render stack failed');
//     }
//     renderStack.children.push(subInfo);
//     renderStack = subInfo;
//     const startTime = performance.now();
//     const result = fn();
//     const endTime = performance.now();
//     childrenRendered++;
//     renderStack.time = Math.round((endTime - startTime) * 100) / 100;
//     renderStack.targetTime = targetTime + renderStack.children
//         .map(child => child.targetTime || 0)
//         .reduce((total, cur) => total + cur, 0);
//     targetTime = 0;
//     renderStack = renderStack.parent;
//     if (renderStack === null) {
//         throw new Error('render stack failed');
//     }
//     if (renderStack.parent === null) {
//         console.log('children rendered:', childrenRendered);
//         childrenRendered = 0;
//         renderStack.report = genReport(renderStack);
//         console.log(renderStack);
//         renderStack = {
//             name: 'root',
//             children: [],
//             parent: null,
//             time: NaN,
//         };
//     }
//     return result;
// }
var targetTime = 0;
function debugTargetProxy(target) {
    var result = {};
    var _loop_1 = function (fnName) {
        result[fnName] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var startTime = performance.now();
            var result = target[fnName].apply(this, args);
            var endTime = performance.now();
            targetTime = targetTime + endTime - startTime;
            return result;
        };
    };
    for (var fnName in target) {
        _loop_1(fnName);
    }
    return result;
}
exports.debugTargetProxy = debugTargetProxy;
exports.renderDebug = hv_1.tracer.traceMethod(function (target) { return target.constructor.name; });
window.createReport = createReport;
function createReport(data) {
    var json = JSON.stringify(data);
    var code = "<html>\n        <head>\n        <link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.jsdelivr.net/gh/spiermar/d3-flame-graph@1.0.4/dist/d3.flameGraph.min.css\">\n        </head>\n        <body>\n            <div id=\"chart\"></div>\n            <script type=\"text/javascript\" src=\"https://cdnjs.cloudflare.com/ajax/libs/d3/4.10.0/d3.min.js\"></script>\n            <script type=\"text/javascript\" src=\"https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.7.1/d3-tip.min.js\"></script>\n            <script type=\"text/javascript\" src=\"https://cdn.jsdelivr.net/gh/spiermar/d3-flame-graph@1.0.4/dist/d3.flameGraph.min.js\"></script>\n            <script type=\"text/javascript\">\n            var data = " + json + ";\n\n            var flamegraph = d3.flameGraph()\n                .width(960);\n\n            d3.select(\"#chart\")\n                .datum(data)\n                .call(flamegraph);\n            </script>\n        </body>\n    </html>";
    var ifr = window.document.createElement('iframe');
    ifr.setAttribute('width', '100%');
    ifr.setAttribute('height', '1000px');
    window.document.body.appendChild(ifr);
    ifr.contentDocument.write(code);
}
// export function trackComponent

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function flatArray(arr) {
    var res = [];
    arr.forEach(function (item) {
        if (!Array.isArray(item)) {
            res.push(item);
            return;
        }
        res = res.concat(flatArray(item));
    });
    return res;
}
exports.flatArray = flatArray;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var record_1 = __webpack_require__(14);
var dispatcher_1 = __webpack_require__(15);
var debug_1 = __webpack_require__(4);
var currentId = 0;
//@hvDebug
var HyperValue = /** @class */ (function () {
    function HyperValue(initialValue) {
        this.updating = false;
        this.id = currentId++;
        this.value = initialValue;
    }
    HyperValue.prototype.g = function (silent) {
        if (!silent) {
            record_1.addToRecords(this);
        }
        if (this.updating) {
            return this.newValue;
        }
        return this.value;
    };
    HyperValue.prototype.s = function (newValue) {
        if (this.updating) {
            return;
        }
        if (newValue === this.value) {
            return;
        }
        this.updating = true;
        this.newValue = newValue;
        dispatcher_1.globalDispatcher.handle(this.id, newValue, this.value);
        this.value = newValue;
        this.updating = false;
    };
    Object.defineProperty(HyperValue.prototype, "$", {
        get: function () {
            return this.g();
        },
        set: function (newValue) {
            this.s(newValue);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        debug_1.traceHv
    ], HyperValue.prototype, "s", null);
    return HyperValue;
}());
exports.HyperValue = HyperValue;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.recordedHvStack = [];
function hvRecordStart() {
    exports.recordedHvStack.push([]);
}
function hvRecordStop() {
    var newList = exports.recordedHvStack.pop();
    return newList;
}
function addToRecords(hv) {
    if (exports.recordedHvStack.length <= 0) {
        return;
    }
    var currentList = exports.recordedHvStack[exports.recordedHvStack.length - 1];
    if (currentList.indexOf(hv) === -1) {
        currentList.push(hv);
    }
}
exports.addToRecords = addToRecords;
function record(fn) {
    hvRecordStart();
    var result = fn();
    return [result, hvRecordStop()];
}
exports.record = record;
function recordAsync(fn, noNewDeps) {
    return new Promise(function (resolve, reject) {
        var deps = [];
        function w(p) {
            return new Promise(function (resolve, reject) {
                var newDeps = hvRecordStop();
                deps = deps.concat(newDeps);
                if (noNewDeps) {
                    noNewDeps(newDeps);
                }
                p.then(function (value) {
                    hvRecordStart();
                    resolve(value);
                }, function (error) {
                    reject(error);
                });
            });
        }
        hvRecordStart();
        fn(w).then(function (value) {
            var newDeps = hvRecordStop();
            var finalDeps = deps.concat(newDeps);
            if (noNewDeps) {
                noNewDeps(newDeps);
            }
            resolve([value, finalDeps]);
        }, function (error) {
            reject(error);
        });
    });
}
exports.recordAsync = recordAsync;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var list_1 = __webpack_require__(26);
var HvDispatcher = /** @class */ (function () {
    function HvDispatcher() {
        this.watcherSets = {};
        this.lastErrorDetails = null;
    }
    HvDispatcher.prototype.watch = function (hvId, fn) {
        var currentSet = this.watcherSets[hvId];
        if (!currentSet) {
            currentSet = {
                watchers: new list_1.List(),
                catcher: null
            };
            this.watcherSets[hvId] = currentSet;
        }
        return currentSet.watchers.add(fn);
    };
    HvDispatcher.prototype.unwatch = function (hvId, watcherId) {
        var currentSet = this.watcherSets[hvId];
        if (!currentSet) {
            throw new Error('incorrect hv ID');
        }
        currentSet.watchers.del(watcherId);
    };
    HvDispatcher.prototype.catch = function (hvId, catcher) {
        var currentSet = this.watcherSets[hvId];
        if (!currentSet) {
            currentSet = {
                watchers: new list_1.List(),
                catcher: null
            };
            this.watcherSets[hvId] = currentSet;
        }
        currentSet.catcher = catcher;
    };
    HvDispatcher.prototype.handle = function (hvId, newValue, oldValue) {
        var _this = this;
        var currentSet = this.watcherSets[hvId];
        if (!currentSet) {
            return;
        }
        currentSet.watchers.entries().forEach(function (_a) {
            var watcher = _a[1];
            try {
                watcher(newValue, oldValue);
            }
            catch (error) {
                _this.lastErrorDetails = { newValue: newValue, oldValue: oldValue };
                _this.fail(hvId, error);
            }
        });
    };
    HvDispatcher.prototype.fail = function (hvId, error, details) {
        var currentSet = this.watcherSets[hvId];
        if (!currentSet) {
            throw error;
        }
        if (currentSet.catcher) {
            details = details || this.lastErrorDetails;
            currentSet.catcher(error, details);
            this.lastErrorDetails = null;
            return;
        }
        throw error;
    };
    return HvDispatcher;
}());
exports.HvDispatcher = HvDispatcher;
exports.globalDispatcher = new HvDispatcher();


/***/ }),
/* 16 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var auto_1 = __webpack_require__(5);
var cast_1 = __webpack_require__(9);
var mixin_1 = __webpack_require__(18);
exports.Base = mixin_1.mixSome(auto_1.AutoScope, cast_1.CastScope);
var ArrayScope = /** @class */ (function (_super) {
    __extends(ArrayScope, _super);
    function ArrayScope() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrayScope.prototype.length = function (hv) {
        return this.auto(function () {
            return hv.$.length;
        });
    };
    ArrayScope.prototype.map = function (hv, mapFn) {
        return this.auto(function () {
            return hv.$.map(mapFn);
        });
    };
    ArrayScope.prototype.every = function (hv, mapFn) {
        return this.auto(function () {
            return hv.$.every(mapFn);
        });
    };
    ArrayScope.prototype.some = function (hv, mapFn) {
        return this.auto(function () {
            return hv.$.some(mapFn);
        });
    };
    ArrayScope.prototype.filter = function (hv, mapFn) {
        return this.auto(function () {
            return hv.$.filter(mapFn);
        });
    };
    ArrayScope.prototype.reduce = function (hv, reducer, initial) {
        return this.auto(function () {
            return initial !== undefined
                ? hv.$.reduce(reducer, initial)
                : hv.$.reduce(reducer);
        });
    };
    ArrayScope.prototype.find = function (hv, fn) {
        return this.auto(function () {
            var array = hv.$;
            for (var i = 0; i < array.length; i++) {
                if (fn(array[i], i, array)) {
                    return array[i];
                }
            }
            return null;
        });
    };
    ArrayScope.prototype.findIndex = function (hv, fn) {
        return this.auto(function () {
            var array = hv.$;
            for (var i = 0; i < array.length; i++) {
                if (fn(array[i], i, array)) {
                    return i;
                }
            }
            return -1;
        });
    };
    ArrayScope.prototype.concat = function () {
        var hvs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            hvs[_i] = arguments[_i];
        }
        return this.auto(function () {
            var arrays = hvs.map(function (hv) { return hv.$; });
            return Array.prototype.concat.apply([], arrays.slice());
        });
    };
    ArrayScope.prototype.slice = function (hv, start, end) {
        var _this = this;
        return this.auto(function () {
            var array = hv.$;
            var s = start === undefined ? 0 : _this.read(start);
            var e = end === undefined ? array.length : _this.read(end);
            return array.slice(s, e);
        });
    };
    ArrayScope.prototype.insert = function (hv, index, elems) {
        var array = hv.$;
        if (index < 0) {
            index = array.length + index;
        }
        var newArray = [].concat(array.slice(0, index), elems, array.slice(index));
        hv.$ = newArray;
    };
    ArrayScope.prototype.remove = function (hv, index, length) {
        var array = hv.$;
        if (index < 0) {
            index = array.length + index;
        }
        var newArray = [].concat(array.slice(0, index), array.slice(index + length));
        hv.$ = newArray;
    };
    ArrayScope.prototype.sort = function (hv, sortFn) {
        return this.auto(function () {
            var array = hv.$.slice();
            array.sort(sortFn);
            return array;
        });
    };
    return ArrayScope;
}(exports.Base));
exports.ArrayScope = ArrayScope;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
function assignProps(dstObj, srcObj) {
    Object.getOwnPropertyNames(srcObj).forEach(function (name) {
        dstObj[name] = srcObj[name];
    });
}
function getPrototypeChain(baseProto) {
    var res = [];
    while (true) {
        var proto = Object.getPrototypeOf(baseProto);
        if (!proto || proto === Object.prototype) {
            break;
        }
        res.push(proto);
        baseProto = proto;
    }
    res.reverse();
    return res;
}
function mix(baseClass, mixClass) {
    console.log('mix called');
    var NewClass = /** @class */ (function (_super) {
        __extends(NewClass, _super);
        function NewClass() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _super.apply(this, args) || this;
        }
        return NewClass;
    }(baseClass));
    [baseClass, mixClass].forEach(function (baseCtor) {
        var protos = [baseCtor.prototype].concat(getPrototypeChain(baseCtor.prototype));
        protos.forEach(function (proto) { return assignProps(NewClass.prototype, proto); });
    });
    return NewClass;
}
exports.mix = mix;
function mixSome() {
    var classes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        classes[_i] = arguments[_i];
    }
    var result = classes[0];
    classes.slice(1).forEach(function (ctor) {
        result = mix(result, ctor);
    });
    return result;
}
exports.mixSome = mixSome;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(8);
var base_1 = __webpack_require__(2);
var HvAsync = /** @class */ (function (_super) {
    __extends(HvAsync, _super);
    function HvAsync(hs, params) {
        var _this = _super.call(this, params.initial) || this;
        _this.state = new core_1.HyperValue('resolved');
        _this.callId = 0;
        _this.hs = hs;
        _this.getter = params.get;
        if (params.set && params.update) {
            throw new Error('both set and update cannot be defined');
        }
        if (params.update) {
            _this.setter = params.update;
        }
        if (params.set) {
            _this.setter = function (value) {
                var setter = params.set;
                return setter(value).then(function () { return value; });
            };
        }
        _this.initPromise();
        _this.init();
        return _this;
    }
    HvAsync.prototype.initPromise = function () {
        var _this = this;
        this.currentPromise = new Promise(function (resolve, reject) {
            _this.resolver = resolve;
            _this.rejecter = reject;
        });
    };
    HvAsync.prototype.fetch = function (fn) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.callId++;
            var id = _this.callId;
            _this.state.$ = 'pending';
            fn().then(function (value) {
                if (_this.callId === id) {
                    _super.prototype.s.call(_this, value);
                    _this.state.$ = 'resolved';
                    _this.resolver();
                    _this.initPromise();
                }
                resolve(value);
            }, function (error) {
                if (_this.callId === id) {
                    _this.state.$ = 'rejected';
                    _this.rejecter(error);
                    _this.initPromise();
                    _this.hs.fail(_this, error);
                }
                reject(error);
            });
        });
    };
    HvAsync.prototype.wait = function () {
        var _this = this;
        return this.currentPromise.then(function () { return _this; });
    };
    HvAsync.prototype.init = function () {
        var _this = this;
        if (!this.getter) {
            return;
        }
        var depList = [];
        var watchDeps = function (hvIdList) {
            return hvIdList.map(function (hvId) {
                return {
                    hvId: hvId,
                    watcherId: _this.hs.watch(hvId, watcher)
                };
            });
        };
        var watcher = function () {
            for (var _i = 0, depList_1 = depList; _i < depList_1.length; _i++) {
                var dep = depList_1[_i];
                _this.hs.unwatch(dep.hvId, dep.watcherId);
            }
            core_1.recordAsync(function (w) {
                var getter = _this.getter;
                return _this.fetch(function () { return getter(w); });
            }, function (deps) {
                depList = depList.concat(watchDeps(deps.map(function (hv) { return hv.id; })));
            })
                .catch(function () {
                depList = watchDeps(depList.map(function (dep) { return dep.hvId; }));
            });
        };
        watcher();
    };
    HvAsync.prototype.s = function (newValue) {
        var _this = this;
        if (!this.setter) {
            _super.prototype.s.call(this, newValue);
            return;
        }
        this.fetch(function () {
            return _this.setter(newValue);
        }).then(function (value) {
            _super.prototype.s.call(_this, value);
        });
    };
    return HvAsync;
}(core_1.HyperValue));
exports.HvAsync = HvAsync;
var AsyncScope = /** @class */ (function (_super) {
    __extends(AsyncScope, _super);
    function AsyncScope() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AsyncScope.prototype.async = function (params) {
        return new HvAsync(this, params);
    };
    return AsyncScope;
}(base_1.BaseScope));
exports.AsyncScope = AsyncScope;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var proxy_1 = __webpack_require__(10);
var ObjectScope = /** @class */ (function (_super) {
    __extends(ObjectScope, _super);
    function ObjectScope() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObjectScope.prototype.prop = function (hv, propertyName) {
        return this.proxy(hv, function () { return hv.$[propertyName]; }, function (value) {
            return __assign({}, hv.$, (_a = {}, _a[propertyName] = value, _a));
            var _a;
        });
    };
    ObjectScope.prototype.setProp = function (hv, propertyName, value) {
        var obj = hv.$;
        obj[propertyName] = value;
        hv.$ = obj;
    };
    ObjectScope.prototype.getProp = function (hv, propertyName) {
        return hv.$[propertyName];
    };
    return ObjectScope;
}(proxy_1.ProxyScope));
exports.ObjectScope = ObjectScope;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var hv_1 = __webpack_require__(1);
var debug_1 = __webpack_require__(11);
var abstract_1 = __webpack_require__(0);
var common_1 = __webpack_require__(7);
var zone_1 = __webpack_require__(22);
var hash_1 = __webpack_require__(3);
exports.componentTable = [];
function injectId(id) {
    return function (attrs) {
        if (!('id' in attrs)) {
            return attrs;
        }
        var newAttrs = __assign({}, attrs, { 'data-hv-id': id + ':' + attrs.id });
        // todo consider me
        // delete newAttrs.id;
        return newAttrs;
    };
}
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    // domEe: DomEventEmitter;
    function Component(props, children) {
        var _this = _super.call(this) || this;
        _this.renderHs = new hv_1.scopes.FullScope();
        _this.hs = new hv_1.scopes.FullScope();
        _this.children = common_1.normalizeNodeSet(_this.hs, children);
        _this.props = props;
        _this.id = exports.componentTable.length;
        exports.componentTable.push(_this);
        _this.hash = hash_1.hashBlock({
            type: 'component',
            props: hash_1.hashDict(props),
            children: _this.children.map(function (child) { return child.hash; })
        });
        return _this;
        // this.domEe = new DomEventEmitter();
    }
    Component.prototype.init = function () { };
    Component.prototype.free = function () {
        this.hs.free();
        this.children.forEach(function (child) { return child.free(); });
    };
    Component.prototype.mockHs = function (fn) {
        this.renderHs.free();
        this.renderHs = new hv_1.scopes.FullScope();
        var hsBackup = this.hs;
        this.hs = this.renderHs;
        var result = fn();
        this.hs = hsBackup;
        return result;
    };
    Component.prototype.targetRender = function (meta) {
        var _this = this;
        this.init();
        var t = meta.target;
        var domHv = this.hs.auto(function () {
            return _this.mockHs(function () { return _this.render(); });
        });
        var domZone = new zone_1.HyperZone(domHv);
        this.targetNodes = domZone.targetRender(__assign({}, meta, { mapAttrs: injectId(this.id) }));
        for (var _i = 0, _a = this.targetNodes; _i < _a.length; _i++) {
            var elem = _a[_i];
            t.setData(meta.targetMeta, elem, {
                compId: this.id
            });
        }
        return this.targetNodes;
    };
    Component.prototype.merge = function (meta, newComp) {
        return newComp;
    };
    Component.hvComponent = true;
    __decorate([
        debug_1.renderDebug
    ], Component.prototype, "targetRender", null);
    return Component;
}(abstract_1.AbstractElement));
exports.Component = Component;
function isComponentClass(fn) {
    return fn.hvComponent === true;
}
exports.isComponentClass = isComponentClass;
function closestComponent(targetMeta, target, node) {
    var found = target.closest(targetMeta, node, function (node) {
        var data = target.getData(targetMeta, node);
        return data.compId !== undefined;
    });
    if (!found) {
        return null;
    }
    var id = target.getData(targetMeta, found).compId;
    return exports.componentTable[Number(id)];
}
exports.closestComponent = closestComponent;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var hv_1 = __webpack_require__(1);
var common_1 = __webpack_require__(7);
var abstract_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(12);
var debug_1 = __webpack_require__(11);
var merge_1 = __webpack_require__(23);
var hash_1 = __webpack_require__(3);
var HyperZone = /** @class */ (function (_super) {
    __extends(HyperZone, _super);
    function HyperZone(content) {
        var _this = _super.call(this) || this;
        _this.hs = new hv_1.scopes.FullScope();
        _this.content = _this.hs.proxy(content, function (content) { return common_1.normalizeNodeSet(_this.hs, content); });
        _this.hash = hash_1.hashBlock({
            type: 'HyperZone',
            content: hash_1.hash(content)
        });
        return _this;
    }
    HyperZone.prototype.getTargetNodes = function (meta, elems, needRender) {
        return utils_1.flatArray(elems.map(function (elem) {
            return needRender
                ? elem.targetRender(meta)
                : elem.targetNodes;
        }));
    };
    HyperZone.prototype.mergeChildren = function (meta, newElems, oldElems) {
        merge_1.mergeChildren(meta, oldElems, newElems);
    };
    HyperZone.prototype.targetRender = function (meta) {
        // const t = meta.target;
        var _this = this;
        this.hs.watch(this.content, function (newElems, oldElems) {
            _this.mergeChildren(meta, newElems, oldElems);
            // const oldContent = this.getTargetNodes(meta, oldElems, false);
            // let i = oldElems.length;
            // while (i--) {
            //     oldElems[i].free();
            // }
            // const newContent = this.getTargetNodes(meta, newElems, true);
            // t.replaceSequence(meta.targetMeta, oldContent, newContent);
        });
        this.targetNodes = this.getTargetNodes(meta, this.content.g(), true);
        return this.targetNodes;
    };
    HyperZone.prototype.free = function () {
        this.hs.free();
        this.content.$.forEach(function (child) { return child.free(); });
    };
    HyperZone.prototype.merge = function (meta, newZone) {
        if (this.hash === newZone.hash) {
            return this;
        }
        return newZone;
    };
    __decorate([
        debug_1.renderDebug
    ], HyperZone.prototype, "getTargetNodes", null);
    return HyperZone;
}(abstract_1.AbstractElement));
exports.HyperZone = HyperZone;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(12);
function mergeChildren(meta, oldChildren, newChildren) {
    var preparedChildren = newChildren.map(function (newChild, index) {
        var oldChild = oldChildren[index];
        if (!oldChild) {
            return newChild;
        }
        if (oldChild.constructor !== newChild.constructor) {
            return newChild;
        }
        return oldChild.merge(meta, newChild);
    });
    var _a = [oldChildren, preparedChildren].map(function (children) {
        return utils_1.flatArray(children.map(function (child) { return child.targetNodes || child.targetRender(meta); }));
    }), oldNodes = _a[0], newNodes = _a[1];
    meta.target.replaceSequence(meta.targetMeta, oldNodes, newNodes);
    return preparedChildren;
}
exports.mergeChildren = mergeChildren;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var hv_1 = __webpack_require__(1);
var hash_1 = __webpack_require__(3);
var merge_1 = __webpack_require__(23);
var common_1 = __webpack_require__(7);
var abstract_1 = __webpack_require__(0);
var refProps = {};
var HyperElm = /** @class */ (function (_super) {
    __extends(HyperElm, _super);
    function HyperElm(tagName, props, children) {
        var _this = _super.call(this) || this;
        _this.hs = new hv_1.scopes.FullScope();
        _this.propHv = null;
        _this.tagName = tagName;
        _this.props = props || {};
        _this.children = common_1.normalizeNodeSet(_this.hs, children);
        _this.childrenHash = hash_1.stringify(hash_1.hashArray(_this.children.map(function (child) { return child.hash; })));
        _this.propHash = hash_1.stringify(hash_1.hashDict(props));
        _this.hash = hash_1.hashBlock({
            type: 'element',
            tagName: tagName,
            attrs: _this.propHash,
            children: _this.childrenHash
        });
        return _this;
    }
    HyperElm.prototype.initAttrs = function (meta) {
        var _this = this;
        this.propHv = new hv_1.HyperValue({});
        this.hs.watch(this.propHv, function (newAttrs, oldAttrs) {
            var diff = {};
            for (var name in newAttrs) {
                diff[name] = newAttrs[name];
            }
            for (var name in oldAttrs) {
                if (!(name in newAttrs)) {
                    diff[name] = null;
                }
            }
            for (var name in diff) {
                if (name in refProps) {
                    continue;
                }
                meta.target.setProp(meta.targetMeta, _this.targetNode, name, diff[name]);
            }
            for (var name in diff) {
                if (name in refProps) {
                    refProps[name]({
                        name: name,
                        value: diff[name],
                        hs: _this.hs,
                        owner: _this
                    });
                }
            }
        });
        this.hs.bind(this.propHv, function () {
            var propObj = {};
            for (var name in _this.props) {
                propObj[name] = _this.hs.read(_this.props[name]);
            }
            return propObj;
        });
    };
    HyperElm.prototype.setChildren = function (meta, nestedMeta) {
        var t = meta.target;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var elems = child.targetRender(meta);
            for (var _b = 0, elems_1 = elems; _b < elems_1.length; _b++) {
                var elem = elems_1[_b];
                t.append(meta.targetMeta, nestedMeta.targetMeta, this.targetNode, elem);
            }
        }
    };
    HyperElm.prototype.mergeProps = function (meta, newProps) {
        if (!this.propHv) {
            throw new Error('merge before render');
        }
        this.propHv.$ = newProps;
    };
    HyperElm.prototype.merge = function (meta, newElem) {
        if (newElem.hash === this.hash) {
            newElem.targetNodes = this.targetNodes;
            newElem.props = this.props;
            newElem.children = this.children;
            return newElem;
        }
        if (newElem.tagName !== this.tagName) {
            return newElem;
        }
        newElem.targetNode = this.targetNode;
        newElem.targetNodes = this.targetNodes;
        newElem.propHv = this.propHv;
        if (newElem.propHash !== this.propHash) {
            this.mergeProps(meta, newElem.props);
        }
        if (newElem.childrenHash !== this.childrenHash) {
            merge_1.mergeChildren(meta, this.children, newElem.children);
        }
        return newElem;
    };
    HyperElm.prototype.targetRender = function (meta) {
        var t = meta.target;
        var _a = t.create(meta.targetMeta, this.tagName), elem = _a[0], selfTargetMeta = _a[1], nestedTargetMeta = _a[2];
        var nestedMeta = __assign({}, meta, { targetMeta: nestedTargetMeta });
        var selfMeta = __assign({}, meta, { targetMeta: selfTargetMeta });
        this.targetNode = elem;
        this.initAttrs(selfMeta);
        this.setChildren(selfMeta, nestedMeta);
        if (this.ref) {
            this.ref(this);
        }
        this.targetNodes = [this.targetNode];
        return this.targetNodes;
    };
    HyperElm.prototype.free = function () {
        this.hs.free();
        this.children.forEach(function (child) { return child.free(); });
    };
    return HyperElm;
}(abstract_1.AbstractElement));
exports.HyperElm = HyperElm;
function registerGlobalProp(matcher, handler) {
    refProps[matcher] = handler;
}
exports.registerGlobalProp = registerGlobalProp;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var hv_1 = __webpack_require__(1);
var hv_jsx_1 = __webpack_require__(6);
var hv_dom_1 = __webpack_require__(39);
var keyCodes = {
    enter: 13,
    escape: 27
};
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.items = new hv_1.HyperValue([]);
        _this.newTodo = new hv_1.HyperValue(_this.createTodo());
        _this.display = _this.hs.auto(function () { return _this.items.$.length > 0 ? 'block' : 'none'; });
        _this.selectedFilter = new hv_1.HyperValue('all');
        _this.showedItems = _this.hs.filter(_this.items, function (item) {
            switch (_this.selectedFilter.$) {
                case 'all': return true;
                case 'active': return !item.completed.$;
                case 'complited': return item.completed.$;
            }
        });
        _this.handleKeyUp = function (e) {
            var input = e.target;
            var text = input.value.trim();
            _this.newTodo.$.text.$ = text;
            if (e.which !== keyCodes.enter || !text) {
                return;
            }
            _this.pushTodo();
        };
        return _this;
    }
    App.prototype.createTodo = function () {
        return {
            text: new hv_1.HyperValue(''),
            completed: new hv_1.HyperValue(false),
            editing: new hv_1.HyperValue(false)
        };
    };
    App.prototype.pushTodo = function () {
        this.hs.insert(this.items, Infinity, this.newTodo.$);
        this.newTodo.$ = this.createTodo();
    };
    App.prototype.removeTodo = function (id) {
        this.hs.remove(this.items, id, 1);
    };
    App.prototype.render = function () {
        var _this = this;
        return [
            hv_jsx_1.jsx("section", { id: "todoapp" },
                hv_jsx_1.jsx("header", { id: "header" },
                    hv_jsx_1.jsx("h1", null, "todos"),
                    hv_jsx_1.jsx("input", { id: "new-todo", placeholder: "What needs to be done?", autofocus: true, value: this.hs.auto(function () { return _this.newTodo.$.text.$; }), onKeyUp: this.handleKeyUp })),
                hv_jsx_1.jsx("section", { id: "main", style: { display: this.display } },
                    hv_jsx_1.jsx("input", { id: "toggle-all", type: "checkbox" }),
                    hv_jsx_1.jsx("label", { for: "toggle-all" }, "Mark all as complete"),
                    hv_jsx_1.jsx("ul", { id: "todo-list" }, this.hs.map(this.showedItems, function (item, index) {
                        return hv_jsx_1.jsx(TodoItemView, { completed: item.completed, title: item.text, onRemove: function () { return _this.removeTodo(index); } });
                    }))),
                hv_jsx_1.jsx("footer", { id: "footer", style: { display: this.display } },
                    hv_jsx_1.jsx(Footer, { selectedFilter: this.selectedFilter, activeTodoCount: this.hs.length(this.hs.filter(this.items, function (item) { return !item.completed.$; })), completedTodos: this.hs.some(this.items, function (item) { return item.completed.$; }) }))),
            hv_jsx_1.jsx("footer", { id: "info" },
                hv_jsx_1.jsx("p", null, "Double-click to edit a todo"),
                hv_jsx_1.jsx("p", null,
                    "Created by ",
                    hv_jsx_1.jsx("a", { href: "http://sindresorhus.com" }, "Sindre Sorhus")),
                hv_jsx_1.jsx("p", null,
                    "Part of ",
                    hv_jsx_1.jsx("a", { href: "http://todomvc.com" }, "TodoMVC")))
        ];
    };
    return App;
}(hv_jsx_1.Component));
var TodoItemView = /** @class */ (function (_super) {
    __extends(TodoItemView, _super);
    function TodoItemView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.toggle = function () {
            _this.props.completed.$ = !_this.props.completed.$;
        };
        return _this;
    }
    TodoItemView.prototype.render = function () {
        var _this = this;
        return hv_jsx_1.jsx("li", { class: this.hs.auto(function () { return _this.props.completed.$ ? 'completed' : ''; }), "data-id": "{{id}}" },
            hv_jsx_1.jsx("div", { class: "view" },
                hv_jsx_1.jsx("input", { class: "toggle", type: "checkbox", checked: this.hs.auto(function () { return _this.props.completed.$; }), onChange: this.toggle }),
                hv_jsx_1.jsx("label", null, this.props.title),
                hv_jsx_1.jsx("button", { class: "destroy", onClick: function () { return _this.props.onRemove(); } })),
            hv_jsx_1.jsx("input", { class: "edit", value: this.props.title }));
    };
    return TodoItemView;
}(hv_jsx_1.Component));
var Footer = /** @class */ (function (_super) {
    __extends(Footer, _super);
    function Footer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getClass = function (type) {
            return _this.hs.auto(function () { return _this.props.selectedFilter.$ === type ? 'selected' : ''; });
        };
        _this.getOnClick = function (type) {
            return function (e) {
                e.preventDefault();
                _this.props.selectedFilter.$ = type;
            };
        };
        return _this;
    }
    Footer.prototype.render = function () {
        var _this = this;
        return [
            // <span id="todo-count"><strong>{this.props.activeTodoCount}}</strong> {this.props.activeTodoWord} left</span>
            hv_jsx_1.jsx("span", { id: "todo-count" },
                hv_jsx_1.jsx("strong", null, this.props.activeTodoCount),
                " todos left"),
            hv_jsx_1.jsx("ul", { id: "filters" },
                hv_jsx_1.jsx("li", null,
                    hv_jsx_1.jsx("a", { class: this.getClass('all'), onClick: this.getOnClick('all') }, "All")),
                hv_jsx_1.jsx("li", null,
                    hv_jsx_1.jsx("a", { class: this.getClass('active'), onClick: this.getOnClick('active') }, "Active")),
                hv_jsx_1.jsx("li", null,
                    hv_jsx_1.jsx("a", { class: this.getClass('complited'), onClick: this.getOnClick('complited') }, "Complited"))),
            this.hs.auto(function () { return _this.props.completedTodos.$ && hv_jsx_1.jsx("button", { id: "clear-completed" }, "Clear completed"); })
        ];
    };
    return Footer;
}(hv_jsx_1.Component));
hv_dom_1.renderIn(document.body, {}, hv_jsx_1.jsx(App, null));


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var List = /** @class */ (function () {
    function List() {
        this.items = {};
        this.currentId = 0;
    }
    List.prototype.add = function (item) {
        var id = this.currentId;
        this.currentId++;
        this.items[id] = item;
        return id;
    };
    List.prototype.del = function (id) {
        delete this.items[id];
    };
    List.prototype.get = function (id) {
        return this.items[id];
    };
    List.prototype.set = function (id, value) {
        this.items[id] = value;
    };
    List.prototype.entries = function () {
        var _this = this;
        return Object.keys(this.items).map(function (key) {
            var id = Number(key);
            return [id, _this.items[id]];
        });
    };
    return List;
}());
exports.List = List;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __webpack_require__(4);
function scopeDebug(target) {
    return /** @class */ (function (_super) {
        __extends(BaseScope, _super);
        function BaseScope() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._debug = new Error('');
            _this._watcherCount = 0;
            return _this;
        }
        BaseScope.prototype.watch = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._watcherCount++;
            if (this._watcherCount > 100) {
                _1.report(this, "scope watchers over limit: " + this._watcherCount + " ws");
            }
            return _super.prototype.watch.apply(this, args);
        };
        BaseScope.prototype.unwatch = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._watcherCount--;
            return _super.prototype.unwatch.apply(this, args);
        };
        return BaseScope;
    }(target));
}
exports.scopeDebug = scopeDebug;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var debug_tools_1 = __webpack_require__(29);
var currentDepth = 0;
var history = [];
function pipeLog(hv, fn) {
    history.push({
        depth: currentDepth,
        hv: hv,
        state: 'pend'
    });
    currentDepth++;
    var result = fn();
    currentDepth--;
    history.push({
        depth: currentDepth,
        hv: hv,
        state: 'done'
    });
    return result;
}
function hvDebug(target) {
    return /** @class */ (function (_super) {
        __extends(HyperValue, _super);
        function HyperValue() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._debug = new Error('');
            return _this;
        }
        // _name = getName(this._debug.stack || '');
        HyperValue.prototype.s = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return pipeLog(this, function () {
                return _super.prototype.s.apply(_this, args);
            });
        };
        return HyperValue;
    }(target));
}
exports.hvDebug = hvDebug;
var glob = typeof global !== 'undefined'
    ? global
    : window;
exports.tracer = new debug_tools_1.Tracer();
glob.tracer = exports.tracer;
glob.createReportIframe = debug_tools_1.createReportIframe;
exports.traceHv = exports.tracer.traceMethod(function (hv) { return String(hv.id); });
glob.getHvHistory = function () {
    return 'log:\n' + history.map(function (item) {
        var sign = item.state === 'done' ? '\\' : '/';
        // const name = getName((item.hv as any)._debug.stack);
        var name = item.hv.id;
        return '|   '.repeat(item.depth) + (sign + ": " + name);
    }).join('\n');
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = __webpack_require__(30);
exports.Tracer = debug_1.Tracer;
var report_1 = __webpack_require__(32);
exports.createReportIframe = report_1.createReportIframe;
exports.genReport = report_1.genReport;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(31);
var Tracer = /** @class */ (function () {
    function Tracer() {
        var _this = this;
        this.history = [];
        this.callStack = {
            name: 'root',
            children: [],
            parent: null,
            time: NaN,
            data: null,
            totalChildren: 0
        };
        this.traceMethod = function (getName) { return function (target, key, descriptor) {
            if (descriptor === undefined) {
                descriptor = Object.getOwnPropertyDescriptor(target, key);
            }
            var originalMethod = descriptor.value;
            var self = _this;
            descriptor.value = function () {
                var _this = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return self.logCall(getName(this), function () { return originalMethod.apply(_this, args); });
            };
            return descriptor;
        }; };
    }
    Tracer.prototype.logCall = function (name, fn) {
        var subInfo = {
            name: name,
            children: [],
            parent: this.callStack,
            time: NaN,
            data: null,
            totalChildren: 0
        };
        if (this.callStack === null) {
            throw new Error('render stack failed');
        }
        this.callStack.children.push(subInfo);
        this.callStack.totalChildren++;
        this.callStack = subInfo;
        var startTime = utils_1.now();
        var result = fn();
        var endTime = utils_1.now();
        // childrenRendered++;
        this.callStack.time = endTime - startTime;
        this.callStack = this.callStack.parent;
        if (this.callStack === null) {
            throw new Error('render stack failed');
        }
        this.callStack.totalChildren += subInfo.totalChildren;
        if (this.callStack.parent === null) {
            // console.log('children rendered:', childrenRendered);
            // childrenRendered = 0;
            this.history.push(this.callStack.children[0]);
            //this.callStack.report = genReport(this.callStack);
            //console.log(this.callStack);
            this.callStack = {
                name: 'root',
                children: [],
                parent: null,
                time: NaN,
                data: null,
                totalChildren: 0
            };
        }
        return result;
    };
    return Tracer;
}());
exports.Tracer = Tracer;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.now = (typeof window === 'undefined' || typeof window.performance === 'undefined')
    ? function () { return Date.now(); }
    : function () { return performance.now(); };


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flameChart_1 = __webpack_require__(33);
function genReport(renderStack) {
    var name = renderStack.name;
    var value = isNaN(renderStack.time)
        ? (renderStack.children || []).reduce(function (total, cur) { return total + cur.time; }, 0)
        : renderStack.time;
    if (!renderStack.children || renderStack.children.length <= 0) {
        return { name: name, value: value };
    }
    var children = renderStack.children.map(genReport);
    return { name: name, value: value, children: children };
}
exports.genReport = genReport;
function createReportIframe(window, data) {
    var json = JSON.stringify(genReport(data));
    var code = "<html>\n        <head>\n        </head>\n        <body>\n            <div id=\"chart\"></div>\n            <script type=\"text/javascript\" id=\"flame\"></script>\n            <script type=\"text/javascript\" id=\"app\">\n\n            </script>\n        </body>\n    </html>";
    var ifr = window.document.createElement('iframe');
    ifr.setAttribute('width', '100%');
    ifr.setAttribute('height', '1000px');
    window.document.body.appendChild(ifr);
    ifr.contentDocument.write(code);
    var flame = ifr.contentDocument.createElement('script');
    flame.textContent = flameChart_1.default;
    ifr.contentDocument.body.appendChild(flame);
    var app = ifr.contentDocument.createElement('script');
    app.textContent = "\n        var data = " + json + ";\n\n        const flame = new FlameChart({height: 300, width: 500});\n        flame.setData(data);\n        flame.render(document.body);\n    ";
    ifr.contentDocument.body.appendChild(app);
}
exports.createReportIframe = createReportIframe;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = "!function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,\"a\",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p=\"\",e(e.s=1)}([function(t,e,n){\"use strict\";function r(t,e,n){void 0===e&&(e={}),void 0===n&&(n=[]);var r=t.split(\":\").reverse(),o=r[0],s=r[1],a=\"svg\"===s?document.createElementNS(\"http://www.w3.org/2000/svg\",o):document.createElement(o);return i(a,e),n.forEach(function(t){return\"string\"==typeof t?a.appendChild(document.createTextNode(t)):a.appendChild(t)}),a}function i(t,e){for(var n in e)t.setAttribute(n,String(e[n]))}Object.defineProperty(e,\"__esModule\",{value:!0}),e.h=r,e.setAttrs=i;document.head.appendChild(r(\"style\",{},[\"\\n    svg {\\n        transform-origin: top left;\\n    }\\n\\n    g:hover rect {\\n        fill-opacity: 1;\\n    }\\n\\n    rect {\\n        cursor: pointer;\\n        transform-origin: top left;\\n        /*fill: #aea;*/\\n        fill-opacity: 0.5;\\n        stroke: #8b8;\\n        fill-opacity: 0.7;\\n        stroke-width: 0.5;\\n        transition: width,x .5s ease-in-out;\\n        rx: 2;\\n        ry: 2;\\n    }\\n\\n    div {\\n        width: 500px;\\n        overflow-x: scroll;\\n        overflow-y: hidden;\\n    }\\n\\n    text {\\n        cursor: pointer;\\n        font-size: 10px;\\n        font-family: monospace;\\n    }\\n\\n    g{\\n        transition: transform .5s ease-in-out;\\n    }\\n\"]))},function(t,e,n){\"use strict\";Object.defineProperty(e,\"__esModule\",{value:!0});var r=n(2);window.FlameChart=r.FlameChart},function(t,e,n){\"use strict\";Object.defineProperty(e,\"__esModule\",{value:!0});var r=n(0),i=n(3),o=i.measureFontWidth(),s=0,a=function(){function t(t,e,n,r,i,o){this.id=s++,this.x=t,this.y=e,this.w=n,this.value=r,this.color=o,this.text=i+\"[\"+r+\"]\"}return t.prototype.mount=function(){return this.rect=r.h(\"svg:rect\",{height:10,y:this.y,x:0,fill:this.color}),this.textElem=r.h(\"svg:text\",{y:this.y+7,x:o},[this.text]),this.g=r.h(\"svg:g\",{\"data-id\":this.id},[this.rect,this.textElem]),this.g},t.prototype.update=function(t,e){var n=this.w*t,s=i.sliceText(this.text,Math.floor(n/o)-2);r.setAttrs(this.rect,{width:n}),this.g.style.transform=\"translateX(\"+(this.x*t+e)+\"px)\",this.textElem.textContent=s},t.prototype.render=function(){return this.mount(),this.update(1,0),this.g},t}();e.Block=a;var u=function(){function t(e){var n=this;this.blocks=[],this.focusBlock=function(t){var e=n.data.value/t.value,r=-t.x;n.setViewpoert(e,r)},this.onClick=function(t,e){n.focusBlock(e)},this.config=e;var r=0;this.mapColor=e.mapColor||t.makeColorMapper(function(t){return t.name},function(){return t.getNextHue(1,.5,r++)})}return t.makeColorMapper=function(t,e){var n={};return function(r){var i=t(r),o=n[i];return o||(o=e(i),n[i]=o),o}},t.getNextHue=function(t,e,n){var r=i.getN(360,n),o=[t,e].map(function(t){return Math.round(100*t)+\"%\"});return\"hsl(\"+[r,o[0],o[1]].join(\", \")+\")\"},t.prototype.setData=function(t){t.children&&t.children.length>1&&(t={name:\"root\",value:t.children.reduce(function(t,e){return t+e.value},0),children:[t]}),this.data=t},t.prototype.setViewpoert=function(t,e){var n=t<4?t:4,r=this.config.width*n;this.svg.setAttribute(\"width\",String(r));var i=this.config.width/2*(n-1),o=e*t+i;this.blocks.forEach(function(e){return e.update(t,o)}),this.div.scrollLeft=i},t.prototype.render=function(t){var e=this;this.svg=r.h(\"svg:svg\",{width:this.config.width,height:this.config.height}),this.div=r.h(\"div\",{},[this.svg]);var n=this.config.width/this.data.value,i=function(t,r,o){for(var s=r,u=t.children||[],c=0,h=u;c<h.length;c++){var l=h[c],d=s,f=l.value*n;s+=f;var v=e.mapColor(l),p=new a(d,o,f,l.value,l.name,v);e.svg.appendChild(p.render()),e.blocks.push(p),i(l,d,o+12)}};i(this.data,0,0);var o=function(t,n){var r=n.getAttribute(\"data-id\");if(!r){var i=n.parentElement;if(!i)return;return void o(t,i)}var s=e.blocks[parseInt(r)];e.onClick(t,s)};this.div.addEventListener(\"click\",function(t){var e=t.target;o(t,e)}),t.appendChild(this.div)},t}();e.FlameChart=u},function(t,e,n){\"use strict\";function r(t,e){return e<3?\"\":t.length>e?t.slice(0,e-1)+\"…\":t}function i(){var t=s.h(\"svg:text\",{opacity:0},[\"w\"]),e=s.h(\"svg:svg\",{},[t]);document.body.appendChild(e);var n=t.getBoundingClientRect().width;return e.remove(),n}function o(t,e){for(var n=0;e>0;)t/=2,n+=e%2*t,e=Math.floor(e/2);return n}Object.defineProperty(e,\"__esModule\",{value:!0});var s=n(0);e.sliceText=r,e.measureFontWidth=i,e.getN=o}]);\n//# sourceMappingURL=bundle.js.map";


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = __webpack_require__(2);
exports.BaseScope = base_1.BaseScope;
var auto_1 = __webpack_require__(5);
exports.AutoScope = auto_1.AutoScope;
var array_1 = __webpack_require__(17);
exports.ArrayScope = array_1.ArrayScope;
var async_1 = __webpack_require__(19);
exports.AsyncScope = async_1.AsyncScope;
var cast_1 = __webpack_require__(9);
exports.CastScope = cast_1.CastScope;
var full_1 = __webpack_require__(35);
exports.FullScope = full_1.FullScope;
var object_1 = __webpack_require__(20);
exports.ObjectScope = object_1.ObjectScope;
var proxy_1 = __webpack_require__(10);
exports.ProxyScope = proxy_1.ProxyScope;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mixin_1 = __webpack_require__(18);
var base_1 = __webpack_require__(2);
var auto_1 = __webpack_require__(5);
var array_1 = __webpack_require__(17);
var async_1 = __webpack_require__(19);
var cast_1 = __webpack_require__(9);
var object_1 = __webpack_require__(20);
var proxy_1 = __webpack_require__(10);
exports.FullScope = mixin_1.mixSome(base_1.BaseScope, auto_1.AutoScope, array_1.ArrayScope, async_1.AsyncScope, cast_1.CastScope, object_1.ObjectScope, proxy_1.ProxyScope);


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_1 = __webpack_require__(0);
var hash_1 = __webpack_require__(3);
var StringElm = /** @class */ (function (_super) {
    __extends(StringElm, _super);
    function StringElm(text) {
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.hash = hash_1.hashBlock({
            type: 'text',
            text: text
        });
        return _this;
    }
    StringElm.prototype.targetRender = function (meta) {
        var t = meta.target;
        this.targetNodes = [t.createTextNode(meta.targetMeta, this.text)];
        return this.targetNodes;
    };
    StringElm.prototype.merge = function (meta, newString) {
        return newString;
    };
    return StringElm;
}(abstract_1.AbstractElement));
exports.StringElm = StringElm;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_1 = __webpack_require__(0);
var hash_1 = __webpack_require__(3);
var PlaceholderElm = /** @class */ (function (_super) {
    __extends(PlaceholderElm, _super);
    function PlaceholderElm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hash = hash_1.hashBlock({
            type: 'placeholder'
        });
        return _this;
    }
    PlaceholderElm.prototype.targetRender = function (meta) {
        var t = meta.target;
        this.targetNodes = [t.createPlaceholder(meta.targetMeta)];
        return this.targetNodes;
    };
    PlaceholderElm.prototype.merge = function (meta, newPlaceholder) {
        return newPlaceholder;
    };
    return PlaceholderElm;
}(abstract_1.AbstractElement));
exports.PlaceholderElm = PlaceholderElm;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var element_1 = __webpack_require__(24);
var component_1 = __webpack_require__(21);
function jsx(what, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    if (props === null) {
        props = {};
    }
    if (typeof what === 'string') {
        return new element_1.HyperElm(what, props, children);
    }
    if (component_1.isComponentClass(what)) {
        var ComponentClass = what;
        return new ComponentClass(props, children);
    }
    var fc = what;
    return jsx.apply(void 0, [/** @class */ (function (_super) {
            __extends(FC, _super);
            function FC() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            FC.prototype.render = function () {
                return fc(this.props, this.children);
            };
            return FC;
        }(component_1.Component)), props].concat(children));
}
exports.jsx = jsx;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var hv_jsx_1 = __webpack_require__(6);
__webpack_require__(40);
__webpack_require__(41);
var domHelpers_1 = __webpack_require__(42);
exports.dom = {
    append: domHelpers_1.append,
    closest: domHelpers_1.closest,
    create: domHelpers_1.create,
    createPlaceholder: domHelpers_1.createPlaceholder,
    createTextNode: domHelpers_1.createTextNode,
    getData: domHelpers_1.getData,
    // remove,
    replaceSequence: domHelpers_1.replaceSequence,
    replace: domHelpers_1.replace,
    setData: domHelpers_1.setData,
    setProp: domHelpers_1.setProp
};
exports.defaultTargetMeta = {
    ns: 'html'
};
function renderDom(jsx, params) {
    if (params === void 0) { params = {}; }
    var contextMeta = {
        target: hv_jsx_1.debugTargetProxy(exports.dom),
        targetMeta: exports.defaultTargetMeta
    };
    return hv_jsx_1.targetRenderChildren(contextMeta, jsx);
}
exports.renderDom = renderDom;
function renderIn(where, params, jsx) {
    where.innerHTML = '';
    var content = renderDom(jsx, params);
    domHelpers_1.appendSequence(exports.defaultTargetMeta, exports.defaultTargetMeta, where, content);
}
exports.renderIn = renderIn;
function closestComponent(elem) {
    return hv_jsx_1.closestComponent(exports.defaultTargetMeta, exports.dom, elem);
}
exports.closestComponent = closestComponent;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var hv_jsx_1 = __webpack_require__(6);
var eventNames = [
    // Clipboard Events
    'onCopy',
    'onCopyCapture',
    'onCut',
    'onCutCapture',
    'onPaste',
    'onPasteCapture',
    // Composition Events
    'onCompositionEnd',
    'onCompositionEndCapture',
    'onCompositionStart',
    'onCompositionStartCapture',
    'onCompositionUpdate',
    'onCompositionUpdateCapture',
    // Focus Events
    'onFocus',
    'onFocusCapture',
    'onBlur',
    'onBlurCapture',
    // Form Events
    'onChange',
    'onChangeCapture',
    'onInput',
    'onInputCapture',
    'onReset',
    'onResetCapture',
    'onSubmit',
    'onSubmitCapture',
    'onInvalid',
    'onInvalidCapture',
    // Image Events
    'onLoad',
    'onLoadCapture',
    'onError',
    'onErrorCapture',
    // Keyboard Events
    'onKeyDown',
    'onKeyDownCapture',
    'onKeyPress',
    'onKeyPressCapture',
    'onKeyUp',
    'onKeyUpCapture',
    // Media Events
    'onAbort',
    'onAbortCapture',
    'onCanPlay',
    'onCanPlayCapture',
    'onCanPlayThrough',
    'onCanPlayThroughCapture',
    'onDurationChange',
    'onDurationChangeCapture',
    'onEmptied',
    'onEmptiedCapture',
    'onEncrypted',
    'onEncryptedCapture',
    'onEnded',
    'onEndedCapture',
    'onLoadedData',
    'onLoadedDataCapture',
    'onLoadedMetadata',
    'onLoadedMetadataCapture',
    'onLoadStart',
    'onLoadStartCapture',
    'onPause',
    'onPauseCapture',
    'onPlay',
    'onPlayCapture',
    'onPlaying',
    'onPlayingCapture',
    'onProgress',
    'onProgressCapture',
    'onRateChange',
    'onRateChangeCapture',
    'onSeeked',
    'onSeekedCapture',
    'onSeeking',
    'onSeekingCapture',
    'onStalled',
    'onStalledCapture',
    'onSuspend',
    'onSuspendCapture',
    'onTimeUpdate',
    'onTimeUpdateCapture',
    'onVolumeChange',
    'onVolumeChangeCapture',
    'onWaiting',
    'onWaitingCapture',
    // MouseEvents
    'onClick',
    'onClickCapture',
    'onContextMenu',
    'onContextMenuCapture',
    'onDoubleClick',
    'onDoubleClickCapture',
    'onDrag',
    'onDragCapture',
    'onDragEnd',
    'onDragEndCapture',
    'onDragEnter',
    'onDragEnterCapture',
    'onDragExit',
    'onDragExitCapture',
    'onDragLeave',
    'onDragLeaveCapture',
    'onDragOver',
    'onDragOverCapture',
    'onDragStart',
    'onDragStartCapture',
    'onDrop',
    'onDropCapture',
    'onMouseDown',
    'onMouseDownCapture',
    'onMouseEnter',
    'onMouseLeave',
    'onMouseMove',
    'onMouseMoveCapture',
    'onMouseOut',
    'onMouseOutCapture',
    'onMouseOver',
    'onMouseOverCapture',
    'onMouseUp',
    'onMouseUpCapture',
    // Selection Events
    'onSelect',
    'onSelectCapture',
    // Touch Events
    'onTouchCancel',
    'onTouchCancelCapture',
    'onTouchEnd',
    'onTouchEndCapture',
    'onTouchMove',
    'onTouchMoveCapture',
    'onTouchStart',
    'onTouchStartCapture',
    // UI Events
    'onScroll',
    'onScrollCapture',
    // Wheel Events
    'onWheel',
    'onWheelCapture',
    // Animation Events
    'onAnimationStart',
    'onAnimationStartCapture',
    'onAnimationEnd',
    'onAnimationEndCapture',
    'onAnimationIteration',
    'onAnimationIterationCapture',
    // Transition Events
    'onTransitionEnd',
    'onTransitionEndCapture',
];
eventNames.forEach(function (event) {
    hv_jsx_1.registerGlobalProp(event, function (_a) {
        var owner = _a.owner, hs = _a.hs, name = _a.name, value = _a.value;
        var elem = owner.targetNode;
        elem[name.toLowerCase()] = value;
    });
});


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// import {HyperValue} from 'hv';
// import {HyperElm} from './blocks/element';
Object.defineProperty(exports, "__esModule", { value: true });
var hv_jsx_1 = __webpack_require__(6);
hv_jsx_1.registerGlobalProp('style', function (_a) {
    var owner = _a.owner, hs = _a.hs, name = _a.name, value = _a.value;
    var elem = owner.targetNode;
    var styleHv = hs.cast(value);
    hs.auto(function () {
        var styles = styleHv.$;
        for (var name_1 in styles) {
            var value_1 = styles[name_1];
            if (value_1 === undefined) {
                continue;
            }
            elem.style[name_1] = hs.read(value_1);
        }
    });
});


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var nsTable = {
    html: 'http://www.w3.org/1999/xhtml',
    svg: 'http://www.w3.org/2000/svg'
};
function append(meta, parentMeta, parent, elm) {
    if (elm === null || parent === null) {
        return;
    }
    parent.appendChild(elm);
}
exports.append = append;
function appendSequence(meta, parentMeta, parent, elems) {
    if (elems.length <= 0 || parent === null) {
        return;
    }
    for (var _i = 0, elems_1 = elems; _i < elems_1.length; _i++) {
        var elem = elems_1[_i];
        if (!elem) {
            throw new Error('empty child');
        }
        parent.appendChild(elem);
    }
}
exports.appendSequence = appendSequence;
function closest(meta, from, matcher) {
    var elem = from;
    while (elem) {
        if (matcher(elem)) {
            return elem;
        }
        elem = elem.parentElement;
    }
    return null;
}
exports.closest = closest;
function create(meta, tagName) {
    var _a = guessNs(tagName, meta.ns), childNs = _a.childNs, selfNs = _a.selfNs;
    var elem = document.createElementNS(nsTable[selfNs], tagName);
    var nestedMeta = __assign({}, meta, { ns: childNs });
    var selfMeta = __assign({}, meta, { ns: selfNs });
    return [elem, selfMeta, nestedMeta];
}
exports.create = create;
function createPlaceholder(meta) {
    var elem = meta.ns === 'html'
        ? document.createElementNS(nsTable.html, 'script')
        : document.createElementNS(nsTable.svg, 'g');
    return elem;
}
exports.createPlaceholder = createPlaceholder;
function createTextNode(meta, text) {
    return document.createTextNode(text);
}
exports.createTextNode = createTextNode;
function getData(meta, elem) {
    if (!elem) {
        return {};
    }
    return elem.dataset;
}
exports.getData = getData;
function remove(meta, elem) {
    if (!elem) {
        throw new Error('empty child');
    }
    var parent = elem.parentElement;
    if (!parent) {
        throw new Error('not mounted');
    }
    parent.removeChild(elem);
}
exports.remove = remove;
function replace(meta, oldElem, newElm) {
    if (!oldElem) {
        return;
    }
    if (!newElm) {
        oldElem.remove();
    }
    var parent = oldElem.parentElement;
    if (!parent) {
        throw new Error('cannot replace dom');
    }
    parent.replaceChild(newElm, oldElem);
}
exports.replace = replace;
function replaceSequence(meta, oldElems, newElms) {
    var lastOld = oldElems[oldElems.length - 1];
    if (!lastOld) {
        throw new Error('no placeholder');
    }
    var parent = lastOld.parentElement;
    var nextSibling = lastOld.nextSibling;
    if (!parent) {
        throw new Error('no parent');
    }
    for (var _i = 0, oldElems_1 = oldElems; _i < oldElems_1.length; _i++) {
        var elem = oldElems_1[_i];
        remove(meta, elem);
    }
    for (var _a = 0, newElms_1 = newElms; _a < newElms_1.length; _a++) {
        var elem = newElms_1[_a];
        if (!elem) {
            throw new Error('empty child');
        }
        if (nextSibling) {
            parent.insertBefore(elem, nextSibling);
        }
        else {
            parent.appendChild(elem);
        }
    }
}
exports.replaceSequence = replaceSequence;
function setData(meta, elem, value) {
    if (!elem) {
        return;
    }
    var dataset = elem.dataset;
    for (var name_1 in value) {
        dataset[name_1] = value[name_1];
    }
}
exports.setData = setData;
function setProp(meta, elem, name, value) {
    if (!elem || elem instanceof Text) {
        throw new Error('cannot set property of null');
    }
    if (meta.ns === 'html' && name in elem) {
        elem[name] = value;
        return;
    }
    elem.setAttribute(name, value);
}
exports.setProp = setProp;
function guessNs(tagName, currentNs) {
    if (tagName === 'svg') {
        return {
            selfNs: 'svg',
            childNs: 'svg'
        };
    }
    if (tagName === 'foreignObject') {
        return {
            selfNs: 'svg',
            childNs: 'html'
        };
    }
    return {
        selfNs: currentNs,
        childNs: currentNs
    };
}


/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map