// Generators are functions that take a non stream element and produce a stream element out of it, based on 
// the function's specific semantics

// takes an iterable and returns a stream of its content - creates a finite stream
function streamify(iterable){
	var decapFunc = null;
	if(typeof iterable === "string")
		decapFunc = function(str){return str.substring(1);};
	if(Object.prototype.toString.call(iterable) == "[object Array]")
		decapFunc = function(arr){return arr.slice(1);};
	var _iter = function(itr){
		if(itr.length === 0){
			return null;
		}
		return {
			first: itr[0],
			rest: function(){return _iter(decapFunc(itr));}
		};
	};
	return _iter(iterable);
}

// generates an infinite stream of the given val
function repeat(val){
	var _rep = function(){
		return {
			first:val,
			rest: function(){return _rep();}
		};
	}
	return _rep();
}

// generates an infinite stream by cycling over and over (and over ...) the elements within the iterable.
// Note that there may be holes in the iterable, by default we don't show them
function cycle(iterable, showHoles){
	var len = iterable.length;
	var _cyc = function(index){
		var realInd = index % len;
		while(!showHoles && iterable[realInd % len] === undefined){
			realInd = (realInd +1) % len;
		}
		return {
			first: iterable[realInd],
			rest: function(){return _cyc(realInd+1);}
		};
	};
	return _cyc(0);
}
