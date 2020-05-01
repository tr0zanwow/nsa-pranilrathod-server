const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query { 
      getCoordinates: Coordinates
      searchData(pincode: Int,locality: String): combinedData
      }

    type Coordinates {
      features: [coordinatesListType]
    }

    type coordinatesListType {
      attributes: attributesType,
      geometry: geometryType
    }

    type attributesType{
      district_c: String
      district_n: String
      city: String
      pincode: Int
      locality: String
      locality_i: Int
      state_name: String
      population: Int
      households: Int
    }

    type combinedData{
      population: Int,
      households: Int
      district_n: String
      state_name: String
      other: Float
      house: Float
      food: Float
      apparel: Float
      teansport: Float
      health: Float
      finance: Float
      education: Float
      entertainment: Float
      city: String
      income: Float
    }

    type geometryType{
      rings: [[[Float]]]
    }

    schema {
      query: Query
}
  `;

  module.exports = typeDefs;