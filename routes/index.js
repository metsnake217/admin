var labyokeFinderClass = require('./labyokerfinder');
var accounting = require('./accounting');
var dates = require('../config/staticvariables');


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

    router.post('/share', isLoggedIn, function(req, res) {
        var exceltojson;
        upload(req,res,function(err){
        	var cont = 1;
            if(err){
                 //res.json({error_code:1,err_desc:err});
                 res.render('share', {
                   nosuccess: "generic", myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', labyoker : req.session.user
                 });
                 cont = 0;
                 console.log("generic error: "+cont);
                 //return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                //res.json({error_code:1,err_desc:"No file passed"});
                
                res.render('share', {
                   nosuccess: "nofile", myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', labyoker : req.session.user
                });
                cont = 0;
                console.log("no file error: " + cont);
                //return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(cont == 1){
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        //return res.json({error_code:1,err_desc:err, data: null});

                        res.render('share', {
                    	nosuccess: "nodata", myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', spreadname: req.file.originalname, labyoker : req.session.user
                    	});
                    	cont = 0;
                    	console.log("no data error : " + cont);
                    }
                    if(cont == 1){
                    //var ob = { data:result};
                    console.log("inside upload ");
                    var labYokeUploader = new LabYokeUploader(result);
                    		/*var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept);
		labYokeAgents.findmyshares(function(error, results) {
			//req.session.orders = results[2];
			req.session.shares = 0;
			console.log("test ? " + results[3]);
*/
                    labYokeUploader.upload(function(error, done) {
                    	//console.log("is upload json: " + json);
                    	console.log("is upload done?: " + done);
                    if(done == "successfulUpload"){
                    	console.log("inside successful upload");
                    	console.log("mysharesrequest " + req.session.mysharesrequest);
                    	res.render('share', {
                    	myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, json: result, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', spreadname: req.file.originalname, labyoker : req.session.user
                    });
                	} else {
                		console.log("inside not successful upload");
                		res.render('share', {nosuccess: "databaserror", report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Share'});
						req.session.messages = null;
                	}
                });
}

		//});

                    //res.json({error_code:0,err_desc:null, data: result});
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corrupted excel file"});
            }
        }
        })
    });


	router.get('/', function(req, res) {
		res.redirect('/search');
	});

	router.get('/admin', function(req, res) {
		res.redirect('/share');
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
		if (req.session.user && req.session.useradmin)
			return next();
		console.log('requested url: '+req.originalUrl);
		req.session.to = req.originalUrl;
		res.redirect('/search');
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
		if (req.session.user) {
			res.redirect('/search');
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

	router.get('/search', isLoggedIn, function(req, res) {
		if (req.session.user) {
			var labYokeSearch = new LabYokeSearch("",req.session.email);
			labYokeSearch.findagents(function(error, results) {			
				if (results != null && results.length > 0){
					res.render('search', {mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, agentsResults : results, loggedIn : true, title: 'Search'});
				} else {
					res.render('search', {mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Search'});
				}
				req.session.messages = null;
			});
		} else {
			res.redirect('/login');
		}
	});



	router.get('/orders', isLoggedIn, function(req, res) {
		if (req.session.user) {
			var labyokerLab = new LabyokerLab(req.session.lab);
		labyokerLab.getLabsInDept(function(error, categories) {
			console.log("load categories in reports : " + categories);
			req.session.categories = categories;
			var labYokerGetOrder = new LabYokerGetOrder(req.session.email, req.session.lab,req.session.labs);
			labYokerGetOrder.getorders(function(error, results) {
				labYokerGetOrder.getLabOrders_2(function(error, results2) {
				if(results != null){
					//req.session.shares = results[2];
					//req.session.orders = 0;
					console.log("orders results: " + results[0]);
					console.log("lab orders results0: " + results2);
					console.log("booster",req.session.savingsText);

					var booster = [];
					var boostercolor = [];
					booster.push(req.session.savingsTextInitial);
					boostercolor.push(req.session.savingsColorInitial);
					var totalorders = 0;
					var totalshares = 0;
					if(results != null && results.length > 0){
						totalorders = results[0].length;
					}
					if(results != null && results.length > 1){
						
						/*totalshares = results[5].filter(function checkOrder(op) {
	console.log("op agent is: " + op.agent);
	console.log("op email is: " + op.email);
	console.log("myemail: " + req.session.email);
    return op.email == req.session.email;
});*/
var t = results[5];
totalshares = t[0].counting;

						console.log("totalshares in booster: " + totalshares);
						//totalshares = totalshares.length;
						console.log("totalshares in booster length: " + totalshares);
					}

					var labs = req.session.labs;
					var labadmin;
					var nonadmin = " Email your <a href='mailto:"+labadmin+"'>administrator</a> if needed.";
					console.log("booster labs "+ labs);
					for(var i in labs){
						//var labrow = util.inspect(labs[i], false, null);
						console.log("booster labi "+ labs[i]);
						console.log("booster curent lab is: "+ req.session.lab);
						console.log("booster labiname "+ labs[i].labname);
			       		//var lab = labs[i].lab
			       		if(labs[i].labname == req.session.lab){
			       		labadmin = labs[i].admin;
			       		}
			       		//console.log("lab is: "+ lab);
			       	}
			       	if(req.session.admin == 1){
			       	nonadmin = " You can do so with the <a href='/share#upload'>upload tool</a> to add more reagents under your name."
			       	}
					booster.push("<strong> Self Kudos!</strong> You have ordered a total of <b>" + totalorders + " order(s)</b> and received a total of <b>" + totalshares + " requested share(s)</b>. Keep it up!");
					boostercolor.push("success");
					if(totalorders > totalshares){
						booster.push("<strong> Caution.</strong> You are ordering <b>more</b> than you are sharing. Did you replenish your inventory?" + nonadmin);
						boostercolor.push("warning");
					} else if(totalshares > totalorders){
						booster.push("<strong> Major Achievement!</strong>  You are sharing <b>more</b> than you are ordering. Way to contribute to your lab's savings!");
						boostercolor.push("success");
					} else if(totalshares == totalorders){
						booster.push("<strong> Strong and Steady!</strong> You are perfectly <b>balanced</b>! You are sharing as many reagents as you are ordering. Way to go!");
						boostercolor.push("success");
					}
					var b = Math.floor((Math.random() * booster.length-1) + 1);
					console.log("orders - b radomized: " + b);
					console.log("orders - b length radomized: " + booster.length);
					req.session.savingsText = booster[b];
					req.session.savingsColor = boostercolor[b];
					//console.log("lab orders results1: " + results2[1]);				
					//res.render('orders', {test: results[3], laborders: results2[0],lab1orders: results2[1], ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Orders', loggedIn : true, orderresults: results[0], report_sharesbycategory: results[1]});
					res.render('orders', {booster:req.session.savingsText, boostercolor:req.session.savingsColor,currentlabname:req.session.lab, categories: req.session.categories, test: results[3], laborders: results2, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Orders', loggedIn : true, orderresults: results[0], report_sharesbycategory: results[1], report_ordersbycategory: results[4]});
				}
			});
				});
				});
		} else {
			res.redirect('/login');
		}
	});

	router.post('/orders', isLoggedIn, function(req, res) {
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
				
					res.render('orders', {booster:req.session.savingsText, boostercolor:req.session.savingsColor, currentlabname:req.session.lab, categories: req.session.categories, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Orders',loggedIn : true, location: location, agent: agent, vendor: vendor, catalog: catalognumber, email: email});
					req.session.messages = null;
				}
			});
		} else {
			res.redirect('/login');
		}
	});

	router.post('/cancelshare', isLoggedIn, function(req, res) {
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
					res.redirect('/share');			
					//res.render('share', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Shares',loggedIn : true});
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

	router.get('/share', isLoggedIn, function(req, res) {
		var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept);
		labYokeAgents.findmyshares(function(error, results) {
			//req.session.orders = results[2];
			req.session.myshares = results[0];
			req.session.report_sharesbycategory = results[1];
			req.session.mysharesrequest = results[3];
			req.session.test = results[4];
			req.session.report_venn = results[5];
			req.session.shares = 0;
			console.log("test ? " + results[3]);
			res.render('share', {report_venn: results[5], test: results[4], currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, myshares: results[0], mysharesrequest: results[3], report_sharesbycategory: results[1], loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Share'});
			req.session.messages = null;
		});
	});

	router.get('/account', isLoggedIn, function(req, res) {
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

	router.get('/cancelshare', function(req, res) {
		res.redirect('/share');
	});

	router.get('/searchCatalog', function(req, res) {
		res.redirect('/search');
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

	router.post('/search', function(req, res) {
		if (req.session.user) {
			var searchText = req.body.searchText;
			var labYokeSearch = new LabYokeSearch(searchText, req.session.email);
			var messageStr = "";
			labYokeSearch.search(function(error, results) {
				console.log("results " + results[0].length);	
				if (searchText != null && searchText.length > 0){
					if(results[0].length == 0){
						messageStr = "Sorry we could not find any results with your reagent search request: <b>" + searchText + "</b>. Please try again.";
					}
					res.render('search', {mylab: req.session.lab, message: messageStr, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Search', fullname: req.session.fullname, sendemail: req.session.email, searchResults : results[0], agentsResults : results[1], searchformText: searchText, loggedIn : true});
				} else {
					res.render('search', {message:'You entered an invalid reagent keyword. Please try again.',mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Search', loggedIn : true, agentsResults : results[1]});
				}
				req.session.messages = null;
			});
		} else {
			res.redirect('/login');
		}
	});

	router.post('/searchCatalog', function(req, res) {
		if (req.session.user) {
			var searchText = req.body.searchTextCatalog;
			var labYokeSearch = new LabYokeSearch(searchText, req.session.email);
			var messageStr = "";
			labYokeSearch.search(function(error, results) {
				console.log("results " + results[0].length);	
				if (searchText != null && searchText.length > 0){
					if(results[0].length == 0){
						messageStr = "Sorry we could not find any results with your catalog search request: <b>" + searchText + "</b>. Please try again.";
					}
					res.render('search', {mylab: req.session.lab, messageCatalog: messageStr, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Search', fullname: req.session.fullname, sendemail: req.session.email, searchResults : results[0], agentsResults : results[1], searchformTextCatalog: searchText, loggedIn : true});
				} else {
					res.render('search', {messageCatalog:'You entered an invalid catalog keyword. Please try again.',mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Search', loggedIn : true, agentsResults : results[1]});
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
													req.session.admin = done[0].admin;
													if(req.session.admin > 0)
														req.session.useradmin = true;
													if(req.session.admin > 1)
														req.session.usersuperadmin = true;
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
														booster.push("<strong> Notification!</strong> You have <b>" + shares + " new share(s)</b> pending completion. <a href='/share'>Check it out</a> promptly and fulfill the request. Way to contribute to your lab's savings!");
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
														res.redirect('/search');
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
						messageSuccess : "Congratulations you have successfully registered. You can now start searching to the <a href='/search'>search</a> page.",
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
																		+ "Change Password - " + id + "' target='_top'>Contact us</a>.", 
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
