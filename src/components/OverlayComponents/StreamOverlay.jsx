import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AnimatePresence } from 'framer-motion';

import LowTierAlert from './LowTierAlert';
import MidTierAlert from './MidTierAlert';
import HighTierAlert from './HighTierAlert';

// Object Map routing incoming socket data to specific tier component
const TIER_COMPONENTS = {
    tier_low: LowTierAlert,
    tier_mid: MidTierAlert,
    tier_high: HighTierAlert,
    // Aliases
    tier1_sparkle: LowTierAlert,
    tier2_obelisk: MidTierAlert,
    tier3_lion: HighTierAlert
};

/**
 * Determine alert tier from tip amount
 */
export function getTipTier(amount, explicitTier) {
    if (explicitTier && TIER_COMPONENTS[explicitTier]) {
        return explicitTier;
    }
    const val = Number(amount) || 0;
    if (val >= 201) return 'tier_high';
    if (val >= 51) return 'tier_mid';
    return 'tier_low';
}

/**
 * StreamOverlay Main Orchestrator (Multi-Tiered Ethiopian Cultural System)
 * - Manages an Alert Queue for sequential playback without overlapping
 * - Subscribes to Socket.IO 'gursha_tip', 'new_tip', and 'tip_alert' events
 * - Enforces transparent 1920x1080 canvas for OBS Studio & TikTok LIVE Studio
 */
export default function StreamOverlay() {
    const { username, creatorId } = useParams();
    const targetUsername = username || creatorId;
    const [searchParams] = useSearchParams();

    // Alert Queue Management
    const [alertQueue, setAlertQueue] = useState([]);
    const [currentAlert, setCurrentAlert] = useState(null);
    const [isExiting, setIsExiting] = useState(false);

    // Deduping reference to prevent duplicate triggers from simultaneous events
    const processedTxRefs = useRef(new Set());
    const exitTimerRef = useRef(null);
    const dismissTimerRef = useRef(null);

    // Enqueue an incoming alert
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

        const tier = getTipTier(rawPayload.amount, rawPayload.tier || rawPayload.animationId);
        const standardized = {
            id: rawPayload.tx_ref || `alert_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            tier,
            senderName: rawPayload.senderName || rawPayload.supporterName || rawPayload.tipperPhone || 'A Supporter',
            amount: Number(rawPayload.amount || 0),
            message: rawPayload.message || '',
            gift: rawPayload.gift || ''
        };

        console.log(`[StreamOverlay] Enqueueing [${tier}] alert:`, standardized);
        setAlertQueue(prev => [...prev, standardized]);
    }, []);

    // Queue Consumer Loop: play alerts sequentially
    useEffect(() => {
        if (currentAlert || alertQueue.length === 0) {
            return;
        }

        // Pop next alert from queue
        const nextAlert = alertQueue[0];
        setAlertQueue(prev => prev.slice(1));
        setCurrentAlert(nextAlert);
        setIsExiting(false);

        // Tier-specific timing
        // Low: 7.5s (fade at 6.8s) | Mid: 9.5s (fade at 8.7s) | High: 12.0s (fade at 11.0s)
        const duration = nextAlert.tier === 'tier_high' 
            ? 12000 
            : (nextAlert.tier === 'tier_mid' ? 9500 : 7500);
        const fadeDelay = duration - 800;

        if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);

        exitTimerRef.current = setTimeout(() => {
            setIsExiting(true);
        }, fadeDelay);

        dismissTimerRef.current = setTimeout(() => {
            setCurrentAlert(null);
            setIsExiting(false);
        }, duration);

    }, [currentAlert, alertQueue]);

    // Socket.IO Subscription & OBS Transparent Styling
    useEffect(() => {
        // Enforce 100% transparent background and zero scrollbars
        document.documentElement.style.backgroundColor = 'transparent';
        document.body.style.backgroundColor = 'transparent';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.width = '1920px';
        document.body.style.height = '1080px';

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
            console.log(`[StreamOverlay] Socket connected. Joining creator room: ${targetUsername}`);
            if (targetUsername) {
                socket.emit('join_overlay', targetUsername);
                socket.emit('join', targetUsername);
            }
        });

        // Listen for standardized multi-tiered tip alerts
        socket.on('gursha_tip', (data) => {
            enqueueAlert(data);
        });

        // Backward compatibility for existing tip alerts
        socket.on('new_tip', (data) => {
            enqueueAlert(data);
        });

        socket.on('tip_alert', (data) => {
            enqueueAlert(data);
        });

        // URL Query Param Test Preview:
        // /overlay/:username?test=low | mid | high | queue
        const testParam = searchParams.get('test') || searchParams.get('preview') || searchParams.get('tier');
        if (testParam) {
            setTimeout(() => {
                if (testParam === 'low' || testParam === 'true' || testParam === 'tier1_sparkle') {
                    enqueueAlert({ tier: 'tier_low', senderName: 'Selamawit T.', amount: 45, message: 'Love the stream! ☕️🇪🇹' });
                } else if (testParam === 'mid' || testParam === 'tier2_obelisk') {
                    enqueueAlert({ tier: 'tier_mid', senderName: 'Dawit Bekele', amount: 150, message: 'Aksum Stele power boost! 🏛️✨' });
                } else if (testParam === 'high' || testParam === 'tier3_lion') {
                    enqueueAlert({ tier: 'tier_high', senderName: 'Kassahun M.', amount: 500, message: 'Imperial Gonder castle celebration! 👑🏰' });
                } else if (testParam === 'queue') {
                    // Test all 3 sequentially
                    enqueueAlert({ tier: 'tier_low', senderName: 'Selamawit T.', amount: 25, message: 'First tip! ☕️' });
                    enqueueAlert({ tier: 'tier_mid', senderName: 'Dawit Bekele', amount: 120, message: 'Second tip in queue! 🏛️' });
                    enqueueAlert({ tier: 'tier_high', senderName: 'Kassahun M.', amount: 750, message: 'Grand finale royal tip! 👑' });
                }
            }, 600);
        }

        return () => {
            socket.disconnect();
            if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
            if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
        };
    }, [targetUsername, searchParams, enqueueAlert]);

    // Active Tier Component lookup
    const ActiveTierComponent = currentAlert ? (TIER_COMPONENTS[currentAlert.tier] || LowTierAlert) : null;

    return (
        <div 
            id="stream-overlay-root"
            style={{
                position: 'fixed',
                inset: 0,
                width: '1920px',
                height: '1080px',
                maxWidth: '100vw',
                maxHeight: '100vh',
                background: 'transparent',
                backgroundColor: 'transparent',
                overflow: 'hidden',
                pointerEvents: 'none',
                userSelect: 'none',
                fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
        >
            <AnimatePresence mode="wait">
                {currentAlert && ActiveTierComponent && (
                    <ActiveTierComponent 
                        key={currentAlert.id}
                        alert={currentAlert} 
                        isExiting={isExiting} 
                    />
                )}
            </AnimatePresence>

            {/* Global Transparent Overrides for OBS / TikTok LIVE Studio */}
            <style dangerouslySetInnerHTML={{__html: `
                html, body, #root {
                    background: transparent !important;
                    background-color: transparent !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: hidden !important;
                    width: 1920px !important;
                    height: 1080px !important;
                }
            `}} />
        </div>
    );
}
