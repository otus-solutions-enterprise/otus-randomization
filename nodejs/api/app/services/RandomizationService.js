const mongoose = require('mongoose');
const RandomizationTableModel = mongoose.model('randomization-table');
const RandomizationTableElementModel = mongoose.model('randomization-table-element');

module.exports = function (application){
    const Response = application.app.utils.Response;
    const Math = application.app.services.Math;
    return {
        validateTableParameters(participants, blocSize, groups){

            let msg;

            if (participants % blocSize !== 0){
                msg = "The total number of participants must be divisible by the size of the block"
            } else {
                let totalGroupsParticipants=0;
                groups.forEach(group => {
                    totalGroupsParticipants += group.size
                });
                if(totalGroupsParticipants !== blocSize){
                    msg = "The total number of participants in the groups must be equal to blockSize"
                }
            }

            if(msg){
                throw Response.notAcceptable({message:msg})
            }
        },
        async createTable(projectName, participants, blocSize, randomizationTableGroups){
            await this.validateTableParameters(participants, blocSize, randomizationTableGroups);
            let RandomizationTable = new RandomizationTableModel({name:projectName,participants:participants, blocSize:blocSize, groups:randomizationTableGroups});
            return await RandomizationTable.save().then(saveResult=>{
                let tableId = saveResult._doc._id;
                return this.createTableElements(tableId,participants, blocSize, randomizationTableGroups);
            }).catch((err)=>{
                throw Response.internalServerError({message:"Please contact support"})
            })
        },
        async createTableElements(tableId, participants, blocSize, randomizationTableGroups){
            let forLength = (participants/blocSize);
            let groups = [];
            for(let i=0;i<forLength;i++){
                let randomDocuments = [];
                for (let i=0;i<blocSize;i++){
                    randomDocuments.push({
                        tableId: tableId,
                        objectType: "RandomizationTableElement",
                        elementOid:null,
                        group:null,
                        position:null
                    })
                }
                let groupRandomization = {
                    needToRandomize: Array.from(Array(randomDocuments.length).keys()),
                    randomDocuments: randomDocuments
                };
                randomizationTableGroups.forEach(group=>{
                    groupRandomization = randomizeBloc(group,groupRandomization);
                });
                groups.push(groupRandomization.randomDocuments);
            }
            let randomDocs = [];

            let randomizedGroups = [];
            let groupsForSize = groups.length;
            for(let j=0;j<groupsForSize;j++){
                let chosenPosition = Math.getRandomInt(0,groups.length);
                randomizedGroups.push(groups[chosenPosition]);
                groups.splice(chosenPosition, 1);
            }

            let positionCount = 1;
            randomizedGroups.forEach(randomizedGroup => {
                randomizedGroup.forEach(randomizedElement => {
                    randomizedElement.position = positionCount;
                    randomDocs.push(randomizedElement);
                    positionCount++;
                })
            });

            return await RandomizationTableElementModel.createTableElements(randomDocs).then(()=>{
                return Response.success({tableId: tableId.toString()});
            }).catch(()=>{
                throw Response.internalServerError({message:"Please contact support"})
            })
        },
        async randomizeElement(elementId, tableId){
            return await RandomizationTableElementModel.getExistsGroup(elementId, tableId).then( response => {
                if(!response){
                    return RandomizationTableElementModel.findNotRandomized(tableId, elementId).then(result => {
                        if(result){
                            result.set("elementOid",elementId);
                            result.save();
                            return {Identification:result.elementOid,Group:result.group}
                        }
                        throw Response.notFound({message:"Table not found"})
                    }).catch(err => {
                        throw Response.internalServerError({message:"Please contact support"})
                    })
                } else {
                    return response;
                }
            });

        },
        async getGroupParticipant(elementId, tableId){
            return await RandomizationTableElementModel.getExistsGroup(tableId, elementId).then(result => {
                if(result){
                    return Response.success({Identification:result.elementOid,Group:result.group})
                }
                throw Response.notFound({message:"Group not found"})
            }).catch(err => {
                if (err.body){
                    throw err
                }
                throw Response.internalServerError({message:"Please contact support"})
            })
        }
    };

    function randomizeBloc(group,groupRandomization){
        let groupSize = group.size;
        for(let i=0;i < groupSize;i++){
            let chosenPosition = groupRandomization.needToRandomize[Math.getRandomInt(0,groupRandomization.needToRandomize.length)];
            groupRandomization.randomDocuments[chosenPosition].group = group.name;
            groupRandomization.needToRandomize.splice(groupRandomization.needToRandomize.indexOf(chosenPosition),1);
        }
        return groupRandomization;
    }
};

