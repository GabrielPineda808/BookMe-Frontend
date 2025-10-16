import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { all } from "axios";

export default function AuthLayout() {
  return (
    <>
      <Header />

      <Outlet />
    </>
  );
}
