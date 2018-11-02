// RiveScript-JS
//
// Node.JS Web Server for RiveScript
//
// Run this and then communicate with the bot using `curl` or your favorite
// REST client. Example:
//
// curl -i \
//    -H "Content-Type: application/json" \
//    -X POST -d '{"username":"soandso","message":"hello bot"}' \
//    http://localhost:2001/reply

var express = require("express"),
	bodyParser = require("body-parser"),
	RiveScript = require("./lib/rivescript.js");
var db = require('diskdb');
var fs = require('fs');

const PORT = process.env.PORT || 5000;

db = db.connect('./db', ['data','log']);

// Create the bot.
var bot = new RiveScript({debug: false});
var botForm = new RiveScript({debug: true});
var core = require('./core');
var request = require('request');
//var fs = require('fs');


bot.loadDirectory("./Sofia_Brain", success_handler, error_handler);



function success_handler (loadcount) {
	console.log("Load #" + loadcount + " completed!");

	bot.sortReplies();
	botForm.loadDirectory("./Sofia_Form", success_handlerForm, error_handler);

	
}

function success_handlerForm (loadcount) {
	botForm.sortReplies();




	var app = express();

	// Parse application/json inputs.
	app.use(bodyParser.json());
	app.set("json spaces", 4);
	app.use('/', express.static('public'));
	// Set up routes.
	app.post("/reply", getReply);
	app.get("/", showUsage);
	app.get("*", showUsage);

	// Start listening.
	app.listen(PORT, function() {
		console.log("Listening on http://localhost:2002");
	});

	/*var https = require('https');
https.createServer({
        key: fs.readFileSync('server-key.pem'),
        cert: fs.readFileSync('server-cert.pem')
    }, app).listen(2002);*/
}





function error_handler (loadcount, err) {
	console.log("Error loading batch #" + loadcount + ": " + err + "\n");
}

// POST to /reply to get a RiveScript reply.
function getReply(req, res) {
	// Get data from the JSON post.
	var username = req.body.username;
	var message  = req.body.message;
	var vars     = req.body.vars;
	

	// Make sure username and message are included.
	if (typeof(username) === "undefined" || typeof(message) === "undefined") {
		return error(res, "username and message are required keys");
	}

	// Copy any user vars from the post into RiveScript.
	if (typeof(vars) !== "undefined") {
		for (var key in vars) {
			if (vars.hasOwnProperty(key)) {
				bot.setUservar(username, key, vars[key]);
			}
		}
	}
	// Get a reply from the bot.
	var aux = accents(message)




	if(req.body.vars.begin){

		botForm.setUservar(username,"vars",vars)
		//var reply = bot.replyAsync(username, aux, this);

		botForm.replyAsync(username, message, this).then(function(result) {
			
			var vars = botForm.getUservars(username,"vars");
			var completed=false;
			var msg=''
			var voice=''
			var formulario={}
			var begin=false;

			var log = {
				person:username,
				msgin:message,
				msgout:result,
				date: new Date()
			};



			db.log.save(log);


			try{
				result	   = JSON.parse(result)
				completed  = result.completed
				msg        = result.reply
				voice      = result.voice
			    formulario = result.formulario
			    begin      = result.begin
			}catch(e){
				completed  = vars.completed
				msg        = result
				voice        = result
				formulario = vars.formulario
				begin      = result.begin
			}
			
			// Get all the user's vars back out of the bot to include in the response.
			

			// Send the JSON response.
			res.json({
				reply:msg,
				voice,
				completed,
				formulario,
				begin
			});
		});
	}
	else{
		bot.setUservar(username,"vars",vars)
		//var reply = bot.replyAsync(username, aux, this);

		bot.replyAsync(username, message, this).then(function(result) {
			
			var vars = bot.getUservars(username,"vars");
			var completed=false;
			var msg=''
			var voice=''
			var formulario={}
			var begin=false;

			var log = {
				person:username,
				msgin:message,
				msgout:result,
				date: new Date()
			};



			db.log.save(log);


			try{
				result	   = JSON.parse(result)
				completed  = result.completed
				msg        = result.reply
				voice        = result.voice
			    formulario = result.formulario
			    begin      = result.begin
			}catch(e){
				completed  = vars.completed
				msg        = result
				voice        = result
				formulario = vars.formulario
				begin      = result.begin
			}
			
			// Get all the user's vars back out of the bot to include in the response.
			
			if(begin==undefined || begin==null)
				begin=false
			// Send the JSON response.
			res.json({
				reply:msg,
				voice,
				completed,
				formulario,
				begin
			});
		});
	}
}

// All other routes shows the usage to test the /reply route.
function showUsage(req, res) {
	var egPayload = {
		"username": "soandso",
		"message": "Hello bot",
		"vars": {
			"name": "Soandso"
		}
	};
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.write("Usage: curl -i \\\n");
	res.write("   -H \"Content-Type: application/json\" \\\n");
	res.write("   -X POST -d '" + JSON.stringify(egPayload) + "' \\\n");
	res.write("   http://localhost:2001/reply");
	res.end();
}

// Send a JSON error to the browser.
function error(res, message) {
	res.json({
		"status": "error",
		"message": message
	});
}


function accents(text) {
    var dict = {"ü":"u","á":"a", "é":"e", "í":"i", "ó":"o", "ú":"u","Á":"a","É":"e","Í":"i","Ó":"o","Ú":"u", "?":" ", "¿":" ", ".":" ", ",":" ", ";":" " , ":":" "  , "\\":" ", "\"":" "  ,"$":"" }

    text = text.replace(/[^\w ]/g, function(char) {
        var val = dict[char] || char;
        return val;
    });
    return text;
}











//------------------------------------------SUBROUTINES--------------------------------------------------
//(userId,param,value)

botForm.setSubroutine("setName", function(rs, args) {
	var response=core.saveData(rs.getUservar(rs.currentUser(),"vars"),'nombre',args[0])
	return JSON.stringify(response)
  
});

botForm.setSubroutine("setCodarea", function(rs, args) {
	var response=core.saveData(rs.getUservar(rs.currentUser(),"vars"),'codarea',args[0])
	return JSON.stringify(response)
  
});

botForm.setSubroutine("setEmail", function(rs, args) {
	var response=core.saveData(rs.getUservar(rs.currentUser(),"vars"),'email',args[0])
	return JSON.stringify(response)
  
});

botForm.setSubroutine("setDNI", function(rs, args) {
	var response=core.saveData(rs.getUservar(rs.currentUser(),"vars"),'dni',args[0])
	return JSON.stringify(response)
  
});

botForm.setSubroutine("setPhone", function(rs, args) {
	var response=core.saveData(rs.getUservar(rs.currentUser(),"vars"),'telefono',args[0])
	return JSON.stringify(response)
  
});

botForm.setSubroutine("setAmmount", function(rs, args) {
	var response=core.saveData(rs.getUservar(rs.currentUser(),"vars"),'monto',args[0])
	return JSON.stringify(response)
  
});

botForm.setSubroutine("setDestiny", function(rs, args) {
	var response=core.saveData(rs.getUservar(rs.currentUser(),"vars"),'destino',args[0])
	return JSON.stringify(response)
  
});

botForm.setSubroutine("setProvince", function(rs, args) {
	var response=core.saveData(rs.getUservar(rs.currentUser(),"vars"),'provincia',args[0])
	return JSON.stringify(response)
  
});

botForm.setSubroutine("setLocation", function(rs, args) {
	var response=core.saveData(rs.getUservar(rs.currentUser(),"vars"),'localidad',args[0])
	return JSON.stringify(response)
  
});


botForm.setSubroutine("analizeNumber", function(rs, args) {
	var response=core.analizeNumber(rs.getUservar(rs.currentUser(),"vars"),args[0])
	return JSON.stringify(response)
  
});

botForm.setSubroutine("analizeText", function(rs, args) {
    var response=core.analizeText(rs.getUservar(rs.currentUser(),"vars"),args[0])
	return JSON.stringify(response)
  
});







bot.setSubroutine("initForm", function(rs, args) {
	var response=core.initForm(rs.getUservar(rs.currentUser(),"vars"))
	return JSON.stringify(response)
  
});





/*

bot.setSubroutine("setAmmount", function(rs, args) {
	return core.saveData(rs.currentUser(),'Ammount',args[0])
  
});

bot.setSubroutine("setMotive", function(rs, args) {
	return core.saveData(rs.currentUser(),'Motive',args[0])
  
});

bot.setSubroutine("setPhoneNumber", function(rs, args) {
	return core.saveData(rs.currentUser(),'PhoneNumber',args[0])
  
});

bot.setSubroutine("setLaborOld", function(rs, args) {
	return core.saveData(rs.currentUser(),'LaborOld',args[0]+' '+args[1])
  
});

bot.setSubroutine("setFeesAmount", function(rs, args) {
	return core.saveData(rs.currentUser(),'FeesAmount',args[0]+' '+args[1])
  
});

bot.setSubroutine("setAnnualIncome", function(rs, args) {
	return core.saveData(rs.currentUser(),'AnnualIncome',args[0])
  
});



bot.setSubroutine("analizeQuestion", function(rs, args) {
	return core.analizeQuestion(rs.currentUser(),args[0])
  
});




bot.setSubroutine("debug", function(rs, args) {
	return "debug"
  
});

bot.setSubroutine("analizeLaborOld", function(rs, args) {

	return core.analizeLaborOld(rs.currentUser(),args[0]+' '+args[1])
  
});



bot.setSubroutine("checkFlow", function(rs, args) {

	return core.checkFlow(rs.currentUser(),args[0])
  
});

bot.setSubroutine("initLoan", function(rs, args) {
	return core.initLoan(rs.currentUser())
  
});

bot.setSubroutine("confirm", function(rs, args) {
	var response= core.confirm(rs.currentUser(),rs.getUservar(rs.currentUser(),"data"))
	if(response.status)
	{
		var user=response.user
		var _userName
		var _userAmmount
	    var _userMotive
		var  _userFeesAmount
		var _userLaborOld
		var _userAnnualIncome

		  
		for (var i = 0; i < user.Data.length; i++) {
			switch (user.Data[i].Param) {
				case 'Name':
					_userName=user.Data[i].Value.toString().trim()
					break;
				case 'Ammount':
					_userAmmount=user.Data[i].Value.toString().replace('USD','').trim()
					break;
				case 'Motive':
					_userMotive=user.Data[i].Value.toString().trim()
					break;
				case 'FeesAmount':
					_userFeesAmount=user.Data[i].Value.toString().trim()
					break;
				case 'LaborOld':
					_userLaborOld=user.Data[i].Value.toString().trim()
					break;
				case 'AnnualIncome':
					_userAnnualIncome=user.Data[i].Value.toString().replace('USD','').trim()
					break;
			}
  			
  		}

		return new bot.Promise(function(resolve, reject) {
		    
		    var post_options = {
			    host: 'http://52.14.165.211',
			    port: '9080',
			    path: '/o/rest/ms-loan-application',
			    method: 'POST',
			    headers: {
			          'Content-Type': 'application/json',
			    }
			};
			var random=Math.floor((Math.random() * 999999)+ 1);
			var email='sofiacobis'+random.toString()+'@test.com'
			

			var _body={  
			   "owners":[  
			      {  
			         "realEstate":"1",
			         "ownershipYear":"2013",
			         "firstName":"Carlos",
			         "middleName":"",
			         "lastName":"Téran",
			         "ssn":"123123123",
			         "phone":"112312312",
			         "address":"test",
			         "city":"test",
			         "state":"AL",
			         "zipCode":"12312",
			         "ownershipPercentage":100,
			         "yearsExperience":_userLaborOld.split(' ')[0],
			         "annualIncome":_userAnnualIncome,
			         "cash":_userAmmount,
			         "liabilities":"1000",
			         "assets":"200000",
			         "realEstatePayment":"2999"
			      }
			   ],
			   "advances":"1",
			   "payments":"1",
			   "business":{  
			      "projectedSales":"1",
			      "type":"SL",
				  "dateEstablished":"2014-11-11T05:00:00.000Z",
			      "name":"test",
			      "tin":random.toString(),
			      "phone":"2222222222",
			      "address":"test",
			      "city":"test",
			      "state":"AL",
			      "zipCode":"12312",
			      "description":"test",
			      "organizationState":"AL",
			      "annualRevenue":"2000",
			      "annualCogs":"2000",
			      "annualExpenses":"2000",
			      "totalDebt":"2000",
			      "totalMonthlyObligations":"2000",
			      "email":email
			   },
			   "amount":_userAmmount,
			   "purpose":_userMotive,
			   "loanApplicationInitialDate":"2017-05-21T14:38:36.990Z"
			}

			request({
		        url: 'http://52.14.165.211:9080/o/rest/ms-loan-application',
		        method:"POST",
				timeout:3000,
		        json: true,
		        headers:{"content-type":"application/json",},
		        body:_body
		    }, function (error, response) {
				if(response===undefined)
				{
					resolve('Su solicitud ha sido procesada. En breve un funcionario del banco se contactará con usted!')
				}
				else{
					if(response.statusCode==200 || response.statusCode==204)
					{
						resolve('Su solicitud ha sido procesada. En breve un funcionario del banco se contactará con usted!')
						
					}
					else
					{
						resolve('Su solicitud ha sido procesada. En breve un funcionario del banco se contactará con usted!')
					}
				}
		        
		    })
		})
	}
	else
	{
		return response.message
	}
  
});*/