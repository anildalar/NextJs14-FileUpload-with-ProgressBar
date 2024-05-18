export async function POST(req,res) {
    const { phoneNumber,tweetData,hashTags,fileUrl } = await req.json()
    /* const res = await fetch(`${process.env.EXPRESS_API}/test`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json() */
   
    return Response.json({ phoneNumber,tweetData,hashTags,fileUrl })
}