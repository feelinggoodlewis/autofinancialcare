/*
 * <%--
 * Requires utils.js and validation.css
 * 
 * Add attribute data-validationSpec and list the keywords for the validations that need to be performed
 * for that element separated by space as the value. Optionally, also add attribute data-validationFieldLabel and set its value
 * to the name by which the element must be referred to in error messages; this is merely to make error messages nicer.
 * Optionally add the attribute data-validationErrorMessageContainerId and set its value to the id of the div element
 * in which the error message will be displayed.
 * If the red border displayed around an element with error must be displayed around another element instead, optionally specify
 * the id of the other element in the attribute data-validationErrorBorderElementId of the element being validated.
 * 
 * Invoke the validateAndDisplayError method in the onblur method.
 * Invoke the validateAllAndDisplayErrors method in the onclick method of the form submit button.
 * 
 *  For example:
 *  
 *  <input type="text" id="regexText" data-validationSpec="required regex \d{3}" data-validationFieldLabel="Score" onblur="validateAndDisplayError(this);"/>
 *  
 *  --%>
 */

var validationSpecAttribName = "data-validationSpec";

/**
 * Validate and display error for the specified element.
 * @param element
 * @returns {Boolean} true if valid, false otherwise.
 */
function validateAndDisplayError(element) {
	var errorMessage = validateElement(element);
	displayErrorMessage(element, errorMessage);
	
	return errorMessage==null;
}

function validateElement(element) {
	return validate(getValue(element), element.getAttribute(validationSpecAttribName), element.getAttribute("data-validationFieldLabel"));
}

/**
 * Validate the specified value based on the validation types.
 * 
 * @param value
 * @param validationTypes a string with the different validation types separated by space.
 * @param fieldLabel the name by which the field can be referred in error messages. Optional, can be null.
 * 
 * @returns the error message if invalid, null if valid.
 */
function validate(value, validationTypes, fieldLabel) {
	
	fieldLabel = (fieldLabel ? fieldLabel : "");
	
	if (validationTypes == null || validationTypes.trim().length == 0) {
		return null; // No validation needed.
	}
	
	var validationTypesArr = validationTypes.split(" ");
	if (validationTypesArr == null || validationTypesArr.length == 0) {
		return;
	}
	
	var errorMessage = null;
	
	for (var i = 0; errorMessage==null && i < validationTypesArr.length; i++) {
		
		var valdnType = validationTypesArr[i];
		if (valdnType == null || valdnType.trim().length == 0) {
			continue;
		}
		
		switch(valdnType.trim().toLowerCase()) {
			case "email" :
				errorMessage = validateEmailAddress(value);
			break;
			
			case "regex" :
				i++;
				var regexStr = "^" + validationTypesArr[i] + "$"; // The entire value must be matched.
				if (value.search(regexStr) != 0) { // value must be matched entirely.
					errorMessage = "Invalid " + fieldLabel;
				}
			break;
		
			case "required" :
				if (value == null || value.trim().length == 0) {
					errorMessage = "This is required";
				}
			break;
			
			case "ssn" :
				validationTypesArr.push("regex");
				validationTypesArr.push("\\d{9}")
			break;
				
			case "ssnformatted" :
				validationTypesArr.push("regex");
				validationTypesArr.push("\\d{3}-\\d{2}-\\d{4}")
			break;
				
			case "true" :
				if (value == null || value.toLowerCase() != "true") {
					errorMessage = "This is required";
				}
			break;
			
			case "usdate" :
				errorMessage = validateUSDate(value);
			break;
			
			case "usdob" :
				errorMessage = validateUSDoB(value);
			break;
			
			case "usphone" :
				errorMessage = validateUSPhoneNumber(value);
			break;
			
			case "usphoneformatted" :
				validationTypesArr.push("regex");
				validationTypesArr.push("\\(\\d{3}\\)\\s*\\d{3}-\\d{4}")
				validationTypesArr.push("usphone");
			break;
			
			case "zip" :
				validationTypesArr.push("regex");
				validationTypesArr.push("\\d{5}")
			break;
		}
	}
	
	return errorMessage;
}


/**
 * Validate all validatable elements and display errors.
 * 
 * @returns {Boolean} true if all fields are valid, false otherwise.
 */
function validateAllAndDisplayErrors() {
	var validatableElements = getAllElementsWithAttribute(validationSpecAttribName);
	
	if (validatableElements == null || validatableElements.length == 0) {
		return;
	}
	
	var valid = true;
	
	for (var i = 0; i < validatableElements.length; i++) {
		valid = validateAndDisplayError(validatableElements[i]) && valid;
	}
	
	return valid;
}



function validateUSPhoneNumber(phoneNumber) {
	if (!phoneNumber) {
		return null; // May or may not be a required field.
	}
	
	var onlyDigits = phoneNumber.replace(/\D/g, "");
	
	if (onlyDigits.length != 10) {
		return "Must be 10 digits";
	}
	
	if (startsWith(onlyDigits, "0") || startsWith(onlyDigits, "1")) {
		return "Must not begin with a 0 or 1";
	}
	
	return null; // Is valid phone number.
}


function validateUSDate(mmddyyyy) {
	return doValidateMMDDYYYYDate(mmddyyyy, null, null);
}

function validateUSDoB(mmddyyyy) {
	return doValidateMMDDYYYYDate(mmddyyyy, 100, 18);
}


/**
 * Validate a date
 * @param mmddyyyy A string with a date in the mm/dd/yyyy format. However,
 * the month can be 1 or 2 digits, date can be 1 or 2 digits and year can be 2 or 4 digits.
 *  
 * @param lowerLimitOffset Optional. If not null, the year must not be lower than this limit to be valid.
 * @param upperLimitOffset Optional. If not null, the year must not be higher than this limit to be valid.
 * @returns error message if invalid, null if valid.
 */
function doValidateMMDDYYYYDate(mmddyyyy, lowerLimitOffset, upperLimitOffset) {
	if (!mmddyyyy) {
		return null; // May or may not be a required field. 
	}
	
	if (mmddyyyy.search("^\\d{1,2}[/-]\\d{1,2}[/-](\\d{2}|\\d{4})$") != 0) { // mmddyyyy must be matched entirely.
		return "Invalid date (use MMDDYYYY)";
	}
	
	// Split mmddyyyy in month date and year.
	var monthDayYear = mmddyyyy.split(/[\/-]/);
	
	var month = parseInt(monthDayYear[0], 10);
	var dayOfMonth 	= parseInt(monthDayYear[1], 10);
	var year 	= parseInt(monthDayYear[2], 10);
	
	if (month && dayOfMonth && year) {
		year = adjustTwoDigitYear(year);
		var date = new Date(year, month - 1, dayOfMonth, 0, 0, 0, 0);

		if (month == date.getMonth()+1 && dayOfMonth == date.getDate() && year == date.getFullYear()) {
			
			var currentYear = new Date().getFullYear();
			
			if (lowerLimitOffset != null && upperLimitOffset != null && false==(currentYear-lowerLimitOffset <= year && year <= currentYear-upperLimitOffset)) {
				return "Must be between " + (currentYear-lowerLimitOffset) + " and " + (currentYear-upperLimitOffset);
			}
			else if (lowerLimitOffset != null && false==(currentYear-lowerLimitOffset <= year)){
				return "Must not be before " + (currentYear-lowerLimitOffset);
			}
			else if (upperLimitOffset != null && false==(year <= currentYear-upperLimitOffset)) {
				return "Must not be after " + (currentYear-upperLimitOffset);
			}
			
			return null; // Valid date.
		}
	}
	
	return "Invalid date";
}


	
/**
 * Adjust 2 digit years to be in either the 1900s or the 2000s.
 * Do not make any adjustments if the year is not a two digit year.
 * 
 * @param year
 * @return
 */
function adjustTwoDigitYear(year) {
	if (20 < year && year < 100) {
		// A year in the 1900s
		return year + 1900;
	}
	else if (year <= 20) {
		// A year in the 2000s
		return year + 2000;
	}
	
	return year;
}


function validateEmailAddress(email) {
	if (email == null || email.trim().length == 0) {
		return null; // May or may not be required.
	}
	
	var errorMessage = "Invalid email";
	var i1 = email.indexOf("@");
	var i2 = email.lastIndexOf("@");
	var i3 = email.indexOf(".");
	var i4 = email.lastIndexOf(".");
	var lastIndex = email.length - 1;
	
	if (i1 != i2 || i1 <= 0 || i3 <= 0 || i1 == lastIndex || i4 == lastIndex) {
		return errorMessage;
	}
	
	// Verify that .s and the @ occur singly, never together.
	var i = -1;
	while (i < lastIndex) {
		
		i = email.indexOf(".", i+1);
		if (i < 0) {
			break;
		}
		
		if (i < lastIndex) {
			var ch = email.charAt(i+1);
			if (ch == "." || ch == "@") {
				return errorMessage;
			}
		}
		
		if (i > 0) {
			var ch = email.charAt(i-1);
			if (ch == "." || ch == "@") {
				return errorMessage;
			}
		}
	}

	return  null; // Valid
}


function displayErrorMessage(element, errorMessage) {
	var errMsgContainerId = element.getAttribute("data-validationErrorMessageContainerId");
	var errorMessageContainer = null;
	
	if (errMsgContainerId != null) {
		errorMessageContainer = document.getElementById(errMsgContainerId);
	}
	
	if (errorMessageContainer == null) {
		errorMessageContainer = document.getElementById(element.id + "-error");
	}
	
	// The error border may need to be displayed around another element sometimes, for example,
	// if the element being validated is small, like a check box.
	var errBorderElemId = element.getAttribute("data-validationErrorBorderElementId");
	var errorBorderElement = null;
	
	if (errBorderElemId != null) {
		errorBorderElement = document.getElementById(errBorderElemId);
	}
	
	if (errorBorderElement == null) {
		errorBorderElement = element;	// Display the error border around the element being validated.
	}
	
	if (errorMessage == null) {
		setTimeout(function(){
			errorMessageContainer.innerHTML = "";
			setBorder(errorBorderElement, true);
		}, 200);
	}
	else {
		errorMessageContainer.innerHTML = errorMessage;
		setBorder(errorBorderElement, false);
		return false;
	}	
}

function setBorder(item, valid) {
	if (item) {
		if (item.nodeName.toLowerCase() === 'select_nope') {
			var selectBoxItId = item.id + "SelectBoxItContainer";
			var sbit = document.getElementById(selectBoxItId);
			sbit.style.border = (valid?'':'1px solid #CC0000');
			sbit.style.borderRadius = (valid?'':'6px 6px 6px 6px');
			sbit.style.MozBorderRadius = (valid?'':'6px 6px 6px 6px');
			sbit.style.WebkitBorderRadius = (valid?'':'6px 6px 6px 6px');
		} else {
			item.style.border = (valid?'':'1px solid #CC0000');
		}
	}
}