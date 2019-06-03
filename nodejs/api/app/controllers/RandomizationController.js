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
                randomDocuments = randomizeBloc(group,randomDocuments);
            });
            groups.push(randomDocuments)
        }

        let randomizedGroups = [];
        let groupsForSize = groups.length;
        for(let j=0;j<groupsForSize;j++){
            let chosenPosition = getRandomInt(0,groups.length);
            randomizedGroups.push(groups[chosenPosition]);
            groups.splice(chosenPosition, 1);
        }

        let positionCount = 1;
        randomizedGroups.forEach(randomizedGroup => {
            randomizedGroup.forEach(randomizedElement => {
                randomizedElement.position = positionCount;
                positionCount++;
            })
        });

        return res.json(randomizedGroups);
    }
};

function randomizeBloc(group,randomDocuments,needToRandomize){
    needToRandomize = needToRandomize ? needToRandomize : group.size;
    let forSize = needToRandomize;
    for(let i=0;i < forSize;i++){
        let chosenPosition = getRandomInt(0,randomDocuments.length);
        if (randomDocuments[chosenPosition].group === null){
            randomDocuments[chosenPosition].group = group.name;
            needToRandomize--;
        } else {
            return randomizeBloc(group,randomDocuments,needToRandomize)
        }
    }
    return randomDocuments;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}