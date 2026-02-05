import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Profile() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    api.get("/auth/me").then(r => setMe(r.data));
  }, []);

  if (!me) return <p>Loading...</p>;

  return (
    <div>
      <p>Name: {me.name}</p>
      <p>Email: {me.email}</p>
      <p>Role: {me.role}</p>
    </div>
  );
}
