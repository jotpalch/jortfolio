"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { experienceData } from "@/data/experience";
import { educationData } from "@/data/education";
import { projectsData } from "@/data/projects";
import { skillsData } from "@/data/skills";

const PROMPT = "jotpac@agent:~$ ";

const BOOT_SEQUENCE = [
  "[    0.000000] jotpac kernel: Linux driver v0.1.0 loading...",
  "[    0.001234] jotpac kernel: Initializing Wei-Cheng Chen module",
  "[    0.002100] jotpac kernel: NVIDIA GPU driver interface detected",
  "[    0.003456] jotpac kernel: Mounting /dev/experience... OK",
  "[    0.004200] jotpac kernel: Mounting /dev/projects... OK",
  "[    0.005100] jotpac kernel: Mounting /dev/skills... OK",
  "[    0.006000] jotpac kernel: Camera subsystem: Ricoh GR IIIx HDF [ready]",
  "[    0.007000] jotpac kernel: Film module: Kodak Portra 400 [loaded]",
  "[    0.008000] agent: Agentic AI interface ready",
  "[    0.009000] agent: All systems nominal. Type 'help' to begin.\n",
];

const NEOFETCH = `
  ╔══════════════════════════════╗
  ║   ┏┓ ┏━┓╺┳╸┏━┓┏━┓┏━╸      ║
  ║   ┃┃╺┫  ┃  ┣━┛┣━┫┃        ║
  ║  ╺┛╹ ┗━┛╹  ╹  ╹ ╹┗━╸      ║
  ╚══════════════════════════════╝`;

type Line = { text: string; type: "input" | "output" | "error" | "boot" | "ascii" | "agent"; cmd?: string };

// Topics that can be accessed by just typing the keyword
const SHORTCUTS: Record<string, string> = {
  resume: "cat /dev/resume",
  contact: "cat /dev/contact",
  projects: "ls /dev/projects",
  project: "ls /dev/projects",
  experience: "ls /dev/experience",
  exp: "ls /dev/experience",
  education: "ls /dev/education",
  edu: "ls /dev/education",
  skills: "ls /dev/skills",
  skill: "ls /dev/skills",
};

// Fuzzy match: find closest command/shortcut
function fuzzyMatch(input: string): string | null {
  const all = [...Object.keys(SHORTCUTS), "help", "whoami", "neofetch", "uname", "dmesg", "lsmod", "lspci", "htop", "clear", "history"];
  let best = "";
  let bestDist = Infinity;
  for (const candidate of all) {
    const dist = levenshtein(input, candidate);
    if (dist < bestDist && dist <= 2) { bestDist = dist; best = candidate; }
  }
  return best || null;
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function formatTable(headers: string[], rows: string[][]): string {
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => (r[i] || "").length)));
  const header = headers.map((h, i) => ` ${h.padEnd(widths[i])} `).join("│");
  const body = rows.map((r) => r.map((c, i) => ` ${(c || "").padEnd(widths[i])} `).join("│")).join("\n");
  return `${header}\n${"─".repeat(header.length)}\n${body}`;
}

function runCommand(input: string): Line[] {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0]?.toLowerCase();
  const arg = parts.slice(1).join(" ").toLowerCase();

  if (!cmd) return [];

  // Smart shortcut: typing just "projects" = "ls /dev/projects"
  const fullInput = input.trim().toLowerCase();
  if (SHORTCUTS[fullInput]) {
    const expanded = SHORTCUTS[fullInput];
    const redirect: Line = { text: `(→ ${expanded})`, type: "boot" };
    const expandedParts = expanded.split(/\s+/);
    return [redirect, ...runCommand(expanded)];
  }

  switch (cmd) {
    case "help":
      return [{ text: `whoami          neofetch        uname -a        dmesg
lsmod           lspci           htop            history
cat /dev/resume                 cat /dev/contact
ls /dev/projects                ls /dev/experience
ls /dev/education               ls /dev/skills
ask <question>                  clear`, type: "output" }];

    case "whoami":
      return [{ text: `PID 1 — Wei-Cheng Chen
├── Role:     System Software Engineer
├── Org:      NVIDIA Corporation
├── Location: Taipei, Taiwan
├── Status:   ● ACTIVE
├── Uptime:   since Dec 2025
└── Signal:   Delivering smiles`, type: "output" }];

    case "neofetch":
      return [
        { text: NEOFETCH, type: "ascii" },
        { text: `  ├── Host:      Wei-Cheng Chen
  ├── Role:      System Software Engineer @ NVIDIA
  ├── Kernel:    Linux driver development
  ├── Agent:     Agentic AI workflows
  ├── Shell:     bash / zsh
  ├── Editor:    vim
  ├── Camera:    Ricoh GR IIIx HDF
  ├── Film:      Kodak Portra 400 / Gold 200
  ├── Location:  Taipei, Taiwan
  └── Site:      jotpac.com`, type: "output" },
      ];

    case "uname":
      return [{ text: "jotpac 0.1.0 #1 SMP Wei-Cheng-Chen aarch64 GNU/Linux\nDriver: NVIDIA USB (RDSS) | Agent: jotpac-agent v0.1", type: "output" }];

    case "dmesg":
      return BOOT_SEQUENCE.map((text) => ({ text, type: "boot" as const }));

    case "lsmod":
      return [{ text: `Module              Size  Used by
nvidia_driver       1024  1    [permanent]
agentic_ai          512   1    [permanent]
photography         256   1    film_module
film_module         128   0
ricoh_gr3x          64    1    photography`, type: "output" }];

    case "lspci":
      return [{ text: `00:00.0 Host bridge: NVIDIA Corporation
00:01.0 GPU: NVIDIA (Linux driver)
00:02.0 Camera: Ricoh GR IIIx HDF [40mm f/2.8]
00:03.0 AI Accelerator: Agentic AI Engine v1.0`, type: "output" }];

    case "cat":
      if (arg.includes("resume")) {
        return [{ text: `━━━ /dev/resume ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Wei-Cheng Chen
  System Software Engineer @ NVIDIA

  ▸ Linux driver development & system software
  ▸ Agentic AI applications & workflows
  ▸ M.S. Computer Science — NYCU (2023-2025)
  ▸ B.S. Computer Science — NCTU/NYCU (2019-2023)

  Previous modules loaded:
    Intel → Realtek → ASML → Intel

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, type: "output" }];
      }
      if (arg.includes("contact")) {
        return [{ text: `━━━ /dev/contact ━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Email:    jotp076315217@gmail.com
  GitHub:   github.com/jotpalch
  Site:     jotpac.com
  Resume:   jotpac.com/resume/resume.pdf

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, type: "output" }];
      }
      if (arg.includes("project") || arg.includes("experience") || arg.includes("education") || arg.includes("skill")) {
        return [{ text: `cat: ${arg}: Is a directory\nTry: ls ${arg}`, type: "error" }];
      }
      return [{ text: `cat: ${arg || "?"}: No such device\nTry: cat /dev/resume | cat /dev/contact`, type: "error" }];

    case "ls":
      if (arg.includes("project")) {
        const rows = projectsData.map((p) => [p.title, String(p.year), p.categories?.[0] || ""]);
        return [{ text: `━━━ /dev/projects ━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${formatTable(["PROJECT", "YEAR", "CATEGORY"], rows)}`, type: "output" }];
      }
      if (arg.includes("experience") || arg.includes("exp")) {
        const rows = experienceData.map((e) => [e.company, e.role, `${e.startDate}${e.endDate ? " → " + e.endDate : " → Present"}`]);
        return [{ text: `━━━ /dev/experience ━━━━━━━━━━━━━━━━━━━━━━━━\n\n${formatTable(["COMPANY", "ROLE", "PERIOD"], rows)}`, type: "output" }];
      }
      if (arg.includes("education") || arg.includes("edu")) {
        const rows = educationData.map((e) => [e.school, `${e.degree} ${e.field}`, `${e.startYear}-${e.endYear}`]);
        return [{ text: `━━━ /dev/education ━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${formatTable(["SCHOOL", "DEGREE", "PERIOD"], rows)}`, type: "output" }];
      }
      if (arg.includes("skill")) {
        const text = skillsData.map((c) => `  [${c.name}]\n  ${c.skills.join(" │ ")}`).join("\n\n");
        return [{ text: `━━━ /dev/skills ━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${text}`, type: "output" }];
      }
      if (arg.includes("dev") || !arg) {
        return [{ text: `crw-r--r-- 1 root root   /dev/resume
crw-r--r-- 1 root root   /dev/contact
drwxr-xr-x 1 root root   /dev/projects/
drwxr-xr-x 1 root root   /dev/experience/
drwxr-xr-x 1 root root   /dev/education/
drwxr-xr-x 1 root root   /dev/skills/`, type: "output" }];
      }
      return [{ text: `ls: cannot access '${arg}': No such file or directory`, type: "error" }];

    case "ask": {
      if (!arg) return [{ text: "Usage: ask <question>\nExample: ask what do you do", type: "error" }];
      const words = arg.split(/\s+/);
      const has = (...keys: string[]) => keys.some((k) => words.some((w) => w.includes(k)));

      if (has("hello", "hi", "hey", "yo", "sup")) {
        return [{ text: `[agent] Hey! I'm jotpac's agent. Ask me anything about Wei-Cheng.
[agent] Try: work, education, projects, photography, skills, contact`, type: "agent" }];
      }
      if (has("do", "work", "job", "role", "position")) {
        return [{ text: `[agent] System Software Engineer at NVIDIA — Linux drivers + agentic AI.
[agent] Also a film photographer. Type 'whoami' for the quick version.`, type: "agent" }];
      }
      if (has("education", "school", "university", "degree", "nycu", "nctu", "master", "bachelor", "study")) {
        return [{ text: `[agent] M.S. Computer Science — NYCU (2023-2025)
[agent] B.S. Computer Science — NCTU/NYCU (2019-2023)
[agent] Type 'ls /dev/education' for details.`, type: "agent" }];
      }
      if (has("hire", "contact", "reach", "email", "mail")) {
        return [{ text: `[agent] jotp076315217@gmail.com
[agent] github.com/jotpalch
[agent] jotpac.com/resume/resume.pdf`, type: "agent" }];
      }
      if (has("photo", "camera", "film", "ricoh", "gr3x", "portra", "shoot")) {
        return [{ text: `[agent] Digital: Ricoh GR IIIx HDF — 40mm street shooter.
[agent] Film: was Fuji Cardia Hite (lost in Half Moon Bay 2025).
[agent] Stocks: Kodak Portra 400, Gold 200, Fuji Superia 400.`, type: "agent" }];
      }
      if (has("project", "build", "made", "portfolio", "poker", "bot")) {
        return [{ text: `[agent] Highlights:
[agent] ▸ AIoT Poker Table — YOLOv5 + Monte Carlo on ESP32
[agent] ▸ LINE Fresh Bot — Top 6 / 200 teams
[agent] ▸ This site — Next.js + Three.js photo wall
[agent] 'ls /dev/projects' for all 15.`, type: "agent" }];
      }
      if (has("driver", "linux", "kernel", "nvidia", "usb")) {
        return [{ text: `[agent] USB driver dev at NVIDIA (RDSS program).
[agent] Linux kernel, C/C++, system software.
[agent] Try 'lsmod' or 'lspci' to poke around.`, type: "agent" }];
      }
      if (has("agent", "ai", "llm", "rag", "agentic", "ml")) {
        return [{ text: `[agent] Agentic AI — autonomous LLM workflows.
[agent] RAG pipelines, tool use, multi-agent orchestration.
[agent] This terminal is basically one :)`, type: "agent" }];
      }
      if (has("skill", "tech", "stack", "language", "tool", "framework")) {
        return [{ text: `[agent] C/C++, Python, JS/TS, Linux, Docker, Git
[agent] TensorFlow, PyTorch, YOLOv5, LLM/RAG
[agent] 'ls /dev/skills' for the full tree.`, type: "agent" }];
      }
      if (has("hobby", "interest", "free", "fun", "outside")) {
        return [{ text: `[agent] Film photography mostly. Street shooting in Taipei.
[agent] Some poker, some coding side projects.
[agent] And building this website apparently.`, type: "agent" }];
      }
      if (has("age", "old", "born", "birthday")) {
        return [{ text: `[agent] B.S. started 2019. You do the math.`, type: "agent" }];
      }
      if (has("where", "location", "live", "based", "city")) {
        return [{ text: `[agent] Taipei, Taiwan.
[agent] Previously Hsinchu (university years).
[agent] Visited SF / Half Moon Bay in 2025 (RIP my film camera).`, type: "agent" }];
      }
      if (has("why", "site", "website", "portfolio")) {
        return [{ text: `[agent] Wanted a place to put photos and projects.
[agent] Also an excuse to build something with Three.js.
[agent] And this terminal page.`, type: "agent" }];
      }
      return [{ text: `[agent] Not sure about that one. Try asking about:
[agent] work, education, projects, skills, photography, contact, driver, ai`, type: "agent" }];
    }

    case "echo":
      return [{ text: arg || "", type: "output" }];

    case "clear":
      return [];

    case "insmod":
    case "modprobe":
      return [{ text: `Loading module: ${arg || "unknown"}...\n[agent] Module loaded successfully. Welcome aboard.`, type: "agent" }];

    case "rmmod":
      return [{ text: `ERROR: Module ${arg || "unknown"} is in use. Cannot unload.`, type: "error" }];

    case "cd": {
      // Smart cd: redirect to ls
      if (arg.includes("project")) return [{ text: `(→ ls /dev/projects)`, type: "boot" }, ...runCommand("ls /dev/projects")];
      if (arg.includes("experience") || arg.includes("exp")) return [{ text: `(→ ls /dev/experience)`, type: "boot" }, ...runCommand("ls /dev/experience")];
      if (arg.includes("education") || arg.includes("edu")) return [{ text: `(→ ls /dev/education)`, type: "boot" }, ...runCommand("ls /dev/education")];
      if (arg.includes("skill")) return [{ text: `(→ ls /dev/skills)`, type: "boot" }, ...runCommand("ls /dev/skills")];
      if (arg.includes("dev")) return [{ text: `(→ ls /dev)`, type: "boot" }, ...runCommand("ls /dev")];
      return [{ text: "cd: nowhere to go. Try: ls /dev", type: "output" }];
    }

    case "sudo":
      return [{ text: "[sudo] password for visitor: ████████\nvisitor is not in the sudoers file. This incident will be reported.", type: "error" }];

    case "rm":
      return [{ text: "rm: cannot remove: Operation not permitted\n[agent] Whoa there. Let's keep everything intact.", type: "error" }];

    case "vim":
    case "nano":
    case "code":
      return [{ text: `${cmd}: readonly filesystem. This portfolio is immutable.`, type: "error" }];

    case "exit":
    case "logout":
      return [{ text: "[agent] Where would you go? You're already home.", type: "agent" }];

    case "ping":
      return [{ text: `PING ${arg || "jotpac.com"} (127.0.0.1): 56 bytes\n64 bytes: time=0.042ms\n64 bytes: time=0.038ms\n--- ${arg || "jotpac.com"} ping statistics ---\n2 packets transmitted, 2 received, 0% loss`, type: "output" }];

    case "htop":
    case "top":
      return [{ text: `  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
    1 jotpac    20   0   brain   100%   N/A R  100  100   25y+ life
    2 nvidia    20   0   driver  high   N/A S   80   50    4m+ work
    3 agent     20   0   llm     high   N/A S   60   40    4m+ agentic_ai
    4 ricoh     20   0   gr3x    med    N/A S   20   10    1y+ photography
    5 film      20   0   portra  low    N/A S   10    5    3y+ analog`, type: "output" }];

    case "nvidia-smi":
      return [{ text: `Fri Mar 28 00:00:00 2026
+-------------------------------------------------------------------------+
| NVIDIA-SMI 000.00.00    Driver Version: jotpac 0.1    CUDA Version: N/A |
|-------------------------------+----------------------+------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute|
|===============================+======================+==================|
|   0  Wei-Cheng Chen      On  | 00000000:00:01.0  On |                0 |
| N/A   36C    P0    42W / 250W |    1024MiB / brain   |     87%  Default |
+-------------------------------+----------------------+------------------+
|  Processes:                                                             |
|  GPU   PID   Type   Process name                        GPU Memory Usage|
|    0     1      C   /usr/bin/linux-driver                     512MiB    |
|    0     2      C   /usr/bin/agentic-ai                       256MiB    |
|    0     3      G   /usr/bin/photography                      128MiB    |
+-------------------------------------------------------------------------+`, type: "output" }];

    case "claude":
    case "claude-code":
      return [{ text: `[agent] I appreciate the compliment but I'm jotpac-agent, not Claude.
[agent] Though I was built with love and a lot of LLM tokens.
[agent] Type 'ask' to chat with me instead.`, type: "agent" }];

    case "gemini-cli":
    case "codex-cli":
      return [{ text: `[agent] Those are cool tools but this terminal runs jotpac-agent.
[agent] We're vendor-agnostic here.`, type: "agent" }];

    case "chatgpt":
    case "gpt":
    case "gemini":
    case "copilot":
    case "codex":
      return [{ text: `[agent] Wrong address. This is jotpac territory.`, type: "agent" }];

    case "docker":
      if (arg.includes("ps")) {
        return [{ text: `CONTAINER ID   IMAGE              STATUS          NAMES
a1b2c3d4e5f6   jotpac/portfolio   Up 25 years     life
b2c3d4e5f6a1   nvidia/driver      Up 4 months     work
c3d4e5f6a1b2   jotpac/agent       Up 4 months     agentic-ai
d4e5f6a1b2c3   ricoh/gr3x-hdf     Up 1 year       photography`, type: "output" }];
      }
      if (arg.includes("images") || arg.includes("image")) {
        return [{ text: `REPOSITORY          TAG       SIZE
jotpac/portfolio    latest    ∞
nvidia/driver       v0.1      1024MB
jotpac/agent        v0.1      512MB
kodak/portra400     film      36 frames
fuji/superia400     film      36 frames`, type: "output" }];
      }
      if (arg.includes("run")) {
        return [{ text: `[agent] Container already running. You're inside it right now.`, type: "agent" }];
      }
      if (arg.includes("stop") || arg.includes("kill")) {
        return [{ text: `Error: cannot stop container "life": permission denied`, type: "error" }];
      }
      if (arg.includes("pull")) {
        return [{ text: `Pulling from jotpac/portfolio...\nlatest: Already up to date.`, type: "output" }];
      }
      return [{ text: `Usage: docker ps | docker images | docker run | docker pull`, type: "output" }];

    case "python":
    case "python3":
    case "node":
      return [{ text: `>>> print("hire Wei-Cheng")\nhire Wei-Cheng\n>>> exit()`, type: "output" }];

    case "git":
      if (arg.includes("log")) {
        return [{ text: `commit abc1234 (HEAD -> main)\nAuthor: Wei-Cheng Chen <jotp076315217@gmail.com>\nDate:   today\n\n    Still building cool stuff`, type: "output" }];
      }
      if (arg.includes("blame")) {
        return [{ text: `Wei-Cheng Chen  (100%)  Every. Single. Line.`, type: "output" }];
      }
      return [{ text: `On branch main\nYour portfolio is up to date with 'origin/main'.`, type: "output" }];

    case "make":
      return [{ text: `make: *** No targets specified. But here's what I make:\n  - Linux drivers\n  - Agentic AI apps\n  - Film photographs\n  - Smiles`, type: "output" }];

    case "curl":
      return [{ text: `curl: try 'cat /dev/contact' instead`, type: "output" }];

    case "ssh":
      return [{ text: `ssh: connect to host jotpac.com port 22: Nice try\n[agent] You're already connected. Look around.`, type: "agent" }];

    case "man":
      return [{ text: `No manual entry for ${arg || "life"}\n[agent] But 'help' works here.`, type: "agent" }];

    case "cowsay": {
      const msg = arg || "moo";
      const line = "─".repeat(msg.length + 2);
      return [{ text: ` ${line}\n< ${msg} >\n ${line}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`, type: "output" }];
    }

    case "sl":
      return [{ text: "SL_ANIMATION", type: "output" }];

    case "fortune":
      return [{ text: [
        "A good photograph is knowing where to stand. — Ansel Adams",
        "The best error message is the one that never shows up.",
        "First, solve the problem. Then, write the code. — John Johnson",
        "In photography, there is a reality so subtle that it becomes more real than reality. — Alfred Stieglitz",
        "Talk is cheap. Show me the code. — Linus Torvalds",
      ][Math.floor(Math.random() * 5)], type: "output" }];

    default: {
      // Fuzzy match
      const guess = fuzzyMatch(fullInput) || fuzzyMatch(cmd);
      if (guess) {
        const expanded = SHORTCUTS[guess] || guess;
        return [
          { text: `bash: ${cmd}: command not found`, type: "error" },
          { text: `did you mean: ${expanded}?`, type: "agent", cmd: expanded },
        ];
      }
      return [{ text: `bash: ${cmd}: command not found\nType 'help' for commands.`, type: "error" }];
    }
  }
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [booting, setBooting] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  // Boot sequence animation
  useEffect(() => {
    let i = 0;
    const bootLines: Line[] = [];
    const interval = setInterval(() => {
      if (i < BOOT_SEQUENCE.length) {
        bootLines.push({ text: BOOT_SEQUENCE[i], type: "boot" });
        setLines([...bootLines]);
        scrollToBottom();
        i++;
      } else {
        setBooting(false);
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [scrollToBottom]);

  const handleSubmitCmd = useCallback((cmd: string) => {
    const newLines: Line[] = [...lines, { text: PROMPT + cmd, type: "input" }];
    if (cmd === "clear") { setLines([]); return; }
    if (cmd === "history") {
      newLines.push({ text: history.map((h, i) => `  ${i + 1}  ${h}`).join("\n") || "  (empty)", type: "output" });
    } else {
      newLines.push(...runCommand(cmd));
    }
    setLines(newLines);
    setInput("");
    if (cmd) setHistory((h) => [...h, cmd]);
    setHistoryIdx(-1);
    scrollToBottom();
  }, [lines, history, scrollToBottom]);

  const handleSubmit = useCallback(() => {
    if (booting) return;
    const trimmed = input.trim();
    const newLines: Line[] = [...lines, { text: PROMPT + trimmed, type: "input" }];

    if (trimmed === "clear") {
      setLines([]);
      setInput("");
      setHistory((h) => [...h, trimmed]);
      setHistoryIdx(-1);
      return;
    }

    if (trimmed === "history") {
      const out = history.map((h, i) => `  ${i + 1}  ${h}`).join("\n");
      newLines.push({ text: out || "  (empty)", type: "output" });
    } else {
      newLines.push(...runCommand(trimmed));
    }

    setLines(newLines);
    setInput("");
    if (trimmed) setHistory((h) => [...h, trimmed]);
    setHistoryIdx(-1);
    scrollToBottom();
  }, [input, lines, history, booting, scrollToBottom]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const idx = historyIdx + 1;
      if (idx >= history.length) { setHistoryIdx(-1); setInput(""); }
      else { setHistoryIdx(idx); setInput(history[idx]); }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const cmds = ["help", "whoami", "neofetch", "uname -a", "dmesg", "lsmod", "lspci", "htop", "cat /dev/resume", "cat /dev/contact", "ls /dev/projects", "ls /dev/experience", "ls /dev/education", "ls /dev/skills", "ls /dev", "ask ", "history", "echo", "clear", "ping"];
      const match = cmds.find((c) => c.startsWith(input));
      if (match) setInput(match);
    }
  }, [handleSubmit, history, historyIdx, input]);

  useEffect(() => {
    if (!booting) inputRef.current?.focus();
  }, [lines, booting]);

  return (
    <div
      className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-2xl backdrop-blur-xl"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500/60" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
        <div className="h-3 w-3 rounded-full bg-green-500/60" />
        <span className="ml-2 font-mono text-[11px] text-white/30">jotpac@agent — bash — 80×24</span>
      </div>

      <div
        ref={scrollRef}
        className="h-[60vh] overflow-y-auto p-4 font-mono text-[13px] leading-relaxed sm:h-[70vh]"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line.type === "input" && (
              <span><span className="text-green-400/80">{PROMPT}</span><span className="text-white/90">{line.text.replace(PROMPT, "")}</span></span>
            )}
            {line.type === "output" && line.text === "SL_ANIMATION" ? (
              <div className="overflow-hidden">
                <pre className="animate-[slTrain_3s_linear_forwards] whitespace-pre text-white/60">{`      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|
   /     |  |   H  |  |     |   |         ||_| |_||
  |      |  |   H  |__--------------------| [___] |
  (| | O |H |   |  |____[]__|  | |Y Y Y Y|_|-----|
  /|\\ |  |H | / \\|  |         | | |.|  | |\\|  |  |
 / \\|\\___|_H|/   \\__|_________|___|__|__|___| |__|
    |   |  /|    | \\  |  | |__|------|\\__|  |  | |
    |___|_/ |   / \\ \\  | |_|    | | \\   |  | /|/
     H  H   |  |   \\ \\ | |     | |  \\  | | ||
     H  H   |__|     \\___|      |     \\|_|_||`}</pre>
              </div>
            ) : line.type === "output" ? <span className="text-white/60">{line.text}</span> : null}
            {line.type === "error" && <span className="text-red-400/70">{line.text}</span>}
            {line.type === "boot" && <span className="text-cyan-400/50">{line.text}</span>}
            {line.type === "ascii" && <span className="text-green-400/60">{line.text}</span>}
            {line.type === "agent" && line.cmd ? (
              <span
                className="cursor-pointer text-amber-400/70 underline decoration-amber-400/30 hover:decoration-amber-400/70"
                onClick={(e) => { e.stopPropagation(); setInput(line.cmd!); handleSubmitCmd(line.cmd!); }}
              >
                {line.text}
              </span>
            ) : line.type === "agent" ? (
              <span className="text-amber-400/70">{line.text}</span>
            ) : null}
          </div>
        ))}

        {!booting && (
          <div className="flex items-center">
            <span className="mr-1 text-green-400/80">{PROMPT}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border-none bg-transparent text-white/90 caret-green-400 outline-none"
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
