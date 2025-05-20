<script>
    import { onMount, onDestroy } from 'svelte';

    let m = $state({ x: 0, y: 0 });
    let visible = $state(false); // Start hidden until first mouse move
    let isTouchDevice = $state(false);

    /**
         * @param {{ clientX: number; clientY: number; }} event
     */
    function handleMouseMove(event) {
        m.x = event.clientX;
        m.y = event.clientY;
        if (!visible) {
            visible = true;
        }
    };

    /**
         * @param {{ relatedTarget: EventTarget | null; }} event
     */
    const handleMouseLeave = (event) => {
        if (!event.relatedTarget) {
            visible = false; // Hide when mouse leaves the window
        }
    };

    const handleMouseEnter = () => {
        if (!isTouchDevice) { // Don't show on touch enter if it was hidden
            visible = true;
        }
    };
  
    onMount(() => {
        // Check for touch device on mount
        isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        if (!isTouchDevice) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseout', handleMouseLeave);
            window.addEventListener('mouseenter', handleMouseEnter);
            document.body.style.cursor = 'none'; // Hide default cursor
        }

        // return () => {
        //     if (!isTouchDevice) {
        //         window.removeEventListener('mousemove', handleMouseMove);
        //         window.removeEventListener('mouseleave', handleMouseLeave);
        //         window.removeEventListener('mouseenter', handleMouseEnter);
        //         document.body.style.cursor = 'auto';
        //     }
        // };
    });

    // Configuration for the circle
    const circleSize = 20; // px
    // const circleColor = 'rgba(103, 232, 249, 0.5)';
    // const circleBorder = '2px solid #4075a6';

    // Calculate offset to center the circle on the cursor
    const offsetX = circleSize / 2;
    const offsetY = circleSize / 2;
</script>

{#if visible && !isTouchDevice}
    <div
        class="mouse-follower"
        style="
            transform: translate3d({m.x - offsetX}px, {m.y - offsetY}px, 0);
            width: {circleSize}px;
            height: {circleSize}px;
            background-color: var(--rat-main-color);
            border: 2px solid var(--rat-border-color);
        "
    ></div>
{/if}

<style>
    .mouse-follower {
        position: fixed;
        top: 0;
        left: 0;
        border-radius: 50%;
        pointer-events: none; /* Allows clicks to pass through to elements underneath */
        z-index: 9999;
        /* transition: transform 0.05s linear, opacity 0.2s ease-out; */
        transition: transform 0.05s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease-out;
        will-change: transform; /* Hint to the browser for optimization */
        opacity: 1;
    }

    /* When using the {#if visible} and mouseleave, this isn't strictly needed,
        but good if you wanted to hide it differently, e.g. on idle */
    .mouse-follower:not([style*="transform"]) { /* If no transform, it's likely at 0,0 initially */
        opacity: 0;
    }
</style>