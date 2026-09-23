import React, { useEffect } from 'react';
import StreamOverlay from '../components/OverlayComponents/StreamOverlay';

/**
 * Live Stream Overlay Page
 * Route: /overlay/:username (and /overlay/:creatorId)
 * Renders the cinematic, frameless, queue-managed StreamOverlay on a transparent 100vw/100vh viewport.
 */
export default function Overlay() {
    useEffect(() => {
        // Enforce 100% transparent frameless background for OBS & TikTok LIVE Studio
        document.documentElement.style.background = 'transparent';
        document.documentElement.style.backgroundColor = 'transparent';
        document.body.style.background = 'transparent';
        document.body.style.backgroundColor = 'transparent';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.width = '100vw';
        document.body.style.height = '100vh';
    }, []);

    return <StreamOverlay />;
}
