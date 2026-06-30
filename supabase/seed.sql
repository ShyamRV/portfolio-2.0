-- =============================================================================
-- SEED — real owner content (Shyamji Pandey)
--
-- Mirrors lib/content/resume-data.ts. Sourced from the provided resume + public
-- GitHub profile (github.com/ShyamRV). Run against the Supabase project to make
-- the DB the source of truth; until then the app renders the same data from the
-- TypeScript module. Idempotent-ish: clears the singleton profile first.
-- =============================================================================

delete from profile;

insert into profile (full_name, tagline, bio, resume_json, social_links)
values (
  'Shyamji Pandey',
  'Agentic AI Engineer & Developer Advocate @ Fetch.ai · CV & ML Researcher',
  'Agentic AI Engineer specializing in autonomous multi-agent systems, computer vision, and LLM orchestration, with experience building production-grade AI products adopted in real-world ecosystems. Passionate about advancing embodied intelligence, AI infrastructure, and scalable autonomous systems through research and engineering.',
  jsonb_build_object(
    'roles', jsonb_build_array(
      jsonb_build_object('company','Fetch.ai','title','Agentic AI Engineer & Developer Advocate (Remote Internship)','start','2026-04','end','2026-07','highlights', jsonb_build_array(
        'Building production AI agents daily on Fetch.ai''s full stack (uAgents, Agentverse, Almanac) — each deployment contributes real-world interaction data that powers and improves ASI:ONE, Fetch.ai''s flagship agentic LLM.',
        'Owning the end-to-end agent lifecycle — architecture to development to testing to production — across enterprise fintech, healthcare, and operations use cases.',
        'Driving ecosystem adoption as Developer Advocate: organising and judging weekly workshops, hackathons, and developer events; onboarding engineers onto the uAgents and ASI:ONE stack.')),
      jsonb_build_object('company','Amity University Bengaluru','title','Graph Neural Networks Researcher','start','2026-02','end',null,'highlights', jsonb_build_array(
        'Implementing GCN and GAT architectures for link prediction on large-scale heterogeneous networks (10K+ nodes, 50K+ edges); benchmarked against DeepWalk, Node2Vec, and LINE baselines.',
        'Applications in drug-drug interaction prediction, social network analysis, and biomedical knowledge graph completion; evaluated on ogbl-collab and a custom pharma dataset.',
        'Drafting a manuscript for submission to a top-tier ML/bioinformatics venue (AAAI 2027 / Bioinformatics journal).')),
      jsonb_build_object('company','Fetch.ai','title','ASI:ONE Community Lead','start','2026-01','end',null,'location','Bengaluru','highlights', jsonb_build_array(
        'Technical evangelism for Fetch.ai''s agent ecosystem; live-coding workshops on uAgents, LangChain, RAG pipelines, and decentralised ML reaching 500+ developers.')),
      jsonb_build_object('company','Amity University Bengaluru','title','Deep Learning Researcher — Computer Vision (Govt. Funded)','start','2025-12','end',null,'highlights', jsonb_build_array(
        'Developing YOLO + ResNet architectures for UAV real-time object detection; achieved 30+ FPS on embedded hardware with a 25% performance gain via augmentation, transfer learning, and hyperparameter optimisation.',
        'Benchmarked model variants on a custom UAV dataset; ran ablation studies on backbone depth vs. latency tradeoffs; manuscript in preparation targeting CVPR / ICCV 2026-27.',
        'Applied multi-scale feature fusion and knowledge distillation to reduce model size by 40% without accuracy loss on low-altitude aerial imagery.')),
      jsonb_build_object('company','HashiCorp User Group','title','Organiser','start','2025-08','end',null,'location','Bengaluru','highlights', jsonb_build_array(
        'Scaled the community 0 to 2,000+ professionals with AWS/Azure/GCP sponsorships; 60% QoQ attendance growth and 4.5+/5 satisfaction across Terraform/Vault workshops.'))
    ),
    'education', jsonb_build_array(
      jsonb_build_object('school','Amity University Bengaluru','credential','B.Tech — Artificial Intelligence & Machine Learning (GPA 8.2/10.0)','year','Sep 2023 – Aug 2026 (completing early)')
    ),
    'publications', jsonb_build_array(
      jsonb_build_object('title','YOLO + ResNet for Real-Time UAV Object Detection','note','Manuscript in preparation — targeting CVPR / ICCV 2026-27'),
      jsonb_build_object('title','GCN/GAT Link Prediction on Biomedical Knowledge Graphs','note','Manuscript in preparation — targeting AAAI 2027 / Bioinformatics')
    ),
    'talks', jsonb_build_array(
      jsonb_build_object('title','A Deep Dive into Building a Multi-Agent System on the Fetch.ai Ecosystem','venue','New Relic HQ, Bengaluru · Mar 2026 · 100+ engineers'),
      jsonb_build_object('title','How Agentic AI is Turning LLMs into Autonomous Products','venue','Hacknight Bengaluru — Elastic + AWS · May 2026 · 200+ engineers')
    )
  ),
  jsonb_build_array(
    jsonb_build_object('label','GitHub','url','https://github.com/ShyamRV'),
    jsonb_build_object('label','LinkedIn','url','https://www.linkedin.com/in/shyamji-pandey/'),
    jsonb_build_object('label','YouTube','url','https://www.youtube.com/@NeuroManShyam'),
    jsonb_build_object('label','Email','url','mailto:shyamjipandeyrv@gmail.com')
  )
);

insert into projects (slug, title, summary, problem_statement, architecture_notes, tech_stack, impact_metrics, demo_url, repo_url, status, featured, sort_order) values
('bankvoiceai','BankVoiceAI — Autonomous AI Voice Banking System',
 'A 7-agent autonomous banking pipeline with real-time call routing and regulatory compliance. Open source, officially adopted by Fetch.ai.',
 'Banks and NBFCs run large, costly human call centres. BankVoiceAI replaces that with an autonomous multi-agent voice system handling calls 24/7 while staying compliant.',
 'Seven coordinated uAgents handle call routing and conversation, with AES-256 encryption and FDCPA/TCPA/CFPB compliance. Telephony via Twilio; state in Supabase PostgreSQL; orchestration via FastAPI/Python; agent discovery via the Almanac.',
 array['Fetch.ai uAgents','ASI:ONE','Almanac','Twilio','Supabase PostgreSQL','FastAPI','Python'],
 jsonb_build_object('Modeled savings','$230K/mo vs 500-exec call centre','Agents','7','Compliance','FDCPA / TCPA / CFPB'),
 null,'https://github.com/ShyamRV/banking-voice-ai','active',true,0),
('resq-bengaluru','ResQ Bengaluru — Agentic AI Pet Rescue Coordination',
 'Real-time injury detection and urgency triage from rescue images, with GPS-aware NGO/vet matching. 1st Place — Hacknight Bengaluru 2026 (Elastic + AWS).',
 'Animal rescues need fast triage and the right nearby NGO/vet. ResQ automates injury assessment from a photo and routes each case to the best-matched responder.',
 'An AWS Bedrock vision pipeline detects injuries and assigns urgency; GPS-aware Elasticsearch dense_vector retrieval (Jina embeddings) matches cases to NGOs/vets. Next.js/TypeScript front end with a Node.js backend.',
 array['AWS Bedrock','Elasticsearch','Jina Embeddings','Next.js','TypeScript','Node.js'],
 jsonb_build_object('Award','1st Place — Hacknight Bengaluru 2026'),
 null,null,'active',true,1),
('neo-prime','NEO PRIME — Neural Robotic Intelligence System',
 'An SLM-controlled robotic arm with 0.5mm precision and real-time vision-guided re-planning mid-grasp.',
 'Robotic manipulation in dynamic scenes needs to re-plan when objects move. NEO PRIME couples a small language model controller with real-time perception to adapt grasps on the fly.',
 'Real-time YOLO object detection plus sensor fusion feed an SLM controller that re-plans grasps dynamically. Runs on Raspberry Pi with ROS; vision via OpenCV; models in TensorFlow.',
 array['Python','TensorFlow','OpenCV','YOLO','ROS','Raspberry Pi'],
 jsonb_build_object('Precision','0.5mm','Success rate','95% over 500+ cycles'),
 null,null,'active',true,2),
('nexusc','NexusC — Agentic AI Social Media Manager',
 'A 4-agent autonomous pipeline for the end-to-end YouTube upload workflow — zero manual input, saving creators 30+ hours/week.',
 'Publishing video content involves repetitive title/description/thumbnail work. NexusC automates the entire upload workflow with no manual input.',
 'Four coordinated uAgents drive the pipeline; ASI:ONE generates CTR-optimised titles, SEO descriptions, and 1024x1024 AI thumbnails; LangChain orchestrates steps; publishing via the YouTube Data API v3.',
 array['Fetch.ai uAgents','ASI:ONE','LangChain','YouTube Data API v3','Python'],
 jsonb_build_object('Time saved','30+ hrs/week'),
 null,null,'active',true,3),
('nextjs-sandbox-agent','Next.js Sandbox Agent',
 'A uAgents chat agent that turns a natural-language prompt into a live, deployed Next.js application — no manual setup.',
 'Spinning up and deploying a new web app is repetitive setup. This agent goes from prompt to a live preview and published app automatically.',
 'A uAgents chat agent (ASI:ONE) generates and deploys a Next.js app, shows a live preview before shipping, and publishes to GitHub and Vercel. First generation free; follow-up edits paid (Stripe). Dockerised.',
 array['Python','uAgents','ASI:ONE','Next.js','Vercel','Stripe','Docker'],
 null,null,'https://github.com/ShyamRV/nextjs-sandbox-agent','active',false,4),
('meetup-agent','Meetup Agent',
 'An event-scoped networking agent on Agentverse — attendees join via QR code and get matched with the most relevant people in the room.',
 'Networking at events is hit-or-miss. Meetup Agent ranks the most relevant people for each attendee in about a minute.',
 'Attendees join via QR code; the agent returns top-5 ranked connections in ~60 seconds with LLM explanations and a shareable AI profile card. Event data auto-expires after 30 days. uAgents/ASI:ONE with PostgreSQL and OAuth2; Dockerised.',
 array['Python','uAgents','ASI:ONE','PostgreSQL','OAuth2','Docker'],
 jsonb_build_object('Match latency','Top-5 in ~60s'),
 null,'https://github.com/ShyamRV/meetup-agent','active',false,5),
('universal-marketplace-agent','Universal Marketplace Agent',
 'A conversational shopping agent that turns a multi-item request into a ready-to-pay cart across live merchants.',
 'Multi-item purchases span many merchants. This agent assembles a ready-to-pay cart optimised for landed cost.',
 'Discovers and prices items across multiple merchants in one pass, optimising for landed cost, and falls back to a merchant redirect when native checkout cannot complete. uAgents/ASI:ONE with UCP and Stripe; PostgreSQL; Dockerised.',
 array['Python','uAgents','ASI:ONE','UCP','Stripe','PostgreSQL','Docker'],
 null,null,'https://github.com/ShyamRV/universal-marketplace-agent','active',false,6);

-- Talks & publications also as content_items so they appear on /research & /talks
-- before any auto-sync runs (source_type 'manual'/'scholar').
insert into content_items (source_type, title, description, url, published_at, sync_status) values
('scholar','YOLO + ResNet for Real-Time UAV Object Detection','Manuscript in preparation — targeting CVPR / ICCV 2026-27','https://github.com/ShyamRV#uav-cv','2026-01-01','success'),
('scholar','GCN/GAT Link Prediction on Biomedical Knowledge Graphs','Manuscript in preparation — targeting AAAI 2027 / Bioinformatics','https://github.com/ShyamRV#gnn','2026-02-01','success')
on conflict (url) do nothing;
