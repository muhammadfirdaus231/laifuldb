import Link from "next/link";

export default function Devs(){
  return(
    <div style={{padding:40}}>
      <h1>Dashboard Developers</h1>
      <Link href="/createakun">
        <button style={{padding:10,marginTop:20}}>Create Account</button>
      </Link>
    </div>
  );
}
