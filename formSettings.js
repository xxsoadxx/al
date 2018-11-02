const formSettings = {
	
	nombre:{
		literal:'nombre y apellido',
		respuesta:{
			txt:'Empecemos por lo más importante. Diga su nombre y apellido.',
			voice:''
		},
		change:{
			txt:'Listo, ¡perfecto!',
			voice:''
		},
		error:{
			txt:'Disculpe, no logré comprenderlo. Repítalo por favor. ',
			voice:''
		}
	},

	telefono:{
		literal:'número de teléfono',
		respuesta:{
			txt:'Por favor diga número por número su teléfono de contacto. Es MUY importante contar con el para que podamos contactarnos con usted, por favor verifíquelo bien.',
			voice:''
		},
		change:{
			txt:'Listo, ¡perfecto!',
			voice:''
		},
		error:{txt:'Disculpe, no logré comprenderlo. Repítalo por favor. ',voice:''}

	},

	codarea:{
		literal:'código de área',
		respuesta:{
			txt:'Dígame su código de área, por ejemplo: 0387.',
			voice:''
		},
		change:{
			txt:'Listo, ¡perfecto!',
			voice:''
		},
		error:{
			txt:'Disculpe, no logré comprenderlo. Repítalo por favor. ',
			voice:''
		},
		values:['0387','0381','0388']
	},

	dni:{
		literal:'DNI',
		respuesta:{
			txt:'Por favor dígame su DNI.',
			voice:'Por favor dígame su DE ENE I. Por ejemplo: veintidós millones doscientostreinta mil ochocientos)'
		},
		change:{
			txt:'Listo, ¡perfecto!',
			voice:''
		},
		error:{
			txt:'Disculpe, no logré comprenderlo. Repítalo por favor. ',
			voice:''
		},

	},

	

	provincia:{
		literal:'provincia',
		respuesta:{
			txt:'Por favor dígame su provincia de residencia',
			voice:''
		},
		change:{
			txt:'Listo, ¡perfecto!',
			voice:''
		},
		error:{
			txt:'Disculpe, no logré comprenderlo. Repítalo por favor. ',
			voice:''
		},
		values:['Jujuy','Salta','Tucumán']

		//Jujuy, Perico, Palpalá, Otra, Salta Capital (si te dicen salta tomalo como salta capital), San Miguel de Tucumán,Banda de Rio Salí
	},

	localidad:{
		literal:'localidad',
		respuesta:{
			txt:'Por favor dígame su localidad.',
			voice:''
		},
		change:{
			txt:'Listo, ¡perfecto!',
			voice:''
		},
		error:{
			txt:'Disculpe, no logré comprenderlo. Repítalo por favor. ',
			voice:''
		},
		values:['Jujuy', 'Perico', 'Palpalá', 'Otra', 'Salta Capital', 'San Miguel de Tucumán,Banda de Rio Salí']

	},

	email:{
		literal:'correo electrónico',
		respuesta:{
			txt:'Por favor dígame su correo electrónico, por ejemplo: juanpérez@gmail.com',
			voice:''
		},
		change:{
			txt:'Listo, ¡perfecto!',
			voice:''
		},
		error:{txt:'Disculpe, no logré comprenderlo. Repítalo por favor. ',voice:''}
	},

	

	monto:{
		literal:'monto del crédito',
		respuesta:{
			txt:'Por favor dígame el monto del crédito que usted estaría solicitando.',
			voice:''
		},
		change:{
			txt:'Ok, listo.',
			voice:''
		},
		error:{
			txt:'Disculpe, no logré comprenderlo. Repítalo por favor. ',
			voice:''
		},
	},

	destino:{
		literal:'destino del crédito',
		respuesta:{
			txt:'Por favor dígame el destino para el cual ud solicita el crédito. ¿Para qué lo usará?',
			voice:''
		},
		change:{
			txt:'Ok, listo.',
			voice:''
		},
		error:{
			txt:'Disculpe, no logré comprenderlo. Repítalo por favor. ',
			voice:''
		}
	},



	msgCompletedForm:'Formulario completado. Verifica los datos ingresados y di enviar',
	msgWelcomeForm:'Por favor, comience diciendo su nombre completo.'
	
};

module.exports = formSettings;