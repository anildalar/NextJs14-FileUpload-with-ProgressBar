export async function POST(req, res) {
    try {
      const { proxies } = await req.json(); // Assuming phoneNumbers is an array of strings
        
      const baseUrl = `${process.env.EXPRESS_API}/proxies`;
        try {
       
          const response = await fetch(baseUrl.toString(), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({proxies}),
          });
  
          const data = await response.json();
          return Response.json({ status: 'Success', data });
        } catch (error) {
          console.error('Error:', error);
          return Response.json({ status: 'Error', error: error.message  });
        }
      
    } catch (error) {
      console.error('Error:', error);
      return Response.json({ status: 'Error', error: error.message });
    }
  }