import Alpine from 'alpinejs'
import focus from '@alpinejs/focus'
import autoAnimate from '@formkit/auto-animate'
import SimpleBar from 'simplebar'

window.autoAnimate = autoAnimate;
window.SimpleBar = SimpleBar;
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
    name: 'intray',
    dir: '/Users/vova/projects/intray',
    is_active: true,
    services: [{
      name: 'tauri-dev',
      command: 'npm run tauri dev',
    }],
  }, {
    name: 'watchmylogs',
    dir: '/Users/vova/projects/wml',
    is_active: true,
    services: [{
      name: 'css',
      command: 'npm run css -- --watch',
    }, {
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
    'intray-tauri-dev': [{
      date: Date.now(),
      diff: 'just now',
      content: `> tauri
> tauri dev

  Running BeforeDevCommand (\`npm run dev\`)

> dev
> vite

  VITE v4.5.0  ready in 454 ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
        Info Watching /Users/vova/projects/intray/src-tauri for changes...
   Compiling intray v0.1.0 (/Users/vova/projects/intray/src-tauri)
   Finished dev [unoptimized + debuginfo] target(s) in 10.34s
   `
    }],
    'watchmylogs-css': [{
      date: Date.now() - 52000,
      diff: '1 minute ago',
      content: `Rebuilding...
Done in 1661ms.`
    }, {
      date: Date.now() - 303000,
      diff: '5 minutes ago',
      content: `> watchmylogs@1.9.0 css
> npx tailwindcss -i ./src/browser/styles.css -o ./assets/styles.css --minify --watch`
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

Alpine.start()
