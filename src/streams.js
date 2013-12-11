function intGen(){

	function generator(seed, stepFunc, actionFunc){
		return {
			first: actionFunc(seed),
			rest: function(){return generator(stepFunc(seed), stepFunc, actionFunc);}
		};
	}
	return generator(0, function(n){return n+1;}, function(n){return n;});
}


function takeWhileLazy(gen, pred){
    var _tw = function(g){
        if(pred(g.first)){
            return {
                first: g.first,
                rest: function(){return _tw(g.rest());}
            };    
        }
        return null;
    };
    return _tw(gen);
}


function takeWhile(gen, pred){
    while(pred(gen.first)){
          res.push(gen.first);
        gen = gen.rest();
    }
    return res;   
}

function take(gen, n){
	var res = [];
	for(var i=0; i<n;i++, gen = gen.rest()){
		  res.push(gen.first);
	}
	return res;
}



function dropN(gen, count){
	while(count-- >0){
		gen = gen.rest();
	}
	return gen;
}


function factorialGenerator(){
	var calcFn = function(n, accum){
		return {
			first: accum,
			rest: function(){return calcFn(n+1, accum*(n+1));}
		};
	};
	
	return calcFn(1,1);
}


function map(gen, f){
	var _mapGen = function(gen){
		return {
			first: f(gen.first),
			rest: function(){return _mapGen(gen.rest());}
		};
	};
	return _mapGen(gen);
}

function filter(gen, pred){
	var _filtGen = function(gen){
		var g = gen;
		while(!pred(g.first)) 
			g = g.rest();
		return {
			first:g.first,
			rest: function(){return _filtGen(g.rest());}
		};
	};
	return _filtGen(gen);
}

function streamify(iterable){
	var decapFunc = null;
	if(typeof iterable === "string")
		decapFunc = function(str){return str.substring(1);};
	if(Object.prototype.toString.call(iterable) == "[object Array]")
		decapFunc = function(arr){return arr.slice(1);};
	var _iter = function(itr){
		if(itr == null){
			return {
				first: null,
				rest: function(){return null;}
			};
		}
		return {
			first: itr[0],
			rest: function(){return _iter(decapFunc(itr));}
		};
	};
	return _iter(iterable);
}

function partition(gen, n, step){
    step = step || n;
    var _partGen = function(g){
        var tmpGen = g;
        var res = [];
        var nextGen = null;
        for(var i=0;i<n;i++, tmpGen=tmpGen.rest()){
            if(step == i)
                nextGen = tmpGen;
            res.push(tmpGen.first);
        }
        nextGen = nextGen || tmpGen;
        return {
            first:res,
            rest: function(){return _partGen(nextGen);}
        };
    };
    return _partGen(gen);
}

function reductions(gen, f, seed){
	var _reducs = function(g, accum){
		var res = f(accum, g.first);
		return {
			first: res,
			rest: function(){return _reducs(g.rest(), res);}
		};
	};
	if(seed != undefined)
		return _reducs(gen, seed);
	return _reducs(gen.rest(), gen.first);
}

function interleave(gen1, gen2){
	var _inter = function(g1,g2){
		return {
			first: g1.first,
			rest: function(){return _inter(g2, g1.rest());}
		};
	};
	return _inter(gen1,gen2);
}
