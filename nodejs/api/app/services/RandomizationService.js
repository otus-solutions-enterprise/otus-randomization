const RandomizationTableModel = require('mongoose').model('randomization-table');
const RandomizationTableElementModel = require('mongoose').model('randomization-table-element');

module.exports = function (application){
    const Errors = application.app.services.Errors;
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
                throw Errors.notAcceptable({message:msg})
            }
        },
        async createTable(projectName, participants, blocSize, randomizationTableGroups){
            await this.validateTableParameters(participants, blocSize, randomizationTableGroups);
            let RandomizationTable = new RandomizationTableModel({name:projectName});
            return await RandomizationTable.save().then(saveResult=>{
                let tableId = saveResult._doc._id;
                return this.createTableElements(tableId,participants, blocSize, randomizationTableGroups);
            }).catch((err)=>{
                throw Errors.internalServerError({message:"Please contact support"})
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
                        default: "RandomizationTableElement",
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
                return tableId.toString();
            }).catch(()=>{
                throw Errors.internalServerError({message:"Please contact support"})
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

