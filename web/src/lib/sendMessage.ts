export async function sendMessage(name: string, message: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/.netlify/functions/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || "Failed to send message" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}
