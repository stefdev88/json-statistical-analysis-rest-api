/*
 Server che espone API RESTful per la gestione e l’analisi di un dataset socio-demografico.

 Il server espone 5 API endpoint per:
 - Ottenere il contenuto completo del dataset;
 - Ottenere tutte le proprietà del dataset;
 - Ottenere la lista di tutte le modalità di un campo del dataset;
 - Calcolare una metrica tra:
   - somma, media, mediana, massimo, minimo, range (solo sui dati numerici)
   - moda e restituire tutti i valori (per tutti i campi del dataset)
   - distribuzione assoluta, relativa e percentuale per tutti i campi del dataset;
 - Raggruppare per un campo e calcolare una metrica sui valori di un altro campo.
 */

const fs = require('fs');
const readline = require('readline-sync');
const express = require('express');
const p = require("./modules/paths");
const metric = require("./modules/statistics");
const c = require("./modules/middlewares");
const a = require("./modules/apireqbody")

const port = 3000;
const dbPath = "./data/";
const dbName = readline.question("Inserisci il nome del dataset: ");
const app = express();
const opsNum = {
    sum: metric.sum,
    mean: metric.mean,
    median: metric.median,
    min: metric.min,
    max: metric.max,
    range: metric.range
};

const opsAll = {
    mode: metric.mode,
    freqabs: metric.getFreqAbs,
    freqrel: metric.getFreqRel,
    freqperc: metric.getFreqPerc,
    allvalue: metric.getAllValue
};

async function server() {
    try{
        const db = JSON.parse(await fs.promises.readFile(dbPath+dbName));
        const serverCache = metric.cacheDbByFields(db);
        const campi=metric.getProperties(db);

        app.use(express.json());

        // check del body su tutte le route a partire da /data
        app.use(p.paths.checkBody, c.checkBody);

        // check dei campi del body sulla route /data/statistics/modality
        app.use(p.paths.postMod,
            c.checkBodyFields(a.apiReqBody.postMod),
            c.checkField("field", campi));

        // check dei campi del body e dell'operazione sulla route /data/statistics/descriptive
        app.use(p.paths.postDescr,
            c.checkBodyFields(a.apiReqBody.postDescr),
            c.checkField("field", campi), 
            c.checkOp("metric", opsNum, opsAll),
            c.checkOpNum("field", "metric", opsNum, serverCache));

        // check dei campi del body e dell'operazione sulla route /data/group
        app.use(p.paths.groupDbBy,
            c.checkBodyFields(a.apiReqBody.groupDbBy),
            c.checkField("groupBy", campi),
            c.checkField("aggregatedField", campi),
            c.checkOp("metric", opsNum, opsAll),
            c.checkOpNum("aggregatedField", "metric", opsNum, serverCache));
       
        //ottenere il contenuto completo del dataset
        app.get(p.paths.getDb, (req, res)=>{
            try{
                res.json(db);
                console.log(`${metric.getDate()} - Dataset inviato con successo`);
            } catch (err) {
                console.log(`${metric.getDate()} - ${err.message}`);
                res.status(500).json({error:"Ops! Qualcosa è andato storto"});
            }
        });

        //ottenere tutti campi del dataset
        app.get(p.paths.getProp, (req, res)=>{
            try{
                res.json(campi);
                console.log(`${metric.getDate()} - Elenco dei campi inviato con successo`);
            } catch (err) {
                console.log(`${metric.getDate()} - ${err.message}`);
                res.status(500).json({error:"Ops! Qualcosa è andato storto"});
            }
        });        

        // Ottenere la lista di tutte le modalità di un campo degli oggetti del dataset
        // body request object { "field": "nome campo" }
        app.post(p.paths.postMod, (req, res)=>{
            try{
                let lista = serverCache(req.body.field);
                let result ={};
                result[req.body.field] = metric.getUnique(lista);
                res.json(result);
                console.log(`${metric.getDate()} - Elenco delle modalità del campo '${req.body.field}' inviato con successo`);
            } catch (err) {
                console.log(`${metric.getDate()} - ${err.message}`);
                res.status(500).json({error:"Ops! Qualcosa è andato storto"});
            }
        });

        // Calcolare:
        // somma, media, mediana, massimo, minimo, range (solo sui dati numerici)
        // moda e restituire tutti i valori (per tutti i campi del dataset)
        // distribuzione assoluta, relativa e percentuale per tutti i campi del dataset;
        // body request object { "field": "nome proprietà", "metric": "metrica" }
        app.post(p.paths.postDescr, (req, res)=>{
            try{
                let lista = serverCache(req.body.field);
                let result = {};
                let op = opsNum[req.body.metric] || opsAll[req.body.metric];
                result[req.body.metric] = op(lista);                
                
                console.log(`${metric.getDate()} - Metrica '${req.body.metric}' sul campo '${req.body.field}' inviata con successo`);
                res.json(result);
            } catch (err) {
                console.log(`${metric.getDate()} - ${err.message}`);
                res.status(500).json({error:"Ops! Qualcosa è andato storto"});
            }
        });

        // Raggruppare per un campo e sui valori di un altro campo calcolare una metrica tra somma, media, mediana,
        // minimo, massimo, range, frequenze assolute, relative e percentuali (applicabile ai dati
        // numerici), moda e restituire elenco completo di valori (sui tutti i dati)
        // {"groupBy": "nome proprietà", "aggregatedField": "nome proprietà", "metric": "metrica"}
        app.post(p.paths.groupDbBy, (req, res)=>{
            try{                
                let aggrOp = metric.groupDbByField(db, req.body.groupBy);
                let op = opsNum[req.body.metric] || opsAll[req.body.metric];
                let result = aggrOp(op, req.body.aggregatedField);

                console.log(`${metric.getDate()} - Db raggruppato per '${req.body.groupBy}', operazione '${req.body.metric}' sul campo '${req.body.aggregatedField}' inviata con successo`);
                res.json(result);
            }catch (err) {
                console.log(`${metric.getDate()} - ${err.message}`);
                res.status(500).json({error:"Ops! Qualcosa è andato storto"});
            }
        })        
            
        app.listen(port, ()=>console.log(`Server in ascolto all'indirizzo ${p.paths.localhost}${port}`));
        
    }catch(er){
        console.log("Attenzione!", er.message);
    }
}

server();
