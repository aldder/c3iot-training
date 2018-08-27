var log = C3.logger("SmartBulbOverheatAlert");

var TEMP_THRESHOLD = 95;

function process(input) {
  var data = input.temperature.data(),
      dates = input.temperature.dates();
  for (var i = 0; i < data.length; i++) {
    // If the temperature is greater than the threshold then we need to update the source object
    if (data.at(i) > TEMP_THRESHOLD) {
      return SmartBulbEvent.make({
        smartBulb: input.source,
        eventCode: "OVERHEAT",
        eventType: "HEALTH",
        start: dates.at(i),
        end: dates.at(i+1)
      });
    }
  }
}
