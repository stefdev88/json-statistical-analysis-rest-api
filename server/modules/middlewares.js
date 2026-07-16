const m =require("./statistics")

/**
 * Middleware che verifica la presenza di un body nella richiesta e che esso sia
 * stato correttamente parsificato da express.json()
 *
 * Se req.body è assente invia all'utente un JSON contenente un messaggio di errore 
 * e lo status code 400, altrimenti invoca il middleware successivo tramite next()
*/
function checkBody(req, res,next){
    if (!req.body) {
        console.log(`${m.getDate()} - Richiesta con body mancante o non in formato JSON`);
        return res.status(400).json({error: "Richiesta con body mancante o non in formato JSON"});
    };
    return next()
}

/**
 * Crea un middleware per verificare che gli attributi del body inviato dal client siano quelli che l'endpoint si aspetta
 * @param {Object} apiReqBody - oggetto che contiene il request body corretto per ciascun endpoint
 * @returns {(req, res, next)=>void} middleware che, se un attributo del body non è ammesso o mancante, invia all'utente un JSON contenente un messaggio di errore 
 * e lo status code 400, altrimenti invoca il middleware successivo tramite next()
 */
function checkBodyFields(apiReqBody){
    return (req, res, next)=>{
        if (Object.keys(req.body).length < Object.keys(apiReqBody).length){
                console.log(`${m.getDate()} - Body con attributi mancanti`);
                return res.status(400).json({error:`Body con attributi mancanti`});
            };
        for (field in req.body){
            if (!(field in apiReqBody)){
                console.log(`${m.getDate()} - Body errato, attributo '${field}' non consentito`);
                return res.status(400).json({error:`Body errato, attributo '${field}' non consentito`});
            };
        };
        return next();
    };
}

/**
 * Crea un middleware per verificare che il valore di un attributo del body appartenga a un insieme di valori ammessi
 * @param {string} fieldName - Il nome dell'attributo del body che contiene il nome dell'attributo del dataset
 * @param {any[]} campi - Array contenente tutti gli attributi del dataset
 * @returns {(req, res, next)=>void} middleware che, se l'attributo non è presente, invia all'utente un JSON contenente un messaggio di errore 
 * e lo status code 400, altrimenti invoca il middleware successivo tramite next()
 */
function checkField(fieldName, campi){
    return (req, res, next)=>{
        if (!(campi.includes(req.body[fieldName]))){
            console.log(`${m.getDate()} - Attributo '${req.body[fieldName]}' non presente nel dataset`);
            return res.status(400).json({error:`Attributo '${req.body[fieldName]}' non presente nel dataset`});
        };
        return next();
    }
}

/**
 * Crea un middleware per verificare che un'operazione sia tra quelle consentite, definite in due oggetti
 * @param {string} fieldMetric - Il nome dell'attributo del body che contiene la metrica
 * @param {Object} opsNum - Oggetto contenente operazioni numeriche consentite
 * @param {Object} opsAll - Oggetto contenente operazioni generiche consentite
 * @returns {(req, res, next)=>void} Middleware che controlla se l'attributo è presente come chiave in opsNum oppure in opsAll. 
 * Se l'operazione non è consentita, risponde con status 400 e un messaggio di errore in formato JSON,
 * altrimenti invoca il middleware successivo tramite next()
 */
function checkOp(fieldMetric, opsNum, opsAll){
    return (req, res, next)=>{
        if (!(req.body[fieldMetric] in opsNum || req.body[fieldMetric] in opsAll )){
            console.log(`${m.getDate()} - Operazione '${req.body[fieldMetric]}' non esistente`);
            return res.status(400).json({ error: `Operazione '${req.body[fieldMetric]}' non esistente` });
        }
        return next();
    }
}

/**
 * Crea un middleware per verificare che un'operazione numerica sia applicabile alla lista di valori fornita
 * @param {string} fieldName - Il nome dell'attributo del body che contiene il nome dell'attributo del dataset su cui applicare la metrica
 * @param {string} fieldMetric - Il nome dell'attributo del body che contiene la metrica
 * @param {Object} opsNum - Oggetto contenente le operazioni numeriche consentite
 * @param {Function} cache - Funzione che crea una cache dei valori delle proprietà di un dataset, restituisce un array
 * @returns {(req, res, next)=>void} Middleware che, se l'array contiene valori non numerici e l'operazione è numerica,
 * risponde con status 400 e un messaggio di errore in formato JSON, altrimenti invoca il middleware successivo tramite next()
 */
function checkOpNum(fieldName, fieldMetric, opsNum, cache){
    return (req, res, next)=>{
        if (!cache(req.body[fieldName]).every(Number.isFinite) && req.body[fieldMetric] in opsNum ){
            console.log(`${m.getDate()} - Operazione '${req.body[fieldMetric]}' non consentita su dati non numerici`);
            return res.status(400).json({ error: `Operazione '${req.body[fieldMetric]}' non consentita su dati non numerici` });
        }
        return next();
    }
}

/**
 * Crea un middleware per verificare che l'operazione "mode" sia applicata solo a valori categorici
 * @param {string} fieldName - Il nome dell'attributo del body che contiene il nome del'attributo del dataset
 *  su cui applicare la metrica
 * @param {string} fieldMetric - Il nome dell'attributo del body che contiene la metrica
 * @param {Function} cache - Funzione che crea una cache dei valori delle proprietà di un dataset, restituisce un array
 * @returns {(req, res, next)=>void} Middleware che, se l'array contiene valori numerici e l'operazione è "mode",
 * risponde con status 400 e un messaggio di errore in formato JSON, altrimenti invoca il middleware successivo tramite next()
 */
function checkMode(fieldName, fieldMetric, cache){
    return (req, res, next)=>{
        if (cache(req.body[fieldName]).every(Number.isFinite) && req.body[fieldMetric] === "mode"){
            console.log(`${m.getDate()} - Operazione '${req.body[fieldMetric]}' non consentita su dati numerici`);
            return res.status(400).json({ error: `Operazione '${req.body[fieldMetric]}' non consentita su dati numerici` });
        }
        return next();
    }
}

module.exports = {
    checkBody,
    checkBodyFields,
    checkField,
    checkOp,
    checkOpNum,
    checkMode
};
