/**************************************************************
* Overview: this is the nodeJS code of Customer Profile App
*  license:
*    name: MIT
*    url: https://opensource.org/licenses/MIT
***************************************************************/

const express = require('express');
const AWS = require('aws-sdk');
const BodyParser = require('body-parser');

/*
Working with environment variables is a great way to configure 
different aspects of  Node.js application. Here we are setting
port, APIKey and APISecret. All of these variables should be stored
in AWS Parameter Store and then when docker is about to run, we
include all of these varaiables
*/

const APIKey = process.env.APIKey || 'apikey';
const APISecret = process.env.APISecret || 'apisecret';
const port = process.env.PORT || 8080;
const AWSCloudSearchDomainEndpoint = process.env.AWSCloudSearchDomainEndpoint || 'AWSCloudSearchDomain';

const app = express();
app.use(BodyParser.json());
app.use('/healthcheck', require('express-healthcheck')());

// policy role to be applied on instance so that we can avoid the below.
const CLOUDSEARCHDOMAIN_PARAMS = {
  endpoint: AWSCloudSearchDomainEndpoint,
  accessKeyId: APIKey,
  secretAccessKey: APISecret,
};

AWS.config.update({region: 'ap-southeast-2'});

function customer_detail(req, res, next){
  const dyno = new AWS.DynamoDB.DocumentClient();
  res.setHeader('Access-Control-Allow-Origin', 'https://wow.myprototype.com.au');
  const crn = parseInt(req.params.crn);
  console.log(`customer_detail: crn=${crn}`);
  const params = {
    Key: {
      crn : crn
    },
    TableName: "customers",
  };
  if (req.query.filter) {
    params.AttributesToGet = req.query.filter.split(',');
  }
  let p = dyno.get(params).promise();
  p.then( data => {
    res.send(JSON.stringify(data.Item, null, 4));
  }).catch(next);
}

function search_transform(data){
  let ret = [];
  //console.log('data', JSON.stringify(data));
  for (let i = 0; i < data.hits.hit.length; i++ ) {
    let obj = data.hits.hit[i].fields;
    let obj2 = {};
    for (let k in obj) {
      //console.log(`k: ${k}`);
      obj2[k] = obj[k][0];
    }
    ret.push(obj2);
  }
  if(data.hits.hit.length < 1){
    let notFound = {};
    notFound['crn'] = 'No records found';
    notFound['name'] = 'No records found';
    notFound['dateOfBirth'] = 'No records found';
    notFound['singlelineaddress'] = 'No records found';
    ret.push(notFound);
    return ret;
  }
  return ret;
}

function search_attr(req, res, next){
  const cloudsearchdomain = new AWS.CloudSearchDomain(CLOUDSEARCHDOMAIN_PARAMS);
  //added by Adam to allow CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://wow.myprototype.com.au');
  let attr = Object.keys(req.query)[0];
  let value = req.query[attr];
  let params = {
    query: `(and ${attr}:'${value}')`, /* required */
    queryParser: 'structured',
    size: 10
  };
  //console.log('params', params);
  let p = cloudsearchdomain.search(params).promise();
  p.then(data => {
    res.send(JSON.stringify({
        status: 'OK',
        predictions: search_transform(data)
    }, null, 4));
  }).catch(next);
}

app.get('/customers/:crn', customer_detail);
app.get('/customers', search_attr);

console.log(`server running at port: ${port}`);
app.listen(port);
