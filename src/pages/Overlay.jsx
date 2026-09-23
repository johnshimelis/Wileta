import React, { useEffect } from 'react';
import StreamOverlay from '../components/OverlayComponents/StreamOverlay';

/**
 * Live Stream Overlay Page
 * Route: /overlay/:username (and /overlay/:creatorId)
 * Renders the multi-tiered, queue-managed StreamOverlay on a transparent 1920x1080 viewport.
 */
export default function Overlay() {
    useEffect(() => {
        // Enforce 100% transparent background and zero scrollbars for OBS & TikTok LIVE Studio
        document.documentElement.style.backgroundColor = 'transparent';
        document.body.style.backgroundColor = 'transparent';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.width = '1920px';
        document.body.style.height = '1080px';
    }, []);

    return <StreamOverlay />;
}
