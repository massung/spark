var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var spark;
(function (spark) {
    var loadQueue;
    spark.project = {
        title: 'Untitled',
        author: 'Someone',
        date: 'Today',
        version: 1.0,
        path: '/',
        assetRelativePath: '',
        assets: {},
    };
    function main(canvasId, width, height) {
        spark.canvas = document.getElementById(canvasId);
        if (!spark.canvas) {
            return false;
        }
        width = width || spark.canvas.width;
        height = height || width * spark.canvas.height / spark.canvas.width;
        spark.canvas.width = width;
        spark.canvas.height = height;
        spark.hideCursor();
        spark.canvas.oncontextmenu = function (event) {
            event.preventDefault();
        };
        spark.view = spark.canvas.getContext('2d');
        loadQueue = [];
        return true;
    }
    spark.main = main;
    function launch(projectFile, onload) {
        new JSONAsset(projectFile, function (json) {
            spark.enableMouse();
            spark.enableKeyboard();
            spark.initAudio();
            spark.project.path = projectFile.split('/').slice(0, -1).join('/') + '/';
            spark.merge(spark.project, json);
            for (var id in spark.project.assets) {
                var cls = spark.project.assets[id].class;
                var src = spark.project.assets[id].source;
                var ctor = assetCtor(cls);
                var path = spark.project.path + spark.project.assetRelativePath + src;
                spark.project.assets[id] = new ctor(path);
            }
        });
        load(onload);
    }
    spark.launch = launch;
    function assetCtor(path) {
        var ctor = window;
        path.split('.').forEach(function (name) {
            if ((ctor = ctor[name]) === undefined) {
                throw 'Unknown asset class constructor: "' + path + '"';
            }
        });
        if (typeof (ctor.constructor) !== 'function') {
            throw 'Not an asset class constructor: "' + path + '"';
        }
        return ctor;
    }
    spark.assetCtor = assetCtor;
    function load(onload) {
        if (loadProgress() === true) {
            onload(spark.project);
        }
        else {
            window.requestAnimationFrame(function (now) {
                var x = spark.canvas.width / 2;
                var y = spark.canvas.height / 2;
                var w = x * 3 / 5;
                spark.view.save();
                spark.view.setTransform(1, 0, 0, 1, 0, 0);
                spark.view.clearRect(0, 0, spark.canvas.width, spark.canvas.height);
                spark.view.strokeStyle = '#fff';
                spark.view.shadowBlur = 10;
                spark.view.shadowOffsetX = 0;
                spark.view.shadowOffsetY = 0;
                spark.view.shadowColor = '#fff';
                spark.view.font = 'bold 10px "Courier", sans-serif';
                spark.view.fillStyle = '#fff';
                spark.view.fillText('Loading...', 10, spark.canvas.height - 10);
                spark.view.beginPath();
                spark.view.moveTo(x - w, y);
                spark.view.lineTo(x - w + w * 2 * spark.loadProgress(), y);
                spark.view.stroke();
                spark.view.restore();
                load(onload);
            });
        }
    }
    spark.load = load;
    function loadProgress() {
        var n = 0;
        for (var i = 0; i < loadQueue.length; i++) {
            if (loadQueue[i].data)
                n++;
        }
        return (n === loadQueue.length) ? true : n / loadQueue.length;
    }
    spark.loadProgress = loadProgress;
    var Asset = (function () {
        function Asset(src) {
            this.source = src;
            this.data = null;
            loadQueue.push(this);
        }
        return Asset;
    })();
    spark.Asset = Asset;
    var XHRAsset = (function (_super) {
        __extends(XHRAsset, _super);
        function XHRAsset(src, resType, onload) {
            var req = new XMLHttpRequest();
            req.onreadystatechange = (function () {
                if (req.readyState === 4) {
                    if (req.status >= 200 && req.status <= 299) {
                        onload(req);
                        this.data = this.data || req;
                    }
                }
            }).bind(this);
            _super.call(this, src);
            req.responseType = resType;
            req.open('GET', src, true);
            req.send();
        }
        return XHRAsset;
    })(Asset);
    spark.XHRAsset = XHRAsset;
    var XMLAsset = (function (_super) {
        __extends(XMLAsset, _super);
        function XMLAsset(src, onload) {
            _super.call(this, src, 'document', function (req) {
                onload(req.response);
            });
        }
        return XMLAsset;
    })(XHRAsset);
    spark.XMLAsset = XMLAsset;
    var JSONAsset = (function (_super) {
        __extends(JSONAsset, _super);
        function JSONAsset(src, onload) {
            _super.call(this, src, 'json', function (req) {
                onload(req.response);
            });
        }
        return JSONAsset;
    })(XHRAsset);
    spark.JSONAsset = JSONAsset;
})(spark || (spark = {}));
var spark;
(function (spark) {
    function getDevice() {
        return window['cordova'] ? window['cordova'].platformId : 'browser';
    }
    spark.getDevice = getDevice;
    function isMobile() {
        return getDevice() !== 'browser';
    }
    spark.isMobile = isMobile;
    function getWidth() {
        return isMobile() ? screen.width : window.innerWidth;
    }
    spark.getWidth = getWidth;
    function getHeight() {
        return isMobile() ? screen.height : window.innerHeight;
    }
    spark.getHeight = getHeight;
})(spark || (spark = {}));
var spark;
(function (spark) {
    var keys = [];
    var buttons = [];
    spark.x = 0;
    spark.y = 0;
    spark.relativeX = 0;
    spark.relativeY = 0;
    function hideCursor() {
        spark.canvas.style.cursor = 'none';
    }
    spark.hideCursor = hideCursor;
    function showCursor(image) {
        spark.canvas.style.cursor = image || 'pointer';
    }
    spark.showCursor = showCursor;
    function enableMouse() {
        window.addEventListener('mousedown', onMouseDown, false);
        window.addEventListener('mouseup', onMouseUp, false);
        window.addEventListener('mousemove', onMouseMove, false);
    }
    spark.enableMouse = enableMouse;
    function enableKeyboard() {
        window.addEventListener('keydown', onKeyDown, false);
        window.addEventListener('keyup', onKeyUp, false);
    }
    spark.enableKeyboard = enableKeyboard;
    function flushInput() {
        var flushState = function (state) { if (state)
            state.hits = 0; };
        keys.forEach(flushState);
        buttons.forEach(flushState);
        spark.relativeX = 0;
        spark.relativeY = 0;
    }
    spark.flushInput = flushInput;
    function keyDown(key) {
        var state = keys[key];
        if (state) {
            return state.down;
        }
        return false;
    }
    spark.keyDown = keyDown;
    function keyHits(key) {
        var state = keys[key];
        if (state) {
            return state.hits;
        }
        return 0;
    }
    spark.keyHits = keyHits;
    function keyHit(key) {
        return keyHits(key) > 0;
    }
    spark.keyHit = keyHit;
    function mouseDown(button) {
        var state = buttons[button];
        if (state) {
            return state.down;
        }
        return false;
    }
    spark.mouseDown = mouseDown;
    ;
    function mouseHits(button) {
        var state = buttons[button];
        if (state) {
            return state.hits;
        }
        return 0;
    }
    spark.mouseHits = mouseHits;
    ;
    function mouseHit(button) {
        return mouseHits(button) > 0;
    }
    spark.mouseHit = mouseHit;
    ;
    (function (Button) {
        Button[Button["LEFT"] = 0] = "LEFT";
        Button[Button["MIDDLE"] = 1] = "MIDDLE";
        Button[Button["RIGHT"] = 2] = "RIGHT";
    })(spark.Button || (spark.Button = {}));
    var Button = spark.Button;
    (function (Key) {
        Key[Key["BACKSPACE"] = 8] = "BACKSPACE";
        Key[Key["TAB"] = 9] = "TAB";
        Key[Key["ENTER"] = 13] = "ENTER";
        Key[Key["PAUSE"] = 19] = "PAUSE";
        Key[Key["CAPS"] = 20] = "CAPS";
        Key[Key["ESC"] = 27] = "ESC";
        Key[Key["SPACE"] = 32] = "SPACE";
        Key[Key["PAGE_UP"] = 33] = "PAGE_UP";
        Key[Key["PAGE_DOWN"] = 34] = "PAGE_DOWN";
        Key[Key["END"] = 35] = "END";
        Key[Key["HOME"] = 36] = "HOME";
        Key[Key["LEFT"] = 37] = "LEFT";
        Key[Key["UP"] = 38] = "UP";
        Key[Key["RIGHT"] = 39] = "RIGHT";
        Key[Key["DOWN"] = 40] = "DOWN";
        Key[Key["INSERT"] = 45] = "INSERT";
        Key[Key["DELETE"] = 46] = "DELETE";
        Key[Key["_0"] = 48] = "_0";
        Key[Key["_1"] = 49] = "_1";
        Key[Key["_2"] = 50] = "_2";
        Key[Key["_3"] = 51] = "_3";
        Key[Key["_4"] = 52] = "_4";
        Key[Key["_5"] = 53] = "_5";
        Key[Key["_6"] = 54] = "_6";
        Key[Key["_7"] = 55] = "_7";
        Key[Key["_8"] = 56] = "_8";
        Key[Key["_9"] = 57] = "_9";
        Key[Key["A"] = 65] = "A";
        Key[Key["B"] = 66] = "B";
        Key[Key["C"] = 67] = "C";
        Key[Key["D"] = 68] = "D";
        Key[Key["E"] = 69] = "E";
        Key[Key["F"] = 70] = "F";
        Key[Key["G"] = 71] = "G";
        Key[Key["H"] = 72] = "H";
        Key[Key["I"] = 73] = "I";
        Key[Key["J"] = 74] = "J";
        Key[Key["K"] = 75] = "K";
        Key[Key["L"] = 76] = "L";
        Key[Key["M"] = 77] = "M";
        Key[Key["N"] = 78] = "N";
        Key[Key["O"] = 79] = "O";
        Key[Key["P"] = 80] = "P";
        Key[Key["Q"] = 81] = "Q";
        Key[Key["R"] = 82] = "R";
        Key[Key["S"] = 83] = "S";
        Key[Key["T"] = 84] = "T";
        Key[Key["U"] = 85] = "U";
        Key[Key["V"] = 86] = "V";
        Key[Key["W"] = 87] = "W";
        Key[Key["X"] = 88] = "X";
        Key[Key["Y"] = 89] = "Y";
        Key[Key["Z"] = 90] = "Z";
        Key[Key["NUMPAD_0"] = 96] = "NUMPAD_0";
        Key[Key["NUMPAD_1"] = 97] = "NUMPAD_1";
        Key[Key["NUMPAD_2"] = 98] = "NUMPAD_2";
        Key[Key["NUMPAD_3"] = 99] = "NUMPAD_3";
        Key[Key["NUMPAD_4"] = 100] = "NUMPAD_4";
        Key[Key["NUMPAD_5"] = 101] = "NUMPAD_5";
        Key[Key["NUMPAD_6"] = 102] = "NUMPAD_6";
        Key[Key["NUMPAD_7"] = 103] = "NUMPAD_7";
        Key[Key["NUMPAD_8"] = 104] = "NUMPAD_8";
        Key[Key["NUMPAD_9"] = 105] = "NUMPAD_9";
        Key[Key["MULTIPLY"] = 106] = "MULTIPLY";
        Key[Key["ADD"] = 107] = "ADD";
        Key[Key["SUBSTRACT"] = 109] = "SUBSTRACT";
        Key[Key["DECIMAL"] = 110] = "DECIMAL";
        Key[Key["DIVIDE"] = 111] = "DIVIDE";
        Key[Key["F1"] = 112] = "F1";
        Key[Key["F2"] = 113] = "F2";
        Key[Key["F3"] = 114] = "F3";
        Key[Key["F4"] = 115] = "F4";
        Key[Key["F5"] = 116] = "F5";
        Key[Key["F6"] = 117] = "F6";
        Key[Key["F7"] = 118] = "F7";
        Key[Key["F8"] = 119] = "F8";
        Key[Key["F9"] = 120] = "F9";
        Key[Key["F10"] = 121] = "F10";
        Key[Key["F11"] = 122] = "F11";
        Key[Key["F12"] = 123] = "F12";
        Key[Key["SHIFT"] = 16] = "SHIFT";
        Key[Key["CTRL"] = 17] = "CTRL";
        Key[Key["ALT"] = 18] = "ALT";
        Key[Key["PLUS"] = 187] = "PLUS";
        Key[Key["COMMA"] = 188] = "COMMA";
        Key[Key["MINUS"] = 189] = "MINUS";
        Key[Key["PERIOD"] = 190] = "PERIOD";
    })(spark.Key || (spark.Key = {}));
    var Key = spark.Key;
    function onKeyDown(event) {
        var state = keys[event.keyCode];
        if (state) {
            state.down = true;
            state.hits++;
        }
        else {
            keys[event.keyCode] = {
                down: true,
                hits: 1,
            };
        }
    }
    function onKeyUp(event) {
        var state = keys[event.keyCode];
        if (state) {
            state.down = false;
        }
    }
    function onMouseDown(event) {
        var state = buttons[event.button];
        if (state) {
            state.down = true;
            state.hits++;
        }
        else {
            buttons[event.button] = {
                down: true,
                hits: 1,
            };
        }
    }
    function onMouseUp(event) {
        var state = buttons[event.button];
        if (state) {
            state.down = false;
        }
    }
    function onMouseMove(event) {
        var eventX = event.clientX - spark.canvas.offsetLeft;
        var eventY = event.clientY - spark.canvas.offsetTop;
        spark.relativeX += eventX - spark.x;
        spark.relativeY += eventY - spark.y;
        spark.x = eventX;
        spark.y = eventY;
    }
})(spark || (spark = {}));
var spark;
(function (spark) {
    function merge(a, b) {
        for (var k in b) {
            if (b.hasOwnProperty(k)) {
                var v = b[k];
                if (typeof (v) === 'object' && typeof (a[k]) === 'object') {
                    merge(a[k], v);
                }
                else {
                    a[k] = v;
                }
            }
        }
    }
    spark.merge = merge;
    function wipe(obj) {
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                delete obj[k];
            }
        }
    }
    spark.wipe = wipe;
    function degToRad(r) {
        return r * Math.PI / 180.0;
    }
    spark.degToRad = degToRad;
    function radToDeg(r) {
        return r * 180.0 / Math.PI;
    }
    spark.radToDeg = radToDeg;
    function signum(n) {
        if (Math.abs(n) < 0.00001) {
            return 0;
        }
        return (n > 0) ? 1 : -1;
    }
    spark.signum = signum;
    function nextPow2(n) {
        return Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)));
    }
    spark.nextPow2 = nextPow2;
    function clamp(n, min, max) {
        return Math.max(min, Math.min(n, max));
    }
    spark.clamp = clamp;
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }
    spark.rand = rand;
    function irand(min, max) {
        return Math.floor(rand(min, max));
    }
    spark.irand = irand;
    function arand(array) {
        return array[irand(0, array.length)];
    }
    spark.arand = arand;
    function lerp(p, q, k, max) {
        return p + (q - p) * k / (max || 1);
    }
    spark.lerp = lerp;
})(spark || (spark = {}));
var spark;
(function (spark) {
    var Vec = (function () {
        function Vec(x, y) {
            this.x = x;
            this.y = y;
        }
        Vec.prototype.set = function (x, y) {
            this.x = x;
            this.y = y;
        };
        Vec.prototype.add = function (v) {
            return new Vec(this.x + v.x, this.y + v.y);
        };
        Vec.prototype.sub = function (v) {
            return new Vec(this.x - v.x, this.y - v.y);
        };
        Vec.prototype.mult = function (v) {
            return new Vec(this.x * v.x, this.y * v.y);
        };
        Vec.prototype.imult = function (v) {
            return new Vec(this.x / v.x, this.y / v.y);
        };
        Vec.prototype.scale = function (s) {
            return new Vec(this.x * s, this.y * s);
        };
        Vec.prototype.neg = function () {
            return new Vec(-this.x, -this.y);
        };
        Vec.prototype.inv = function () {
            return new Vec(1 / this.x, 1 / this.y);
        };
        Vec.prototype.dot = function (v) {
            return (this.x * v.x) + (this.y * v.y);
        };
        Vec.prototype.cross = function (v) {
            return (this.x * v.y) - (this.y * v.x);
        };
        Vec.prototype.magsq = function () {
            return (this.x * this.x) + (this.y * this.y);
        };
        Vec.prototype.mag = function () {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        };
        Vec.prototype.distsq = function (v) {
            var dx = this.x - v.x;
            var dy = this.y - v.y;
            return (dx * dx) + (dy * dy);
        };
        Vec.prototype.dist = function (v) {
            return Math.sqrt(this.magsq());
        };
        Vec.prototype.norm = function () {
            return this.scale(1.0 / this.mag());
        };
        Vec.prototype.lerp = function (v, k) {
            return new Vec(this.x + (v.x - this.x) * k, this.y + (v.y - this.y) * k);
        };
        Vec.prototype.proj = function (p, q) {
            var a = this.sub(p);
            var b = q.sub(p);
            var k = a.dot(b);
            var d = b.magsq();
            if (d < 0.00001) {
                return b;
            }
            else {
                var s = k / d;
                if (s < 0.0)
                    return p;
                if (s > 1.0)
                    return q;
                return p.lerp(q, s);
            }
        };
        Vec.prototype.perp = function () {
            return new Vec(this.y, -this.x);
        };
        Vec.prototype.rperp = function () {
            return new Vec(-this.y, this.x);
        };
        Vec.prototype.rotate = function (r) {
            return new Vec((this.x * r.x) + (this.y * r.y), (this.y * r.x) - (this.x * r.y));
        };
        Vec.prototype.unrotate = function (r) {
            return new Vec((this.x * r.x) - (this.y * r.y), (this.y * r.x) + (this.x * r.y));
        };
        Vec.ZERO = new Vec(0, 0);
        Vec.ONE = new Vec(1, 1);
        Vec.RIGHT = new Vec(1, 0);
        Vec.UP = new Vec(0, 1);
        return Vec;
    })();
    spark.Vec = Vec;
})(spark || (spark = {}));
var spark;
(function (spark) {
    var Rect = (function () {
        function Rect(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
        }
        Rect.prototype.contains = function (x, y) {
            return (x >= this.x && x <= this.x + this.width) &&
                (y >= this.y && y <= this.y + this.height);
        };
        Object.defineProperty(Rect.prototype, "left", {
            get: function () {
                return this.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "top", {
            get: function () {
                return this.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "right", {
            get: function () {
                return this.x + this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "bottom", {
            get: function () {
                return this.y + this.height;
            },
            enumerable: true,
            configurable: true
        });
        return Rect;
    })();
    spark.Rect = Rect;
})(spark || (spark = {}));
var spark;
(function (spark) {
    var Mat = (function () {
        function Mat(x, y, rx, ry, sx, sy) {
            this.p = new spark.Vec(x, y);
            this.r = new spark.Vec(rx, ry);
            this.s = new spark.Vec(sx, sy);
        }
        Object.defineProperty(Mat.prototype, "angle", {
            get: function () {
                return spark.radToDeg(Math.atan2(this.r.y, this.r.x));
            },
            set: function (r) {
                this.r.x = Math.cos(spark.degToRad(r));
                this.r.y = Math.sin(spark.degToRad(r));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat.prototype, "inverse", {
            get: function () {
                return new Mat(-this.p.x, -this.p.y, this.r.x, -this.r.y, 1 / this.s.x, 1 / this.s.y);
            },
            enumerable: true,
            configurable: true
        });
        Mat.prototype.translate = function (x, y, local) {
            var dx = x;
            var dy = y;
            if (local) {
                dx = (x * this.r.x) + (y * this.r.y);
                dy = (y * this.r.x) - (x * this.r.y);
            }
            this.p.x += dx;
            this.p.y += dy;
        };
        Mat.prototype.rotate = function (r) {
            var x = Math.cos(spark.degToRad(r));
            var y = Math.sin(spark.degToRad(r));
            this.r.set((this.r.x * x) + (this.r.y * y), (this.r.y * x) - (this.r.x * y));
        };
        Mat.prototype.scale = function (x, y) {
            this.s.x *= (x || 1.0);
            this.s.y *= (y || x || 1.0);
        };
        Mat.prototype.transform = function (v) {
            return new spark.Vec((v.x * this.s.x * this.r.x) + (v.y * this.s.y * this.r.y), (v.y * this.s.y * this.r.x) - (v.x * this.s.x * this.r.y));
        };
        Mat.prototype.mult = function (m) {
            var p = this.transform(m.p);
            var r = this.r.rotate(m.r);
            var s = this.s.mult(m.s);
            return new Mat(p.x, p.y, r.x, r.y, s.x, s.y);
        };
        Mat.prototype.apply = function () {
            var a = this.r.x * this.s.x;
            var b = this.r.y * this.s.y;
            var c = this.r.y * this.s.x;
            var d = this.r.x * this.s.y;
            var e = this.p.x;
            var f = this.p.y;
            spark.view.transform(a, -b, c, d, e, f);
        };
        Mat.IDENTITY = new Mat(0, 0, 1, 0, 1, 1);
        return Mat;
    })();
    spark.Mat = Mat;
})(spark || (spark = {}));
var spark;
(function (spark) {
    var Quadtree = (function () {
        function Quadtree(rect, depth) {
            this.rect = rect;
            this.shapes = [];
            this.nodes = [];
            this.depth = depth || 0;
        }
        Quadtree.prototype.addShape = function (shape) {
            var i;
            if (this.depth > 0 && !shape.within(this.rect)) {
                return false;
            }
            for (i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].addShape(shape)) {
                    return true;
                }
            }
            this.shapes.push(shape);
            if (this.depth < Quadtree.DEPTH_LIMIT && this.shapes.length >= Quadtree.SHAPE_LIMIT && this.nodes.length === 0) {
                var w = this.rect.width / 2;
                var h = this.rect.height / 2;
                var l = this.rect.left;
                var t = this.rect.top;
                this.nodes = [
                    new Quadtree(new spark.Rect(l, t, w, h), this.depth + 1),
                    new Quadtree(new spark.Rect(l + w, t, w, h), this.depth + 1),
                    new Quadtree(new spark.Rect(l, t + h, w, h), this.depth + 1),
                    new Quadtree(new spark.Rect(l + w, t + h, w, h), this.depth + 1),
                ];
                this.shapes = this.shapes.filter((function (shape) {
                    for (var i = 0; i < this.nodes.length; i++) {
                        if (this.nodes[i].addShape(shape)) {
                            return false;
                        }
                    }
                    return true;
                }).bind(this));
            }
            return true;
        };
        Quadtree.prototype.collect = function (shape) {
            if (this.depth > 0 && !shape.within(this.rect)) {
                return [];
            }
            var i, m = [];
            for (i = 0; i < this.shapes.length; i++) {
                var s = this.shapes[i];
                if (m.indexOf(s.collider) < 0 && shapeQuery(s, shape)) {
                    m.push(s.collider);
                }
            }
            for (i = 0; i < this.nodes.length; i++) {
                m.concat(this.nodes[i].collect(shape));
            }
            return m;
        };
        Quadtree.prototype.processCollisions = function () {
            var nodes = [this];
            var contacts = [];
            while (nodes.length > 0) {
                var node = nodes.pop();
                for (var i = 0; i < node.shapes.length; i++) {
                    var a = node.shapes[i];
                    var m = [];
                    for (var j = i + 1; j < node.shapes.length; j++) {
                        var b = node.shapes[j];
                        if (a.collider !== b.collider && m.indexOf(b.collider) < 0 && shapeQuery(a, b)) {
                            m.push(b.collider);
                        }
                    }
                    var children = node.nodes.concat([]);
                    while (children.length > 0) {
                        var child = children.pop();
                        for (var k = 0; k < child.shapes.length; k++) {
                            var b = child.shapes[k];
                            if (a.collider !== b.collider && m.indexOf(b.collider) < 0 && shapeQuery(a, b)) {
                                m.push(b.collider);
                            }
                        }
                        if (child.nodes.length > 0) {
                            children = children.concat(child.nodes);
                        }
                    }
                    if (m.length > 0) {
                        contacts.push([a.collider, m]);
                    }
                }
                nodes = nodes.concat(node.nodes);
            }
            for (var i = 0; i < contacts.length; i++) {
                var ca = contacts[i][0];
                var cm = contacts[i][1];
                for (var j = 0; j < m.length; j++) {
                    ca.collide(cm[j]);
                    cm[j].collide(ca);
                }
            }
        };
        Quadtree.DEPTH_LIMIT = 3;
        Quadtree.SHAPE_LIMIT = 8;
        return Quadtree;
    })();
    spark.Quadtree = Quadtree;
    var Collider = (function () {
        function Collider() {
            this.filter = null;
            this.oncollision = null;
            this.shapes = [];
        }
        Collider.prototype.updateShapes = function (m) {
            for (var i = 0; i < this.shapes.length; i++) {
                this.shapes[i].updateShapeCache(m);
            }
        };
        Collider.prototype.addToQuadtree = function (space) {
            for (var i = 0; i < this.shapes.length; i++) {
                space.addShape(this.shapes[i]);
            }
        };
        Collider.prototype.addSegment = function (x1, y1, x2, y2) {
            this.shapes.push(new Segment(this, x1, y1, x2, y2));
        };
        Collider.prototype.addCircle = function (x, y, radius) {
            this.shapes.push(new Circle(this, x, y, radius));
        };
        Collider.prototype.addBox = function (x, y, width, height) {
            this.shapes.push(new Box(this, x, y, width, height));
        };
        Collider.prototype.collide = function (c) {
            if (this.oncollision) {
                this.oncollision(this, c);
            }
        };
        return Collider;
    })();
    spark.Collider = Collider;
    function shapeQuery(a, b) {
        if (b instanceof Segment)
            return a.segmentQuery(b);
        if (b instanceof Circle)
            return a.circleQuery(b);
        if (b instanceof Box)
            return a.boxQuery(b);
        return false;
    }
    spark.shapeQuery = shapeQuery;
    var Segment = (function () {
        function Segment(collider, x1, y1, x2, y2) {
            this.collider = collider;
            this.p1 = new spark.Vec(x1, y1);
            this.p2 = new spark.Vec(x2, y2);
        }
        Segment.prototype.updateShapeCache = function (m) {
            this.tp1 = m.transform(this.p1);
            this.tp2 = m.transform(this.p2);
        };
        Segment.prototype.within = function (rect) {
            return rect.contains(this.tp1.x, this.tp1.y) &&
                rect.contains(this.tp2.x, this.tp2.y);
        };
        Segment.prototype.segmentQuery = function (s) {
            if (Math.min(s.tp1.x, s.tp2.x) > Math.max(this.tp1.x, this.tp2.x) ||
                Math.min(s.tp1.y, s.tp2.y) > Math.max(this.tp1.y, this.tp2.y) ||
                Math.max(s.tp1.x, s.tp2.x) < Math.min(this.tp1.x, this.tp2.x) ||
                Math.max(s.tp1.y, s.tp2.y) < Math.min(this.tp1.y, this.tp2.y)) {
                return false;
            }
            var sa = spark.signum(this.tp1.cross(s.tp1));
            var sb = spark.signum(this.tp1.cross(s.tp2));
            if (sa === sb && sa !== 0 && sb !== 0) {
                return false;
            }
            var da = spark.signum(s.tp1.cross(this.tp1));
            var db = spark.signum(s.tp1.cross(this.tp2));
            if (da === db && da !== 0 && db !== 0) {
                return false;
            }
            return true;
        };
        Segment.prototype.circleQuery = function (s) {
            return s.tc.proj(this.tp1, this.tp2).distsq(s.tc) < s.r * s.r;
        };
        Segment.prototype.boxQuery = function (s) {
            if (this.tp1.x < s.tp1.x && this.tp2.x < s.tp1.x)
                return false;
            if (this.tp1.x > s.tp2.x && this.tp2.x > s.tp2.x)
                return false;
            if (this.tp1.y < s.tp1.y && this.tp2.y < s.tp1.y)
                return false;
            if (this.tp1.y > s.tp2.y && this.tp2.y > s.tp2.y)
                return false;
            return true;
        };
        return Segment;
    })();
    spark.Segment = Segment;
    var Circle = (function () {
        function Circle(collider, x, y, radius) {
            this.collider = collider;
            this.c = new spark.Vec(x, y);
            this.r = radius;
        }
        Circle.prototype.updateShapeCache = function (m) {
            this.tc = m.transform(this.c);
        };
        Circle.prototype.within = function (rect) {
            if (this.tc.x + this.r < rect.left)
                return false;
            if (this.tc.x - this.r > rect.right)
                return false;
            if (this.tc.y + this.r < rect.top)
                return false;
            if (this.tc.y - this.r > rect.bottom)
                return false;
            return true;
        };
        Circle.prototype.segmentQuery = function (s) {
            return s.circleQuery(this);
        };
        Circle.prototype.circleQuery = function (s) {
            return this.tc.distsq(s.tc) < (this.r * this.r) + (s.r * s.r);
        };
        Circle.prototype.boxQuery = function (s) {
            if (this.tc.x > s.tp1.x && this.tc.x <= s.tp2.x) {
                return this.tc.y + this.r >= s.tp1.y && this.tc.y - this.r <= s.tp2.y;
            }
            if (this.tc.y >= s.tp1.y && this.tc.y <= s.tp2.y) {
                return this.tc.x + this.r >= s.tp1.x && this.tc.x - this.r <= s.tp2.x;
            }
            if (this.tc.x < s.tp1.x && this.tc.y < s.tp1.y) {
                return this.tc.distsq(s.tp1) <= this.r * this.r;
            }
            if (this.tc.x > s.tp2.x && this.tc.y < s.tp1.y) {
                return this.tc.distsq(new spark.Vec(s.tp2.x, s.tp1.y)) <= this.r * this.r;
            }
            if (this.tc.x < s.tp1.x && this.tc.y > s.tp2.y) {
                return this.tc.distsq(new spark.Vec(s.tp1.x, s.tp2.y)) <= this.r * this.r;
            }
            return this.tc.distsq(s.tp2) <= this.r * this.r;
        };
        return Circle;
    })();
    spark.Circle = Circle;
    var Box = (function () {
        function Box(collider, x, y, width, height) {
            this.collider = collider;
            this.p1 = new spark.Vec(x, y);
            this.p2 = new spark.Vec(x + width, y);
            this.p3 = new spark.Vec(x + width, y + height);
            this.p4 = new spark.Vec(x, y + height);
        }
        Box.prototype.updateShapeCache = function (m) {
            var v1 = m.transform(this.p1);
            var v2 = m.transform(this.p2);
            var v3 = m.transform(this.p3);
            var v4 = m.transform(this.p4);
            this.tp1.x = Math.min(v1.x, v2.x, v3.x, v4.x);
            this.tp1.y = Math.min(v1.y, v2.y, v3.y, v4.y);
            this.tp2.x = Math.max(v1.x, v2.x, v3.x, v4.x);
            this.tp2.y = Math.max(v1.y, v2.y, v3.y, v4.y);
        };
        Box.prototype.within = function (rect) {
            if (this.tp2.x < rect.left)
                return false;
            if (this.tp1.x > rect.right)
                return false;
            if (this.tp2.y < rect.top)
                return false;
            if (this.tp1.y > rect.bottom)
                return false;
            return true;
        };
        Box.prototype.segmentQuery = function (s) {
            return s.boxQuery(this);
        };
        Box.prototype.circleQuery = function (s) {
            return s.boxQuery(this);
        };
        Box.prototype.boxQuery = function (s) {
            if (this.tp2.x < s.tp1.x || this.tp1.x > s.tp2.x)
                return false;
            if (this.tp2.y < s.tp1.y || this.tp1.y > s.tp2.y)
                return false;
            return true;
        };
        return Box;
    })();
    spark.Box = Box;
})(spark || (spark = {}));
var spark;
(function (spark) {
    var context;
    function initAudio() {
        context = new AudioContext();
    }
    spark.initAudio = initAudio;
    var Clip = (function (_super) {
        __extends(Clip, _super);
        function Clip(src) {
            var _this = this;
            _super.call(this, src, 'arraybuffer', function (req) {
                context.decodeAudioData(req.response, function (buffer) {
                    _this.data = buffer;
                });
            });
        }
        Clip.prototype.woof = function () {
            if (!this.data) {
                return null;
            }
            var source = context.createBufferSource();
            source.buffer = this.data;
            source.connect(context.destination);
            source.start();
            return source;
        };
        Clip.prototype.play = function () {
            if (!this.data) {
                return null;
            }
            var source = context.createBufferSource();
            source.buffer = this.data;
            source.loop = true;
            source.connect(context.destination);
            source.start();
            return source;
        };
        return Clip;
    })(spark.XHRAsset);
    spark.Clip = Clip;
})(spark || (spark = {}));
var spark;
(function (spark) {
    var Texture = (function (_super) {
        __extends(Texture, _super);
        function Texture(src) {
            _super.call(this, src);
            var img = new Image();
            img.onload = (function () {
                this.data = img;
            }).bind(this);
            img.src = src;
        }
        Object.defineProperty(Texture.prototype, "width", {
            get: function () {
                return this.data ? this.data.width : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "height", {
            get: function () {
                return this.data ? this.data.height : 0;
            },
            enumerable: true,
            configurable: true
        });
        Texture.prototype.draw = function (pivot) {
            if (this.data) {
                var w = this.data.width;
                var h = this.data.height;
                var x = pivot ? -w * pivot.x : 0;
                var y = pivot ? -h * pivot.y : 0;
                spark.view.drawImage(this.data, 0, 0, w, h, x, y, w, h);
            }
        };
        Texture.prototype.drawq = function (quad, pivot) {
            if (this.data) {
                var w = quad.width;
                var h = quad.height;
                var x = pivot ? -w * pivot.x : 0;
                var y = pivot ? -h * pivot.y : 0;
                spark.view.drawImage(this.data, quad.left, quad.top, w, h, x, y, w, h);
            }
        };
        return Texture;
    })(spark.Asset);
    spark.Texture = Texture;
    var Font = (function (_super) {
        __extends(Font, _super);
        function Font(src) {
            _super.call(this, src);
            var family = src.split('/').slice(-1)[0].split('.')[0];
            var face = "@font-face{ font-family: \"" + family + "\"; src: url(\"" + src + "\"); }";
            this.data = document.createElement('style');
            this.data.appendChild(document.createTextNode(face));
            document.head.appendChild(this.data);
        }
        return Font;
    })(spark.Asset);
    spark.Font = Font;
})(spark || (spark = {}));
var spark;
(function (spark) {
    (function (Interpolation) {
        Interpolation[Interpolation["LINEAR"] = 0] = "LINEAR";
        Interpolation[Interpolation["STEP"] = 1] = "STEP";
        Interpolation[Interpolation["CUBIC"] = 2] = "CUBIC";
    })(spark.Interpolation || (spark.Interpolation = {}));
    var Interpolation = spark.Interpolation;
    var Rig = (function () {
        function Rig() {
            this.anims = [];
        }
        Rig.prototype.play = function (instance) {
            this.anims.push(instance);
        };
        Rig.prototype.stop = function (instance) {
            var i = this.anims.indexOf(instance);
            if (i >= 0) {
                var last = this.anims.pop();
                if (i < this.anims.length) {
                    this.anims[i] = last;
                }
            }
        };
        Rig.prototype.update = function (step) {
            var i;
            for (i = 0; i < this.anims.length;) {
                if (this.anims[i](step)) {
                    var last = this.anims.pop();
                    if (i < this.anims.length) {
                        this.anims[i] = last;
                    }
                }
                else {
                    i++;
                }
            }
        };
        return Rig;
    })();
    spark.Rig = Rig;
    var Tween = (function () {
        function Tween(keys, fps, duration, interp) {
            var i, k, hks, tangent;
            this.fps = fps;
            this.duration = duration;
            this.keys = new Array(duration);
            keys.sort(function (a, b) { return a.frame - b.frame; });
            for (i = 0; i < keys.length - 1 && keys[i + 1].frame < 1; i++)
                ;
            hks = keys.slice(i);
            tangent = new Array(hks.length);
            for (i = 1; i < hks.length - 1; i++) {
                if (hks[i].tangent) {
                    tangent[i] = hks[i].tangent;
                }
                else {
                    var pk = hks[i - 1];
                    var tk = hks[i];
                    var nk = hks[i + 1];
                    var dtp = (tk.value - pk.value) / (tk.frame - pk.frame);
                    var dtn = (nk.value - tk.value) / (nk.frame - tk.frame);
                    tangent[i] = (dtp + dtn) / 2;
                }
            }
            var p = (hks[0].frame < 1) ? hks.shift() : hks[0];
            for (i = 1; i <= duration; i++) {
                var n = hks[0];
                if (i == n.frame) {
                    this.keys[i - 1] = n.value;
                    p = hks.shift();
                }
                else {
                    switch (interp) {
                        case Interpolation.STEP:
                            this.keys[i - 1] = p.value;
                            break;
                        case Interpolation.LINEAR:
                            this.keys[i - 1] = spark.lerp(p.value, n.value, i - p.frame, n.frame - p.frame);
                            break;
                        case Interpolation.CUBIC:
                            var u = (i - p.frame) / (n.frame - p.frame);
                            var h0 = (u * u * u * 2) - (u * u * 3) + 1;
                            var h1 = (u * u * u * -2) + (u * u * 3);
                            var h2 = (u * u * u) - (u * u * 2) + u;
                            var h3 = (u * u * u) - (u * u);
                            var p0 = p.value;
                            var p1 = n.value;
                            var t0 = spark.degToRad(tangent[p.frame] || 0.0);
                            var t1 = spark.degToRad(tangent[n.frame] || 0.0);
                            this.keys[i - 1] = (h0 * p0) + (h1 * p1) + (h2 * t0) + (h3 * t1);
                            break;
                    }
                }
            }
        }
        Tween.prototype.instantiate = function (obj, property, loop) {
            var path = property.split('.');
            var key = path.pop();
            while (path.length > 0) {
                if (!(obj = obj[path.shift()])) {
                    throw 'Cannot find property "' + property + '" on object!';
                }
            }
            return (function (step) {
                var frame = Math.floor((this.time += step) * this.tween.fps);
                var shouldStop = false;
                if (frame >= this.tween.duration) {
                    shouldStop = !loop;
                    if (!shouldStop) {
                        this.time %= this.tween.duration / this.tween.fps;
                        frame = Math.floor(this.time * this.tween.fps);
                    }
                    else
                        frame = this.tween.duration - 1;
                }
                obj[key] = this.tween.keys[frame];
                return shouldStop;
            }).bind({ tween: this, time: 0 });
        };
        return Tween;
    })();
    spark.Tween = Tween;
    var Timeline = (function (_super) {
        __extends(Timeline, _super);
        function Timeline(src) {
            var _this = this;
            _super.call(this, src, function (json) {
                _this.fps = json.fps || 30;
                _this.duration = json.duration || 30;
                _this.loop = json.loop || false;
                _this.events = json.events || [];
                _this.tracks = json.tracks || {};
                _this.events.sort(function (a, b) { return (a.frame - b.frame); });
                for (var t in _this.tracks) {
                    var keys = _this.tracks[t].keys;
                    var interpolation = _this.tracks[t].interpolation || Interpolation.CUBIC;
                    _this.tracks[t] = new Tween(keys, _this.fps, _this.duration, interpolation);
                }
            });
        }
        Timeline.prototype.instantiate = function (obj, onevent) {
            var rig = new Rig();
            for (var track in this.tracks) {
                rig.play(this.tracks[track].instantiate(obj, track, this.loop));
            }
            return (function (step) {
                var frame = Math.floor((this.time += step) * this.timeline.fps % this.timeline.duration);
                if (this.timeline.events.length > 0) {
                    while (this.timeline.events[this.eventIndex].frame <= frame + 1) {
                        onevent(this.timeline.events[this.eventIndex++].event);
                        if (this.eventIndex == this.timeline.events.length) {
                            this.eventIndex = 0;
                            break;
                        }
                    }
                }
                rig.update(step);
                return rig.anims.length === 0;
            }).bind({
                timeline: this,
                time: 0,
                eventIndex: 0,
            });
        };
        return Timeline;
    })(spark.JSONAsset);
    spark.Timeline = Timeline;
})(spark || (spark = {}));
var spark;
(function (spark) {
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite() {
            _super.call(this);
            this.m = new spark.Mat(0, 0, 1, 0, 1, 1);
            this.pivot = new spark.Vec(0.5, 0.5);
            this.rig = new spark.Rig();
            this.texture = null;
            this.quad = null;
            this.behaviors = [];
            this.dead = false;
            this.contextSettings = {};
        }
        Object.defineProperty(Sprite.prototype, "width", {
            get: function () {
                if (this.quad)
                    return this.quad.width;
                else if (this.texture)
                    return this.texture.width;
                else
                    return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "height", {
            get: function () {
                if (this.quad)
                    return this.quad.height;
                else if (this.texture)
                    return this.texture.height;
                else
                    return 0;
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.worldToLocal = function (p) {
            return this.m.inverse.transform(p);
        };
        Sprite.prototype.localToWorld = function (p) {
            return this.m.transform(p);
        };
        Sprite.prototype.worldToLocalAngle = function (angle) {
            return this.m.angle - angle;
        };
        Sprite.prototype.localToWorldAngle = function (angle) {
            return this.m.angle + angle;
        };
        Sprite.prototype.addBehavior = function (behavior) {
            this.behaviors.push(behavior);
        };
        Sprite.prototype.update = function (step) {
            var i;
            this.rig.update(step);
            for (i = 0; i < this.behaviors.length; i++) {
                this.behaviors[i](this, step);
            }
            this.updateShapes(this.m);
        };
        Sprite.prototype.draw = function () {
            if (!this.texture) {
                return;
            }
            spark.view.save();
            this.m.apply();
            spark.merge(spark.view, this.contextSettings);
            if (this.quad) {
                this.texture.drawq(this.quad, this.pivot);
            }
            else {
                this.texture.draw(this.pivot);
            }
            spark.view.restore();
        };
        return Sprite;
    })(spark.Collider);
    spark.Sprite = Sprite;
})(spark || (spark = {}));
var spark;
(function (spark) {
    var Emitter = (function (_super) {
        __extends(Emitter, _super);
        function Emitter(src) {
            var _this = this;
            this.minLife = 1.0;
            this.maxLife = 1.0;
            this.startAlpha = 1.0;
            this.endAlpha = 0.0;
            this.startScale = 1.0;
            this.endScale = 1.0;
            this.spread = 180.0;
            this.minSpeed = 10.0;
            this.maxSpeed = 15.0;
            this.minAngularVelocity = -5.0;
            this.maxAngularVelocity = 5.0;
            this.forwardAngle = 0.0;
            _super.call(this, src, function (json) {
                spark.merge(_this, json);
            });
            this.particleBehavior = function (sprite, step) {
                var emitter = this.emitter;
                if ((this.age += step) > this.life) {
                    this.age = this.life;
                    sprite.dead = true;
                }
                var s = spark.lerp(this.emitter.startScale, this.emitter.endScale, this.age, this.life);
                sprite.m.translate(this.v.x * step, this.v.y * step);
                sprite.m.rotate(this.w * step);
                sprite.m.s.set(s, s);
                sprite.contextSettings.globalAlpha = spark.lerp(this.emitter.startAlpha, this.emitter.endAlpha, this.age, this.life);
            };
        }
        Emitter.prototype.emit = function (scene, x, y, angle, n) {
            for (var i = 0; i < (n || 1); i++) {
                var sprite = scene.spawn();
                sprite.texture = this.texture && spark.project.assets[this.texture];
                sprite.quad = this.quad && spark.project.assets[this.quad];
                var s = spark.rand(this.minSpeed, this.maxSpeed);
                var a = spark.rand(-this.spread, this.spread) + angle;
                sprite.m.p.set(x, y);
                sprite.m.angle = this.forwardAngle + a;
                sprite.addBehavior(this.particleBehavior.bind({
                    emitter: this,
                    age: 0.0,
                    life: spark.rand(this.minLife, this.maxLife),
                    v: new spark.Vec(s * Math.cos(spark.degToRad(a)), s * Math.sin(spark.degToRad(a))),
                    w: spark.rand(this.minAngularVelocity, this.maxAngularVelocity),
                }));
            }
        };
        return Emitter;
    })(spark.JSONAsset);
    spark.Emitter = Emitter;
})(spark || (spark = {}));
var spark;
(function (spark) {
    (function (Origin) {
        Origin[Origin["TOP_LEFT"] = 0] = "TOP_LEFT";
        Origin[Origin["TOP_MIDDLE"] = 1] = "TOP_MIDDLE";
        Origin[Origin["TOP_RIGHT"] = 2] = "TOP_RIGHT";
        Origin[Origin["BOTTOM_LEFT"] = 3] = "BOTTOM_LEFT";
        Origin[Origin["BOTTOM_MIDDLE"] = 4] = "BOTTOM_MIDDLE";
        Origin[Origin["BOTTOM_RIGHT"] = 5] = "BOTTOM_RIGHT";
        Origin[Origin["MIDDLE_LEFT"] = 6] = "MIDDLE_LEFT";
        Origin[Origin["MIDDLE_RIGHT"] = 7] = "MIDDLE_RIGHT";
        Origin[Origin["MIDDLE"] = 8] = "MIDDLE";
    })(spark.Origin || (spark.Origin = {}));
    var Origin = spark.Origin;
    var Scene = (function () {
        function Scene(origin, width, height) {
            this.sprites = [];
            this.pool = [];
            this.sp = 0;
            this.count = 0;
            this.pending = 0;
            var i;
            var vw = spark.canvas.width;
            var vh = spark.canvas.height;
            var w = width || vw;
            var h = height || vh * w / vw;
            var x = 0;
            var y = 0;
            switch (origin || Origin.TOP_LEFT) {
                case Origin.TOP_LEFT:
                    x = 0;
                    y = 0;
                    break;
                case Origin.TOP_MIDDLE:
                    x = w / 2;
                    y = 0;
                    break;
                case Origin.TOP_RIGHT:
                    x = w;
                    y = 0;
                    break;
                case Origin.BOTTOM_LEFT:
                    x = 0;
                    y = h;
                    break;
                case Origin.BOTTOM_MIDDLE:
                    x = w / 2;
                    y = h;
                    break;
                case Origin.BOTTOM_RIGHT:
                    x = w;
                    y = h;
                    break;
                case Origin.MIDDLE_LEFT:
                    x = 0;
                    y = h / 2;
                    break;
                case Origin.MIDDLE_RIGHT:
                    x = w;
                    y = h / 2;
                    break;
                case Origin.MIDDLE:
                    x = w / 2;
                    y = h / 2;
                    break;
            }
            this.rect = new spark.Rect(-x, -y, w, h);
            this.camera = new spark.Mat(0, 0, 1, 0, spark.canvas.width / 2, spark.canvas.height / 2);
            for (i = 0; i < 1000; i++) {
                this.pool.push(new spark.Sprite());
            }
        }
        Scene.prototype.setViewport = function (w, h) {
            w = w || spark.canvas.width;
            if (!h) {
                h = w * spark.canvas.height / spark.canvas.width;
            }
            this.camera.s.x = w / 2;
            this.camera.s.y = h / 2;
        };
        Scene.prototype.run = function () {
            this.frametime = performance.now();
            this.framecount = 0;
            this.paused = false;
            this.runloop = requestAnimationFrame(this.stepFrame.bind(this));
        };
        Scene.prototype.quit = function () {
            cancelAnimationFrame(this.runloop);
        };
        Scene.prototype.spawn = function () {
            var sprite;
            if (this.sp === 0) {
                sprite = new spark.Sprite();
            }
            else {
                sprite = this.pool[--this.sp];
                spark.Sprite.call(sprite);
            }
            sprite.scene = this;
            if (this.count + this.pending < this.sprites.length) {
                this.sprites[this.count + this.pending] = sprite;
            }
            else {
                this.sprites.push(sprite);
            }
            this.pending++;
            return sprite;
        };
        Scene.prototype.stepFrame = function (now) {
            var step = this.paused ? 0 : (now - this.frametime) / 1000;
            this.frametime = now;
            this.framecount++;
            this.update(step);
            this.draw();
            spark.flushInput();
            this.runloop = requestAnimationFrame(this.stepFrame.bind(this));
        };
        Scene.prototype.update = function (step) {
            var i;
            this.count += this.pending;
            this.pending = 0;
            for (i = 0; i < this.count;) {
                var sprite = this.sprites[i];
                if (sprite.dead) {
                    this.sprites[i] = this.sprites[--this.count];
                    spark.wipe(sprite);
                    if (this.sp < this.pool.length) {
                        this.pool[this.sp] = sprite;
                    }
                    else {
                        this.pool.push(sprite);
                    }
                    this.sp++;
                }
                else {
                    i++;
                }
            }
            this.space = new spark.Quadtree(this.rect);
            for (i = 0; i < this.count; i++) {
                this.sprites[i].update(step);
                this.sprites[i].addToQuadtree(this.space);
            }
        };
        Scene.prototype.draw = function () {
            var i;
            spark.view.save();
            spark.view.globalAlpha = 1.0;
            spark.view.globalCompositeOperation = 'source-over';
            spark.view.shadowBlur = 0.0;
            spark.view.lineWidth = 1;
            spark.view.fillStyle = '#000';
            spark.view.strokeStyle = '#fff';
            spark.view.clearRect(0, 0, spark.canvas.width, spark.canvas.height);
            var w2 = spark.canvas.width / 2;
            var h2 = spark.canvas.height / 2;
            var mx = this.rect.x + (this.rect.width / 2);
            var my = this.rect.y + (this.rect.height / 2);
            spark.view.setTransform(1, 0, 0, 1, 0, 0);
            spark.view.translate(w2, h2);
            spark.view.scale(w2 / this.camera.s.x, h2 / this.camera.s.y);
            spark.view.transform(this.camera.r.x, this.camera.r.y, -this.camera.r.y, this.camera.r.x, 0, 0);
            spark.view.translate(-this.camera.p.x - mx, -this.camera.p.y - my);
            for (i = 0; i < this.count; i++) {
                this.sprites[i].draw();
            }
            spark.view.restore();
        };
        Scene.prototype.worldToScreen = function (x, y) {
            var mx = this.rect.x + (this.rect.width / 2);
            var my = this.rect.y + (this.rect.height / 2);
            var cx = x - (this.camera.p.x + mx);
            var cy = y - (this.camera.p.y + my);
            var rx = (cx * this.camera.r.x) - (cy * this.camera.r.y);
            var ry = (cy * this.camera.r.x) + (cx * this.camera.r.y);
            var sx = rx * spark.canvas.height / (2 * this.camera.s.x);
            var sy = ry * spark.canvas.width / (2 * this.camera.s.y);
            return new spark.Vec(sx + spark.canvas.width / 2, sy + spark.canvas.height / 2);
        };
        Scene.prototype.screenToWorld = function (x, y) {
            var cx = (x - spark.canvas.width / 2) * this.camera.s.x * 2 / spark.canvas.width;
            var cy = (y - spark.canvas.height / 2) * this.camera.s.y * 2 / spark.canvas.height;
            var vx = (cx * this.camera.r.x) + (cy * this.camera.r.y);
            var vy = (cy * this.camera.r.x) - (cx * this.camera.r.y);
            var mx = this.rect.x + (this.rect.width / 2);
            var my = this.rect.y + (this.rect.height / 2);
            return new spark.Vec(vx + this.camera.p.x + mx, vy + this.camera.p.y + my);
        };
        Scene.prototype.pick = function (x, y, radius) {
            if (!this.space) {
                return [];
            }
            var c = this.screenToWorld(x, y);
            if (!this.rect.contains(c.x, c.y)) {
                return [];
            }
            var shape = new spark.Circle(null, c.x, c.y, radius || 5.0);
            shape.updateShapeCache(spark.Mat.IDENTITY);
            return this.space.collect(shape);
        };
        return Scene;
    })();
    spark.Scene = Scene;
})(spark || (spark = {}));
