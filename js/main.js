document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Scroll Reveal
    const cards = document.querySelectorAll('section');
    
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.9;
        
        cards.forEach((card, index) => {
            // Add initial reveal class
            card.classList.add('reveal');
            
            const cardTop = card.getBoundingClientRect().top;
            
            if (cardTop < triggerBottom) {
                // Staggered delay based on index
                setTimeout(() => {
                    card.classList.add('active');
                }, index * 50); 
            }
        });
    };

    // Run on load and on scroll
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // 2. Interactive "Let's Chat" button
    const contactBtn = document.querySelector('.bg-accent.cursor-pointer');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            window.location.href = "mailto:gabriel@example.com?subject=Project Inquiry";
        });
    }
});

document.addEventListener('mousemove', (e) => {
    const cursor = document.getElementById('custom-cursor');
    const dot = document.getElementById('cursor-dot');
    
    // Smooth movement with requestAnimationFrame for performance
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
});

// Cursor "Squeeze" effect on clicks
document.addEventListener('mousedown', () => {
    document.getElementById('custom-cursor').style.transform = 'translate(-50%, -50%) scale(0.7)';
});
document.addEventListener('mouseup', () => {
    document.getElementById('custom-cursor').style.transform = 'translate(-50%, -50%) scale(1)';
});

