"use client";

import { useEffect } from "react";
import "@n8n/chat/style.css";

/**
 * The n8n chat bubble, bottom-right on every page. Messages go to our own
 * /api/chat route, which forwards them to n8n (no CORS, URL stays private).
 * Loads the (large) widget only after the page is interactive, and renders
 * nothing unless the server has a chat URL configured.
 */
export function ChatWidget({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    let app: { unmount: () => void } | undefined;
    let cancelled = false;

    import("@n8n/chat").then(({ createChat }) => {
      if (cancelled) return;
      app = createChat({
        // Must be absolute: the widget parses it with `new URL()`.
        webhookUrl: `${window.location.origin}/api/chat`,
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
  }, [enabled]);

  if (!enabled) return null;
  return <div id="n8n-chat" className="daily-pour-chat" />;
}
