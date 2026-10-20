/**
 * StyleHub / XPORD - Authentication Helper & Domain Authorization Handler
 */

/**
 * Displays a clear, user-friendly modal when Firebase throws auth/unauthorized-domain.
 * Provides direct one-click domain copying, step-by-step instructions for Firebase Console,
 * and a quick fallback button to login with Email & Password.
 */
export function showUnauthorizedDomainModal(options = {}) {
  const currentDomain = window.location.hostname;
  const existingModal = document.getElementById("firebase-unauthorized-domain-modal");
  if (existingModal) existingModal.remove();

  const overlay = document.createElement("div");
  overlay.id = "firebase-unauthorized-domain-modal";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 100000;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    animation: fadeInModal 0.2s ease-out;
  `;

  // Inject keyframe animation if not present
  if (!document.getElementById("auth-modal-anim-style")) {
    const animStyle = document.createElement("style");
    animStyle.id = "auth-modal-anim-style";
    animStyle.textContent = `
      @keyframes fadeInModal {
        from { opacity: 0; transform: scale(0.97); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(animStyle);
  }

  overlay.innerHTML = `
    <div style="
      background: #ffffff;
      border-radius: 16px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
      overflow: hidden;
      border: 1px solid #e2e8f0;
    ">
      <div style="background: #fff1f2; padding: 18px 22px; border-bottom: 1px solid #fecdd3; display: flex; align-items: flex-start; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 38px; height: 38px; border-radius: 50%; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; flex-shrink: 0;">
            ⚠️
          </div>
          <div>
            <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #9f1239;">Firebase: Unauthorized Domain</h3>
            <p style="margin: 2px 0 0; font-size: 12px; color: #be123c;">Google Sign-In ke liye is domain ko authorize karein</p>
          </div>
        </div>
        <button id="close-domain-modal" aria-label="Close" style="background: none; border: none; font-size: 24px; line-height: 1; color: #9ca3af; cursor: pointer; padding: 0 4px;">&times;</button>
      </div>

      <div style="padding: 20px 22px; color: #334155; font-size: 13.5px; line-height: 1.5;">
        <p style="margin: 0 0 12px; color: #475569;">
          Firebase security rules ke mutabiq Google OAuth popup keval <b>Authorized Domains</b> par hi kaam karta hai.
        </p>

        <label style="display: block; font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 6px;">
          Aapka Current Domain:
        </label>
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
          <input id="domain-copy-input" type="text" readonly value="${currentDomain}" style="flex: 1; padding: 8px 12px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; color: #0f172a; outline: none;">
          <button id="copy-domain-btn" style="padding: 8px 14px; background: #0f172a; color: #ffffff; border: none; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.2s;">
            Copy Domain
          </button>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; margin-bottom: 16px;">
          <div style="font-weight: 600; color: #0f172a; margin-bottom: 6px; font-size: 12.5px;">Google Sign-In Enable Karne Ke Steps:</div>
          <ol style="margin: 0; padding-left: 18px; font-size: 12px; color: #475569; display: flex; flex-direction: column; gap: 4px;">
            <li>Firebase Console (<a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">console.firebase.google.com</a>) kholein.</li>
            <li>Project <b>aesthetic-mile-cf6jr</b> select karein.</li>
            <li>Left menu se <b>Build &gt; Authentication &gt; Settings</b> tab par jayein.</li>
            <li><b>Authorized domains</b> me <b>Add domain</b> par click karke upar ka domain paste karein.</li>
          </ol>
        </div>

        <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 10px; padding: 12px 14px; margin-bottom: 18px;">
          <div style="font-weight: 600; color: #1e40af; font-size: 12.5px; margin-bottom: 2px;">⚡ Turant Login Karein (No Setup Needed):</div>
          <p style="margin: 0; font-size: 12px; color: #1e3a8a;">
            Aap <b>Email & Password</b> daal kar bina kisi domain authorization ke turant Login ya Sign Up kar sakte hain!
          </p>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button id="use-email-instead-btn" style="flex: 1; min-width: 200px; padding: 11px 16px; background: #2563eb; color: #ffffff; border: none; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; transition: background 0.15s;">
            Email & Password Se Login Karein
          </button>
          <button id="dismiss-domain-modal" style="padding: 11px 18px; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer;">
            Close
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close handlers
  overlay.querySelector("#close-domain-modal")?.addEventListener("click", () => overlay.remove());
  overlay.querySelector("#dismiss-domain-modal")?.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  // Copy handler
  const copyBtn = overlay.querySelector("#copy-domain-btn");
  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(currentDomain);
      copyBtn.textContent = "Copied! ✓";
      copyBtn.style.background = "#16a34a";
      setTimeout(() => {
        copyBtn.textContent = "Copy Domain";
        copyBtn.style.background = "#0f172a";
      }, 2500);
    } catch {
      const inp = overlay.querySelector("#domain-copy-input");
      inp?.select();
      document.execCommand("copy");
      copyBtn.textContent = "Copied! ✓";
      setTimeout(() => {
        copyBtn.textContent = "Copy Domain";
      }, 2500);
    }
  });

  // Fallback to Email/Password
  overlay.querySelector("#use-email-instead-btn")?.addEventListener("click", () => {
    overlay.remove();
    if (typeof options.onUseEmail === "function") {
      options.onUseEmail();
    }
  });
}
