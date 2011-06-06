// autor: Patryk yarpo Jar 
// http://www.yarpo.pl/2011/06/06/wykorzystanie-yformvalidator-walidacja-formularzy/
var yFormValidator=function(_1){
_1=_1||{};
var _2=document.getElementById(_1.form);
_2.onsubmit=function(){
return _3();
};
function _4(_5){
if((typeof _5).toLowerCase()==="string"){
switch(_5.toLowerCase()){
case "not empty":
return (/^.+$/);
case "alphanumeric":
return (/^\w*$/);
case "integer":
return (/^[-]?\d+$/);
case "decimal":
return (/^[-]?\d+(\.\d+)?$/);
case "date":
return (/^(((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1]))\/(01|03|05|07|08|10|12)\/(([2-9][0-9]{3})|(1[6-9][0-9]{2})))|(((0[1-9])|(1[0-9])|(2[0-9])|(30))\/(04|06|09|11)\/(([2-9][0-9]{3})|(1[6-9][0-9]{2})))|(((0[1-9])|(1[0-9])|(2[0-8]))\/02\/(([2-9][0-9]{3})|(1[6-9][0-9]{2})))|(29\/02\/(((16|((2|4|6|8)(0|4|8))|((3|5|7|9)(2|6)))00)|([2-9][0-9](04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96))|(1[6-9](04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96))))$/);
case "email":
return (/^(([a-z0-9]+_+)|([a-z0-9]+\-+)|([a-z0-9]+\.+)|([a-z0-9]+\++))*[a-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-z]{2,6}$/i);
default:
return new RegExp(_5);
}
}
return _5;
};
function _6(_7,_8,_9){
if(_8[_9]){
return _8[_9].call(_7,_8.rule)||false;
}else{
if(_1[_9]){
return _1[_9].call(_7,_8.rule)||false;
}
}
return false;
};
function _3(){
var _a=_1.items,_b=true,_c,_d,_e;
for(_c in _a){
if(typeof _2[_c]!=="undefined"){
_d=_2[_c];
_c=_a[_c];
_c.rule=_4(_c.rule);
if((!_c.required&&!_d.value.length)||(_c.required&&_c.rule.test(_d.value))||(!_c.required&&_d.value.length&&_c.rule.test(_d.value))){
_e="success";
}else{
_e="error";
}
_b=_6(_d,_c,_e)&&_b;
}
}
return _b;
};
};

