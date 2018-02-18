const search_transform = require('./server.js');

test('Transform Response from CloudSearch', () => {
  var cloudSearchResponseString = `{
    "status": {
        "rid": "/rnE+e4oCAqfEEs=",
        "time-ms": 6
    },
    "hits": {
        "found": 0,
        "hit": [
        ],
        "start": 0
    }
  }`;

  var cloudSearchResponseObject = JSON.parse(cloudSearchResponseString);

    var expectedReturnObject = [];
    let notFound = {};
    notFound['crn'] = 'No records found';
    notFound['name'] = 'No records found';
    notFound['dateOfBirth'] = 'No records found';
    notFound['singlelineaddress'] = 'No records found';
    expectedReturnObject.push(notFound);

    expect(search_transform(cloudSearchResponseObject)).toEqual(expectedReturnObject);
});
