var log = C3.logger("SmartBulbLongLifeAlert");

var LIFE_THRESHOLD = 10500;

function process(input) {
  var data = input.bulbLife.data(),
      dates = input.bulbLife.dates();
  for (var i = 0; i < data.length; i++) {
    // If the temperature is greater than the threshold then we need to update the source object
    if (data.at(i) > LIFE_THRESHOLD) {
      return SmartBulbEvent.make({
        smartBulb: input.source,
        eventCode: "LONGLIFE",
        eventType: "HEALTH",
        start: dates.at(i),
        end: dates.at(i+1)
      });
    }
  }
}
