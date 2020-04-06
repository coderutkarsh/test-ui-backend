const express = require('express')
const cors = require('cors')
const app = express();
const session = require('express-session') 
const bodyParser = require('body-parser')
const sessionConfig = require('./config').sessionConfig
app.use(session(sessionConfig))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(cors());
const mongoConnect = require('./utils/database').mongoConnect
const feedbackRoutes = require('./routes/feedback_routes')
const adminRoutes = require('./routes/admin_routes');
const testRoutes = require('./routes/test_routes')
app.use(feedbackRoutes)
app.use(adminRoutes)
app.use(testRoutes)
mongoConnect((client)=>{
 
})
app.listen(4000);