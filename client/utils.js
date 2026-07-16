
const p = require("../server/modules/paths");
const readline = require('readline-sync');
const a = require('../server/modules/apireqbody');

const serverAddress = 'http://localhost:3000';

/**
 * Funzione asincrona che effettua una fetch con il metodo http "GET" e restituisce il body della risposta
 * @param {string} api api endpoint per effettuare la fetch 
 * @returns {Promise} restituisce una promise che è fulfilled con il body del Response Object convertito in oggetto
 */
async function getFetch(api) {
    let resObj = await fetch(api, {headers:{"Connection": "close"}});
    console.log(resObj);
    return resObj.json();
}

/**
 * Funzione asincrona che effettua una fetch con il metodo http "POST" e restituisce il body della risposta
 * @param {string} api api endpoint per effettuare la fetch
 * @param {Object<string, string>} reqBody Request body contenente i dati da inviare al server
 * @returns {Promise} restituisce una promise che è fulfilled con il body del Response Object convertito in oggetto
 */
async function postFetch(api, reqBody) {
    let resObj = await fetch(api, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Connection": "close"},
        body: JSON.stringify(reqBody)  
        });
    console.log(resObj);    
    return resObj.json();
}

/**
 * Funzione che riceve un API endpoint e restituisce una funzione asincrona che invoca 'getFetch'
 * @param {string} api API endpoint su cui effettuare la fetch 
 * @returns {Function} funzione asincrona che invoca 'getFetch' all'endpoint in argomento e
 * visualizza su terminale il body del Response Object
 */
function getConstructor(api){
    return async ()=>{
        let resBody = await getFetch(api);
        console.log(resBody);}
}

/**
 * Funzione asincrona che invoca la funzione asincrona 'getFetch' per recuperare il contenuto completo del dataset.
 * Visualizza su terminale il body del Response Object
 */
const getDs = getConstructor(serverAddress+p.paths.getDb)

/**
 * Funzione asincrona che invoca la funzione asincrona 'getFetch' per ottenere la lista di tutte le proprietà del dataset.
 * Visualizza su terminale il body del Response Object
 */
const getPr = getConstructor(serverAddress+p.paths.getProp)

/**
 * Funzione asincrona che compone il body del Request Object con dati inseriti dall'utente.
 * Invoca la funzione asincrona 'postFetch' per ottenere la lista di tutte le modalità di un campo del dataset.
 * Visualizza su terminale il body del Response Object
 */
async function getMod(){
    const requestBody = {...a.apiReqBody.postMod};
    requestBody.field = readline.question("Inserisci il nome del campo: ");
    let resBody = await postFetch(serverAddress+p.paths.postMod, requestBody);
    console.log(resBody);
}

/**
 * Funzione asincrona che compone il body del Request Object con dati inseriti dall'utente.
 * Invoca la funzione asincrona 'postFetch' per calcolare metriche sui valori di un campo del dataset.
 * Visualizza su terminale il body del Response Object
 */
async function getMetr(){
    const requestBody = {...a.apiReqBody.postDescr};
    requestBody.field = readline.question("Inserisci il nome del campo: ");
    requestBody.metric = readline.question("Inserisci il nome della metrica: ");
    let resBody = await postFetch(serverAddress+p.paths.postDescr, requestBody);
    console.log(resBody);
}

/**
 * Funzione asincrona che compone il body del Request Object con dati inseriti dall'utente.
 * Invoca la funzione asincrona 'postFetch' per raggruppare i dati per un campo e calcolare metriche sui valori di un altro campo del dataset.
 * Visualizza su terminale il body del Response Object
 */
async function getGroup(){
    const requestBody = {...a.apiReqBody.groupDbBy};
    requestBody.groupBy = readline.question("Inserisci il nome del campo su cui raggruppare: ");
    requestBody.aggregatedField = readline.question("Inserisci il nome del campo su cui calcolare la metrica: ");
    requestBody.metric = readline.question("Inserisci il nome della metrica: ");
    let resBody = await postFetch(serverAddress+p.paths.groupDbBy, requestBody);
    console.log(resBody);
}

module.exports = {
    getGroup,
    getMetr,
    getMod,
    getPr,
    getDs
};