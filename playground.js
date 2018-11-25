const _ = require('lodash');
test = { "_id": "5bb45d1c33b7057085016700", "name": "Action", __v: 0 }

console.log(_.omit(test, ['__v']))