const { Client } = require('pg');

async function verify() {
  const email = process.env.USER_EMAIL;
  const connectionString = process.env.DB_URL;

  if (!email || !connectionString) {
    console.error("❌ Missing Email or DB URL");
    process.exit(1);
  }

  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log(`Checking for user: ${email}`);
    
    // Using parameterized query to prevent SQL injection and syntax errors
    const res = await client.query('SELECT * FROM public."user" WHERE email = $1', [email]);

    if (res.rows.length > 0) {
      console.log('✅ SUCCESS: User found in database.');
      process.exit(0);
    } else {
      console.error('❌ FAILURE: User not found in database.');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Database Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

verify();
