async function testAnalyze() {
  console.log("Testing http://127.0.0.1:3001/api/analyze with text input...");

  const textPayload = {
    text: "I am a 25-year-old software engineer. I have a warm skin tone and oval face shape. I want a smart casual look for my daily work."
  };

  try {
    const response = await fetch('http://127.0.0.1:3001/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(textPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log("Analysis Result Success:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Test Failed:", error.message);
    if (error.cause) console.error("Cause:", error.cause);
  }
}

testAnalyze();
