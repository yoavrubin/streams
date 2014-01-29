// several specific streams
// for now - integer streams, factorials stream and a factorial stream that shows how to cache the created elements

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

