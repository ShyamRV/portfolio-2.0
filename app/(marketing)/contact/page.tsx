import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/contact-form";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container max-w-xl space-y-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="text-muted-foreground">
        Messages are stored in Supabase (contact_messages). No third-party email
        SaaS — stays zero-cost.
      </p>
      <ContactForm />
    </div>
  );
}
