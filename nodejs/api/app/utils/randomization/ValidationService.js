const mongoose = require('mongoose');
module.exports = function (application) {
  const Response = application.app.utils.Response;
  return {
    validateTableParameters(constructionParameters) {
      let msg;

      if (constructionParameters.participants === 0 || constructionParameters.participants % constructionParameters.blocSize !== 0) {
        msg = "The total number of participants must be divisible by the size of the block"
      } else {
        let totalGroupsParticipants = 0;
        constructionParameters.groups.forEach(group => {
          totalGroupsParticipants += group.size
        });
        if (totalGroupsParticipants !== constructionParameters.blocSize) {
          msg = "The total number of participants in the groups must be equal to blockSize"
        }
      }

      if (msg) {
        throw Response.notAcceptable({message: msg})
      }
    },
    validateRandomization(randomizationParameters) {
      let requiredFieldsNotFound = [];
      if (!randomizationParameters.randomizationType) requiredFieldsNotFound.push("randomizationType");
      if (!randomizationParameters.ownerId) requiredFieldsNotFound.push("ownerId");

      if (requiredFieldsNotFound.length > 0) {
        throw Response.notAcceptable({data: "The fields (" + requiredFieldsNotFound.join(",") + ") are required"})
      }

      try {
        mongoose.Types.ObjectId(randomizationParameters.ownerId)
      } catch (e) {
        throw Response.notAcceptable({data: "Invalid ownerId"});
      }

      let validator = this[randomizationParameters.randomizationType];

      return new Promise(async function (resolve, reject) {
        if (!validator) {
          reject(Response.notAcceptable({data: "Invalid randomization type"}));
          return;
        }

        try {
          await validator(randomizationParameters);
          resolve(randomizationParameters);
        } catch (err) {
          reject(err);
        }
      })
    },
    blockRandomization(parameters) {
      return new Promise(function (resolve, reject) {
        let requiredFieldsNotFound = [];
        if(parameters.constructionParameters) {
          if (parameters.constructionParameters.participants === undefined) requiredFieldsNotFound.push("constructionParameters.participants");
          if (parameters.constructionParameters.blocSize === undefined) requiredFieldsNotFound.push("constructionParameters.blocSize");
          if (parameters.constructionParameters.groups === undefined) requiredFieldsNotFound.push("constructionParameters.groups");
        } else {
          requiredFieldsNotFound.push("constructionParameters.participants");
          requiredFieldsNotFound.push("constructionParameters.blocSize");
          requiredFieldsNotFound.push("constructionParameters.groups");
        }
        if (parameters.projectName === undefined) requiredFieldsNotFound.push("projectName");
        if (parameters.tableName === undefined) requiredFieldsNotFound.push("tableName");

        if (requiredFieldsNotFound.length > 0) {
          reject(Response.notAcceptable({data: "The fields (" + requiredFieldsNotFound.join(",") + ") are required"}));
        }

        resolve(parameters)
      });
    },
    stratifiedRandomization(parameters) {
      return new Promise(function (resolve, reject) {
        let requiredFieldsNotFound = [];
        if (parameters.projectName === undefined) requiredFieldsNotFound.push("projectName");
        if (parameters.tables === undefined) requiredFieldsNotFound.push("tables");
        if (parameters.singleTableConfiguration === undefined) requiredFieldsNotFound.push("singleTableConfiguration");

        if (requiredFieldsNotFound.length > 0) {
          reject(Response.notAcceptable({data: "The fields (" + requiredFieldsNotFound.join(",") + ") are required"}));
          return;
        }

        if (!(parameters.tables instanceof Array) || (parameters.tables.length < 1)) {
          reject(Response.notAcceptable({data: "The (tables) Field must be an array of the needed strata"}));
          return;
        }

        let invalidConstructionParameters = false;
        if (parameters.singleTableConfiguration){
          if(parameters.tables[0].constructionParameters !== undefined) {
            if (parameters.tables[0].constructionParameters.participants === undefined) invalidConstructionParameters = true;
            if (parameters.tables[0].constructionParameters.blocSize === undefined) invalidConstructionParameters = true;
            if (parameters.tables[0].constructionParameters.groups === undefined) invalidConstructionParameters = true;
          } else {
            invalidConstructionParameters = true
          }

          if (invalidConstructionParameters){
            reject(Response.notAcceptable({data: "The fist table need to hold the construction parameter of all the tables, {participants,blocSize,groups} under the field 'constructionParameters'"}));
            return;
          }
        } else {
          let tablesLength = parameters.tables.length;
          for (let i = 0; i<tablesLength; i++){
            if(parameters.tables[i].constructionParameters !== undefined) {
              if (parameters.tables[i].constructionParameters.participants === undefined) invalidConstructionParameters = true;
              if (parameters.tables[i].constructionParameters.blocSize === undefined) invalidConstructionParameters = true;
              if (parameters.tables[i].constructionParameters.groups === undefined) invalidConstructionParameters = true;
            } else {
              invalidConstructionParameters = true
            }

            if (invalidConstructionParameters){
              reject(Response.notAcceptable({data: "All the tables need their respective construction parameter {participants,blockSize,groups} under the field 'constructionParameters'"}));
              return;
            }
          }
        }

        parameters.tables.forEach(table=>{
          if (table.name === undefined) reject(Response.notAcceptable({data: "the field 'name' is required fo all the tables"}));
        });


        resolve(parameters)
      });
    },
  };
};

