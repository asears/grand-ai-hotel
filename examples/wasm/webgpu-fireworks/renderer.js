/**
 * WebGPU Renderer for Fireworks
 * Handles all GPU rendering operations
 */

export class FireworksRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.device = null;
        this.context = null;
        this.pipeline = null;
        this.vertexBuffer = null;
        this.uniformBuffer = null;
        this.bindGroup = null;
        this.format = 'bgra8unorm';

        // Test pipeline and debug flags
        this.testPipeline = null;
        this.forceTest = false;
    }

    async init() {
        // Get GPU adapter
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            throw new Error('No GPU adapter found');
        }

        // Get GPU device
        this.device = await adapter.requestDevice();

        // Configure canvas context
        this.context = this.canvas.getContext('webgpu');
        this.format = navigator.gpu.getPreferredCanvasFormat();
        
        this.context.configure({
            device: this.device,
            format: this.format,
            alphaMode: 'premultiplied',
        });

        // Create render pipeline
        await this.createPipeline();
        
        // Create buffers
        this.createBuffers();

        // Set initial canvas size
        this.resize();
    }

    async createPipeline() {
        const shaderCode = `
            struct Uniforms {
                resolution: vec2<f32>,
                time: f32,
                intensity: f32,
            }

            struct Particle {
                position: vec2<f32>,
                velocity: vec2<f32>,
                color: vec4<f32>,
                life: f32,
                size: f32,
            }

            @group(0) @binding(0) var<uniform> uniforms: Uniforms;

            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) color: vec4<f32>,
                @location(1) life: f32,
            }

            @vertex
            fn vs_main(
                @location(0) pos: vec2<f32>,
                @location(1) vel: vec2<f32>,
                @location(2) color: vec4<f32>,
                @location(3) life: f32,
                @location(4) size: f32,
            ) -> VertexOutput {
                var output: VertexOutput;
                
                // Convert to clip space
                let clipPos = vec2<f32>(
                    (pos.x / uniforms.resolution.x) * 2.0 - 1.0,
                    1.0 - (pos.y / uniforms.resolution.y) * 2.0
                );
                
                output.position = vec4<f32>(clipPos, 0.0, 1.0);
                output.color = color;
                output.life = life;
                
                return output;
            }

            @fragment
            fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
                // Fade out based on life
                var alpha = input.life * input.color.a;
                
                // Add glow effect
                let glow = smoothstep(0.0, 0.5, input.life);
                
                return vec4<f32>(
                    input.color.rgb * (1.0 + glow * 0.5),
                    alpha
                );
            }
        `;

        const shaderModule = this.device.createShaderModule({
            code: shaderCode,
        });

        // Log shader compilation messages if available
        if (shaderModule.compilationInfo) {
            shaderModule.compilationInfo().then(info => {
                if (info && info.messages && info.messages.length) {
                    for (let m of info.messages) {
                        if (m.type === 'error') {
                            console.error(`[WGSL][error] ${m.message} (line ${m.line}, col ${m.column})`);
                        } else if (m.type === 'warning') {
                            console.warn(`[WGSL][warn] ${m.message} (line ${m.line}, col ${m.column})`);
                        } else {
                            console.info(`[WGSL][info] ${m.message}`);
                        }
                    }
                }
            }).catch(err => console.warn('Shader compilationInfo not available:', err));
        }

        // Create pipeline layout
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: { type: 'uniform' }
                }
            ]
        });

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        // Create render pipeline (catch and log errors)
        try {
            this.pipeline = this.device.createRenderPipeline({
                layout: pipelineLayout,
                vertex: {
                    module: shaderModule,
                    entryPoint: 'vs_main',
                    buffers: [
                        {
                            arrayStride: 40, // 2 + 2 + 4 + 1 + 1 = 10 floats * 4 bytes = 40 bytes
                            attributes: [
                                { shaderLocation: 0, offset: 0, format: 'float32x2' },  // position (8 bytes)
                                { shaderLocation: 1, offset: 8, format: 'float32x2' },  // velocity (8 bytes)
                                { shaderLocation: 2, offset: 16, format: 'float32x4' }, // color (16 bytes)
                                { shaderLocation: 3, offset: 32, format: 'float32' },   // life (4 bytes)
                                { shaderLocation: 4, offset: 36, format: 'float32' },   // size (4 bytes)
                            ]
                        }
                    ]
                },
                fragment: {
                    module: shaderModule,
                    entryPoint: 'fs_main',
                    targets: [
                        {
                            format: this.format,
                            blend: {
                                color: {
                                    srcFactor: 'src-alpha',
                                    dstFactor: 'one-minus-src-alpha',
                                    operation: 'add'
                                },
                                alpha: {
                                    srcFactor: 'one',
                                    dstFactor: 'one-minus-src-alpha',
                                    operation: 'add'
                                }
                            }
                        }
                    ]
                },
                primitive: {
                    topology: 'point-list',
                }
            });
        } catch (err) {
            console.error('Failed to create render pipeline:', err && (err.stack || err.message || err));
            if (window && window.logCollector) {
                window.logCollector.add('error', ['createRenderPipeline error', err && (err.stack || err.message || err)]);
            }
            throw err;
        }

        // Create test pipeline for basic visibility checks (full-screen triangle)
        const testShaderCode = `
            @vertex
            fn vs_test(@builtin(vertex_index) idx : u32) -> @builtin(position) vec4<f32> {
                var positions = array<vec2<f32>, 3>(
                    vec2<f32>(-1.0, -1.0),
                    vec2<f32>(3.0, -1.0),
                    vec2<f32>(-1.0, 3.0)
                );
                return vec4<f32>(positions[idx], 0.0, 1.0);
            }

            @fragment
            fn fs_test() -> @location(0) vec4<f32> {
                return vec4<f32>(0.0, 1.0, 0.0, 1.0);
            }
        `;

        const testModule = this.device.createShaderModule({ code: testShaderCode });
        this.testPipeline = this.device.createRenderPipeline({
            layout: this.device.createPipelineLayout({ bindGroupLayouts: [] }),
            vertex: { module: testModule, entryPoint: 'vs_test' },
            fragment: { module: testModule, entryPoint: 'fs_test', targets: [{ format: this.format }] },
            primitive: { topology: 'triangle-list' }
        });

        this.bindGroupLayout = bindGroupLayout;
    }

    createBuffers() {
        // Create uniform buffer (resolution, time, intensity)
        this.uniformBuffer = this.device.createBuffer({
            size: 16, // 2 floats (resolution) + 1 float (time) + 1 float (intensity) = 16 bytes
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        // Create bind group
        this.bindGroup = this.device.createBindGroup({
            layout: this.bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: { buffer: this.uniformBuffer }
                }
            ]
        });
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.clientWidth * dpr;
        this.canvas.height = this.canvas.clientHeight * dpr;
    }

    render(particles, config) {
        // Update uniforms
        const uniforms = new Float32Array([
            this.canvas.width,
            this.canvas.height,
            performance.now() / 1000,
            config.intensity / 100,
        ]);
        this.device.queue.writeBuffer(this.uniformBuffer, 0, uniforms);

        // If force test is enabled, draw full-screen test triangle and return
        if (this.forceTest && this.testPipeline) {
            const commandEncoder = this.device.createCommandEncoder();
            const textureView = this.context.getCurrentTexture().createView();
            const renderPass = commandEncoder.beginRenderPass({
                colorAttachments: [
                    {
                        view: textureView,
                        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                        loadOp: 'clear',
                        storeOp: 'store',
                    }
                ]
            });

            renderPass.setPipeline(this.testPipeline);
            renderPass.draw(3);
            renderPass.end();
            this.device.queue.submit([commandEncoder.finish()]);
            return;
        }

        // Only include alive particles in the vertex buffer to avoid sending dead slots
        const activeParticles = particles.filter(p => p.life > 0);
        // Keep a short sample for debugging via the browser console
        this.lastActiveParticles = activeParticles.slice(0, 10);

        const vertexData = new Float32Array(activeParticles.length * 10);
        for (let i = 0; i < activeParticles.length; i++) {
            const p = activeParticles[i];
            const offset = i * 10;
            vertexData[offset + 0] = p.x;
            vertexData[offset + 1] = p.y;
            vertexData[offset + 2] = p.vx;
            vertexData[offset + 3] = p.vy;
            vertexData[offset + 4] = p.r;
            vertexData[offset + 5] = p.g;
            vertexData[offset + 6] = p.b;
            vertexData[offset + 7] = p.a;
            // Normalize life to 0..1 to avoid large alpha values in shader (safer for blending)
            const normLife = Math.max(0, Math.min(1, p.life / (p.maxLife || 1)));
            vertexData[offset + 8] = normLife;
            vertexData[offset + 9] = p.size || 1.0;
        }

        // Recreate vertex buffer if needed
        if (!this.vertexBuffer || this.vertexBuffer.size < vertexData.byteLength) {
            if (this.vertexBuffer) {
                this.vertexBuffer.destroy();
            }
            this.vertexBuffer = this.device.createBuffer({
                size: vertexData.byteLength,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            });
        }

        this.device.queue.writeBuffer(this.vertexBuffer, 0, vertexData);

        // Create command encoder
        const commandEncoder = this.device.createCommandEncoder();

        // Get current texture
        const textureView = this.context.getCurrentTexture().createView();

        // Create render pass
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [
                {
                    view: textureView,
                    clearValue: config.vectrexMode 
                        ? { r: 0.0, g: 0.0, b: 0.0, a: 1.0 }  // Pure black for Vectrex
                        : { r: 0.05, g: 0.05, b: 0.1, a: 1.0 }, // Dark blue for normal
                    loadOp: 'clear',
                    storeOp: 'store',
                }
            ]
        });

        // Only render particles if we have active vertices; otherwise just clear the screen
        if (activeParticles.length > 0) {
            renderPass.setPipeline(this.pipeline);
            renderPass.setBindGroup(0, this.bindGroup);
            renderPass.setVertexBuffer(0, this.vertexBuffer);
            renderPass.draw(activeParticles.length);
        } else {
            // Nothing to draw; renderPass will clear the background
        }

        renderPass.end();

        // Submit commands
        this.device.queue.submit([commandEncoder.finish()]);

        // Occasional debug logging to help track whether particles are being uploaded and drawn
        this._logFrameCounter = (this._logFrameCounter || 0) + 1;
        if (this._logFrameCounter % 60 === 0) {
            console.log(`🔍 Renderer: activeParticles=${activeParticles.length}, totalVerticesBytes=${vertexData.byteLength}`);
        }
    }

    getLastActiveParticles() {
        return this.lastActiveParticles || [];
    }

    setForceTest(enabled) {
        this.forceTest = !!enabled;
        console.log(`🔧 Renderer force test ${this.forceTest ? 'ENABLED' : 'DISABLED'}`);
    }

    destroy() {
        if (this.vertexBuffer) {
            this.vertexBuffer.destroy();
        }
        if (this.uniformBuffer) {
            this.uniformBuffer.destroy();
        }
        if (this.device) {
            this.device.destroy();
        }
    }
}
