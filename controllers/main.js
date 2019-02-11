
    angular.module('GCDarseReplacementApp', ['ngMaterial', 'ngMessages'])
    
    .controller('mainCtrl', function($scope){

      this.startDate = new Date();
      this.endDate = new Date();
      this.jetty = "";
      this.cargoName = "";
      
      
      var startTime = "1/1/2018";
      var endTime = "1/2/2018";
      var interval = "4m"
      var tsArray = [];
      var interpolatedCollection = [];
  


      function andThen() {
        console.log("all done");
        console.log("interpolatedCollection.length: " + interpolatedCollection.length);
      };

      function fetchInterpolatedData() {
        // Fetch interpolated data for each PI Tag from startTime to endTime and every 4 minutes.
        console.log("fetching interpolated data...");
        SampledData.piTags.forEach(function(tag){
            getInterpolatedData(tag.WebID, startTime, endTime, interval).then(function(data){
              console.log("\n\n\n----- Result -----");
              console.log("Tag: " + tag.Name);

              // data.Items.forEach(function(sample){
              //   console.log("Tag: " + tag.Name + " Timestamp: " + sample.Timestamp + ", Value: " + sample.Value);
              // });

              data.Items.forEach(function(i){
                tsArray.push({Timestamp: i.Timestamp, Value: i.Value});
              });
              
              interpolatedCollection.push(tsArray);
              console.log("interpolatedCollection.length: " + interpolatedCollection.length);
              console.log("tsArray.length: " + tsArray.length);
              tsArray = [];

            });
        });
        
      };

      fetchInterpolatedData();


    });