const RandomizationDAO = require('../models/RandomizationDAO');

module.exports = {
    async createTable(body){
        var dados = {
            participants: body.participants,
            blocSize: body.blocSize,
            groups: body.groups
        };

        if (dados.participants % dados.blocSize !== 0){
            return "dados invalidos"
        }

        if (dados.groups.length > dados.blocSize){
            return "dados invalidos 2"
        }

        let randomDocs = [];
        for (let i=0;i<dados.participants;i++){
            randomDocs.push({
                group:null,
                position:null
            })
        }

        return RandomizationDAO.createTable(randomDocs)
    }
};
