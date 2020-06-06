const functions = require('firebase-functions');
const express = require('express');
// for connections in and out
const cors = require('cors')({origin:true});

const app = express();

//middlewars
app.use(cors);
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// import admin for firebase
const admin = require('firebase-admin');
//config init
admin.initializeApp(functions.config().firebase);
//instance of firestore
let db = admin.firestore();
//


//endpoints api express

app.post("/create",async (req, res)=>{
    const product = req.body;
    try{
        await db.collection("products").add({
            code: product.code,
            name: product.name,
            description: product.description,
            image: product.image,
            stock: product.stock,
            price: product.price
        });
        res.status(201).json({        
            message: "Product Added successfully!",
            product: product
        });
    }catch(err){
        res.status(500).json({
            message: `Ha ocurido un error: ${err}`
        });
    }
});









// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.api = functions.https.onRequest(app);
