
var express = require('express');
var app = express();
const port=8888
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.listen(port);
console.log("Server running on ",port)
app.post('/update', function(req, res) {
    //console.log(req.body); // the posted data
    console.log(req.body.Tren.Vagonlar)
    let count=req.body.RezervasyonYapilacakKisiSayisi
    let flexible=req.body.KisilerFarkliVagonlaraYerlestirilebilir
    let isPlaced=false
    result={RezervasyonYapilabilir:false,YerlesimAyrinti:[]}
    req.body.Tren.Vagonlar.map((vagon)=>{
        if(vagon.DoluKoltukAdet/vagon.Kapasite<0.7){
            if(!flexible && vagon.Kapasite*0.7-vagon.DoluKoltukAdet>=count){
                result.RezervasyonYapilabilir=true
                result.YerlesimAyrinti.push({vagonAdi:vagon.Ad,KisiSayisi:count})
                isPlaced=true
                return
            }
            if(flexible&&vagon.Kapasite*0.7-vagon.DoluKoltukAdet>0){
                result.YerlesimAyrinti.push({vagonAdi:vagon.Ad,KisiSayisi:count<vagon.Kapasite*0.7-vagon.DoluKoltukAdet?count:vagon.Kapasite*0.7-vagon.DoluKoltukAdet})
                count-=count<vagon.Kapasite*0.7-vagon.DoluKoltukAdet?count:vagon.Kapasite*0.7-vagon.DoluKoltukAdet
                console.log(count)
            }
        }
    })
    if(isPlaced||count==0){
        result.RezervasyonYapilabilir=true
    }else{
        result.RezervasyonYapilabilir=false
        result.YerlesimAyrinti=[]
    }
    
    
    res.send(result)
});