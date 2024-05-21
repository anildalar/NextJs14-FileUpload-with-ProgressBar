import React from 'react'

// import styles from "./page.module.css";
import ChildComponent from './components/ChildComponent'

async function getNumbers(uname) {
  console.log();
  let url = process.env.EXPRESS_API +`/getNumbers?uname=${uname}`;
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
  //let data2={}
  if (data2.status == 'Success') {
    const res2 = await getNumbers(uname);
    const numbersArray = res2?.data?.map(item => item.number);
    const unames = res2?.data?.map(item => item.username);
    console.log("Numbers",res2);
    const data = {
      user: uname,
      pass: pass,
      numbers:numbersArray,
      unames:unames
    };
    return (
      <>
        <ChildComponent creds={data} />
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
