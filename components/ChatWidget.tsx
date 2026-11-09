"use client";

import { useEffect } from "react";
import "@n8n/chat/style.css";

// Public on purpose: the browser calls the n8n Chat Trigger directly.
// Lock it down with the trigger's "Allowed Origins (CORS)" setting.
const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL;

/**
 * The n8n chat bubble, bottom-right on every page. Loads the (large) widget
 * only after the page is interactive, and renders nothing until a webhook
 * URL is configured.
 */
export function ChatWidget() {
  useEffect(() => {
    if (!WEBHOOK_URL) return;
    let app: { unmount: () => void } | undefined;
    let cancelled = false;

    import("@n8n/chat").then(({ createChat }) => {
      if (cancelled) return;
      app = createChat({
        webhookUrl: WEBHOOK_URL,
        target: "#n8n-chat",
        mode: "window",
        showWelcomeScreen: false,
        loadPreviousSession: true,
        initialMessages: [
          "Hi, welcome to The Daily Pour.",
          "Ask about the menu, opening hours or this week's events.",
        ],
        i18n: {
          en: {
            title: "The Daily Pour",
            subtitle: "Questions about coffee, hours or events? Ask away.",
            footer: "",
            getStarted: "New conversation",
            inputPlaceholder: "Type your question…",
            closeButtonTooltip: "Close chat",
          },
        },
      });
    });

    return () => {
      cancelled = true;
      app?.unmount();
    };
  }, []);

  if (!WEBHOOK_URL) return null;
  return <div id="n8n-chat" className="daily-pour-chat" />;
}
