
/**
 * Oggetto con tutti i request body degli API endpoints
 */
const apiReqBody = Object.freeze({
    postMod: {"field": ""},
    postDescr: { "field": "", "metric": "" },
    groupDbBy: {"groupBy": "", "aggregatedField": "", "metric": ""}
});

module.exports={apiReqBody};
