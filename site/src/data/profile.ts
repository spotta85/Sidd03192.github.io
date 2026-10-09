// All copy for the page lives here so variants never disagree about the facts.
// Sourced from the resume PDF in the repo root.

export const profile = {
  name: 'Siddharth Potta',
  handle: 'sidd',
  tagline: 'Systems engineer working close to the metal.',
  blurb:
    'CS at UT Austin. I build things at the layer where software meets silicon — GPU firmware at Intel, an out-of-order CPU taped out on FPGA, and an LLM inference accelerator from CUDA kernels down to SystemVerilog.',
  shortBlurb: 'CS @ UT Austin · GPU firmware at Intel · computer architecture, compilers, and everything under the runtime.',
  location: 'Folsom, CA · Austin, TX',
  links: {
    github: 'https://github.com/spotta85',
    linkedin: 'https://www.linkedin.com/in/siddharth-potta-110260260/',
    email: 'mailto:sidddharthpotta@gmail.com',
    resume: `${import.meta.env.BASE_URL}siddharth-potta-resume.pdf`,
  },
} as const

export const now = {
  company: 'Intel',
  role: 'System Software Engineer Intern',
  team: 'GuC — GPU firmware',
  period: 'Apr 2026 — Present',
  place: 'Folsom, CA',
  points: [
    'Tuned the GPU microkernel scheduler — cut context-switch overhead and lifted frame-submission throughput under load.',
    'Shipped a Python performance-analysis tool now used across multiple Intel GPU teams to debug firmware behavior.',
    'Resolved critical race conditions and enriched crash dumps with scheduler and register state for live-system debugging.',
  ],
} as const

export const experience = [
  {
    company: 'Intel',
    role: 'System Software Engineer Intern',
    team: 'GuC — GPU firmware',
    period: 'Apr 2026 — Present',
    place: 'Folsom, CA',
    current: true,
    tech: ['c', 'cpp', 'python', 'linux'],
    points: [
      'Collaborated with Microsoft, Linux, and graphics teams on a Python graphics micro-controller performance-analysis tool, now used across multiple Intel GPU teams to debug firmware behavior, find bottlenecks, and accelerate validation workflows.',
      'Optimized the GPU microkernel scheduler, reducing context-switch overhead by improving frame-submission throughput under heavy load and enhancing gaming performance.',
      'Hardened GPU firmware by resolving critical race conditions and enriching crash-dump output with scheduler and register state, enabling faster live-system debugging and root-cause analysis.',
    ],
  },
  {
    company: 'Longhorn Developers',
    role: 'Lead Developer',
    team: 'UT Degree Audit Plus',
    period: 'Aug 2025 — Present',
    place: 'Austin, TX',
    current: true,
    tech: ['typescript', 'react', 'postgres'],
    points: [
      'Architected and lead a team of 6 engineers building UT Degree Audit Plus, a Chrome extension serving 50,000+ UT students by automating course planning and registration.',
      'Built and tested a Llama 3 RAG system that turns unstructured degree-requirement data into personalized academic plans by reasoning over student preferences and degree requirements.',
      'Led QA for the extension — Playwright automated testing, bug-reporting workflows, and code reviews verifying data accuracy against UT Registrar systems.',
    ],
  },
  {
    company: 'Texas Convergent',
    role: 'Software Developer · Build Team Mentor',
    team: 'AI Dance Coach',
    // the dev role ran Jan–May 2025; the mentorship started earlier and is
    // ongoing, so the span covers both
    period: 'May 2024 — Present',
    place: 'Austin, TX',
    current: true,
    tech: ['python', 'react'],
    points: [
      'Led a team of 7 building a proprietary AI dance coach for local teams and studios, using computer vision to deliver real-time feedback during training sessions.',
      'Architected a data-intensive pose-estimation pipeline in MediaPipe and Python, using vector analysis and Euclidean distance to quantify dancer accuracy.',
      'Designed an interactive feedback system with real-time visual overlays to enhance training sessions.',
      // Build Team Mentor sits under Activities on the resume; kept as a bullet
      // here so the "21 engineers mentored" stat lands on something that backs
      // it up, without splitting the company into two timeline entries.
      'Continue on as a Build Team Mentor — 21 students across 4 project teams, plus weekly workshops on ML and full-stack development.',
    ],
  },
] as const

// `tech` keys index into TECH in data/tech.tsx. Entries not named outright on
// the resume are inferred from each project's toolchain (e.g. CMake for the C++
// build, Docker/GCP for the Codesprout deployment).
export const projects = [
  {
    name: 'LLM Inference Accelerator',
    kind: 'C++ · CUDA · SystemVerilog',
    tech: ['cpp', 'cuda', 'systemverilog', 'python', 'cmake'],
    tagline: 'One model, three backends — CPU, GPU, and custom RTL.',
    detail:
      'A modular inference engine with an op-graph IR, INT8 quantization, and kernel fusion. Custom CUDA kernels from naive to tensor cores, plus a SystemVerilog systolic-array matmul core, all behind one backend interface for head-to-head benchmarking. Runs MoE, multi-token prediction, and diffusion text models, deployed live on FPGA.',
    href: null,
  },
  {
    name: 'Out-of-Order CPU',
    kind: 'SystemVerilog · Verilator · Quartus',
    tech: ['systemverilog', 'verilator', 'quartus', 'c', 'python'],
    tagline: 'A pipelined OOO processor, taped out and running on real silicon.',
    detail:
      'L1/L2 cache hierarchy, hardware TLB, and a load-store queue. Verified by an automated co-simulation harness that diffs RTL state against a golden C ISS across AArch64 ELF binaries. Extended the ISA with full exception/syscall support and a hardware low-power mode.',
    href: 'https://github.com/Sidd03192/OutOfOrder-CPU',
  },
  {
    name: 'Codesprout',
    kind: 'LangChain · GCP · Kafka · Redis',
    tech: ['langchain', 'python', 'gcp', 'kafka', 'redis', 'docker', 'next'],
    tagline: 'EdTech LMS that grades and plans lessons for you.',
    detail:
      'Agentic AI systems in production — Code-Act agents for reliable tool execution and grading, agentic RAG for personalized learning, and multi-step curriculum generation. Cut grading time by 90% for pilot users on Cloud Run and Docker.',
    href: 'https://www.codesprout.net',
  },
  {
    name: 'x86 Mini OS',
    kind: 'C · Pintos · bochs',
    tech: ['c', 'pintos', 'bochs', 'linux'],
    tagline: 'Kernel threads, demand paging, and a Linux-style file system.',
    detail:
      'Core OS subsystems built from scratch: priority scheduling, user program support, on-disk inodes, path resolution, and buffer caching — with a hard focus on race-free concurrency.',
    href: null,
  },
] as const

// `to` drives the count-up; `suffix`/`decimals` shape how it lands.
//
// `target` makes the stat clickable: it names the page to open and which entry
// to land on there — `company` matches an `experience` entry, `project` matches
// a `projects` name. Stats with no target (the GPA) render as plain text.
export const stats = [
  {
    to: 50,
    suffix: 'k+',
    label: 'students served',
    note: 'UT Degree Audit Plus',
    // the extension is Longhorn Developers' work, which lives in experience —
    // there is no standalone project entry for it
    target: { page: 'experience', company: 'Longhorn Developers' },
  },
  {
    to: 90,
    suffix: '%',
    label: 'grading time cut',
    note: 'Codesprout',
    target: { page: 'projects', project: 'Codesprout' },
  },
  {
    to: 21,
    suffix: '',
    label: 'engineers mentored',
    note: 'Texas Convergent',
    target: { page: 'experience', company: 'Texas Convergent' },
  },
  { to: 3.82, suffix: '', decimals: 2, label: 'GPA', note: 'UT Austin' },
] as const

/** Where a clickable stat points — see `target` on `stats` above. */
export type StatTarget = Extract<(typeof stats)[number], { target: unknown }>['target']
