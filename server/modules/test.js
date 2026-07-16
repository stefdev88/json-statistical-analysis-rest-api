const fs =require("fs");

//[{"id": 1, "eta": 32, "genere": "M", "reddito": 30000, "istruzione": "diploma", "occupazione": "operaio", "area": "urbana"}]
const db = JSON.parse(fs.readFileSync("../data/dbtest.json"));

/**
 * Contiene tutte le proprietà presenti nei record del dataset
 */
const campi = Object.freeze({
    id: "id",
    eta: "eta",
    genere: "genere",
    reddito: "reddito",
    istruzione: "istruzione",
    occupazione: "occupazione",
    });

/**
 * Restituisce la lista di tutte le proprietà dei record presenti nel dataset
 * @param {Object[]} db dataset da manipolare
 * @returns {string[]} lista di tutte le proprietà dei record presenti nel dataset
 */
// function getProperties(db){
//     let lista =[];
//     for (let el of db){ //per ogni obj del db
//         for (let i in el){ //per ogni chiave del obj la push
//             if (!lista.includes(i)){
//                 lista.push(i);}}};
//     return lista;        
// }
function getProperties(db){
    let set = new Set();
    db.forEach(el=>{
        for (let i in el){
            set.add(i);
        };
    });
    return [...set];        
}

function createObj(lista){
    let obj = {};
    lista.forEach(el=>{
        obj[el] = el;
    });
    return obj;
}


// /**
//  * Estrae i valori di una proprietà specifica da tutti gli oggetti di un dataset
//  * @param {Object[]} db dataset da manipolare
//  * @param {string} field campo di cui estrarre tutti valori 
//  * @returns {any[]} lista di tutti i valori della proprietà selezionata
//  */
// function getValByField(db, field){
//     return db.map(el => el[field]);
// }

/**
 * Crea una cache dei valori delle proprietà di un dataset
 * @param {Object[]} db dataset su cui creare la cache
 * @returns {(field: string) => any[]} funzione che:
 *  - riceve il nome di una proprietà (field)
 *  - verifica se esiste una chiave corrispondente in cache
 *  - in caso contrario, estrae i valori dal dataset e li memorizza in un array che associa alla chiave
 *  - restituisce l'array di tutti i valori del dataset associati alla proprietà richiesta
 */
function cacheDbByFields(db) {
    const cache = {};
    return field => {
        if (!(field in cache)) {
            cache[field] = db.map(el => el[field]);
        }
        return cache[field];
    };
}



// function modalita(db, field){
//     let alls = db.map(el=>el[field]);
//     let unic = [];
//     for (let el of alls){
//         if (!unic.includes(el)){
//             unic.push(el);
//         }
//     }
//     return unic;
// }

// const modalita = (db, field) =>
//   db.map(el => el[field])
//     .reduce((acc, val) =>
//       acc.includes(val) ? acc : [...acc, val],
//       []
//     );

// function modalita(db, field){
//     return db.map(el => el[field])
//     .reduce((acc, val) =>
//         acc.includes(val) ? acc : [...acc, val], [])}
// function getUnique(lista){
//     return lista.reduce((acc, val) =>
//         acc.includes(val) ? acc : [...acc, val], []);
// }
/**
 * Estrae gli elementi unici da una lista
 * @param {any[]} lista lista di valori da cui eliminare i duplicati
 * @returns {any[]} lista di elementi univoci
 */    
function getUnique(lista){
    let set = new Set(lista);
    return [...set]
}

/**
 * Restituisce la somma di tutti i valori di un array
 * @param {number[]} lista lista di valori
 * @returns {number} valore della somma
 */
function somma(lista){
    return lista.reduce((acc, curr) => acc + curr, 0);
}

/**
 * Restituisce la media di tutti i valori di un array
 * @param {number[]} lista lista di valori
 * @returns {number} valore della media
 */
function mean(lista){
    if (lista.length === 0) return 0;
    return (somma(lista)/lista.length);
}

/**
 * Restituisce la mediana di tutti i valori di un array di numeri.
 * 
 * Se la lunghezza dell'array è dispari, restituisce il valore centrale.
 * Se è pari, restituisce la media dei due valori centrali.
 * Usa la definizione matematica di mediana, adattata agli indici degli array che partono da 0
 * @param {number[]} lista lista di valori
 * @returns {number} valore della mediana
 */
function mediana(lista){
    let sorted = [...lista].sort((a,b) => a-b); // non modifica la lista nella cache
    if (sorted.length % 2){
        return sorted[((sorted.length - 1) / 2)];
    }
    return (sorted[(sorted.length / 2)-1] + sorted[(sorted.length / 2)])/2;
}

// /**
//  * Restituisce la moda (modalità più frequente) di tutti i valori di un array
//  * @param {any[]} lista lista di valori
//  * @returns {string} valore della moda (come stringa)
//  */
// function moda(lista){
//     let freq = getFreqAss(lista);
//     let res;
//     let max = 0;
//     for (let i in freq){
//         if (freq[i]>max){
//             max = freq[i];
//             res=i;
//         }        
//     };
//     return res
// }

/**
 * Restituisce la moda o più mode (modalità più frequente) di tutti i valori di un array
 * @param {any[]} lista array di valori
 * @returns {any[]} array di valore/i della moda
 */
function moda(lista){
    let freq = getFreqAss(lista);
    let res=[];
    let max = 0;
    for (let i in freq){
        if (freq[i]>max){
            max = freq[i];
            res=[i];
        } else if (freq[i]===max){
            res.push(i)
        };        
    };
    return res;
}

// function massimo(lista){
//     let max = 0;
//     for (let i of lista){
//         if (i > max){
//             max = i
//         }
//     } return max;
// }

/**
 * 
 * @param {(a: any, b: any) => boolean} logica - Funzione di confronto tra due valori.
 * Restituisce 'true' se il primo valore è da mantenere, 'false' altrimenti.
 * @returns {(a: number[]) => number} funzione che accetta come argomento un array e restituisce
 * il valore che soddisfa la condizione definita da logica
 */
function createSelector(logica){
    return (lista)=>lista.reduce((acc, value)=>logica(acc, value) ? acc : value);
}

/**
 * Rappresenta una funzione che accetta un array come argomento e restituisce il valore massimo degli elementi
 */
const massimo = createSelector((a, b) => a > b);

/**
 * Rappresenta una funzione che accetta un array come argomento e restituisce il valore minimo degli elementi
 */
const minimo = createSelector((a, b) => a < b);

/**
 * Calcola il range dei valori di un array di numeri
 * @param {number[]} lista Array di elementi di cui calcolare il range
 * @returns {number} valore del range
 */
function range(lista){
    return massimo(lista) - minimo(lista);
}

// function getFreqAss(lista){
//     let modalita = getUnic(lista);
//     let freq = {};
//     modalita.forEach(mod=>
//         freq[mod]=lista.filter(el=>el===mod).length);
//     return freq;
// }

/**
 * Calcola la frequenza (assoluta, relativa o percentuale) per ogni modalità della proprietà selezionata
 * 
 * Accetta come argomento una funzione che rappresenta la logica per calcolare le frequenze
 * @param {(count: number, n: number) => number} tipologia - Una funzione che riceve:
 *   - count = frequenza assoluta della modalità
 *   - n = numero totale di elementi
 * @returns {(lista: any[]) => Object<string, number>}
 * Una funzione che accetta una lista e restituisce un oggetto con coppie { modalità: frequenza }.
 */
// function createFreq(tipologia){
//     return function(lista){
//         let modalita = getUnique(lista);
//         let freq = {};
//         let n = lista.length;

//         modalita.forEach(mod => 
//             freq[mod] = tipologia(lista.filter(el => el === mod).length, n)
//         );
//         return freq;
//     }
// }

function createFreq(tipologia) {
    return function(lista) {
        let freq = {};
        let n = lista.length;
        for (let el of lista) {
            freq[el] = ((el in freq) ? freq[el] : 0) + 1;
        }
        for (let key in freq) {
            freq[key] = tipologia(freq[key], n);
        }
        return freq;
    };
}

const getFreqAss = createFreq((count, n) => count);
const getFreqRel = createFreq((count, n) => count / n);
//const getFreqPerc = createFreq((count, n) => count / n * 100);
const getFreqPerc = createFreq((count, n) => Number(((count / n) * 100).toFixed(3)));


// /**
//  * Raggruppa un dataset di oggetti in base ai valori di una proprietà
//  * e restituisce una funzione per applicare un'operazione sui dati di ciascun gruppo
//  * @param {Object[]} db dataset da manipolare
//  * @param {string} fieldGroup campo per cui raggruppare i record
//  * @returns {(op: Function, fieldOp: string) => Object<string, any>}
//  * Una funzione che:
//  *  - riceve un'operazione da applicare
//  *  - riceve un campo da cui estrarre i valori all'interno di ogni gruppo
//  *  - restituisce un oggetto con coppie { modalità: risultato }
//  */
// function groupDbByField(db, fieldGroup){
//     let grouped ={};
//     db.forEach(el=>{
//         if (!(grouped[el[fieldGroup]])){
//             grouped[el[fieldGroup]]=[];
//         }
//         grouped[el[fieldGroup]].push(el);
//     });
//     return function (op, fieldOp){ 
//         let result = {};
//         for(let key in grouped){
//             let l = getValByField(grouped[key], fieldOp);
//             result[key]=op(l);
//         };
//         return result;
//     };
// }

/**
 * Raggruppa un array di oggetti per un campo specifico e restituisce
 * una funzione per applicare operazioni sui gruppi.
 * Ogni gruppo mantiene una cache interna alla funzione dei valori per campo, così da evitare
 * di ricalcolare più volte gli stessi array.
 *
 * @param {Object[]} db dataset da manipolare
 * @param {string} fieldGroup nome del campo su cui raggruppare i dati
 *
 * @returns {(op: Function, fieldOp: string) => Object} Una funzione che:
 *  - prende un'operazione da applicare
 *  - prende il nome del campo su cui operare
 *  - restituisce un oggetto con i risultati per ogni gruppo
 */
function groupDbByField(db, fieldGroup){
    let grouped = {}; // {"F":[{},{}, ecc], "M":[{},{}, ecc]}
    let cacheInt = {}; // {"F": , "M": }
    //crea i mini dataset suddivisi per i valori di fieldGroup
    db.forEach(el => {
        if (!(el[fieldGroup] in grouped)){
            grouped[el[fieldGroup]] = [];
        }
        grouped[el[fieldGroup]].push(el);
    });

    for (let key in grouped){
        // genera una cache per ogni mini dataset in grouped
        cacheInt[key] = cacheDbByFields(grouped[key]);
    }

    return function (op, fieldOp){ 
        let result = {};
        for(let key in grouped){
            let l = cacheInt[key](fieldOp);
            result[key] = op(l);
        }
        return result;
    };
}

const getAllVal = lista => lista;


// app.post(p.paths.postDescr, (req, res)=>{
//     try{
//         let lista = serverCache(req.body.field);
//         let result = {};
//         switch(req.body.metric){
//             case ops.sum:
//                 result[ops.sum]=metric.somma(lista);
//                 break;
//             case ops.mean:
//                 result[ops.mean]=metric.mean(lista);
//                 break;
//             case ops.median:
//                 result[ops.median]=metric.mediana(lista);
//                 break;
//             case ops.mode:
//                 result[ops.mode]=metric.moda(lista);
//                 break;
//             case ops.min:
//                 result[ops.min]=metric.minimo(lista);
//                 break;
//             case ops.max:
//                 result[ops.max]=metric.massimo(lista);
//                 break;
//             case ops.range:
//                 result[ops.range]=metric.range(lista);
//                 break;
//             default:
//                 console.log(`Operazione '${req.body.metric}'non consentita`)
//                 return res.status(403).json({error:`Operazione '${req.body.metric}'non consentita`}); 
//         }
//         console.log(`Metrica '${req.body.metric}' sul campo '${req.body.field}' inviata con successo`);
//         res.json(result);
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).json({error:"Ops! Qualcosa è andato storto"});
//     }
// });
const ops = {
    sum: somma,
    mean: mean,
    median: mediana,
    mode: moda,
    min: minimo,
    max: massimo,
    range: range
};

// let metric ="max"
// const operation = ops[metric];
// console.log(operation(l))
//let a = [[], 34.5,7.23]
//console.log(a.every(Number.isFinite))

//console.log(typeof a === "number" && !Number.isNaN(a))
//console.log(Number.isFinite(a))

// if (!operation) {
//     return res.status(400).json({ error: "Operazione non consentita" });
// }

// result[metricReq] = operation(lista);

        // app.use(p.paths.checkF, (req, res, next)=>{
        //     if (!(campi.includes(req.body.field))){
        //         console.log(`Attributo '${req.body.field}' non presente nel dataset`);
        //         return res.status(400).json({error:`Attributo '${req.body.field}' non presente nel dataset`});
        //     } 
        //     next();
        // });

app.use(p.paths.groupDbBy, (req, res, next)=>{
    if (!(campi.includes(req.body.groupBy) & campi.includes(req.body.aggregatedField))){
        console.log(`Attributo non presente nel dataset`);
        return res.status(400).json({error:`Attributo non presente nel dataset`});
    } 
    next();
});

app.use(p.paths.groupDbBy, (req, res, next)=>{
    if (!(campi.includes(req.body.groupBy) & campi.includes(req.body.aggregatedField))){
        console.log(`Attributo non presente nel dataset`);
        return res.status(400).json({error:`Attributo non presente nel dataset`});
    } 
    next();
});

if (!(req.body.metric in opsNum || req.body.metric in opsAll )){
    console.log(`Operazione '${req.body.metric}' non consentita`);
    return res.status(400).json({ error: `Operazione '${req.body.metric}' non consentita` });
} else if (!lista.every(Number.isFinite) && req.body.metric in opsNum ){
    console.log(`Operazione '${req.body.metric}' non consentita su dati non numerici`);
    return res.status(400).json({ error: `Operazione '${req.body.metric}' non consentita su dati non numerici` });
};

if (!(req.body.metric in opsNum || req.body.metric in opsAll )){
    console.log(`Operazione '${req.body.metric}' non consentita`);
    return res.status(400).json({ error: `Operazione '${req.body.metric}' non consentita` });
} else if (!serverCache(req.body.aggregatedField).every(Number.isFinite) && req.body.metric in opsNum ){
    console.log(`Operazione '${req.body.metric}' non consentita su dati non numerici`);
    return res.status(400).json({ error: `Operazione '${req.body.metric}' non consentita su dati non numerici` });
};

// /**
//  * Funzione asincrona che invoca la funzione asincrona 'getFetch' per recuperare il contenuto completo del dataset.
//  * Visualizza su terminale il body del Response Object
//  */
// async function getDs(){
//     let resBody = await getFetch(serverAddress+p.paths.getDb);
//     console.log(resBody);
// }

// /**
//  * Funzione asincrona che invoca la funzione asincrona 'getFetch' per ottenere la lista di tutte le proprietà del dataset.
//  * Visualizza su terminale il body del Response Object
//  */
// async function getPr(){
//     let resBody = await getFetch(serverAddress+p.paths.getProp);
//     console.log(resBody);
// }
                