export async function POST(req,res) {
    const { phoneNumber,tweetData,hashTags,fileUrl } = await req.json()
    //phoneNumber,tweetData,tag,fileUrl

    const baseUrl = `${process.env.EXPRESS_API}/tweet`;
    const url = new URL(baseUrl);

    url.searchParams.append('phoneNumber', phoneNumber);
    url.searchParams.append('tweetData', tweetData);
    url.searchParams.append('tag', hashTags);
    url.searchParams.append('fileUrl', fileUrl);

    try {
      const res = await fetch(url.toString(), {
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
      console.log('Success:', data);
      return Response.json({ 'status':'Success',data })
    } catch (error) {
      console.error('Error:', error);
      return Response.json({ 'status':'Error',error  })
    }
   
    
}