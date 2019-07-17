module.exports = function (application) {
    const RandomizationService = application.app.services.RandomizationService;
    const ValidationService = application.app.utils.randomization.ValidationService;
    return{
        createProjectRandomization(randomizationParameters) {
          return RandomizationService[randomizationParameters.randomizationType](randomizationParameters)
        },
        getProjectRandomizationList(ownerId) {
          return RandomizationService.getProjectRandomizationList(ownerId)
        },
        async randomizeElement(identification, tableId) {
            return await RandomizationService.randomizeElement(identification, tableId).then(result=>{
                return result;
            }).catch(err=>{
                throw err;
            });
        },
        async getElementGroup(identification, tableId) {
            return await RandomizationService.getElementGroup(identification, tableId).then(result=>{
                return result;
            }).catch(err=>{
                throw err;
            });
        }
    };
};
