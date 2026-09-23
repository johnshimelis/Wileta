import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AnimatePresence } from 'framer-motion';

import CinematicAlert from './CinematicAlert';

// Dynamic WebM Video Asset & Timing Mapping
export const VIDEO_CONFIG_MAP = {
    tier1_sparkle: {
        videoSrc: '/assets/alerts/sparkle_burst.webm',
        objectFit: 'contain',
        placement: 'lower_third',
        climaxDelay: 400,
        fallbackDuration: 5500,
        audioTier: 'low',
        badgeText: 'GURSHA SPARKLE',
        badgeIcon: '✨',
        titleSize: '3.1rem',
        messageSize: '1.45rem',
        videoFilter: 'drop-shadow(0 0 35px rgba(245, 158, 11, 0.75))'
    },
    tier2_obelisk: {
        videoSrc: '/assets/alerts/3d_axum_obelisk.webm',
        objectFit: 'contain',
        placement: 'center',
        climaxDelay: 750,
        fallbackDuration: 8000,
        audioTier: 'mid',
        badgeText: 'AXUM CELESTIAL BEACON',
        badgeIcon: '🏛️',
        titleSize: '3.6rem',
        messageSize: '1.65rem',
        videoFilter: 'drop-shadow(0 0 45px rgba(56, 189, 248, 0.85)) drop-shadow(0 0 25px rgba(245, 158, 11, 0.6))'
    },
    tier3_lion: {
        videoSrc: '/assets/alerts/3d_royal_lion.webm',
        objectFit: 'cover',
        placement: 'center',
        climaxDelay: 1100,
        fallbackDuration: 11500,
        audioTier: 'high',
        enableStageDimming: true,
        badgeText: 'ROYAL LION HERO GURSHA',
        badgeIcon: '👑',
        titleSize: '4.4rem',
        messageSize: '1.9rem',
        videoFilter: 'drop-shadow(0 0 65px rgba(245, 158, 11, 0.95)) drop-shadow(0 0 35px rgba(16, 185, 129, 0.7))'
    }
};

/**
 * Determine animationId from amount or explicit payload
 */
export function getAnimationId(amount, explicitId) {
    if (explicitId && VIDEO_CONFIG_MAP[explicitId]) {
        return explicitId;
    }
    const val = Number(amount) || 0;
    if (val >= 200) return 'tier3_lion';
    if (val >= 50) return 'tier2_obelisk';
    return 'tier1_sparkle';
}

/**
 * StreamOverlay Main Orchestrator
 * - 100% Frameless Architecture (No boxes, no cards, no borders)
 * - Cinematic WebM Video Engine with native alpha transparency
 * - Synchronized 3D Framer-Motion Typography
 * - Queue System triggered by video onEnded
 */
export default function StreamOverlay() {
    const { username, creatorId } = useParams();
    const targetUsername = username || creatorId;
    const [searchParams] = useSearchParams();

    // Alert Queue Management
    const [alertQueue, setAlertQueue] = useState([]);
    const [currentAlert, setCurrentAlert] = useState(null);

    // Deduping reference to prevent double processing
    const processedTxRefs = useRef(new Set());

    // Enqueue incoming tips
    const enqueueAlert = useCallback((rawPayload) => {
        if (!rawPayload) return;

        // Dedup by tx_ref if present
        if (rawPayload.tx_ref) {
            if (processedTxRefs.current.has(rawPayload.tx_ref)) {
                return;
            }
            processedTxRefs.current.add(rawPayload.tx_ref);
            if (processedTxRefs.current.size > 200) {
                processedTxRefs.current.clear();
            }
        }

        const animationId = getAnimationId(rawPayload.amount, rawPayload.animationId || rawPayload.tier);
        const standardized = {
            id: rawPayload.tx_ref || `alert_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            animationId,
            senderName: rawPayload.senderName || rawPayload.supporterName || rawPayload.tipperPhone || 'A Supporter',
            amount: Number(rawPayload.amount || 0),
            message: rawPayload.message || '',
            gift: rawPayload.gift || ''
        };

        console.log(`[StreamOverlay] Enqueued [${animationId}]:`, standardized);
        setAlertQueue(prev => [...prev, standardized]);
    }, []);

    // Queue Consumer Loop: Picks next alert when current is unmounted
    useEffect(() => {
        if (currentAlert || alertQueue.length === 0) {
            return;
        }

        // Dequeue next alert
        const nextAlert = alertQueue[0];
        setAlertQueue(prev => prev.slice(1));
        setCurrentAlert(nextAlert);
    }, [currentAlert, alertQueue]);

    // Callback when current video finishes playing (onEnded)
    const handleAlertComplete = useCallback(() => {
        console.log('[StreamOverlay] Current alert finished. Clearing screen & advancing queue.');
        setCurrentAlert(null);
    }, []);

    // Socket.IO Subscription & OBS Transparent Viewport
    useEffect(() => {
        // Enforce 100% frameless transparency
        document.documentElement.style.background = 'transparent';
        document.documentElement.style.backgroundColor = 'transparent';
        document.body.style.background = 'transparent';
        document.body.style.backgroundColor = 'transparent';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.width = '100vw';
        document.body.style.height = '100vh';

        const socketBaseUrl = import.meta.env.VITE_API_URL 
            ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') 
            : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:5000'
                : 'https://wileta-backend.onrender.com');

        console.log(`[StreamOverlay] Connecting to Socket: ${socketBaseUrl}`);
        const socket = io(socketBaseUrl, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 10,
            timeout: 10000
        });

        socket.on('connect', () => {
            console.log(`[StreamOverlay] Socket connected. Joining room: ${targetUsername}`);
            if (targetUsername) {
                socket.emit('join_overlay', targetUsername);
                socket.emit('join', targetUsername);
            }
        });

        // Listen for standardized cinematic tip alerts
        socket.on('gursha_tip', (data) => {
            enqueueAlert(data);
        });

        socket.on('new_tip', (data) => {
            enqueueAlert(data);
        });

        socket.on('tip_alert', (data) => {
            enqueueAlert(data);
        });

        // URL Query Param Testing:
        // /overlay/:username?test=tier1_sparkle | tier2_obelisk | tier3_lion | queue
        const testParam = searchParams.get('test') || searchParams.get('preview') || searchParams.get('animation');
        if (testParam) {
            setTimeout(() => {
                if (testParam === 'tier1_sparkle' || testParam === 'sparkle' || testParam === 'low' || testParam === 'true') {
                    enqueueAlert({ animationId: 'tier1_sparkle', senderName: 'Selamawit T.', amount: 45, message: 'Keep shining on live! ☕️✨' });
                } else if (testParam === 'tier2_obelisk' || testParam === 'obelisk' || testParam === 'mid') {
                    enqueueAlert({ animationId: 'tier2_obelisk', senderName: 'Dawit Bekele', amount: 150, message: 'Axum Celestial Beacon for the stream! 🏛️⚡️' });
                } else if (testParam === 'tier3_lion' || testParam === 'lion' || testParam === 'high') {
                    enqueueAlert({ animationId: 'tier3_lion', senderName: 'Kassahun M.', amount: 500, message: 'Royal Lion of Judah imperial salute! 👑🦁' });
                } else if (testParam === 'queue') {
                    // Queue all 3 sequentially to demonstrate collision-free playback
                    enqueueAlert({ animationId: 'tier1_sparkle', senderName: 'Selamawit T.', amount: 25, message: 'First gift in queue! ✨' });
                    enqueueAlert({ animationId: 'tier2_obelisk', senderName: 'Dawit Bekele', amount: 100, message: 'Second gift waiting its turn! 🏛️' });
                    enqueueAlert({ animationId: 'tier3_lion', senderName: 'Kassahun M.', amount: 1000, message: 'Grand finale royal hero gift! 👑🦁' });
                }
            }, 500);
        }

        return () => {
            socket.disconnect();
        };
    }, [targetUsername, searchParams, enqueueAlert]);

    // Active configuration for current alert
    const activeConfig = currentAlert 
        ? (VIDEO_CONFIG_MAP[currentAlert.animationId] || VIDEO_CONFIG_MAP.tier1_sparkle) 
        : null;

    return (
        <div 
            id="stream-overlay-root"
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                background: 'transparent',
                backgroundColor: 'transparent',
                overflow: 'hidden',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 9999
            }}
        >
            <AnimatePresence mode="wait">
                {currentAlert && activeConfig && (
                    <CinematicAlert
                        key={currentAlert.id}
                        alert={currentAlert}
                        config={activeConfig}
                        onComplete={handleAlertComplete}
                    />
                )}
            </AnimatePresence>

            {/* Strict Frameless Transparency Overrides (Zero boxes) */}
            <style dangerouslySetInnerHTML={{__html: `
                html, body, #root, #stream-overlay-root {
                    background: transparent !important;
                    background-color: transparent !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: hidden !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    border: none !important;
                    box-shadow: none !important;
                }
            `}} />
        </div>
    );
}
