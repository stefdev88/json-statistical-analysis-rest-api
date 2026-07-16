
const readline = require('readline-sync');
const u = require("./utils");

async function client(){
    console.log(`Il server espone 5 API endpoint per:
                - Ottenere il contenuto completo del dataset;
                - Ottenere tutte le proprietà del dataset;
                - Ottenere la lista di tutte le modalità di un campo del dataset;
                - Calcolare una metrica tra:
                    - somma, media, mediana, massimo, minimo, range (solo sui dati numerici)
                    - moda e restituire tutti i valori (per tutti i campi del dataset)
                    - distribuzione assoluta, relativa e percentuale per tutti i campi del dataset
                - Raggruppare per un campo e calcolare una metrica sui valori di un altro campo`);

    let enter;
    const metriche = "Metriche disponibili:\n'sum', 'mean', 'median', 'mode', 'max', 'min', 'range', 'allvalue', 'freqabs', 'freqrel', 'freqperc'";
    do{
        console.log("\nMenù");
        console.log("Premi 'a' per ottenere il dataset completo");
        console.log("Premi 'b' per ottenere l'elenco dei campi degli oggetti dataset");
        console.log("Premi 'c' per ottenere la lista di tutte le modalità di un campo del dataset");
        console.log("Premi 'd' per calcolare una metrica su un campo del dataset");
        console.log("Premi 'e' per raggruppare per un campo e calcolare una metrica sui valori di un altro campo");
        console.log("Premi il tasto 'Invio' per uscire dal programma");
        enter = readline.question("Scegli: ");
        console.log("");
        enter = enter.toLowerCase();
        try{
            switch (enter){
                case 'a':
                    await u.getDs();
                    break;
                case 'b':
                    await u.getPr();
                    break;
                case 'c':
                    await u.getMod();
                    break;
                case 'd':
                    console.log(metriche);
                    await u.getMetr();
                    break;
                case 'e':
                    console.log(metriche);
                    await u.getGroup();
                    break;
                case '':
                    console.log("Termine programma!");
                    break;
                default:
                    console.log("Attenzione! Carattere non consentito!")                
            }
        } catch (err){
            console.log(err.message);
        }
    } while (enter);
}
client().catch(er=>console.log(er.message));
