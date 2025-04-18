import { useState, useEffect } from 'react';

export function useScroll() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollDirection, setScrollDirection] = useState('up');
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Update position
            setScrollPosition(currentScrollY);

            // Update direction
            setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');

            // Show scroll-to-top button after scrolling past threshold
            setShowScrollToTop(currentScrollY > 400);

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return {
        scrollPosition,
        scrollDirection,
        showScrollToTop,
        scrollToTop
    };
}