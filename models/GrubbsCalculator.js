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

    calculateStandardDeviation : function(samples, average){
      var squareDiffs = samples.map(function(sample){
        var diff = sample.Value - average;
        var sqrDiff = diff * diff;
        return sqrDiff;
      });
      // console.log("value.lenght: " + values.length);
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

    }

    

}