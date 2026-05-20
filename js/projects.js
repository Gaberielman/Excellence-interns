import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB070kdYh4csS856pm4vvLFDx4kC9rFPqc",
    authDomain: "excellence-showcase.firebaseapp.com",
    projectId: "excellence-showcase",
    storageBucket: "excellence-showcase.firebasestorage.app",
    messagingSenderId: "225603204413",
    appId: "1:225603204413:web:cf3a300575808fb8424154"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const container = document.getElementById('project-grid');

if (container) {
    const targetInternId = container.getAttribute('data-intern-id');
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));

    // Real-time listener: The page updates automatically when an intern posts!
    onSnapshot(q, (snapshot) => {
        let docs = snapshot.docs;
        
        // Filter if this page is for a specific intern
        if (targetInternId && targetInternId !== 'all') {
            docs = docs.filter(doc => doc.data().internId === targetInternId);
        }

        if (docs.length === 0) {
            container.innerHTML = '<p class="text-slate-500 col-span-full text-center">No projects posted yet.</p>';
            return;
        }

        container.innerHTML = docs.map(doc => {
            const project = doc.data();
            // If we're on a specific intern's page, direct to gallery. Otherwise, use the external link.
            const projectLink = (targetInternId && targetInternId !== 'all') ? 'gallery.html' : (project.link || '#');
            const targetAttr = (targetInternId && targetInternId !== 'all') ? '' : 'target="_blank"';

            return `
                <div class="glass-card shadow-sm rounded-3xl overflow-hidden group hover:border-[#d4af37]/50 transition-all duration-300">
                    <div class="h-full flex flex-col p-8">
                        <div class="flex justify-between items-start">
                            <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
                                <i class="fas ${project.icon || 'fa-code'} text-[#d4af37] text-xl"></i>
                            </div>
                            <a href="${projectLink}" ${targetAttr} class="text-slate-500 hover:text-slate-900 transition-colors">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 group-hover:text-[#d4af37] transition-colors">${project.title}</h3>
                        <p class="text-slate-600 mt-2 text-sm leading-relaxed">${project.description}</p>
                        <div class="flex flex-wrap gap-2 mt-6">
                            ${project.tags ? project.tags.map(tag => `<span class="text-[10px] uppercase tracking-widest font-bold text-slate-500 border border-slate-200 bg-white px-2 py-1 rounded-md">${tag}</span>`).join('') : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    });
}