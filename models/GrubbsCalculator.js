var GrubbsCalculator = {

    calculateSize : function(data){
        return data.length;
    },

    calculateAverage : function(data){
      var sum = data.reduce(function(sum, value){
        return sum + value;
      }, 0);
      return sum / data.length;
    },

    calculateStandardDeviation : function(values, average){
      var squareDiffs = values.map(function(value){
        var diff = value - average;
        var sqrDiff = diff * diff;
        return sqrDiff;
      });
      //console.log("value.lenght: " + values.length);
      var avgSquareDiff = (squareDiffs / values.length);

      var sum = squareDiffs.reduce(function(sum, value){
        return sum + value;
      }, 0);
      var avgSquareDiff = (sum / values.length);


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