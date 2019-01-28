
      
      
    console.log("starting service...");
      
    var startTime = "*-102h";
    var endTime = "*-98h";
    var interval = "4m"
    var tsArray = [];
    var interpolatedCollection = [];

    console.log("fetching interpolated data...");
    SampledData.piTags.forEach(function(tag){
        getInterpolatedData(tag.WebID, startTime, endTime, interval).then(function(data){

            //console.log(d);
            data.Items.forEach(function(sample){
                console.log("Timestamp: " + sample.Timestamp + ", Value: " + sample.Value);
                });
            
            data.Items.forEach(function(i){
                tsArray.push({Timestamp: i.Timestamp, Value: i.Value});
            });
            interpolatedCollection.push(tsArray);
        }).then(function(){
            console.log(interpolatedCollection);
        });
    });
      

