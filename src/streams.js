function intStreamGen(){

	function generator(seed, stepFunc, actionFunc){
		return {
			first: actionFunc(seed),
			rest: function(){return generator(stepFunc(seed), stepFunc, actionFunc);}
		};
	}
	return generator(0, function(n){return n+1;}, function(n){return n;});
}

// a stream of factorial numbers
function factorialStreamGenerator(){
	var calcFn = function(n, accum){
		return {
			first: accum,
			rest: function(){return calcFn(n+1, accum*(n+1));}
		};
	};
	
	return calcFn(0,1);
}

// a stream that each element in it is calculated only once
function cachingFactorialStream(){
	function fact(n, accum){
		n += 1;
		var next = null;
		return {
			first: accum,
			rest: function(){
				if(next) return next;
				next = fact(n, accum*n); 
				return next;
			}
		};
	};
	return fact(0,1);
}



function takeWhileLazy(strm, pred){
    var _tw = function(sm){
        if(sm && pred(sm.first)){
            return {
                first: sm.first,
                rest: function(){return _tw(sm.rest());}
            };    
        }
        return null;
    };
    return _tw(strm);
}


function takeWhile(strm, pred){
    while(strm && pred(strm.first)){
          res.push(strm.first);
        strm = strm.rest();
    }
    return res;   
}

function take(strm, n){
	var res = [];
	for(var i=0;strm && i<n;i++, strm = strm.rest()){
		  res.push(strm.first);
	}
	return res;
}



function dropN(strm, count){
	while(count-- >0 && strm){
		strm = strm.rest();
	}
	return strm;
}


function map(strm, f){
	var _mapGen = function(sm){
		if(!sm) return null;
		return {
			first: f(sm.first),
			rest: function(){return _mapGen(sm.rest());}
		};
	};
	return _mapGen(strm);
}

function filter(strm, pred){
	var _filtGen = function(sm){
		if(!sm) return null;
		var g = sm;
		while(!pred(g.first)){ 
			g = g.rest();
			if(!g) return null;
		}
		return {
			first:g.first,
			rest: function(){return _filtGen(g.rest());}
		};
	};
	return _filtGen(strm);
}

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

function partition(strm, n, step){
    step = step || n;
    var _partGen = function(sm){
    	if(!sm) return null;
        var tmpStrm = sm;
        var res = [];
        var nextStrm = null;
        for(var i=0;tmpStrm && i<n;i++, tmpStrm=tmpStrm.rest()){
            if(step == i)
            	nextStrm = tmpStrm;
            res.push(tmpStrm.first);
        }
        nextStrm = nextStrm || tmpStrm;
        return {
            first:res,
            rest: function(){return _partGen(nextStrm);}
        };
    };
    return _partGen(strm);
}

function reductions(strm, f, seed){
	var _reducs = function(sm, accum){
		if(!sm) return null;	
		var res = f(accum, sm.first);
		return {
			first: res,
			rest: function(){return _reducs(sm.rest(), res);}
		};
	};
	if(seed != undefined)
		return _reducs(strm, seed);
	return _reducs(strm.rest(), strm.first);
}

function interleave(strm1, strm2){
	var _inter = function(sm1,sm2){
		if(!sm1 || !sm2) return null;
		return {
			first: sm1.first,
			rest: function(){return _inter(sm2, sm1.rest());}
		};
	};
	return _inter(strm1,strm2);
}
