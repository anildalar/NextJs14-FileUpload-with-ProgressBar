export async function POST(req, res) {
  try {
    const { phoneNumbers, tweetData, hashTags, fileUrl } = await req.json();
    const phoneNumberList = phoneNumbers; // Assuming phoneNumbers is an array of strings

    const baseUrl = `${process.env.EXPRESS_API}/tweet`;

    const requests = phoneNumberList.map(async (phoneNumber) => {
      const url = new URL(baseUrl);

      url.searchParams.append('phoneNumber', phoneNumber.trim());
      url.searchParams.append('tweetData', tweetData);
      url.searchParams.append('tag', hashTags);
      url.searchParams.append('fileUrl', fileUrl);

      try {
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        return { phoneNumber, status: response.status, data };
      } catch (error) {
        console.error('Error:', error);
        return { phoneNumber, status: 'Error', error: error.message };
      }
    });

    const results = await Promise.all(requests);

    return res.json({ status: 'Complete', results });
  } catch (error) {
    console.error('Error:', error);
    return res.json({ status: 'Error', error: error.message });
  }
}