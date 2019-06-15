module.exports = function (application) {
    return{
        async createTable(projectName, participants, blocSize, randomizationTableGroups) {
            const RandomizationService = application.app.services.RandomizationService;
            return await RandomizationService.createTable(projectName, participants, blocSize, randomizationTableGroups).then(tableID=>{
                return tableID;
            }).catch(err=>{
                throw err;
            });
        }
    };
};
