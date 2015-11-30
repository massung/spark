(function (console, $hx_exports, $global) { "use strict";
$hx_exports.spark = $hx_exports.spark || {};
var $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw new js__$Boot_HaxeError("Invalid date format : " + s);
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.lastIndexOf = function(a,obj,i) {
	var len = a.length;
	if(i >= len) i = len - 1; else if(i < 0) i += len;
	while(i >= 0) {
		if(a[i] === obj) return i;
		i--;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var IntIterator = function(min,max) {
	this.min = min;
	this.max = max;
};
$hxClasses["IntIterator"] = IntIterator;
IntIterator.__name__ = ["IntIterator"];
IntIterator.prototype = {
	min: null
	,max: null
	,hasNext: function() {
		return this.min < this.max;
	}
	,next: function() {
		return this.min++;
	}
	,__class__: IntIterator
};
Math.__name__ = ["Math"];
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
};
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && v.__enum__ == null || t == "function" && (v.__name__ || v.__ename__) != null;
};
Reflect.isEnumValue = function(v) {
	return v != null && v.__enum__ != null;
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0;
	var _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		Reflect.setField(o2,f,Reflect.field(o,f));
	}
	return o2;
};
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
};
var Spark = $hx_exports.Spark = function() { };
$hxClasses["Spark"] = Spark;
Spark.__name__ = ["Spark"];
Spark.loadQueue = null;
Spark.canvas = null;
Spark.view = null;
Spark.main = function() {
	Spark.loadQueue = [];
	Spark.canvas = window.document.getElementById("canvas");
	Spark.view = Spark.canvas.getContext("2d",null);
	spark_Input.init();
	spark_Input.hideCursor();
	Spark.canvas.oncontextmenu = function(event) {
		event.preventDefault();
	};
};
Spark.request = function(asset) {
	Spark.loadQueue.push(asset);
};
Spark.loadProgress = function() {
	var n = 0;
	var i;
	var _g1 = 0;
	var _g = Spark.loadQueue.length - 1;
	while(_g1 < _g) {
		var i1 = _g1++;
		if(Spark.loadQueue[i1].isLoaded()) n++;
	}
	if(n == Spark.loadQueue.length) return true; else return js_Boot.__cast(n , Float) / Spark.loadQueue.length;
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js_Boot.__instanceof(v,t);
};
Std.instance = function(value,c) {
	if((value instanceof c)) return value; else return null;
};
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
ValueType.__empty_constructs__ = [ValueType.TNull,ValueType.TInt,ValueType.TFloat,ValueType.TBool,ValueType.TObject,ValueType.TFunction,ValueType.TUnknown];
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null; else return js_Boot.getClass(o);
};
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
};
Type.getSuperClass = function(c) {
	return c.__super__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw new js__$Boot_HaxeError("Too many arguments");
	}
	return null;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw new js__$Boot_HaxeError("No such constructor " + constr);
	if(Reflect.isFunction(f)) {
		if(params == null) throw new js__$Boot_HaxeError("Constructor " + constr + " need parameters");
		return Reflect.callMethod(e,f,params);
	}
	if(params != null && params.length != 0) throw new js__$Boot_HaxeError("Constructor " + constr + " does not need parameters");
	return f;
};
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw new js__$Boot_HaxeError(index + " is not a valid enum constructor index");
	return Type.createEnum(e,c,params);
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"__meta__");
	HxOverrides.remove(a,"prototype");
	return a;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = js_Boot.getClass(v);
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2;
		var _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e1 ) {
		haxe_CallStack.lastException = e1;
		if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
		return false;
	}
	return true;
};
Type.enumConstructor = function(e) {
	return e[0];
};
Type.enumParameters = function(e) {
	return e.slice(2);
};
Type.enumIndex = function(e) {
	return e[1];
};
Type.allEnums = function(e) {
	return e.__empty_constructs__;
};
var haxe_IMap = function() { };
$hxClasses["haxe.IMap"] = haxe_IMap;
haxe_IMap.__name__ = ["haxe","IMap"];
haxe_IMap.prototype = {
	get: null
	,set: null
	,exists: null
	,remove: null
	,keys: null
	,iterator: null
	,toString: null
	,__class__: haxe_IMap
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
$hxClasses["js._Boot.HaxeError"] = js__$Boot_HaxeError;
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	val: null
	,__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = ["js","Boot"];
js_Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js_Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js_Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js_Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js_Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js_Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
};
js_Boot.isClass = function(o) {
	return o.__name__;
};
js_Boot.isEnum = function(e) {
	return e.__ename__;
};
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__cast = function(o,t) {
	if(js_Boot.__instanceof(o,t)) return o; else throw new js__$Boot_HaxeError("Cannot cast " + Std.string(o) + " to " + Std.string(t));
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_Browser = function() { };
$hxClasses["js.Browser"] = js_Browser;
js_Browser.__name__ = ["js","Browser"];
js_Browser.__properties__ = {get_supported:"get_supported",get_console:"get_console",get_navigator:"get_navigator",get_location:"get_location",get_document:"get_document",get_window:"get_window"}
js_Browser.get_window = function() {
	return window;
};
js_Browser.get_document = function() {
	return window.document;
};
js_Browser.get_location = function() {
	return window.location;
};
js_Browser.get_navigator = function() {
	return window.navigator;
};
js_Browser.get_console = function() {
	return window.console;
};
js_Browser.get_supported = function() {
	return typeof(window) != "undefined";
};
js_Browser.getLocalStorage = function() {
	try {
		var s = window.localStorage;
		s.getItem("");
		return s;
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
js_Browser.getSessionStorage = function() {
	try {
		var s = window.sessionStorage;
		s.getItem("");
		return s;
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
js_Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw new js__$Boot_HaxeError("Unable to create XMLHttpRequest object.");
};
js_Browser.alert = function(v) {
	window.alert(js_Boot.__string_rec(v,""));
};
var js_Lib = function() { };
$hxClasses["js.Lib"] = js_Lib;
js_Lib.__name__ = ["js","Lib"];
js_Lib.__properties__ = {get_undefined:"get_undefined"}
js_Lib.debug = function() {
	debugger;
};
js_Lib.alert = function(v) {
	alert(js_Boot.__string_rec(v,""));
};
js_Lib["eval"] = function(code) {
	return eval(code);
};
js_Lib.require = function(module) {
	return require(module);
};
js_Lib.get_undefined = function() {
	return undefined;
};
var js_html__$CanvasElement_CanvasUtil = function() { };
$hxClasses["js.html._CanvasElement.CanvasUtil"] = js_html__$CanvasElement_CanvasUtil;
js_html__$CanvasElement_CanvasUtil.__name__ = ["js","html","_CanvasElement","CanvasUtil"];
js_html__$CanvasElement_CanvasUtil.getContextWebGL = function(canvas,attribs) {
	var _g = 0;
	var _g1 = ["webgl","experimental-webgl"];
	while(_g < _g1.length) {
		var name = _g1[_g];
		++_g;
		var ctx = canvas.getContext(name,attribs);
		if(ctx != null) return ctx;
	}
	return null;
};
var spark_Asset = function(src) {
	this.source = src;
	this.loaded = false;
	Spark.request(this);
};
$hxClasses["spark.Asset"] = spark_Asset;
spark_Asset.__name__ = ["spark","Asset"];
spark_Asset.prototype = {
	source: null
	,loaded: null
	,isLoaded: function() {
		return this.loaded;
	}
	,__class__: spark_Asset
};
var spark_XHRAsset = function(src,respType,onload) {
	var _g = this;
	spark_Asset.call(this,src);
	this.req = new XMLHttpRequest();
	this.req.onloadend = function() {
		if(_g.req.status >= 200 && _g.req.status <= 299) onload(_g.req);
		_g.loaded = true;
	};
};
$hxClasses["spark.XHRAsset"] = spark_XHRAsset;
spark_XHRAsset.__name__ = ["spark","XHRAsset"];
spark_XHRAsset.__super__ = spark_Asset;
spark_XHRAsset.prototype = $extend(spark_Asset.prototype,{
	req: null
	,__class__: spark_XHRAsset
});
var spark_XMLAsset = function(src,onload) {
	var _g = this;
	spark_XHRAsset.call(this,src,"document",function(req) {
		onload(_g.doc = req.response);
	});
};
$hxClasses["spark.XMLAsset"] = spark_XMLAsset;
spark_XMLAsset.__name__ = ["spark","XMLAsset"];
spark_XMLAsset.__super__ = spark_XHRAsset;
spark_XMLAsset.prototype = $extend(spark_XHRAsset.prototype,{
	doc: null
	,__class__: spark_XMLAsset
});
var spark_JSONAsset = function(src,onload) {
	var _g = this;
	spark_XHRAsset.call(this,src,"json",function(req) {
		onload(_g.json = req.response);
	});
};
$hxClasses["spark.JSONAsset"] = spark_JSONAsset;
spark_JSONAsset.__name__ = ["spark","JSONAsset"];
spark_JSONAsset.__super__ = spark_XHRAsset;
spark_JSONAsset.prototype = $extend(spark_XHRAsset.prototype,{
	json: null
	,__class__: spark_JSONAsset
});
var spark_Input = $hx_exports.spark.Input = function() { };
$hxClasses["spark.Input"] = spark_Input;
spark_Input.__name__ = ["spark","Input"];
spark_Input.keys = null;
spark_Input.buttons = null;
spark_Input.x = null;
spark_Input.y = null;
spark_Input.relX = null;
spark_Input.relY = null;
spark_Input.init = function() {
	var i;
	spark_Input.keys = [];
	spark_Input.buttons = [];
	var _g = 0;
	while(_g < 255) {
		var i1 = _g++;
		spark_Input.keys.push({ down : false, hits : 0});
	}
	var _g1 = 0;
	while(_g1 < 31) {
		var i2 = _g1++;
		spark_Input.buttons.push({ down : false, hits : 0});
	}
	spark_Input.relX = 0;
	spark_Input.relY = 0;
};
spark_Input.enableKeyboard = function() {
	window.addEventListener("keydown",spark_Input.onKeyDown,false);
	window.addEventListener("keyup",spark_Input.onKeyUp,false);
};
spark_Input.enableMouse = function() {
	window.addEventListener("mousedown",spark_Input.onMouseDown,false);
	window.addEventListener("mouseup",spark_Input.onMouseUp,false);
	window.addEventListener("mousemove",spark_Input.onMouseMove,false);
};
spark_Input.flush = function() {
	var _g1 = 0;
	var _g = spark_Input.keys.length - 1;
	while(_g1 < _g) {
		var i = _g1++;
		spark_Input.keys[i].hits = 0;
	}
	var _g11 = 0;
	var _g2 = spark_Input.buttons.length - 1;
	while(_g11 < _g2) {
		var i1 = _g11++;
		spark_Input.buttons[i1].hits = 0;
	}
	spark_Input.relX = 0;
	spark_Input.relY = 0;
};
spark_Input.hideCursor = function() {
	Spark.canvas.style.cursor = "none";
};
spark_Input.showCursor = function(image) {
	if(image == null) Spark.canvas.style.cursor = "pointer"; else Spark.canvas.style.cursor = image;
};
spark_Input.keyDown = function(key) {
	if(key >= 0 && key < spark_Input.keys.length) return spark_Input.keys[key].down; else return false;
};
spark_Input.keyHit = function(key) {
	return spark_Input.keyHits(key) > 0;
};
spark_Input.keyHits = function(key) {
	if(key >= 0 && key < spark_Input.keys.length) return spark_Input.keys[key].hits; else return 0;
};
spark_Input.mouseDown = function(button) {
	if(button == null) button = 0;
	if(button >= 0 && button < spark_Input.buttons.length) return spark_Input.buttons[button].down; else return false;
};
spark_Input.buttonHit = function(button) {
	if(button == null) button = 0;
	return spark_Input.buttonHits(button) > 0;
};
spark_Input.buttonHits = function(button) {
	if(button == null) button = 0;
	if(button >= 0 && button < spark_Input.buttons.length) return spark_Input.buttons[button].hits; else return 0;
};
spark_Input.onKeyDown = function(event) {
	if(event.keyCode < spark_Input.keys.length) {
		spark_Input.keys[event.keyCode].down = true;
		spark_Input.keys[event.keyCode].hits++;
	}
};
spark_Input.onKeyUp = function(event) {
	if(event.keyCode < spark_Input.keys.length) spark_Input.keys[event.keyCode].down = false;
};
spark_Input.onMouseDown = function(event) {
	if(event.button < spark_Input.buttons.length) {
		spark_Input.buttons[event.button].down = true;
		spark_Input.buttons[event.button].hits++;
	}
};
spark_Input.onMouseUp = function(event) {
	if(event.button < spark_Input.buttons.length) spark_Input.buttons[event.button].down = false;
};
spark_Input.onMouseMove = function(event) {
	var eventX = event.clientX - Spark.canvas.offsetLeft;
	var eventY = event.clientY - Spark.canvas.offsetTop;
	spark_Input.relX += eventX - spark_Input.x;
	spark_Input.relY += eventY - spark_Input.y;
	spark_Input.x = eventX;
	spark_Input.y = eventY;
};
var spark_Mat = $hx_exports.spark.Mat = function(x,y,rx,ry,sx,sy) {
	this.p = new spark_Vec(x,y);
	this.r = new spark_Vec(rx,ry);
	this.s = new spark_Vec(sx,sy);
};
$hxClasses["spark.Mat"] = spark_Mat;
spark_Mat.__name__ = ["spark","Mat"];
spark_Mat.prototype = {
	p: null
	,r: null
	,s: null
	,inverse: function() {
		return new spark_Mat(-this.p.x,-this.p.y,this.r.x,-this.r.y,1 / this.s.x,1 / this.s.y);
	}
	,translate: function(x,y,local) {
		if(local == null) local = false;
		var dx = x;
		var dy = y;
		if(local) {
			dx = x * this.r.x + y * this.r.y;
			dy = y * this.r.x - x * this.r.y;
		}
		this.p.x += dx;
		this.p.y += dy;
	}
	,rotate: function(r) {
		var x = Math.cos(spark_Util.degToRad(r));
		var y = Math.sin(spark_Util.degToRad(r));
		this.r.set(this.r.x * x + this.r.y * y,this.r.y * x - this.r.x * y);
	}
	,scale: function(x,y) {
		this.s.x *= x;
		if(y == null) this.s.y *= x; else this.s.y *= y;
	}
	,transform: function(v) {
		var x = v.x * this.s.x * this.r.x + v.y * this.s.y * this.r.y;
		var y = v.y * this.s.y * this.r.x - v.x * this.s.x * this.r.y;
		return new spark_Vec(x,y);
	}
	,mult: function(m) {
		var p = this.transform(m.p);
		var r = this.r.rotate(m.r);
		var s = this.s.mult(m.s);
		return new spark_Mat(p.x,p.y,r.x,r.y,s.x,s.y);
	}
	,apply: function() {
		var a = this.r.x * this.s.x;
		var b = this.r.y * this.s.y;
		var c = this.r.y * this.s.x;
		var d = this.r.x * this.s.y;
		var e = this.p.x;
		var f = this.p.y;
		Spark.view.transform(a,-b,c,d,e,f);
	}
	,__class__: spark_Mat
};
var spark_Rect = $hx_exports.spark.Rect = function(x,y,w,h) {
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
};
$hxClasses["spark.Rect"] = spark_Rect;
spark_Rect.__name__ = ["spark","Rect"];
spark_Rect.prototype = {
	x: null
	,y: null
	,width: null
	,height: null
	,contains: function(x,y) {
		return x >= this.x && x <= this.x + this.width && (y >= this.y && y <= this.y + this.height);
	}
	,getLeft: function() {
		return this.x;
	}
	,getTop: function() {
		return this.y;
	}
	,getRight: function() {
		return this.x + this.width;
	}
	,getBottom: function() {
		return this.y + this.height;
	}
	,__class__: spark_Rect
};
var spark_Scene = $hx_exports.spark.Scene = function(origin,width,height) {
	var i;
	var vw = Spark.canvas.width;
	var vh = Spark.canvas.height;
	var w;
	if(width == null) w = vw; else w = width;
	var h;
	if(height == null) h = vh; else h = height;
	var x = 0;
	var y = 0;
	var _g;
	if(origin == null) _g = spark_Origin.TOP_LEFT; else _g = origin;
	switch(_g[1]) {
	case 0:
		x = 0;
		y = 0;
		break;
	case 1:
		x = w / 2;
		y = 0;
		break;
	case 2:
		x = w;
		y = 0;
		break;
	case 3:
		x = 0;
		y = h;
		break;
	case 4:
		x = w / 2;
		y = h;
		break;
	case 5:
		x = w;
		y = h;
		break;
	case 6:
		x = 0;
		y = h / 2;
		break;
	case 7:
		x = w;
		y = h / 2;
		break;
	case 8:
		x = w / 2;
		y = h / 2;
		break;
	}
	this.rect = new spark_Rect(-x,-y,w,h);
	this.camera = new spark_Mat(0,0,1,0,Spark.canvas.width / 2,Spark.canvas.height / 2);
};
$hxClasses["spark.Scene"] = spark_Scene;
spark_Scene.__name__ = ["spark","Scene"];
spark_Scene.prototype = {
	frametime: null
	,framecount: null
	,runloop: null
	,sp: null
	,count: null
	,pending: null
	,rect: null
	,camera: null
	,setViewport: function(w,h) {
		if(w == null) w = Spark.canvas.width; else w = w;
		if(h == null) h = w * Spark.canvas.height / Spark.canvas.width;
		this.camera.s.x = w / 2;
		this.camera.s.y = h / 2;
	}
	,run: function() {
		this.framecount = 0;
		this.frametime = window.performance.now();
		this.runloop = window.requestAnimationFrame($bind(this,this.stepFrame));
	}
	,quit: function() {
		window.cancelAnimationFrame(this.runloop);
	}
	,stepFrame: function(now) {
		var step = (now - this.frametime) / 1000;
		this.frametime = now;
		this.framecount++;
		this.update(step);
		this.draw();
		spark_Input.flush();
		this.runloop = window.requestAnimationFrame($bind(this,this.stepFrame));
	}
	,update: function(step) {
	}
	,draw: function() {
		var i;
		Spark.view.save();
		Spark.view.globalAlpha = 1.0;
		Spark.view.globalCompositeOperation = "source-over";
		Spark.view.shadowBlur = 0.0;
		Spark.view.lineWidth = 1;
		Spark.view.fillStyle = "#000";
		Spark.view.strokeStyle = "#fff";
		Spark.view.clearRect(0,0,Spark.canvas.width,Spark.canvas.height);
		var w2 = Spark.canvas.width / 2;
		var h2 = Spark.canvas.height / 2;
		var mx = this.rect.x + this.rect.width / 2;
		var my = this.rect.y + this.rect.height / 2;
		Spark.view.setTransform(1,0,0,1,0,0);
		Spark.view.translate(w2,h2);
		Spark.view.scale(w2 / this.camera.s.x,h2 / this.camera.s.y);
		Spark.view.transform(this.camera.r.x,this.camera.r.y,-this.camera.r.y,this.camera.r.x,0,0);
		Spark.view.translate(-this.camera.p.x - mx,-this.camera.p.y - my);
		Spark.view.restore();
	}
	,worldToScreen: function(x,y) {
		var mx = this.rect.x + this.rect.width / 2;
		var my = this.rect.y + this.rect.height / 2;
		var cx = x - (this.camera.p.x + mx);
		var cy = y - (this.camera.p.y + my);
		var rx = cx * this.camera.r.x - cy * this.camera.r.y;
		var ry = cy * this.camera.r.x + cx * this.camera.r.y;
		var sx = rx * Spark.canvas.height / (2 * this.camera.s.x);
		var sy = ry * Spark.canvas.width / (2 * this.camera.s.y);
		return new spark_Vec(sx + Spark.canvas.width / 2,sy + Spark.canvas.height / 2);
	}
	,screenToWorld: function(x,y) {
		var cx = (x - Spark.canvas.width / 2) * this.camera.s.x * 2 / Spark.canvas.width;
		var cy = (y - Spark.canvas.height / 2) * this.camera.s.y * 2 / Spark.canvas.height;
		var vx = cx * this.camera.r.x + cy * this.camera.r.y;
		var vy = cy * this.camera.r.x - cx * this.camera.r.y;
		var mx = this.rect.x + this.rect.width / 2;
		var my = this.rect.y + this.rect.height / 2;
		return new spark_Vec(vx + this.camera.p.x + mx,vy + this.camera.p.y + my);
	}
	,__class__: spark_Scene
};
var spark_Origin = $hxClasses["spark.Origin"] = { __ename__ : ["spark","Origin"], __constructs__ : ["TOP_LEFT","TOP_MIDDLE","TOP_RIGHT","BOTTOM_LEFT","BOTTOM_MIDDLE","BOTTOM_RIGHT","MIDDLE_LEFT","MIDDLE_RIGHT","MIDDLE"] };
spark_Origin.TOP_LEFT = ["TOP_LEFT",0];
spark_Origin.TOP_LEFT.toString = $estr;
spark_Origin.TOP_LEFT.__enum__ = spark_Origin;
spark_Origin.TOP_MIDDLE = ["TOP_MIDDLE",1];
spark_Origin.TOP_MIDDLE.toString = $estr;
spark_Origin.TOP_MIDDLE.__enum__ = spark_Origin;
spark_Origin.TOP_RIGHT = ["TOP_RIGHT",2];
spark_Origin.TOP_RIGHT.toString = $estr;
spark_Origin.TOP_RIGHT.__enum__ = spark_Origin;
spark_Origin.BOTTOM_LEFT = ["BOTTOM_LEFT",3];
spark_Origin.BOTTOM_LEFT.toString = $estr;
spark_Origin.BOTTOM_LEFT.__enum__ = spark_Origin;
spark_Origin.BOTTOM_MIDDLE = ["BOTTOM_MIDDLE",4];
spark_Origin.BOTTOM_MIDDLE.toString = $estr;
spark_Origin.BOTTOM_MIDDLE.__enum__ = spark_Origin;
spark_Origin.BOTTOM_RIGHT = ["BOTTOM_RIGHT",5];
spark_Origin.BOTTOM_RIGHT.toString = $estr;
spark_Origin.BOTTOM_RIGHT.__enum__ = spark_Origin;
spark_Origin.MIDDLE_LEFT = ["MIDDLE_LEFT",6];
spark_Origin.MIDDLE_LEFT.toString = $estr;
spark_Origin.MIDDLE_LEFT.__enum__ = spark_Origin;
spark_Origin.MIDDLE_RIGHT = ["MIDDLE_RIGHT",7];
spark_Origin.MIDDLE_RIGHT.toString = $estr;
spark_Origin.MIDDLE_RIGHT.__enum__ = spark_Origin;
spark_Origin.MIDDLE = ["MIDDLE",8];
spark_Origin.MIDDLE.toString = $estr;
spark_Origin.MIDDLE.__enum__ = spark_Origin;
spark_Origin.__empty_constructs__ = [spark_Origin.TOP_LEFT,spark_Origin.TOP_MIDDLE,spark_Origin.TOP_RIGHT,spark_Origin.BOTTOM_LEFT,spark_Origin.BOTTOM_MIDDLE,spark_Origin.BOTTOM_RIGHT,spark_Origin.MIDDLE_LEFT,spark_Origin.MIDDLE_RIGHT,spark_Origin.MIDDLE];
var spark_Util = $hx_exports.spark.Util = function() { };
$hxClasses["spark.Util"] = spark_Util;
spark_Util.__name__ = ["spark","Util"];
spark_Util.degToRad = function(r) {
	return r * Math.PI / 180.0;
};
spark_Util.radToDeg = function(r) {
	return r * 180.0 / Math.PI;
};
spark_Util.signum = function(n) {
	if(Math.abs(n) < 0.00001) return 0;
	if(n > 0) return 1; else return -1;
};
spark_Util.nextPow2 = function(n) {
	return Math.pow(2,Math.ceil(Math.log(n) / Math.log(2)));
};
spark_Util.clamp = function(n,min,max) {
	return Math.max(min,Math.min(n,max));
};
spark_Util.rand = function(min,max) {
	return Math.random() * (max - min) + min;
};
spark_Util.irand = function(min,max) {
	return Math.floor(spark_Util.rand(min,max));
};
spark_Util.arand = function(array) {
	return array[spark_Util.irand(0,array.length)];
};
spark_Util.lerp = function(p,q,k,max) {
	if(max == null) max = 1;
	return p + (q - p) * k / max;
};
var spark_Vec = $hx_exports.spark.Vec = function(x,y) {
	this.x = x;
	this.y = y;
};
$hxClasses["spark.Vec"] = spark_Vec;
spark_Vec.__name__ = ["spark","Vec"];
spark_Vec.prototype = {
	x: null
	,y: null
	,set: function(x,y) {
		this.x = x;
		this.y = y;
	}
	,add: function(v) {
		return new spark_Vec(this.x + v.x,this.y + v.y);
	}
	,sub: function(v) {
		return new spark_Vec(this.x - v.x,this.y - v.y);
	}
	,mult: function(v) {
		return new spark_Vec(this.x * v.x,this.y * v.y);
	}
	,imult: function(v) {
		return new spark_Vec(this.x / v.x,this.y / v.y);
	}
	,scale: function(s) {
		return new spark_Vec(this.x * s,this.y * s);
	}
	,neg: function() {
		return new spark_Vec(-this.x,-this.y);
	}
	,inv: function() {
		return new spark_Vec(1 / this.x,1 / this.y);
	}
	,dot: function(v) {
		return this.x * v.x + this.y * v.y;
	}
	,cross: function(v) {
		return this.x * v.y - this.y * v.x;
	}
	,magsq: function() {
		return this.x * this.x + this.y * this.y;
	}
	,mag: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	,distsq: function(v) {
		var dx = this.x - v.x;
		var dy = this.y - v.y;
		return dx * dx + dy * dy;
	}
	,dist: function(v) {
		return Math.sqrt(this.magsq());
	}
	,norm: function() {
		return this.scale(1.0 / this.mag());
	}
	,lerp: function(v,k) {
		return new spark_Vec(this.x + (v.x - this.x) * k,this.y + (v.y - this.y) * k);
	}
	,proj: function(p,q) {
		var a = this.sub(p);
		var b = q.sub(p);
		var k = a.dot(b);
		var d = b.magsq();
		if(d < 0.00001) return b; else {
			var s = k / d;
			if(s < 0.0) return p;
			if(s > 1.0) return q;
			return p.lerp(q,s);
		}
	}
	,perp: function() {
		return new spark_Vec(this.y,-this.x);
	}
	,rperp: function() {
		return new spark_Vec(-this.y,this.x);
	}
	,rotate: function(r) {
		return new spark_Vec(this.x * r.x + this.y * r.y,this.y * r.x - this.x * r.y);
	}
	,unrotate: function(r) {
		return new spark_Vec(this.x * r.x - this.y * r.y,this.y * r.x + this.x * r.y);
	}
	,__class__: spark_Vec
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
function $arrayPushClosure(a) { return function(x) { a.push(x); }; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
if(Array.prototype.lastIndexOf) HxOverrides.lastIndexOf = function(a1,o1,i1) {
	return Array.prototype.lastIndexOf.call(a1,o1,i1);
};
$hxClasses.Math = Math;
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
$hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
if(Array.prototype.filter == null) Array.prototype.filter = function(f1) {
	var a1 = [];
	var _g11 = 0;
	var _g2 = this.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var e = this[i1];
		if(f1(e)) a1.push(e);
	}
	return a1;
};
js_Boot.__toStr = {}.toString;
spark_Input.Button = { 'LEFT' : 0, 'MIDDLE' : 1, 'RIGHT' : 2};
spark_Input.Key = { 'BACKSPACE' : 8, 'TAB' : 9, 'ENTER' : 13, 'PAUSE' : 19, 'CAPS' : 20, 'ESC' : 27, 'SPACE' : 32, 'PAGE_UP' : 33, 'PAGE_DOWN' : 34, 'END' : 35, 'HOME' : 36, 'LEFT' : 37, 'UP' : 38, 'RIGHT' : 39, 'DOWN' : 40, 'INSERT' : 45, 'DELETE' : 46, '_0' : 48, '_1' : 49, '_2' : 50, '_3' : 51, '_4' : 52, '_5' : 53, '_6' : 54, '_7' : 55, '_8' : 56, '_9' : 57, 'A' : 65, 'B' : 66, 'C' : 67, 'D' : 68, 'E' : 69, 'F' : 70, 'G' : 71, 'H' : 72, 'I' : 73, 'J' : 74, 'K' : 75, 'L' : 76, 'M' : 77, 'N' : 78, 'O' : 79, 'P' : 80, 'Q' : 81, 'R' : 82, 'S' : 83, 'T' : 84, 'U' : 85, 'V' : 86, 'W' : 87, 'X' : 88, 'Y' : 89, 'Z' : 90, 'NUMPAD_0' : 96, 'NUMPAD_1' : 97, 'NUMPAD_2' : 98, 'NUMPAD_3' : 99, 'NUMPAD_4' : 100, 'NUMPAD_5' : 101, 'NUMPAD_6' : 102, 'NUMPAD_7' : 103, 'NUMPAD_8' : 104, 'NUMPAD_9' : 105, 'MULTIPLY' : 106, 'ADD' : 107, 'SUBSTRACT' : 109, 'DECIMAL' : 110, 'DIVIDE' : 111, 'F1' : 112, 'F2' : 113, 'F3' : 114, 'F4' : 115, 'F5' : 116, 'F6' : 117, 'F7' : 118, 'F8' : 119, 'F9' : 120, 'F10' : 121, 'F11' : 122, 'F12' : 123, 'SHIFT' : 16, 'CTRL' : 17, 'ALT' : 18, 'PLUS' : 187, 'COMMA' : 188, 'MINUS' : 189, 'PERIOD' : 190};
spark_Vec.ZERO = new spark_Vec(0,0);
spark_Vec.ONE = new spark_Vec(1,1);
spark_Vec.RIGHT = new spark_Vec(1,0);
spark_Vec.UP = new spark_Vec(0,1);
Spark.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
