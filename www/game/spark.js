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
var Spark = function() { };
$hxClasses["Spark"] = Spark;
Spark.__name__ = ["Spark"];
Spark.audio = null;
Spark.canvas = null;
Spark.view = null;
Spark.main = function() {
	Spark.canvas = window.document.getElementById("spark");
	Spark.view = Spark.canvas.getContext("2d",null);
	Spark.audio = new AudioContext();
	spark_Debug.init();
	spark_Key.install();
	spark_Mouse.install();
	spark_Joystick.install();
	spark_Mouse.hide();
	Spark.canvas.oncontextmenu = function(event) {
		event.preventDefault();
	};
};
Spark.loadXHR = function(src,respType,onload) {
	var req = new XMLHttpRequest();
	req.onloadend = function() {
		if(req.status >= 200 && req.status <= 299) onload(req);
	};
	req.responseType = respType;
	req.open("GET",src,true);
	req.send();
};
Spark.loadXML = function(src,onload) {
	Spark.loadXHR(src,"document",function(req) {
		onload(req.response);
	});
};
Spark.loadJSON = function(src,onload) {
	Spark.loadXHR(src,"json",function(req) {
		onload(req.response);
	});
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
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	b: null
	,get_length: function() {
		return this.b.length;
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
	,toString: function() {
		return this.b;
	}
	,__class__: StringBuf
	,__properties__: {get_length:"get_length"}
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
};
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
};
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	if(quotes) return s.split("\"").join("&quot;").split("'").join("&#039;"); else return s;
};
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&quot;").join("\"").split("&#039;").join("'").split("&amp;").join("&");
};
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.rpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = s + c;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
StringTools.isEof = function(c) {
	return c != c;
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
var haxe_Log = function() { };
$hxClasses["haxe.Log"] = haxe_Log;
haxe_Log.__name__ = ["haxe","Log"];
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
haxe_Log.clear = function() {
	js_Boot.__clear_trace();
};
var haxe_ds_IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
haxe_ds_IntMap.__name__ = ["haxe","ds","IntMap"];
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	h: null
	,set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,toString: function() {
		var s_b = "";
		s_b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			if(i == null) s_b += "null"; else s_b += "" + i;
			s_b += " => ";
			s_b += Std.string(Std.string(this.h[i]));
			if(it.hasNext()) s_b += ", ";
		}
		s_b += "}";
		return s_b;
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_Option = $hxClasses["haxe.ds.Option"] = { __ename__ : ["haxe","ds","Option"], __constructs__ : ["Some","None"] };
haxe_ds_Option.Some = function(v) { var $x = ["Some",0,v]; $x.__enum__ = haxe_ds_Option; $x.toString = $estr; return $x; };
haxe_ds_Option.None = ["None",1];
haxe_ds_Option.None.toString = $estr;
haxe_ds_Option.None.__enum__ = haxe_ds_Option;
haxe_ds_Option.__empty_constructs__ = [haxe_ds_Option.None];
var haxe_ds__$StringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
$hxClasses["haxe.ds._StringMap.StringMapIterator"] = haxe_ds__$StringMap_StringMapIterator;
haxe_ds__$StringMap_StringMapIterator.__name__ = ["haxe","ds","_StringMap","StringMapIterator"];
haxe_ds__$StringMap_StringMapIterator.prototype = {
	map: null
	,keys: null
	,index: null
	,count: null
	,hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: haxe_ds__$StringMap_StringMapIterator
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	h: null
	,rh: null
	,isReserved: function(key) {
		return __map_reserved[key] != null;
	}
	,set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			return true;
		}
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,iterator: function() {
		return new haxe_ds__$StringMap_StringMapIterator(this,this.arrayKeys());
	}
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var keys = this.arrayKeys();
		var _g1 = 0;
		var _g = keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			var k = keys[i];
			if(k == null) s.b += "null"; else s.b += "" + k;
			s.b += " => ";
			s.add(Std.string(__map_reserved[k] != null?this.getReserved(k):this.h[k]));
			if(i < keys.length) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,__class__: haxe_ds_StringMap
};
var haxe_ds__$Vector_Vector_$Impl_$ = {};
$hxClasses["haxe.ds._Vector.Vector_Impl_"] = haxe_ds__$Vector_Vector_$Impl_$;
haxe_ds__$Vector_Vector_$Impl_$.__name__ = ["haxe","ds","_Vector","Vector_Impl_"];
haxe_ds__$Vector_Vector_$Impl_$.__properties__ = {get_length:"get_length"}
haxe_ds__$Vector_Vector_$Impl_$._new = function(length) {
	var this1;
	this1 = new Array(length);
	return this1;
};
haxe_ds__$Vector_Vector_$Impl_$.get = function(this1,index) {
	return this1[index];
};
haxe_ds__$Vector_Vector_$Impl_$.set = function(this1,index,val) {
	return this1[index] = val;
};
haxe_ds__$Vector_Vector_$Impl_$.get_length = function(this1) {
	return this1.length;
};
haxe_ds__$Vector_Vector_$Impl_$.blit = function(src,srcPos,dest,destPos,len) {
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		dest[destPos + i] = src[srcPos + i];
	}
};
haxe_ds__$Vector_Vector_$Impl_$.toArray = function(this1) {
	var a = [];
	var len = this1.length;
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		a[i] = this1[i];
	}
	return a;
};
haxe_ds__$Vector_Vector_$Impl_$.toData = function(this1) {
	return this1;
};
haxe_ds__$Vector_Vector_$Impl_$.fromData = function(data) {
	return data;
};
haxe_ds__$Vector_Vector_$Impl_$.fromArrayCopy = function(array) {
	var vec;
	var this1;
	this1 = new Array(array.length);
	vec = this1;
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		vec[i] = array[i];
	}
	return vec;
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
};
$hxClasses["spark.Asset"] = spark_Asset;
spark_Asset.__name__ = ["spark","Asset"];
spark_Asset.classOfExt = function(ext) {
	var _g = ext.toLowerCase();
	switch(_g) {
	case "aiff":
		return spark_audio_Sound;
	case "au":
		return spark_audio_Sound;
	case "mid":
		return spark_audio_Sound;
	case "midi":
		return spark_audio_Sound;
	case "mp3":
		return spark_audio_Sound;
	case "ogg":
		return spark_audio_Sound;
	case "snd":
		return spark_audio_Sound;
	case "wav":
		return spark_audio_Sound;
	case "wave":
		return spark_audio_Sound;
	case "bmp":
		return spark_graphics_Texture;
	case "exif":
		return spark_graphics_Texture;
	case "gif":
		return spark_graphics_Texture;
	case "ico":
		return spark_graphics_Texture;
	case "jpeg":
		return spark_graphics_Texture;
	case "jpg":
		return spark_graphics_Texture;
	case "png":
		return spark_graphics_Texture;
	case "tga":
		return spark_graphics_Texture;
	case "tif":
		return spark_graphics_Texture;
	case "tiff":
		return spark_graphics_Texture;
	case "fnt":
		return spark_graphics_Font;
	case "otf":
		return spark_graphics_Font;
	case "ttf":
		return spark_graphics_Font;
	}
	return null;
};
spark_Asset.prototype = {
	source: null
	,loaded: null
	,isLoaded: function() {
		return this.loaded;
	}
	,__class__: spark_Asset
};
var spark_Debug = $hx_exports.spark.Debug = function() { };
$hxClasses["spark.Debug"] = spark_Debug;
spark_Debug.__name__ = ["spark","Debug"];
spark_Debug.init = function() {
	var _this = window.document;
	spark_Debug.perfCanvas = _this.createElement("canvas");
	if(spark_Debug.perfCanvas != null) {
		spark_Debug.perfCanvas.width = Spark.canvas.width;
		spark_Debug.perfCanvas.height = 200;
		spark_Debug.perfView = spark_Debug.perfCanvas.getContext("2d",null);
	}
};
spark_Debug.enable = function(flag) {
	if(flag == null) flag = 1;
	spark_Debug.flags |= flag;
};
spark_Debug.disable = function(flag) {
	if(flag == null) flag = 65535;
	spark_Debug.flags &= ~flag;
};
spark_Debug.isEnabled = function(flag) {
	return (spark_Debug.flags & flag) != 0;
};
spark_Debug.beginUpdate = function() {
	spark_Debug.updateTime = window.performance.now();
};
spark_Debug.endUpdate = function() {
	spark_Debug.updateTime = window.performance.now() - spark_Debug.updateTime;
};
spark_Debug.beginCollision = function() {
	spark_Debug.collisionTime = window.performance.now();
};
spark_Debug.endCollision = function() {
	spark_Debug.collisionTime = window.performance.now() - spark_Debug.collisionTime;
};
spark_Debug.beginDraw = function() {
	spark_Debug.drawTime = window.performance.now();
};
spark_Debug.endDraw = function() {
	spark_Debug.drawTime = window.performance.now() - spark_Debug.drawTime;
};
spark_Debug.beginGui = function() {
	spark_Debug.guiTime = window.performance.now();
};
spark_Debug.endGui = function() {
	spark_Debug.guiTime = window.performance.now() - spark_Debug.guiTime;
};
spark_Debug.drawPerf = function(frame,stats) {
	if(spark_Debug.perfView == null || !spark_Debug.isEnabled(spark_Debug.PERF)) return;
	if(spark_Debug.perfCanvas.width != Spark.canvas.width) spark_Debug.perfCanvas.width = Spark.canvas.width;
	var w = spark_Debug.perfCanvas.width;
	var h = spark_Debug.perfCanvas.height;
	var x = frame % (w / 2) * 2;
	var y = h / 2;
	var updateY = Math.round(spark_Debug.updateTime * 60 * y / 1000);
	var collisionY = Math.round(spark_Debug.collisionTime * 60 * y / 1000);
	var drawY = Math.round(spark_Debug.drawTime * 60 * y / 1000);
	var guiY = Math.round(spark_Debug.guiTime * 60 * y / 1000);
	spark_Debug.perfView.clearRect(x,0,10,h);
	spark_Debug.perfView.lineWidth = 2;
	spark_Debug.perfView.fillStyle = "#000";
	spark_Debug.perfView.strokeStyle = "#66b2ff";
	spark_Debug.perfView.beginPath();
	spark_Debug.perfView.moveTo(x,h);
	spark_Debug.perfView.lineTo(x,h - updateY);
	spark_Debug.perfView.stroke();
	spark_Debug.perfView.strokeStyle = "#c354ff";
	spark_Debug.perfView.beginPath();
	spark_Debug.perfView.moveTo(x,h - updateY);
	spark_Debug.perfView.lineTo(x,h - updateY - collisionY);
	spark_Debug.perfView.stroke();
	spark_Debug.perfView.strokeStyle = "#2dffb2";
	spark_Debug.perfView.beginPath();
	spark_Debug.perfView.moveTo(x,h - updateY - collisionY);
	spark_Debug.perfView.lineTo(x,h - updateY - collisionY - drawY);
	spark_Debug.perfView.stroke();
	spark_Debug.perfView.strokeStyle = "#fa5882";
	spark_Debug.perfView.beginPath();
	spark_Debug.perfView.moveTo(x,h - updateY - collisionY - drawY);
	spark_Debug.perfView.lineTo(x,h - updateY - collisionY - drawY - guiY);
	spark_Debug.perfView.stroke();
	spark_Debug.perfView.strokeStyle = "#333";
	spark_Debug.perfView.beginPath();
	spark_Debug.perfView.moveTo(0,y);
	spark_Debug.perfView.lineTo(w,y);
	spark_Debug.perfView.stroke();
	Spark.view.save();
	Spark.view.setTransform(1,0,0,1,0,0);
	Spark.view.drawImage(spark_Debug.perfCanvas,0,Spark.canvas.height - h);
	Spark.view.font = "bold 10px \"Courier New\", sans-serif";
	Spark.view.fillStyle = "#66b2ff";
	Spark.view.fillText("Update    : " + spark_Util.flToStr(spark_Debug.updateTime,3) + "ms",10,Spark.canvas.height - y - 24);
	Spark.view.fillStyle = "#c354ff";
	Spark.view.fillText("Collision : " + spark_Util.flToStr(spark_Debug.collisionTime,3) + "ms",10,Spark.canvas.height - y - 36);
	Spark.view.fillStyle = "#2dffb2";
	Spark.view.fillText("Draw      : " + spark_Util.flToStr(spark_Debug.drawTime,3) + "ms",10,Spark.canvas.height - y - 48);
	Spark.view.fillStyle = "#fa5882";
	Spark.view.fillText("GUI       : " + spark_Util.flToStr(spark_Debug.guiTime,3) + "ms",10,Spark.canvas.height - y - 60);
	if(stats != null) {
		Spark.view.fillStyle = "#ccc";
		Spark.view.fillText("FPS       : " + spark_Util.flToStr(stats.fps,1),10,Spark.canvas.height - y - 2);
		Spark.view.fillStyle = "#ff8000";
		Spark.view.fillText("Layers    : " + stats.layers,10,Spark.canvas.height - y - 96);
		Spark.view.fillText("Sprites   : " + stats.sprites,10,Spark.canvas.height - y - 84);
	}
};
var spark_Game = $hx_exports.spark.Game = function() { };
$hxClasses["spark.Game"] = spark_Game;
spark_Game.__name__ = ["spark","Game"];
spark_Game.project = null;
spark_Game.scene = null;
spark_Game.main = function(projectFile,onload) {
	spark_Game.project = new spark_Project(projectFile,onload);
	spark_Game.scene = null;
};
spark_Game.getProject = function() {
	return spark_Game.project;
};
spark_Game.getEmitter = function(src) {
	return spark_Game.project.get(src);
};
spark_Game.getFont = function(src) {
	return spark_Game.project.get(src);
};
spark_Game.getSound = function(src) {
	return spark_Game.project.get(src);
};
spark_Game.getTexture = function(src) {
	return spark_Game.project.get(src);
};
spark_Game.getTimeline = function(src) {
	return spark_Game.project.get(src);
};
var spark_Joystick = $hx_exports.spark.Joystick = function() { };
$hxClasses["spark.Joystick"] = spark_Joystick;
spark_Joystick.__name__ = ["spark","Joystick"];
spark_Joystick.devices = null;
spark_Joystick.install = function() {
	var i;
	spark_Joystick.devices = new haxe_ds_IntMap();
	var gamepads = window.navigator.getGamepads();
	var _g1 = 0;
	var _g = gamepads.length;
	while(_g1 < _g) {
		var i1 = _g1++;
		if(gamepads[i1] == null) continue;
		var device = new spark_input_Device(gamepads[i1].buttons.length,gamepads[i1].axes.length >> 1);
		if(gamepads[i1].connected) device.attach();
		spark_Joystick.devices.h[gamepads[i1].index] = device;
	}
};
spark_Joystick.flush = function() {
	var device;
	var gamepads = window.navigator.getGamepads();
	var $it0 = spark_Joystick.devices.iterator();
	while( $it0.hasNext() ) {
		var device1 = $it0.next();
		device1.flush();
	}
	var _g1 = 0;
	var _g = gamepads.length;
	while(_g1 < _g) {
		var i = _g1++;
		var axis;
		var button;
		if(gamepads[i] == null) continue;
		var device2 = spark_Joystick.devices.h[gamepads[i].index];
		if(device2 == null || !gamepads[i].connected) continue;
		var _g3 = 0;
		var _g2 = gamepads[i].axes.length >> 1;
		while(_g3 < _g2) {
			var axis1 = _g3++;
			device2.move(axis1,gamepads[i].axes[axis1 * 2],gamepads[i].axes[axis1 * 2 + 1]);
		}
		var _g31 = 0;
		var _g21 = gamepads[i].buttons.length;
		while(_g31 < _g21) {
			var button1 = _g31++;
			if(gamepads[i].buttons[button1].pressed) device2.press(button1); else device2.release(button1);
		}
	}
};
spark_Joystick.isConnected = function(joy) {
	if(joy == null) joy = 0;
	return spark_Joystick.devices.h.hasOwnProperty(joy) && spark_Joystick.devices.h[joy].isConnected();
};
spark_Joystick.getLeftX = function(joy) {
	if(joy == null) joy = 0;
	if(spark_Joystick.isConnected(joy)) return spark_Joystick.devices.h[joy].getX(0); else return 0;
};
spark_Joystick.getRightX = function(joy) {
	if(joy == null) joy = 0;
	if(spark_Joystick.isConnected(joy)) return spark_Joystick.devices.h[joy].getX(1); else return 0;
};
spark_Joystick.getRightY = function(joy) {
	if(joy == null) joy = 0;
	if(spark_Joystick.isConnected(joy)) return spark_Joystick.devices.h[joy].getY(1); else return 0;
};
spark_Joystick.getLeftRelX = function(joy) {
	if(joy == null) joy = 0;
	if(spark_Joystick.isConnected(joy)) return spark_Joystick.devices.h[joy].getRelX(0); else return 0;
};
spark_Joystick.getLeftRelY = function(joy) {
	if(joy == null) joy = 0;
	if(spark_Joystick.isConnected(joy)) return spark_Joystick.devices.h[joy].getRelY(0); else return 0;
};
spark_Joystick.getRightRelX = function(joy) {
	if(joy == null) joy = 0;
	if(spark_Joystick.isConnected(joy)) return spark_Joystick.devices.h[joy].getRelX(1); else return 0;
};
spark_Joystick.getRightRelY = function(joy) {
	if(joy == null) joy = 0;
	if(spark_Joystick.isConnected(joy)) return spark_Joystick.devices.h[joy].getRelY(1); else return 0;
};
spark_Joystick.hit = function(joy,button) {
	if(button == null) button = 0;
	if(spark_Joystick.isConnected(joy)) return spark_Joystick.devices.h[joy].hit(button); else return false;
};
spark_Joystick.down = function(joy,button) {
	if(button == null) button = 0;
	if(spark_Joystick.isConnected(joy)) return spark_Joystick.devices.h[joy].down(button); else return false;
};
spark_Joystick.hits = function(joy,button) {
	if(button == null) button = 0;
	if(spark_Joystick.isConnected(joy)) return spark_Joystick.devices.h[joy].hits(button); else return 0;
};
var spark_Key = $hx_exports.spark.Key = function() { };
$hxClasses["spark.Key"] = spark_Key;
spark_Key.__name__ = ["spark","Key"];
spark_Key.device = null;
spark_Key.install = function() {
	spark_Key.device = new spark_input_Device(256,0);
	window.addEventListener("keydown",spark_Key.onKeyDown,false);
	window.addEventListener("keyup",spark_Key.onKeyUp,false);
	spark_Key.device.attach();
};
spark_Key.flush = function() {
	spark_Key.device.flush();
};
spark_Key.hit = function(key) {
	return spark_Key.device.hit(key);
};
spark_Key.down = function(key) {
	return spark_Key.device.down(key);
};
spark_Key.hits = function(key) {
	return spark_Key.device.hits(key);
};
spark_Key.onKeyDown = function(event) {
	if(!event.repeat) spark_Key.device.press(event.keyCode);
};
spark_Key.onKeyUp = function(event) {
	spark_Key.device.release(event.keyCode);
};
var spark_Mat = $hx_exports.spark.Mat = function(x,y,rx,ry,sx,sy) {
	this.p = new spark_Vec(x,y);
	this.r = new spark_Vec(rx,ry);
	this.s = new spark_Vec(sx,sy);
};
$hxClasses["spark.Mat"] = spark_Mat;
spark_Mat.__name__ = ["spark","Mat"];
spark_Mat.identity = function() {
	return new spark_Mat(0,0,1,0,1,1);
};
spark_Mat.prototype = {
	p: null
	,r: null
	,s: null
	,inverse: function() {
		return new spark_Mat(-this.p.x,-this.p.y,this.r.x,-this.r.y,1 / this.s.x,1 / this.s.y);
	}
	,get_angle: function() {
		return this.r.angle();
	}
	,set_angle: function(a) {
		this.r.setAngle(a);
		return a;
	}
	,translate: function(x,y,local) {
		if(local == null) local = false;
		var dx = x;
		var dy = y;
		if(local) {
			dx = x * this.r.x - y * this.r.y;
			dy = y * this.r.x + x * this.r.y;
		}
		this.p.x += dx;
		this.p.y += dy;
	}
	,rotate: function(r) {
		var x = Math.cos(spark_Util.degToRad(r));
		var y = Math.sin(spark_Util.degToRad(r));
		this.r.set(this.r.x * x - this.r.y * y,this.r.y * x + this.r.x * y);
	}
	,scale: function(x,y) {
		this.s.x *= x;
		if(y == null) this.s.y *= x; else this.s.y *= y;
	}
	,transform: function(v) {
		var x = v.x * this.s.x * this.r.x - v.y * this.s.y * this.r.y;
		var y = v.y * this.s.y * this.r.x + v.x * this.s.x * this.r.y;
		return new spark_Vec(x + this.p.x,y + this.p.y);
	}
	,untransform: function(v) {
		var x = v.x - this.p.x;
		var y = v.y - this.p.y;
		return new spark_Vec(x * this.r.x / this.s.x + y * this.r.y / this.s.y,y * this.r.x / this.s.y - x * this.r.y / this.s.x);
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
		Spark.view.transform(a,b,-c,d,e,f);
	}
	,__class__: spark_Mat
	,__properties__: {set_angle:"set_angle",get_angle:"get_angle"}
};
var spark_Mouse = $hx_exports.spark.Mouse = function() { };
$hxClasses["spark.Mouse"] = spark_Mouse;
spark_Mouse.__name__ = ["spark","Mouse"];
spark_Mouse.device = null;
spark_Mouse.install = function() {
	spark_Mouse.device = new spark_input_Device(32,1);
	window.addEventListener("mousedown",spark_Mouse.onMouseDown,false);
	window.addEventListener("mouseup",spark_Mouse.onMouseUp,false);
	window.addEventListener("mousemove",spark_Mouse.onMouseMove,false);
	spark_Mouse.device.attach();
};
spark_Mouse.flush = function() {
	spark_Mouse.device.flush();
};
spark_Mouse.hide = function() {
	Spark.canvas.style.cursor = "none";
};
spark_Mouse.show = function(image) {
	if(image == null) Spark.canvas.style.cursor = "pointer"; else Spark.canvas.style.cursor = image;
};
spark_Mouse.getX = function() {
	return spark_Mouse.device.getX(0);
};
spark_Mouse.getY = function() {
	return spark_Mouse.device.getY(0);
};
spark_Mouse.getRelX = function() {
	return spark_Mouse.device.getRelX(0);
};
spark_Mouse.getRelY = function() {
	return spark_Mouse.device.getRelY(0);
};
spark_Mouse.hit = function(button) {
	if(button == null) button = 0;
	return spark_Mouse.device.hit(button);
};
spark_Mouse.down = function(button) {
	if(button == null) button = 0;
	return spark_Mouse.device.down(button);
};
spark_Mouse.hits = function(button) {
	if(button == null) button = 0;
	return spark_Mouse.device.hits(button);
};
spark_Mouse.onMouseDown = function(event) {
	spark_Mouse.device.press(event.button);
};
spark_Mouse.onMouseUp = function(event) {
	spark_Mouse.device.release(event.button);
};
spark_Mouse.onMouseMove = function(event) {
	var x = event.clientX - Spark.canvas.offsetLeft;
	var y = event.clientY - Spark.canvas.offsetTop;
	spark_Mouse.device.move(0,x,y);
};
var spark_Project = function(projectFile,onload) {
	var _g = this;
	var root = projectFile.split("/").slice(0,-1).join("/") + "/";
	this.assets = new haxe_ds_StringMap();
	this.loadQueue = [];
	this.info = { title : "Untitled", version : "1.0", path : root};
	Spark.loadXML(projectFile,function(doc) {
		var assets;
		var asset;
		var project = doc.firstElementChild;
		if(project == null || project.nodeName != "project") throw new js__$Boot_HaxeError("Invalid Spark project file: " + projectFile);
		spark_Util.mergeElement(_g.info,project);
		var _g1 = 0;
		var _g2 = project.getElementsByTagName("assets");
		while(_g1 < _g2.length) {
			var assets1 = _g2[_g1];
			++_g1;
			var assetPath = assets1.getAttribute("path");
			var _g3 = 0;
			var _g4 = assets1.getElementsByTagName("asset");
			while(_g3 < _g4.length) {
				var asset1 = _g4[_g3];
				++_g3;
				var src = asset1.getAttribute("src");
				var id = asset1.getAttribute("id");
				var ref = asset1.getAttribute("class");
				if(id == null) id = src;
				if(src != null) {
					var path = _g.info.path + assetPath + src;
					if(ref != null) _g.load(id,path,Type.resolveClass(ref)); else _g.load(id,path);
				}
			}
		}
		onload(_g);
	});
};
$hxClasses["spark.Project"] = spark_Project;
spark_Project.__name__ = ["spark","Project"];
spark_Project.prototype = {
	info: null
	,assets: null
	,loadQueue: null
	,load: function(id,src,classRef) {
		if(classRef == null) {
			classRef = spark_Asset.classOfExt(src.split("/").pop().split(".").pop());
			if(classRef == null) {
				haxe_Log.trace("Unknown asset type \"" + src + "\"; skipping...",{ fileName : "Project.hx", lineNumber : 87, className : "spark.Project", methodName : "load"});
				return null;
			}
		}
		if(this.assets.exists(id)) {
			haxe_Log.trace("Asset \"" + id + "\" already loaded; skipping...",{ fileName : "Project.hx", lineNumber : 94, className : "spark.Project", methodName : "load"});
			return null;
		}
		var asset = Type.createInstance(classRef,[src]);
		this.assets.set(id,asset);
		this.loadQueue.push(asset);
		return asset;
	}
	,get: function(id) {
		return this.assets.get(id);
	}
	,launch: function(onload) {
		var _g = this;
		var n = 0;
		var i;
		var _g1 = 0;
		var _g2 = this.loadQueue.length;
		while(_g1 < _g2) {
			var i1 = _g1++;
			if(this.loadQueue[i1].isLoaded()) n++;
		}
		if(n == this.loadQueue.length) onload(); else window.requestAnimationFrame(function(now) {
			var x = Spark.canvas.width / 2;
			var y = Spark.canvas.height / 2;
			var w = x * 3 / 5;
			Spark.view.save();
			Spark.view.setTransform(1,0,0,1,0,0);
			Spark.view.clearRect(0,0,Spark.canvas.width,Spark.canvas.height);
			Spark.view.strokeStyle = "#fff";
			Spark.view.shadowBlur = 10;
			Spark.view.shadowOffsetX = 0;
			Spark.view.shadowOffsetY = 0;
			Spark.view.shadowColor = "#fff";
			Spark.view.font = "bold 10px \"Courier\", sans-serif";
			Spark.view.fillStyle = "#fff";
			Spark.view.fillText("Loading...",10,Spark.canvas.height - 10);
			Spark.view.beginPath();
			Spark.view.moveTo(x - w,y);
			Spark.view.lineTo(x - w + w * 2 * js_Boot.__cast(n , Float) / _g.loadQueue.length,y);
			Spark.view.stroke();
			Spark.view.restore();
			_g.launch(onload);
		});
	}
	,__class__: spark_Project
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
	,getWidth: function() {
		return this.width;
	}
	,getHeight: function() {
		return this.height;
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
	if(origin == null) _g = "top-left"; else _g = origin;
	switch(_g) {
	case "top-left":
		x = 0;
		y = 0;
		break;
	case "top-middle":
		x = w / 2;
		y = 0;
		break;
	case "top-right":
		x = w;
		y = 0;
		break;
	case "bottom-left":
		x = 0;
		y = h;
		break;
	case "bottom-middle":
		x = w / 2;
		y = h;
		break;
	case "bottom-right":
		x = w;
		y = h;
		break;
	case "middle-left":
		x = 0;
		y = h / 2;
		break;
	case "middle-right":
		x = w;
		y = h / 2;
		break;
	case "middle":
		x = w / 2;
		y = h / 2;
		break;
	}
	this.rect = new spark_Rect(-x,-y,w,h);
	this.camera = new spark_object_Camera(Spark.canvas.width,Spark.canvas.height);
	this.layers = [];
};
$hxClasses["spark.Scene"] = spark_Scene;
spark_Scene.__name__ = ["spark","Scene"];
spark_Scene.prototype = {
	frametime: null
	,framecount: null
	,runloop: null
	,space: null
	,layers: null
	,rect: null
	,camera: null
	,setViewport: function(w,h) {
		if(w == null) w = Spark.canvas.width; else w = w;
		if(h == null) h = w * Spark.canvas.height / Spark.canvas.width;
		this.camera.m.s.set(w / 2,h / 2);
	}
	,newBackgroundLayer: function(texture,tiled) {
		if(tiled == null) tiled = true;
		var layer = new spark_object_layer_BackgroundLayer(texture,tiled);
		this.layers.push(layer);
		return layer;
	}
	,newSpriteLayer: function(n) {
		if(n == null) n = 100;
		var layer = new spark_object_layer_SpriteLayer(n);
		this.layers.push(layer);
		return layer;
	}
	,run: function() {
		this.framecount = 0;
		this.frametime = window.performance.now();
		this.runloop = window.requestAnimationFrame($bind(this,this.stepFrame));
		spark_Game.scene = this;
	}
	,quit: function() {
		window.cancelAnimationFrame(this.runloop);
	}
	,stepFrame: function(now) {
		var step = (now - this.frametime) / 1000;
		this.frametime = now;
		this.framecount++;
		spark_Debug.beginUpdate();
		this.update(step);
		spark_Debug.endUpdate();
		spark_Debug.beginCollision();
		this.processCollisions();
		spark_Debug.endCollision();
		spark_Debug.beginDraw();
		this.draw();
		spark_Debug.endDraw();
		spark_Debug.beginGui();
		spark_Debug.endGui();
		spark_Key.flush();
		spark_Mouse.flush();
		spark_Joystick.flush();
		if(spark_Debug.isEnabled(spark_Debug.PERF)) {
			var stats = { fps : 1 / step, layers : 0, sprites : 0};
			var _g1 = 0;
			var _g = this.layers.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.layers[i].debugStats(stats);
			}
			spark_Debug.drawPerf(this.framecount,stats);
		}
		if(spark_Game.scene == this) this.runloop = window.requestAnimationFrame($bind(this,this.stepFrame));
	}
	,update: function(step) {
		var i;
		this.camera.update(step);
		var _g1 = 0;
		var _g = this.layers.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			this.layers[i1].update(step);
		}
	}
	,processCollisions: function() {
		this.space = new spark_collision_Quadtree(this.rect);
		var _g1 = 0;
		var _g = this.layers.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.layers[i].updateCollision(this.space);
		}
		this.space.processCollisions();
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
		var mx = this.rect.getLeft() + this.rect.getWidth() / 2;
		var my = this.rect.getTop() + this.rect.getHeight() / 2;
		Spark.view.setTransform(w2,0,0,h2,w2,h2);
		this.camera.draw();
		Spark.view.translate(-mx,-my);
		var _g1 = 0;
		var _g = this.layers.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			this.layers[i1].draw();
		}
		if(spark_Debug.isEnabled(spark_Debug.COLLISION)) this.space.draw();
		Spark.view.restore();
	}
	,worldToScreen: function(x,y) {
		var mx = this.rect.getLeft() + this.rect.getWidth() / 2;
		var my = this.rect.getTop() + this.rect.getHeight() / 2;
		var cx = x - (this.camera.m.p.x + mx);
		var cy = y - (this.camera.m.p.y + my);
		var rx = cx * this.camera.m.r.x + cy * this.camera.m.r.y;
		var ry = cy * this.camera.m.r.x - cx * this.camera.m.r.y;
		var sx = rx * Spark.canvas.height / (2 * this.camera.m.s.x);
		var sy = ry * Spark.canvas.width / (2 * this.camera.m.s.y);
		return new spark_Vec(sx + Spark.canvas.width / 2,sy + Spark.canvas.height / 2);
	}
	,screenToWorld: function(x,y) {
		var cx = (x - Spark.canvas.width / 2) * this.camera.m.s.x * 2 / Spark.canvas.width;
		var cy = (y - Spark.canvas.height / 2) * this.camera.m.s.y * 2 / Spark.canvas.height;
		var vx = cx * this.camera.m.r.x - cy * this.camera.m.r.y;
		var vy = cy * this.camera.m.r.x + cx * this.camera.m.r.y;
		var mx = this.rect.getLeft() + this.rect.getWidth() / 2;
		var my = this.rect.getTop() + this.rect.getHeight() / 2;
		return new spark_Vec(vx + this.camera.m.p.x + mx,vy + this.camera.m.p.y + my);
	}
	,pick: function(x,y,radius) {
		if(radius == null) radius = 5;
		if(this.space == null) return [];
		var c = this.screenToWorld(x,y);
		if(!this.rect.contains(c.x,c.y)) return [];
		var shape = new spark_collision_shape_Circle(null,c.x,c.y,radius);
		shape.updateShapeCache(spark_Mat.identity());
		return this.space.collect(shape);
	}
	,__class__: spark_Scene
};
var spark_Util = $hx_exports.spark.Util = function() { };
$hxClasses["spark.Util"] = spark_Util;
spark_Util.__name__ = ["spark","Util"];
spark_Util.flToStr = function(f,prec) {
	if(prec == null) prec = 2;
	var s = "" + f * Math.pow(10,prec) / Math.pow(10,prec);
	var n = s.lastIndexOf(".");
	if(n < 0) return StringTools.rpad(s + ".","0",s.length + 1 + prec);
	if(s.length - n < prec) return StringTools.rpad(s,"0",s.length - n + prec);
	return HxOverrides.substr(s,0,n + 1 + prec);
};
spark_Util.degToRad = function(r) {
	return r * Math.PI / 180.0;
};
spark_Util.radToDeg = function(r) {
	return r * 180.0 / Math.PI;
};
spark_Util.sign = function(n) {
	if(Math.abs(n) < 0.00001) return 0; else if(n > 0) return 1; else return -1;
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
spark_Util.merge = function(a,b) {
	var i;
	var fields = Reflect.fields(b);
	var _g1 = 0;
	var _g = fields.length;
	while(_g1 < _g) {
		var i1 = _g1++;
		Reflect.setField(a,fields[i1],Reflect.field(b,fields[i1]));
	}
};
spark_Util.mergeElement = function(obj,node) {
	var i;
	var fields = Reflect.fields(obj);
	var _g1 = 0;
	var _g = fields.length;
	while(_g1 < _g) {
		var i1 = _g1++;
		var attr = node.getAttribute(fields[i1]);
		if(attr != null) obj[fields[i1]] = attr;
	}
};
var spark_Vec = $hx_exports.spark.Vec = function(x,y) {
	this.x = x;
	this.y = y;
};
$hxClasses["spark.Vec"] = spark_Vec;
spark_Vec.__name__ = ["spark","Vec"];
spark_Vec.zero = function() {
	return new spark_Vec(0,0);
};
spark_Vec.one = function() {
	return new spark_Vec(1,1);
};
spark_Vec.right = function() {
	return new spark_Vec(1,0);
};
spark_Vec.up = function() {
	return new spark_Vec(0,1);
};
spark_Vec.axis = function(angle,scale) {
	if(scale == null) scale = 1;
	var x = Math.cos(spark_Util.degToRad(angle));
	var y = Math.sin(spark_Util.degToRad(angle));
	return new spark_Vec(x * scale,y * scale);
};
spark_Vec.prototype = {
	x: null
	,y: null
	,copy: function() {
		return new spark_Vec(this.x,this.y);
	}
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
	,angle: function() {
		return spark_Util.radToDeg(Math.atan2(this.y,this.x));
	}
	,setAngle: function(angle) {
		this.x = Math.cos(spark_Util.degToRad(angle));
		this.y = Math.sin(spark_Util.degToRad(angle));
	}
	,rotate: function(r) {
		return new spark_Vec(this.x * r.x - this.y * r.y,this.y * r.x + this.x * r.y);
	}
	,unrotate: function(r) {
		return new spark_Vec(this.x * r.x + this.y * r.y,this.y * r.x - this.x * r.y);
	}
	,__class__: spark_Vec
};
var spark_anim_Rig = function() {
	this.anims = [];
};
$hxClasses["spark.anim.Rig"] = spark_anim_Rig;
spark_anim_Rig.__name__ = ["spark","anim","Rig"];
spark_anim_Rig.prototype = {
	anims: null
	,play: function(anim) {
		this.anims.push(anim);
	}
	,stop: function(anim) {
		var i = HxOverrides.indexOf(this.anims,anim,0);
		if(i >= 0) {
			var last = this.anims.pop();
			if(i < this.anims.length) this.anims[i] = last;
		}
	}
	,update: function(step) {
		var i = 0;
		while(i < this.anims.length) if(this.anims[i](step)) {
			var last = this.anims.pop();
			if(i < this.anims.length) this.anims[i] = last;
		} else i++;
	}
	,__class__: spark_anim_Rig
};
var spark_anim_Timeline = function(src) {
	var _g = this;
	spark_Asset.call(this,src);
	this.tweens = null;
	this.data = { fps : 30, duration : 30, loop : false, tracks : null, events : []};
	Spark.loadJSON(src,function(json) {
		spark_Util.merge(_g.data,json);
		_g.data.events.sort(function(a,b) {
			return a.frame - b.frame;
		});
		if(_g.data.tracks != null) {
			var i;
			var fields = Reflect.fields(_g.data.tracks);
			_g.tweens = new haxe_ds_StringMap();
			var _g2 = 0;
			var _g1 = fields.length;
			while(_g2 < _g1) {
				var i1 = _g2++;
				var field = fields[i1];
				var track = Reflect.field(_g.data.tracks,field);
				var keys = track.keys;
				var method = track.method;
				if(keys == null || keys.length < 2) continue;
				if(method == null) method = "cubic";
				_g.tweens.set(field,new spark_anim_Tween(keys,_g.data.fps,_g.data.duration,method));
			}
		}
		_g.loaded = true;
	});
};
$hxClasses["spark.anim.Timeline"] = spark_anim_Timeline;
spark_anim_Timeline.__name__ = ["spark","anim","Timeline"];
spark_anim_Timeline.__super__ = spark_Asset;
spark_anim_Timeline.prototype = $extend(spark_Asset.prototype,{
	data: null
	,tweens: null
	,playOn: function(obj,onevent) {
		var rig = new spark_anim_Rig();
		var prop;
		if(this.tweens != null) {
			var $it0 = this.tweens.keys();
			while( $it0.hasNext() ) {
				var prop1 = $it0.next();
				this.tweens.get(prop1).playOn(obj,prop1,this.data.loop);
			}
		}
		var timeline = this;
		var eventIndex = 0;
		var time = 0.0;
		var anim = function(step) {
			var frame = Math.floor((time += step) * (timeline.data.fps % timeline.data.duration));
			if(timeline.data.events.length > 0) while(timeline.data.events[eventIndex].frame <= frame + 1) {
				onevent(timeline.data.events[eventIndex++].event);
				if(eventIndex == timeline.data.events.length) {
					eventIndex = 0;
					break;
				}
			}
			if(timeline.data.loop) return false; else return time > timeline.data.fps * timeline.data.duration;
		};
		obj.rig.play(anim);
	}
	,__class__: spark_anim_Timeline
});
var spark_anim_Tween = function(keys,fps,duration,interp) {
	if(interp == null) interp = "cubic";
	var i = 0;
	var k;
	this.fps = fps;
	this.duration = duration;
	var this1;
	this1 = new Array(duration);
	this.keys = this1;
	keys.sort(function(a,b) {
		return a.frame - b.frame;
	});
	while(i < keys.length - 1 && keys[i + 1].frame < 1) i++;
	var hks = keys.slice(i);
	var tangent;
	var this2;
	this2 = new Array(hks.length);
	tangent = this2;
	var _g1 = 1;
	var _g = hks.length - 1;
	while(_g1 < _g) {
		var i1 = _g1++;
		if(hks[i1].tangent != null) tangent[i1] = hks[i1].tangent; else {
			var pk = hks[i1 - 1];
			var tk = hks[i1];
			var nk = hks[i1 + 1];
			var dtp = (tk.value - pk.value) / (tk.frame - pk.frame);
			var dtn = (nk.value - tk.value) / (nk.frame - tk.frame);
			tangent[i1] = (dtp + dtn) / 2;
		}
	}
	var p;
	if(hks[0].frame < 1) p = hks.shift(); else p = hks[0];
	var _g11 = 1;
	var _g2 = this.duration + 1;
	while(_g11 < _g2) {
		var i2 = _g11++;
		var n = hks[0];
		if(i2 == n.frame) {
			this.keys[i2 - 1] = n.value;
			p = hks.shift();
		} else if(interp != null) switch(interp) {
		case "step":
			this.keys[i2 - 1] = p.value;
			break;
		case "linear":
			var val = spark_Util.lerp(p.value,n.value,i2 - p.frame,n.frame - p.frame);
			this.keys[i2 - 1] = val;
			break;
		case "cubic":
			var u = (i2 - p.frame) / (n.frame - p.frame);
			var h0 = u * u * u * 2 - u * u * 3 + 1;
			var h1 = u * u * u * -2 + u * u * 3;
			var h2 = u * u * u - u * u * 2 + u;
			var h3 = u * u * u - u * u;
			var p0 = p.value;
			var p1 = n.value;
			var t0 = spark_Util.degToRad(tangent[p.frame] == null?0:tangent[p.frame]);
			var t1 = spark_Util.degToRad(tangent[n.frame] == null?0:tangent[n.frame]);
			this.keys[i2 - 1] = h0 * p0 + h1 * p1 + h2 * t0 + h3 * t1;
			break;
		}
	}
};
$hxClasses["spark.anim.Tween"] = spark_anim_Tween;
spark_anim_Tween.__name__ = ["spark","anim","Tween"];
spark_anim_Tween.prototype = {
	fps: null
	,duration: null
	,keys: null
	,playOn: function(obj,property,loop) {
		if(loop == null) loop = false;
		var path = property.split(".");
		var key = path.pop();
		var rig = obj.rig;
		while(path.length > 0) {
			obj = Reflect.field(obj,path.shift());
			if(obj == null) throw new js__$Boot_HaxeError("Cannot find property \"" + property + "\" on object");
		}
		var tween = this;
		var time = 0.0;
		var anim = function(step) {
			var frame = Math.floor((time += step) * tween.fps);
			var shouldStop = false;
			if(frame >= tween.duration) {
				shouldStop = !loop;
				if(!shouldStop) {
					time %= js_Boot.__cast(tween.duration , Float) / tween.fps;
					frame = Math.floor(time * tween.fps);
				} else frame = tween.duration - 1;
			}
			Reflect.setProperty(obj,key,tween.keys[frame]);
			return shouldStop;
		};
		rig.play(anim);
	}
	,__class__: spark_anim_Tween
};
var spark_audio_Sound = function(src) {
	var _g = this;
	spark_Asset.call(this,src);
	Spark.loadXHR(src,"arraybuffer",function(req) {
		Spark.audio.decodeAudioData(req.response,function(buffer) {
			_g.buffer = buffer;
			_g.loaded = true;
		});
	});
};
$hxClasses["spark.audio.Sound"] = spark_audio_Sound;
spark_audio_Sound.__name__ = ["spark","audio","Sound"];
spark_audio_Sound.__super__ = spark_Asset;
spark_audio_Sound.prototype = $extend(spark_Asset.prototype,{
	buffer: null
	,createSource: function() {
		if(this.loaded == false) return null;
		var source = Spark.audio.createBufferSource();
		source.buffer = this.buffer;
		source.connect(Spark.audio.destination);
		return source;
	}
	,woof: function() {
		var source = this.createSource();
		if(source != null) source.start();
		return source;
	}
	,loop: function() {
		var source = this.createSource();
		if(source != null) {
			source.loop = true;
			source.start();
		}
		return source;
	}
	,__class__: spark_audio_Sound
});
var spark_collision_Body = function(object,filter,oncollision) {
	this.object = object;
	this.filter = filter;
	this.oncollision = oncollision;
	this.shapes = [];
};
$hxClasses["spark.collision.Body"] = spark_collision_Body;
spark_collision_Body.__name__ = ["spark","collision","Body"];
spark_collision_Body.prototype = {
	object: null
	,filter: null
	,shapes: null
	,oncollision: null
	,getObject: function() {
		return this.object;
	}
	,getFilter: function() {
		return this.filter;
	}
	,updateShapeCache: function(m) {
		var i;
		var _g1 = 0;
		var _g = this.shapes.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			this.shapes[i1].updateShapeCache(m);
		}
	}
	,addToQuadtree: function(space) {
		var i;
		var _g1 = 0;
		var _g = this.shapes.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			space.addShape(this.shapes[i1]);
		}
	}
	,addSegmentShape: function(x1,y1,x2,y2) {
		this.shapes.push(new spark_collision_shape_Segment(this,x1,y1,x2,y2));
	}
	,addCircleShape: function(x,y,radius) {
		this.shapes.push(new spark_collision_shape_Circle(this,x,y,radius));
	}
	,addBoxShape: function(x,y,width,height) {
		this.shapes.push(new spark_collision_shape_Box(this,x,y,width,height));
	}
	,collide: function(body) {
		if(this.oncollision != null && body.filter != null) this.oncollision(this,body);
	}
	,__class__: spark_collision_Body
};
var spark_collision_Quadtree = function(rect,depth) {
	if(depth == null) depth = 0;
	this.rect = rect;
	this.depth = depth;
	this.shapes = [];
	this.nodes = [];
};
$hxClasses["spark.collision.Quadtree"] = spark_collision_Quadtree;
spark_collision_Quadtree.__name__ = ["spark","collision","Quadtree"];
spark_collision_Quadtree.prototype = {
	rect: null
	,nodes: null
	,shapes: null
	,depth: null
	,addShape: function(shape) {
		var _g = this;
		var i;
		if(this.depth > 0 && !shape.within(this.rect)) return false;
		var _g1 = 0;
		var _g2 = this.nodes.length;
		while(_g1 < _g2) {
			var i1 = _g1++;
			if(this.nodes[i1].addShape(shape)) return true;
		}
		this.shapes.push(shape);
		if(this.depth < spark_collision_Quadtree.DEPTH_LIMIT && this.shapes.length >= spark_collision_Quadtree.SHAPE_LIMIT && this.nodes.length == 0) {
			var w = this.rect.getWidth() / 2;
			var h = this.rect.getHeight() / 2;
			var x = this.rect.getLeft();
			var y = this.rect.getTop();
			this.nodes = [new spark_collision_Quadtree(new spark_Rect(x,y,w,h),this.depth + 1),new spark_collision_Quadtree(new spark_Rect(x + w,y,w,h),this.depth + 1),new spark_collision_Quadtree(new spark_Rect(x,y + h,w,h),this.depth + 1),new spark_collision_Quadtree(new spark_Rect(x + w,y + h,w,h),this.depth + 1)];
			this.shapes = this.shapes.filter(function(shape1) {
				var i2;
				var _g21 = 0;
				var _g11 = _g.nodes.length;
				while(_g21 < _g11) {
					var i3 = _g21++;
					if(_g.nodes[i3].addShape(shape1)) return false;
				}
				return true;
			});
		}
		return true;
	}
	,shapeQuery: function(a,b) {
		if(js_Boot.__instanceof(b,spark_collision_shape_Segment)) return a.segmentQuery(b);
		if(js_Boot.__instanceof(b,spark_collision_shape_Circle)) return a.circleQuery(b);
		if(js_Boot.__instanceof(b,spark_collision_shape_Box)) return a.boxQuery(b);
		return false;
	}
	,collect: function(shape) {
		var i;
		var m = [];
		if(this.depth > 0 && !shape.within(this.rect)) return m;
		var _g1 = 0;
		var _g = this.shapes.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			var s = this.shapes[i1];
			if((function($this) {
				var $r;
				var x = s.getBody();
				$r = HxOverrides.indexOf(m,x,0);
				return $r;
			}(this)) < 0 && this.shapeQuery(s,shape)) m.push(s.getBody());
		}
		var _g11 = 0;
		var _g2 = this.nodes.length;
		while(_g11 < _g2) {
			var i2 = _g11++;
			m.concat(this.nodes[i2].collect(shape));
		}
		return m;
	}
	,processCollisions: function() {
		var nodes = [];
		var contacts = [];
		var i;
		var j;
		var k;
		nodes.push(this);
		while(nodes.length > 0) {
			var node = nodes.pop();
			var _g1 = 0;
			var _g = node.shapes.length;
			while(_g1 < _g) {
				var i1 = _g1++;
				var a = node.shapes[i1];
				var m = [];
				var _g3 = i1 + 1;
				var _g2 = node.shapes.length;
				while(_g3 < _g2) {
					var j1 = _g3++;
					var b = node.shapes[j1];
					if(a.canCollideWith(b) && (function($this) {
						var $r;
						var x = b.getBody();
						$r = HxOverrides.indexOf(m,x,0);
						return $r;
					}(this)) < 0 && this.shapeQuery(a,b)) m.push(b.getBody());
				}
				var children = node.nodes.concat([]);
				while(children.length > 0) {
					var child = children.pop();
					var _g31 = 0;
					var _g21 = child.shapes.length;
					while(_g31 < _g21) {
						var k1 = _g31++;
						var b1 = child.shapes[k1];
						if(a.canCollideWith(b1) && (function($this) {
							var $r;
							var x1 = b1.getBody();
							$r = HxOverrides.indexOf(m,x1,0);
							return $r;
						}(this)) < 0 && this.shapeQuery(a,b1)) m.push(b1.getBody());
					}
					if(child.nodes.length > 0) children = children.concat(child.nodes);
				}
				if(m.length > 0) contacts.push({ body : a.getBody(), manifold : m});
			}
			nodes = nodes.concat(node.nodes);
		}
		var _g11 = 0;
		var _g4 = contacts.length;
		while(_g11 < _g4) {
			var i2 = _g11++;
			var body = contacts[i2].body;
			var manifold = contacts[i2].manifold;
			var _g32 = 0;
			var _g22 = manifold.length;
			while(_g32 < _g22) {
				var j2 = _g32++;
				body.collide(manifold[j2]);
				manifold[j2].collide(body);
			}
		}
	}
	,draw: function() {
		var i;
		Spark.view.save();
		Spark.view.strokeStyle = "#f00";
		Spark.view.strokeRect(this.rect.getLeft(),this.rect.getTop(),this.rect.getWidth(),this.rect.getHeight());
		var _g1 = 0;
		var _g = this.nodes.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			this.nodes[i1].draw();
		}
		var _g11 = 0;
		var _g2 = this.shapes.length;
		while(_g11 < _g2) {
			var i2 = _g11++;
			this.shapes[i2].draw();
		}
		Spark.view.restore();
	}
	,__class__: spark_collision_Quadtree
};
var spark_collision_SeparatingAxis = function() { };
$hxClasses["spark.collision.SeparatingAxis"] = spark_collision_SeparatingAxis;
spark_collision_SeparatingAxis.__name__ = ["spark","collision","SeparatingAxis"];
spark_collision_SeparatingAxis.project = function($as,bs,axis) {
	var i;
	var n;
	var amin;
	var amax;
	var bmin;
	var bmax;
	amin = amax = $as[0].dot(axis);
	bmin = bmax = bs[0].dot(axis);
	var _g1 = 1;
	var _g = $as.length;
	while(_g1 < _g) {
		var i1 = _g1++;
		n = $as[i1].dot(axis);
		if(n < amin) amin = n;
		if(n > amax) amax = n;
	}
	var _g11 = 1;
	var _g2 = bs.length;
	while(_g11 < _g2) {
		var i2 = _g11++;
		n = bs[i2].dot(axis);
		if(n < bmin) bmin = n;
		if(n > bmax) bmax = n;
	}
	return !(amax < bmin || amin > bmax);
};
spark_collision_SeparatingAxis.query = function(aPs,aNs,bPs,bNs) {
	var i;
	var _g1 = 0;
	var _g = aNs.length;
	while(_g1 < _g) {
		var i1 = _g1++;
		if(spark_collision_SeparatingAxis.project(aPs,bPs,aNs[i1]) == false) return false;
	}
	var _g11 = 0;
	var _g2 = bNs.length;
	while(_g11 < _g2) {
		var i2 = _g11++;
		if(spark_collision_SeparatingAxis.project(aPs,bPs,bNs[i2]) == false) return false;
	}
	return true;
};
var spark_collision_Shape = function(body) {
	this.body = body;
};
$hxClasses["spark.collision.Shape"] = spark_collision_Shape;
spark_collision_Shape.__name__ = ["spark","collision","Shape"];
spark_collision_Shape.prototype = {
	body: null
	,m: null
	,getBody: function() {
		return this.body;
	}
	,canCollideWith: function(s) {
		return this.body != s.body && this.body.getFilter() != s.body.getFilter();
	}
	,within: function(rect) {
		return false;
	}
	,updateShapeCache: function(m) {
		this.m = m;
	}
	,segmentQuery: function(s) {
		return false;
	}
	,circleQuery: function(s) {
		return false;
	}
	,boxQuery: function(s) {
		return false;
	}
	,draw: function() {
	}
	,__class__: spark_collision_Shape
};
var spark_collision_shape_Box = function(body,x,y,w,h) {
	spark_collision_Shape.call(this,body);
	this.p1 = new spark_Vec(x,y);
	this.p2 = new spark_Vec(x + w,y);
	this.p3 = new spark_Vec(x + w,y + h);
	this.p4 = new spark_Vec(x,y + h);
	this.tp = [this.p1.copy(),this.p2.copy(),this.p3.copy(),this.p4.copy()];
	this.tn = [spark_Vec.up(),spark_Vec.right()];
};
$hxClasses["spark.collision.shape.Box"] = spark_collision_shape_Box;
spark_collision_shape_Box.__name__ = ["spark","collision","shape","Box"];
spark_collision_shape_Box.__super__ = spark_collision_Shape;
spark_collision_shape_Box.prototype = $extend(spark_collision_Shape.prototype,{
	p1: null
	,p2: null
	,p3: null
	,p4: null
	,tp: null
	,tn: null
	,within: function(rect) {
		if(!rect.contains(this.tp[0].x,this.tp[0].y)) return false;
		if(!rect.contains(this.tp[1].x,this.tp[1].y)) return false;
		if(!rect.contains(this.tp[2].x,this.tp[2].y)) return false;
		if(!rect.contains(this.tp[3].x,this.tp[3].y)) return false;
		return true;
	}
	,updateShapeCache: function(m) {
		spark_collision_Shape.prototype.updateShapeCache.call(this,m);
		this.tp[0] = m.transform(this.p1);
		this.tp[1] = m.transform(this.p2);
		this.tp[2] = m.transform(this.p3);
		this.tp[3] = m.transform(this.p4);
		this.tn[0] = spark_Vec.up().rotate(m.r);
		this.tn[1] = spark_Vec.right().rotate(m.r);
	}
	,segmentQuery: function(s) {
		return s.boxQuery(this);
	}
	,circleQuery: function(s) {
		return s.boxQuery(this);
	}
	,boxQuery: function(s) {
		return spark_collision_SeparatingAxis.query(this.tp,this.tn,s.tp,s.tn);
	}
	,draw: function() {
		Spark.view.strokeStyle = "#ff0";
		Spark.view.beginPath();
		Spark.view.moveTo(this.tp[0].x,this.tp[0].y);
		Spark.view.lineTo(this.tp[1].x,this.tp[1].y);
		Spark.view.lineTo(this.tp[2].x,this.tp[2].y);
		Spark.view.lineTo(this.tp[3].x,this.tp[3].y);
		Spark.view.closePath();
		Spark.view.stroke();
	}
	,__class__: spark_collision_shape_Box
});
var spark_collision_shape_Circle = function(body,x,y,r) {
	spark_collision_Shape.call(this,body);
	this.c = new spark_Vec(x,y);
	this.r = r;
	this.tc = this.c.copy();
};
$hxClasses["spark.collision.shape.Circle"] = spark_collision_shape_Circle;
spark_collision_shape_Circle.__name__ = ["spark","collision","shape","Circle"];
spark_collision_shape_Circle.__super__ = spark_collision_Shape;
spark_collision_shape_Circle.prototype = $extend(spark_collision_Shape.prototype,{
	c: null
	,r: null
	,tc: null
	,within: function(rect) {
		if(this.tc.x + this.r < rect.getLeft()) return false;
		if(this.tc.x - this.r > rect.getRight()) return false;
		if(this.tc.y + this.r < rect.getTop()) return false;
		if(this.tc.y - this.r > rect.getBottom()) return false;
		return true;
	}
	,updateShapeCache: function(m) {
		spark_collision_Shape.prototype.updateShapeCache.call(this,m);
		this.tc = m.transform(this.c);
	}
	,segmentQuery: function(s) {
		return s.circleQuery(this);
	}
	,circleQuery: function(s) {
		return this.tc.distsq(s.tc) < this.r * this.r + s.r * s.r;
	}
	,boxQuery: function(s) {
		var c = s.m.untransform(this.tc);
		if(c.x >= s.p1.x && c.x <= s.p3.x) return c.y + this.r >= s.p1.y && c.y - this.r <= s.p3.y;
		if(c.y >= s.p1.y && c.y <= s.p3.y) return c.x + this.r >= s.p1.x && c.x - this.r <= s.p3.x;
		if(c.x < s.p1.x && c.y < s.p1.y) return c.distsq(s.p1) <= this.r * this.r;
		if(c.x > s.p2.x && c.y < s.p2.y) return c.distsq(s.p2) <= this.r * this.r;
		if(c.x > s.p3.x && c.y > s.p3.y) return c.distsq(s.p3) <= this.r * this.r;
		if(c.x < s.p4.x && c.y > s.p4.y) return c.distsq(s.p4) <= this.r * this.r;
		return false;
	}
	,draw: function() {
		Spark.view.strokeStyle = "#ff0";
		Spark.view.beginPath();
		Spark.view.arc(this.tc.x,this.tc.y,this.r,0,360);
		Spark.view.stroke();
	}
	,__class__: spark_collision_shape_Circle
});
var spark_collision_shape_Segment = function(body,x1,y1,x2,y2) {
	spark_collision_Shape.call(this,body);
	this.p1 = new spark_Vec(x1,y1);
	this.p2 = new spark_Vec(x2,y2);
	this.tp = [this.p1.copy(),this.p2.copy()];
	this.tn = [this.p2.sub(this.p1).perp()];
};
$hxClasses["spark.collision.shape.Segment"] = spark_collision_shape_Segment;
spark_collision_shape_Segment.__name__ = ["spark","collision","shape","Segment"];
spark_collision_shape_Segment.__super__ = spark_collision_Shape;
spark_collision_shape_Segment.prototype = $extend(spark_collision_Shape.prototype,{
	p1: null
	,p2: null
	,tp: null
	,tn: null
	,within: function(rect) {
		return rect.contains(this.tp[0].x,this.tp[0].y) && rect.contains(this.tp[1].x,this.tp[1].y);
	}
	,updateShapeCache: function(m) {
		spark_collision_Shape.prototype.updateShapeCache.call(this,m);
		this.tp[0] = m.transform(this.p1);
		this.tp[1] = m.transform(this.p2);
		this.tn[0] = this.tp[1].sub(this.tp[0]).perp();
	}
	,segmentQuery: function(s) {
		return spark_collision_SeparatingAxis.query(this.tp,this.tn,s.tp,s.tn);
	}
	,circleQuery: function(s) {
		return s.tc.proj(this.tp[0],this.tp[1]).distsq(s.tc) < s.r * s.r;
	}
	,boxQuery: function(s) {
		return spark_collision_SeparatingAxis.query(this.tp,this.tn,s.tp,s.tn);
	}
	,draw: function() {
		Spark.view.strokeStyle = "#ff0";
		Spark.view.beginPath();
		Spark.view.moveTo(this.tp[0].x,this.tp[0].y);
		Spark.view.lineTo(this.tp[1].x,this.tp[1].y);
		Spark.view.stroke();
	}
	,__class__: spark_collision_shape_Segment
});
var spark_graphics_Emitter = function(src) {
	var _g = this;
	spark_Asset.call(this,src);
	this.data = { texture : null, compositeOperation : "screen", startAlpha : 1.0, endAlpha : 1.0, minLife : 1.0, maxLife : 1.5, startScale : 1.0, endScale : 1.0, spread : 180.0, minSpeed : 50.0, maxSpeed : 100.0, angle : 0.0, minAngularVelocity : -90.0, maxAngularVelocity : 90.0};
	this.texture = null;
	Spark.loadJSON(src,function(json) {
		spark_Util.merge(_g.data,json);
		if(_g.data.texture != null) _g.texture = spark_Game.getTexture(_g.data.texture);
		_g.particleBehavior = function(actor,step,data) {
			var s = actor;
			var p = data;
			if((p.age += step) > p.life) {
				p.age = p.life;
				s.dead = true;
			}
			var scale = spark_Util.lerp(_g.data.startScale,_g.data.endScale,p.age,p.life);
			s.m.translate(p.v.x * step,p.v.y * step);
			s.m.rotate(p.w * step);
			s.m.s.set(scale,scale);
			s.contextSettings.globalAlpha = spark_Util.lerp(_g.data.startAlpha,_g.data.endAlpha,p.age,p.life);
		};
		_g.loaded = true;
	});
};
$hxClasses["spark.graphics.Emitter"] = spark_graphics_Emitter;
spark_graphics_Emitter.__name__ = ["spark","graphics","Emitter"];
spark_graphics_Emitter.__super__ = spark_Asset;
spark_graphics_Emitter.prototype = $extend(spark_Asset.prototype,{
	data: null
	,texture: null
	,quad: null
	,particleBehavior: null
	,emit: function(layer,x,y,r,dir,n) {
		if(n == null) n = 1;
		var i;
		var _g = 0;
		while(_g < n) {
			var i1 = _g++;
			var sprite = layer.newSprite();
			sprite.setTexture(this.texture);
			sprite.contextSettings.globalCompositeOperation = this.data.compositeOperation;
			var speed = spark_Util.rand(this.data.minSpeed,this.data.maxSpeed);
			var spread = spark_Util.rand(-this.data.spread,this.data.spread);
			sprite.m.p.set(x,y);
			sprite.m.set_angle(this.data.angle + r);
			var life = spark_Util.rand(this.data.minLife,this.data.maxLife);
			var w = spark_Util.rand(this.data.minAngularVelocity,this.data.maxAngularVelocity);
			var particle = { age : 0, life : life, v : spark_Vec.axis(dir + spread,speed), w : w};
			sprite.addBehavior(this.particleBehavior,particle);
		}
	}
	,__class__: spark_graphics_Emitter
});
var spark_graphics_Font = function(src) {
	spark_Asset.call(this,src);
	var family = src.split("/").slice(-1)[0].split(".")[0];
	var face = "@font-face{ font-family: \"" + family + "\"; src: url(\"" + src + "\"); }";
	var _this = window.document;
	this.style = _this.createElement("style");
	this.style.appendChild(window.document.createTextNode(face));
	window.document.head.appendChild(this.style);
	this.loaded = true;
};
$hxClasses["spark.graphics.Font"] = spark_graphics_Font;
spark_graphics_Font.__name__ = ["spark","graphics","Font"];
spark_graphics_Font.__super__ = spark_Asset;
spark_graphics_Font.prototype = $extend(spark_Asset.prototype,{
	style: null
	,__class__: spark_graphics_Font
});
var spark_graphics_Texture = function(src) {
	var _g = this;
	spark_Asset.call(this,src);
	this.img = new Image();
	this.img.onload = function() {
		_g.loaded = true;
	};
	this.img.src = src;
};
$hxClasses["spark.graphics.Texture"] = spark_graphics_Texture;
spark_graphics_Texture.__name__ = ["spark","graphics","Texture"];
spark_graphics_Texture.__super__ = spark_Asset;
spark_graphics_Texture.prototype = $extend(spark_Asset.prototype,{
	img: null
	,getWidth: function() {
		if(this.loaded) return this.img.width; else return 0;
	}
	,getHeight: function() {
		if(this.loaded) return this.img.height; else return 0;
	}
	,draw: function(pivot) {
		if(this.loaded) {
			var w = this.img.width;
			var h = this.img.height;
			var x;
			if(pivot == null) x = 0; else x = -w * pivot.x;
			var y;
			if(pivot == null) y = 0; else y = -h * pivot.y;
			Spark.view.drawImage(this.img,0,0,w,h,x,y,w,h);
		}
	}
	,drawq: function(quad,pivot) {
		if(this.loaded) {
			var w = quad.getWidth();
			var h = quad.getHeight();
			var x;
			if(pivot == null) x = 0; else x = -w * pivot.x;
			var y;
			if(pivot == null) y = 0; else y = -h * pivot.y;
			Spark.view.drawImage(this.img,quad.getLeft(),quad.getBottom(),w,h,x,y,w,h);
		}
	}
	,__class__: spark_graphics_Texture
});
var spark_input_Device = function(nButtons,nSticks) {
	if(nSticks == null) nSticks = 0;
	var i;
	this.connected = false;
	var _g = [];
	var _g1 = 0;
	while(_g1 < nButtons) {
		var i1 = _g1++;
		_g.push({ down : false, hits : 0});
	}
	this.buttons = _g;
	var _g11 = [];
	var _g2 = 0;
	while(_g2 < nSticks) {
		var i2 = _g2++;
		_g11.push({ x : 0, y : 0, relX : 0, relY : 0});
	}
	this.sticks = _g11;
};
$hxClasses["spark.input.Device"] = spark_input_Device;
spark_input_Device.__name__ = ["spark","input","Device"];
spark_input_Device.prototype = {
	buttons: null
	,sticks: null
	,connected: null
	,attach: function() {
		this.connected = true;
	}
	,isConnected: function() {
		return this.connected;
	}
	,flush: function() {
		var i;
		var _g1 = 0;
		var _g = this.buttons.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			this.buttons[i1].hits = 0;
		}
		var _g11 = 0;
		var _g2 = this.sticks.length;
		while(_g11 < _g2) {
			var i2 = _g11++;
			this.sticks[i2].relX = 0;
			this.sticks[i2].relY = 0;
		}
	}
	,press: function(button) {
		if(button >= 0 && button < this.buttons.length) {
			this.buttons[button].down = true;
			this.buttons[button].hits++;
		}
	}
	,release: function(button) {
		if(button >= 0 && button < this.buttons.length) this.buttons[button].down = false;
	}
	,move: function(stick,x,y) {
		if(stick >= 0 && stick < this.sticks.length) {
			this.sticks[stick].relX += x - this.sticks[stick].x;
			this.sticks[stick].relY += y - this.sticks[stick].y;
			this.sticks[stick].x = x;
			this.sticks[stick].y = y;
		}
	}
	,hit: function(button) {
		return this.hits(button) > 0;
	}
	,down: function(button) {
		if(button >= 0 && button < this.buttons.length) return this.buttons[button].down; else return false;
	}
	,hits: function(button) {
		if(button >= 0 && button < this.buttons.length) return this.buttons[button].hits; else return 0;
	}
	,getX: function(stick) {
		if(stick >= 0 && stick < this.sticks.length) return this.sticks[stick].x; else return 0;
	}
	,getY: function(stick) {
		if(stick >= 0 && stick < this.sticks.length) return this.sticks[stick].y; else return 0;
	}
	,getRelX: function(stick) {
		if(stick >= 0 && stick < this.sticks.length) return this.sticks[stick].relX; else return 0;
	}
	,getRelY: function(stick) {
		if(stick >= 0 && stick < this.sticks.length) return this.sticks[stick].relY; else return 0;
	}
	,__class__: spark_input_Device
};
var spark_object_Actor = function() {
	this.rig = new spark_anim_Rig();
	this.behaviors = [];
	this.m = spark_Mat.identity();
};
$hxClasses["spark.object.Actor"] = spark_object_Actor;
spark_object_Actor.__name__ = ["spark","object","Actor"];
spark_object_Actor.prototype = {
	m: null
	,behaviors: null
	,rig: null
	,addBehavior: function(callback,data) {
		this.behaviors.push({ callback : callback, data : data});
	}
	,worldToLocal: function(p) {
		return this.m.inverse().transform(p);
	}
	,localToWorld: function(p) {
		return this.m.transform(p);
	}
	,worldToLocalAngle: function(angle) {
		return this.m.get_angle() - angle;
	}
	,localToWorldAngle: function(angle) {
		return this.m.get_angle() + angle;
	}
	,update: function(step) {
		var i;
		this.rig.update(step);
		var _g1 = 0;
		var _g = this.behaviors.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			this.behaviors[i1].callback(this,step,this.behaviors[i1].data);
		}
	}
	,draw: function() {
	}
	,__class__: spark_object_Actor
};
var spark_object_Camera = function(width,height) {
	spark_object_Actor.call(this);
	this.m.s.set(width / 2,height / 2);
};
$hxClasses["spark.object.Camera"] = spark_object_Camera;
spark_object_Camera.__name__ = ["spark","object","Camera"];
spark_object_Camera.__super__ = spark_object_Actor;
spark_object_Camera.prototype = $extend(spark_object_Actor.prototype,{
	draw: function() {
		Spark.view.scale(1 / this.m.s.x,1 / this.m.s.y);
		Spark.view.transform(this.m.r.x,-this.m.r.y,this.m.r.y,this.m.r.x,0,0);
		Spark.view.translate(-this.m.p.x,-this.m.p.y);
	}
	,__class__: spark_object_Camera
});
var spark_object_Layer = function(z) {
	if(z == null) z = 0.0;
	spark_object_Actor.call(this);
	this.z = z;
};
$hxClasses["spark.object.Layer"] = spark_object_Layer;
spark_object_Layer.__name__ = ["spark","object","Layer"];
spark_object_Layer.__super__ = spark_object_Actor;
spark_object_Layer.prototype = $extend(spark_object_Actor.prototype,{
	z: null
	,updateCollision: function(space) {
	}
	,draw: function() {
	}
	,debugStats: function(stats) {
		stats.layers++;
	}
	,__class__: spark_object_Layer
});
var spark_object_Sprite = function(layer) {
	spark_object_Actor.call(this);
	this.pivot = new spark_Vec(0.5,0.5);
	this.layer = layer;
	this.init();
};
$hxClasses["spark.object.Sprite"] = spark_object_Sprite;
spark_object_Sprite.__name__ = ["spark","object","Sprite"];
spark_object_Sprite.__super__ = spark_object_Actor;
spark_object_Sprite.prototype = $extend(spark_object_Actor.prototype,{
	pivot: null
	,dead: null
	,contextSettings: null
	,layer: null
	,body: null
	,texture: null
	,quad: null
	,init: function() {
		this.m = spark_Mat.identity();
		this.behaviors = [];
		this.pivot.set(0.5,0.5);
		this.dead = false;
		this.body = null;
		this.texture = null;
		this.quad = null;
		this.contextSettings = { globalAlpha : 1.0, globalCompositeOperation : "source-over", shadowBlur : 0};
	}
	,getLayer: function() {
		return this.layer;
	}
	,addBody: function(filter,oncollision) {
		return this.body = new spark_collision_Body(this,filter,oncollision);
	}
	,setTexture: function(texture,quad) {
		this.texture = texture;
		this.quad = quad;
	}
	,setQuad: function(quad) {
		this.quad = quad;
	}
	,getWidth: function() {
		if(this.texture == null) return 0;
		if(this.quad != null) return this.quad.getWidth(); else return this.texture.getWidth();
	}
	,getHeight: function() {
		if(this.texture == null) return 0;
		if(this.quad != null) return this.quad.getHeight(); else return this.texture.getHeight();
	}
	,addToQuadtree: function(space) {
		if(this.body != null) this.body.addToQuadtree(space);
	}
	,update: function(step) {
		spark_object_Actor.prototype.update.call(this,step);
		if(this.body != null) this.body.updateShapeCache(this.m);
	}
	,draw: function() {
		if(this.texture == null) return;
		Spark.view.save();
		this.m.apply();
		spark_Util.merge(Spark.view,this.contextSettings);
		if(this.quad == null) this.texture.draw(this.pivot); else this.texture.drawq(this.quad,this.pivot);
		Spark.view.restore();
	}
	,__class__: spark_object_Sprite
});
var spark_object_layer_BackgroundLayer = function(texture,tiled) {
	if(tiled == null) tiled = true;
	spark_object_Layer.call(this);
	this.z = 0.0;
	this.texture = texture;
	this.tiled = tiled;
};
$hxClasses["spark.object.layer.BackgroundLayer"] = spark_object_layer_BackgroundLayer;
spark_object_layer_BackgroundLayer.__name__ = ["spark","object","layer","BackgroundLayer"];
spark_object_layer_BackgroundLayer.__super__ = spark_object_Layer;
spark_object_layer_BackgroundLayer.prototype = $extend(spark_object_Layer.prototype,{
	texture: null
	,tiled: null
	,update: function(step) {
		spark_object_Layer.prototype.update.call(this,step);
		if(this.tiled && this.texture != null) {
			this.m.p.x %= this.texture.getWidth() * this.m.s.x;
			this.m.p.y %= this.texture.getHeight() * this.m.s.y;
		}
	}
	,draw: function() {
		if(this.texture == null) return;
		Spark.view.save();
		this.m.apply();
		var iw = this.texture.getWidth();
		var ih = this.texture.getHeight();
		if(this.tiled == false) this.texture.draw(); else {
			var l = spark_Game.scene.rect.getLeft();
			var t = spark_Game.scene.rect.getTop();
			var w = spark_Game.scene.rect.getWidth();
			var h = spark_Game.scene.rect.getHeight();
			var x = -iw;
			while(x < w) {
				var y = -ih;
				while(y < h) {
					Spark.view.save();
					Spark.view.translate(l + x,t + y);
					this.texture.draw();
					Spark.view.restore();
					y += ih - 1;
				}
				x += iw - 1;
			}
		}
		Spark.view.restore();
	}
	,__class__: spark_object_layer_BackgroundLayer
});
var spark_object_layer_SpriteLayer = function(n) {
	if(n == null) n = 100;
	var i;
	spark_object_Layer.call(this);
	this.m = spark_Mat.identity();
	this.sprites = [];
	var _g = [];
	var _g1 = 0;
	while(_g1 < n) {
		var i1 = _g1++;
		_g.push(new spark_object_Sprite(this));
	}
	this.pool = _g;
	this.sp = n;
	this.count = 0;
	this.pending = 0;
};
$hxClasses["spark.object.layer.SpriteLayer"] = spark_object_layer_SpriteLayer;
spark_object_layer_SpriteLayer.__name__ = ["spark","object","layer","SpriteLayer"];
spark_object_layer_SpriteLayer.__super__ = spark_object_Layer;
spark_object_layer_SpriteLayer.prototype = $extend(spark_object_Layer.prototype,{
	sprites: null
	,pool: null
	,sp: null
	,count: null
	,pending: null
	,length: null
	,get_length: function() {
		return this.count;
	}
	,get: function(i) {
		return this.sprites[i];
	}
	,newSprite: function() {
		var sprite;
		if(this.sp > 0) {
			sprite = this.pool[--this.sp];
			sprite.init();
		} else sprite = new spark_object_Sprite(this);
		if(this.count + this.pending < this.sprites.length) this.sprites[this.count + this.pending] = sprite; else this.sprites.push(sprite);
		this.pending++;
		return sprite;
	}
	,update: function(step) {
		var i = 0;
		this.count += this.pending;
		this.pending = 0;
		while(i < this.count) {
			var sprite = this.sprites[i];
			if(sprite.dead) {
				this.sprites[i] = this.sprites[--this.count];
				if(this.sp < this.pool.length) this.pool[this.sp] = sprite; else this.pool.push(sprite);
				this.sp++;
			} else i++;
		}
		var _g1 = 0;
		var _g = this.count;
		while(_g1 < _g) {
			var i1 = _g1++;
			this.sprites[i1].update(step);
		}
	}
	,updateCollision: function(space) {
		var i;
		var _g1 = 0;
		var _g = this.count;
		while(_g1 < _g) {
			var i1 = _g1++;
			this.sprites[i1].addToQuadtree(space);
		}
	}
	,draw: function() {
		var i;
		var _g1 = 0;
		var _g = this.count;
		while(_g1 < _g) {
			var i1 = _g1++;
			this.sprites[i1].draw();
		}
	}
	,debugStats: function(stats) {
		spark_object_Layer.prototype.debugStats.call(this,stats);
		stats.sprites += this.count;
	}
	,__class__: spark_object_layer_SpriteLayer
	,__properties__: {get_length:"get_length"}
});
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
var __map_reserved = {}
js_Boot.__toStr = {}.toString;
spark_Debug.flags = 0;
spark_Debug.PERF = 1;
spark_Debug.COLLISION = 2;
spark_Debug.ALL = 65535;
spark_Debug.updateTime = 0;
spark_Debug.collisionTime = 0;
spark_Debug.drawTime = 0;
spark_Debug.guiTime = 0;
spark_Debug.perfCanvas = null;
spark_Debug.perfView = null;
spark_Joystick.A = 0;
spark_Joystick.B = 1;
spark_Joystick.X = 2;
spark_Joystick.Y = 3;
spark_Joystick.UP = 12;
spark_Joystick.DOWN = 13;
spark_Joystick.LEFT = 14;
spark_Joystick.RIGHT = 15;
spark_Key.BACKSPACE = 8;
spark_Key.TAB = 9;
spark_Key.ENTER = 13;
spark_Key.PAUSE = 19;
spark_Key.CAPS = 20;
spark_Key.ESC = 27;
spark_Key.SPACE = 32;
spark_Key.PAGE_UP = 33;
spark_Key.PAGE_DOWN = 34;
spark_Key.END = 35;
spark_Key.HOME = 36;
spark_Key.LEFT = 37;
spark_Key.UP = 38;
spark_Key.RIGHT = 39;
spark_Key.DOWN = 40;
spark_Key.INSERT = 45;
spark_Key.DELETE = 46;
spark_Key._0 = 48;
spark_Key._1 = 49;
spark_Key._2 = 50;
spark_Key._3 = 51;
spark_Key._4 = 52;
spark_Key._5 = 53;
spark_Key._6 = 54;
spark_Key._7 = 55;
spark_Key._8 = 56;
spark_Key._9 = 57;
spark_Key.A = 65;
spark_Key.B = 66;
spark_Key.C = 67;
spark_Key.D = 68;
spark_Key.E = 69;
spark_Key.F = 70;
spark_Key.G = 71;
spark_Key.H = 72;
spark_Key.I = 73;
spark_Key.J = 74;
spark_Key.K = 75;
spark_Key.L = 76;
spark_Key.M = 77;
spark_Key.N = 78;
spark_Key.O = 79;
spark_Key.P = 80;
spark_Key.Q = 81;
spark_Key.R = 82;
spark_Key.S = 83;
spark_Key.T = 84;
spark_Key.U = 85;
spark_Key.V = 86;
spark_Key.W = 87;
spark_Key.X = 88;
spark_Key.Y = 89;
spark_Key.Z = 90;
spark_Key.NUMPAD_0 = 96;
spark_Key.NUMPAD_1 = 97;
spark_Key.NUMPAD_2 = 98;
spark_Key.NUMPAD_3 = 99;
spark_Key.NUMPAD_4 = 100;
spark_Key.NUMPAD_5 = 101;
spark_Key.NUMPAD_6 = 102;
spark_Key.NUMPAD_7 = 103;
spark_Key.NUMPAD_8 = 104;
spark_Key.NUMPAD_9 = 105;
spark_Key.MULTIPLY = 106;
spark_Key.ADD = 107;
spark_Key.SUBSTRACT = 109;
spark_Key.DECIMAL = 110;
spark_Key.DIVIDE = 111;
spark_Key.F1 = 112;
spark_Key.F2 = 113;
spark_Key.F3 = 114;
spark_Key.F4 = 115;
spark_Key.F5 = 116;
spark_Key.F6 = 117;
spark_Key.F7 = 118;
spark_Key.F8 = 119;
spark_Key.F9 = 120;
spark_Key.F10 = 121;
spark_Key.F11 = 122;
spark_Key.F12 = 123;
spark_Key.SHIFT = 16;
spark_Key.CTRL = 17;
spark_Key.ALT = 18;
spark_Key.PLUS = 187;
spark_Key.COMMA = 188;
spark_Key.MINUS = 189;
spark_Key.PERIOD = 190;
spark_Mouse.LEFT = 0;
spark_Mouse.MIDDLE = 1;
spark_Mouse.RIGHT = 2;
spark_collision_Quadtree.DEPTH_LIMIT = 3;
spark_collision_Quadtree.SHAPE_LIMIT = 8;
Spark.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
