export const INITIAL_PRODUCTS = [
  // --- Cameras & Lenses (Vendor 1: Marcus Vance) ---
  {
    id: 'prod-1',
    name: 'Sony Alpha A7 IV Full-Frame Camera Kit',
    category: 'cameras',
    vendorId: 'vend-1',
    pricePerDay: 68,
    securityDeposit: 350,
    availability: 'available',
    condition: 'Like New',
    rating: 4.95,
    reviewsCount: 38,
    featured: true,
    popular: true,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'The Sony A7 IV is the ideal hybrid camera for indie filmmakers, commercial videographers, and editorial photographers. Features a 33MP full-frame Exmor R sensor, 4K 60p 10-bit recording, and class-leading real-time eye autofocus.',
    features: [
      '33MP Full-Frame Exmor R CMOS Sensor',
      '4K 60p 10-Bit 4:2:2 Internal Recording',
      'S-Cinetone, S-Log3, and 10 Creative Looks',
      'Includes 24-70mm f/2.8 GM Lens & 2x 128GB V90 SD cards',
      '3x Sony NP-FZ100 batteries with dual rapid charger'
    ],
    specs: {
      brand: 'Sony',
      mount: 'Sony E-Mount',
      sensor: '33MP Full Frame',
      videoResolution: '4K at 60fps',
      weight: '658g (body only)'
    },
    location: 'Los Angeles, CA',
    inclusions: ['Camera Body', '24-70mm GM Lens', '3x Batteries', 'Dual Charger', 'Pelican Hard Case']
  },
  {
    id: 'prod-2',
    name: 'Canon EOS R5 Mirrorless Cinema Kit',
    category: 'cameras',
    vendorId: 'vend-1',
    pricePerDay: 95,
    securityDeposit: 500,
    availability: 'available',
    condition: 'Mint',
    rating: 4.98,
    reviewsCount: 29,
    featured: true,
    popular: true,
    images: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'The powerhouse Canon EOS R5 offers groundbreaking 8K RAW video capture and 45MP high-resolution stills with 8 stops of in-body image stabilization. Perfect for studio shoots, commercial sets, and wildlife productions.',
    features: [
      '45MP Full-Frame CMOS Sensor with DIGIC X processor',
      '8K 30p RAW & 4K 120p 10-Bit Internal video',
      'Dual Pixel CMOS AF II with 1053 automatic AF zones',
      'Includes Canon RF 28-70mm f/2 L USM lens',
      'Includes 512GB CFexpress Card and high-speed reader'
    ],
    specs: {
      brand: 'Canon',
      mount: 'Canon RF',
      sensor: '45MP Full Frame',
      videoResolution: '8K RAW at 30fps / 4K at 120fps',
      weight: '738g'
    },
    location: 'Los Angeles, CA',
    inclusions: ['EOS R5 Body', 'RF 28-70mm f/2 Lens', '512GB CFexpress Type B', '2x LP-E6NH Batteries']
  },
  {
    id: 'prod-3',
    name: 'Blackmagic Pocket Cinema Camera 6K Pro',
    category: 'cameras',
    vendorId: 'vend-1',
    pricePerDay: 75,
    securityDeposit: 400,
    availability: 'available',
    condition: 'Excellent',
    rating: 4.88,
    reviewsCount: 21,
    featured: false,
    popular: false,
    images: [
      'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Advanced 6K digital film camera with built-in motorized ND filters, tiltable high-bright HDR touchscreen, dual native ISO up to 25,600, and EF lens mount for high-end cinematic looks.',
    features: [
      'Super 35 HDR sensor, 6144 x 3456 resolution',
      'Built-in 2, 4, and 6-stop motorized ND filters',
      'Blackmagic RAW recording to fast Samsung T7 1TB SSD',
      'Dual mini-XLR audio inputs with 48V phantom power'
    ],
    specs: {
      brand: 'Blackmagic Design',
      mount: 'Canon EF Mount',
      sensor: 'Super 35 HDR',
      videoResolution: '6K at 60fps',
      weight: '1238g'
    },
    location: 'Los Angeles, CA',
    inclusions: ['BMPCC 6K Pro Body', 'Samsung T7 1TB SSD', 'SmallRig Full Cage', '4x NP-F570 Batteries']
  },
  {
    id: 'prod-4',
    name: 'Sigma 24-70mm & 70-200mm f/2.8 DG DN Art Lens Pair',
    category: 'cameras',
    vendorId: 'vend-1',
    pricePerDay: 45,
    securityDeposit: 250,
    availability: 'available',
    condition: 'Mint',
    rating: 4.91,
    reviewsCount: 17,
    featured: false,
    popular: true,
    images: [
      'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'The ultimate professional zoom duo covering wide angle to telephoto with an ultra-bright f/2.8 aperture throughout the entire focal range. Razor-sharp optics for Sony E-mount.',
    features: [
      'Constant fast f/2.8 maximum aperture',
      'Weather-sealed brass bayonet mount',
      'Super Multi-Layer Coating reduces flare and ghosting',
      'Stepping AF motor compatible with eye-tracking autofocus'
    ],
    specs: {
      brand: 'Sigma',
      mount: 'Sony E-Mount',
      aperture: 'f/2.8 Constant',
      focalLength: '24-70mm + 70-200mm',
      weight: '835g + 1335g'
    },
    location: 'Los Angeles, CA',
    inclusions: ['24-70mm Lens', '70-200mm Lens', 'Lens Hoods', 'Protective Padded Pouch']
  },

  // --- Laptops & Computing (Vendor 2: Elena Rostova) ---
  {
    id: 'prod-5',
    name: 'Apple MacBook Pro 16" M3 Max (64GB RAM, 2TB SSD)',
    category: 'laptops',
    vendorId: 'vend-2',
    pricePerDay: 85,
    securityDeposit: 600,
    availability: 'available',
    condition: 'Mint',
    rating: 4.97,
    reviewsCount: 42,
    featured: true,
    popular: true,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Extreme mobile workstation power with the Apple M3 Max 16-core CPU and 40-core GPU. Liquid Retina XDR display with 1600 nits peak brightness. Ideal for Davinci Resolve colour grading, 3D blender rendering, and heavy audio engineering.',
    features: [
      'Apple M3 Max Chip (16-core CPU, 40-core GPU)',
      '64GB Unified High-Speed Memory',
      '2TB Blazing-Fast PCIe NVMe SSD Storage',
      '16.2-inch Liquid Retina XDR Display with ProMotion 120Hz',
      '140W USB-C GaN Power Adapter with braided MagSafe cable'
    ],
    specs: {
      brand: 'Apple',
      processor: 'M3 Max 16-Core',
      ram: '64GB Unified',
      storage: '2TB SSD',
      display: '16.2" Liquid Retina XDR (3456 x 2234)'
    },
    location: 'Seattle, WA',
    inclusions: ['MacBook Pro 16"', '140W MagSafe Charger', 'Tomtoc Rugged Hard Shell Case', 'USB-C Multiport Dongle']
  },
  {
    id: 'prod-6',
    name: 'Dell XPS 16 4K OLED RTX 4070 Laptop',
    category: 'laptops',
    vendorId: 'vend-2',
    pricePerDay: 72,
    securityDeposit: 450,
    availability: 'available',
    condition: 'Like New',
    rating: 4.89,
    reviewsCount: 19,
    featured: false,
    popular: true,
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Stunning 4K+ OLED infinity-edge touch display coupled with Intel Core Ultra 9 and NVIDIA GeForce RTX 4070 8GB GDDR6 graphics. Excellent for AI workflows, CAD, and Unreal Engine development.',
    features: [
      'Intel Core Ultra 9 185H with integrated NPU',
      'NVIDIA GeForce RTX 4070 Laptop GPU (60W)',
      '32GB LPDDR5x 7467MHz Dual Channel RAM',
      '1TB M.2 PCIe Gen 4 NVMe Solid State Drive',
      '16.3" 4K+ OLED Touchscreen with 100% DCI-P3'
    ],
    specs: {
      brand: 'Dell',
      processor: 'Intel Core Ultra 9',
      ram: '32GB',
      gpu: 'NVIDIA RTX 4070 8GB',
      storage: '1TB SSD'
    },
    location: 'Seattle, WA',
    inclusions: ['Dell XPS 16 Laptop', '130W Type-C AC Adapter', 'Sleeve Carry Case']
  },
  {
    id: 'prod-7',
    name: 'ASUS ROG Zephyrus G16 (OLED 240Hz, RTX 4080)',
    category: 'laptops',
    vendorId: 'vend-2',
    pricePerDay: 80,
    securityDeposit: 500,
    availability: 'available',
    condition: 'Mint',
    rating: 4.94,
    reviewsCount: 26,
    featured: false,
    popular: true,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Ultra-slim CNC aluminum gaming and creator powerhouse. Boasts a 2.5K 240Hz ROG Nebula OLED display, Intel Core Ultra 9, and an ultra-fast RTX 4080 graphics chip.',
    features: [
      'NVIDIA GeForce RTX 4080 12GB GDDR6',
      '16" 2.5K (2560 x 1600) 240Hz 0.2ms OLED display',
      'G-SYNC and 100% DCI-P3 color validation',
      '32GB LPDDR5X RAM and 2TB PCIe 4.0 SSD',
      'Slash Lighting matrix on the lid'
    ],
    specs: {
      brand: 'ASUS',
      processor: 'Intel Core Ultra 9 185H',
      ram: '32GB',
      gpu: 'NVIDIA RTX 4080',
      weight: '1.95 kg'
    },
    location: 'Seattle, WA',
    inclusions: ['ASUS Zephyrus G16 Laptop', '240W Power Adapter', 'Gaming Mouse', 'Padded Carry Bag']
  },
  {
    id: 'prod-8',
    name: 'Apple iPad Pro 13" M4 with Apple Pencil Pro & Magic Keyboard',
    category: 'laptops',
    vendorId: 'vend-2',
    pricePerDay: 48,
    securityDeposit: 300,
    availability: 'available',
    condition: 'Like New',
    rating: 4.93,
    reviewsCount: 31,
    featured: false,
    popular: false,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'The thinnest Apple product ever made, powered by the incredible M4 chip and Tandem Ultra Retina XDR OLED display. Includes the latest Apple Pencil Pro with haptic feedback and the aluminum Magic Keyboard.',
    features: [
      'Ultra Retina XDR Tandem OLED Display',
      'Apple M4 Chip with 9-core CPU and 10-core GPU',
      'Apple Pencil Pro with barrel roll and squeeze gestures',
      'Redesigned Aluminum Magic Keyboard with function keys',
      '512GB Storage'
    ],
    specs: {
      brand: 'Apple',
      chip: 'Apple M4',
      storage: '512GB',
      display: '13" Tandem OLED',
      weight: '579g'
    },
    location: 'Seattle, WA',
    inclusions: ['iPad Pro 13" M4', 'Apple Pencil Pro', 'Magic Keyboard', '30W USB-C Charger']
  },

  // --- Gaming & VR (Vendor 1 & 2) ---
  {
    id: 'prod-9',
    name: 'PlayStation 5 Pro Console Bundle (DualSense Edge + 4 Games)',
    category: 'gaming',
    vendorId: 'vend-1',
    pricePerDay: 39,
    securityDeposit: 200,
    availability: 'available',
    condition: 'Mint',
    rating: 4.96,
    reviewsCount: 52,
    featured: true,
    popular: true,
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Experience PlayStation Spectral Super Resolution (PSSR) 4K gaming at 60 to 120 FPS. Comes with the pro DualSense Edge controller, an extra regular controller, and 4 pre-installed blockbuster titles.',
    features: [
      'Enhanced GPU with 67% more Compute Units for 45% faster rendering',
      'Advanced Ray Tracing with double the speed',
      'PSSR AI-driven upscaling for ultra-sharp clarity',
      'DualSense Edge Wireless Controller with swappable back paddles',
      '2TB Internal High-Speed NVMe SSD'
    ],
    specs: {
      brand: 'Sony PlayStation',
      storage: '2TB SSD',
      controller: '1x DualSense Edge + 1x DualSense',
      resolution: '4K/8K 120Hz HDR',
      weight: '3.1 kg'
    },
    location: 'Los Angeles, CA',
    inclusions: ['PS5 Pro Console', 'DualSense Edge Controller', 'Standard DualSense Controller', 'Ultra High Speed HDMI', 'Power Cable']
  },
  {
    id: 'prod-10',
    name: 'Meta Quest 3 512GB Mixed Reality Headset Kit',
    category: 'gaming',
    vendorId: 'vend-2',
    pricePerDay: 35,
    securityDeposit: 180,
    availability: 'available',
    condition: 'Like New',
    rating: 4.87,
    reviewsCount: 34,
    featured: false,
    popular: true,
    images: [
      'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Transform your physical room into a mixed reality playground with dual RGB passthrough cameras and high-fidelity spatial audio. Perfect for team demos, VR game nights, and virtual architecture walks.',
    features: [
      'Snapdragon XR2 Gen 2 platform with 2x graphic performance',
      'Full-Color High-Resolution Passthrough cameras',
      '4K+ Infinite Display (2064x2208 per eye)',
      'Includes Elite Strap with extra battery pack and silicone facial cover',
      'Preloaded with Beat Saber, Superhot VR, and Mixed Reality demos'
    ],
    specs: {
      brand: 'Meta',
      storage: '512GB',
      displayResolution: '2064 x 2208 per eye',
      batteryLife: 'Up to 3.5 hours with Elite Strap',
      tracking: '6DoF Inside-Out'
    },
    location: 'Seattle, WA',
    inclusions: ['Quest 3 Headset', '2x Touch Plus Controllers', 'Elite Strap with Battery', 'Rapid Charger', 'Travel Case']
  },
  {
    id: 'prod-11',
    name: 'Nintendo Switch OLED Travel Party Package',
    category: 'gaming',
    vendorId: 'vend-1',
    pricePerDay: 22,
    securityDeposit: 120,
    availability: 'available',
    condition: 'Mint',
    rating: 4.92,
    reviewsCount: 45,
    featured: false,
    popular: false,
    images: [
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'The ultimate portable entertainment bundle for road trips, weekend retreats, and family parties. Includes 4 Joy-Cons, Nintendo Dock with LAN port, Mario Kart 8 Deluxe, and Super Smash Bros Ultimate.',
    features: [
      '7-inch vibrant OLED screen with vivid colors and crisp contrast',
      'Wide adjustable tabletop stand',
      '4x Joy-Con controllers for 4-player multiplayer',
      'Includes Mario Kart 8 Deluxe, Smash Bros, and Super Mario Party',
      'Rugged protective carrying case with game card slots'
    ],
    specs: {
      brand: 'Nintendo',
      storage: '64GB + 128GB MicroSD',
      screen: '7.0" OLED Multi-Touch',
      playerSupport: 'Up to 4 players simultaneously',
      battery: '4.5 - 9 Hours'
    },
    location: 'Los Angeles, CA',
    inclusions: ['Switch OLED Console', '4x Joy-Con Controllers', 'TV Dock', 'HDMI Cable', 'Charger', 'Hard Travel Case']
  },

  // --- Projectors & Audio (Vendor 1 & 2) ---
  {
    id: 'prod-12',
    name: 'Sony 4K HDR Laser Home Cinema Projector',
    category: 'projectors',
    vendorId: 'vend-1',
    pricePerDay: 110,
    securityDeposit: 600,
    availability: 'available',
    condition: 'Mint',
    rating: 4.99,
    reviewsCount: 15,
    featured: true,
    popular: false,
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'True native 4K SXRD laser projector with 2,000 lumens of brightness and HDR remastering engine. Delivers cinematic theater quality up to 300 inches for film premieres, corporate showcases, or backyard cinema events.',
    features: [
      'Native 4K SXRD panel (4096 x 2160 resolution)',
      'Z-Phosphor laser light source with 20,000-hour life',
      'Dynamic HDR Enhancer with X1 processor for projector',
      'Low input lag for smooth high-frame rate movie and game projection',
      'Includes 120-inch portable ambient light rejecting (ALR) screen'
    ],
    specs: {
      brand: 'Sony',
      brightness: '2,000 ANSI Lumens',
      contrast: 'Infinity:1 Dynamic Contrast',
      resolution: 'Native 4K (4096 x 2160)',
      weight: '14 kg'
    },
    location: 'Los Angeles, CA',
    inclusions: ['Sony 4K Laser Projector', '120" Foldable ALR Screen & Stand', '15m HDMI 2.1 Optical Cable', 'Heavy Duty Flight Case']
  },
  {
    id: 'prod-13',
    name: 'JBL PartyBox 710 High-Power Bluetooth Stage Speaker',
    category: 'projectors',
    vendorId: 'vend-2',
    pricePerDay: 42,
    securityDeposit: 200,
    availability: 'available',
    condition: 'Excellent',
    rating: 4.88,
    reviewsCount: 39,
    featured: false,
    popular: true,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80'
    ],
    description: '800W RMS of massive JBL Original Pro Sound with synced dynamic LED strobe lighting effects and splashproof IPX4 build. Fills large halls, outdoor gardens, and warehouse event spaces with deep thunderous bass.',
    features: [
      '800 Watts RMS Output Power',
      'Dual 2.75" tweeters and dual 8" excursion woofers',
      'Customizable light show synced to the beat of your music',
      'Inputs for dual microphones and guitar with gain controls',
      'Built-in rugged wheels and sturdy ergonomic carry handle'
    ],
    specs: {
      brand: 'JBL',
      powerOutput: '800W RMS',
      frequencyResponse: '35Hz - 20kHz',
      waterResistance: 'IPX4 Splashproof',
      weight: '27.8 kg'
    },
    location: 'Seattle, WA',
    inclusions: ['JBL PartyBox 710 Speaker', 'Power Cord', 'Aux Cable', 'Protective Dust Cover']
  },
  {
    id: 'prod-14',
    name: 'Sennheiser EW-DP Wireless Lavalier Microphone Kit',
    category: 'projectors',
    vendorId: 'vend-1',
    pricePerDay: 32,
    securityDeposit: 150,
    availability: 'available',
    condition: 'Mint',
    rating: 4.95,
    reviewsCount: 23,
    featured: false,
    popular: false,
    images: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Fully digital UHF wireless microphone system with magnetic stackable receiver, industry standard ME 2 omnidirectional lavalier, and 134 dB dynamic range for broadcast-grade interview audio.',
    features: [
      'UHF spectrum transmission for reliable, dropout-free signal',
      '134 dB input dynamic range — virtually zero clipping',
      'OLED receiver display with smart notifications and battery level',
      'Rechargeable BA 70 lithium-ion battery with 12-hour continuous runtime'
    ],
    specs: {
      brand: 'Sennheiser',
      frequency: 'Digital UHF (470-526 MHz)',
      batteryLife: '12 Hours',
      latency: '1.9 ms',
      range: 'Up to 100 meters line-of-sight'
    },
    location: 'Los Angeles, CA',
    inclusions: ['EW-DP Receiver', 'Bodypack Transmitter', 'ME 2 Lavalier Mic', '3.5mm TRS & XLR Cables', 'Hot Shoe Mount']
  },

  // --- Power Tools & Equipment (Vendor 2: Elena Rostova) ---
  {
    id: 'prod-15',
    name: 'DeWalt 20V MAX XR Brushless 6-Tool Combo Workshop Kit',
    category: 'tools',
    vendorId: 'vend-2',
    pricePerDay: 45,
    securityDeposit: 220,
    availability: 'available',
    condition: 'Excellent',
    rating: 4.91,
    reviewsCount: 28,
    featured: true,
    popular: true,
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Comprehensive commercial-grade cordless tool kit featuring hammer drill, impact driver, circular saw, reciprocating saw, oscillating multi-tool, and work light with high-capacity PowerStack batteries.',
    features: [
      'High-efficiency brushless motors delivering up to 57% more runtime',
      'Includes 1/2" Hammer Drill and 1/4" 3-speed Impact Driver',
      '6-1/2" Circular Saw with carbide blade',
      'Includes 2x 5.0Ah XR Batteries + 2x Compact PowerStack Batteries',
      'Heavy duty DeWalt contractor rolling bag'
    ],
    specs: {
      brand: 'DeWalt',
      voltage: '20V MAX Lithium Ion',
      motorType: 'Brushless',
      batteriesIncluded: '4x Pack',
      weight: '16.5 kg total'
    },
    location: 'Seattle, WA',
    inclusions: ['6x Power Tools', '4x Batteries', 'Dual Port Rapid Charger', 'Safety Goggles & Gloves', 'Heavy Rolling Bag']
  },
  {
    id: 'prod-16',
    name: 'Bosch Professional 1-9/16" SDS-Max Rotary Hammer Drill',
    category: 'tools',
    vendorId: 'vend-2',
    pricePerDay: 38,
    securityDeposit: 190,
    availability: 'available',
    condition: 'Excellent',
    rating: 4.86,
    reviewsCount: 14,
    featured: false,
    popular: false,
    images: [
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Heavy duty concrete demolition and anchoring powerhouse. Produces 6.1 ft-lbs of impact energy with KickBack Control and Vario-Lock positioning for chiseling concrete, stone, and brick masonry.',
    features: [
      '14-Amp motor delivering 6.1 ft-lbs of impact energy',
      'Vibration Control in hammer mechanism and grip handle',
      'SDS-max bit system for tool-free bit changes and positive grip',
      'Includes 5-piece masonry chisel and core drill bit set'
    ],
    specs: {
      brand: 'Bosch',
      impactEnergy: '6.1 ft-lbs',
      noLoadRPM: '170 - 340 RPM',
      chuckType: 'SDS-Max',
      weight: '6.9 kg'
    },
    location: 'Seattle, WA',
    inclusions: ['Bosch SDS-Max Drill', 'Bull Point Chisel', 'Flat Chisel', 'Depth Gauge', 'Rugged Carrying Case']
  },
  {
    id: 'prod-17',
    name: 'DJI RS 3 Pro Gimbal Stabilizer Combo',
    category: 'tools',
    vendorId: 'vend-1',
    pricePerDay: 49,
    securityDeposit: 250,
    availability: 'available',
    condition: 'Mint',
    rating: 4.97,
    reviewsCount: 33,
    featured: false,
    popular: true,
    images: [
      'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'The standard in professional camera stabilization. Extended carbon fiber axis arms support up to 4.5kg / 10lbs payloads. Includes automated axis locks, LiDAR focusing motor, and transmission transmitter.',
    features: [
      'Extended carbon fiber arms for RED, Sony FX6, and Canon C70 rigs',
      'Automated Axis Locks unlock and fold automatically in 2 seconds',
      'LiDAR Range Finder autofocus tracking support',
      'SuperSmooth mode for fast-moving vehicle chase scenes'
    ],
    specs: {
      brand: 'DJI',
      payloadCapacity: '4.5 kg (10 lbs)',
      batteryRuntime: '12 Hours',
      touchscreen: '1.8" Full Color OLED',
      weight: '1.5 kg'
    },
    location: 'Los Angeles, CA',
    inclusions: ['DJI RS 3 Pro Gimbal', 'Focus Motor (2022)', 'Briefcase Handle', 'Ronin Image Transmitter', 'Carrying Case']
  },

  // --- Drones & Action Cams (Vendor 1: Marcus Vance) ---
  {
    id: 'prod-18',
    name: 'DJI Mavic 3 Pro Cine Combo (Apple ProRes & Triple Camera)',
    category: 'drones',
    vendorId: 'vend-1',
    pricePerDay: 98,
    securityDeposit: 650,
    availability: 'available',
    condition: 'Mint',
    rating: 4.98,
    reviewsCount: 41,
    featured: true,
    popular: true,
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Triple-camera aerial flagship with Hasselblad 4/3 CMOS camera, 70mm telephoto, and 166mm telephoto camera. Supports Apple ProRes 422 HQ internal recording across all 3 cameras with built-in 1TB SSD.',
    features: [
      'Hasselblad 4/3 CMOS Camera (5.1K 50fps & 4K 120fps)',
      'Dual Telephoto lenses (70mm 3x optical & 166mm 7x optical)',
      'Omnidirectional obstacle sensing with APAS 5.0 navigation',
      'Includes DJI RC Pro controller with ultra-bright 1000 nit screen',
      '43-minute maximum flight time per intelligent flight battery'
    ],
    specs: {
      brand: 'DJI',
      maxFlightTime: '43 Minutes',
      internalStorage: '1TB SSD',
      transmissionRange: '15 km (O3+)',
      weight: '958g'
    },
    location: 'Los Angeles, CA',
    inclusions: ['Mavic 3 Pro Cine Drone', 'DJI RC Pro Controller', '3x Intelligent Flight Batteries', 'Battery Charging Hub', 'ND Filters Set (ND8/16/32/64)', 'Shoulder Bag']
  },
  {
    id: 'prod-19',
    name: 'GoPro HERO12 Black Creator Edition Bundle',
    category: 'drones',
    vendorId: 'vend-1',
    pricePerDay: 28,
    securityDeposit: 150,
    availability: 'available',
    condition: 'Like New',
    rating: 4.89,
    reviewsCount: 37,
    featured: false,
    popular: true,
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'All-in-one content creation rig. Incredible 5.3K60 video, Emmy-winning HyperSmooth 6.0 stabilization, Volta battery grip with 5+ hours recording, Media Mod directional mic, and Light Mod LED.',
    features: [
      '5.3K 60fps and 4K 120fps cinematic action video capture',
      'High Dynamic Range (HDR) video and photo mode',
      'Volta battery grip with built-in tripod and wireless remote control',
      'Media Mod with built-in directional mic and 3.5mm external audio input',
      'Light Mod compact powerful LED light with diffuser'
    ],
    specs: {
      brand: 'GoPro',
      resolution: '5.3K at 60fps / 27MP Stills',
      waterproof: '10m (33ft) without housing',
      stabilization: 'HyperSmooth 6.0 with 360° Horizon Lock',
      weight: '154g (camera alone)'
    },
    location: 'Los Angeles, CA',
    inclusions: ['GoPro HERO12 Black', 'Volta Battery Grip', 'Media Mod', 'Light Mod', '2x Enduro Batteries', '128GB SanDisk Extreme Card']
  }
];
