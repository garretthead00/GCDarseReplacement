var GrubbsCalculator = {

    calculateSize : function(data){
        return data.length;
    },

    calculateAverage : function(data){
      // console.log("Grubbs Calc timestamp: " + data[0].Timestamp);
      // console.log("Grubbs Calc Value: " + data[0].Value);
      var sum = data.reduce(function (acc, obj) { return acc + obj.Value; }, 0);
      //console.log("sum: " + sum);
      return sum / data.length;
    },

    calculateAverage_Normalized : function(average) {
      avg_scnt = average.toExponential();
      return avg_scnt;
    },
    calculateAverage_Rounded : function(average) {
      avg_rounded = average.toFixed(4);
      return avg_rounded;
    },

    calculateStandardDeviation : function(samples, average){
      var squareDiffs = samples.map(function(sample){
        var diff = sample.Value - average;
        var sqrDiff = diff * diff;
        return sqrDiff;
      });
      // console.log("value.length: " + values.length);
      var avgSquareDiff = (squareDiffs / samples.length);

      var sum = squareDiffs.reduce(function(sum, value){
        return sum + value;
      }, 0);
      var avgSquareDiff = (sum / samples.length);

      //console.log("avgSqrDiff: " + avgSquareDiff);
      var stdDev = Math.sqrt(avgSquareDiff);
      return stdDev;
    },

    calculateT_TestSignificance : function(values, significanceLevel){
      return significanceLevel / (2 * values.length);
    },

    calculateGrubbsValue : function(size, probabilty){
      var tInvVal = T_InverseTable.getTIntVal(probabilty,size - 2);
      return (size - 1) * tInvVal / Math.sqrt(size * (size - 2 + (tInvVal * tInvVal)));

    },

    identifyOutliers : function(samples, values, significanceLevel) {
      var outliers = [];
      var x = 0;
      while (x < samples.length) {
        y = 0;
        samples[x].forEach(function(sample){
          var minThreshold = values[x] - significanceLevel;
          var maxThreshold = values[x] + significanceLevel;
          if (sample.Value > maxThreshold || sample.Value < minThreshold){
            if(outliers.indexOf(sample.Timestamp) === -1) {
              outliers.push(sample.Timestamp);
            }
          }
        });
        x++;
      };
      return outliers;
    },

    removeOutliers : function(samples, outliers) {
      var tempSamples = [[]];
      var tempSet = [];
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
      return tempSamples;
    }

}