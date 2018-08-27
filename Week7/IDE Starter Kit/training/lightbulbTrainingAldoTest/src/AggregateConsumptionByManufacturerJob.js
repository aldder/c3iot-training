/*
* Copyright 2009-2018 C3 IoT, Inc. All Rights Reserved.
* This material, including without limitation any software, is the confidential trade secret
* and proprietary information of C3 IoT and its licensors. Reproduction, use and/or distribution
* of this material in any form is strictly prohibited except as set forth in a written
* license agreement with C3 IoT and/or its authorized distributors.
* This product may be covered by one or more U.S. patents or pending patent applications.
~*/

var logger = C3.logger("lightbulb.AggPower");

/*
 * Process a set of light bulbs and return the aggregate Power for a given manufacturer.
 */
function map(batch, objs, job) {
    // For a batch of Lightbulbs, calculate the aggregate power for a manufacturer and
    // return a map with the key the manufacturer and the value the aggregate power.
    var manufacturerConsumptionMap = {},
        consumptionMetricName = "AveragePower",
        currentSmartBulbConsumptionTimeseries,
        currentSmartBulbConsumptionSumData;

    // calculate the energy usage for each lightbulb
    var averageConsumptionMetricResults = SmartBulb.evalMetrics({
        ids: objs.pluck("id"),
        expressions: [consumptionMetricName],
        start: job.startDate,
        end: job.endDate,
        interval: job.interval
    });

    // loop over each smart bulb, calculating its aggregate energy consumption
    objs.each(function (smartBulb) {
        // retrieve the timeseries referring to the current smart bulb
        currentSmartBulbConsumptionTimeseries = averageConsumptionMetricResults.result[smartBulb.id][consumptionMetricName];

        // calculate the total energy consumption over the time period in question for the current smart bulb
        currentSmartBulbConsumptionSumData = currentSmartBulbConsumptionTimeseries.aggregate("SUM").data();

        // as long as currentSmartBulbConsumptionTimeseries is not empty, this condition should always pass, but just to be safe...
        if (!_.isEmpty(currentSmartBulbConsumptionSumData)) {
            // update the manufacturer map with the current smart bulb's total concumption
            if (!_.has(manufacturerConsumptionMap, smartBulb.manufacturer)) {
                manufacturerConsumptionMap[smartBulb.manufacturer] = 0;
            }
            manufacturerConsumptionMap[smartBulb.manufacturer] += currentSmartBulbConsumptionSumData[0];
        }
    });

    return manufacturerConsumptionMap;
}

/*
 * Persists the aggregate power of lightbulbs for a manufacturer for a given time range
 */
function reduce(key, objs, job) {
    // sum the consumptions of the current manufacturer's bulbs calculated from all batches
    var consumptionSum = _.reduce(objs, function (result, current) { return result + current; }, 0);
    var manufacturer = Manufacturer.get(key);

    // create the AggregateConsumptionByManufacturer object to record this job's results
    var consumptionByManufacturer = AggregateConsumptionByManufacturer.make({
        parent: manufacturer,
        start: job.startDate,
        end: job.endDate,
        aggregateConsumption: consumptionSum
    });
    consumptionByManufacturer.create();

    // return the results to store them in the job object as well (accessible using job.results())
    return [consumptionSum];
}