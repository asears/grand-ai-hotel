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
                
                // Vectrex green phosphor simulation
                // Check if this is a green particle (Vectrex mode indicator)
                let isVectrex = input.color.g > 1.5; // Boosted green channel
                
                if (isVectrex) {
                    // Vectrex green phosphor (#00ff41 style) - HIGH INTENSITY
                    let vectrexGreen = vec3<f32>(0.0, 1.0, 0.25);
                    
                    // CRT bloom/glow effect - ENHANCED for high intensity
                    let bloom = 2.0 + glow * 3.0; // Increased from 1.5 + 2.0
                    
                    // Add scanline flicker simulation (authentic CRT effect)
                    let flicker = 1.0 + sin(uniforms.time * 100.0) * 0.02;
                    
                    return vec4<f32>(
                        vectrexGreen * bloom * flicker,
                        alpha * 0.95 // Higher alpha for brighter display
                    );
                } else {
                    return vec4<f32>(
                        input.color.rgb * (1.0 + glow * 0.5),
                        alpha
                    );
                }
            }
        `;

        const shaderModule = this.device.createShaderModule({
            code: shaderCode,
        });

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

        // Create render pipeline
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

        // Create/update vertex buffer with particle data
        const vertexData = new Float32Array(particles.length * 10);
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const offset = i * 10;
            vertexData[offset + 0] = p.x;
            vertexData[offset + 1] = p.y;
            vertexData[offset + 2] = p.vx;
            vertexData[offset + 3] = p.vy;
            vertexData[offset + 4] = p.r;
            vertexData[offset + 5] = p.g;
            vertexData[offset + 6] = p.b;
            vertexData[offset + 7] = p.a;
            vertexData[offset + 8] = p.life;
            vertexData[offset + 9] = p.size;
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

        renderPass.setPipeline(this.pipeline);
        renderPass.setBindGroup(0, this.bindGroup);
        renderPass.setVertexBuffer(0, this.vertexBuffer);
        renderPass.draw(particles.length);
        renderPass.end();

        // Submit commands
        this.device.queue.submit([commandEncoder.finish()]);
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
