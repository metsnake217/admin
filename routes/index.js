var labyokeFinderClass = require('./labyokerfinder');
var accounting = require('./accounting');
var dates = require('../config/staticvariables');

var LabYokeUsers = labyokeFinderClass.LabYokeUsers;
var LabYokeGlobal = labyokeFinderClass.LabYokeGlobal;
var LabYokeDepartment = labyokeFinderClass.LabYokeDepartment;
var LabYokerOrder = labyokeFinderClass.LabYokerOrder;
var LabYokeReporterOrders = labyokeFinderClass.LabYokeReporterOrders;
var LabYokeReporterShares = labyokeFinderClass.LabYokeReporterShares;
var LabYokeReporterSavings = labyokeFinderClass.LabYokeReporterSavings;
var LabYokerGetOrder = labyokeFinderClass.LabYokerGetOrder;
var LabyokerPasswordChange = labyokeFinderClass.LabyokerPasswordChange;
var LabyokerRegister = labyokeFinderClass.LabyokerRegister;
var LabYokeFinder = labyokeFinderClass.LabYokeFinder;
var LabYokeUploader = labyokeFinderClass.LabYokeUploader;
var Labyoker = labyokeFinderClass.Labyoker;
var LabYokeAgents = labyokeFinderClass.LabYokeAgents;
var LabyokerUserDetails = labyokeFinderClass.LabyokerUserDetails;
var LabYokerChangeShare = labyokeFinderClass.LabYokerChangeShare;
var moment = require('moment-timezone');

var express = require('express');
var util = require('util');
var router = express.Router();

var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

//var fs = require('fs');
//html-pdf

var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
var upload = multer({ //multer settings
    storage: storage,
    fileFilter : function(req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        console.log("inside upload function");
        callback(null, true);
    }
}).single('file');


module.exports = function(router) {

	var competitionStarts = dates.competitionStarts;
	var competitionEnds = dates.competitionEnds;

    router.post('/createdepartment', isLoggedInSuperAdmin, function(req, res) {
		var labYokeGlobal = new LabYokeGlobal();
		var labYokeDepartment = new LabYokeDepartment(req.body.department);
		console.log("department is: " + req.body.department);
		labYokeDepartment.createdepartment(function(error, results) {
			var status = results[0];
			var message = results[1];
			console.log("createdepartment status: " + status);
			console.log("createdepartment message: " + message);
		labYokeGlobal.finddepartments(function(error, departments) {
			var errormessagedept = null;
			var successmessagedept = null;
			if(status == "success"){
				successmessagedept = message;
			} else {
				errormessagedept = message;
			}
			console.log("departments: " + departments.length);
			res.render('departments', {admins:departments[5],labadmins: departments[4], section:"department", labs: departments[3], errormessagedept: errormessagedept, successmessagedept: successmessagedept, depts: departments[0], vennsettings: departments[2], users: departments[1],labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
			req.session.messages = null;
		});
		});
    });

    router.post('/createlab', isLoggedInSuperAdmin, function(req, res) {
		var labYokeGlobal = new LabYokeGlobal();
		var labYokeLab = new LabYokeLab(req.body.labname, req.body.deptlab, req.body.adminlab);
		console.log("lab is: " + req.body.labname);
		labYokeLab.createlab(function(error, results) {
			var status = results[0];
			var message = results[1];
			console.log("createlab status: " + status);
			console.log("createlab message: " + message);
		labYokeGlobal.finddepartments(function(error, departments) {
			var errormessagelab = null;
			var successmessagelab = null;
			if(status == "success"){
				successmessagelab = message;
			} else {
				errormessagelab = message;
			}
			console.log("departments: " + departments.length);
			res.render('departments', {admins:departments[5],labadmins: departments[4], section:"lab", labs: departments[3], errormessagelab: errormessagelab, successmessagelab: successmessagelab, depts: departments[0], vennsettings: departments[2], users: departments[1], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
			req.session.messages = null;
		});
		});
    });

    router.post('/editlab', isLoggedInSuperAdmin, function(req, res) {
		var labYokeGlobal = new LabYokeGlobal();
		var labYokeLab = new LabYokeLab(req.body.labnameedit, req.body.deptlabedit, req.body.adminlabedit);
		console.log("lab is: " + req.body.labname);
		labYokeLab.editlab(function(error, results) {
			var status = results[0];
			var message = results[1];
			console.log("createlab status: " + status);
			console.log("createlab message: " + message);
		labYokeGlobal.finddepartments(function(error, departments) {
			var errormessagelabedit = null;
			var successmessagelabedit = null;
			if(status == "success"){
				successmessagelabedit = message;
			} else {
				errormessagelabedit = message;
			}
			console.log("departments: " + departments.length);
			res.render('departments', {admins:departments[5],labadmins: departments[4], section:"editlab", labs: departments[3], errormessagelabedit: errormessagelabedit, successmessagelabedit: successmessagelabedit, depts: departments[0], vennsettings: departments[2], users: departments[1], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
			req.session.messages = null;
		});
		});
    });

    router.post('/setadmin', isLoggedInSuperAdmin, function(req, res) {
		var labYokeGlobal = new LabYokeGlobal();
		var labYokeLab = new LabYokeLab(req.body.labname, req.body.dept, req.body.labnameadmin);
		console.log("lab is: " + req.body.labname);
		console.log("lab0 is: " + req.body.labnameedit);
		console.log("adminlabedit is: " + req.body.adminlabedit);
		labYokeLab.setadmin(function(error, results) {
			var status = results[0];
			var message = results[1];
			console.log("createlab status: " + status);
			console.log("createlab message: " + message);
		labYokeGlobal.finddepartments(function(error, departments) {
			var errormessagelabedit = null;
			var successmessagelabedit = null;
			if(status == "success"){
				successmessagelabedit = message;
			} else {
				errormessagelabedit = message;
			}
			console.log("departments: " + departments.length);
			res.render('departments', {admins:departments[5], labadmins: departments[4], section:"vennSettings", labs: departments[3], errormessageadmin: errormessagelabedit, successmessageadmin: successmessagelabedit, depts: departments[0], vennsettings: departments[2], users: departments[1], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
			req.session.messages = null;
		});
		});
    });

    router.post('/setvenn', isLoggedInSuperAdmin, function(req, res) {
		var labYokeGlobal = new LabYokeGlobal();
		var checked = req.body.addvenn;
		if(checked == undefined)
			checked = 0;
		else
			checked = 1;
		var labYokeLabVenn = new LabYokeLabVenn(req.body.labnamevenn, req.body.departmentvenn, checked);
		console.log("lab venn is: " + req.body.labnamevenn);
		console.log("check venn is: " + req.body.addvenn);
		console.log("dept venn is: " + req.body.departmentvenn);
		labYokeLabVenn.setvenn(function(error, results) {
			var status = results[0];
			var message = results[1];
			console.log("setvenn status: " + status);
			console.log("setvenn message: " + message);
		labYokeGlobal.finddepartments(function(error, departments) {
			var errormessagevenn = null;
			var successmessagevenn = null;
			if(status == "success"){
				successmessagevenn = message;
			} else {
				errormessagevenn = message;
			}
			console.log("departments: " + departments.length);
			res.render('departments', {admins:departments[5],labadmins: departments[4], section:"venn", labs: departments[3], vennsettings: departments[2], users: departments[1], errormessagevenn: errormessagevenn, successmessagevenn: successmessagevenn, depts: departments[0], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
			req.session.messages = null;
		});
		});
    });

    router.post('/setdisabled', isLoggedInSuperAdmin, function(req, res) {
		var labYokeGlobal = new LabYokeGlobal();
		var checked = req.body.disablelab;
		if(checked == undefined)
			checked = 0;
		else
			checked = 1;
		var labYokeLabVenn = new LabYokeLabVenn(req.body.labnamevenn, req.body.departmentvenn, checked);
		console.log("lab disable is: " + req.body.labnamevenn);
		console.log("check disable is: " + req.body.disablelab);
		console.log("dept disable is: " + req.body.departmentvenn);
		labYokeLabVenn.setdisable(function(error, results) {
			var status = results[0];
			var message = results[1];
			console.log("setdisable status: " + status);
			console.log("setdisable message: " + message);
		labYokeGlobal.finddepartments(function(error, departments) {
			var errormessagedisable = null;
			var successmessagedisable= null;
			if(status == "success"){
				successmessagedisable = message;
			} else {
				errormessagedisable = message;
			}
			console.log("departments: " + departments.length);
			res.render('departments', {admins:departments[5],labadmins: departments[4], section:"venn", labs: departments[3], vennsettings: departments[2], users: departments[1], errormessagedisable: errormessagedisable, successmessagedisable: successmessagedisable, depts: departments[0], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
			req.session.messages = null;
		});
		});
    });

	router.get('/', function(req, res) {
		res.redirect('/querytool');
	});

	router.get('/admin', function(req, res) {
		res.redirect('/querytool');
	});

	router.get('/createdepartment', function(req, res) {
		res.redirect('/departments');
	});

	router.get('/createlab', function(req, res) {
		res.redirect('/departments');
	});

	router.get('/editlab', function(req, res) {
		res.redirect('/departments');
	});

	router.get('/setvenn', function(req, res) {
		res.redirect('/departments');
	});

	router.get('/setadmin', function(req, res) {
		res.redirect('/departments');
	});

	router.get('/setdisabled', function(req, res) {
		res.redirect('/departments');
	});

	router.get('/transferusertolab', function(req, res) {
		res.redirect('/users');
	});

	router.get('/help', function(req, res) {
		res.render('help', {
			ordersnum: req.session.orders,
			sharesnum: req.session.shares,
			title : 'Help',
			loggedIn : req.session.loggedin,
			labyoker : req.session.user,
			isLoggedInAdmin: req.session.admin,
			menu : 'help',
			title: 'Help'
		});

	});

	router.get('/about', isLoggedIn, function(req, res) {
		res.render('about', {
			ordersnum: req.session.orders,
			sharesnum: req.session.shares,
			title : 'About Us',
			loggedIn : req.session.loggedin,
			labyoker : req.session.user,
			isLoggedInAdmin: req.session.admin,
			menu : 'about'
		});

	});

	router.get('/logout', function(req, res) {
		req.logout();
		req.session.user = null;
		req.session.loggedin = false;
		res.redirect('/login');
	});

	function isLoggedIn(req, res, next) {
		if (req.session.user)
			return next();
		console.log('requested url: '+req.originalUrl);
		req.session.to = req.originalUrl;
		res.redirect('/login');
	}
	function isLoggedInAdmin(req, res, next) {
		if (req.session.user && (req.session.useradmin || req.session.usersuperadmin))
			return next();
		console.log('requested url: '+req.originalUrl);
		req.session.to = req.originalUrl;
		res.redirect('/login');
	}

	function isLoggedInSuperAdmin(req, res, next) {
		if (req.session.user && req.session.usersuperadmin)
			return next();
		console.log('requested url: '+req.originalUrl);
		req.session.to = req.originalUrl;
		res.redirect('/login');
	}

	function isLoggedInAndNotActive(req, res, next) {
		if (req.session.active != null && req.session.active == 0)
			return next();
		res.redirect('/');
	}

	function isAdmin(req, res, next) {
		if (req.session.userid == 'algo' || req.session.userid == 'amjw'
				|| req.session.userid == 'mkon')
			return next();
		res.redirect('/');
	}

	router.get('/login', function(req, res) {
		console.log("login req.session.user: " + req.session.user);
		if (req.session.user) {
			res.redirect('/querytool');
		} else {
			var labyokerLabs = new LabyokerLabs('','');
			labyokerLabs.getlabs(function(error, labs) {
				req.session.labs = labs;
				console.log("loggin in labs: " + labs);
				res.render('login', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, title: 'Login',isLoggedInAdmin: req.session.admin});
				req.session.messages = null;
			});

		}
	});

	router.get('/querytool', isLoggedInSuperAdmin, function(req, res) {
		if (req.session.user) {
			var labYokeSearch = new LabYokeSearch("",req.session.email);
			labYokeSearch.findagents(function(error, results) {			
				if (results != null && results.length > 0){
					res.render('querytool', {mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, agentsResults : results, loggedIn : true, title: 'Query Tool'});
				} else {
					res.render('querytool', {mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Query Tool'});
				}
				req.session.messages = null;
			});
		} else {
			res.redirect('/login');
		}
	});



	router.get('/users', isLoggedInSuperAdmin, function(req, res) {
		if (req.session.user) {
			var labyokeGlobal = new LabYokeGlobal();
			labyokeGlobal.getUsers(function(error, results) {			
				if (results != null && results.length > 0){
					res.render('users', {labs:req.session.labs, mylab: req.session.lab,labyoker : req.session.user, isLoggedInAdmin: req.session.admin, users : results, loggedIn : true, title: 'Users'});
				} else {
					res.render('users', {labs:req.session.labs, mylab: req.session.lab,labyoker : req.session.user, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Users'});
				}
				req.session.messages = null;
			});
		} else {
			res.redirect('/login');
		}
	});

	
	router.post('/transferusertolab', isLoggedInSuperAdmin, function(req, res) {
		// TO DO
		if (req.session.user) {
			var id = req.body.id;
			var name = req.body.name;
			var surname = req.body.surname;
			var newlab = req.body.labnameedit;
			var oldlab = req.body.oldlab;
			var email = req.body.email;
			var usertransfer = id;
			if(name != null && name != "" && surname != null && surname != ""){
				usertransfer = name + " " + surname;
			}
			console.log("transferusertolab: " + newlab);
			console.log("id: " + id);
			var labyokeGlobal = new LabYokeGlobal();
			if(oldlab == newlab){
				labyokeGlobal.getUsers(function(error, results) {
					console.log("users transfer total: " + results);			
					if (results != null && results.length > 0){
						res.render('users', {labs:req.session.labs, transferuser:usertransfer, transfermess: "nochange", mylab: req.session.lab,labyoker : req.session.user, isLoggedInAdmin: req.session.admin, users : results, loggedIn : true, title: 'Users'});
					} else {
						res.render('users', {labs:req.session.labs, transferuser:usertransfer, transfermess: "nochange", mylab: req.session.lab,labyoker : req.session.user, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Users'});
					}
					req.session.messages = null;
				});
			} else {
				var labYokeusertransfer = new LabYokeUserTransfer(id, newlab, name, surname, email);
				labYokeusertransfer.transfer(function(error, resultstransfer) {
					var result = "fail";
					if(resultstransfer != null && resultstransfer.length > 0){
						result = resultstransfer;
					}
					labyokeGlobal.getUsers(function(error, results) {
						console.log("users transfer total: " + results);			
						if (results != null && results.length > 0){
							res.render('users', {labs:req.session.labs, transferuser:usertransfer, transfermess: result, erroruser: resultstransfer, mylab: req.session.lab,labyoker : req.session.user, isLoggedInAdmin: req.session.admin, users : results, loggedIn : true, title: 'Users'});
						} else {
							res.render('users', {labs:req.session.labs, transferuser:usertransfer, transfermess: result, erroruser: resultstransfer, mylab: req.session.lab,labyoker : req.session.user, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Users'});
						}
						req.session.messages = null;
					});		
				});
			}
		} else {
			res.redirect('/login');
		}
	});

	router.post('/isadmin', isLoggedInSuperAdmin, function(req, res) {
		if (req.session.user) {
			var id = req.body.id;
			var name = req.body.name;
			var surname = req.body.surname;
			var checked = req.body.isadmin;
			var email = req.body.email;
			console.log("req.body.isadmin: " + req.body.isadmin);
			if(checked != null)
				checked = 1;
			if(checked == undefined)
				checked = 0;
			console.log("id: " + id);
			console.log("name: " + name);
			console.log("surname: " + surname);
			console.log("checked: " + checked);
			console.log("email: " + email);
			var labYokeusers = new LabYokeUsers(id,name, surname, email,checked);
			labYokeusers.makeadminUser(function(error, resultsadmin) {
				if(resultsadmin != null && resultsadmin.length > 0){
					//res.redirect('/users');			
					var labyokeGlobal = new LabYokeGlobal();
					labyokeGlobal.getUsers(function(error, results) {			
						if (results != null && results.length > 0){
							res.render('users', {erroruser: resultsadmin, mylab: req.session.lab,labyoker : req.session.user, isLoggedInAdmin: req.session.admin, users : results, loggedIn : true, title: 'Users'});
						} else {
							res.render('users', {erroruser: resultsadmin, mylab: req.session.lab,labyoker : req.session.user, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Users'});
						}
						req.session.messages = null;
					});
				}
			});
		} else {
			res.redirect('/login');
		}
	});

	router.post('/disable', isLoggedInSuperAdmin, function(req, res) {
		if (req.session.user) {
			var id = req.body.id;
			var name = req.body.name;
			var surname = req.body.surname;
			var checked = req.body.cancel;
			var email = req.body.email;
			if(checked != null)
				checked = 0;
			if(checked == undefined)
				checked = 1;
			console.log("id: " + id);
			console.log("name: " + name);
			console.log("surname: " + surname);
			console.log("checked: " + checked);
			console.log("email: " + email);
			var labYokeusers = new LabYokeUsers(id,name, surname, email,checked);
			labYokeusers.disableUser(function(error, results) {
				if(results != null && results.length > 0){
					res.redirect('/users');			
					//res.render('departments', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Shares',loggedIn : true});
					req.session.messages = null;
				}
			});
		} else {
			res.redirect('/login');
		}
	});

	router.post('/users', isLoggedInSuperAdmin, function(req, res) {
		if (req.session.user) {
			var agent = req.body.agentform;
			var lab = req.body.labform;
			var vendor = req.body.vendorform;
			var catalognumber = req.body.catalogform;
			var email = req.body.emailform;
			var location = req.body.locationform;
			var reqemail = req.session.email;
			var reqcategory = req.body.categoryform;
			var quantity = req.body.qtyform;
			var labYokerorder = new LabYokerOrder(lab, agent, vendor, catalognumber,email,location,reqemail,reqcategory,quantity, req.session.lab);
			labYokerorder.order(function(error, results) {
				if(results != null && results=="successfulOrder"){
					console.log("ordering agentform: " + agent);
					console.log("ordering location: " + location);
					console.log("ordering reqcategory: " + reqcategory);
					console.log("booster",req.session.savingsText);
				
					res.render('users', {booster:req.session.savingsText, boostercolor:req.session.savingsColor, currentlabname:req.session.lab, categories: req.session.categories, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Users',loggedIn : true, location: location, agent: agent, vendor: vendor, catalog: catalognumber, email: email});
					req.session.messages = null;
				}
			});
		} else {
			res.redirect('/login');
		}
	});

	router.post('/cancelshare', isLoggedInSuperAdmin, function(req, res) {
		if (req.session.user) {
			var agent = req.body.agent;
			var lab = req.body.lab;
			var vendor = req.body.vendor;
			var catalognumber = req.body.catalognumber;
			var table = req.body.table;
			var email = req.body.email;
			var requestor = req.body.requestoremail;
			var checked = req.body.cancel;
			var date = moment(req.body.date).add(1, 'day').tz("America/New_York").format(
				'MM-DD-YYYY');
			var datenow = moment(new Date).tz("America/New_York").format(
				'MM-DD-YYYY');
			if(checked != null)
				checked = 0;
			if(checked == undefined)
				checked = 1;
			console.log("date: " + date);
			console.log("laab: " + lab);
			console.log("agent: " + agent);
			console.log("vendor: " + vendor);
			console.log("catalognumber: " + catalognumber);
			console.log("checked: " + checked);
			console.log("table: " + table);
			console.log("email: " + email);
			console.log("requestoremail: " + requestor);
			var labYokechange = new LabYokerChangeShare(table,agent, vendor, catalognumber,email,requestor,checked,datenow,date, lab);
			labYokechange.cancelShare(function(error, results) {
				if(results != null && results.length > 0){
					res.redirect('/departments');			
					//res.render('departments', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Shares',loggedIn : true});
					req.session.messages = null;
				}
			});
		} else {
			res.redirect('/login');
		}
	});


	router.get('/reports', isLoggedInAdmin, function(req, res) {
		var labyokerLab = new LabyokerLab(req.session.lab);
		labyokerLab.getLabsInDept(function(error, categories) {
			console.log("load labs in dept in reports : " + categories);
			req.session.categories = categories;
			if(req.session.labs == undefined){
				var labyokerLabs = new LabyokerLabs('','');
				labyokerLabs.getlabs(function(error, labs) {
						req.session.labs = labs;
						console.log("load labs in reports : " + labs);
						res.render('reports', {dept: req.session.dept, categories: categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Reports', isLoggedInAdmin: req.session.admin});
						req.session.messages = null;
				});
			} else {
				res.render('reports', {dept: req.session.dept, categories: categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Reports', isLoggedInAdmin: req.session.admin});
				req.session.messages = null;
			}
		});

	});

	router.post('/reportShares', isLoggedInAdmin, function(req, res) {
		var datefrom = req.body.reportDateFrom;
		var dateto = req.body.reportDateTo;
		var category = req.body.reportCategory;
		console.log("reportSomething " + req.body.reportDateFrom);
		var labYokereporter = new LabYokeReporterShares(datefrom, dateto, req.session.lab, req.session.labs);
		labYokereporter.reportShares(function(error, results) {
			if(results != null){
				console.log("res " + results);
				if(results != ""){
					res.render('reports', {section: "shares", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, datefromShares: datefrom, datetoShares: dateto, title:'Reports',loggedIn : true, resultsShares: results, isLoggedInAdmin: req.session.admin, addMessageShares: "success"});
				} else {
					res.render('reports', {section: "shares", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, datefromShares: datefrom, datetoShares: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageShares: "failure"});
				}
				req.session.messages = null;
			}
		});
	});

	router.post('/reportMoney', isLoggedInAdmin, function(req, res) {
		var datefrom = req.body.reportDateFromMoney;
		var dateto = req.body.reportDateToMoney;
		var agent = req.body.reportAgentMoney;
		var vendor = req.body.reportVendorMoney;
		var catalognumber = req.body.reportCatalogMoney;
		var lab = req.body.reportLabMoney;
		 

		console.log("reportMoney datefrom: " + datefrom);
		console.log("reportMoney dateto: " + dateto);
		console.log("reportMoney agent: " + agent);
		console.log("reportMoney vendor: " + vendor);
		console.log("reportMoney catalognumber: " + catalognumber);
		console.log("reportMoney lab: " + lab);

		var labYokereporterSavings = new LabYokeReporterSavings(datefrom,dateto,agent,vendor,catalognumber,lab, req.session.lab,req.session.labs);
		labYokereporterSavings.reportMoney(function(error, results) {
			if(results != null){
				console.log("res " + results);
				if(results!=undefined && results != ""){
					console.log("successful money report");
					res.render('reports', {dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, datefromMoney: datefrom, datetoMoney: dateto, title:'Reports',loggedIn : true, resultsMoney: results, isLoggedInAdmin: req.session.admin, addMessageMoney: "success", section: "money"});
				} else {
					console.log("failed money report");
					res.render('reports', {dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, datefromMoney: datefrom, datetoMoney: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageMoney: "failure", section: "money"});
				}
				req.session.messages = null;
			}
		});
	});

	router.post('/reportInsuff', isLoggedInAdmin, function(req, res) {
		var datefrom = undefined;
		var dateto = undefined;
		var agent = req.body.reportAgentInsuff;
		var vendor = req.body.reportVendorInsuff;
		var catalognumber = req.body.reportCatalogInsuff;
		var lab = req.body.reportLabInsuff;
		 

		console.log("reportInsuff datefrom: " + datefrom);
		console.log("reportInsuff dateto: " + dateto);
		console.log("reportInsuff agent: " + agent);
		console.log("reportInsuff vendor: " + vendor);
		console.log("reportInsuff catalognumber: " + catalognumber);
		console.log("reportInsuff lab: " + lab);

		var labYokereporterSavings = new LabYokeReporterSavings(datefrom,dateto,agent,vendor,catalognumber,lab, req.session.lab,req.session.labs);
		labYokereporterSavings.reportInsuff(function(error, results) {
			if(results != null){
				console.log("res " + results);
				if(results!=null && results != ""){
					res.render('reports', {section: "insuff", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, title:'Reports',loggedIn : true, resultsInsuff: results, isLoggedInAdmin: req.session.admin, addMessageInsuff: "success"});
				} else {
					res.render('reports', {section: "insuff", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageInsuff: "failure"});
				}
				req.session.messages = null;
			}
		});
	});

	router.post('/changeDetails', isLoggedIn, function(req, res) {
		var col = req.body.column;
		var val = req.body.valuedetail.replace("'","");
		var email = req.body.formemail;
		console.log("changeDetails col: " + col);
		console.log("changeDetails val: " + val);
		console.log("changeDetails email: " + email);
		var labYokedetails = new LabyokerUserDetails(col, val, email,req.session.user,req.session.surname);
		labYokedetails.changeDetails(function(error, results) {
			if(results){
				if(col == 'name'){
					req.session.user = val;
				}
				if(col == 'surname'){
					req.session.surname = val;
				}
				console.log("res changeDetails " + results);
				res.render('account', {labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, title:'Account',loggedIn : true, resultsAccount: results, isLoggedInAdmin: req.session.admin});
				req.session.messages = null;
			}
		});
	});

	router.post('/reportOrders', isLoggedInAdmin, function(req, res) {
		var datefrom = req.body.reportDateFromOrders;
		var dateto = req.body.reportDateToOrders;
		var lab = req.body.reportLabOrders;
		var category = req.body.reportCategoryOrders;
		console.log("reportOrders reportDateFromOrders: " + req.body.reportDateFromOrders);
		console.log("reportOrders lab: " + lab);
		console.log("reportOrders category: " + category);
		var labYokereporter = new LabYokeReporterOrders(datefrom, dateto, lab, req.session.labs, req.session.lab);
		labYokereporter.reportOrders(function(error, results) {
			if(results != null){
				console.log("res " + results);
				if(results != ""){
					res.render('reports', {section: "orders", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, datefromOrders: datefrom, datetoOrders: dateto, title:'Reports',loggedIn : true, resultsOrders: results, isLoggedInAdmin: req.session.admin, addMessageOrders: "success"});
				} else {
					res.render('reports', {section: "orders", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, datefromOrders: datefrom, datetoOrders: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageOrders: "failure"});
				}
				req.session.messages = null;
			}
		});
	});

	router.get('/play', function(req, res) {
		res.render('play', {ordersnum: req.session.orders, sharesnum: req.session.shares, title: 'Play',labyoker : req.session.user});
		req.session.messages = null;
	});

	router.get('/departments', isLoggedInSuperAdmin, function(req, res) {
		var labYokeGlobal = new LabYokeGlobal();
		var vennusers = [];
		labYokeGlobal.finddepartments(function(error, results) {
			var users = results[2].users;
			var i=0;
			console.log("Venn Settings: " + JSON.stringify(results[2]));
			var limit = 0;
			for(var prop0 in users){
				var user0 = users[prop0];
				console.log("user0 length: " + user0.length);
					limit += user0.length;
			}
			console.log("limit: " + limit);
			for(var prop0 in users){
				var user0 = users[prop0];
				console.log("Venn Settings users raw: " + prop0 + " - " + user0);
				console.log("Venn Settings user0 length: " + user0.length);
				//limit = limit + user0.length;
				for(var prop in user0){
					user0[prop].then(data=>{
					vennusers.push(data);
				
			        //console.log("data is: " + prop + " - " +  JSON.stringify(data));
			        
				    }).catch(e=>{
				        //handle error case here when your promise fails
				        console.log("error from promise: " +e)
				    }).then(() => {

				    	console.log("limit: " + limit);
				    	if(i == limit ){
			console.log("vennusers is: " +  JSON.stringify(vennusers));
			res.render('departments', {vennuser:vennusers, admins:results[5],labadmins: results[4], labs: results[3], vennsettings: results[2], users: results[1], section:"all", depts: results[0], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});

			    	}
			    	console.log("i is: " + i);
			    	i++;
				    });
				}
			}

/*
			Promise.all(users).then(function(dataArr){

 dataArr.forEach(function(data) {

Promise.all(data).then(function(data0){
	     		console.log("data raw is: " +  JSON.stringify(data0));
	     		vennusers.push(data0);
	 });
	     	    
    });

	 		}).then((result) => {
      	console.log('Always run this: ' + result);
	 			console.log("data vennusers is: " +  JSON.stringify(vennusers));
res.render('departments', {vennuser:vennusers, admins:results[5],labadmins: results[4], labs: results[3], vennsettings: results[2], users: results[1], section:"all", depts: results[0], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});

        });
*/
	 		//.catch((err) => console.log('Failed'))

			//res.render('departments', {admins:results[5],labadmins: results[4], labs: results[3], vennsettings: results[2], users: results[1], section:"all", depts: results[0], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
			req.session.messages = null;
		});
	});

	router.get('/account', isLoggedInSuperAdmin, function(req, res) {
		console.log("inside accounnt: " + req.session.email);
		console.log("account labs: " + req.session.labs);
		console.log("account lab: " + req.session.lab);
		var labyokerTeam = new LabyokerTeam(req.session.lab);
		labyokerTeam.getTeam(function(error, team) {
		if(req.session.labs == undefined){
			var labyokerLabs = new LabyokerLabs('','');
			labyokerLabs.getlabs(function(error, labs) {
				req.session.labs = labs;
				console.log("load labs in account : " + labs);
				var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs);
				labYokeAgents.getLabyoker(function(error, results) {
					res.render('account', {dept: req.session.dept, labname: req.session.lab, team:team, labs: req.session.labs, userDetails: results, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Account'});
					req.session.messages = null;
				});
			});
		} else {
			var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs);
			labYokeAgents.getLabyoker(function(error, results) {
				res.render('account', {dept: req.session.dept, labname: req.session.lab, team:team, labs: req.session.labs, userDetails: results, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Account'});
				req.session.messages = null;
			});
		}
		});
	});
	

	router.get('/forgot', function(req, res) {
		res.render('forgot', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Forgot Password'});
		req.session.messages = null;
	});

	router.post('/forgot', function(req, res) {
			var forgotuser = req.body.forgotuser;
			if (forgotuser != null && forgotuser.length > 0){
				var dateStripped = moment(new Date).tz("America/New_York").format(
				'MM-DD-YYYY');
				console.log("dateStripped2: " + dateStripped);
				var labyoker = new Labyoker(forgotuser,dateStripped);
				labyoker.requestChangePassword(function(error, done) {
					console.log("done: " + (done != null && done.length > 0 && done == 'alreadySent'));
					console.log("done2: " + (done != null && done == 'alreadySent'));
					if (done != null && done.length > 0 && done != 'alreadySent') {
						res.render('forgot', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, userfound : forgotuser});
					} else if(done != null && done.length > 0 && done == 'alreadySent') {
						res.render(
							'forgot',
							{
								ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Forgot Password', message : "Ah. We have already sent you an email today to change your password. Please check your inbox.", usernotfound : true, noforgotform: true
							});
					} else {
						res.render(
							'forgot',
							{
								ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Forgot Password', message : "Sorry. We could not find an account with this username. Please try again below.", usernotfound : true
							});
					}
				});
			} else {
				res.render(
					'forgot',
					{
						ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Forgot Password', message : "Sorry. You must enter your current <span class='labColor'>username</span>. Please try again below.", usernotfound : true
					});

			}
			//req.session.messages = null;
	});

	router.get('/register', function(req, res) {
			console.log("register labs: " + req.session.labs);
			if(req.session.labs == undefined){
				var labyokerLabs = new LabyokerLabs('','');
				labyokerLabs.getlabs(function(error, labs) {
					req.session.labs = labs;
					console.log("load labs in register : " + labs);
					res.render('register', {ordersnum: req.session.orders, labs: req.session.labs, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Register'});
					req.session.messages = null;
					req.body.reglab = null;
				});
			} else {
				res.render('register', {ordersnum: req.session.orders, labs: req.session.labs, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Register'});
				req.session.messages = null;
				req.body.reglab = null;
			}

	});

	router.get('/reportShares', function(req, res) {
		res.redirect('/reports');
	});

	router.get('/reportMoney', function(req, res) {
		res.redirect('/reports');
	});

	router.get('/reportInsuff', function(req, res) {
		res.redirect('/reports');
	});

	router.get('/reportOrders', function(req, res) {
		res.redirect('/reports');
	});

	router.get('/changeDetails', function(req, res) {
		res.redirect('/account');
	});

	router.get('/disable', function(req, res) {
		res.redirect('/users');
	});

	router.get('/isadmin', function(req, res) {
		res.redirect('/users');
	});

	router.get('/searchCatalog', function(req, res) {
		res.redirect('/querytool');
	});

	router.post('/register', function(req, res) {
		var rendered = false;
		var lab = req.body.reglab;
		var user = req.body.reguser;
		var user_pwd = req.body.regpass;

		var user_name = req.body.regfirstname;
		var user_surname = req.body.reglastname;
		var user_email = req.body.regemail;
		var user_tel = req.body.regtel;

		if(req.session.labs == undefined){
			res.redirect('/register');
		}
		/*const util = require('util');
		var labs = req.session.labs;
		for(var i in labs){
			var labrow = util.inspect(labs[i], false, null);
       		//var lab = labs[i].lab
       		console.log("i is: "+ i);
       		console.log("lab util: " + labrow);
       		console.log("labrow lab util: " + labrow.labname);
       		//console.log("lab is: "+ lab);
       	}*/

		if (user && user_name && user_pwd && lab && user_surname && user_email && user_tel) {
			console.log("second section processing...");
			console.log("user: " + user);
			console.log("user_pwd: " + user_pwd);
			console.log("lab: " + lab);
			console.log("user_name: " + user_name);
			console.log("user_surname: " + user_surname);
			console.log("user_email: " + user_email);
			console.log("user_tel: " + user_tel);
			var labyokerRegister = new LabyokerRegister(user,user_pwd,lab,user_name,user_surname,user_email,user_tel);
			/*var regfirstname = req.body.regfirstname;
			console.log("regfirstname entered " + regfirstname);
			if (regfirstname != null && regfirstname.length > 0){
				req.session.user = regfirstname;
				res.render('register', {regsuccess : regfirstname, loggedIn : true});
			} else {
				res.render('register', {});
			}*/
			labyokerRegister.register(function(error, done) {
				console.log("done: " + done);
				if(done != null && done.length > 0 && done == 'firstsection') {
					console.log("status = firstsection1");
					rendered = true;
					res.render(
						'register',
						{
							ordersnum: req.session.orders,
							sharesnum: req.session.shares,
							labentered : true,
							firstname: req.session.firstname,
							lastname: req.session.lastname,
							email: req.session.email,
							tel: req.session.tel,
							title: 'Register',
							isLoggedInAdmin: req.session.admin,
							labyoker : req.session.user,
							labs: req.session.labs
						});
				} else if (done != null && done.length > 0 && done != 'success') {
					console.log("status = status1");
					res.render('register', {labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Register', message : "Sorry. We could not register you. Please try again below."});
				} else if(done != null && done.length > 0 && done == 'success') {
					console.log("status = success1");
					rendered = true;
					console.log("successfully registered " + user_name);
					res.render(
						'register',
						{
							ordersnum: req.session.orders,
							sharesnum: req.session.shares, 
							regsuccess : user_name,
							labentered : false,
							title: 'Register',
							isLoggedInAdmin: req.session.admin,
							labyoker : req.session.user,
							labs: req.session.labs
						});
				} else {
					res.render(
						'register',
						{
							ordersnum: req.session.orders,
							sharesnum: req.session.shares,
							message : "Sorry you cannot proceed. Please fill out ALL fields and try again below.",
							title: 'Register',
							isLoggedInAdmin: req.session.admin,
							labyoker : req.session.user,
							labs: req.session.labs
						});
				}
			});
			rendered = true;
		} else if (user_name && user_surname && user_email && user_tel) {
				console.log("first section processing...");
				var labyokerRegister = new LabyokerRegister(null,null,null,user_name,user_surname,user_email,user_tel);;
				req.session.firstname = user_name;
				req.session.lastname = user_surname;
				req.session.email = user_email;
				req.session.tel = user_tel;
				labyokerRegister.register(function(error, done) {

					if(done != null && done.length > 0 && done == 'alreadyInUse') {
						console.log("status = alreadyInUse");
						rendered = true;
						res.render('register', {labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Register', message : "Sorry. This email address is already in use. Please use a different one and try again below."});
					} else if(done != null && done.length > 0 && done == 'firstsection') {
						console.log("status = firstsection");
						rendered = true;
						res.render(
							'register',
							{
								ordersnum: req.session.orders,
								sharesnum: req.session.shares, 
								labentered : true,
								firstname: req.session.firstname,
								lastname: req.session.lastname,
								email: req.session.email,
								tel: req.session.tel,
								title: 'Register',
								isLoggedInAdmin: req.session.admin,
								labyoker : req.session.user,
								labs: req.session.labs
							});
					} else if(done != null && done.length > 0 && done != 'success') {
						console.log("status = not successful");
						rendered = true;
						res.render('register', {labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Register', message : "Sorry. We could not register you. Please try again below."});
					} else if(done != null && done.length > 0 && done == 'success') {
						console.log("status = success");
						rendered = true;
						res.render(
							'register',
							{
								ordersnum: req.session.orders,
								sharesnum: req.session.shares, 
								regsuccess : user_name,
								labentered: false,
								title: 'Register',
								isLoggedInAdmin: req.session.admin,
								labyoker : req.session.user,
								labs: req.session.labs
							});
					} else {
						console.log("status = something else happened");
						rendered = true;
						res.render(
							'register',
							{
								ordersnum: req.session.orders,
								sharesnum: req.session.shares, 
								message : "Sorry you cannot proceed. Please fill out ALL fields and try again below.",
								title: 'Register',
								isLoggedInAdmin: req.session.admin,
								labyoker : req.session.user,
								labs: req.session.labs,
							});
					}
					if(!rendered){
						console.log("nothing entered");
						res.render('register', {labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, message : "Sorry. We could not register you. Please fill out all fields below.", title: 'Register'});
					}
				});
			} else {
				res.render(
				'register',
				{
					ordersnum: req.session.orders,
					sharesnum: req.session.shares, 
					message : "Sorry you cannot proceed. Please fill out ALL fields and try again below.",
					title: 'Register',
					isLoggedInAdmin: req.session.admin,
					labyoker : req.session.user,
					labs: req.session.labs
				});
			}
	});

	router.post('/querytool', isLoggedInSuperAdmin, function(req, res) {
		if (req.session.user) {
			var queryText = req.body.queryText;
			console.log("queryText tool: " + queryText);
			var labYokeSearch = new LabYokeSearch(queryText, req.session.email);
			var messageStr = "";
			labYokeSearch.query(function(error, results) {
				console.log("results " + results.length);
				console.log("results[1] " + results[1]);
				var err = "";
				var errStr = "";
				if(results != null && results[1] == "error"){
					console.log("error " + results[2]);
					err = results[1];
					errStr = results[2];
				}
				if (queryText != null && queryText.length > 0){
					if(results[1].length == 0 && results[0] == "select"){
						messageStr = "Sorry we could not find any results with your query request: <b>" + queryText + "</b>. Please try again.";
					}
					res.render('querytool', {rowCount:results[2], type:results[0], errorStr: errStr, error: err, mylab: req.session.lab, message: messageStr, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Query Tool', fullname: req.session.fullname, sendemail: req.session.email, searchResults : results[1], agentsResults : results[2], searchformText: queryText, loggedIn : true});
				} else {
					res.render('querytool', {rowCount:results[2], type:results[0], errorStr: errStr, error: err, message:'You entered an invalid DB statement. Please try again.',mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Query Tool', loggedIn : true, agentsResults : results[2]});
				}
				req.session.messages = null;
			});
		} else {
			res.redirect('/login');
		}
	});

	router.post('/searchCatalog', isLoggedInSuperAdmin, function(req, res) {
		if (req.session.user) {
			var searchText = req.body.searchTextCatalog;
			var labYokeSearch = new LabYokeSearch(searchText, req.session.email);
			var messageStr = "";
			labYokeSearch.query(function(error, results) {
				console.log("results " + results.length);
				var err = "";
				if(results != null && results.length > 1){
					console.log("error " + results[1]);
					err = results[1];
				}	
				if (searchText != null && searchText.length > 0){
					if(results[0].length == 0){
						messageStr = "Sorry we could not find any results with your catalog search request: <b>" + searchText + "</b>. Please try again.";
					}
					res.render('querytool', {error: err, mylab: req.session.lab, messageCatalog: messageStr, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Query Tool', fullname: req.session.fullname, sendemail: req.session.email, searchResults : results[0], agentsResults : results[1], searchformTextCatalog: searchText, loggedIn : true});
				} else {
					res.render('querytool', {error: err, messageCatalog:'You entered an invalid catalog keyword. Please try again.',mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Query Tool', loggedIn : true, agentsResults : results[1]});
				}
				req.session.messages = null;
			});
		} else {
			res.redirect('/login');
		}
	});

	router
			.post(
					'/login',
					function(req, res) {
						var username = req.body.user;
						var password = req.body.pass;
						if (username != null && username.length > 0
								&& password != null && password.length > 0) {
							var labyoker = new Labyoker(username, password);

							labyoker
									.login(function(error, results) {
										var done, shares, orders, dept;

										if(results != null && results.length > 0){
											done = results[0];
											dept = results[1];
										}
										
										/*if(results != null && results.length > 2){
											orders = results[2];
											req.session.orders = orders;
										}*/
										console.log("done is " + done);
										console.log("department is : " + dept);
										//console.log("done2 is " + done.length);
										console.log("shares is " + shares);
										console.log("orders is " + orders);

										if (done != null && done.length > 0) {
											if (done[0].active == 0) {

												return res
														.render(
															'login',
															{
																message : "You have not completed your registration. Please check your emails and click on the link.", title: 'Login'
															});
											}
										if (done[0].disable == 0) {

												return res
														.render(
															'login',
															{
																message : "Your account has been disabled. Please contact your lab administrator.", title: 'Login'
															});
											}

											var init = new LabyokerInit(done[0].email, done[0].lab);
											init.initialShares(function(error, resultsShares) {
												console.log("inside init shares " + resultsShares);
												if(resultsShares != null){
													console.log("initshares is " + resultsShares);
													shares = resultsShares;
													req.session.shares = shares;
												}
												init.initialOrders(function(error, resultsOrders) {
													console.log("inside init orders " + resultsOrders);
													if(resultsOrders != null){
														console.log("initorders is " + resultsOrders);
														orders = resultsOrders;
														req.session.orders = orders;
													}
													req.session.user = done[0].name;
													req.session.dept = dept[0].department;
													req.session.userid = done[0].id;
													req.session.useradmin = false;
													console.log("admin? " + done[0].admin);
													var c = parseInt(done[0].admin,10);
													req.session.admin = c;
													if(req.session.admin > 0)
														req.session.useradmin = true;
													if(req.session.admin > 1)
														req.session.usersuperadmin = true;
													console.log("req.session.usersuperadmin: " + req.session.usersuperadmin);
													console.log("req.session.admin: " + req.session.admin);
													req.session.active = done[0].active;
													req.session.email = done[0].email;
													req.session.lab = done[0].lab;
													req.session.fullname = done[0].name;
													req.session.surname = done[0].surname;
													console.log("fullname " + req.session.fullname);
													console.log("email " + req.session.email);
													req.session.loggedin = true;

													console.log("initial req.session.lab: " + req.session.lab);
													var timeframesavings = "year";
													var choosetime = "";
													var timearr = ["year","month","all"];
													var labarr = ["all",req.session.lab];
													var datefromsavings = "";
													var datetosavings = "";
													var lab = "";
													var labsavings = "";

													var t = Math.floor((Math.random() * timearr.length-1) + 1);
													var l = Math.floor((Math.random() * labarr.length-1) + 1);
													console.log("random int time: " + t);
													console.log("random int lab: " + l);

													lab = labarr[l];
													choosetime = timearr[t];
													console.log("lab: " + lab);
													console.log("choosetime: " + choosetime);

													if(lab == "all"){
														labsavings = "<b><i>WORLD</i></b>";
													} else {
														labsavings = "<b><i>Other Labs</i></b>";
													}
													if(choosetime == "year"){
														var date = new Date(), y = date.getFullYear(), m = date.getMonth();
														datefromsavings = moment(new Date(y, 0, 1)).tz("America/New_York").format('MM-DD-YYYY');
														datetosavings = moment(new Date(y, 12, 1)).tz("America/New_York").format('MM-DD-YYYY');
														/*datefromsavings = "01-01-2016";
														datetosavings = "12-31-2016";*/
													}
													if(choosetime == "month"){
														var date = new Date(), y = date.getFullYear(), m = date.getMonth();
														datefromsavings = moment(new Date(y, m, 1)).tz("America/New_York").format('MM-DD-YYYY');
														datetosavings = moment(new Date(y, m + 1, 0)).tz("America/New_York").format('MM-DD-YYYY');
														/*datefromsavings = "12-01-2016";
														datetosavings = "12-31-2016";*/
													}
													timeframesavings = "this past <b>" + choosetime + "</b>";
													if(choosetime == "all"){
														datefromsavings = undefined;
														datetosavings = undefined;
														timeframesavings = "over time";
													}
													
													console.log("timeframesavings datefromsavings: " + datefromsavings);
													console.log("timeframesavings datetosavings: " + datetosavings);
													console.log("timeframesavings: " + timeframesavings);
													var booster = [];
													var boostercolor = [];
													if(orders > 0){
														booster.push("<strong> Notification!</strong> You have <b>" + orders + " new order(s)</b> pending completion.");
														boostercolor.push("warning");
													}
													if(shares > 0){
														booster.push("<strong> Notification!</strong> You have <b>" + shares + " new share(s)</b> pending completion. <a href='/departments'>Check it out</a> promptly and fulfill the request. Way to contribute to your lab's savings!");
														boostercolor.push("warning");
													}

													var labYokereporterSavings = new LabYokeReporterSavings(datefromsavings,datetosavings,undefined,undefined,undefined,lab, req.session.lab,req.session.labs);
													labYokereporterSavings.dataMoney(function(error, savings) {
														console.log("savings: " + savings);

														req.session.savings = savings;
														var cheer = "Keep searching, ordering, and sharing!";
														if (savings > 10000){
															cheer = "Amazing! You are a rock star!";
														} else if (savings > 1000){
															cheer = "Incredible!";
														} else if(savings > 100){
															cheer = "Keep it up!";
														} 
														if(savings > 0){
														var text = "";
														console.log("non-null savings: " + accounting.formatMoney(savings));
														if(lab == "all"){
															text = "<strong> Major Achievement!</strong> You are part of a " + labsavings + " savings for a total of <b>" + accounting.formatMoney(savings) + "</b> " + timeframesavings + " in your department. " + cheer;
														} else {
															text = "<strong> Major Achievement!</strong> You have saved " + labsavings + " a total of <b>" + accounting.formatMoney(savings) + "</b> " + timeframesavings + ". " + cheer;
														}
														booster.push(text);
														boostercolor.push("success");
														}

														var b = Math.floor((Math.random() * booster.length-1) + 1);
														if(booster[b] == undefined){
															booster[b] = "Using LabyYoke reduces purchasing prices for <strong>You</strong> and your <strong>Lab</strong>. Use it as a social platform. Have fun and Keep it Up!";
															boostercolor[b] = "success"
														}
														req.session.savingsTextInitial = booster[b];
														req.session.savingsColorInitial = boostercolor[b];
														console.log("req.session.savingsText: " + req.session.savingsTextInitial);
													

													if(req.session.to != null && req.session.to.length > 0){
														res.redirect(req.session.to);
														req.session.to = null;
													} else {
														res.redirect('/querytool');
													}
													});
												});
											});
										} else {
											res
													.render(
															'login',
															{
																message : "Your username and/or password is wrong. Please try again.", title: 'Login'
															});
										}
									});
						} else {
							res
									.render(
											'login',
											{
												message : "Your username and/or password is wrong. Please try again.", title: 'Login'
											});
						}

					});

	router.get('/confirmreg', function(req, res) {
		res.redirect('/register');
	}); 

	router.get('/confirmreg/:id', function(req, res) {

		var id = req.params.id;
		console.log("confirm register id is: " + id);

		if (id != null && id.length > 0){
			var confirmReg = new LabyokerConfirm(id);
			confirmReg.confirm(function(error, results) {
			
			console.log("LabyokerConfirm results: " + results);
			
			if (results != null && results.length > 0 && results == 'confirmReset') {
					res.render('register', {
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Confirm Registration',
						/*loggedIn : true,*/
						displayForm: true,
						hashid: id,
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
						messageSuccess : "Congratulations you have successfully registered. You can now start searching to the <a href='/querytool'>search</a> page.",
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'errorFound') {
					res.render('register', {
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Confirm Registration',
						/*loggedIn : true,*/
						displayForm: true,
						hashid: id,
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
						message : "An error was found while processing your confirmation. Please try again or <a href='mailto:labyoke@gmail.com?Subject="
																		+ "Change Password - " + id + "' target='_top'>Contact us</a>.",
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'cannotFindRequest') {
				res.render('register', {
					ordersnum: req.session.orders,
					sharesnum: req.session.shares,
					title : 'Confirm Registration',
					/*loggedIn : true,*/
					displayForm: true,
					hashid: id,
					isLoggedInAdmin: req.session.admin,
					labyoker : req.session.user,
					message : "Sorry we could not find your Pre-Registration. Please Register.",
					scripts : [ '/javascripts/utils.js' ]
				});
			} else {
					res.render('register', {
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Confirm Registration',
						/*loggedIn : true,*/
						displayForm: true,
						hashid: id,
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
						message : "An error was found while processing your registration. Please try again or <a href='mailto:labyoke@gmail.com?Subject="
																		+ "Change Password - " + id + "' target='_top'>Contact us</a>.",
						scripts : [ '/javascripts/utils.js' ]
					});
			}
			});
	}
});

	router.get('/changepassword/:id', /*isLoggedInAndNotActive,*/ function(req, res) {
		res.render('changepassword', {
			ordersnum: req.session.orders,
			sharesnum: req.session.shares,
			title : 'Change Password',
			/*loggedIn : true,*/
			displayForm: true,
			hashid: req.params.id,
			isLoggedInAdmin: req.session.admin,
			labyoker : req.session.user,
			scripts : [ '/javascripts/utils.js' ]
		});
	});

	router.get('/changepassword', /*isLoggedInAndNotActive,*/ function(req, res) {
		res.redirect('/forgot');
	});

	router.post('/changepassword', /*isLoggedIn,*/ function(req, res) {
		/*labyoker.changepassword(function(error, done) {
			if (done != null) {
				res.redirect('/');
			}
		});*/
		var id = req.body.hashid;
		console.log("changing password id is: " + id);
		console.log("changing password pwd is: " + req.body.pass);
		var dateStripped = moment(new Date).tz("America/New_York").format(
				'MM-DD-YYYY'); // '2014-06-09'

		if (id != null && id.length > 0){
			var pwdChange = new LabyokerPasswordChange(id, req.body.pass);
			pwdChange.checkIfChangePassword(function(error, results) {
			
			console.log("LabyokerPasswordChange results: " + results);
			
			if (results != null && results.length > 0 && results == 'passwordReset') {
					res.render('changepassword', {
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Change Password',
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
						/*loggedIn : true,*/
						messageSuccess : "Congratulations you have successfully changed your Password. Please head to the <a href='/login'>login</a> page.", 
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'errorFound') {
					res.render('changepassword', {
						ordersnum: req.session.orders,
						sharesnum: req.session.shares, 
						title : 'Change Password',
						/*loggedIn : true,*/
						displayForm: true,
						labyoker : req.session.user,
						isLoggedInAdmin: req.session.admin,
						message : "An error was found while processing your change password. Please try again or <a href='mailto:labyoke@gmail.com?Subject="
																		+ "Change Password - " + id + "' target='_top'>Contact us</a>.", 
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'dateExpired') {
						res.render('forgot', {
						ordersnum: req.session.orders,
						sharesnum: req.session.shares, 
						title : 'Change Password',
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
						/*loggedIn : true,*/
						message : "Unfortunately your Change Password request has expired. Please make a new request.", 
						displayForm: true,
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'cannotFindRequest') {
					res.render('forgot', {
						ordersnum: req.session.orders,
						sharesnum: req.session.shares, 
						title : 'Change Password',
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
						/*loggedIn : true,*/
						displayForm: true,
						message : "Sorry we could not find your Change Password request. Please make a new request.", 
						scripts : [ '/javascripts/utils.js' ]
					});
			} else {
					res.render('changepassword', {
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Change Password',
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
						/*loggedIn : true,*/
						displayForm: true,
						message : "An error was found while processing your change password. Please try again or <a href='mailto:labyoke@gmail.com?Subject="
																		+ "Change Password - " + id + "' taarget='_top'>Contact us</a>.", 
						scripts : [ '/javascripts/utils.js' ]
					});
			}
			});
		} else {
			console.log("redirecting to forgot page");
			res.redirect('/forgot');
		}

	});



};
