// Test de conexión a MongoDB
async function testMongoDB() {
  try {
    console.log('🔄 Probando conexión a MongoDB...');
    
    const response = await fetch('https://apidelizia.vercel.app/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: 'Test User',
        email: 'test@test.com',
        password: 'test123',
        rol: 'admin'
      })
    });
    
    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Response:', data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar test
testMongoDB();
