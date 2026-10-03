import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * TransparentVideoCanvas
 * High-performance WebGL-based hardware-accelerated Luma-Key video renderer for OBS Studio & TikTok LIVE Studio.
 * 
 * Why this is needed:
 * Standard MP4 video has no alpha channel. In OBS Studio and TikTok LIVE Studio browser sources,
 * the page backdrop is transparent. CSS mix-blend-mode: screen fails to create true alpha against a transparent backdrop,
 * causing dark MP4 pixels to stay opaque black and hide the streamer.
 * 
 * This component runs a WebGL fragment shader on each frame that converts dark pixels (Y <= 24)
 * to 100% transparent alpha (A = 0.0) while preserving bright, vivid gift visuals (A = 1.0).
 * OBS Studio & TikTok LIVE Studio receive genuine transparent alpha frames!
 */
export default function TransparentVideoCanvas({
    src,
    onCanPlay,
    onEnded,
    onError,
    style = {},
    className = ''
}) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initialize WebGL context and shaders
    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        let gl = canvas.getContext('webgl', {
            alpha: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            antialias: true
        });

        let use2dFallback = false;
        let ctx2d = null;

        if (!gl) {
            console.warn('[TransparentVideoCanvas] WebGL not supported, falling back to 2D Canvas context');
            use2dFallback = true;
            ctx2d = canvas.getContext('2d', { willReadFrequently: true });
        }

        let program = null;
        let texture = null;

        if (gl) {
            const vsSource = `
                attribute vec2 a_position;
                attribute vec2 a_texCoord;
                varying vec2 v_texCoord;
                void main() {
                    gl_Position = vec4(a_position, 0.0, 1.0);
                    v_texCoord = a_texCoord;
                }
            `;

            const fsSource = `
                precision mediump float;
                uniform sampler2D u_image;
                varying vec2 v_texCoord;
                void main() {
                    vec4 color = texture2D(u_image, v_texCoord);
                    // Standard Rec. 601 Luminance
                    float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                    
                    // High-gain luma keying matching Flutter color filter:
                    // Pure black compression noise (luma < 0.09) is completely transparent (alpha = 0.0)
                    // Subject / colorful details (luma > 0.20) are fully solid & vivid (alpha = 1.0)
                    float alpha = smoothstep(0.09, 0.22, luma);
                    
                    // Slight vibrancy boost so gift pops majestically over live stream
                    vec3 rgb = color.rgb * 1.10;
                    gl_FragColor = vec4(rgb, alpha);
                }
            `;

            const compileShader = (type, source) => {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    console.error('[TransparentVideoCanvas] Shader error:', gl.getShaderInfoLog(shader));
                    gl.deleteShader(shader);
                    return null;
                }
                return shader;
            };

            const vs = compileShader(gl.VERTEX_SHADER, vsSource);
            const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);

            if (vs && fs) {
                program = gl.createProgram();
                gl.attachShader(program, vs);
                gl.attachShader(program, fs);
                gl.linkProgram(program);

                if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                    console.error('[TransparentVideoCanvas] Program link error:', gl.getProgramInfoLog(program));
                    gl = null;
                    use2dFallback = true;
                    ctx2d = canvas.getContext('2d', { willReadFrequently: true });
                } else {
                    gl.useProgram(program);

                    // Setup quad geometry
                    const positionBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                    gl.bufferData(
                        gl.ARRAY_BUFFER,
                        new Float32Array([
                            -1.0, -1.0,
                             1.0, -1.0,
                            -1.0,  1.0,
                             1.0,  1.0
                        ]),
                        gl.STATIC_DRAW
                    );

                    const aPos = gl.getAttribLocation(program, 'a_position');
                    gl.enableVertexAttribArray(aPos);
                    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

                    // Setup texture coordinates (WebGL flips Y relative to video)
                    const texCoordBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
                    gl.bufferData(
                        gl.ARRAY_BUFFER,
                        new Float32Array([
                            0.0, 1.0,
                            1.0, 1.0,
                            0.0, 0.0,
                            1.0, 0.0
                        ]),
                        gl.STATIC_DRAW
                    );

                    const aTex = gl.getAttribLocation(program, 'a_texCoord');
                    gl.enableVertexAttribArray(aTex);
                    gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 0, 0);

                    // Setup Texture
                    texture = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

                    // Enable Alpha Blending
                    gl.enable(gl.BLEND);
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                }
            }
        }

        // Render Loop
        const renderFrame = () => {
            if (video && !video.paused && !video.ended && video.readyState >= 2) {
                const vw = video.videoWidth || 640;
                const vh = video.videoHeight || 360;

                if (canvas.width !== vw || canvas.height !== vh) {
                    canvas.width = vw;
                    canvas.height = vh;
                    if (gl) gl.viewport(0, 0, vw, vh);
                }

                if (gl && program && texture) {
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
                    gl.clearColor(0.0, 0.0, 0.0, 0.0);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                } else if (use2dFallback && ctx2d) {
                    ctx2d.clearRect(0, 0, vw, vh);
                    ctx2d.drawImage(video, 0, 0, vw, vh);
                    const imgData = ctx2d.getImageData(0, 0, vw, vh);
                    const data = imgData.data;
                    const len = data.length;
                    for (let i = 0; i < len; i += 4) {
                        const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                        if (luma < 24) {
                            data[i + 3] = 0;
                        } else if (luma < 50) {
                            data[i + 3] = Math.round(((luma - 24) / 26) * 255);
                        }
                    }
                    ctx2d.putImageData(imgData, 0, 0);
                }
            }
            animFrameRef.current = requestAnimationFrame(renderFrame);
        };

        animFrameRef.current = requestAnimationFrame(renderFrame);

        return () => {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
            if (gl && texture) {
                gl.deleteTexture(texture);
            }
        };
    }, []);

    const handleCanPlay = useCallback((e) => {
        setIsLoaded(true);
        if (onCanPlay) onCanPlay(e);
    }, [onCanPlay]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', ...style }} className={className}>
            {/* Hidden source video element */}
            <video
                ref={videoRef}
                src={src}
                autoPlay
                muted
                playsInline
                preload="auto"
                onCanPlay={handleCanPlay}
                onLoadedData={handleCanPlay}
                onEnded={onEnded}
                onError={onError}
                style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    opacity: 0,
                    pointerEvents: 'none',
                    zIndex: -1
                }}
            />

            {/* Hardware-accelerated transparent canvas */}
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '100vw',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                    pointerEvents: 'none',
                    background: 'transparent',
                    backgroundColor: 'transparent',
                    display: 'block'
                }}
            />
        </div>
    );
}
