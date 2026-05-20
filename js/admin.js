const firebaseConfig = {
    apiKey: "AIzaSyB070kdYh4csS856pm4vvLFDx4kC9rFPqc",
    authDomain: "excellence-showcase.firebaseapp.com",
    projectId: "excellence-showcase",
    storageBucket: "excellence-showcase.firebasestorage.app",
    messagingSenderId: "225603204413",
    appId: "1:225603204413:web:cf3a300575808fb8424154"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// ── Toast notification ──────────────────────────────────────
function showAdminToast(message, type = "success") {
    const existing = document.getElementById("admin-toast");
    if (existing) existing.remove();

    const icon   = type === "success" ? "fa-circle-check" : "fa-circle-xmark";
    const bg     = type === "success" ? "#22c55e" : "#ef4444";
    const border = type === "success" ? "#16a34a" : "#dc2626";

    const toast = document.createElement("div");
    toast.id = "admin-toast";
    toast.innerHTML = `<i class="fas ${icon}" style="font-size:1.1rem;"></i><span>${message}</span>`;
    Object.assign(toast.style, {
        position:     "fixed",
        bottom:       "2rem",
        right:        "2rem",
        zIndex:       "9999",
        display:      "flex",
        alignItems:   "center",
        gap:          "0.75rem",
        padding:      "1rem 1.5rem",
        borderRadius: "0.875rem",
        background:   bg,
        border:       `1px solid ${border}`,
        color:        "#fff",
        fontFamily:   "Outfit, sans-serif",
        fontWeight:   "600",
        fontSize:     "0.9rem",
        boxShadow:    "0 8px 30px rgba(0,0,0,0.15)",
        opacity:      "0",
        transform:    "translateY(1rem)",
        transition:   "opacity 0.3s ease, transform 0.3s ease",
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity   = "1";
        toast.style.transform = "translateY(0)";
    });
    setTimeout(() => {
        toast.style.opacity   = "0";
        toast.style.transform = "translateY(1rem)";
        setTimeout(() => toast.remove(), 350);
    }, 4000);
}

// ── Firebase anonymous sign-in (called after local login passes) ──
// This satisfies Firestore security rules (request.auth != null)
window.signInToFirebase = function () {
    return auth.signInAnonymously()
        .then(() => console.log("Firebase: signed in anonymously ✓"))
        .catch(err => console.warn("Firebase anon auth failed:", err.message));
};

// ── Project form submit ─────────────────────────────────────
document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled  = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Publishing…`;

    const tagsInput = document.getElementById('tags').value;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [];

    // Make sure we are signed in before writing
    if (!auth.currentUser) {
        await window.signInToFirebase();
    }

    try {
        await db.collection("projects").add({
            internId:    document.getElementById('internId').value,
            title:       document.getElementById('title').value,
            description: document.getElementById('description').value,
            icon:        'fa-laptop-code',
            link:        document.getElementById('link').value || '#',
            tags:        tags,
            createdAt:   firebase.firestore.FieldValue.serverTimestamp()
        });
        showAdminToast("🚀 Project published! It's live in the gallery.", "success");
        e.target.reset();
    } catch (err) {
        console.error("Firestore error:", err);
        if (err.code === "permission-denied") {
            showAdminToast(
                "Permission denied. Set Firestore rules to allow writes, or enable Anonymous Auth in Firebase console.",
                "error"
            );
        } else {
            showAdminToast("Upload failed: " + err.message, "error");
        }
    } finally {
        btn.disabled  = false;
        btn.innerHTML = originalText;
    }
});

// ── Sign Out ────────────────────────────────────────────────
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        auth.signOut().finally(() => {
            window.location.href = 'index.html';
        });
    });
}