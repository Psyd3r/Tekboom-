
import { Route } from "react-router-dom";
import NotFound from "@/pages/NotFound";

export const ErrorRoutes = () => {
  return (
    <>
      <Route path="*" element={<NotFound />} />
    </>
  );
};
