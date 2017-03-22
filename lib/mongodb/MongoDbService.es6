"use strict";

import {MongoClient} from "mongodb";
import Q from "q";

export class MongoDbService {

  constructor({config}) {
    if (!config || !config.mongoDb.connectionString) {
      throw new Error("MongoDB connection string not available");
    }

    /** @member {string} Connection string to database. */
    this.connectionString_ = config.mongoDb.connectionString;

    /** @member {Object} Options object to pass to the driver connect method. */
    this.connectionOptions_ = config.mongoDb.connectionOptions;

    /** @member {string} Operation timeout in ms. */
    this.operationTimeout_ = config.mongoDb.operationTimeout;

    /** @member {Q.Promise} Promise which represents the db connection and resolves to the db controller object. */
    this.dbConnection_ = this.connectToDB();
  }

  /**
   * Create connection to the mongodb database.
   * @private
   * @returns {Q.Promise} A promise which resolves the connection to the mongodb client.
   */
  connectToDB() {
    console.log("Connecting to db with options: ", this.connectionString_);
    this.dbConnection_ = Q.ninvoke(MongoClient, "connect", this.connectionString_, this.connectionOptions_);
    return this.dbConnection_;
  }

  /**
   * function for creating the mongodb object.
   * @returns {object} mongodb object after creating the connection.
   */
  getMongoDBObject() {

    return this.dbConnection_
      .catch(err => {
        console.log(" MongoDB connection is not available");
        console.log(err.message);
        return this.connectToDB();
      })
      .then(dbConn => {
        return dbConn;
      });
  }

  /**
   *@param {object} query read query
   *@returns {object} returns promise for read query
   */
  readQuery(query) {

    return {
      "fields": query.fields || {},
      "limit": query.limit || 0,
      "skip": query.skip || 0,
      "sort": query.sort || {}
    };
  }

  /**
   *@param {string} collection collection to be used for query
   *@param {object} query query object which contains body(filter query), fields, limit, skip, sort fields
   *@returns {Q.Promise} returns promise for read query
   */
  read({collection, query}) {

    let options = [];

    options.push(query.body);
    options.push(this.readQuery(query));

    return this.getMongoDBObject()
      .then(db => {
        return Q.npost(
          db.collection(collection), "find", options
        )
          .then(cursor => {
            return Q.ninvoke(cursor, "toArray"
            )
              .then(results => {
                return results;
              });
          });
      });
  }

  static idSwap(obj) {

    let swappedObj = Object.create(Reflect.getPrototypeOf(obj));

    /* eslint-disable prefer-reflect */
    for (let propKey of Object.getOwnPropertyNames(obj)) {
      /* eslint-enable prefer-reflect */

      let descriptor = Reflect.getOwnPropertyDescriptor(obj, propKey);

      switch (propKey) {
        case "id":
          Reflect.defineProperty(swappedObj, "_id", descriptor);
          break;
        case "_id":
          Reflect.defineProperty(swappedObj, "id", descriptor);
          break;
        default:
          Reflect.defineProperty(swappedObj, propKey, descriptor);
      }
    }

    return swappedObj;
  }

  /**
   *
   * @param {string} collection name.
   * @param {object} object to be inserted into the collections
   * @returns {Q.Promise} returns promise for insertion
   */

  save({collection, document}) {
    return this.getMongoDBObject()
      .then(db => {
        let docToSave = MongoDbService.idSwap(document);

        return Q.ninvoke(db.collection(collection), "save", docToSave);
      });
  }
}
