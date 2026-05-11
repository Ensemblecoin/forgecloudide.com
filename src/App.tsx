import { useMemo, useState } from 'react'
import {
  Activity,
  Bot,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  FileCode2,
  GitBranch,
  Globe2,
  KeyRound,
  LayoutDashboard,
  Lock,
  Monitor,
  Play,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  Zap,
} from 'lucide-react'
import './App.css'

type View = 'dashboard' | 'builder' | 'ide' | 'deployments' | 'templates' | 'settings'
type Project = {
  name: string
  framework: string
  status: string
  updated: string
  collaborators: string[]
}

const projects: Project[] = [
  { name: 'AI SaaS Dashboard', framework: 'React + Node + Postgres', status: 'Production ready', updated: '2 hours ago', collaborators: ['M', 'A', 'J'] },
  { name: 'Creator Link Hub', framework: 'Vite + Stripe', status: 'Draft', updated: 'Yesterday', collaborators: ['M', 'K'] },
  { name: 'GameHub Prototype', framework: 'React + Canvas', status: 'Preview', updated: 'Apr 29', collaborators: ['M', 'D'] },
  { name: 'Content Calendar Agent', framework: 'React + Express', status: 'Deployed', updated: 'Apr 28', collaborators: ['M', 'A'] },
]

const files = ['package.json', 'src/App.tsx', 'src/main.tsx', 'src/components/Dashboard.tsx', 'server/index.mjs', 'database/schema.sql', 'README.md']

const code = [
  'import { createRoot } from "react-dom/client"',
  'import App from "./App"',
  '',
  'createRoot(document.getElementById("root")!).render(<App />)',
  '',
  'export function deployToProduction() {',
  '  return forgecloud.deploy({ target: "github-pages", checks: true })',
  '}',
]

const templates = [
  ['SaaS Starter', 'Auth, billing, dashboard, admin, and analytics.', 'Next.js'],
  ['AI Chatbot', 'Model controls, conversation history, and prompt presets.', 'React'],
  ['E-commerce Store', 'Catalog, cart, checkout, and order admin.', 'Vue'],
  ['API Server', 'REST API starter with auth and database adapters.', 'Express'],
]

const deploymentChecks = [
  ['Frontend build', 'Passing', CheckCircle2],
  ['GitHub Pages', 'Connected', GitBranch],
  ['Custom domain', 'www.forgecloudide.com', Globe2],
  ['HTTPS certificate', 'Provisioning', Lock],
  ['Backend API', 'Ready for Railway or Cloud Run', Server],
]

function App() {
  const [view, setView] = useState<View>('dashboard')
  const [prompt, setPrompt] = useState('Build a subscription SaaS dashboard for content creators with login, Stripe billing, analytics, AI captions, and launch readiness checks.')
  const [activeFile, setActiveFile] = useState(files[1])
  const [aiLog, setAiLog] = useState(['Plan architecture', 'Create files', 'Run build checks', 'Prepare deployment'])
  const [query, setQuery] = useState('')

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return projects
    return projects.filter((project) => `${project.name} ${project.framework} ${project.status}`.toLowerCase().includes(q))
  }, [query])

  const runAiBuilder = () => {
    setAiLog([
      'Reading founder prompt',
      'Planning React frontend and Node API',
      'Creating auth, billing, deployment, and domain workflows',
      'Generating GitHub Pages deployment plan',
      'Preparing production readiness checklist',
    ])
    setView('ide')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><Cloud size={26} /><span>ForgeCloud IDE</span></div>
        <nav>
          <NavButton view="dashboard" active={view} setView={setView} icon={LayoutDashboard} label="Dashboard" />
          <NavButton view="builder" active={view} setView={setView} icon={Sparkles} label="AI Builder" />
          <NavButton view="ide" active={view} setView={setView} icon={Code2} label="IDE Workspace" />
          <NavButton view="deployments" active={view} setView={setView} icon={Rocket} label="Deployments" />
          <NavButton view="templates" active={view} setView={setView} icon={Store} label="Templates" />
          <NavButton view="settings" active={view} setView={setView} icon={ShieldCheck} label="Settings" />
        </nav>
        <div className="status-card">
          <span>Launch score</span>
          <strong>86%</strong>
          <small>Domain connected, backend deploy next.</small>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <p>The AI cloud workspace for building real apps.</p>
            <h1>{pageTitle(view)}</h1>
          </div>
          <label className="search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, files, deploys" /></label>
        </header>

        {view === 'dashboard' && <Dashboard projects={filteredProjects} setView={setView} />}
        {view === 'builder' && <Builder prompt={prompt} setPrompt={setPrompt} runAiBuilder={runAiBuilder} aiLog={aiLog} />}
        {view === 'ide' && <Ide activeFile={activeFile} setActiveFile={setActiveFile} aiLog={aiLog} />}
        {view === 'deployments' && <Deployments />}
        {view === 'templates' && <Templates setPrompt={setPrompt} setView={setView} />}
        {view === 'settings' && <Settings />}
      </main>
    </div>
  )
}

function NavButton({ view, active, setView, icon: Icon, label }: { view: View; active: View; setView: (view: View) => void; icon: typeof LayoutDashboard; label: string }) {
  return <button className={active === view ? 'active' : ''} onClick={() => setView(view)}><Icon size={18} />{label}</button>
}

function pageTitle(view: View) {
  return {
    dashboard: 'Founder Dashboard',
    builder: 'AI App Builder',
    ide: 'Cloud IDE Workspace',
    deployments: 'Deployment Center',
    templates: 'Template Marketplace',
    settings: 'Production Settings',
  }[view]
}

function Dashboard({ projects, setView }: { projects: Project[]; setView: (view: View) => void }) {
  return <section className="page-grid">
    <article className="hero-panel">
      <span><Sparkles size={16} /> Forge Agent</span>
      <h2>Build, preview, and deploy apps with an AI cloud IDE.</h2>
      <p>Generate a full-stack plan, edit source files, run launch checks, and ship through GitHub Pages plus a production backend.</p>
      <div className="button-row"><button onClick={() => setView('builder')}><Bot size={17} /> Start building</button><button className="secondary" onClick={() => setView('deployments')}><Rocket size={17} /> Deploy</button></div>
    </article>
    <article className="metrics">
      {[['Projects', '4'], ['Deploys', '12'], ['Security checks', '18'], ['AI repairs', '7']].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
    </article>
    <section className="project-grid">
      {projects.map((project) => <article className="project-card" key={project.name}><div><h3>{project.name}</h3><p>{project.framework}</p></div><strong>{project.status}</strong><span>{project.updated}</span><div className="avatars">{project.collaborators.map((avatar) => <i key={avatar}>{avatar}</i>)}</div></article>)}
    </section>
  </section>
}

function Builder({ prompt, setPrompt, runAiBuilder, aiLog }: { prompt: string; setPrompt: (value: string) => void; runAiBuilder: () => void; aiLog: string[] }) {
  return <section className="builder-grid">
    <article className="panel wide">
      <h2>Describe the app you want to launch</h2>
      <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} />
      <div className="selector-grid">{['SaaS', 'Dashboard', 'Marketplace', 'AI Agent', 'API Backend', 'GitHub Pages'].map((item) => <button className="chip" key={item}>{item}</button>)}</div>
      <button onClick={runAiBuilder}><Sparkles size={17} /> Generate Project</button>
    </article>
    <article className="panel">
      <h2>AI build plan</h2>
      {aiLog.map((item) => <p className="check" key={item}><CheckCircle2 size={16} /> {item}</p>)}
    </article>
  </section>
}

function Ide({ activeFile, setActiveFile, aiLog }: { activeFile: string; setActiveFile: (file: string) => void; aiLog: string[] }) {
  return <section className="ide-layout">
    <aside className="file-tree">{files.map((file) => <button className={activeFile === file ? 'active' : ''} onClick={() => setActiveFile(file)} key={file}><FileCode2 size={15} />{file}</button>)}</aside>
    <article className="editor"><div className="tabs"><span>{activeFile}</span><small>Saved</small></div><pre>{code.map((line, index) => `${String(index + 1).padStart(2, ' ')}  ${line}`).join('\n')}</pre></article>
    <aside className="assistant"><h2><Bot size={18} /> Forge Agent</h2>{aiLog.map((item) => <p className="check" key={item}><Zap size={15} /> {item}</p>)}<button><Play size={16} /> Run repair loop</button></aside>
  </section>
}

function Deployments() {
  return <section className="deploy-grid">
    <article className="panel wide"><h2>GitHub Pages deployment</h2><p>The repository now contains application source code for build detection. Use GitHub Pages for the frontend and connect a Node backend on Railway, Render, Cloud Run, or Fly.io.</p><div className="deploy-url"><Globe2 size={18} /> https://www.forgecloudide.com</div></article>
    {deploymentChecks.map(([label, value, Icon]) => <article className="deploy-card" key={label as string}><Icon size={20} /><span>{label as string}</span><strong>{value as string}</strong></article>)}
  </section>
}

function Templates({ setPrompt, setView }: { setPrompt: (value: string) => void; setView: (view: View) => void }) {
  return <section className="template-grid">{templates.map(([title, text, framework]) => <article className="template-card" key={title}><Monitor size={20} /><h3>{title}</h3><p>{text}</p><span>{framework}</span><button onClick={() => { setPrompt(`Build a ${title} with ${text}`); setView('builder') }}>Use template</button></article>)}</section>
}

function Settings() {
  return <section className="settings-grid">{['Managed Postgres', 'Stripe billing', 'Email verification', 'GitHub Pages', 'Unstoppable Domains', 'Security review'].map((item) => <article className="setting-card" key={item}><KeyRound size={18} /><strong>{item}</strong><span>Configured through environment variables</span></article>)}</section>
}

export default App
