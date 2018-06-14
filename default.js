function individualhandler(options, event, context, callback) {
	context.simpledb.roomleveldata.policytype = 'Individual Policy';
	callback(options, event, context);
}

function grouphandler(options, event, context, callback) {
	context.simpledb.roomleveldata.policytype = 'Group Policy';
	callback(options, event, context);
}

function polnohandler(options, event, context, callback) {
	var polno = event.message;
	if (! /^[0-9]{10}$/.test(polno))
		context.sendResponse('Please enter a valid 10 digit Policy Number.');
	else {
		context.simpledb.roomleveldata.policynumber = event.message;
		var usernames = ['Ms Pratima Singh', 'Mrs Julia Simpson', 'Mr Ijaz Ahmad', 'Mrs Radhika Sharma', 'Mr Chris Lavino', 'Mr Jung Yang'];
		options.data.username = usernames[Math.floor(Math.random() * usernames.length)];
		callback(options, event, context);
	}
}

function custoidhandler(options, event, context, callback) {
	var custno = event.message;
	if (! /^[0-9]{8}$/.test(custno))
		context.sendResponse('Please enter a valid 8 digit Customer Id.');
	else {
		context.simpledb.roomleveldata.customerid = event.message;
		var usernames = ['Ms Pratima Singh', 'Mrs Julia Simpson', 'Mr Ijaz Ahmad', 'Mrs Radhika Subhedar', 'Mr Chris Lavino', 'Mr Jung Yang'];
		options.data.username = usernames[Math.floor(Math.random() * usernames.length)];
		callback(options, event, context);
	}
}

function hospitalhandler(options, event, context, callback) {
	context.simpledb.roomleveldata.hospital = event.message;
	callback(options, event, context);
}

function doahandler(options, event, context, callback) {
	if (validatedate(event.message, context) == false)
		context.sendResponse(context.simpledb.roomleveldata.dateerror);
	else {
		context.simpledb.roomleveldata.doa = event.message;
		callback(options, event, context);
	}
}

function validatedate(inputText, context) {
  var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
  // Match the date format through regular expression
  if(inputText.match(dateformat)) {
	//Test which seperator is used '/' or '-'
	var opera1 = inputText.split('/');
	var opera2 = inputText.split('-');
	lopera1 = opera1.length;
	lopera2 = opera2.length;
	// Extract the string into month, date and year
	var pdate;
	if (lopera1>1) {
		pdate = inputText.split('/');
	}
	else if (lopera2>1) {
		pdate = inputText.split('-');
	}
	var dd = parseInt(pdate[0]);
	var mm  = parseInt(pdate[1]);
	var yy = parseInt(pdate[2]);
	// Create list of days of a month [assume there is no leap year by default]
	var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
	if (mm == 1 || mm > 2) {
		if (dd > ListofDays[mm-1]) {
			context.simpledb.roomleveldata.dateerror = 'Please enter valid date';
			return false;
		}
	}
	if (mm == 2) {
		var lyear = false;
		if ( (!(yy % 4) && yy % 100) || !(yy % 400)) {
			lyear = true;
		}
		if ((lyear === false) && (dd >= 29)) {
			context.simpledb.roomleveldata.dateerror = 'Please enter valid date';
			return false;
		}
		if ((lyear === true) && (dd > 29)) {
			context.simpledb.roomleveldata.dateerror = 'Please enter valid date';
			return false;
		}
	}
	var today = new Date();
	today.setDate(today.getDate() - 1);
	var doaDate = new Date(yy, mm-1, dd);
	if (doaDate < today) {
		context.simpledb.roomleveldata.dateerror = 'Please enter future date only.';
		return false;
	}
	else {
		today.setDate(today.getDate() + 30);
		if (doaDate > today) {
			context.simpledb.roomleveldata.dateerror = 'Please enter a date within one month from today';
			return false;
		}
	}
  }
  else {
  	context.simpledb.roomleveldata.dateerror = 'Please enter valid date';
	return false;
  }
  return true;
}

function purposehandler(options, event, context, callback) {
	context.simpledb.roomleveldata.purpose = event.message;
	callback(options, event, context);
}

function sumhandler(options, event, context, callback) {
	options.next_state = 'botsum';
	var summary = "Type of policy: " + context.simpledb.roomleveldata.policytype + "\n";
	if (context.simpledb.roomleveldata.policynumber)
		summary += "Policy Number: " + context.simpledb.roomleveldata.policynumber + "\n";
	if (context.simpledb.roomleveldata.customerid)
		summary += "Customer Id: " + context.simpledb.roomleveldata.customerid + "\n";
	summary += "Hospital: " + context.simpledb.roomleveldata.hospital + "\n";
	summary += "Date of Admission: " + context.simpledb.roomleveldata.doa + "\n";
	summary += "Purpose of Admission: " + context.simpledb.roomleveldata.purpose;
	options.data.details = summary;
	callback(options, event, context);
}

module.exports.main = {
	individual: individualhandler,
	group: grouphandler
};

module.exports.policynumber = {
	polno: polnohandler
};

module.exports.customerid = {
	custoid: custoidhandler
};

module.exports.verified = {
	hospital: hospitalhandler,
	doa: doahandler,
	purpose: purposehandler
};

module.exports.summary = {
	sum: sumhandler
};