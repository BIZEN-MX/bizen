async function checkApi() {
    try {
        const res = await fetch('http://localhost:3004/api/topics');
        if (!res.ok) {
            console.log('API Error:', res.status, res.statusText);
            return;
        }
        const data = await res.json();
        console.log('Total topics from API:', data.length);
        if (data.length > 0) {
            console.log('First topic ID:', data[0].id);
        }
    } catch (e) {
        console.log('Fetch error:', e.message);
    }
}
checkApi();
