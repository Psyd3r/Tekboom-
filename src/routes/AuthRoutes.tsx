
import { Route } from "react-router-dom";
import Login from "@/pages/Login";

export const AuthRoutes = () => {
  return (
    <>
      <Route path="/login" element={<Login />} />
    </>
  );
};
