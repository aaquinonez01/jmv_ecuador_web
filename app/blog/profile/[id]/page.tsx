import { Metadata } from "next";
import ProfilePageClient from "./ProfilePageClient";

export const metadata: Metadata = {
  title: "Perfil | JMV Ecuador",
  description: "Perfil de usuario en JMV Ecuador",
  keywords: ["JMV Ecuador", "perfil"],
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
