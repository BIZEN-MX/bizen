const { Client } = require('pg');

const connectionString = 'postgresql://postgres.jbodeaqxjaezzjwewvrg:diegopenita31@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require';

async function testConnection() {
    const client = new Client({
        connectionString: connectionString,
    });

    try {
        console.log('📡 Attempting to connect to Supabase...');
        await client.connect();
        console.log('✅ Connected successfully!');
        const res = await client.query('SELECT NOW()');
        console.log('🕒 Database time:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        if (err.detail) console.error('Detail:', err.detail);
        if (err.hint) console.error('Hint:', err.hint);
    }
}

testConnection();
