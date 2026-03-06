
const { createClient } = require("./node_modules/@supabase/supabase-js");

async function checkAuthUsers() {
    const url = "https://qkrttsukyuujjovrjhjk.supabase.co"; // THE ALIVE ONE
    const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrcnR0c3VreXV1ampvdnJqaGprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTU4MDkzOSwiZXhwIjoyMDc3MTU2OTM5fQ.v-gp9QFkwwld5I5gNmaTm3fZ9DKKFy9blkdccPIXFes";

    const supabase = createClient(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    try {
        const { data: { users }, error } = await supabase.auth.admin.listUsers();
        if (error) throw error;

        console.log(`Total Auth users: ${users.length}`);
        const bizen = users.filter(u => u.user_metadata?.app_source === "bizen" || !u.user_metadata?.app_source);
        console.log(`Bizen users (filtered): ${bizen.length}`);

        if (users.length > 0) {
            console.log('Sample 1 email:', users[0].email);
        }
    } catch (err) {
        console.error('Auth Error:', err.message);
    }
}

checkAuthUsers();
