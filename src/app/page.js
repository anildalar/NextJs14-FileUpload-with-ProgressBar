import React from 'react'

// import styles from "./page.module.css";
import ChildComponent from './components/ChildComponent'

async function checkUser(uname,pass) {
  let url = process.env.EXPRESS_API +`/checkUser?uname=${uname}&pass=${pass}`;
  console.log('url',url)
  const res = await fetch(url);
  //
  return res.json();
}

export default async function Page({ searchParams }) {
  const uname = searchParams.uname || 'defaultUser';
  const pass = searchParams.pass || 'defaultPass';
  const res = await checkUser(uname,pass);
  console.log('res>>>>',res)
  const data2 = await res;
  console.log('data2>>',data2)
  //let data2={}
  if (data2.status == 'Success') {
    const data = {
      user: uname,
      pass: pass,
    };
    return (
      <>
        <ChildComponent creds={data} />
      </>
    )
  }else{
    return (
      <>
          <h1 style={{color:'red',textAlign:'center'}}>Invalid Credentilas</h1>
      </>
    )
  }
  
}
