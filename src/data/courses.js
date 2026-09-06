const COURSE_CATALOG = [
  {
    slug: "windows-11-creator-os",
    title: "Windows 11 Creator OS & Workstation Manual",
    category: "System & OS",
    level: "Masterclass",
    badgeAccent: "#FFC700",
    lessons: [
      {
        title: "Workstation Calibration for 4K Video & 3D",
        readTime: "4 min",
        badge: "Performance",
        summary:
          "Configure Windows 11 display refresh rates, HDR balance, and dedicated NVMe scratch disks for Premiere, Photoshop, and Blender.",
        keyPoints: [
          "Enable Variable Refresh Rate (VRR) & 144Hz+ in Settings > System > Display.",
          "Split storage: OS on primary drive, media cache/scratch files on high-speed NVMe.",
          "Set Graphic Performance Preferences to High Performance GPU for your creative apps.",
        ],
        proTip:
          "Always allocate at least 20% free space on your NVMe scratch drive to avoid cache throttling during long render sessions.",
      },
      {
        title: "Phone Link Pro Sync (iOS & Android)",
        readTime: "3 min",
        badge: "Workflow",
        summary:
          "Eliminate transfer cables. Wirelessly beam camera captures, sync universal clipboards, and test responsive mobile interfaces.",
        keyPoints: [
          "Pair Windows Phone Link with Link to Windows using secure QR authentication.",
          "Enable cross-device copy-paste to seamlessly send links, prompts, and hex codes.",
          "Drag and drop raw footage directly into project folders without cloud compression.",
        ],
        proTip:
          "Keep both devices connected to the same 5GHz Wi-Fi band for instantaneous transfers.",
      },
      {
        title: "Generative Canvas & AI Object Removal",
        readTime: "5 min",
        badge: "AI Tools",
        summary:
          "Master the modernized Windows Photos studio. Clean up stray background cables, isolate product shots, and export high-contrast web banners.",
        keyPoints: [
          "Use Generative Erase in Photos to seamlessly clean up backgrounds in thumbnails.",
          "Leverage 1-click background blur and replacement for quick portrait turnarounds.",
          "Batch edit and color-correct RAW camera files before importing into design suites.",
        ],
        proTip:
          "Use the Retouch tool with a soft brush margin to prevent halo artifacts on contrast boundaries.",
      },
    ],
  },
  {
    slug: "canva-for-creators",
    title: "Canva Pro for High-Converting Brands",
    category: "Design & 3D",
    level: "Beginner",
    badgeAccent: "#FFC700",
    lessons: [
      {
        title: "Brand Kit Architecture & Hex Management",
        readTime: "4 min",
        badge: "Branding",
        summary:
          "Establish typography hierarchies, color palettes, and asset vectors for cross-platform visual consistency.",
        keyPoints: [
          "Lock global brand palettes using official academy hex codes (#FFC700, #B8860B, #FFE082).",
          "Standardize banner ratios across YouTube, Twitter/X, and Instagram Stories.",
          "Set up shared team asset libraries to speed up daily asset production.",
        ],
        proTip:
          "Export vectors in SVG format whenever embedding into web layouts to keep file weights negligible.",
      },
    ],
  },
];

export default COURSE_CATALOG;
