
var express = require('express');
var app = express();
const port=process.env.PORT || 8080;
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.listen(port);
console.log("Server running on ",port)
app.post('/book', function(req, res) {
    console.log(req.body)
    let count=req.body.RezervasyonYapilacakKisiSayisi
    const flexible=req.body.KisilerFarkliVagonlaraYerlestirilebilir
    result={RezervasyonYapilabilir:false,YerlesimAyrinti:[]}


    cars=  req.body.Tren.Vagonlar
    const filtered_cars=cars.filter((vagon)=>vagon.Kapasite*0.7-vagon.DoluKoltukAdet>count)

    if(!flexible && filtered_cars.length<1){ 
        result.RezervasyonYapilabilir=false
        result.YerlesimAyrinti=[]
        res.send(result)
        return
    }
    else if(filtered_cars.length>0){
        result.RezervasyonYapilabilir=true
        result.YerlesimAyrinti.push({vagonAdi:filtered_cars[0].Ad,KisiSayisi:count})
        res.send(result)
        return
    }

    req.body.Tren.Vagonlar.map((vagon)=>{
        if(vagon.DoluKoltukAdet/vagon.Kapasite<0.7){
            if(flexible&&vagon.Kapasite*0.7-vagon.DoluKoltukAdet>0 && count>0 ){
                result.YerlesimAyrinti.push({vagonAdi:vagon.Ad,KisiSayisi:count<vagon.Kapasite*0.7-vagon.DoluKoltukAdet?count:Math.round(vagon.Kapasite*0.7-vagon.DoluKoltukAdet)})
                count-=count<vagon.Kapasite*0.7-vagon.DoluKoltukAdet?count:Math.round(vagon.Kapasite*0.7-vagon.DoluKoltukAdet)
            }
        }
    })
    
    if(count==0){
        result.RezervasyonYapilabilir=true
    }else{
        result.RezervasyonYapilabilir=false
        result.YerlesimAyrinti=[]
    }
    res.send(result)

});
app.get("/",function(req,res){
    res.send("Server Running \n you can access the endpoint via /book")
})