// obiekty yAjax sluzy do wygodnego korzystania z ajax
//
// @author Patryk yarpo Jar yarpo.pl
// @date   20 04 2011
//
// warto zajrzec na: http://www.yarpo.pl/2011/03/17/wygodny-obiekt/
//
// @uses yVarsObj - ten sam plik
// @uses jQuery   - http://jquery.com/

// fabryka obiektu przechowujacego dane
var yVarsObj = function()
{
	var oVars = {};
 
	function fGet(n)
	{
		return oVars[n];
	}
	function fDel(n)
	{
		var val = oVars[n];
		delete oVars[n];
		return val;
	}
	function fClear()
	{
		oVars={};
	}
	function fKeyExists(n)
	{
		return ('undefined' === typeof oVars[n]) ? false : true;
	}
	function fAdd(n,v)
	{
		if ('undefined' === typeof n || 'undefined' === typeof v)
		{
			return false;
		}
		oVars[n] = v;
		return true;
	}
	function fAll(o)
	{
		if ('object' === typeof o)
		{
			oVars=o;
		}
		return oVars;
	}
 
	return {
		add:fAdd,
		get:fGet,
		del:fDel,
		clear:fClear,
		all:fAll,
		exists:fKeyExists,
	};
};

// fabryka obiektu obudowujacego jQuery.ajax
var yAjax = function()
{
	var sMethod = 'POST',
		sPath = '',
		sDataType = 'text',
		bAsunc = false,
		bCache = false,
		oParam = yVarsObj();
 
	var fBefore = null,
		fComplete = null,
		fError = null,
		fSuccess = null,
		oResponse = null;

	// gettery / settery
	function fMethod(m)
	{
		sMethod = (m) ? m.toUpperCase() : sMethod;
		return sMethod;
	}
	function fUrl(u)
	{
		sPath = u || sPath;
		return sPath;
	}
	function fDataType(d)
	{
		sDataType = d || sDataType;
		return sDataType;
	}
	function fAsync(s)
	{
		if (false === s || true === s)
		{
			bAsunc=s;
		}
		return bAsunc;
	}
	function fSetSuccess(f)
	{
		fSuccess = f;
	}
	function fSetError(f)
	{
		fError = f;
	}
	function fSetComplete(f)
	{
		fComplete = f;
	}
	function fSetBefore(f)
	{
		fBefore = f;
	}

	// wysylanie zadania
	function fSend()
	{
		oResponse = $.ajax({
			async : bAsunc,
			type : sMethod,
			url : sPath,
			cache : bCache,
			data : oParam.all(),
			dataType : sDataType,
			success : fSuccess,
			error : fError,
			beforeSend : fBefore,
			complete : fComplete
		});
 
		return oResponse;
	}
	function fResponse()
	{
		return oResponse;
	}
	function fReset()
	{
		sMethod = 'POST';
		sPath = '';
		oParam.clear();
		bAsunc = bCache = false;
		fBefore = fComplete = fError = fSuccess = oResponse = null;
		sDataType = 'text';
	}

	// zewnetrzny interfejs
	return {
		data   : oParam,
		method : fMethod,
		success: fSetSuccess,
		error  : fSetError,
		before : fSetBefore,
		complete: fSetComplete,
		url  : fUrl,
		send : fSend,
		response : fResponse,
		reset : fReset,
		type : fDataType,
		async: fAsync
	};
};
