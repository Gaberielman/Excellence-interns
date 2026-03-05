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
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));

    // Real-time listener: The page updates automatically when an intern posts!
    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            container.innerHTML = '<p class="text-slate-500 col-span-full text-center">No projects posted yet.</p>';
            return;
        }

        container.innerHTML = snapshot.docs.map(doc => {
            const project = doc.data();
            return `
                <div class="bg-card border border-white/5 rounded-3xl overflow-hidden group hover:border-accent/40 transition-all duration-300">
                    <div class="h-full flex flex-col p-8">
                        <div class="flex justify-between items-start">
                            <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                                <i class="fas ${project.icon || 'fa-code'} text-accent text-xl"></i>
                            </div>
                            <a href="${project.link || '#'}" target="_blank" class="text-slate-500 hover:text-white transition-colors">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                        <h3 class="text-xl font-bold text-white group-hover:text-accent transition-colors">${project.title}</h3>
                        <p class="text-slate-400 mt-2 text-sm leading-relaxed">${project.description}</p>
                        <div class="flex flex-wrap gap-2 mt-6">
                            ${project.tags ? project.tags.map(tag => `<span class="text-[10px] uppercase tracking-widest font-bold text-slate-500 border border-white/5 px-2 py-1 rounded-md">${tag}</span>`).join('') : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    });
}