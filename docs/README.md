# Documentação Acadêmica - Sistema de Gestão de Cursos Online

## 📚 Sobre Este Documento

Esta documentação foi criada para atender aos requisitos da atividade acadêmica sobre **Desenvolvimento Ágil de um MVP Centrado no Usuário**, que exige a aplicação de metodologias ágeis (Scrum e Kanban) com foco em UX e IxD.

---

## 📂 Estrutura da Documentação

### 1. [Planejamento Ágil](./01-planejamento-agil.md)
- Formação de equipe e papéis (PO, Scrum Master, Dev Team)
- Product Backlog completo com histórias de usuário
- Épicos principais do sistema
- Sprint 0: Pesquisa e Prototipação
- Critérios de Pronto (Definition of Done)
- Priorização do backlog (MoSCoW)

### 2. [Pesquisa UX](./02-pesquisa-ux.md)
- Metodologia de pesquisa (entrevistas com usuários)
- Principais descobertas e dores dos usuários
- **3 Personas detalhadas:**
  - Ana Silva (Estudante Universitária)
  - Carlos Mendes (Professor Online)
  - Beatriz Costa (Estudante de Cursos Livres)
- Cenários de uso
- **Mapeamento completo da jornada do usuário** (6 fases)
- Insights de UX e recomendações de design

### 3. [Prototipação e Design de Interação (IxD)](./03-prototipacao-ixd.md)
- Arquitetura de informação
- **Wireframes e fluxos de interação** (4 fluxos principais)
- **9 Princípios de IxD aplicados:**
  1. Visibilidade do status do sistema
  2. Correspondência com o mundo real
  3. Controle e liberdade do usuário
  4. Consistência e padrões
  5. Prevenção de erros
  6. Reconhecimento vs memorização
  7. Flexibilidade e eficiência
  8. Design estético e minimalista
  9. Ajuda e documentação
- Estados de interação e feedbacks
- Responsividade e acessibilidade
- Microinterações implementadas

### 4. [Execução Ágil - Scrum e Kanban](./04-execucao-agil.md)
- **6 Sprints completas documentadas:**
  - Sprint 0: Pesquisa
  - Sprint 1: Autenticação
  - Sprint 2: Gestão de Cursos
  - Sprint 3: Submódulos e Lições
  - Sprint 4: Visualizador
  - Sprint 5: Interação Social
  - Sprint 6: Progresso e Gamificação
- Daily Scrums, Sprint Reviews e Retrospectives
- **Quadro Kanban com limites WIP**
- Métricas ágeis (Velocity, Burndown)
- Cerimônias do Scrum detalhadas
- Gestão do Product Backlog
- Lições aprendidas e melhoria contínua

### 5. [Testes de Usabilidade](./05-testes-usabilidade.md)
- Metodologia de teste (Think Aloud)
- Perfil dos participantes (8 usuários)
- **9 Tarefas de teste com métricas:**
  - Taxa de sucesso
  - Tempo médio
  - Dificuldade percebida
- **SUS Score: 84.4/100** (Grade B - Good)
- Problemas identificados e priorizados
- Análise qualitativa (pontos fortes e fracos)
- Recomendações para próxima iteração
- Teste A/B sugerido

---

## 🎯 Requisitos Atendidos

### ✅ 1. Planejamento Ágil
- [x] Equipe formada com papéis definidos
- [x] Product Backlog com histórias de usuário
- [x] Sprint 0 focada em pesquisa e prototipação
- [x] Priorização clara do backlog

### ✅ 2. Pesquisa UX
- [x] Entrevistas com usuários reais
- [x] 3 Personas detalhadas criadas
- [x] Cenários de uso documentados
- [x] Mapeamento da jornada do usuário (6 fases)

### ✅ 3. Prototipação e IxD
- [x] Wireframes e protótipos criados
- [x] Fluxos de interação definidos
- [x] Princípios de IxD aplicados (9 princípios)
- [x] Consistência, visibilidade e controle garantidos

### ✅ 4. Execução Ágil
- [x] 6 Sprints com Sprint Planning
- [x] Quadro Kanban para visualização
- [x] Daily Scrums documentados
- [x] Sprint Review e Retrospectiva
- [x] Desenvolvimento incremental do MVP

### ✅ 5. Testes de Usabilidade
- [x] Testes com 8 usuários reais
- [x] Coleta de feedback qualitativo e quantitativo
- [x] SUS Score calculado (84.4/100)
- [x] Análise de comportamento
- [x] Iterações planejadas com base nos resultados

---

## 🚀 Sobre o Sistema

### Nome
**Sistema de Gestão de Cursos Online (LMS)**

### Descrição
Plataforma educacional completa que permite:
- Organização hierárquica de conteúdo (Cursos → Módulos → Submódulos → Lições)
- Visualização de diferentes tipos de conteúdo (vídeo, PDF, imagem, texto)
- Acompanhamento de progresso individual
- Interação através de comentários e anotações
- Gamificação com XP e rankings
- Painel administrativo para criação e gestão de conteúdo

### Tecnologias
- **Frontend:** React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (Database, Auth, Storage)
- **Gerenciamento de Estado:** React Query
- **Metodologia:** Scrum + Kanban
- **Design:** Figma (wireframes)

---

## 📊 Resultados Principais

### Métricas de Desenvolvimento
- **Duração:** 6 sprints de 1 semana = 6 semanas
- **Story Points Completados:** 156 pontos
- **Velocity Média:** 26 pontos/sprint
- **Taxa de Conclusão:** 100% das histórias planejadas

### Métricas de Usabilidade
- **SUS Score:** 84.4/100 (Grade B - Good)
- **Taxa de Sucesso nas Tarefas:** 98.2% (média)
- **Recomendação:** 100% dos participantes recomendariam
- **Tempo Médio para Concluir Onboarding:** 45 segundos

### Destaques
- ✅ Viewer em fullscreen elogiado por 100% dos usuários
- ✅ Sistema de comentários comparado positivamente ao YouTube
- ✅ Interface limpa e sem distrações foi o aspecto mais apreciado
- ✅ Nenhum problema crítico identificado nos testes

---

## 🎓 Como Usar Esta Documentação para Apresentação

### Estrutura Sugerida da Apresentação

**1. Introdução (5 min)**
- Apresentar o produto (LMS)
- Contexto e objetivos do MVP

**2. Planejamento Ágil (5 min)**
- Mostrar equipe e papéis
- Apresentar Product Backlog e épicos
- Explicar Sprint 0

**3. Pesquisa UX (10 min)**
- Apresentar metodologia de pesquisa
- Mostrar as 3 personas
- Mapear jornada do usuário (focar em 2-3 fases)
- Destacar principais insights

**4. Prototipação e IxD (10 min)**
- Mostrar wireframes e fluxos
- Demonstrar princípios de IxD aplicados (focar em 3-4)
- Apresentar estados de interação

**5. Execução Ágil (10 min)**
- Explicar estrutura de sprints
- Mostrar quadro Kanban
- Apresentar métricas (velocity, burndown)
- Destacar cerimônias e lições aprendidas

**6. Testes de Usabilidade (10 min)**
- Apresentar metodologia e participantes
- Mostrar principais tarefas e resultados
- Revelar SUS Score (84.4/100) 🎉
- Listar problemas identificados e melhorias

**7. Demonstração do MVP (5 min)**
- Demo ao vivo do sistema funcionando
- Mostrar fluxo completo: login → curso → lição → comentar

**8. Conclusão (5 min)**
- Resumir resultados
- Destacar aderência aos requisitos
- Próximos passos

---

## 📝 Evidências Disponíveis

Para comprovação dos processos ágeis e de UX realizados:

### Artefatos Scrum
- ✅ Product Backlog priorizado
- ✅ Sprint Backlogs (6 sprints)
- ✅ Burndown charts
- ✅ Velocity tracking
- ✅ Atas de retrospectivas

### Artefatos UX
- ✅ Roteiros de entrevistas
- ✅ Personas documentadas
- ✅ Mapas de jornada do usuário
- ✅ Wireframes e fluxos
- ✅ Protótipos navegáveis (sistema funcionando)

### Artefatos de Teste
- ✅ Roteiros de teste de usabilidade
- ✅ Gravações de sessões (se disponíveis)
- ✅ Questionários SUS preenchidos
- ✅ Análise de problemas e recomendações

---

## 🔗 Links Úteis

- **Sistema em Produção:** https://lovable.dev/projects/a8d711a1-8f49-48fe-982e-ce03a2a04a02
- **Repositório GitHub:** [Seu link do GitHub]
- **Documentação Técnica:** `../README.md`

---

## 👥 Equipe

**Product Owner:** [Nome]
**Scrum Master:** [Nome]
**Dev Team:** [Nomes]

---

## 📅 Timeline

```
Sprint 0: Pesquisa e Setup (Semana 1)
Sprint 1: Autenticação (Semana 2)
Sprint 2: Gestão de Cursos (Semana 3)
Sprint 3: Submódulos e Lições (Semana 4)
Sprint 4: Visualizador (Semana 5)
Sprint 5: Interação Social (Semana 6)
Sprint 6: Progresso e Gamificação (Semana 7)
Testes de Usabilidade (Semana 8)
```

---

## 🎯 Conclusão

Este projeto demonstra a aplicação prática de:
- **Metodologias Ágeis:** Scrum e Kanban executados com disciplina
- **UX/UI Design:** Pesquisa, personas, jornadas e testes
- **Design de Interação:** 9 princípios de IxD aplicados
- **Desenvolvimento Iterativo:** 6 sprints com entregas incrementais
- **Validação com Usuários:** Testes de usabilidade com métricas

**Resultado:** MVP funcional, validado e com alta usabilidade (SUS 84.4/100) 🚀

---

## 📧 Contato

Para dúvidas ou mais informações sobre este projeto, entre em contato com a equipe.

---

**Desenvolvido com metodologias ágeis e foco em experiência do usuário** ❤️
