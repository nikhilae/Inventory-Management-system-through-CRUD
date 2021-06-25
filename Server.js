const express=require("express")
const app=express()
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient

var db;
var s;
MongoClient.connect('mongodb://localhost:27017/Shopping',function(err,database)
{
    if(err) return console.log(err)
    db=database.db('Shopping')
    app.listen(5000,() => {
        console.log("Listening at port number 5000")
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/',(req,res)=>{
    db.collection('Shoes').find().toArray((err,result)=>{
        if(err)
        return console.log(err)
        res.render('homepage.ejs',{data:result})
    })
})

app.get('/create',(req,res)=>
{
    res.render('add.ejs')
})

app.get('/updatestock',(req,res)=>
{
    res.render('update.ejs')
})
/*app.post('/deleteproduct',(req,res)=>
{
    res.render('delete.ejs')
})*/

app.post("/AddData",(req,res)=>{
    db.collection('Shoes').save(req.body,(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})
app.post('/update',(req,res)=>{
    db.collection('Shoes').find().toArray((err,result) =>{
        console.log("1")

        if(err) return console.log(err)
        for(var i=0;i<result.length;i++)
        {
            if(result[i].pid==req.body.pid)
            {   
                console.log(req.body.pid)
                s=result[i].stock
                break
            }
        }
        db.collection('Shoes').findOneAndUpdate({pid:req.body.pid},{
            
            $set: {stock: (parseInt(s) + parseInt(req.body.stock))+""}},{sort: {_id: -1}},
            (err,result)=>{
                if(err)
                return res.send(err)
                console.log(req.body.pid+' stock updated')
                
            })
        })

    })
    app.post('/delete', (req,res)=>{
        db.collection('Shoes').findOneAndDelete({pid: req.body.pid}, (err,result)=>{
          if(err) return console.log(err)
          res.redirect('/')
        })
    })
   /* app.post("/deleteproduct", (req,res)=>{
        var value=req.body.pid;
        db.collection('Shoes').deleteOne(value,function(err,result){
          if(err) return console.log(err)
          console.log(req.body.pid+' stock deleted')
        //res.redirect('/')
        res.render('delete.ejs')
        })
      })*/
     
    
    
