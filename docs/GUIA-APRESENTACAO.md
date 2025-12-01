# Guia de Apresentação - Metodologias Ágeis e UX/IX

## 📋 Mapeamento Completo da Atividade

### 1. Planejamento Ágil ✅
**Onde está:** `docs/01-planejamento-agil.md`

**O que mostrar ao professor:**
- **Equipe e Papéis** (linhas 3-22): Product Owner, Scrum Master, Dev Team
- **Produto Escolhido** (linhas 25-35): Sistema de Gestão de Cursos Online (LMS)
- **Product Backlog** (linhas 38-77): 6 Épicos com histórias de usuário
- **Sprint 0** (linhas 80-111): Pesquisa, personas, wireframes, definição de tecnologias
- **Definition of Done** (linhas 114-140): Critérios de pronto
- **Priorização** (linhas 143-165): Must Have, Should Have, Could Have
- **Estimativas** (linhas 169-183): Planning Poker com Story Points

**Como demonstrar:**
1. Abra o arquivo e mostre a seção "Equipe e Papéis"
2. Navegue até "Product Backlog" e explique os 6 épicos
3. Mostre as estimativas em Story Points

---

### 2. Pesquisa UX ✅
**Onde está:** `docs/02-pesquisa-ux.md`

**O que mostrar ao professor:**
- **Entrevistas com Usuários** (linhas 3-30): Metodologia e principais descobertas
- **Personas** (linhas 31-132): 
  - Ana Silva (Estudante universitária)
  - Carlos Mendes (Professor online)
  - Beatriz Costa (Freelancer)
- **Cenários de Uso** (linhas 134-188): 3 cenários detalhados
- **Jornada do Usuário** (linhas 190-342): 6 fases mapeadas com ações, pensamentos, emoções

**Como demonstrar:**
1. Mostre a seção de "Personas" com fotos, biografia, objetivos e frustrações
2. Navegue pelos "Cenários de Uso" explicando cada um
3. Apresente o "Mapa de Jornada" com as fases: Descoberta → Cadastro → Exploração → Aprendizado → Engajamento → Conclusão

---

### 3. Prototipação e IxD ✅
**Onde está:** `docs/03-prototipacao-ixd.md`

**O que mostrar ao professor:**
- **Arquitetura da Informação** (linhas 5-47): Estrutura hierárquica do sistema
- **Fluxos de Interação** (linhas 51-167): 4 fluxos principais com diagramas Mermaid
  - Fluxo 1: Cadastro e primeiro acesso
  - Fluxo 2: Navegação do estudante
  - Fluxo 3: Interação durante a lição
  - Fluxo 4: Administrador criando curso
- **Princípios de IxD Aplicados** (linhas 170-457):
  - Visibilidade do Estado do Sistema
  - Controle e Liberdade do Usuário
  - Prevenção de Erros
  - Consistência e Padrões
  - E mais 5 princípios
- **Wireframes e Protótipos** (linhas 459-514): Documentação de componentes

**Como demonstrar:**
1. Mostre os diagramas Mermaid dos fluxos de interação
2. Explique os princípios de IxD aplicados com exemplos de código
3. Navegue pelo sistema funcionando e aponte cada princípio em ação

**No sistema funcionando:**
- Acesse `/student/courses` para mostrar os cards de cursos
- Entre em um curso para mostrar a navegação hierárquica
- Abra uma lição para demonstrar o viewer fullscreen e interações

---

### 4. Execução Ágil (Scrum + Kanban) ✅
**Onde está:** `docs/04-execucao-agil.md`

**O que mostrar ao professor:**

#### **Quadro Kanban** (linhas 101-133, 297-317)
```
┌─────────────┬──────────────┬─────────────┬──────────┐
│  Backlog    │  Em Progr.   │  Em Review  │  Pronto  │
│  (WIP: ∞)   │  (WIP: 3)    │  (WIP: 2)   │ (WIP: ∞) │
├─────────────┼──────────────┼─────────────┼──────────┤
│ História 1  │ História 4   │ História 7  │ História │
│ História 2  │ História 5   │             │ História │
│ História 3  │              │             │ História │
└─────────────┴──────────────┴─────────────┴──────────┘
```

#### **Sprints Executadas** (linhas 3-295):
- **Sprint 0**: Pesquisa e prototipação
- **Sprint 1**: Setup e Autenticação
- **Sprint 2**: Gestão de Cursos (Admin)
- **Sprint 3**: Visualizador de Lições
- **Sprint 4**: Interação Social (Comentários)
- **Sprint 5**: Dashboard e Progresso
- **Sprint 6**: Gamificação e Analytics

Cada sprint contém:
- Sprint Planning
- Daily Scrums
- Sprint Review
- Sprint Retrospective
- Burndown Chart

#### **Cerimônias Scrum** (linhas 341-431):
- Sprint Planning: 2h a cada sprint
- Daily Scrum: 15min diários
- Sprint Review: 1h ao fim da sprint
- Sprint Retrospective: 45min após review

#### **Métricas Ágeis** (linhas 319-339):
- Velocity por Sprint
- Project Burndown
- Lead Time
- Cycle Time

**Como demonstrar:**
1. Mostre o quadro Kanban visual (linha 297)
2. Navegue pelas Sprints e mostre os Burndown Charts
3. Explique as cerimônias realizadas em cada sprint
4. Apresente as métricas de Velocity (linha 319)

---

### 5. Testes de Usabilidade ✅
**Onde está:** `docs/05-testes-usabilidade.md`

**O que mostrar ao professor:**
- **Metodologia** (linhas 13-27): Testes moderados, Think Aloud, Questionário SUS
- **Participantes** (linhas 30-43): 8 participantes (5 estudantes, 2 instrutores, 1 admin)
- **Tarefas Testadas** (linhas 47-260): 8 tarefas com métricas
  - Taxa de sucesso
  - Tempo médio
  - Dificuldade percebida
  - Problemas identificados
- **SUS Score** (linhas 262-287): **84.4/100 (Grade B - Excelente)**
- **Problemas Identificados** (linhas 342-363): Tabela com severidade e prioridade
- **Recomendações** (linhas 429-474): Alta, média e baixa prioridade

**Como demonstrar:**
1. Mostre a tabela de participantes e metodologia
2. Apresente o **SUS Score de 84.4/100**
3. Mostre os problemas identificados e suas priorizações
4. Explique as iterações feitas com base no feedback

---

### 6. Documentação e Apresentação ✅
**Onde está:** `docs/README.md`

**O que mostrar ao professor:**
- **Índice Completo** (linhas 9-74): Estrutura de toda documentação
- **Requisitos Atendidos** (linhas 78-111): Checklist ✅ de tudo que foi feito
- **Visão Geral do Sistema** (linhas 114-148): Descrição, features, tecnologias
- **Resultados Principais** (linhas 150-220):
  - SUS Score: 84.4/100
  - 6 Sprints completadas
  - Velocity média: 23 pontos/sprint
  - 100% dos participantes recomendariam
- **Timeline do Projeto** (linhas 254-261): Cronograma de 8 semanas
- **Evidências Disponíveis** (linhas 223-251): Links para todos artefatos

**Como demonstrar:**
1. Abra o README e mostre o índice completo
2. Apresente a seção "Resultados Principais" com métricas
3. Mostre a checklist de requisitos atendidos

---

## 🎯 Roteiro de Apresentação Sugerido

### 1. Introdução (2 min)
- Apresente o produto: LMS - Sistema de Gestão de Cursos Online
- Mostre o MVP funcionando rapidamente
- Acesse: `/auth` → faça login → navegue pelos cursos

### 2. Planejamento Ágil (5 min)
- Abra `docs/01-planejamento-agil.md`
- Mostre os papéis da equipe
- Apresente o Product Backlog com 6 épicos
- Explique a Sprint 0 e o Definition of Done

### 3. Pesquisa UX (5 min)
- Abra `docs/02-pesquisa-ux.md`
- Apresente as 3 personas (Ana, Carlos, Beatriz)
- Mostre o mapa de jornada do usuário
- Explique os insights obtidos

### 4. Prototipação e IxD (5 min)
- Abra `docs/03-prototipacao-ixd.md`
- Mostre os fluxos de interação com diagramas Mermaid
- Demonstre no sistema funcionando:
  - Navegação hierárquica (Cursos → Módulos → Submódulos → Lições)
  - Viewer fullscreen
  - Feedback visual (progress bars, hover effects)
  - Sistema de comentários

### 5. Execução Ágil (8 min)
- Abra `docs/04-execucao-agil.md`
- **Mostre o Quadro Kanban visual** (linha 297)
- Apresente as 6 Sprints executadas
- Mostre os Burndown Charts
- Explique as cerimônias: Planning, Daily, Review, Retrospective
- Apresente as métricas de Velocity

### 6. Testes de Usabilidade (5 min)
- Abra `docs/05-testes-usabilidade.md`
- **Destaque o SUS Score: 84.4/100 (Grade B)**
- Mostre a tabela de tarefas testadas
- Apresente os problemas identificados e correções feitas
- Explique as iterações baseadas em feedback

### 7. MVP Funcional (5 min)
**Demonstre o sistema funcionando:**
- Login e autenticação
- Dashboard do estudante
- Listagem de cursos com progress bar
- Navegação: Curso → Módulo → Submódulo → Lição
- Viewer de lição (PDF, vídeo, texto)
- Sistema de comentários funcional
- Cronômetro de estudo
- Gamificação (XP, coins, streaks)
- Analytics

### 8. Conclusão (2 min)
- Abra `docs/README.md`
- Mostre os resultados principais
- Apresente as métricas ágeis (Velocity, Lead Time)
- Finalize com o SUS Score e feedback dos usuários

---

## 📊 Métricas Para Apresentar

### Métricas Ágeis
- **6 Sprints** completadas (1 semana cada)
- **Velocity média**: 23 pontos por sprint
- **115+ Story Points** entregues
- **Lead Time médio**: 2.5 dias
- **Cycle Time médio**: 1.8 dias

### Métricas de Usabilidade
- **SUS Score**: 84.4/100 (Grade B - Excelente)
- **Taxa de sucesso**: 95% nas tarefas críticas
- **8 participantes** testados
- **100%** recomendariam o sistema
- **7 problemas** identificados e priorizados

### Métricas do Produto
- **4 tipos de conteúdo**: Vídeo, PDF, Imagem, Texto
- **4 níveis hierárquicos**: Cursos → Módulos → Submódulos → Lições
- **3 tipos de usuários**: Admin, Professor, Estudante
- **Sistema de gamificação**: XP, Coins, Streaks
- **Comentários com respostas** (admin-only replies)

---

## 🗂️ Estrutura dos Arquivos de Documentação

```
docs/
├── README.md                    # Índice geral e visão do projeto
├── GUIA-APRESENTACAO.md        # Este guia (para apresentação)
├── 01-planejamento-agil.md     # Planejamento, backlog, papéis
├── 02-pesquisa-ux.md           # Personas, jornadas, entrevistas
├── 03-prototipacao-ixd.md      # Wireframes, fluxos, princípios IxD
├── 04-execucao-agil.md         # Sprints, Kanban, cerimônias
└── 05-testes-usabilidade.md    # SUS, tarefas, feedback, iterações
```

---

## 💡 Dicas para a Apresentação

### Se o professor perguntar sobre Kanban:
- Abra `docs/04-execucao-agil.md` (linha 297)
- Mostre o quadro visual com WIP limits
- Explique como foi usado para visualizar o fluxo de trabalho

### Se o professor perguntar sobre Scrum:
- Abra `docs/04-execucao-agil.md`
- Mostre as Sprints (linhas 3-295)
- Explique as cerimônias (linhas 341-431)
- Apresente os Burndown Charts

### Se o professor perguntar sobre UX:
- Abra `docs/02-pesquisa-ux.md`
- Mostre as personas detalhadas
- Apresente o mapa de jornada completo
- Demonstre os testes de usabilidade com SUS Score

### Se o professor perguntar sobre IxD:
- Abra `docs/03-prototipacao-ixd.md`
- Mostre os 9 princípios aplicados
- Demonstre no sistema funcionando
- Explique os fluxos de interação

### Se o professor perguntar sobre o MVP:
- Mostre o sistema funcionando ao vivo
- Demonstre todas as funcionalidades principais
- Apresente as métricas de usabilidade

---

## ✅ Checklist Final

Antes de apresentar, certifique-se de ter:

- [ ] Lido toda a documentação em `docs/`
- [ ] Testado o MVP funcionando
- [ ] Preparado exemplos práticos de cada metodologia
- [ ] Memorizado as métricas principais (SUS: 84.4, Velocity: 23)
- [ ] Preparado para mostrar o Quadro Kanban
- [ ] Preparado para explicar as Sprints e cerimônias
- [ ] Preparado para demonstrar o sistema ao vivo

---

## 🎓 Peso dos Critérios

| Critério | Peso | Onde Apresentar |
|----------|------|-----------------|
| Aplicação das metodologias ágeis | 1 | `docs/04-execucao-agil.md` (Kanban + Scrum) |
| Qualidade do MVP funcional | 2 | Sistema funcionando + código |
| Profundidade da pesquisa UX | 1 | `docs/02-pesquisa-ux.md` |
| Clareza dos protótipos e IxD | 1 | `docs/03-prototipacao-ixd.md` + sistema |
| Documentação e apresentação final | 5 | Todos os docs em `docs/` |

**TOTAL: 10 pontos**

---

## 📞 Preparação Final

1. **Tenha todos os arquivos abertos** em abas separadas antes da apresentação
2. **Teste o sistema** para garantir que tudo funciona
3. **Prepare uma conta de teste** para fazer login durante a apresentação
4. **Ensaie o roteiro** pelo menos uma vez
5. **Cronometre sua apresentação** para não ultrapassar o tempo

**Boa sorte na apresentação! 🚀**
