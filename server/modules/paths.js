
/**
 * Oggetto con tutti gli endpoint utilizzati
 */
const paths = Object.freeze({
    localhost: "http://localhost:",
    getDb: "/dataset",
    getProp: "/properties",
    checkBody: "/data",
    checkField: "/data/statistics",
    postMod: "/data/statistics/modality",
    postDescr: "/data/statistics/descriptive",
    groupDbBy: "/data/group"   
});

module.exports={paths};
