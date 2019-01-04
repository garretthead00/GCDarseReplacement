
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

    // Calculating Grubb's values for the set of sampled data  
      console.log("--- Calculating sets ---");
      var samples = SampledData.samples;
      
      // Holds a set of values for Grubb's score for each set of sampled data, used to determine outliers.
      var grubbsSetCalculations = [];

      // samples.forEach(function(set) {
      //   var size = GrubbsCalculator.calculateSize(set);
      //   var average = GrubbsCalculator.calculateAverage(set);
      //   var standardDeviation = GrubbsCalculator.calculateStandardDeviation(set, average);
      //   var t_TestSignificance = GrubbsCalculator.calculateT_TestSignificance(set, 0.05);

      //   console.log("--------");
      //   console.log("size: " + size);
      //   console.log("mean: " + average);
      //   console.log("standard dev: " + standardDeviation);
      //   console.log("t_Test: " + t_TestSignificance);

      //   // Find the closest value equal to the 1 - tTestSignificance
      //   var counts = T_InverseTable.probabilities;
      //   var goal = 1 - t_TestSignificance;
      //   var closest = counts.reduce(function(prev, curr) {
      //     return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
      //   });
      //   console.log("closest prob from tTestVal: " + closest);
      //   var grubbsValue = GrubbsCalculator.calculateGrubbsValue(size,closest);
      //   console.log("Grubb's: " + grubbsValue);
      //   grubbsSetCalculations.push(grubbsValue);
      // });

      // console.log("grubbs values: " + grubbsSetCalculations);



      // Iterative Grubbs Calculation

      var significanceLevel = 0.05;
      var outliers = [];

      do {

        outliers = []; // empty the outliers array
        grubbsSetCalculations = []; // empty the grubbs calculations array
        
        // get the grubbs values for each set
        samples.forEach(function(set) {
          var size = GrubbsCalculator.calculateSize(set);
          var average = GrubbsCalculator.calculateAverage(set);
          var standardDeviation = GrubbsCalculator.calculateStandardDeviation(set, average);
          var t_TestSignificance = GrubbsCalculator.calculateT_TestSignificance(set, 0.05);

          console.log("--------");
          console.log("size: " + size);
          console.log("mean: " + average);
          console.log("standard dev: " + standardDeviation);
          console.log("t_Test: " + t_TestSignificance);

          // Find the closest value equal to the 1 - tTestSignificance
          var counts = T_InverseTable.probabilities;
          var goal = 1 - t_TestSignificance;
          var closest = counts.reduce(function(prev, curr) {
            return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
          });
          console.log("closest prob from tTestVal: " + closest);
          var grubbsValue = GrubbsCalculator.calculateGrubbsValue(size,closest);
          console.log("Grubb's: " + grubbsValue);
          grubbsSetCalculations.push(grubbsValue);
        });

        // identify outliers
        for (i = 0; i < samples.length; i++) {
          samples[i].forEach(function(sample){
            if (sample > grubbsSetCalculations[i] + significanceLevel || sample < grubbsSetCalculations - significanceLevel){
              // only push is the current sample.timestamp DNE in outliers
              outliers.push(sample);
            }
          });
        }

        var tempSamples = [[]];
        var tempSet = [];
        // filter outliers from samples
        if (outliers.length > 0){
          tempSamples = [[]];
          
          samples.forEach(function(set){
              tempSet = [];
              set.forEach(function(sample){
                if (!outliers.includes(sample)){
                  tempSet.push(sample);
                }
            });
            tempSamples.push(tempSet);
          });
          samples = tempSamples;
        }
  



      } while (outliers.length > 0);

      console.log("----- RESULTS -----");
      console.log("outliers: " + outliers);
      samples.forEach(function(set){
        console.log("sample.length: " + samples.length);
        console.log("samples: " + samples);
      });



    });