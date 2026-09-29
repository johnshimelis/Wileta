import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AnimatePresence } from 'framer-motion';

import Tier1Alert from './Tier1Alert';
import Tier2Alert from './Tier2Alert';
import Tier3Alert from './Tier3Alert';
import GiftVideoAlert from './GiftVideoAlert';
import { getGiftVideo } from './giftVideoMapping';

// Procedural fallback map for tips without assigned video assets
const TIER_COMPONENTS = {
    tier1_sparkle: Tier1Alert,
    tier2_obelisk: Tier2Alert,
    tier3_lion: Tier3Alert,
    tier_low: Tier1Alert,
    tier_mid: Tier2Alert,
    tier_high: Tier3Alert
};

/**
 * Determine alert tier from tip amount:
 * - < 50 ETB: tier1_sparkle
 * - 50 - 199 ETB: tier2_obelisk
 * - >= 200 ETB: tier3_lion
 */
export function getTipTier(amount, explicitTier) {
    if (explicitTier && TIER_COMPONENTS[explicitTier]) {
        return explicitTier;
    }
    const val = Number(amount) || 0;
    if (val >= 200) return 'tier3_lion';
    if (val >= 50) return 'tier2_obelisk';
    return 'tier1_sparkle';
}

/**
 * StreamOverlay Main Orchestrator (GurshaPay Live Gift Overlay)
 * - Plays the exact assigned video for each authentic Ethiopian gift (Jebena, Lion, Kebero, Masinqo, etc.)
 * - Manages an Alert Queue for sequential video playback without overlapping
 * - Subscribes to Socket.IO 'gursha_tip', 'new_tip', and 'tip_alert' events
 * - Enforces transparent frameless canvas for OBS Studio & TikTok LIVE Studio
 * - Preserves ?preview=true & ?test=<giftId> test functionality
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
    const safetyTimerRef = useRef(null);

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

        // Resolve assigned gift video
        const giftInfo = getGiftVideo(rawPayload);
        const tier = getTipTier(rawPayload.amount, rawPayload.tier || rawPayload.animationId || giftInfo?.tier);

        const standardized = {
            id: rawPayload.tx_ref || `alert_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            giftId: rawPayload.giftId,
            gift: rawPayload.gift,
            giftName: rawPayload.giftName || rawPayload.gift || giftInfo?.name || '',
            animationId: rawPayload.animationId,
            tier,
            giftInfo,
            senderName: rawPayload.senderName || rawPayload.supporterName || rawPayload.tipperPhone || 'A Supporter',
            amount: Number(rawPayload.amount || 0),
            message: rawPayload.message || '',
            durationMs: rawPayload.durationMs
        };

        // Preload video asset if available
        if (giftInfo && giftInfo.videoSrc) {
            try {
                const preloader = document.createElement('video');
                preloader.preload = 'auto';
                preloader.src = giftInfo.videoSrc;
            } catch (_) {}
        }

        console.log(`[StreamOverlay] Enqueueing alert for gift: "${giftInfo ? giftInfo.name : 'Fallback'}" (video: ${giftInfo?.videoSrc || 'none'})`, standardized);
        setAlertQueue(prev => [...prev, standardized]);
    }, []);

    // Complete current alert and smoothly advance queue
    const handleAlertComplete = useCallback(() => {
        setIsExiting(true);
        if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
        if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);

        setTimeout(() => {
            setCurrentAlert(null);
            setIsExiting(false);
        }, 350);
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

        // If alert has assigned video, GiftVideoAlert handles its own playback and completion
        if (nextAlert.giftInfo && nextAlert.giftInfo.videoSrc) {
            // Safety fallback timer so queue is never permanently blocked (15s max)
            if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
            safetyTimerRef.current = setTimeout(() => {
                console.log('[StreamOverlay] Safety timeout triggered for video alert, advancing queue.');
                handleAlertComplete();
            }, 15000);
            return;
        }

        // Fallback for alerts without assigned video
        console.warn(`[StreamOverlay] No video assigned for gift: "${nextAlert.giftId || nextAlert.gift || nextAlert.giftName}", using procedural fallback animation.`);
        const isTier3 = nextAlert.tier === 'tier3_lion' || nextAlert.tier === 'tier_high';
        const isTier2 = nextAlert.tier === 'tier2_obelisk' || nextAlert.tier === 'tier_mid';
        const duration = isTier3 ? 12000 : (isTier2 ? 8500 : 5500);
        const fadeDelay = duration - 800;

        if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);

        exitTimerRef.current = setTimeout(() => {
            setIsExiting(true);
        }, fadeDelay);

        dismissTimerRef.current = setTimeout(() => {
            handleAlertComplete();
        }, duration);

    }, [currentAlert, alertQueue, handleAlertComplete]);

    // Socket.IO Subscription & OBS Transparent Styling
    useEffect(() => {
        // Enforce 100% transparent background and zero scrollbars for OBS & TikTok LIVE Studio
        document.documentElement.style.backgroundColor = 'transparent';
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

        // URL Query Param Test & Preview Support
        // Supports: ?preview=true, ?test=<giftId>, ?test=queue
        const testParam = (searchParams.get('test') || searchParams.get('preview') || searchParams.get('tier') || '').toLowerCase();
        if (testParam) {
            setTimeout(() => {
                if (testParam === 'jebena') {
                    enqueueAlert({ giftId: 'jebena', giftName: 'Clay Jebena', senderName: 'Dawit Bekele', amount: 100, message: 'Traditional Jebena coffee on me! 🫖☕️' });
                } else if (testParam === 'lion') {
                    enqueueAlert({ giftId: 'lion', giftName: 'Lion of Judah', senderName: 'Kassahun M.', amount: 5000, message: 'Royal Lion of Judah celebration! 🦁👑' });
                } else if (testParam === 'kebero') {
                    enqueueAlert({ giftId: 'kebero', giftName: 'Kebero Drum', senderName: 'Almaz Tadesse', amount: 300, message: 'Joyful Kebero rhythm! 🪘✨' });
                } else if (testParam === 'masinqo' || testParam === 'masenqo') {
                    enqueueAlert({ giftId: 'masinqo', giftName: 'Masenqo Lute', senderName: 'Yared Getachew', amount: 500, message: 'Soulful Masenqo strings! 🎻🇪🇹' });
                } else if (testParam === 'walia' || testParam === 'walia_ibex') {
                    enqueueAlert({ giftId: 'walia_ibex', giftName: 'Walia Ibex', senderName: 'Blen Semere', amount: 2500, message: 'Highland Walia spirit! 🐐⛰️' });
                } else if (testParam === 'axum' || testParam === 'axum_obelisk') {
                    enqueueAlert({ giftId: 'axum_obelisk', giftName: 'Axum Obelisk', senderName: 'Haile Menelik', amount: 3000, message: 'Monumental Axum Obelisk! 🏛️' });
                } else if (testParam === 'lalibela') {
                    enqueueAlert({ giftId: 'lalibela', giftName: 'Lalibela Church', senderName: 'Marta Kebede', amount: 4000, message: 'Holy Lalibela blessing! ⛪' });
                } else if (testParam === 'jet' || testParam === 'ethiopian_jet') {
                    enqueueAlert({ giftId: 'ethiopian_jet', giftName: 'Ethiopian Jet', senderName: 'Abel Nega', amount: 25000, message: 'Soaring with Ethiopian Airlines! ✈️' });
                } else if (testParam === 'supercar' || testParam === 'car') {
                    enqueueAlert({ giftId: 'supercar', giftName: 'Addis Supercar', senderName: 'Yonatan Birhanu', amount: 15000, message: 'Addis Supercar horsepower! 🏎️💨' });
                } else if (testParam === 'queue') {
                    // Test consecutive gifts in queue
                    enqueueAlert({ giftId: 'jebena', giftName: 'Clay Jebena', senderName: 'Dawit Bekele', amount: 100, message: 'First gift: Jebena! 🫖' });
                    enqueueAlert({ giftId: 'lion', giftName: 'Lion of Judah', senderName: 'Kassahun M.', amount: 5000, message: 'Second gift: Lion! 🦁' });
                    enqueueAlert({ giftId: 'axum_obelisk', giftName: 'Axum Obelisk', senderName: 'Haile M.', amount: 3000, message: 'Third gift: Axum! 🏛️' });
                    enqueueAlert({ giftId: 'supercar', giftName: 'Addis Supercar', senderName: 'Yonatan B.', amount: 15000, message: 'Fourth gift: Supercar! 🏎️' });
                } else if (testParam === 'true' || testParam === 'preview') {
                    // Default preview demonstration (Clay Jebena)
                    enqueueAlert({ giftId: 'jebena', giftName: 'Clay Jebena', senderName: 'Selamawit T.', amount: 100, message: 'Previewing GurshaPay Live Gift Overlay! 🫖✨' });
                } else {
                    // Check if testParam directly matches any gift in mapping
                    const directGift = getGiftVideo(testParam);
                    if (directGift) {
                        enqueueAlert({ giftId: testParam, giftName: directGift.name, senderName: 'Preview Supporter', amount: 250, message: `Testing ${directGift.name} video! ✨` });
                    } else if (testParam === 'tier1_sparkle' || testParam === 'low') {
                        enqueueAlert({ animationId: 'tier1_sparkle', tier: 'tier1_sparkle', senderName: 'Selamawit T.', amount: 45, message: 'Love the stream! ☕️🇪🇹' });
                    } else if (testParam === 'tier2_obelisk' || testParam === 'mid') {
                        enqueueAlert({ animationId: 'tier2_obelisk', tier: 'tier2_obelisk', senderName: 'Dawit Bekele', amount: 150, message: 'Aksum Obelisk energy boost! 🏛️✨' });
                    } else if (testParam === 'tier3_lion' || testParam === 'high') {
                        enqueueAlert({ animationId: 'tier3_lion', tier: 'tier3_lion', senderName: 'Kassahun M.', amount: 500, message: 'Royal Lion of Judah celebration! 🦁👑' });
                    }
                }
            }, 500);
        }

        return () => {
            socket.disconnect();
            if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
            if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
            if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
        };
    }, [targetUsername, searchParams, enqueueAlert, handleAlertComplete]);

    // Determine component to render
    const hasAssignedVideo = Boolean(currentAlert?.giftInfo?.videoSrc);
    const FallbackTierComponent = currentAlert ? (TIER_COMPONENTS[currentAlert.tier] || Tier1Alert) : null;

    return (
        <div 
            id="stream-overlay-root"
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
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
                {currentAlert && hasAssignedVideo ? (
                    <GiftVideoAlert
                        key={currentAlert.id}
                        alert={currentAlert}
                        giftInfo={currentAlert.giftInfo}
                        isExiting={isExiting}
                        onComplete={handleAlertComplete}
                    />
                ) : (
                    currentAlert && FallbackTierComponent && (
                        <FallbackTierComponent 
                            key={currentAlert.id}
                            alert={currentAlert} 
                            isExiting={isExiting} 
                        />
                    )
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
                    width: 100vw !important;
                    height: 100vh !important;
                }
            `}} />
        </div>
    );
}
