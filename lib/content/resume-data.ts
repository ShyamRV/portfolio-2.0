import type { Profile, Project } from "./types";

/**
 * REAL owner content — Shyamji Pandey. Sourced directly from the provided
 * resume + public GitHub profile (github.com/ShyamRV). Used as the rendering
 * source-of-truth until the same data is inserted into Supabase (supabase/
 * seed.sql mirrors this). NOT placeholder — `isPlaceholder` is false for this.
 *
 * Nothing here is invented. Fields without a real, sourced value are left null
 * (e.g. project `tradeoffs` — still pending the owner's own-voice input).
 */

export const REAL_PROFILE: Profile = {
  full_name: "Shyamji Pandey",
  tagline: "Agentic AI Engineer & Developer Advocate @ Fetch.ai · CV & ML Researcher",
  bio: "Agentic AI Engineer specializing in autonomous multi-agent systems, computer vision, and LLM orchestration, with experience building production-grade AI products adopted in real-world ecosystems. Passionate about advancing embodied intelligence, AI infrastructure, and scalable autonomous systems through research and engineering.",
  social_links: [
    { label: "GitHub", url: "https://github.com/ShyamRV" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/shyamji-pandey/" },
    { label: "YouTube", url: "https://www.youtube.com/@NeuroManShyam" },
    { label: "Email", url: "mailto:shyamjipandeyrv@gmail.com" },
  ],
  resume_json: {
    roles: [
      {
        company: "Fetch.ai",
        title: "Agentic AI Engineer & Developer Advocate (Remote Internship)",
        start: "2026-04",
        end: "2026-07",
        highlights: [
          "Building production AI agents daily on Fetch.ai's full stack (uAgents, Agentverse, Almanac) — each deployment contributes real-world interaction data that powers and improves ASI:ONE, Fetch.ai's flagship agentic LLM.",
          "Owning the end-to-end agent lifecycle — architecture → development → testing → production — across enterprise fintech, healthcare, and operations use cases.",
          "Driving ecosystem adoption as Developer Advocate: organising and judging weekly workshops, hackathons, and developer events; onboarding engineers onto the uAgents and ASI:ONE stack.",
        ],
      },
      {
        company: "Amity University Bengaluru",
        title: "Graph Neural Networks Researcher",
        start: "2026-02",
        end: null,
        highlights: [
          "Implementing GCN and GAT architectures for link prediction on large-scale heterogeneous networks (10K+ nodes, 50K+ edges); benchmarked against DeepWalk, Node2Vec, and LINE baselines.",
          "Applications in drug–drug interaction prediction, social network analysis, and biomedical knowledge graph completion; evaluated on ogbl-collab and a custom pharma dataset.",
          "Drafting a manuscript for submission to a top-tier ML/bioinformatics venue (AAAI 2027 / Bioinformatics journal).",
        ],
      },
      {
        company: "Fetch.ai",
        title: "ASI:ONE Community Lead",
        start: "2026-01",
        end: null,
        location: "Bengaluru",
        highlights: [
          "Technical evangelism for Fetch.ai's agent ecosystem; live-coding workshops on uAgents, LangChain, RAG pipelines, and decentralised ML reaching 500+ developers.",
        ],
      },
      {
        company: "Amity University Bengaluru",
        title: "Deep Learning Researcher — Computer Vision (Govt. Funded)",
        start: "2025-12",
        end: null,
        highlights: [
          "Developing YOLO + ResNet architectures for UAV real-time object detection; achieved 30+ FPS on embedded hardware with a 25% performance gain via augmentation, transfer learning, and hyperparameter optimisation.",
          "Benchmarked model variants on a custom UAV dataset; ran ablation studies on backbone depth vs. latency tradeoffs; manuscript in preparation targeting CVPR / ICCV 2026–27.",
          "Applied multi-scale feature fusion and knowledge distillation to reduce model size by 40% without accuracy loss on low-altitude aerial imagery.",
        ],
      },
      {
        company: "HashiCorp User Group",
        title: "Organiser",
        start: "2025-08",
        end: null,
        location: "Bengaluru",
        highlights: [
          "Scaled the community 0 → 2,000+ professionals with AWS/Azure/GCP sponsorships; 60% QoQ attendance growth and 4.5+/5 satisfaction across Terraform/Vault workshops.",
        ],
      },
    ],
    education: [
      {
        school: "Amity University Bengaluru",
        credential:
          "B.Tech — Artificial Intelligence & Machine Learning (GPA 8.2/10.0)",
        year: "Sep 2023 – Aug 2026 (completing early)",
      },
    ],
    skillGroups: [
      {
        label: "CV & Vision",
        skills: [
          "YOLO (v5–v10)",
          "ResNet",
          "EfficientDet",
          "OpenCV",
          "Feature Pyramids",
          "Transfer Learning",
        ],
      },
      {
        label: "Graph ML",
        skills: ["GCN", "GAT", "GraphSAGE", "Node2Vec", "DeepWalk", "PyG", "DGL"],
      },
      {
        label: "Deep Learning",
        skills: [
          "PyTorch",
          "TensorFlow",
          "Transformers",
          "Attention",
          "Knowledge Distillation",
        ],
      },
      {
        label: "Agentic AI",
        skills: [
          "LangChain",
          "LangGraph",
          "A2A",
          "RAG",
          "pgvector",
          "Pinecone",
          "MCP",
          "CrewAI",
        ],
      },
      {
        label: "ML Ops & Infra",
        skills: [
          "AWS Bedrock / SageMaker / S3",
          "GCP Vertex AI",
          "Docker",
          "FastAPI",
          "LlamaIndex",
          "LangSmith",
        ],
      },
      {
        label: "Languages",
        skills: ["Python", "C/C++", "TypeScript", "SQL"],
      },
      {
        label: "Robotics",
        skills: ["ROS2", "Arduino", "Raspberry Pi 5", "Reinforcement Learning", "Gazebo"],
      },
    ],
    publications: [
      {
        title: "YOLO + ResNet for Real-Time UAV Object Detection",
        note: "Manuscript in preparation — targeting CVPR / ICCV 2026–27",
      },
      {
        title: "GCN/GAT Link Prediction on Biomedical Knowledge Graphs",
        note: "Manuscript in preparation — targeting AAAI 2027 / Bioinformatics",
      },
    ],
    talks: [
      {
        title:
          "A Deep Dive into Building a Multi-Agent System on the Fetch.ai Ecosystem",
        venue: "New Relic HQ, Bengaluru · Mar 2026 · 100+ engineers",
      },
      {
        title: "How Agentic AI is Turning LLMs into Autonomous Products",
        venue: "Hacknight Bengaluru — Elastic + AWS · May 2026 · 200+ engineers",
      },
    ],
  },
};

export const REAL_PROJECTS: Project[] = [
  {
    id: "bankvoiceai",
    slug: "bankvoiceai",
    title: "BankVoiceAI — Autonomous AI Voice Banking System",
    summary:
      "A 7-agent autonomous banking pipeline with real-time call routing and regulatory compliance. Open source, officially adopted by Fetch.ai.",
    problem_statement:
      "Banks and NBFCs run large, costly human call centres for collections and support. BankVoiceAI replaces that with an autonomous multi-agent voice system handling calls 24/7 while staying compliant.",
    architecture_notes:
      "Seven coordinated uAgents on Fetch.ai handle call routing and conversation, with AES-256 encryption and FDCPA/TCPA/CFPB compliance built in. Telephony via Twilio; state in Supabase PostgreSQL; orchestration via FastAPI/Python; agent discovery via the Almanac.",
    tech_stack: [
      "Fetch.ai uAgents",
      "ASI:ONE",
      "Almanac",
      "Twilio",
      "Supabase PostgreSQL",
      "FastAPI",
      "Python",
    ],
    impact_metrics: {
      "Modeled savings": "$230K/mo vs 500-exec call centre",
      Agents: "7",
      Compliance: "FDCPA / TCPA / CFPB",
    },
    tradeoffs: null,
    demo_url: null,
    repo_url: "https://github.com/ShyamRV/banking-voice-ai",
    status: "active",
    featured: true,
    sort_order: 0,
  },
  {
    id: "resq-bengaluru",
    slug: "resq-bengaluru",
    title: "ResQ Bengaluru — Agentic AI Pet Rescue Coordination",
    summary:
      "Real-time injury detection and urgency triage from rescue images, with GPS-aware NGO/vet matching. 1st Place — Hacknight Bengaluru 2026 (Elastic + AWS).",
    problem_statement:
      "Animal rescues need fast triage and the right nearby NGO/vet. ResQ automates injury assessment from a photo and routes each case to the best-matched responder.",
    architecture_notes:
      "An AWS Bedrock vision pipeline detects injuries and assigns urgency from rescue images; GPS-aware Elasticsearch dense_vector retrieval (Jina embeddings) matches cases to NGOs/vets. Front end in Next.js/TypeScript with a Node.js backend.",
    tech_stack: [
      "AWS Bedrock",
      "Elasticsearch",
      "Jina Embeddings",
      "Next.js",
      "TypeScript",
      "Node.js",
    ],
    impact_metrics: { Award: "1st Place — Hacknight Bengaluru 2026" },
    tradeoffs: null,
    demo_url: null,
    repo_url: null,
    status: "active",
    featured: true,
    sort_order: 1,
  },
  {
    id: "neo-prime",
    slug: "neo-prime",
    title: "NEO PRIME — Neural Robotic Intelligence System",
    summary:
      "An SLM-controlled robotic arm with 0.5mm precision and real-time vision-guided re-planning mid-grasp.",
    problem_statement:
      "Robotic manipulation in dynamic scenes needs to re-plan when objects move. NEO PRIME couples a small language model controller with real-time perception to adapt grasps on the fly.",
    architecture_notes:
      "Real-time YOLO object detection plus sensor fusion feed an SLM controller that re-plans grasps dynamically. Runs on Raspberry Pi with ROS; vision via OpenCV; models in TensorFlow.",
    tech_stack: ["Python", "TensorFlow", "OpenCV", "YOLO", "ROS", "Raspberry Pi"],
    impact_metrics: {
      Precision: "0.5mm",
      "Success rate": "95% over 500+ cycles",
    },
    tradeoffs: null,
    demo_url: null,
    repo_url: null,
    status: "active",
    featured: true,
    sort_order: 2,
  },
  {
    id: "nexusc",
    slug: "nexusc",
    title: "NexusC — Agentic AI Social Media Manager",
    summary:
      "A 4-agent autonomous pipeline for the end-to-end YouTube upload workflow — zero manual input, saving creators 30+ hours/week.",
    problem_statement:
      "Publishing video content involves repetitive title/description/thumbnail work. NexusC automates the entire upload workflow with no manual input.",
    architecture_notes:
      "Four coordinated uAgents drive the pipeline; ASI:ONE generates CTR-optimised titles, SEO descriptions, and 1024×1024 AI thumbnails; LangChain orchestrates steps; publishing via the YouTube Data API v3.",
    tech_stack: [
      "Fetch.ai uAgents",
      "ASI:ONE",
      "LangChain",
      "YouTube Data API v3",
      "Python",
    ],
    impact_metrics: { "Time saved": "30+ hrs/week" },
    tradeoffs: null,
    demo_url: null,
    repo_url: null,
    status: "active",
    featured: true,
    sort_order: 3,
  },
  {
    id: "nextjs-sandbox-agent",
    slug: "nextjs-sandbox-agent",
    title: "Next.js Sandbox Agent",
    summary:
      "A uAgents chat agent that turns a natural-language prompt into a live, deployed Next.js application — no manual setup.",
    problem_statement:
      "Spinning up and deploying a new web app is repetitive setup. This agent goes from prompt to a live preview and published app automatically.",
    architecture_notes:
      "A uAgents chat agent (ASI:ONE) generates and deploys a Next.js app, shows a live preview before shipping, and publishes straight to GitHub and Vercel. First generation is free; follow-up edits are paid (Stripe). Containerised with Docker.",
    tech_stack: [
      "Python",
      "uAgents",
      "ASI:ONE",
      "Next.js",
      "Vercel",
      "Stripe",
      "Docker",
    ],
    impact_metrics: null,
    tradeoffs: null,
    demo_url: null,
    repo_url: "https://github.com/ShyamRV/nextjs-sandbox-agent",
    status: "active",
    featured: false,
    sort_order: 4,
  },
  {
    id: "meetup-agent",
    slug: "meetup-agent",
    title: "Meetup Agent",
    summary:
      "An event-scoped networking agent on Agentverse — attendees join via QR code and get matched with the most relevant people in the room.",
    problem_statement:
      "Networking at events is hit-or-miss. Meetup Agent ranks the most relevant people for each attendee in about a minute.",
    architecture_notes:
      "Attendees join via QR code; the agent returns top-5 ranked connections in ~60 seconds with LLM-generated explanations and a shareable AI profile card. Event data auto-expires after 30 days. Built on uAgents/ASI:ONE with PostgreSQL and OAuth2; Dockerised.",
    tech_stack: ["Python", "uAgents", "ASI:ONE", "PostgreSQL", "OAuth2", "Docker"],
    impact_metrics: { "Match latency": "Top-5 in ~60s" },
    tradeoffs: null,
    demo_url: null,
    repo_url: "https://github.com/ShyamRV/meetup-agent",
    status: "active",
    featured: false,
    sort_order: 5,
  },
  {
    id: "universal-marketplace-agent",
    slug: "universal-marketplace-agent",
    title: "Universal Marketplace Agent",
    summary:
      "A conversational shopping agent that turns a multi-item request into a ready-to-pay cart across live merchants.",
    problem_statement:
      "Multi-item purchases (a gaming setup, an outfit) span many merchants. This agent assembles a ready-to-pay cart optimised for landed cost.",
    architecture_notes:
      "Discovers and prices items across multiple merchants in one pass, optimising for landed cost rather than sticker price, and falls back to a merchant redirect when native checkout can't complete. Built on uAgents/ASI:ONE with UCP and Stripe; PostgreSQL; Dockerised.",
    tech_stack: ["Python", "uAgents", "ASI:ONE", "UCP", "Stripe", "PostgreSQL", "Docker"],
    impact_metrics: null,
    tradeoffs: null,
    demo_url: null,
    repo_url: "https://github.com/ShyamRV/universal-marketplace-agent",
    status: "active",
    featured: false,
    sort_order: 6,
  },
];
