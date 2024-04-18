const {MongoClient} = require("mongodb");
const express = require("express");

const {config} = require("dotenv");

config();

async function createStudentDocument(collection){
    const StudentDocument ={
        name : "Jay",
        email: "jay@aum.edu"
    }
    await collection.insertOne(StudentDocument);
    console.log("A document is inserted");
}

async function updateStudentDocument(collection){
    const filter = { name: "Jay" };
    const updateDoc = {
        $set: {
          email: 'jayasimha@aum.edu'
        },
      };
      const options = { upsert: true };
      const result = await collection.updateOne(filter, updateDoc, options);
    
    // Print the number of matching and modified documents
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );
}

async function deleteStudentDocument(collection){
    const filter = { name: "Jay" };
    const result = await collection.deleteOne(filter);

    if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
}

async function findStudentDocument(collection){
    const filter = { name: "Jay" };
    const movie = await collection.findOne(filter);
    // Print the document returned by findOne()
    console.log(movie);
}



async function connectToCluster(uri){
    try{
        mongoClient = new MongoClient(uri);
        await mongoClient.connect();

        const db = mongoClient.db("website");
        const collection = db.collection("USER_LOGIN");
        console.log("connected in index");

        await createStudentDocument(collection);
        //
        //await updateStudentDocument(collection);

        //await deleteStudentDocument(collection);

        //await findStudentDocument(collection)
        
    }catch(error){
        console.log(error)
        console.log('mongodb+srv://jpotlapa:test123@cluster0.cumdisy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    }
}

connectToCluster('mongodb+srv://jpotlapa:test123@cluster0.cumdisy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')