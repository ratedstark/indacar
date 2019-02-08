const express 		=	require('express');
const bodyparser 	= 	require('body-parser');
const request		=	require('request');
const app 			= 	express();

app.set('view engine','ejs');
app.use(express.static('public'))
app.use(bodyparser.urlencoded({extended:true}));

app.get('/',function(req,res){
	res.render('Index',{km:null,promedio:null,error:null});//Muestra al inicio de la pagina
});

app.post('/',function(req,res){
	let codigo = req.body.codigo;
	let baseurl = 'https://dev.indacar.com.mx/api/dashboards/trips/user';
 	
 	let options = {
 		url:baseurl,
 		method:'POST',
 		json:true,
 		
 		body:{ //Este son las claves para que devuelva la informacion
 			token:'3f676c69496045c5762781ca5438e1605fab651272a728bed0a94364daf3009d930d0cdc4cd0d85fabf494b2b3b34f5a',
 			type:'Daily',
 			start_time:'2019-01-24T00:00:00.000Z',
 			end_time:'2019-01-31T00:00:00.000Z'
 		}
 	};
 	
 	request(options,function(err,response,body){
 		
 		if(err){
			
			res.render('index',{km:null,error:'Intentalo de nuevo'});//
		
		}else{
			let flag = false;
			let km =[];
			let promedio =0;
			let i;
			for(i = 0;i<body.data.length;i++){ //For para recorrer todos los objetos
				
				if(body.data[i]['iddevice']===codigo){ //Si el codigo existe entra
					let data = body.data[i];
					km.push(data['avgGradeKm']);
					promedio += data['avgGradeKm']; 
				}
			}
			promedio = promedio/i;

			if(!flag){
				res.render('index',{km:km,promedio:promedio,error:null});

			}else{
				res.render('index',{km:null,promedio:null,error:'No encontrado'}); //Si no existe el codigo devuelve un no encontrado

			}
		}
 	});
});

app.listen(3000,function(){});