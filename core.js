const formSettings = require('./formSettings');

const doc = require('arg.js').document;

const regExTel  = /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/;
const regExMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;




function checkFlow(vars){
	
	var completed=true;
	if(vars.voice==undefined)
		vars.voice=''

	for (var key in vars.formulario) {
		console.log('recorriendo ',vars.formulario[key].trim())
	 	if(vars.formulario[key].trim()==''){
	 		vars.reply+=formSettings[key].respuesta.txt
	 		vars.voice=formSettings[key].respuesta.voice.trim()!=='' ? formSettings[key].respuesta.voice : formSettings[key].respuesta.txt
	 		completed=false
	 		break;
	 	}

	}

	if(completed){
		vars.reply+=formSettings.msgCompletedForm
		vars.voice+=formSettings.msgCompletedForm
	}

	vars.completed=completed
	console.log('se va del checkFlow ',vars)

	return vars
	 
}

function sanatizeValue(value,param){
	
	var _value=value.trim()

	
	switch(param){
		case 'email':
			_value=_value.toLowerCase().replace(/ /g,'')
			if(!_value.includes('@'))
				_value=_value.replace('arroba','@')
			if(_value.includes('punto'))
				_value=_value.replace('punto','.')

			console.log('aca nene')
			
			break;
		case 'dni':
			_value=_value.split('.').join('')
			_value=_value.split('punto').join('')
			break;
		case 'codarea':
			_value=_value.replace(/\D/g,'').trim();
			
			break;
		case 'localidad':
		case 'provincia':
			_value=_value.replace(/[^a-z A-Z]+/g, '')
			let _valueLower=_value.toLowerCase()
			if(_valueLower=='tucuman')
				_value='Tucumán'
			else if(param=='localidad' && (_valueLower=='salta') || (_valueLower=='capital'))
				_value='Salta Capital'

			if(_value.length>3 && _value.substring(0,3).toUpperCase()=='DE ')
			{
				_value=_value.replace('DE ','')
				_value=_value.replace('de ','')
			}


			break;

	}



	if(_value.length>2 && _value.substring(0,2).toUpperCase()=='A ')
	{
		_value=_value.replace('A ','')
		_value=_value.replace('a ','')
	}
	console.warn('sanatizeValue retorno ',_value)

	return _value
}

function validPhone(value){

	value=value.replace(/\D/g,'').trim();

	if(value!=='')
		return {value,validate:true}
	else
		return {value,validate:false}
}




var core ={ 


	initForm:function(vars){
		vars.reply=formSettings['msgWelcomeForm']
		vars.voice=formSettings['msgWelcomeForm']
		vars.begin=true

		return vars

	},

	saveData: function  (vars,param,value) {
		console.log('dentro de saveData ',param,value,vars)
		value=value.trim()
		value=sanatizeValue(value,param)
		switch(param){
			case 'email':

				if(!regExMail.test(value)){
					vars.reply=formSettings[param].error.txt
					vars.voice=formSettings[param].error.voice.trim()!=='' ? formSettings[param].error.voice : formSettings[param].error.txt
					return vars;
				}
			break;
			case 'dni':
				

			    if(value.length<8 || !doc.isValidDni(value)){
			    	vars.reply=formSettings[param].error.txt
					vars.voice=formSettings[param].error.voice.trim()!=='' ? formSettings[param].error.voice : formSettings[param].error.txt
					return vars;
			    }
			    break;
			case 'telefono':
				let response=validPhone(value)

			    if(!response.validate){
			    	vars.reply=formSettings[param].error.txt
					vars.voice=formSettings[param].error.voice.trim()!=='' ? formSettings[param].error.voice : formSettings[param].error.txt
					return vars;
			    }
			    else
					value=value.replace(/\D/g,'').trim();
			    break;
			case 'monto':
				value=value.replace(/\D/g,'').trim();
				if(isNaN(value)){
					vars.reply=formSettings[param].error.txt
					vars.voice=formSettings[param].error.voice.trim()!=='' ? formSettings[param].error.voice : formSettings[param].error.txt
					return vars;
				}
			    break;

			case 'provincia':
			case 'localidad':
			case 'codarea':
				console.log('en el case provincia localidad codarea')
				let values=formSettings[param].values
				let error=true
				let auxValue=value.toLowerCase().trim()



				for (let i = 0; i < values.length; i++) {
					console.log('evaluo ',auxValue,' - ',values[i].toLowerCase())
					if(auxValue==values[i].toLowerCase()){
						console.log('coincide')
						error=false
						break;
					}
				}
				if(error){
					vars.reply=formSettings[param].error.txt
					vars.voice=formSettings[param].error.voice.trim()!=='' ? formSettings[param].error.voice : formSettings[param].error.txt
					console.log('no coincide')

					return vars;
				}


			    break;

			   

		}
		
		if(vars.formulario[param].trim()!==''){
			vars.reply=formSettings[param].change.txt
			vars.voice=formSettings[param].error.voice.trim()!=='' ? formSettings[param].error.voice : formSettings[param].error.txt
		}
		else
			vars.reply=''

		vars.formulario[param]=value
		console.log('formulario saveData ',vars.formulario)
		return checkFlow(vars)
  		
	},
	
	analizeNumber: function  (vars,value) {

		if(vars.completed){
			vars.reply=formSettings['msgCompletedForm']
			vars.completed=false
			vars.begin=true
			return vars
		}
		var param;
		if(vars.begin){
			console.log('begin true')
			for (var key in vars.formulario) {
				param=key;
			 	if(vars.formulario[key].trim()==''){

			 		switch(key){
			 			case 'dni':
			 			case 'telefono':
			 			case 'monto':
			 			case 'codarea':
			 				return core.saveData(vars,key,value)
			 				break;
			 		}
			 	}

			}
		}

		vars.reply=formSettings[param].error.txt
		vars.voice=formSettings[param].error.voice.trim()!=='' ? formSettings[param].error.voice : formSettings[param].error.txt
		console.log('retorno ',vars)
		return vars

	},
	analizeText: function  (vars,value) {

		if(vars.completed){
			vars.reply=formSettings['msgCompletedForm']
			vars.completed=false
			vars.begin=true
			return vars
		}

		for (var key in vars.formulario) {
		 	if(vars.formulario[key].trim()==''){
		 		return core.saveData(vars,key,value)
		 	}
 
		}
		vars.reply=formSettings['msgCompletedForm']
		vars.completed=false
		vars.begin=true
		return vars





	}

	
};


module.exports = core;