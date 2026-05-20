// ============================================================
//  EmailJS Configuration — Replace these 3 values with yours
// ============================================================
const EMAILJS_PUBLIC_KEY  = "Rp2YMSIGApI_RP1dX";
const EMAILJS_SERVICE_ID  = "service_dtq024q";
const EMAILJS_TEMPLATE_ID = "template_ge9wk69";
// ============================================================

(function () {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
})();

// ── Toast notification ──────────────────────────────────────
function showToast(message, type = "success") {
    // Remove any existing toast
    const existing = document.getElementById("ejs-toast");
    if (existing) existing.remove();

    const icon   = type === "success" ? "fa-circle-check" : "fa-circle-xmark";
    const bg     = type === "success" ? "#22c55e" : "#ef4444";
    const border = type === "success" ? "#16a34a" : "#dc2626";

    const toast = document.createElement("div");
    toast.id = "ejs-toast";
    toast.innerHTML = `<i class="fas ${icon}" style="font-size:1.2rem;"></i><span>${message}</span>`;
    Object.assign(toast.style, {
        position:      "fixed",
        bottom:        "2rem",
        right:         "2rem",
        zIndex:        "9999",
        display:       "flex",
        alignItems:    "center",
        gap:           "0.75rem",
        padding:       "1rem 1.5rem",
        borderRadius:  "0.875rem",
        background:    bg,
        border:        `1px solid ${border}`,
        color:         "#fff",
        fontFamily:    "Outfit, sans-serif",
        fontWeight:    "600",
        fontSize:      "0.95rem",
        boxShadow:     "0 8px 30px rgba(0,0,0,0.15)",
        opacity:       "0",
        transform:     "translateY(1rem)",
        transition:    "opacity 0.35s ease, transform 0.35s ease",
    });

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.opacity   = "1";
        toast.style.transform = "translateY(0)";
    });

    // Animate out after 4 s
    setTimeout(() => {
        toast.style.opacity   = "0";
        toast.style.transform = "translateY(1rem)";
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ── Form submit handler ─────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const form   = document.getElementById("contact-form");
    const btn    = document.getElementById("submit-btn");
    if (!form || !btn) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Loading state
        const originalText = btn.innerHTML;
        btn.disabled    = true;
        btn.innerHTML   = `<i class="fas fa-spinner fa-spin mr-2"></i>Sending…`;
        btn.style.opacity = "0.75";

        const templateParams = {
            from_name : document.getElementById("field-name").value.trim(),
            from_email: document.getElementById("field-email").value.trim(),
            phone     : document.getElementById("field-phone").value.trim(),
            interest  : document.getElementById("field-interest").value,
        };

        try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
            showToast("🎉 Your application was sent successfully!", "success");
            form.reset();
        } catch (err) {
            console.error("EmailJS error:", err);
            showToast("Oops! Something went wrong. Please try again.", "error");
        } finally {
            btn.disabled      = false;
            btn.innerHTML     = originalText;
            btn.style.opacity = "1";
        }
    });
});
