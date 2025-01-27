import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="h-[90vh] grid gap-2 place-content-center text-center">
      <h1 className="font-extrabold text-6xl">404</h1>
      <h4>Page not found!</h4>
      <Link to={'/'} className="border bg-pink text-white border-slate-200 p-2 rounded-lg">Back to Home</Link>
    </div>
  );
};

export default ErrorPage;
