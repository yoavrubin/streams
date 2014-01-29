
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