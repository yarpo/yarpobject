// obiekt symulujacy XMLHttpRequest oparty o cookies
// autor: Patryk yarpo Jar
// data : 08-IV-2011

function XMLHttpCookieRequest()
{
	var oSelf = { readyState : CONST('UNSET') };

	var nAttemptCounter = 0,
		sUrl = '',
		bAsync = true,
		aHeaders = [],
		bXml = false;

	function CONST(k)
	{
		var c = {	UNSET : 0,  OPENED : 1, LOADING : 3, READY : 4,
					COOKIE_NAME : 'yXMLHttpCookieRequest',
					ERROR : 500, ERROR_TXT : 'Server Error',
					MAX_ATTEMPTS : 10, INTERVAL : 100 };
		return c[k];
	}

	function fOpen(method, url, async)
	{
		// only GET method
		sUrl = url;
		bAsync = (false === async) ? false : true;
		oSelf.readyState = CONST('OPENED');
	}

	function fSend(data) 
	{
		fReset();

		var i = new Image();
		i.src = sUrl + '?' + data;
		oSelf.readyState = CONST('LOADING');

		if (bAsync)
		{
			setTimeout(fRead, CONST('INTERVAL'));
		}
		else
		{
			alert('Żądania synchrnoczne nie wspierane');
		}
	}

	function fStr2Xml(text)
	{
		if (window.ActiveXObject)
		{
			var doc = new ActiveXObject('Microsoft.XMLDOM');
			doc.async = 'false';
			doc.loadXML(text);
		}
		else
		{
			var parser = new DOMParser();
			var doc = parser.parseFromString(text,'text/xml');
		}
		return doc;
	}

	function fReadData(data)
	{
		if (bXml)
		{
			oSelf.responseXml = fStr2Xml(data);
		}
		else
		{
			oSelf.responseText = data;
		}
		oSelf.readyState = CONST('READY');
	}
	

	function fRead()
	{
		nAttemptCounter++;
		var data = fGetCookie();
		if (false !== data) 
		{
			fReadData(data);
			oSelf.onreadystatechange.apply(oSelf);
			return;
		}

		if (nAttemptCounter > CONST('MAX_ATTEMPTS')) 
		{
			oSelf.status = CONST('ERROR');
			oSelf.statusText = CONST('ERROR_TXT');
			oSelf.onreadystatechange.apply(oSelf);
		}
		else 
		{
			setTimeout(fRead, CONST('INTERVAL'));
		}
	}

	function fReset()
	{
		oSelf.readyState = CONST('UNSET');
		nAttemptCounter = 0;
		fDelCookie();
		delete oSelf.responseText;
		delete oSelf.responseXml;
	}

	function fAbort()
	{
		sUrl = '';
		bAsync = true;
		bXml = false;
		fReset();
	}

	function fDelCookie()
	{
		document.cookie = CONST('COOKIE_NAME') + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
	}
	
	function fGetCookie()
	{
		var docCookie = document.cookie.split("; ");
		for (var i=0; i < docCookie.length; i++)
		{
			var piece = docCookie[i].split("=");
			if (piece[0] === CONST('COOKIE_NAME')) 
			{
				return unescape(String(piece[1]).replace(/\+/g, " "));
			}
		}
		return false;
	}

	function fSetRequestHeader(k, v)
	{
		aHeaders.push({'header' : k, 'value' : v});
		bXml = ('content-type' === k.toLowerCase() && -1 !== v.toLowerCase().indexOf('xml'));
	}

	function fGetRequestHeader()
	{
		if (0 == arguments.length)
		{
			var headCont = '';
			for(var i = 0; i < aHeaders.length; i++)
			{
				headCont += aHeaders[i].header + ': ' + aHeaders[i].value + '\n';
			}
			return headCont;
		}
		else if (1 == arguments.length)
		{
			for(var header in aHeaders)
			{
				if (header.header.toLowerCase() === arguments[0].toLowerCase())
				{
					return header.header + ': ' + header.value + '\n';
				}
			}
		}
	}

	return oSelf = {
		open : fOpen,
		send : fSend,
		abort : fAbort,
		setRequestHeader : fSetRequestHeader,
		getResponseHeader : fGetRequestHeader,
		getAllResponseHeaders : fGetRequestHeader,
		onreadystatechange : null,
		status : 200,
		statusText : 'OK'
	};
};
