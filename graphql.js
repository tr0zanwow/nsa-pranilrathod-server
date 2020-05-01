'use strict';

var expenditure_raw = require("./raw-data/expenditure.json");
var income_raw = require("./raw-data/income.json");
var locality_raw = require("./raw-data/locality.json");
var pincode_raw = require("./raw-data/pincode.json");
var typeDefs = require("./schema.js");
var { ApolloServer } = require('apollo-server-lambda');

var resolvers = {
	Query: {
		getCoordinates: () => {
      var combinedData = []
      combinedData.push(...pincode_raw.features)
      combinedData.push(...locality_raw.features);
			return combinedData;
		},

		searchData: (_, args) => {
      if(args.pincode != null && args.locality == null){
        var foundPincodeData = null
        foundPincodeData = pincode_raw.features.find(function(pincode, index) {
          if(pincode.attributes.pincode == args.pincode)
            return true;
        });

        var foundExpenditure = null
        foundExpenditure = expenditure_raw.find(function(expenditure, index) {
          if(expenditure.pincode == args.pincode)
            return true;
        });

        var pin_exp_combinedData = null
        pin_exp_combinedData = {
          ...foundPincodeData.attributes,
          ...foundExpenditure
        }

        return pin_exp_combinedData

      }
      else if(args.locality != null && args.pincode == null){
        
        var foundLocalityData =  null
        foundLocalityData = locality_raw.features.find(function(locality, index) {
          if(locality.attributes.locality == args.locality)
            return true;
        });

        var foundIncome = null
        foundIncome = income_raw.find(function(income, index) {
          if(income.locality == args.locality)
            return true;
        });

        var loc_inc_combinedData = null
        loc_inc_combinedData = {
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

var server = new ApolloServer({ 
  typeDefs,
	resolvers,
	introspection: true,
  playground: {
    endpoint: '/dev/graphql'
  } 
});

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});