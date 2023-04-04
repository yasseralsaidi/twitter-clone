// import "./globals.css";
// import { Toaster } from "react-hot-toast";

import Layout from "@/components/Layout";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import "@/styles/globals.css";
import EditProfileModal from "@/components/modals/EditProfileModal";
import EditTweetModal from "@/components/modals/EditTweetModal";
import ToasterProvider from "./providers/ToasterProvider";

export const metadata = {
  title: "myTwittery",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToasterProvider />
        <RegisterModal />
        <LoginModal />
        <EditProfileModal />
        <EditTweetModal />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
