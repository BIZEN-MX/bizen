// Native fetch is available in node 22
async function testBilly() {
    console.log('--- Testing Billy API ---');
    try {
        const response = await fetch('http://localhost:3004/api/free-chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'Hola Billy, ¿qué me recomiendas para empezar a ahorrar?',
                conversationHistory: []
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Source:', data.source);
        console.log('Response:', data.response);
    } catch (error) {
        console.error('Error connecting to local API:', error.message);
    }
}

testBilly();
