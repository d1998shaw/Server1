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
                            let selShop=shops.find(n=>n.name===shop);
                             console.log(selShop);
                               arr=arr.filter((m)=>m.shopid===selShop.shopid);
                        
                            }
                            if(product){
                                let selProd=products.find(n=>n.productname===product);
                                arr=arr.filter((m)=>selProd.productid===m.productid);
                                
                                
                        
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
                                                      res.send(countById);
                                                        });
                                                app.get("/total/product/:pid",function(req,res){
                                                            let id=+req.params.pid;
                                                            let arr=purchases.filter(n=>n.productid===id);
                                                            const countById = arr.reduce((countMap, obj) => {
                                                                const { shopid } = obj;
                                                                countMap[shopid] = (countMap[shopid] || 0) + 1;
                                                                return countMap;
                                                              }, {});
                                                              res.send(countById);
                                                                        });                        
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));
