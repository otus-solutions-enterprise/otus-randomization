const mongoose = require('mongoose');

module.exports = {
    async createTable(aplication, req, res){
        const RandomizationModel = mongoose.model('randomization-table');
        var dados = {
            participants: req.body.participants,
            blocSize: req.body.blocSize,
            groups: req.body.groups
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
                recruitmentNumber:null,
                group:null,
                position:null
            })
        }

        RandomizationModel.createTable(randomDocs);

        let forLength = (dados.participants/dados.blocSize);
        let groups = [];
        for(let i=0;i<forLength;i++){
            let randomDocuments = await RandomizationModel.fetchBloc(dados.blocSize);
            console.log(randomDocuments);
            dados.groups.forEach(group=>{
                randomDocuments = ranmdomizeBloc(group,randomDocuments);
            });
            groups.push(randomDocuments)
        }

        return res.json(groups);
    }
};

function ranmdomizeBloc(group,randomDocuments,needToRandomize){
    needToRandomize = needToRandomize ? needToRandomize : group.size;
    let forSize = needToRandomize;
    for(let i=0;i < forSize;i++){
        let chosenPosition = getRandomInt(0,randomDocuments.length);
        if (randomDocuments[chosenPosition].group === null){
            randomDocuments[chosenPosition].group = group.name;
            needToRandomize--;
        } else {
            ranmdomizeBloc(group,randomDocuments,needToRandomize)
        }
    }
    return randomDocuments;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}