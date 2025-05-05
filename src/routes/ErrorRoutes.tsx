
import { Route } from "react-router-dom";
import NotFound from "@/pages/NotFound";

export const errorRoutes = (
  <>
    <Route path="*" element={<NotFound />} />
  </>
);
