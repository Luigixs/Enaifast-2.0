# 4. Execução Ágil - Scrum e Kanban

## Estrutura de Sprints

### Sprint 0: Pesquisa e Preparação (1 semana)
**Objetivo:** Estabelecer fundação do projeto

**Atividades:**
- ✅ Pesquisa com usuários (entrevistas e questionários)
- ✅ Criação de personas
- ✅ Mapeamento de jornada do usuário
- ✅ Definição de arquitetura técnica
- ✅ Setup do ambiente de desenvolvimento
- ✅ Criação do Product Backlog priorizado

**Entregáveis:**
- Documentação de pesquisa UX
- Wireframes de telas principais
- Repositório configurado com React + TypeScript + Tailwind
- Integração com Supabase configurada

---

### Sprint 1: Fundação e Autenticação (1 semana)
**Meta:** Usuários podem criar conta e fazer login

**Sprint Planning:**
- **Capacidade da equipe:** 25 story points
- **Histórias selecionadas:**
  - Como estudante, quero criar uma conta (5 pontos)
  - Como estudante, quero fazer login (3 pontos)
  - Como estudante, quero ver um dashboard inicial (5 pontos)
  - Setup de layouts base (Admin e Student) (5 pontos)
  - Configuração de rotas (3 pontos)
  - Sistema de temas light/dark (4 pontos)

**Daily Scrums:**
*Formato: O que fiz ontem? O que farei hoje? Há impedimentos?*

**Dia 2:**
- Dev 1: "Implementei página de signup, hoje faço login"
- Dev 2: "Criei layouts base, hoje trabalho no sistema de rotas"
- Impedimento: Nenhum

**Dia 4:**
- Dev 1: "Login funcionando, hoje implemento dashboard"
- Dev 2: "Rotas prontas, hoje começo tema dark/light"
- Impedimento: Dúvida sobre design do dashboard → resolvido com Product Owner

**Sprint Review:**
- ✅ Demonstração: Signup, login, dashboard básico funcionando
- ✅ Feedback do PO: "Ótimo! Mas queria ver breadcrumb no header"
- 📝 Adicionado ao backlog para próxima sprint

**Sprint Retrospective:**
- 😊 **O que foi bem:** Boa comunicação, setup técnico rápido
- 😐 **O que pode melhorar:** Daily Scrum estava muito longa
- 💡 **Ações:** Limitar daily a 15min, usar timer

**Burndown Chart:**
```
25│●
  │ ●
20│  ●
  │   ●
15│    ●
  │     ●
10│      ●
  │       ●
5 │        ●
  │         ●
0 └──────────●
  D1 D2 D3 D4 D5
```

---

### Sprint 2: Gestão de Cursos (1 semana)
**Meta:** Administradores podem criar cursos e estudantes podem visualizá-los

**Sprint Planning:**
- **Capacidade da equipe:** 25 story points
- **Histórias selecionadas:**
  - Criar página de listagem de cursos (3 pontos)
  - Criar página de detalhes do curso (5 pontos)
  - Painel admin: criar/editar curso (8 pontos)
  - Painel admin: adicionar módulos (5 pontos)
  - Sistema de upload de thumbnails (4 pontos)

**Quadro Kanban:**
```
┌──────────┬──────────┬──────────┬──────────┐
│   TODO   │   DOING  │  REVIEW  │   DONE   │
├──────────┼──────────┼──────────┼──────────┤
│          │          │ Upload   │ Listagem │
│ Módulos  │ Criar    │ thumbs   │ cursos   │
│          │ curso    │          │          │
│          │ (Dev 1)  │          │ Detalhes │
│          │          │          │ curso    │
│          │ Editar   │          │          │
│          │ curso    │          │          │
│          │ (Dev 2)  │          │          │
└──────────┴──────────┴──────────┴──────────┘
```

**Daily Scrums:**

**Dia 2:**
- Dev 1: "Listagem de cursos pronta, hoje faço criação de curso no admin"
- Dev 2: "Detalhes do curso 80% completo, hoje termino e começo edição"
- Impedimento: Nenhum

**Dia 4:**
- Dev 1: "Criação de curso funcionando, hoje implemento módulos"
- Dev 2: "Edição pronta, hoje faço upload de thumbnails"
- Impedimento: API de upload lenta → investigando

**Sprint Review:**
- ✅ Demonstração: Fluxo completo de criar curso e visualizar
- ✅ Feedback do PO: "Perfeito! Falta apenas ordenar módulos"
- 📝 Drag-and-drop para reordenar adicionado ao backlog

**Sprint Retrospective:**
- 😊 **O que foi bem:** Entregas consistentes, boa cobertura de testes
- 😐 **O que pode melhorar:** Code review atrasou algumas tasks
- 💡 **Ações:** Revisar PRs em até 2 horas

**Velocity:** 25 pontos completados ✅

---

### Sprint 3: Submódulos e Lições (1 semana)
**Meta:** Estrutura completa de conteúdo (módulos, submódulos, lições)

**Sprint Planning:**
- **Capacidade da equipe:** 27 story points
- **Histórias selecionadas:**
  - Admin: criar submódulos (5 pontos)
  - Admin: criar lições (8 pontos)
  - Suportar diferentes tipos de lição (vídeo, PDF, texto) (8 pontos)
  - Navegação entre lições (6 pontos)

**Quadro Kanban (Mid-Sprint):**
```
┌────────────┬────────────┬────────────┬────────────┐
│    TODO    │   DOING    │   REVIEW   │    DONE    │
├────────────┼────────────┼────────────┼────────────┤
│ Navegação  │ Tipos de   │            │ Submódulos │
│ lições     │ lição      │            │            │
│            │ (Dev 1+2)  │            │ Criar      │
│            │            │            │ lições     │
│            │            │            │            │
└────────────┴────────────┴────────────┴────────────┘
```

**Daily Scrums:**

**Dia 3:**
- Dev 1: "Submódulos prontos, hoje começo suporte a vídeos"
- Dev 2: "Criação de lições OK, hoje faço suporte a PDFs"
- Impedimento: Biblioteca react-pdf com bug → trocando para react-pdf 9.2.1

**Sprint Review:**
- ✅ Demonstração: Curso completo com módulos, submódulos e lições variadas
- ✅ Feedback do PO: "Excelente! Mas PDFs precisam de zoom"
- 📝 Funcionalidade de zoom adicionada ao backlog

**Sprint Retrospective:**
- 😊 **O que foi bem:** Pair programming acelerou resolução do bug
- 😐 **O que pode melhorar:** Estimativa de tipos de lição foi otimista (8pts → deveria ser 13pts)
- 💡 **Ações:** Revisar estimativas de tasks complexas com buffer

**Velocity:** 27 pontos completados ✅

---

### Sprint 4: Visualizador de Lições (1 semana)
**Meta:** Estudantes podem assistir lições em viewer otimizado

**Sprint Planning:**
- **Capacidade da equipe:** 28 story points
- **Histórias selecionadas:**
  - Criar página de visualização de lição (13 pontos) - **ALTO RISCO**
  - Player de vídeo responsivo (3 pontos)
  - Visualizador de PDF com zoom (5 pontos)
  - Viewer em fullscreen (5 pontos)
  - Navegação anterior/próxima (2 pontos)

**Quadro Kanban (Mid-Sprint):**
```
┌──────────┬──────────┬──────────┬──────────┐
│   TODO   │  DOING   │  REVIEW  │   DONE   │
├──────────┼──────────┼──────────┼──────────┤
│          │ Viewer   │ Player   │ PDF Zoom │
│          │ fullscr. │ vídeo    │          │
│ Navegação│ (Dev 2)  │          │          │
│ prev/next│          │          │          │
│          │          │          │          │
└──────────┴──────────┴──────────┴──────────┘
```

**Impedimento Resolvido:**
- **Dia 3:** Viewer cortando conteúdo → Sessão de pair programming
- **Solução:** Ajustar height para `calc(100vh - 3.5rem)` e mover tabs para baixo

**Sprint Review:**
- ✅ Demonstração: Viewer ocupando tela inteira, PDFs e vídeos funcionando
- ✅ Feedback do PO: "Perfeito! Agora sim está profissional"
- 😍 Stakeholders impressionados com UX

**Sprint Retrospective:**
- 😊 **O que foi bem:** Resolvemos impedimento técnico rapidamente
- 😐 **O que pode melhorar:** Visualizador tomou mais tempo que previsto
- 💡 **Ações:** Para tasks >8pts, fazer spike técnico antes

**Velocity:** 28 pontos completados ✅

---

### Sprint 5: Interação Social (1 semana)
**Meta:** Comentários, anotações e favoritos funcionando

**Sprint Planning:**
- **Capacidade da equipe:** 26 story points
- **Histórias selecionadas:**
  - Sistema de comentários (8 pontos)
  - Respostas aninhadas (threading) (5 pontos)
  - Anotações pessoais (5 pontos)
  - Favoritar lições (3 pontos)
  - Migração de banco de dados para suportar comentários aninhados (5 pontos)

**Quadro Kanban (End of Sprint):**
```
┌──────────┬──────────┬──────────┬──────────┐
│   TODO   │  DOING   │  REVIEW  │   DONE   │
├──────────┼──────────┼──────────┼──────────┤
│          │          │          │ Coment.  │
│          │          │          │ Threading│
│          │          │          │ Anotações│
│          │          │          │ Favoritos│
│          │          │          │ Migração │
└──────────┴──────────┴──────────┴──────────┘
```

**Sprint Review:**
- ✅ Demonstração: Comentários estilo YouTube, respostas funcionando
- ✅ Feedback do PO: "Exatamente o que queríamos!"
- 🎉 Primeira funcionalidade social completa

**Sprint Retrospective:**
- 😊 **O que foi bem:** Migração de banco suave, zero downtime
- 😊 **O que foi bem:** Threading de comentários mais simples que esperado
- 💡 **Ações:** Continuar com planejamento cuidadoso de migrações

**Velocity:** 26 pontos completados ✅

---

### Sprint 6: Progresso e Gamificação (1 semana)
**Meta:** Sistema de progresso, XP e conclusão de lições

**Sprint Planning:**
- **Capacidade da equipe:** 25 story points
- **Histórias selecionadas:**
  - Marcar lição como concluída (5 pontos)
  - Calcular progresso de curso (5 pontos)
  - Sistema de XP (5 pontos)
  - Dashboard de progresso visual (8 pontos)
  - Ranking de estudantes (2 pontos)

**Quadro Kanban (Mid-Sprint):**
```
┌──────────┬──────────┬──────────┬──────────┐
│   TODO   │  DOING   │  REVIEW  │   DONE   │
├──────────┼──────────┼──────────┼──────────┤
│ Dashboard│ Sistema  │ Cálculo  │ Concluir │
│ progresso│ XP       │ progresso│ lição    │
│          │ (Dev 1)  │          │          │
│ Ranking  │          │          │          │
└──────────┴──────────┴──────────┴──────────┘
```

**Sprint Review:**
- ✅ Demonstração: Lições sendo marcadas, XP sendo ganho, dashboard colorido
- ✅ Feedback do PO: "Motivador! Estudantes vão adorar"
- 💡 Sugestão: Adicionar badges no futuro

**Sprint Retrospective:**
- 😊 **O que foi bem:** Velocity consistente, equipe entrosada
- 😊 **O que foi bem:** Dashboard ficou visualmente atraente
- 💡 **Ações:** Pensar em mais elementos de gamificação para próximas sprints

**Velocity:** 25 pontos completados ✅

---

## Quadro Kanban Completo

### Estrutura do Quadro
```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│   BACKLOG   │    TODO     │    DOING    │   REVIEW    │     DONE    │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Próximas    │ Sprint      │ Em          │ Aguardando  │ Completado  │
│ Sprints     │ Atual       │ Desenvolv.  │ aprovação   │ e Validado  │
│             │             │             │             │             │
│ - Certif.   │ [Sprint 6]  │ Dashboard   │ Sistema XP  │ [Sprint 1-5]│
│ - Notif.    │             │ progresso   │             │ 131 pontos  │
│ - Analytics │ Concluir    │ (Dev 1)     │ Ranking     │ completados │
│ - Busca     │ lição       │             │             │             │
│             │             │             │             │             │
│             │ Sistema XP  │             │             │             │
│             │             │             │             │             │
│             │ Dashboard   │             │             │             │
│             │             │             │             │             │
│             │ Ranking     │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

### Limites WIP (Work in Progress)
- **DOING:** Máximo 3 cards
- **REVIEW:** Máximo 2 cards

*Objetivo: Evitar trabalho em progresso excessivo e gargalos*

---

## Métricas Ágeis

### Velocity por Sprint
```
Sprint 1: 25 pontos
Sprint 2: 25 pontos
Sprint 3: 27 pontos
Sprint 4: 28 pontos
Sprint 5: 26 pontos
Sprint 6: 25 pontos

Média: 26 pontos/sprint
```

### Gráfico de Velocity
```
30│         ●
  │       ●   ● ●
25│   ● ●         ●
  │
20│
  │
15│
  └─────────────────
    1  2  3  4  5  6
       Sprint #
```

### Burndown do Projeto
**Objetivo:** Completar 156 story points em 6 sprints

```
160│●
   │ ●
140│  ●
   │   ●
120│    ●
   │     ●
100│      ●
   │       ●
80 │        ●
   │         ●
60 │          ●
   │           ●
40 │            ●
   │             ●
20 │              ●
   │               ●
0  └────────────────●
   S0 S1 S2 S3 S4 S5 S6
```

---

## Cerimônias do Scrum

### Sprint Planning (Início de cada Sprint)
**Duração:** 2 horas
**Participantes:** Todo o time

**Agenda:**
1. Review do Product Backlog (15min)
2. Definição da meta da Sprint (10min)
3. Seleção de histórias (30min)
4. Quebra de tarefas e estimativas (45min)
5. Commitment do time (10min)
6. Q&A e ajustes (10min)

**Exemplo de Planning Poker:**
```
História: "Sistema de comentários estilo YouTube"

Dev 1: 8 pontos
Dev 2: 13 pontos
Dev 3: 8 pontos

Discussão: Dev 2 está considerando threading. Time concorda que threading pode ser outra história.

Consenso: 8 pontos
```

---

### Daily Scrum (Diariamente)
**Duração:** 15 minutos (MÁXIMO)
**Participantes:** Dev Team + Scrum Master
**Horário:** 9:00 AM

**Formato:**
Cada membro responde:
1. O que fiz desde o último Daily?
2. O que farei até o próximo Daily?
3. Há algum impedimento?

**Exemplo:**
- Dev 1: "Terminei o player de vídeo, hoje faço PDF viewer. Sem impedimentos."
- Dev 2: "Trabalhei no layout do viewer, hoje integro com backend. Tenho dúvida sobre API de upload."
- Scrum Master: "Vamos resolver após o Daily."

---

### Sprint Review (Final de cada Sprint)
**Duração:** 1 hora
**Participantes:** Time completo + Stakeholders

**Agenda:**
1. Recap da meta da Sprint (5min)
2. Demonstração do incremento (30min)
3. Feedback dos stakeholders (15min)
4. Review do Product Backlog (10min)

**Exemplo de Demo Sprint 4:**
- Mostrar login → navegação até curso → abertura de lição
- Demonstrar viewer fullscreen com PDF
- Mostrar zoom funcionando
- Navegar entre lições
- Feedback: "Incrível! Mas seria legal ter atalhos de teclado"

---

### Sprint Retrospective (Final de cada Sprint)
**Duração:** 45 minutos
**Participantes:** Dev Team + Scrum Master

**Formato: Start, Stop, Continue**

**Exemplo Sprint 4:**

**Start (Começar a fazer):**
- Usar feature flags para releases graduais
- Fazer spikes técnicos para tasks >8pts

**Stop (Parar de fazer):**
- Deixar PRs abertos por mais de 24h
- Interromper colegas fora do Daily

**Continue (Continuar fazendo):**
- Pair programming em bugs críticos
- Code reviews construtivos
- Dailys curtos e focados

---

## Gestão do Product Backlog

### Priorização (Modelo MoSCoW)

**Must Have (Já Implementado):**
- ✅ Autenticação e login
- ✅ Gestão de cursos/módulos/lições
- ✅ Viewer de lições otimizado
- ✅ Comentários e anotações
- ✅ Sistema de progresso e XP

**Should Have (Próximas Sprints):**
- 🔄 Certificados automáticos
- 🔄 Notificações push
- 🔄 Busca e filtros avançados
- 🔄 Analytics detalhados

**Could Have (Backlog Futuro):**
- 📋 Modo offline
- 📋 Integração com calendário
- 📋 Badges e conquistas
- 📋 Fórum de discussões

**Won't Have (Fora de Escopo do MVP):**
- ❌ App mobile nativo
- ❌ Videoconferência ao vivo
- ❌ Marketplace de cursos
- ❌ Rede social completa

---

## Melhoria Contínua

### Lições Aprendidas

**Técnicas:**
- React Query facilitou muito gerenciamento de estado
- Supabase como backend economizou semanas de desenvolvimento
- Tailwind + shadcn/ui acelerou criação de UI
- TypeScript preveniu muitos bugs

**Processo:**
- Dailys curtos são mais eficientes
- Pair programming resolve impedimentos rapidamente
- Retrospectivas honestas melhoram o time
- Velocity se estabiliza após 2-3 sprints

**Pessoas:**
- Comunicação transparente é essencial
- Celebrar pequenas vitórias motiva o time
- Product Owner próximo acelera decisões
- Code reviews ensinam e elevam qualidade

---

## Definição de Pronto (Definition of Done)

Checklist para considerar uma história DONE:

- [ ] Código escrito e commitado
- [ ] Testes manuais realizados
- [ ] Responsividade verificada (mobile, tablet, desktop)
- [ ] Code review aprovado
- [ ] Sem erros de TypeScript/ESLint
- [ ] Integrado na branch principal
- [ ] Deployado em ambiente de staging
- [ ] Demonstrado e aprovado pelo Product Owner
- [ ] Documentação atualizada (se aplicável)

---

## Ferramentas Utilizadas

### Gestão de Projeto
- **Quadro Kanban:** Notion / Trello / Jira
- **Sprint Planning:** Miro para Planning Poker
- **Retrospectivas:** FunRetro

### Desenvolvimento
- **Versionamento:** Git + GitHub
- **CI/CD:** GitHub Actions
- **Deploy:** Vercel / Netlify
- **Backend:** Supabase (DB, Auth, Storage)

### Comunicação
- **Daily Scrum:** Google Meet / Zoom
- **Chat:** Slack / Discord
- **Documentação:** Notion / Confluence

---

## Conclusão da Execução Ágil

O projeto foi executado com sucesso utilizando práticas ágeis:

✅ **6 Sprints de 1 semana** = 6 semanas de desenvolvimento
✅ **156 story points completados** = MVP funcional entregue
✅ **Velocity consistente** = Time maduro e previsível
✅ **Feedback contínuo** = Produto alinhado com necessidades dos usuários
✅ **Melhoria contínua** = Processo otimizado sprint após sprint

O MVP está pronto para testes com usuários reais!
