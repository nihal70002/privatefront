import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Private E-Commerce</h1>
      <Link to="/login" className="mt-6 text-blue-600">Login</Link>
    </div>
  );
}
