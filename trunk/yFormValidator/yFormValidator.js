// yFormValidator - obiekt walidujacy formularze wg zadanej konfiguracji
// @autor: Patryk yarpo Jar yarpo.pl
// @data: 6 VI 2011

// @usage:
// var data = {
//		form : 'info-form',
//		error : function(rule)
//		{
//			alert('[globalna funkcja] ' + this.id + ' nie spełnia ' + rule);
//		},
//		success : function(rule)
//		{
//			console.log('[globalna funkcja]', this, rule, 'ok');
//		},
//		items : [
//			element-name : 
//			{
//					rule : 'not empty',
//					required : true,
//					error : function(rule) { alert(this.id + ' nieprawidłowy'); },
//					success : function(rule) { alert(this.id + ' prawidłowy'); }
//			},
//			...
//		]
//	}
//	yFormValidator(data);

var yFormValidator = function( options )
{
	options = options || {};

	var oForm = document.getElementById(options.form);
	oForm.onsubmit = function() { return fValidation(); };

	// zwaraca obiekt RegExp z odpowiednim wyrazeniem regularnym
	// przyjmuje jako parametr string lub obiekt RegExp,
	// posiada kilka zdeklarowanych klas, np. 'int', 'date', 'email'
	// @param RegExp|string rule
	// @return RegExp
	function fGetREObj( rule )
	{
		if ((typeof rule).toLowerCase() === 'string')
		{
			switch(rule.toLowerCase())
			{
				case 'not empty' : 
					return (/^.+$/);
				case 'alphanumeric' : 
					return (/^\w*$/);
				case 'integer':
					return (/^[-]?\d+$/);
				case 'decimal':
					return (/^[-]?\d+(\.\d+)?$/);
				case 'date':
					return (/^(((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1]))\/(01|03|05|07|08|10|12)\/(([2-9][0-9]{3})|(1[6-9][0-9]{2})))|(((0[1-9])|(1[0-9])|(2[0-9])|(30))\/(04|06|09|11)\/(([2-9][0-9]{3})|(1[6-9][0-9]{2})))|(((0[1-9])|(1[0-9])|(2[0-8]))\/02\/(([2-9][0-9]{3})|(1[6-9][0-9]{2})))|(29\/02\/(((16|((2|4|6|8)(0|4|8))|((3|5|7|9)(2|6)))00)|([2-9][0-9](04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96))|(1[6-9](04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96))))$/);
				case 'email' :
					return (/^(([a-z0-9]+_+)|([a-z0-9]+\-+)|([a-z0-9]+\.+)|([a-z0-9]+\++))*[a-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-z]{2,6}$/i);
				default:
					return new RegExp(rule);
			}
		}
		return rule;
	}

	// obsluga zdarzenia - poprawne lub niepoprawne zwalidowanie
	// elementu formualrza
	// @param DOMElem elem - element formularza
	// @param RegExp - wyrażenie regularne walidujace
	// @param string event = {'error', 'success'}
	function fCallHandler( elem, item, event )
	{
		// wywolywanej ustalany jest this na element DOM

		if (item[event])
		{
			return item[event].call(elem, item.rule) || false;
		}
		else if (options[event])
		{
			return options[event].call(elem, item.rule) || false;
		}
		// brak funkcji obslugi zdarzen
		return false;
	}

	// waliduje formularz zgodnie z przekazana konfiguracja
	function fValidation()
	{
		var items = options.items,
			success = true,
			item,
			elem,
			event;

		for (item in items) 
		{
			if (typeof oForm[item] !== 'undefined')
			{
				elem = oForm[item];
				item = items[item];
				item.rule = fGetREObj(item.rule);

				if ((!item.required && !elem.value.length) ||
					(item.required && item.rule.test(elem.value)) || 
					(!item.required && elem.value.length && item.rule.test(elem.value)))
				{
					event = 'success';
				}
				else
				{
					event = 'error';
				}
				success = fCallHandler( elem, item, event ) && success;
			}
		}
		return success;
	}
};
