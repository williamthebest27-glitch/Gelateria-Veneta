"use server";

import { SITE } from "@/lib/content";

export type ContactState = {
  status: "idle" | "ok" | "error";
  message: string;
};

export const INITIAL_CONTACT_STATE: ContactState = {
  status: "idle",
  message: "Risposta garantita entro 24 ore.",
};

/**
 * Invio del modulo contatti.
 *
 * Se è configurata la variabile d'ambiente `RESEND_API_KEY` il messaggio
 * parte davvero via email; altrimenti il visitatore riceve l'indirizzo
 * diretto a cui scrivere, senza che il modulo finga di aver inviato.
 */
export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Compila tutti i campi prima di inviare." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { status: "error", message: "Controlla l'indirizzo email: non sembra valido." };
  }
  if (message.length > 4000) {
    return { status: "error", message: "Il messaggio è troppo lungo (max 4000 caratteri)." };
  }

  const firstName = name.split(" ")[0];
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? SITE.email;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    return {
      status: "ok",
      message: `Grazie ${firstName}! Scrivici pure a ${SITE.email}: ti rispondiamo in giornata.`,
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Nuovo messaggio dal sito — ${name}`,
        text: `Nome: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend ha risposto ${response.status}`);
    }

    return {
      status: "ok",
      message: `Grazie ${firstName}! Messaggio ricevuto, ti rispondiamo a breve.`,
    };
  } catch {
    return {
      status: "error",
      message: `Invio non riuscito. Scrivici direttamente a ${SITE.email}.`,
    };
  }
}
