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
	spark_Input.init();
	spark_Input.hideCursor();
	spark_Input.enableMouse();
	spark_Input.enableKeyboard();
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
Spark.classOfFile = function(src) {
	var ext = src.split("/").pop().split(".").pop().toLowerCase();
	switch(ext) {
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
spark_Asset.prototype = {
	source: null
	,loaded: null
	,isLoaded: function() {
		return this.loaded;
	}
	,__class__: spark_Asset
};
var spark_Game = $hx_exports.spark.Game = function(projectFile,init) {
	var _g = this;
	this.loadQueue = [];
	Spark.loadJSON(projectFile,function(json) {
		_g.project = json;
		if(_g.project.path == null) _g.project.path = projectFile.split("/").slice(0,-1).join("/") + "/";
		if(_g.project.assetPath == null) _g.project.assetPath = "/";
		if(_g.project.title == null) _g.project.title = "Spark Game";
		if(_g.project.version == null) _g.project.version = 1.0;
		init(_g);
	});
};
$hxClasses["spark.Game"] = spark_Game;
spark_Game.__name__ = ["spark","Game"];
spark_Game.main = function(projectFile,init) {
	return new spark_Game(projectFile,init);
};
spark_Game.prototype = {
	project: null
	,loadQueue: null
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
	,load: function(classRef,src) {
		var asset = Type.createInstance(classRef,[this.project.path + this.project.assetPath + src]);
		this.loadQueue.push(asset);
		return asset;
	}
	,newFont: function(src) {
		return this.load(spark_graphics_Font,src);
	}
	,newSound: function(src) {
		return this.load(spark_audio_Sound,src);
	}
	,newTexture: function(src) {
		return this.load(spark_graphics_Texture,src);
	}
	,newTimeline: function(src) {
		return this.load(spark_anim_Timeline,src);
	}
	,__class__: spark_Game
};
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
	var _g = spark_Input.keys.length;
	while(_g1 < _g) {
		var i = _g1++;
		spark_Input.keys[i].hits = 0;
	}
	var _g11 = 0;
	var _g2 = spark_Input.buttons.length;
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
spark_Input.mousePos = function() {
	return new spark_Vec(spark_Input.x,spark_Input.y);
};
spark_Input.mouseRel = function() {
	return new spark_Vec(spark_Input.relX,spark_Input.relY);
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
spark_Input.buttonDown = function(button) {
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
	if(!event.repeat && event.keyCode < spark_Input.keys.length) {
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
var spark_Layer = function() { };
$hxClasses["spark.Layer"] = spark_Layer;
spark_Layer.__name__ = ["spark","Layer"];
spark_Layer.prototype = {
	z: null
	,m: null
	,update: null
	,draw: null
	,__class__: spark_Layer
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
		return spark_Util.radToDeg(Math.atan2(this.r.y,this.r.x));
	}
	,set_angle: function(a) {
		this.r.x = Math.cos(spark_Util.degToRad(a));
		this.r.y = Math.sin(spark_Util.degToRad(a));
		return a;
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
	,__properties__: {set_angle:"set_angle",get_angle:"get_angle"}
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
	,newSpriteLayer: function(n) {
		if(n == null) n = 100;
		var layer = new spark_layer_SpriteLayer(n);
		this.layers.push(layer);
		return layer;
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
		var i;
		this.camera.update(step);
		var _g1 = 0;
		var _g = this.layers.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			this.layers[i1].update(step);
		}
		this.space = new spark_collision_Quadtree(this.rect);
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
		Spark.view.setTransform(1,0,0,1,0,0);
		Spark.view.translate(w2,h2);
		Spark.view.scale(w2 / this.camera.m.s.x,h2 / this.camera.m.s.y);
		Spark.view.transform(this.camera.m.r.x,this.camera.m.r.y,-this.camera.m.r.y,this.camera.m.r.x,0,0);
		Spark.view.translate(-this.camera.m.p.x - mx,-this.camera.m.p.y - my);
		var _g1 = 0;
		var _g = this.layers.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			this.layers[i1].draw();
		}
		Spark.view.restore();
	}
	,worldToScreen: function(x,y) {
		var mx = this.rect.getLeft() + this.rect.getWidth() / 2;
		var my = this.rect.getTop() + this.rect.getHeight() / 2;
		var cx = x - (this.camera.m.p.x + mx);
		var cy = y - (this.camera.m.p.y + my);
		var rx = cx * this.camera.m.r.x - cy * this.camera.m.r.y;
		var ry = cy * this.camera.m.r.x + cx * this.camera.m.r.y;
		var sx = rx * Spark.canvas.height / (2 * this.camera.m.s.x);
		var sy = ry * Spark.canvas.width / (2 * this.camera.m.s.y);
		return new spark_Vec(sx + Spark.canvas.width / 2,sy + Spark.canvas.height / 2);
	}
	,screenToWorld: function(x,y) {
		var cx = (x - Spark.canvas.width / 2) * this.camera.m.s.x * 2 / Spark.canvas.width;
		var cy = (y - Spark.canvas.height / 2) * this.camera.m.s.y * 2 / Spark.canvas.height;
		var vx = cx * this.camera.m.r.x + cy * this.camera.m.r.y;
		var vy = cy * this.camera.m.r.x - cx * this.camera.m.r.y;
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
	,rotate: function(r) {
		return new spark_Vec(this.x * r.x + this.y * r.y,this.y * r.x - this.x * r.y);
	}
	,unrotate: function(r) {
		return new spark_Vec(this.x * r.x - this.y * r.y,this.y * r.x + this.x * r.y);
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
	Spark.loadJSON(src,function(json) {
		_g.data = json;
		if(_g.data.fps == null) _g.data.fps = 30;
		if(_g.data.duration == null) _g.data.duration = 30;
		if(_g.data.loop == null) _g.data.loop = false;
		if(_g.data.events == null) _g.data.events = [];
		_g.data.events.sort(function(a,b) {
			return a.frame - b.frame;
		});
		_g.tweens = new haxe_ds_StringMap();
		if(_g.data.tracks != null) {
			var i;
			var fields = Reflect.fields(_g.data.tracks);
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
		var $it0 = this.tweens.keys();
		while( $it0.hasNext() ) {
			var prop1 = $it0.next();
			this.tweens.get(prop1).playOn(obj,prop1,this.data.loop);
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
		var _g = this.shapes.length - 1;
		while(_g1 < _g) {
			var i1 = _g1++;
			this.shapes[i1].updateShapeCache(m);
		}
	}
	,addToQuadtree: function(space) {
		var i;
		var _g1 = 0;
		var _g = this.shapes.length - 1;
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
		if(this.oncollision != null) this.oncollision(body);
	}
	,__class__: spark_collision_Body
};
var spark_collision_Quadtree = function(rect,depth) {
	if(depth == null) depth = 0;
	this.rect = rect;
	this.shapes = [];
	this.nodes = [];
	this.depth = depth;
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
		var _g2 = this.nodes.length - 1;
		while(_g1 < _g2) {
			var i1 = _g1++;
			if(this.nodes[i1].addShape(shape)) return true;
		}
		this.shapes.push(shape);
		if(this.depth < spark_collision_Quadtree.DEPTH_LIMIT && this.shapes.length >= spark_collision_Quadtree.SHAPE_LIMIT && this.nodes.length == 0) {
			var w = this.rect.getWidth() / 2;
			var h = this.rect.getHeight() / 2;
			var l = this.rect.getLeft();
			var t = this.rect.getTop();
			this.nodes = [new spark_collision_Quadtree(new spark_Rect(l,t,w,h),this.depth + 1),new spark_collision_Quadtree(new spark_Rect(l + w,t,w,h),this.depth + 1),new spark_collision_Quadtree(new spark_Rect(l,t + h,w,h),this.depth + 1),new spark_collision_Quadtree(new spark_Rect(l + w,t + h,w,h),this.depth + 1)];
			this.shapes = this.shapes.filter(function(shape1) {
				var i2;
				var _g21 = 0;
				var _g11 = _g.nodes.length - 1;
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
		var _g = this.shapes.length - 1;
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
		var _g2 = this.nodes.length - 1;
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
			var _g = node.shapes.length - 1;
			while(_g1 < _g) {
				var i1 = _g1++;
				var a = node.shapes[i1];
				var m = [];
				var _g3 = i1 + 1;
				var _g2 = node.shapes.length - 1;
				while(_g3 < _g2) {
					var j1 = _g3++;
					var b = node.shapes[j1];
					if(a.getBody() != b.getBody() && (function($this) {
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
					var _g21 = child.shapes.length - 1;
					while(_g31 < _g21) {
						var k1 = _g31++;
						var b1 = child.shapes[k1];
						if(a.getBody() != b1.getBody() && (function($this) {
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
		var _g4 = contacts.length - 1;
		while(_g11 < _g4) {
			var i2 = _g11++;
			var body = contacts[i2].body;
			var manifold = contacts[i2].manifold;
			var _g32 = 0;
			var _g22 = manifold.length - 1;
			while(_g32 < _g22) {
				var j2 = _g32++;
				body.collide(manifold[j2]);
				manifold[j2].collide(body);
			}
		}
	}
	,__class__: spark_collision_Quadtree
};
var spark_collision_Shape = function() { };
$hxClasses["spark.collision.Shape"] = spark_collision_Shape;
spark_collision_Shape.__name__ = ["spark","collision","Shape"];
spark_collision_Shape.prototype = {
	getBody: null
	,within: null
	,updateShapeCache: null
	,segmentQuery: null
	,circleQuery: null
	,boxQuery: null
	,__class__: spark_collision_Shape
};
var spark_collision_shape_Box = function(body,x,y,w,h) {
	this.body = body;
	this.p1 = new spark_Vec(x,y);
	this.p2 = new spark_Vec(x + w,y);
	this.p3 = new spark_Vec(x,y + h);
	this.p4 = new spark_Vec(x + w,y + h);
};
$hxClasses["spark.collision.shape.Box"] = spark_collision_shape_Box;
spark_collision_shape_Box.__name__ = ["spark","collision","shape","Box"];
spark_collision_shape_Box.__interfaces__ = [spark_collision_Shape];
spark_collision_shape_Box.prototype = {
	body: null
	,p1: null
	,p2: null
	,p3: null
	,p4: null
	,tp1: null
	,tp2: null
	,getBody: function() {
		return this.body;
	}
	,getTopLeft: function() {
		return this.tp1;
	}
	,getBottomRight: function() {
		return this.tp2;
	}
	,within: function(rect) {
		if(this.tp2.x < rect.getLeft()) return false;
		if(this.tp1.x > rect.getRight()) return false;
		if(this.tp2.y < rect.getTop()) return false;
		if(this.tp1.y > rect.getBottom()) return false;
		return true;
	}
	,updateShapeCache: function(m) {
		var v1 = m.transform(this.p1);
		var v2 = m.transform(this.p2);
		var v3 = m.transform(this.p3);
		var v4 = m.transform(this.p4);
		this.tp1.x = Math.min(Math.min(Math.min(v1.x,v2.x),v3.x),v4.x);
		this.tp1.y = Math.min(Math.min(Math.min(v1.y,v2.y),v3.y),v4.y);
		this.tp2.x = Math.max(Math.max(Math.max(v1.x,v2.x),v3.x),v4.x);
		this.tp2.y = Math.max(Math.max(Math.max(v1.y,v2.y),v3.y),v4.y);
	}
	,segmentQuery: function(s) {
		return s.boxQuery(this);
	}
	,circleQuery: function(s) {
		return s.boxQuery(this);
	}
	,boxQuery: function(s) {
		var tp1 = s.getTopLeft();
		var tp2 = s.getBottomRight();
		if(this.tp2.x < tp1.x || this.tp1.x > tp2.x) return false;
		if(this.tp2.y < tp1.y || this.tp1.y > tp2.y) return false;
		return true;
	}
	,__class__: spark_collision_shape_Box
};
var spark_collision_shape_Circle = function(body,x,y,r) {
	this.body = body;
	this.c = new spark_Vec(x,y);
	this.r = r;
};
$hxClasses["spark.collision.shape.Circle"] = spark_collision_shape_Circle;
spark_collision_shape_Circle.__name__ = ["spark","collision","shape","Circle"];
spark_collision_shape_Circle.__interfaces__ = [spark_collision_Shape];
spark_collision_shape_Circle.prototype = {
	body: null
	,c: null
	,r: null
	,tc: null
	,getBody: function() {
		return this.body;
	}
	,getCenter: function() {
		return this.tc;
	}
	,getRadius: function() {
		return this.r;
	}
	,within: function(rect) {
		if(this.tc.x + this.r < rect.getLeft()) return false;
		if(this.tc.x - this.r > rect.getRight()) return false;
		if(this.tc.y + this.r < rect.getTop()) return false;
		if(this.tc.y - this.r > rect.getBottom()) return false;
		return true;
	}
	,updateShapeCache: function(m) {
		this.tc = m.transform(this.c);
	}
	,segmentQuery: function(s) {
		return this.tc.proj(s.getStart(),s.getEnd()).distsq(this.tc) < this.r * this.r;
	}
	,circleQuery: function(s) {
		return this.tc.distsq(s.tc) < this.r * this.r + s.r * s.r;
	}
	,boxQuery: function(s) {
		var tp1 = s.getTopLeft();
		var tp2 = s.getBottomRight();
		if(this.tc.x > tp1.x && this.tc.x <= tp2.x) return this.tc.y + this.r >= tp1.y && this.tc.y - this.r <= tp2.y;
		if(this.tc.y >= tp1.y && this.tc.y <= tp2.y) return this.tc.x + this.r >= tp1.x && this.tc.x - this.r <= tp2.x;
		if(this.tc.x < tp1.x && this.tc.y < tp1.y) return this.tc.distsq(tp1) <= this.r * this.r;
		if(this.tc.x > tp2.x && this.tc.y < tp1.y) return this.tc.distsq(new spark_Vec(tp2.x,tp1.y)) <= this.r * this.r;
		if(this.tc.x < tp1.x && this.tc.y > tp2.y) return this.tc.distsq(new spark_Vec(tp1.x,tp2.y)) <= this.r * this.r;
		return this.tc.distsq(tp2) <= this.r * this.r;
	}
	,__class__: spark_collision_shape_Circle
};
var spark_collision_shape_Segment = function(body,x1,y1,x2,y2) {
	this.body = body;
	this.p1 = new spark_Vec(x1,y1);
	this.p2 = new spark_Vec(x2,y2);
};
$hxClasses["spark.collision.shape.Segment"] = spark_collision_shape_Segment;
spark_collision_shape_Segment.__name__ = ["spark","collision","shape","Segment"];
spark_collision_shape_Segment.__interfaces__ = [spark_collision_Shape];
spark_collision_shape_Segment.prototype = {
	body: null
	,p1: null
	,p2: null
	,tp1: null
	,tp2: null
	,getBody: function() {
		return this.body;
	}
	,getStart: function() {
		return this.tp1;
	}
	,getEnd: function() {
		return this.tp2;
	}
	,within: function(rect) {
		return rect.contains(this.tp1.x,this.tp1.y) && rect.contains(this.tp2.x,this.tp2.y);
	}
	,updateShapeCache: function(m) {
		this.tp1 = m.transform(this.p1);
		this.tp2 = m.transform(this.p2);
	}
	,segmentQuery: function(s) {
		if(Math.min(s.tp1.x,s.tp2.x) > Math.max(this.tp1.x,this.tp2.x) || Math.min(s.tp1.y,s.tp2.y) > Math.max(this.tp1.y,this.tp2.y) || Math.max(s.tp1.x,s.tp2.x) < Math.min(this.tp1.x,this.tp2.x) || Math.max(s.tp1.y,s.tp2.y) < Math.min(this.tp1.y,this.tp2.y)) return false;
		var sa = spark_Util.sign(this.tp1.cross(s.tp1));
		var sb = spark_Util.sign(this.tp1.cross(s.tp2));
		if(sa == sb && sa != 0 && sb != 0) return false;
		var da = spark_Util.sign(s.tp1.cross(this.tp1));
		var db = spark_Util.sign(s.tp1.cross(this.tp2));
		if(da == db && da != 0 && db != 0) return false;
		return true;
	}
	,circleQuery: function(s) {
		return s.segmentQuery(this);
	}
	,boxQuery: function(s) {
		var tp1 = s.getTopLeft();
		var tp2 = s.getBottomRight();
		if(this.tp1.x < tp1.x && this.tp2.x < tp1.x) return false;
		if(this.tp1.x > tp2.x && this.tp2.x > tp2.x) return false;
		if(this.tp1.y < tp1.y && this.tp2.y < tp1.y) return false;
		if(this.tp1.y > tp2.y && this.tp2.y > tp2.y) return false;
		return true;
	}
	,__class__: spark_collision_shape_Segment
};
var spark_graphics_Emitter = function(src) {
	var _g = this;
	spark_Asset.call(this,src);
	this.texture = null;
	this.quad = null;
	Spark.loadJSON(src,function(json) {
		_g.data = json;
		_g.particleBehavior = function(sprite,step,data) {
			var p = data;
			if((p.age += step) > p.life) {
				p.age = p.life;
				sprite.dead = true;
			}
			var s = spark_Util.lerp(_g.data.startScale,_g.data.endScale,p.age,p.life);
			sprite.m.translate(p.v.x * step,p.v.y * step);
			sprite.m.rotate(p.w * step);
			sprite.m.s.set(s,s);
		};
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
	,emit: function(layer,x,y,angle,n) {
		if(n == null) n = 1;
		var i;
		var _g = 0;
		while(_g < n) {
			var i1 = _g++;
			var sprite = layer.newSprite();
			sprite.setTexture(this.texture,this.quad);
			var s = spark_Util.rand(this.data.minSpeed,this.data.maxSpeed);
			var a = spark_Util.rand(-this.data.spread,this.data.spread) + angle;
			sprite.m.p.set(x,y);
			sprite.m.set_angle(this.data.forwardAngle + a);
			var life = spark_Util.rand(this.data.minLife,this.data.maxLife);
			var v = spark_Vec.axis(a,s);
			var w = spark_Util.rand(this.data.minAngularVelocity,this.data.maxAngularVelocity);
			var particle = { age : 0, life : life, w : w, v : v};
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
	window.document.appendChild(this.style);
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
			Spark.view.drawImage(this.img,quad.getLeft(),quad.getTop(),w,h,x,y,w,h);
		}
	}
	,__class__: spark_graphics_Texture
});
var spark_layer_SpriteLayer = function(n) {
	if(n == null) n = 100;
	var i;
	this.z = 0;
	this.m = spark_Mat.identity();
	this.sprites = [];
	this.pool = [];
	var _g = 0;
	while(_g < n) {
		var i1 = _g++;
		this.pool.push(new spark_object_Sprite(this));
	}
	this.sp = n;
	this.count = 0;
	this.pending = 0;
};
$hxClasses["spark.layer.SpriteLayer"] = spark_layer_SpriteLayer;
spark_layer_SpriteLayer.__name__ = ["spark","layer","SpriteLayer"];
spark_layer_SpriteLayer.__interfaces__ = [spark_Layer];
spark_layer_SpriteLayer.prototype = {
	z: null
	,m: null
	,sprites: null
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
	,draw: function() {
		var i;
		var _g1 = 0;
		var _g = this.count;
		while(_g1 < _g) {
			var i1 = _g1++;
			this.sprites[i1].draw();
		}
	}
	,__class__: spark_layer_SpriteLayer
	,__properties__: {get_length:"get_length"}
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
	__class__: spark_object_Camera
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
	,update: function(step) {
		spark_object_Actor.prototype.update.call(this,step);
		if(this.body != null) this.body.updateShapeCache(this.m);
	}
	,draw: function() {
		if(this.texture == null) return;
		Spark.view.save();
		this.m.apply();
		if(this.quad == null) this.texture.draw(this.pivot); else this.texture.drawq(this.quad,this.pivot);
		Spark.view.restore();
	}
	,__class__: spark_object_Sprite
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
spark_Input.Button = { 'LEFT' : 0, 'MIDDLE' : 1, 'RIGHT' : 2};
spark_Input.Key = { 'BACKSPACE' : 8, 'TAB' : 9, 'ENTER' : 13, 'PAUSE' : 19, 'CAPS' : 20, 'ESC' : 27, 'SPACE' : 32, 'PAGE_UP' : 33, 'PAGE_DOWN' : 34, 'END' : 35, 'HOME' : 36, 'LEFT' : 37, 'UP' : 38, 'RIGHT' : 39, 'DOWN' : 40, 'INSERT' : 45, 'DELETE' : 46, '_0' : 48, '_1' : 49, '_2' : 50, '_3' : 51, '_4' : 52, '_5' : 53, '_6' : 54, '_7' : 55, '_8' : 56, '_9' : 57, 'A' : 65, 'B' : 66, 'C' : 67, 'D' : 68, 'E' : 69, 'F' : 70, 'G' : 71, 'H' : 72, 'I' : 73, 'J' : 74, 'K' : 75, 'L' : 76, 'M' : 77, 'N' : 78, 'O' : 79, 'P' : 80, 'Q' : 81, 'R' : 82, 'S' : 83, 'T' : 84, 'U' : 85, 'V' : 86, 'W' : 87, 'X' : 88, 'Y' : 89, 'Z' : 90, 'NUMPAD_0' : 96, 'NUMPAD_1' : 97, 'NUMPAD_2' : 98, 'NUMPAD_3' : 99, 'NUMPAD_4' : 100, 'NUMPAD_5' : 101, 'NUMPAD_6' : 102, 'NUMPAD_7' : 103, 'NUMPAD_8' : 104, 'NUMPAD_9' : 105, 'MULTIPLY' : 106, 'ADD' : 107, 'SUBSTRACT' : 109, 'DECIMAL' : 110, 'DIVIDE' : 111, 'F1' : 112, 'F2' : 113, 'F3' : 114, 'F4' : 115, 'F5' : 116, 'F6' : 117, 'F7' : 118, 'F8' : 119, 'F9' : 120, 'F10' : 121, 'F11' : 122, 'F12' : 123, 'SHIFT' : 16, 'CTRL' : 17, 'ALT' : 18, 'PLUS' : 187, 'COMMA' : 188, 'MINUS' : 189, 'PERIOD' : 190};
spark_collision_Quadtree.DEPTH_LIMIT = 3;
spark_collision_Quadtree.SHAPE_LIMIT = 8;
Spark.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
