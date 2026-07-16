
/**
 * Restituisce un array di tutti campi degli oggetti presenti nel dataset
 * @param {Object[]} db dataset da manipolare
 * @returns {string[]} array di tutti campi degli oggetti presenti nel dataset
 */
function getProperties(db){
    let set = new Set();
    db.forEach(el=>{
        for (let i in el){
            set.add(i);
        };
    });
    return [...set];        
}

/**
 * Funzione che crea un oggetto in cui chiavi e rispettivi valori sono ciascun elemento dell'array
 * ricevuto come argomento
 * @param {any[]} lista array di valori
 * @returns {Object<string, any>} 
 * oggetto con struttura {lista[0]:lista[0], lista[1]:lista[1], ecc }
 */
function createObj(lista){
    let obj = {};
    lista.forEach(el=>{
        obj[el] = el;
    });
    return obj;
}

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

/**
 * Elimina i duplicati da un array
 * @param {any[]} lista array di valori
 * @returns {any[]} array di elementi univoci
 */
function getUnique(lista){
    let set = new Set(lista);
    return [...set]
}    

/**
 * Restituisce la somma di tutti i valori di un array
 * @param {number[]} lista array di valori
 * @returns {number} valore della somma
 */
function sum(lista){
    return lista.reduce((acc, curr) => acc + curr, 0);
}

/**
 * Restituisce la media di tutti i valori di un array
 * @param {number[]} lista array di valori
 * @returns {number} valore della media
 */
function mean(lista){
    if (lista.length === 0) return 0;
    return (sum(lista)/lista.length);
}

/**
 * Restituisce la mediana di tutti i valori di un array di numeri.
 * 
 * Se la lunghezza dell'array è dispari, restituisce il valore centrale.
 * Se è pari, restituisce la media dei due valori centrali.
 * Usa la definizione matematica di mediana, adattata agli indici degli array che partono da 0
 * @param {number[]} lista array di valori
 * @returns {number} valore della mediana
 */
function median(lista){
    let sorted = [...lista].sort((a,b) => a-b); // non modifica la lista nella cache
    if (sorted.length % 2){
        return sorted[((sorted.length - 1) / 2)];
    }
    return (sorted[(sorted.length / 2)-1] + sorted[(sorted.length / 2)])/2;
}

/**
 * Restituisce, con type "string", la moda (modalità più frequente) o più mode di tutti i valori di un array
 * @param {any[]} lista array di valori
 * @returns {string[]} array di valore/i della moda
 */
function mode(lista){
    let freq = getFreqAbs(lista);
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

/**
 * Crea una funzione che applica un'operazione di confronto sui valori di un array di numeri, 
 * e che a sua volta restituisce il valore migliore secondo la logica fornita 
 * @param {(a: any, b: any) => boolean} logica - Funzione di confronto tra due valori
 * Restituisce true se il primo valore è da mantenere, false altrimenti
 * @returns {(a: any[]) => any} funzione che accetta come argomento un array e restituisce
 * il valore che soddisfa la condizione definita da logica
 */
function createSelector(logica){
    return (lista)=>lista.reduce((acc, value)=>logica(acc, value) ? acc : value);
}

/**
 * Rappresenta una funzione che accetta un array come argomento e restituisce il valore massimo degli elementi
 */
const max = createSelector((a, b) => a > b);

/**
 * Rappresenta una funzione che accetta un array come argomento e restituisce il valore minimo degli elementi
 */
const min = createSelector((a, b) => a < b);

/**
 * Calcola il range dei valori di un array di numeri
 * @param {number[]} lista Array di elementi di cui calcolare il range
 * @returns {number} valore del range
 */
function range(lista){
    return max(lista) - min(lista);
}

/**
 * Calcola la frequenza (assoluta, relativa o percentuale) per ogni modalità della proprietà selezionata
 * 
 * Accetta come argomento una funzione che rappresenta la logica per calcolare le frequenze
 * @param {(count: number, n: number) => number} tipologia - Una funzione che riceve:
 *   - count = frequenza assoluta della modalità
 *   - n = numero totale di elementi
 * @returns {(lista: any[]) => Object<string, number>}
 * Una funzione che accetta una lista e restituisce un oggetto con coppie { "modalità": frequenza }
 */
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

/**
 * Rappresenta una funzione che accetta una lista e calcola la frequenza assoluta degli elementi.
 * Restituisce un oggetto con coppie { "modalità": frequenza assoluta }
 */
const getFreqAbs = createFreq((count, n) => count);

/**
 * Rappresenta una funzione che accetta una lista e calcola la frequenza relativa degli elementi.
 * Restituisce un oggetto con coppie { "modalità": frequenza relativa }
 */
const getFreqRel = createFreq((count, n) => count / n);

/**
 * Rappresenta una funzione che accetta una lista e calcola la frequenza percentuale degli elementi.
 * Restituisce un oggetto con coppie { "modalità": frequenza percentuale }
 */
const getFreqPerc = createFreq((count, n) => Number(((count / n) * 100).toFixed(3)));
//const getFreqPerc = createFreq((count, n) => count / n * 100);

/**
 * Raggruppa un array di oggetti per un campo specifico e restituisce
 * una funzione per applicare operazioni sui gruppi.
 * Ogni gruppo mantiene una cache dei valori per campo, così da evitare
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
    let grouped = {}; // es. {"F":[{},{}, ecc], "M":[{},{}, ecc]}
    let cacheInt = {}; // es. {"F": Function , "M": Function}
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

/**
 * Funzione che accetta e restituisce un array.
 * Serve esclusivamente per ottenere senza manipolarli tutti gli elementi dell'array che utilizza la funzione restituita da groupDbByField, 
 * che accetta come argomento funzioni che manipolano array e restituisce il rusultato
 * @param {any[]} lista array
 * @returns {any[]} array non manipolato
 */
const getAllValue = lista => lista;

/**
 * Funzione che crea un oggetto Date e restituisce una stringa con il timestamp attuale formattato
 * @returns {string} timestamp attuale formattato
 */
function getDate(){
    const data = new Date(Date.now());
    const anno = data.getFullYear(); // number
    const mese = data.getMonth() + 1;
    const giorno = data.getDate();
    const ora = data.getHours();
    const min = data.getMinutes();
    const sec = data.getSeconds();
    const timestamp = giorno+"/"+mese+"/"+anno+"-"+ora+":"+min+":"+sec; // string
    return timestamp;
}
//Se uno dei due operandi del + è una stringa, l’altro viene convertito automaticamente in stringa.

module.exports={
    getProperties,
    createObj,
    cacheDbByFields,
    getAllValue,
    getUnique,
    sum,
    mean,
    median,
    mode,
    min,
    max,
    range,
    getFreqAbs,
    getFreqRel,
    getFreqPerc,
    groupDbByField,
    getDate
};
