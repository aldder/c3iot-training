/*
* Copyright 2009-2018 C3 IoT, Inc. All Rights Reserved.
* This material, including without limitation any software, is the confidential trade secret
* and proprietary information of C3 IoT and its licensors. Reproduction, use and/or distribution
* of this material in any form is strictly prohibited except as set forth in a written
* license agreement with C3 IoT and/or its authorized distributors.
* This product may be covered by one or more U.S. patents or pending patent applications.
~*/

/*
 * Returns the expected lumens of a light bulb based on wattage and bulbType
 */
function expectedLumens(wattage, bulbType) {
  if(bulbType == 'LED')
    return wattage * 84;
  if(bulbType == 'INCAN')
    return wattage * 14;
  if(bulbType == 'CFL')
    return wattage * 62;
}

/*
 * Returns the lifespan of a smart bulb in years.
 */
function lifeSpanInYears(bulbId){
  var bulb, startTime, defectFilter, defectDatum, defectTime, lifespan, conversionFactor, lifeSpanInYears;
  bulb = SmartBulb.get({id:bulbId});
  startTime = bulb.startDate;
  defectFilter = "status == 1 && lumens == 0 && parent.id == '" + 'SBMS_serialNo_' + bulb.id + "'";
  defectDatum = SmartBulbMeasurement.fetch({filter:defectFilter});
  defectTime = defectDatum.objs[0].end;
  lifespan = defectTime - startTime;
  conversionFactor = 1000*60*60*24*365;
  lifeSpanInYears = lifespan / conversionFactor;
  return lifeSpanInYears;
}

function longestLifeSpanBulb(){
  var bulbs, max_lifspan=0, max_bulb, bulbId, bulb_lifespan;
  bulbs = SmartBulb.fetch({include:'id'}).objs;
  for(var i=0; i<bulbs.length; i++){
    bulbId = bulbs[i].id
    bulb_lifespan = SmartBulb.lifeSpanInYears(bulbId);
    if(bulb_lifespan > max_lifspan){
      max_lifspan = bulb_lifespan;
      max_bulb = bulbId
    }
  }
  return max_bulb
}

function shortestLifeSpanBulb(){
  var bulbs, min_lifspan=10000, min_bulb, bulbId, bulb_lifespan;
  bulbs = SmartBulb.fetch({include:'id'}).objs;
  for(var i=0; i<bulbs.length; i++){
    bulbId = bulbs[i].id;
    bulb_lifespan = SmartBulb.lifeSpanInYears(bulbId);
    if(bulb_lifespan < min_lifspan){
      min_lifspan = bulb_lifespan;
      min_bulb = bulbId
    }
  }
  return min_bulb
}

function averageLifeSpanBulb(){
  var bulbs, lifespans=[], sum, avg = 0, bulbId, bulb_lifespan;
  bulbs = SmartBulb.fetch({include:'id'}).objs;
  for(var i=0; i<bulbs.length; i++){
    bulbId = bulbs[i].id;
    bulb_lifespan = SmartBulb.lifeSpanInYears(bulbId);
    lifespans.push(bulb_lifespan)
  }
  sum = lifespans.reduce(function(a, b) { return a + b; });
  avg = sum / lifespans.length;
  return avg
}


