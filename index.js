const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
require('./startup/production')(app);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.info(`Listening on ${PORT}..`));

