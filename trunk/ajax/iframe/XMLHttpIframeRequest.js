// Obiekt imitujacy XMLHttpRequest za pomoca Iframe
// autor: Patryk yarpo Jar yarpo.pl
// data: 21-03-2011 r.

var XMLHttpIframeRequest = function() 
{
	var oSelf = { readyState  : CONST('UNSET') };

	var oDiv = null
		bAsync = true,
		aHeaders = [],
		bXml = false;

	function CONST(k)
	{
		var c = {	UNSET : 0,  OPENED : 1, LOADING : 3, READY : 4,
					INTERVAL : 100, ID : 'yXMLHttpIframeRequest' };
		return c[k];
	}

	function fInit(method, url)
	{
		if (null === oDiv)
		{
			var id = CONST('ID');
			oDiv = document.createElement('div');
			oDiv.style.border = "none";
			oDiv.style.width = '0';
			oDiv.style.height = '0';
			oDiv.innerHTML = '<iframe name="'+id+'" id="'+id+'" style="border:none; width:0;height:0;"></iframe>';
			document.body.appendChild(oDiv);
			oDiv.iframe = document.getElementById(id);
			oDiv.form = document.createElement('form');
			oDiv.form.setAttribute('id', id + '_form');
			oDiv.form.target = id;
			oDiv.appendChild(oDiv.form);
		}
		oDiv.form.action = url;
		oDiv.form.method = method;	
	}
	
	function fFillOutForm(data)
	{
		if ('string' !== (typeof data).toLowerCase())
		{
			return;
		}
		var params = data.split('&');
		oDiv.form.innerHTML = '';
		
		for(var i = 0; i < params.length; i++)
		{
			var keyVal = params[i].split('=');
			oDiv.form.innerHTML += '<input type="hidden" name="'+ keyVal[0] +'" value="'+ keyVal[1] +'">';
		}
	}	
	function fOpen(method, url, async)
	{
		fInit(method, url);
		fSetSelfVals(CONST('OPENED'));
		bAsync = (false === async) ? false : true;
	}
	function fSend(data)
	{
		fFillOutForm(data);
		if (true === bAsync)
		{
			fSetSelfVals(CONST('LOADING'));
			oSelf.onreadystatechange.apply(oSelf);

			oDiv.iframe.onload = function()
			{
				console.log('onload set');
				fSetSelfVals(CONST('READY'), document.getElementById(CONST('ID')).contentWindow.document);
				oSelf.onreadystatechange.apply(oSelf);
			}
			oDiv.form.submit();
		}
		else
		{
			alert('Połączenia synchroniczne nie są obsługiwane');
		}
	}
	
	function fSetSelfVals(readyState, response)
	{
		oSelf.readyState = readyState;
		if (true === bXml)
		{
			oSelf.responseXML = response;
		}
		else if (response)
		{
			console.log('set value text');
			oSelf.responseText = response.body.innerHTML;
		}
	}

	function fAbort()
	{
		fSetSelfVals(CONST('UNSET'));
		oSelf.onreadystatechange = null;
		bXml = false;
	}
	
	function fSetRequestHeader(k, v)
	{
		aHeaders.push({'header' : k, 'value' : v});
		bXml = ('content-type' === k.toLowerCase() && -1 !== v.indexOf('xml'));
	}
	
	function fGetRequestHeader()
	{
		if (0 == arguments.length)
		{
			var headCont = '';
			for(var i = 0; i < aHeaders.length; i++)
			{
				headCont += aHeaders[i].header + ': ' + aHeaders[i].value +'\n';
			}
			return headCont;
		}
		else if (1 == arguments.length)
		{
			for(var header in aHeaders)
			{
				if (header.header.toLowerCase() === arguments[0].toLowerCase())
				{
					return header.header + ': ' + header.value +'\n';
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
		status : 200, // mock
		statusText : 'OK' // mock
	};
};
