
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
        console.log("---MAIN tInvValue: " + tInvValue);
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
          var t_TestSignificance = GrubbsCalculator.calculateT_TestSignificance(set, 0.05);

          // Find the closest value equal to the 1 - tTestSignificance
          var counts = T_InverseTable.probabilities;
          var goal = 1 - t_TestSignificance;
          var closest = counts.reduce(function(prev, curr) {
            return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
          });
          var grubbsValue = GrubbsCalculator.calculateGrubbsValue(size,closest);
          grubbsSetCalculations.push(grubbsValue);

          console.log("--------");
          console.log("i: " + i++);
          console.log("size: " + size);
          console.log("mean: " + average);
          console.log("standard dev: " + standardDeviation);
          console.log("t_Test: " + t_TestSignificance);
          console.log("closest prob from tTestVal: " + closest);
          console.log("Grubb's: " + grubbsValue);
        });

        console.log("\n\n_____Grubbs Values____");
        console.log("grubbsValues: " + grubbsSetCalculations);
        // identify outliers
        var x = 0;
        while (x < samples.length) {
          //console.log("samples[x] length: " + samples[x].length);
          y = 0;
          samples[x].forEach(function(sample){
            //console.log("sample.Value: " + sample.Value);
            //console.log("grubbsSetCalculations[x]: " + grubbsSetCalculations[x] + " for set (x): " + x);
           //console.log("sample index (y): " + y++);
            if (sample.Value > grubbsSetCalculations[x] + significanceLevel || sample.Value < grubbsSetCalculations[x] - significanceLevel){
              // only push is the current sample.timestamp DNE in outliers
              //outliers.push(sample.Timestamp);
              if(outliers.indexOf(sample.Timestamp) === -1) {
                outliers.push(sample.Timestamp);
                //console.log(outliers);
              }
            }
          });
          x++;
        };


        console.log("\n\n______REMOVE OUTLIERS______")
        console.log("outliers: " + outliers);
        var tempSamples = [[]];
        var tempSet = [];
        // filter outliers from samples
        if (outliers.length > 0){
          tempSamples = [[]];
          
          samples.forEach(function(set){
              tempSet = [];
              set.forEach(function(sample){
                if (!outliers.includes(sample.Timestamp)){
                  tempSet.push(sample);
                }
            });
            tempSamples.push(tempSet);
          });
          samples = tempSamples;
        }
  
        //console.log("iterattive outliers: " + outliers);


      } while (outliers.length > 0);

      console.log("----- RESULTS -----");
      console.log("outliers: " + outliers);
      samples.forEach(function(set){
        resultAverage = GrubbsCalculator.calculateAverage(set);
        resultSize = set.length;
        avg_rounded = GrubbsCalculator.calculateAverage_Rounded(resultAverage);
        avg_normalized = GrubbsCalculator.calculateAverage_Normalized(resultAverage);

        console.log("set.length: " + set.length);
        console.log("set: " + set);
        console.log("result size: " + resultSize);
        console.log("result mean: " + resultAverage);
        console.log("average (normalized): " + avg_normalized);
        console.log("average (rounded): " + avg_rounded);

      });



    });