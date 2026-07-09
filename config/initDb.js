const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2 seconds

function initializeDatabase(retryCount = 0) {
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
                console.log(`⏳ Connection attempt ${retryCount + 1}/${MAX_RETRIES} failed. Retrying in ${RETRY_DELAY / 1000}s...`);
                console.log(`   Error: ${err.message}`);
                setTimeout(() => initializeDatabase(retryCount + 1), RETRY_DELAY);
                return;
            } else {
                console.error('❌ Failed to connect to MySQL after multiple attempts:', err.message);
                process.exit(1);
            }
        }

        console.log('✅ Connected to MySQL');

        // Read schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Execute schema
        connection.query(schema, (err, results) => {
            if (err) {
                console.error('❌ Error executing schema:', err.message);
                connection.end();
                process.exit(1);
            }
            console.log('✅ Database schema initialized successfully!');
            console.log('📊 Tables created:');
            console.log('   - users');
            console.log('   - families');
            console.log('   - categories');
            console.log('   - expenses');
            connection.end();
            process.exit(0);
        });
    });
}

initializeDatabase();

