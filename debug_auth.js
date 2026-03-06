
const { createClient } = require("./node_modules/@supabase/supabase-js");

async function checkAuthUsers() {
    const url = "https://jbodeaqxjaezzjwewvrg.supabase.co";
    const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impib2RlYXF4amFlenpqd2V3dnJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODg0MDg0MCwiZXhwIjoyMDc0NDE2ODQwfQ.rWya9hI3CrMvsaFa59oy2O7sJTaKApg9MZ6EKRcm6F0";

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
            console.log('Sample 1 metadata:', JSON.stringify(users[0].user_metadata, null, 2));
        }
    } catch (err) {
        console.error('Auth Error:', err.message);
    }
}

checkAuthUsers();
