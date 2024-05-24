export async function POST(req, res) {
    try {
        const { phoneNumber, tweetData, hashTags, fileUrl ,uname} = await req.json();
        
        const baseUrl = `${process.env.EXPRESS_API}/postInsert`;
        const response = await fetch(baseUrl.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({numbers:phoneNumber,tweetData:tweetData,hashTags:hashTags,fileUrl:fileUrl,uname:uname}),
        });

        const data = await response.json();
        return Response.json({ status: 'Success', data });
    } catch (error) {
      console.error('Error:', error);
      return Response.json({ status: 'Error', error: error.message });
    }
  }