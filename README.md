# 🔥 Focus Timer

Um timer de estudos desktop simples, bonito e eficiente. Acompanhe suas sessões de estudo, visualize seu progresso semanal e mantenha o foco.

![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)

---

## ✨ Funcionalidades

- ⏱️ **Timer funcional** — Inicie, pause e salve suas sessões de estudo
- 📊 **Gráfico semanal** — Visualize suas horas de estudo por dia
- 📅 **Histórico de sessões** — Veja todas as sessões da semana atual
- 📈 **Estatísticas** — Total da semana, média diária e número de sessões
- 💾 **Dados locais** — Tudo salvo no seu computador, sem internet necessária
- 🎨 **Interface moderna** — Design escuro com tema âmbar

---

## 📸 Screenshot

![Focus Timer](/assets/screenshots/screenshot_1.png)

---

## 📥 Download

Acesse a página de [Releases](/release/1.0.0/) e baixe o instalador mais recente:

**`Focus Timer Setup 1.0.0.exe`**

### Instalação
1. Baixe o instalador
2. Execute o arquivo `.exe`
3. Siga as instruções do instalador
4. Abra o Focus Timer pelo atalho criado na área de trabalho

> **Nota:** O banco de dados é criado automaticamente na primeira execução em `C:\Users\[SeuUsuário]\AppData\Roaming\focus-timer\`

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| [Electron](https://electronjs.org) | Framework desktop |
| [React 19](https://react.dev) | Interface do usuário |
| [TypeScript](https://typescriptlang.org) | Linguagem de programação |
| [TailwindCSS](https://tailwindcss.com) | Estilização |
| [Prisma](https://prisma.io) | ORM para banco de dados |
| [SQLite](https://sqlite.org) | Banco de dados local |
| [Recharts](https://recharts.org) | Gráficos |
| [Vite](https://vitejs.dev) | Bundler |

---

## 🚀 Desenvolvimento

### Pré-requisitos

- [Node.js](https://nodejs.org) v18+
- npm v9+

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/Kaualbuquerque/focus-timer.git

# Entrar na pasta
cd focus-timer

# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Criar banco de dados
npx prisma migrate dev
```

### Executar em desenvolvimento

```bash
# Terminal 1 - React (Vite)
npm run dev:vite

# Terminal 2 - Electron
npm run dev:electron
```

### Build

```bash
# Gerar executável
npm run dist

# O instalador será gerado em:
# release/1.0.0/Focus Timer Setup 1.0.0.exe
```

---

## 📁 Estrutura do Projeto

```
focus-timer/
├── src/
│   ├── main/                   # Electron Main Process
│   │   ├── index.ts            # Ponto de entrada
│   │   ├── preload.ts          # Bridge Renderer ↔ Main
│   │   ├── prisma.ts           # Instância do Prisma
│   │   └── services/
│   │       └── sessionService.ts # CRUD de sessões
│   └── renderer/               # React (Interface)
│       ├── components/         # Componentes
│       ├── utils/
│       │   └── time.ts         # Funções de tempo
│       ├── types/
│       │   └── components.ts   # Tipagens TypeScript
│       ├── App.tsx
│       └── main.tsx
├── prisma/
│   ├── schema.prisma           # Schema do banco
│   └── migrations/             # Migrações
├── assets/
│   └── icon.png                # Ícone do app
└── package.json
```

---

## 🗄️ Banco de Dados

Os dados são salvos **localmente** no seu computador:

```
Windows: C:\Users\[Usuário]\AppData\Roaming\focus-timer\focus-timer.db
```

**Schema:**
```prisma
model Session {
  id        String   @id @default(cuid())
  dayOfWeek Int
  startTime DateTime
  duration  Int       # Em segundos
  completed Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

## 👤 Autor

**Kauã Albuquerque**

---

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou pull request.

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feat/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova funcionalidade'`)
4. Push para a branch (`git push origin feat/nova-funcionalidade`)
5. Abra um Pull Request
