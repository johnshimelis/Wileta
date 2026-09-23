import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AnimatePresence } from 'framer-motion';

import Tier1Alert from './Tier1Alert';
import Tier2Alert from './Tier2Alert';
import Tier3Alert from './Tier3Alert';

// Component Mapping reading animationId
const ANIMATION_COMPONENTS = {
    tier1_sparkle: Tier1Alert,
    tier2_obelisk: Tier2Alert,
    tier3_lion: Tier3Alert,
    // Backward compatibility aliases
    tier_low: Tier1Alert,
    tier_mid: Tier2Alert,
    tier_high: Tier3Alert
};

/**
 * Resolve animationId from amount or explicit payload
 */
export function getAnimationId(amount, explicitId) {
    if (explicitId && ANIMATION_COMPONENTS[explicitId]) {
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
 * - Robust Sequential Queue: Guarantees active animation finishes before next triggers
 * - Multi-tier cinematic Lottie & Particle renderers
 */
export default function StreamOverlay() {
    const { username, creatorId } = useParams();
    const targetUsername = username || creatorId;
    const [searchParams] = useSearchParams();

    // Alert Queue Management
    const [alertQueue, setAlertQueue] = useState([]);
    const [currentAlert, setCurrentAlert] = useState(null);

    // Deduping reference to avoid double-processing
    const processedTxRefs = useRef(new Set());
    const timerRef = useRef(null);

    // Enqueue incoming tips
    const enqueueAlert = useCallback((rawPayload) => {
        if (!rawPayload) return;

        // Dedup by tx_ref if available
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

    // Sequential Queue Consumer: Strictly waits until active animation unmounts
    useEffect(() => {
        if (currentAlert || alertQueue.length === 0) {
            return;
        }

        // Dequeue next alert
        const nextAlert = alertQueue[0];
        setAlertQueue(prev => prev.slice(1));
        setCurrentAlert(nextAlert);

        // Strict timeout per tier:
        // Tier 3 Hero (Lion/Castle): 12,000ms
        // Tier 2 Mid (Obelisk): 8,500ms
        // Tier 1 Low (Sparkle): 5,500ms
        const duration = nextAlert.animationId === 'tier3_lion'
            ? 12000
            : (nextAlert.animationId === 'tier2_obelisk' ? 8500 : 5500);

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            // Unmount current animation completely, freeing the stage for the next alert in queue
            setCurrentAlert(null);
        }, duration);

    }, [currentAlert, alertQueue]);

    // Socket.IO Subscription & OBS Transparent Styling
    useEffect(() => {
        // Enforce completely frameless 100vw x 100vh transparent body
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

        // Listen for standardized cinematic tip events
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
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [targetUsername, searchParams, enqueueAlert]);

    // Active Animation Component
    const ActiveComponent = currentAlert ? (ANIMATION_COMPONENTS[currentAlert.animationId] || Tier1Alert) : null;

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
                {currentAlert && ActiveComponent && (
                    <ActiveComponent 
                        key={currentAlert.id}
                        alert={currentAlert}
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
