import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB070kdYh4csS856pm4vvLFDx4kC9rFPqc",
    authDomain: "excellence-showcase.firebaseapp.com",
    projectId: "excellence-showcase",
    storageBucket: "excellence-showcase.firebasestorage.app",
    messagingSenderId: "225603204413",
    appId: "1:225603204413:web:cf3a300575808fb8424154"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
    } else {
        loginSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
    }
});

// Login Function
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) { alert("Login Error: " + err.message); }
});

// Upload Function
document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tags = document.getElementById('tags').value.split(',').map(t => t.trim());

    try {
        await addDoc(collection(db, "projects"), {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            icon: document.getElementById('icon').value || 'fa-code',
            link: document.getElementById('link').value || '#',
            tags: tags,
            createdAt: serverTimestamp()
        });
        alert("Project Live!");
        e.target.reset();
    } catch (err) { alert("Upload Error: " + err.message); }
});

// Sign Out Logic
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            alert("Signed out successfully");
        }).catch((error) => {
            console.error("Sign out error", error);
        });
    });
}