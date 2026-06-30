import { redirect } from "next/navigation";

// The immersive experience is now the site root.
export default function ExperienceRedirect() {
  redirect("/");
}
