// Test de la nueva API separada
async function testNewAPI() {
  try {
    console.log('🔄 Probando nueva API separada...');
    
    const response = await fetch('https://apidelizia.vercel.app/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@delizia.com',
        password: 'admin123'
      })
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.text();
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ ¡Nueva API funcionando correctamente!');
      try {
        const json = JSON.parse(data);
        console.log('Usuario:', json.usuario);
        console.log('Token recibido:', json.token ? '✅ Sí' : '❌ No');
      } catch (e) {
        console.log('Respuesta no es JSON válido');
      }
    } else {
      console.log('❌ Error en la nueva API');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar test
testNewAPI();
