
    angular.module('GCDarseReplacementApp', ['ngMaterial', 'ngMessages'])
    
    .controller('mainCtrl', function($scope){

      this.startDate = new Date();
      this.endDate = new Date();
      this.jetty = "";
      this.cargoName = "";

      //--MARK: GRUBBS TESTING
      this.probability = 0.0;
      this.degreeFreedom = 0;

      // function to retrieve the TINV value based on the p & df
      this.tinv = function(probability,degreeFreedom){
       // var tInvTable = new T_InverseTable();
        var tInvValue = T_InverseTable.getTIntVal(probability,degreeFreedom);
        //console.log("---MAIN tInvValue: " + tInvValue);
      };


      //MARK: Iterative Grubbs Calculation
      var samples = SampledData.samples;
      var significanceLevel = 0.05;
      var outliers = [];
      var grubbsSetCalculations = [];
      var i = 0;
      do {

        outliers = []; // empty the outliers array
        grubbsSetCalculations = []; // empty the grubbs calculations array
        
        // get the grubbs values for each set
        samples.forEach(function(set) {

          var size = GrubbsCalculator.calculateSize(set);
          var average = GrubbsCalculator.calculateAverage(set);
          var standardDeviation = GrubbsCalculator.calculateStandardDeviation(set, average);
          var standardDeviation_Sample = GrubbsCalculator.calculateStandardDeviation_Sample(set, average);
          var other_standardDeviation_Sample = GrubbsCalculator.otherStdDevSample(set, average);


          var t_TestSignificance = GrubbsCalculator.calculateT_TestSignificance(set, 0.05);

          // Find the closest value equal to the 1 - tTestSignificance
          var counts = T_InverseTable.probabilities;
          var goal = 1 - t_TestSignificance;
          var closest = counts.reduce(function(prev, curr) {
            return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
          });
          var grubbsValue = GrubbsCalculator.calculateGrubbsValue(size,closest);
          grubbsSetCalculations.push(grubbsValue);

          // console.log("--------");
          // console.log("i: " + i++);
          // console.log("size: " + size);
          // console.log("mean: " + average);
          // console.log("standard dev: " + standardDeviation);
          // console.log("standard dev sample: " + standardDeviation_Sample);
          // console.log("OTHER standard dev sample: " + other_standardDeviation_Sample);
          // console.log("t_Test: " + t_TestSignificance);
          // console.log("closest prob from tTestVal: " + closest);
          // console.log("Grubb's: " + grubbsValue);
        });


        // identify outliers
        outliers = GrubbsCalculator.identifyOutliers(samples, grubbsSetCalculations, significanceLevel);

        // console.log("\n\n_____Grubbs Values____");
        // console.log("grubbsValues: " + grubbsSetCalculations);
        // console.log("\n\n______REMOVE OUTLIERS______")
        // console.log("outliers: " + outliers);

        // filter outliers from samples
        if (outliers.length > 0){
          samples = GrubbsCalculator.removeOutliers(samples, outliers);
        }
      } while (outliers.length > 0);


     // console.log("----- RESULTS -----");
      this.results = [];
      var tempResults = [];
      samples.forEach(function(set){
        resultAverage = GrubbsCalculator.calculateAverage(set);
        resultSize = set.length;
        avg_rounded = GrubbsCalculator.calculateAverage_Rounded(resultAverage);
        avg_normalized = GrubbsCalculator.calculateAverage_Normalized(resultAverage);
        var result = {
          rounded: avg_rounded,
          normalized: avg_normalized
        };
        tempResults.push(result);
        // console.log("set.length: " + set.length);
        // console.log("set: " + set);
        // console.log("result size: " + resultSize);
        // console.log("result mean: " + resultAverage);
        // console.log("average (normalized): " + avg_normalized);
        // console.log("average (rounded): " + avg_rounded);

      });
      this.results = tempResults;

      //console.log("Final Results");
      this.results.forEach(function(result){
       // console.log("result (rounded): " + result.rounded);
       // console.log("result (normalized): " + result.normalized);
      });
        
      var startTime = "*-102h";
      var endTime = "*-98h";
      var intervals = 500;
      var tsArray = [];
      var valueArray = [];
      var returnedValArray = [];
      
      console.log("starting service...");
      
      getRecordedData("F1DP4fzRUyKOPUK7lpmO6iv2GgpB0AAAQVpSMDFQSTAxXFNJTlVTT0lE", startTime, endTime).then(function(d){
        console.log("getRecordedData...");
          console.log(d);
          d.Items.forEach(function(i){
            console.log(i.Value);
           });
          
          d.Items.forEach(function(i){
              returnedValArray.push({Timestamp: i.Timestamp, Value: i.Value});
          });
      }).then(function(){
          console.log(returnedValArray);
      });
      
      console.log("got data...");


    });