let express=require("express");
let app=express();
let bodyparser=require("body-parser");
app.use(bodyparser.json())
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
    );
    next();
});
var port=process.env.PORT||2410;
let {shops,purchases,products}=require("./appData.js");
app.get("/shops",function(req,res){
let arr=shops;
    res.send(arr);
    });
    
     app.post("/shops",function(req,res){
                    let body={...req.body};
                    let newshop={shopid:shops.length+1,...body};
                                shops.push(newshop);
                                res.send(newshop);
                                
                });
                app.get("/products",function(req,res){
                    let arr=products;
                        res.send(arr);
                        });
            app.post("/products",function(req,res){
                            let body={...req.body};
                            let newprod={productid:products.length+1,...body};
                                        products.push(newprod);
                                        res.send(newprod);
                                        
                        });
                        app.put("/product/:editid",function(req,res){
                            let id=+req.params.editid;
                            let product=req.body;
                            let index=products.findIndex((n)=>n.productid===id);
                            console.log(index);
                            if(index>=0){
                                let updated={productid:id,...product};
                                products[index]=updated;
                                console.log(updated);
                                res.send(updated);
                            }
                            else res.status(404).send("Not found");
                        })
                        app.get("/purchases",function(req,res){
                            let shop=req.query.shop;
                            let product=req.query.product;
                            let sort=req.query.sort;
                          let arr=purchases;
                            if(shop){
                             let id=+shop.slice(2);
                             console.log("new id",id);
                            let selShop=shops.find(n=>n.shopid===id);
                             console.log(selShop);
                              arr=arr.filter((m)=>m.shopid===selShop.shopid);
                            }
                            if(product){
                              let productIds = product
                              .split(',')
                              .map(product => product.replace('pr', ''))
                              .map(product => parseInt(product));
                          
                            arr = arr.filter(purchase =>
                              productIds.includes(purchase.productid)
                            );
                          }
                            if(sort==="QtyAsc"){
                             arr=arr.sort((a,b)=>a.quantity-b.quantity);
    
                            }
                            if(sort==="QtyDesc"){
                                arr=arr.sort((a,b)=>b.quantity-a.quantity);
       
                               }
                               if(sort==="ValueAsc"){
                                arr=arr.sort((a,b)=>(a.quantity*a.price)-(b.quantity*b.price));
       
                               }
                               if(sort==="ValueDesc"){
                                arr=arr.sort((a,b)=>(b.quantity*b.price)-(a.quantity*a.price));
       
                               }
   
                                res.send(arr);
                                });
                            
                                app.get("/shop/:shopid",function(req,res){
                                    let id=+req.params.shopid;
                                    let arr=purchases.filter(n=>n.shopid===id);
                                        res.send(arr);
                                        });
                                        app.get("/prod/:productid",function(req,res){
                                            let id=+req.params.productid;
                                            let prod=products.find(n=>n.productid===id);
                                                res.send(prod);
                                                });

                                        app.get("/product/:productid",function(req,res){
                                            let id=+req.params.productid;
                                            let arr=purchases.filter(n=>n.productid===id);
                                                res.send(arr);
                                                });
                                                app.post("/purchases",function(req,res){
                                                    let body={...req.body};
                                                    let newpur={purchaseid:purchases.length+1,...body};
                                                                products.push(newpur);
                                                                res.send(newpur);
                                                                
                                                });

                                                app.get("/totalPurchase/shop/:sid",function(req,res){
                                                    let id=+req.params.sid;
                                                    let arr=purchases.filter(n=>n.shopid===id);
                                                    const countById = arr.reduce((countMap, obj) => {
                                                        const { productid } = obj;
                                                        countMap[productid] = (countMap[productid] || 0) + 1;
                                                        return countMap;
                                                      }, {});
                                                      let arrWithCount = arr.map((obj) => {
                                                        const { productid } = obj;
                                                        return {
                                                          ...obj,
                                                          count: countById[productid],
                                                        };
                                                      });
                                                      arrWithCount = arrWithCount.reduce((acc, curr) => {
                                                        const {purchaseid,shopid, productid, quantity, count,price } = curr;
                                                        if (!acc[productid]) {
                                                            acc[productid] = {
                                                               purchaseid:purchaseid,
                                                               shopid:shopid,
                                                               productid:productid,
                                                               quantity: quantity,
                                                               price: quantity * price,
                                                               count:count
                                                            };
                                                        } else {
                                                            acc[productid].quantity += quantity;
                                                            acc[productid].price += quantity * price;
                                                        }
                                                        return acc;
                                                    }, []);  
                                                     res.send(arrWithCount);
                                                        });
                                                app.get("/total/product/:pid",function(req,res){
                                                            let id=+req.params.pid;
                                                            let arr=purchases.filter(n=>n.productid===id);
                                                            const countById = arr.reduce((countMap, obj) => {
                                                                const { shopid } = obj;
                                                                countMap[shopid] = (countMap[shopid] || 0) + 1;
                                                                return countMap;
                                                              }, {});
                                                              let arrWithCount = arr.map((obj) => {
                                                                const { shopid } = obj;
                                                                return {
                                                                  ...obj, 
                                                                  count: countById[shopid], 
                                                                };
                                                              });
                                                              arrWithCount = arrWithCount.reduce((acc, curr) => {
                                                                const {purchaseid,shopid, productid, quantity, count,price } = curr;
                                                                if (!acc[shopid]) {
                                                                    acc[shopid] = {
                                                                       purchaseid:purchaseid,
                                                                       shopid:shopid,
                                                                       productid:productid,
                                                                       quantity: quantity,
                                                                       price: quantity * price,
                                                                       count:count
                                                                    };

                                                                    acc[shopid].quantity += quantity;
                                                                    acc[shopid].price += quantity * price;
                                                                }
                                                                return acc;
                                                            }, []);  
                                                             res.send(arrWithCount);
                                                                                     });                        
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));
