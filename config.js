exports.sessionConfig = {
    secret:'Sample12',
    resave:false,
    saveUninitialized: true,
    cookie: { maxAge: 600000,httpOnly: false,secure: true }
}