module.exports = function (application) {
    return{
        async createTable(projectName, participants, blocSize, randomizationTableGroups) {
            const RandomizationService = application.app.services.RandomizationService;
            return await RandomizationService.createTable(projectName, participants, blocSize, randomizationTableGroups).then(tableID=>{
                return tableID;
            }).catch(err=>{
                throw err;
            });
        },
        async randomizeElement(elementId, tableId) {
            const RandomizationService = application.app.services.RandomizationService;
            return await RandomizationService.randomizeElement(elementId, tableId).then(elementGroup=>{
                return {elementId:elementId,elementGroup:elementGroup};
            }).catch(err=>{
                throw err;
            });
        }
    };
};
