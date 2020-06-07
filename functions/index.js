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
app.get("/products", async (req, res)=>{

    try{
        const products = [];
        const allProducts = await db.collection("products").get();

        for(const doc of allProducts.docs){
            let productToAdd = {
                id: doc.id,
                code: doc.data().code,
                name: doc.data().name,
                description: doc.data().description,
                image: doc.data().image,
                stock: doc.data().stock,
                price: doc.data().price
            }
            products.push(productToAdd);
        }
        res.status(200).json({products});
    }catch(err){
        res.status(500).json({
            message: `Ha ocurido un error listando los productos: ${err}`
        });
    }    
});


app.get("/product/:id", async (req, res)=>{
    const docId = req.params.id;

    try{
        let product = [];
        const productGet = await db.collection("products").doc(docId).get()        
        let productToAdd = {
            id: productGet.id,
            code: productGet.data().code,
            name: productGet.data().name,
            description: productGet.data().description,
            image: productGet.data().image,
            stock: productGet.data().stock,
            price: productGet.data().price
        }
        product.push(productToAdd);
    
        res.status(200).json({product});

    }catch(err){
        res.status(500).json({
            message: `Ha ocurido un error listando el producto o el producto no existe: ${err}`
        });
    }

});


app.post("/save",async (req, res)=>{
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
        res.status(201).json({product});
    }catch(err){
        res.status(500).json({
            message: `Ha ocurido un error: ${err}`
        });
    }
});


app.put("/update/:id", async (req, res)=>{
    const docId = req.params.id;
    const product = req.body;

    try{
        let productUpdate = db.collection('products').doc(docId);

        let setProduct = productUpdate.set({
        'code': product.code,
        'name': product.name,
        'description': product.description,
        'image': product.image,
        'stock': product.stock,
        'price': product.price
        });

        res.status(200).json({
            message: "Product updated successfully!"
        });

    }catch(err){
        res.status(500).json({
            message: `Ha ocurido un error: ${err}`
        });
    }

});


app.delete("/delete/:id", async (req, res)=>{
    const docId = req.params.id;
    try{
        let deleteDoc = db.collection("products").doc(docId).delete()

        res.status(200).json({
            message: "Product deleted successfully!"
        })
    }catch(err){
        res.status(500).json({
            message: `Ha ocurido un error borrando el producto: ${err}`
        });
    }
    
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.api = functions.https.onRequest(app);
