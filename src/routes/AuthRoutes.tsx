
import { Route } from "react-router-dom";
import Login from "@/pages/Login";

export const authRoutes = (
  <>
    <Route path="/login" element={<Login />} />
  </>
);
