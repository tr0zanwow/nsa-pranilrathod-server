'use strict';

const expenditure_raw = require("./raw-data/expenditure.json");
const income_raw = require("./raw-data/income.json");
const locality_raw = require("./raw-data/locality.json");
const pincode_raw = require("./raw-data/pincode.json");
const typeDefs = require("./schema.js");
const { ApolloServer } = require('apollo-server-lambda');

const resolvers = {
	Query: {
		getCoordinates: () => {
			pincode_raw.features.push(...locality_raw.features);
			return pincode_raw;
		},

		searchData: (_, args) => {
      if(args.pincode != null && args.locality == null){

        var foundPincodeData = pincode_raw.features.find(function(pincode, index) {
          if(pincode.attributes.pincode == args.pincode)
            return true;
        });

        var foundExpenditure = expenditure_raw.find(function(expenditure, index) {
          if(expenditure.pincode == args.pincode)
            return true;
        });

        const pin_exp_combinedData = {
          ...foundPincodeData.attributes,
          ...foundExpenditure
        }

        return pin_exp_combinedData

      }
      else if(args.locality != null && args.pincode == null){
        
        var foundLocalityData = locality_raw.features.find(function(locality, index) {
          if(locality.attributes.locality == args.locality)
            return true;
        });

        var foundIncome = income_raw.find(function(income, index) {
          if(income.locality == args.locality)
            return true;
        });

        const loc_inc_combinedData = {
          ...foundLocalityData.attributes,
          ...foundIncome
        }
        
        return loc_inc_combinedData

      }
      else if(args.locality != null && args.pincode != null){
        return "Enter either locality or pincode"
      }
    }
	}
};

const server = new ApolloServer({ 
  typeDefs,
	resolvers,
	introspection: true,
  playground: {
    endpoint: '/dev/graphql'
  } 
});

exports.graphqlHandler = server.createHandler();