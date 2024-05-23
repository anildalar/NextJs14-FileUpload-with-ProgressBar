import React from 'react'
import ReportComponent from '../components/ReportComponent';

async function getReports(uname) {
  let url = process.env.EXPRESS_API +`/getReports?uname=${uname}`;
  const res = await fetch(url,{ cache: 'no-store' });
  return res.json();
}
async function checkUser(uname,pass) {
  let url = process.env.EXPRESS_API +`/checkUser?uname=${uname}&pass=${pass}`;
  console.log('url',url)
  const res = await fetch(url,{ cache: 'no-store' });
  //
  return res.json();
}

export default async function Page({ searchParams }) {
  const uname = searchParams.uname || 'defaultUser';
  const pass = searchParams.pass || 'defaultPass';
  const res = await checkUser(uname,pass);
  const data2 = await res;
  if (data2.status == 'Success') {
    const resReports = await getReports(uname);
    const data = {
      user: uname,
      pass: pass,
      reports:resReports,
    };
    return (
      <>
        <ReportComponent creds={data} />
      </>
    )
  }else{
    return (
      <>
          <h1 style={{color:'red',textAlign:'center'}}>Invalid credentials</h1>
      </>
    )
  }
  
}
