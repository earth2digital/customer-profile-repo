/**************************************************************
* Overview: this is the nodeJS code of Customer Profile App
*  license:
*    name: MIT
*    url: https://opensource.org/licenses/MIT
***************************************************************/

const express = require('express');
const AWS = require('aws-sdk');
const BodyParser = require('body-parser');

const port = process.env.PORT || 3000;
const app = express();
app.use(BodyParser.json());
app.use('/healthcheck', require('express-healthcheck')());

const CLOUDSEARCHDOMAIN_ENDPOINT = 'search-customers-by-name-xhoerbnks4embre3fa2khli4qm.ap-southeast-2.cloudsearch.amazonaws.com'
// policy role to be applied on instance so that we can avoid the below.
const CLOUDSEARCHDOMAIN_PARAMS = ***REMOVED***
  endpoint: CLOUDSEARCHDOMAIN_ENDPOINT,
  accessKeyId: '',
  secretAccessKey: '',
***REMOVED***;

AWS.config.update(***REMOVED***region: 'ap-southeast-2'***REMOVED***);

function customer_detail(req, res, next)***REMOVED***
  const dyno = new AWS.DynamoDB.DocumentClient();
  //added by adam to allow CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://wow.myprototype.com.au');
  const crn = parseInt(req.params.crn);
  console.log(`customer_detail: crn=***REMOVED******REMOVED***crn***REMOVED***`);
  const params = ***REMOVED***
    Key: ***REMOVED***
      crn : crn
***REMOVED***,
    TableName: "customers",
  ***REMOVED***;
  if (req.query.filter) ***REMOVED***
    params.AttributesToGet = req.query.filter.split(',');
  ***REMOVED***
  let p = dyno.get(params).promise();
  p.then( data => ***REMOVED***
    res.send(JSON.stringify(data.Item, null, 4));
  ***REMOVED***).catch(next);
***REMOVED***

function search_transform(data)***REMOVED***
  let ret = [];
  console.log('data', JSON.stringify(data));
  for (let i = 0; i < data.hits.hit.length; i++ ) ***REMOVED***
    let obj = data.hits.hit[i].fields;
    let obj2 = ***REMOVED******REMOVED***;
    for (let k in obj) ***REMOVED***
      //console.log(`k: ***REMOVED******REMOVED***k***REMOVED***`);
      obj2[k] = obj[k][0];
***REMOVED***
    ret.push(obj2);
  ***REMOVED***
  if(data.hits.hit.length < 1)***REMOVED***
    let notFound = ***REMOVED******REMOVED***;
    notFound['crn'] = 'No records found';
    notFound['name'] = 'No records found';
    notFound['dateOfBirth'] = 'No records found';
    notFound['singlelineaddress'] = 'No records found';
    ret.push(notFound);
    return ret;
  ***REMOVED***
  return ret;
***REMOVED***

function search_attr(req, res, next)***REMOVED***
  const cloudsearchdomain = new AWS.CloudSearchDomain(CLOUDSEARCHDOMAIN_PARAMS);
  //added by Adam to allow CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://wow.myprototype.com.au');
  let dyno = new AWS.DynamoDB.DocumentClient();
  //let attr = req.params.attr;
  //let name = req.params.name;
  let attr = Object.keys(req.query)[0];
  let value = req.query[attr];
  let params = ***REMOVED***
    query: `(and ***REMOVED******REMOVED***attr***REMOVED***:'***REMOVED******REMOVED***value***REMOVED***')`, /* required */
    queryParser: 'structured',
    size: 10
  ***REMOVED***;
  console.log('params', params);
  let p = cloudsearchdomain.search(params).promise();
  p.then(data => ***REMOVED***
    res.send(JSON.stringify(***REMOVED***
        status: 'OK',
        predictions: search_transform(data)
***REMOVED***, null, 4));
  ***REMOVED***).catch(next);
***REMOVED***

app.get('/customers/:crn', customer_detail);
app.get('/customers', search_attr);

console.log(`server running at port: ***REMOVED******REMOVED***port***REMOVED***`);
app.listen(port);
