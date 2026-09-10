// vite.config.ts — Configuration file for the Vite build tool.
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Vite plugin to handle /api/contact during local development
function contactDevApiPlugin() {
  return {
    name: "contact-dev-api",
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url === "/api/contact" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk: any) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              const { name, email, message } = JSON.parse(body || "{}");
              if (!name || !email || !message) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Missing required fields (name, email, message)." }));
                return;
              }

              const resendApiKey = process.env.RESEND_API_KEY;
              if (!resendApiKey) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "RESEND_API_KEY is not configured in .env file." }));
                return;
              }

              const recipientEmail = process.env.CONTACT_EMAIL || "asahjada786@gmail.com";

              const response = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${resendApiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  from: "Portfolio Contact Form <onboarding@resend.dev>",
                  to: [recipientEmail],
                  reply_to: email,
                  subject: `New Portfolio Message from ${name}`,
                  text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                  html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
                      <div style="background: linear-gradient(135deg, #0ea5e9, #6366f1); padding: 24px; color: #ffffff; text-align: center;">
                        <h2 style="margin: 0; font-size: 22px; font-weight: 700;">📬 New Portfolio Contact Message</h2>
                      </div>
                      <div style="padding: 28px;">
                        <div style="margin-bottom: 18px;">
                          <p style="margin: 0 0 4px 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase;">From</p>
                          <p style="margin: 0; font-size: 16px; font-weight: 600; color: #0f172a;">${name}</p>
                        </div>
                        <div style="margin-bottom: 22px;">
                          <p style="margin: 0 0 4px 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase;">Email Address</p>
                          <p style="margin: 0; font-size: 15px; color: #0284c7;"><a href="mailto:${email}">${email}</a></p>
                        </div>
                        <div style="border-top: 1px solid #e2e8f0; padding-top: 18px;">
                          <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase;">Message</p>
                          <div style="white-space: pre-wrap; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; color: #334155; font-size: 15px; line-height: 1.6;">${message}</div>
                        </div>
                      </div>
                      <div style="background-color: #f1f5f9; padding: 14px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
                        Sent from your portfolio website • Reply directly to this email to contact ${name}
                      </div>
                    </div>
                  `,
                }),
              });

              const result = await response.json();
              if (!response.ok) {
                res.statusCode = response.status;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: result.message || "Failed to send email via Resend" }));
                return;
              }

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: true, id: result.id }));
            } catch (error: any) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: error.message || "Internal server error" }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

  return {
    base: "/",
    plugins: [
      react(),
      tailwindcss(),
      contactDevApiPlugin(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
  };
});
