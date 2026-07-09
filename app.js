const express=require('express');
const dotenv=require('dotenv');
const colors=require('colors');
const path=require('path');
const session=require('express-session');
const mysql = require('mysql2');
const fs = require('fs');
const authRoutes=require('./routes/authRoutes');
const dashboardRoutes=require('./routes/dashboardRoutes');
const familyRoutes=require('./routes/FamilyRoutes');
const categoryRoutes=require('./routes/categoryRoutes');
const expenseRoutes=require('./routes/expenseRoutes');
const insightsRoutes=require('./routes/insightsRoutes');

const app=express();
dotenv.config();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

const PORT=process.env.PORT || 3000;
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'/public')));
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24
    }
}));

// Initialize database on startup
function initializeDatabase(retryCount = 0) {
    const MAX_RETRIES = 10;
    const RETRY_DELAY = 3000;

    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        multipleStatements: true,
        waitForConnections: true,
        connectionTimeout: 10000
    });

    connection.connect((err) => {
        if (err) {
            if (retryCount < MAX_RETRIES) {
                console.log(`⏳ DB Connection attempt ${retryCount + 1}/${MAX_RETRIES}...`.yellow);
                setTimeout(() => initializeDatabase(retryCount + 1), RETRY_DELAY);
                return;
            } else {
                console.error('❌ Failed to connect to database. Starting app anyway...'.red);
                startServer();
                return;
            }
        }

        console.log('✅ Connected to MySQL'.green);

        const schemaPath = path.join(__dirname, 'config', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        connection.query(schema, (err, results) => {
            if (err) {
                console.error('⚠️  Schema error (may already exist):', err.message);
            } else {
                console.log('✅ Database schema initialized!'.green);
            }
            connection.end();
            startServer();
        });
    });
}

function startServer() {
    app.use('/auth',authRoutes);
    app.use('/dashboard',dashboardRoutes);
    app.use('/family',familyRoutes);
    app.use('/categories',categoryRoutes);
    app.use('/expenses',expenseRoutes);
    app.use('/insights',insightsRoutes);

    app.get('/',(req,res)=>{
        res.render('landing');
    })

    app.listen(PORT,()=>{
        console.log(`server is running on PORT: ${PORT}`.green.bold);
    })
}

// Start database initialization
initializeDatabase();

