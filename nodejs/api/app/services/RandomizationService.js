const mongoose = require('mongoose');
const ProjectRandomizationModel = mongoose.model('project-randomization');
const RandomizationTableModel = mongoose.model('randomization-table');
const RandomizationTableElementModel = mongoose.model('randomization-table-element');

module.exports = function (application) {
  const RandomizationValidationService = application.app.utils.randomization.ValidationService;
  const Response = application.app.utils.Response;
  const Math = application.app.utils.Math;
  return {
    async stratifiedRandomization(randomizationParameters) {
      let validTableConfigurations = new Promise(async function (resolve, reject) {
        let errors = [];

        if (randomizationParameters.singleTableConfiguration) {
          try {
            RandomizationValidationService.validateTableParameters(randomizationParameters.tables[0].constructionParameters);
          } catch (err) {
            errors.push({tableName: randomizationParameters.tables[0].tableName, error: err.body});
          }
        } else {
          randomizationParameters.tables.forEach(async table => {
            try {
              RandomizationValidationService.validateTableParameters(table.constructionParameters);
            } catch (err) {
              errors.push({tableName: table.tableName, error: err.body});
            }
          });
        }

        if (errors.length > 0) {
          reject(Response.notAcceptable(errors));
        } else {
          resolve();
        }
      });

      try {
        await validTableConfigurations;
        let projectRandomization = new ProjectRandomizationModel({
          ownerId: mongoose.Types.ObjectId(randomizationParameters.ownerId),
          randomizationType: randomizationParameters.randomizationType,
          name: randomizationParameters.projectName,
        });

        let createdTables = [];
        let promises = [];
        randomizationParameters.tables.forEach(async table => {
          let constructionParameters = randomizationParameters.singleTableConfiguration ? randomizationParameters.tables[0].constructionParameters : table.constructionParameters;
          let tableId = mongoose.Types.ObjectId();
          let randomizationTable = new RandomizationTableModel({
            name: table.name,
            tableId: tableId,
            constructionParameters: table.constructionParameters
          });
          createdTables.push({name: randomizationTable.name, tableId: randomizationTable.tableId});
          projectRandomization.tables.push(randomizationTable);
          promises.push(this.createTableElements(tableId, constructionParameters.participants, constructionParameters.blocSize, constructionParameters.groups));
        });
        promises.push(projectRandomization.save());
        await Promise.all(promises);
        return Response.success({ProjectName: projectRandomization.name, tables: createdTables});
      } catch (err) {
        throw err;
      }
    },
    async blockRandomization(randomizationParameters) {
      await RandomizationValidationService.validateTableParameters(randomizationParameters.constructionParameters);
      let tableId = mongoose.Types.ObjectId();
      try {

        let randomizationTable = new RandomizationTableModel({
          name: randomizationParameters.tableName,
          tableId: tableId,
          constructionParameters: randomizationParameters.constructionParameters
        });

        let projectRandomization = new ProjectRandomizationModel({
          ownerId: mongoose.Types.ObjectId(randomizationParameters.ownerId),
          randomizationType: randomizationParameters.randomizationType,
          name: randomizationParameters.projectName,
          tables: [randomizationTable]
        });

        await projectRandomization.save();
        await this.createTableElements(tableId, randomizationParameters.constructionParameters.participants, randomizationParameters.constructionParameters.blocSize, randomizationParameters.constructionParameters.groups);
        return Response.success({tableName: randomizationParameters.tableName, tableId: tableId});
      } catch (err) {
        throw err;
      }
    },
    async createTableElements(tableId, participants, blocSize, randomizationTableGroups) {
      return new Promise(async function (resolve, reject) {
        let forLength = (participants / blocSize);
        let groups = [];
        for (let i = 0; i < forLength; i++) {
          let randomDocuments = [];
          for (let i = 0; i < blocSize; i++) {
            randomDocuments.push({
              tableId: tableId,
              objectType: "RandomizationTableElement",
              identification: null,
              group: null,
              position: null
            })
          }
          let groupRandomization = {
            needToRandomize: Array.from(Array(randomDocuments.length).keys()),
            randomDocuments: randomDocuments
          };
          randomizationTableGroups.forEach(group => {
            groupRandomization = randomizeBloc(group, groupRandomization);
          });
          groups.push(groupRandomization.randomDocuments);
        }
        let randomDocs = [];

        let randomizedGroups = [];
        let groupsForSize = groups.length;
        for (let j = 0; j < groupsForSize; j++) {
          let chosenPosition = Math.getRandomInt(0, groups.length);
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

        try {
          await RandomizationTableElementModel.createTableElements(randomDocs);
          resolve();
        } catch (err) {
          console.log(err);
          reject(Response.internalServerError());
        }
      })
    },
    async randomizeElement(identification, tableId) {
      let elementRandomized = new Promise(async function (resolve, reject) {
        try {
          if (await RandomizationTableElementModel.tableExists(tableId)) {
            let randomizedElement = await RandomizationTableElementModel.getElementGroup(tableId, identification);
            if (!randomizedElement) {
              let newRandomizedElement = await RandomizationTableElementModel.findNotRandomized(tableId);
              if (newRandomizedElement.length === 1) {
                newRandomizedElement[0].set("identification", identification);
                newRandomizedElement[0].save();
                resolve(Response.success({
                  identification: newRandomizedElement[0].identification,
                  group: newRandomizedElement[0].group
                }));
              }
              reject(Response.notFound({message: "There is no more elements to be randomized"}))
            } else {
              resolve(Response.success({
                identification: randomizedElement.identification,
                group: randomizedElement.group
              }));
            }
          } else {
            reject(Response.notFound({message: "Table not found"}))
          }
        } catch (err) {
          console.log(err);
          reject(Response.internalServerError())
        }
      });
      return await elementRandomized
    },
    async getElementGroup(identification, tableId) {
      return await RandomizationTableElementModel.getElementGroup(tableId, identification).then(result => {
        if (result) {
          return Response.success({identification: result.identification, group: result.group})
        }
        throw Response.notFound("tableId or identification not found")
      }).catch(err => {
        if (err.body) {
          throw err
        }
        let errorMsg = err.message.replace(/ for model .+/, '');
        errorMsg = errorMsg.replace(/\"/gm, "");
        console.log(err);
        throw Response.internalServerError(errorMsg)
      })
    }
  };

  function randomizeBloc(group, groupRandomization) {
    let groupSize = group.size;
    for (let i = 0; i < groupSize; i++) {
      let chosenPosition = groupRandomization.needToRandomize[Math.getRandomInt(0, groupRandomization.needToRandomize.length)];
      groupRandomization.randomDocuments[chosenPosition].group = group.name;
      groupRandomization.needToRandomize.splice(groupRandomization.needToRandomize.indexOf(chosenPosition), 1);
    }
    return groupRandomization;
  }
};

