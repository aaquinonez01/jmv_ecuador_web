import { Metadata } from "next";
import ProfilePageClient from "./ProfilePageClient";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  return {
    title: "Perfil | JMV Ecuador",
    description: "Perfil de usuario en JMV Ecuador",
    keywords: ["JMV Ecuador", "perfil"],
  };
}

export default function ProfilePage() {
  return <ProfilePageClient />;
}
