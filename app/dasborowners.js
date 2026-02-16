import Link from "next/link";

export default function Owners(){
  return(
    <div style={{padding:40}}>
      <h1>Dashboard Owners</h1>
      <Link href="/createakun">
        <button style={{padding:10,marginTop:20}}>Create Account</button>
      </Link>
    </div>
  );
}
