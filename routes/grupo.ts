import { Router, Request, Response } from 'express';
import { Grupos } from '../models/grupos.model';
import { verificaToken } from '../middelwares/autenticacion';
import { Usuario } from '../models/usuario.model';
import Token from '../classes/token';
import {noti } from '../global/environment';
import http from 'http';


const grupoRoutes = Router();

grupoRoutes.post('/create/grupo', verificaToken,  (req: Request, res: Response) => {

    const grupo = {
        nombre: req.body.grupo
    }

    Grupos.create(grupo).then( grupoDB => {

        res.json({
            ok:true,
            mensaje: 'todo funciona bien',
            grupoDB
        });
    }).catch(err => {
        res.json({
            ok: false,
            mensaje: 'cuidado Error',
            err
        });
    });

    
});

///////////////////////////////////////////////////////////
//////////////////// RUTAS NUEVAS /////////////////////////
///////////////////////////////////////////////////////////

grupoRoutes.post('/update/grupo', verificaToken, (req: Request, res: Response) => {
    const grupo = {
        nombre: req.body.grupo,
    };

    Grupos.findByIdAndUpdate( req.body._id, grupo, {new: true}, async (err, grupoDB) => {

        if(err) throw err;

        if (!grupoDB) {
            return res.json({
                ok: false,
                mensaje: 'NO existe un ususario con ese ID'
            });
        }
         
         res.json({
             ok:true,
             grupo: grupoDB
         });

    })
});

grupoRoutes.post('/bloqueo/grupo', verificaToken, (req: Request, res: Response) => {
    const grupo = {
        enabled: req.body.enable,
    };

    Grupos.findByIdAndUpdate( req.body._id, grupo, {new: true}, async (err, grupoDB) => {

        if(err) throw err;

        if (!grupoDB) {
            return res.json({
                ok: false,
                mensaje: 'NO existe un ususario con ese ID'
            });
        }
         
         res.json({
             ok:true,
             grupo: grupoDB
         });

    })
});

grupoRoutes.get('/listar/grupos', verificaToken, (req: Request, res: Response) => {
    Grupos.find().then( grupoDB => {

        res.json({
            ok: true,
            grupos: grupoDB
        });
    });
});

grupoRoutes.get('/listar/true', verificaToken, (req: Request, res: Response) => {
    Grupos.find({enabled: true}).then( grupoDB => {

        res.json({
            ok: true,
            grupos: grupoDB
        });
    });
});

grupoRoutes.get('/grupos/:filtro', verificaToken, (req: Request, res: Response) => {

    const filtro = req.params.filtro;
  //  console.log(filtro);
    Grupos.find({'nombre': {'$regex': filtro, '$options':'i'}}).then(grupoDB => {

        res.json({
            ok: true,
            grupos: grupoDB
        });
    });
});

export default grupoRoutes;


/*
*****************************************************************************************************************************************************************************
*/



// Guardar ID de OneSignal
grupoRoutes.post('/updateone', verificaToken, (req: any, res: Response) => {
    

    const user = {
        onesignal:req.body.onesignal || req.usuario.onesignal
    };

    Usuario.findByIdAndUpdate( req.usuario._id, user, {new: true}, async (err, userDB) => {

        if(err) throw err;

        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'NO existe un ususario con ese ID'
            });
        }

        await userDB.populate('grupos').execPopulate();

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            onesignal: userDB.onesignal
         });
         
         res.json({
             ok:true,
             token: tokenUser
         });

    })
});


/*
*****************************************************************************************************************************************************************************
*/

grupoRoutes.post('/buscarUsuarios',  (req: any, res: Response) => {

    //console.log(req.body.grupos);
    //console.log(req.body.idOneSignal);
    //console.log(req.body.nombreGrupo);

    const grupos = req.body.grupos;
    const getIdOneSignal = req.body.idOneSignal;
    const nombreGrupo = req.body.nombreGrupo;
      


    
       Usuario.find({grupos: grupos}).populate('').then( userDB => {

        // const grupoMsj = res.userDB['usuarios'];

       // console.log(' userDB '+ userDB);

        for (var i=0; i<userDB.length; i++){

           const idOneSignal = userDB[i]['onesignal'];
           console.log('ID ONESIGNAL ' +idOneSignal);

           if( getIdOneSignal === idOneSignal || idOneSignal === undefined || idOneSignal === null){
               console.log(JSON.parse('false'));
           }else{
            console.log(JSON.parse('true'));

            var sendNotification = function(data:any) {
                var headers = {
                  "Content-Type": "application/json; charset=utf-8",
                  'Authorization': 'basic MzU2OGMzNmQtNDY2OC00NzliLThjZWQtNDIxMTE0YzU2MzI1'
                };
                
                var options = {
                  host: "onesignal.com",
                  port: 443,
                  path: "/api/v1/notifications",
                  method: "POST",
                  headers: headers
                };
                
                var https = require('https');
                var req = https.request(options, function(res:any) {  
                  res.on('data', function(data:any) {
                    console.log("Response:");
                    console.log(JSON.parse(data));
                  });
                });
                
                req.on('error', function(e:any) {
                  console.log("ERROR:");
                  console.log(e);
                });
                
                req.write(JSON.stringify(data));
                req.end();
              };
              
              var message = { 
                app_id: "40407aec-b13e-427f-9f55-ffa52e6d8ad6",
                priority:10,
                contents: {"en":"English message from Group - "+nombreGrupo,"es":"Mensaje Nuevo De Grupo - "+nombreGrupo},
                include_player_ids: [idOneSignal]
              };
              
              sendNotification(message)


              res.json({
                ok:true,
                usuario: 'okk'
            });


           // return;          

                

             

           }

        }
    });

    
});


/*


grupoRoutes.post('/buscarUsuarios',  (req: any, res: Response) => {

    //console.log(req.body.grupos);
    //console.log(req.body.idOneSignal);
    //console.log(req.body.nombreGrupo);

    const grupos = req.body.grupos;
    const getIdOneSignal = req.body.idOneSignal;
    const nombreGrupo = req.body.nombreGrupo;
      

    var fecha = new Date();
    var hora_actual= fecha.getHours();


    
       Usuario.find({grupos: grupos}).populate('').then( userDB => {

        // const grupoMsj = res.userDB['usuarios'];

       // console.log(' userDB '+ userDB);

        for (var i=0; i<userDB.length; i++){

           const idOneSignal = userDB[i]['onesignal'];
           console.log('ID ONESIGNAL ' +idOneSignal);

           if( getIdOneSignal === idOneSignal || idOneSignal === undefined || idOneSignal === null){
               console.log(JSON.parse('true'));
           }else{
            console.log(JSON.parse('false'));
            var sendNotification = function(data:any){

             /// Fire Cloud Message GOOGLE 
             var headers = {
                 "Content-Type": "application/json; charset=utf-8",
                 'Authorization': 'key=AAAAIbeIuH4:APA91bH7-DScJaZajgdkmz9K_hXh_PIJ7W0x2HMBUvUBK3S6dNj52DUI_lgWXZxy9fUEkxH_NKOeuyFVPS_h3wSbJKtDKzdz6l3WxO-RMgXclXWLbKelVo9QmWkF_Dv-it0q2vfhCipB'
             };
             // notificacti
             
             var options = {
                 host: "fcm.googleapis.com",
                 port: 443,
                 path: "/fcm/send",
                 method: "POST",
                 headers: headers
             };

             var https = require('https');
             var req = https.request(options, function(res:any) {  
               res.on('data', function(data:any) {
                 console.log("Response:"+hora_actual);
                 console.log(JSON.parse(data));
                 console.log(message);
               });
             });


             req.on('error', function(e:any) {
                 console.log("ERROR:");
                 console.log(e);
               });
               
               req.write(JSON.stringify(data));
               req.end();
             };

             var message = { 
                 "notification":{
                   "title":"Nuevo mensaje",
                   "body":"Mensaje de grupo - "+nombreGrupo,
                   "sound":"default",
                   "click_action":"FCM_PLUGIN_ACTIVITY",
                   "icon":"fcm_push_icon"
                 },
                 "data":{
                   "param1":"value1",
                   "param2":"value2"
                 },
                   "to":idOneSignal,
                   "priority":"high",
                   "restricted_package_name":""
               
               };
               
               sendNotification(message)

               res.json({
                 ok:true,
                 usuario: 'okk'
             });


           }



*/