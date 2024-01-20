import Alpine from 'alpinejs'
import anchor from '@alpinejs/anchor'
import focus from '@alpinejs/focus'
import autoAnimate from '@formkit/auto-animate'
import SimpleBar from 'simplebar'

window.autoAnimate = autoAnimate;
window.SimpleBar = SimpleBar;
window.os = (() => {
  var appVersion = navigator.appVersion;

  if (appVersion.includes('Win')) return 'win';
  if (appVersion.includes('Mac')) return 'mac';
  if (appVersion.includes('Linux')) return 'linux';
})();

Alpine.plugin(anchor)
Alpine.plugin(focus)

Alpine.data('demo', () => ({
  cli: 'status',
  state: 'running',
  popup: '',
  logs: {},

  openSettings() {
    this.popup = 'settings';
  },

  openManageApps() {
    this.popup = 'apps';
  },

  openLog(serviceName) {
    this.logs[serviceName] = true;
  },

  closeLog(serviceName) {
    delete this.logs[serviceName];
  },

  turnOff() {
    document.querySelector('.off-mask').classList.add('shown');
    setTimeout(() => {
      document.addEventListener('click', () => {
        document.querySelector('.off-mask').classList.remove('shown');
      }, {
        once: true
      });
    }, 10)
  },

  start() {
    this.cli = 'start';
    setTimeout(() => this.state = 'starting', 3700);
    setTimeout(() => this.state = 'running', 5700);
  },

  stop() {
    this.cli = 'stop';
    setTimeout(() => this.state = 'stopping', 3700);
    setTimeout(() => this.state = 'stopped', 5700);
  },

  restart() {
    this.cli = 'restart';
    setTimeout(() => this.state = 'stopping', 3700);
    setTimeout(() => this.state = 'starting', 4200);
    setTimeout(() => this.state = 'running', 5700);
  },

  isRunning() {
    return this.state === 'running';
  },

  isStopped() {
    return this.state === 'stopped';
  },
}));

Alpine.data('settings', () => ({
  autostart: false,
  porterAutostart: false,
  appearance: 'system',

  init() {
    this.appearance = localStorage.getItem('appearance') || 'system';
  },

  setAppearance(value) {
    this.appearance = value;
    localStorage.setItem('appearance', value);
    document.dispatchEvent(new Event('intray:appearanceUpdate'));
  },
}));

Alpine.data('apps', () => ({
  apps: [{
    name: 'intrayrun',
    dir: '/Users/vova/sites/intray.run',
    is_active: true,
    services: [{
      name: 'dev',
      command: 'npm run dev',
    }],
  }, {
    name: 'tauri-intray',
    dir: '/Users/vova/projects/intray',
    is_active: true,
    services: [{
      name: 'dev',
      command: 'npm run tauri dev',
    }],
  }, {
    name: 'watchmylogs',
    dir: '/Users/vova/projects/wml',
    is_active: true,
    services: [{
      name: 'electronmon',
      command: 'npx electronmon .',
    }]
  }],
  expanded: [],
}));

Alpine.data('logs', () => ({
  timeFormatter: new Intl.DateTimeFormat([], {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }),
  data: {
    'tauri-intray-dev': [{
      date: Date.now(),
      diff: 'just now',
      content: `> tauri
> tauri dev

  Running BeforeDevCommand (\`npm run dev\`)

> dev
> vite

  VITE v4.5.0  ready in 454 ms

  ➜  Local:   <span class="text-blue-600 dark:text-blue-500 cursor-pointer underline hover:no-underline">http://localhost:5174/</span>
  ➜  Network: use --host to expose
        Info Watching /Users/vova/projects/intray/src-tauri for changes...
   Compiling intray v0.1.0 (/Users/vova/projects/intray/src-tauri)
   Finished dev [unoptimized + debuginfo] target(s) in 10.34s
   `
    }],
    'intrayrun-dev': [{
      date: Date.now() - 52000,
      diff: '1 minute ago',
      content: `> vite

  VITE v5.0.10  ready in 1204 ms
  ➜  Local:   <span class="text-blue-600 dark:text-blue-500 cursor-pointer underline hover:no-underline">http://localhost:5173/</span>
  ➜  Network: use --host to expose`
    }],
   'watchmylogs-electronmon': [{
      date: Date.now() - 909000,
      diff: '15 minutes ago',
      content: `(node:21157) Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections and HTTPS requests insecure by disabling certificate verification.
(Use \`Electron --trace-warnings ...\` to show where the warning was created)`
    }, {
      date: Date.now() - 960000,
      diff: '16 minutes ago',
      content: `[electronmon] waiting for a change to restart it`
    }],
  }
}));

Alpine.start();

if (import.meta.env.PROD) {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-H4HMP55RJX');

  var script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-H4HMP55RJX';
  script.async = true;
  document.head.appendChild(script);
}
