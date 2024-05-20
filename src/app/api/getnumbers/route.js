export async function GET(req,res) {
    const baseUrl = `${process.env.EXPRESS_API}/getNumbers`;

    try {
      const res = await fetch(baseUrl.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.error) {
        console.error('Error:', data.error);
        return Response.json({ status: 'Error', error: data.error });
      }
      return Response.json({ 'status':'Success',data })
    } catch (error) {
      console.error('Error:', error);
      return Response.json({ 'status':'Error',error  })
    }
   
    
}