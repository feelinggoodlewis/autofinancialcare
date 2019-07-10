// JavaScript Document
function PopUp(theURL,winName,features) { //v2.0
	window.open(theURL,winName,features);
}

function popitup(url) {
	newwindow=window.open(url,'name','height=500,width=400,scrollbars=1');
	if (window.focus) {newwindow.focus();}
	return false;
}

var TIMER_COOKIE_NAME = "timerStartTime";

function createCookie(name, value, days) {
	var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}		

function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

function createTimerCookieUnlessItAlreadyExists() {
	if (!readCookie(TIMER_COOKIE_NAME)) {
		createCookie(TIMER_COOKIE_NAME, new Date().getTime(), 45);
	}
}		

//var startTime = new Date().getTime();
/*
function updateTimer() {
	var startTime = readCookie(TIMER_COOKIE_NAME);
	
	var div = document.getElementById("counter");
	var remaining = 10*60*1000 - (new Date().getTime() - startTime);
	remaining = remaining/1000;
	if (remaining <= 0) {
		div.innerHTML = '00:00';
		
		var warning = document.getElementById("warning-image");
		warning.style.display='';
		alert("Press Okay for more time.  Meow hurry up!");
		warning.style.display='none';
		
// 				var response = confirm("Well, do you?");
//		if (response == true) {
//			alert("Meow you've done it.");
//			warning.style.display='none';
//		} else {
//			alert("Okay, then I'll give you more time.  Meow hurry up!");
//			warning.style.display='none';
//		}
				
			
		
		createCookie(TIMER_COOKIE_NAME, new Date().getTime(), 45);
		
	} else {
		var time = to2DigitString(Math.floor(remaining/60)) + ":";
		remaining = remaining - (60 * (Math.floor(remaining/60)));
		time = time + to2DigitString(Math.floor(remaining));
		div.innerHTML = time;
	}
	setTimeout(function(){updateTimer();}, 100);
}
*/


function updateTimer() {
	var startTime = readCookie(TIMER_COOKIE_NAME);
	
	var div = document.getElementById("counter");
	var remaining = 10*60*1000 - (new Date().getTime() - startTime);
	remaining = remaining/1000;
	if (remaining <= 0) {
//		div.innerHTML = 'any second!';
//		div.innerHTML = '00:00';
		var response = confirm("Secure session has almost expired.  Do you need more time?");

		if (response == true) {
			createCookie(TIMER_COOKIE_NAME, new Date().getTime(), 45);
			setTimeout(function(){updateTimer();}, 100);
		} else {
			div.innerHTML = 'any second!';
		}
	} else {
		var time = Math.floor(remaining/60) + " minutes and ";
		remaining = remaining - (60 * (Math.floor(remaining/60)));
		time = time + to2DigitString(Math.floor(remaining)) + " seconds.";
		div.innerHTML = time;
		setTimeout(function(){updateTimer();}, 100);
	}
}



function to2DigitString(i) {
	return (Math.abs(i) < 10)?"0" + i:"" + i;
}



function popunder(sUrl, xLocation) {
    var _parent = self;
    detectBrowser();
    var bPopunder = (jQuery.browser.msie && jQuery.browser.majorVersion < 9);

    if (top != self) {
        try {
            if (top.document.location.toString()) {
                _parent = top;
            }
        }
        catch(err) { }
    }

    /* popunder options */
//    var sOptions = 'toolbar=1,scrollbars=1,location=1,statusbar=1,menubar=0,resizable=1,width=' + (screen.availWidth - 10).toString();
//    sOptions += ',height=' + (screen.availHeight - 122).toString() + ',screenX=0,screenY=0,left=0,top=0';

	var sOptions = "left=" + xLocation + ",scrollbars=yes,location=1,width=1000,height=600,resizable=yes"; 
	
    /* create pop-up from parent context */
    var popunder = _parent.window.open(sUrl, 'offer_popup', sOptions);
    if (popunder) {
        popunder.blur();
        if (bPopunder) {
            /* classic popunder, used for old ie*/
            window.focus();
            try { opener.window.focus(); } catch (err) { }
        }
        else {
            /* popunder for e.g. ff4+, chrome, ie9 */
            popunder.init = function(e) {
                with (e) {
                    (function() {
                        if (typeof window.mozPaintCount != 'undefined') {
                            var tw = window.open('about:blank');
                            tw.close();
                        }

                        try { opener.window.focus(); }
                        catch (err) { }
                    })();
                }
            };
            popunder.params = {
                url: sUrl
            };
            popunder.init(popunder);
        }
    }
    
    return this;
}


function popunderWithWindowName(sUrl, xLocation, windowName) {
    var _parent = self;
    detectBrowser();
    var bPopunder = (jQuery.browser.msie && jQuery.browser.majorVersion < 9);

    if (top != self) {
        try {
            if (top.document.location.toString()) {
                _parent = top;
            }
        }
        catch(err) { }
    }
    /* popunder options */
//    var sOptions = 'toolbar=1,scrollbars=1,location=1,statusbar=1,menubar=0,resizable=1,width=' + (screen.availWidth - 10).toString();
//    sOptions += ',height=' + (screen.availHeight - 122).toString() + ',screenX=0,screenY=0,left=0,top=0';

	var sOptions = "left=" + xLocation + ",scrollbars=yes,location=1,width=1000,height=600,resizable=yes"; 
	
    /* create pop-up from parent context */
    var popunder = _parent.window.open(sUrl, windowName, sOptions);
    if (popunder) {
        popunder.blur();
        if (bPopunder) {
            /* classic popunder, used for old ie*/
            window.focus();
            try { opener.window.focus(); } catch (err) { }
        }
        else {
            /* popunder for e.g. ff4+, chrome, ie9 */
            popunder.init = function(e) {
                with (e) {
                    (function() {
                    	    if (typeof window.mozPaintCount != 'undefined') {
                            var tw = window.open('about:blank');
                            tw.close();
                        }

                        try { opener.window.focus(); }
                        catch (err) { }
                    })();
                }
            };
            popunder.params = {
                url: sUrl
            };
            popunder.init(popunder);
        }
    }

    return this;
}





function setSelectedOptionText(dropDown, optionText) {
	for (var i = 0; i < dropDown.options.length; i++) {
		if (dropDown.options[i].text == optionText) {
			dropDown.selectedIndex = i;
			break;
		}
	}
}



function getValue(element) {
	if (element == null) {
		return null;
	}
	
	switch(element.tagName.toLowerCase()) {
		case "input" :
			switch(element.type) {
				case "checkbox" :
					return "" + element.checked;
				break
				
				case "radio" :
					var radioBtnGroup = document.getElementsByName(element.name);
					var values = [];
					var atLeastOneRadioBtnChecked = false;
					
					for (var i = 0; i < radioBtnGroup.length; i++) {
						var checked = radioBtnGroup[i].checked;
						atLeastOneRadioBtnChecked = (atLeastOneRadioBtnChecked || checked);
						
						if (checked) {
							if (radioBtnGroup[i].value) {
								values.push(radioBtnGroup[i].value);
							}
							else {
								values.push("true");
							}
						}
						else {
							if (radioBtnGroup[i].value) {
								values.push(null);
							}
							else {
								values.push("false");
							}
						}
					}
					
					if (atLeastOneRadioBtnChecked) {
						return values.toString();
					}
					
					return null;
				break;
				
				default :
					return element.value;
				break;
			}
		break;
		
		case "select" :
			return element.options[element.selectedIndex].value;
		break;
		
		default:
			return null;
		break
	}
}


/*
 * String.startsWith() is not supported on IE and on Chrome below version 41.
 */
function startsWith(s, prefix) {
	if (s == null && prefix == null) {
		return true;
	}
	else if (s == null || prefix == null) {
		return false;
	}
	
	return s.indexOf(prefix) == 0;
}


function getAllElementsWithAttribute(attributeName)
{
	var elementsWithAttribute = [];
	var allElements = document.getElementsByTagName("*");
	
	for (var i = 0; i < allElements.length; i++)
	{
		var elem = allElements[i];
		if (elem.hasAttribute(attributeName))
		{
			elementsWithAttribute.push(elem);
		}
	}
	
	return elementsWithAttribute;
}



function closeWindow() {
	window.opener = self;
	window.close();
}