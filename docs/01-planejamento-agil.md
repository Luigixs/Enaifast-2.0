# 1. Planejamento Ágil - Sistema de Gestão de Cursos Online

## Equipe e Papéis

### Product Owner
**Responsabilidades:**
- Definir e priorizar funcionalidades do Product Backlog
- Validar entregas com base nas necessidades dos usuários
- Tomar decisões sobre o escopo e prioridades

### Scrum Master
**Responsabilidades:**
- Facilitar cerimônias do Scrum (Planning, Daily, Review, Retrospective)
- Remover impedimentos da equipe
- Garantir que o processo ágil está sendo seguido

### Dev Team
**Responsabilidades:**
- Desenvolvimento do sistema
- Testes e garantia de qualidade
- Estimativas e auto-organização

---

## Produto Escolhido

**Sistema de Gestão de Cursos Online (LMS - Learning Management System)**

Um MVP de plataforma educacional que permite:
- Organização hierárquica de conteúdo (Cursos → Módulos → Submódulos → Lições)
- Visualização de diferentes tipos de conteúdo (PDF, vídeo, imagem, texto)
- Acompanhamento de progresso individual
- Interação através de comentários e anotações
- Área administrativa para gestão de conteúdo

---

## Product Backlog

### Épicos Principais

#### Épico 1: Gestão de Usuários
- Como **estudante**, quero criar uma conta para acessar os cursos
- Como **estudante**, quero fazer login para acessar meu progresso
- Como **estudante**, quero visualizar meu perfil para acompanhar minhas informações

#### Épico 2: Navegação de Conteúdo
- Como **estudante**, quero visualizar todos os cursos disponíveis para escolher o que estudar
- Como **estudante**, quero ver os módulos de um curso para entender sua estrutura
- Como **estudante**, quero acessar submódulos e lições para estudar o conteúdo específico
- Como **estudante**, quero ver meu progresso em cada curso para saber o quanto já completei

#### Épico 3: Visualização de Lições
- Como **estudante**, quero visualizar vídeos das aulas para aprender o conteúdo
- Como **estudante**, quero ler PDFs de material complementar para aprofundar meus estudos
- Como **estudante**, quero ver imagens e diagramas para entender conceitos visuais
- Como **estudante**, quero um visualizador em tela cheia para focar no conteúdo

#### Épico 4: Interação e Engajamento
- Como **estudante**, quero comentar nas lições para tirar dúvidas
- Como **estudante**, quero responder comentários de outros estudantes para colaborar
- Como **estudante**, quero fazer anotações pessoais para registrar insights importantes
- Como **estudante**, quero favoritar lições para encontrá-las facilmente depois

#### Épico 5: Gestão Administrativa
- Como **administrador**, quero criar novos cursos para disponibilizar conteúdo
- Como **administrador**, quero adicionar módulos aos cursos para organizar o conteúdo
- Como **administrador**, quero criar lições com diferentes tipos de mídia para variar o formato
- Como **administrador**, quero visualizar estatísticas de uso para entender o engajamento
- Como **administrador**, quero gerenciar usuários para controlar acessos

#### Épico 6: Dashboard e Analytics
- Como **estudante**, quero ver um dashboard com meu progresso para me motivar
- Como **estudante**, quero ver ranking de pontos XP para me comparar com outros
- Como **administrador**, quero visualizar dados de vendas para acompanhar resultados
- Como **administrador**, quero ver analytics de uso para tomar decisões

---

## Sprint 0: Pesquisa e Prototipação

### Objetivos
1. **Pesquisa de Usuários**
   - Entrevistar potenciais usuários (estudantes e professores)
   - Identificar dores e necessidades principais
   - Mapear comportamentos atuais de estudo online

2. **Definição de Personas**
   - Criar personas baseadas na pesquisa
   - Definir cenários de uso típicos
   - Mapear jornadas do usuário

3. **Prototipação Inicial**
   - Criar wireframes de baixa fidelidade
   - Validar fluxos principais com stakeholders
   - Definir arquitetura técnica inicial

4. **Definição de Tecnologias**
   - Frontend: React + TypeScript + Tailwind CSS
   - Backend: Supabase (autenticação, banco de dados, storage)
   - Gerenciamento de Estado: React Query
   - UI Components: shadcn/ui

### Entregáveis da Sprint 0
- ✅ Documento de personas
- ✅ Mapa de jornada do usuário
- ✅ Product Backlog priorizado
- ✅ Wireframes de telas principais
- ✅ Arquitetura técnica definida
- ✅ Ambiente de desenvolvimento configurado

---

## Critérios de Pronto (Definition of Done)

Para uma história de usuário ser considerada pronta, deve atender:

1. **Código**
   - Código desenvolvido e revisado
   - Padrões de código seguidos
   - Sem erros de TypeScript/ESLint

2. **Testes**
   - Funcionalidade testada manualmente
   - Responsividade verificada
   - Compatibilidade com navegadores principais

3. **UX/UI**
   - Design consistente com guia de estilo
   - Feedback visual para ações do usuário
   - Acessibilidade básica (contraste, navegação por teclado)

4. **Documentação**
   - Código comentado quando necessário
   - README atualizado se houver mudanças relevantes

5. **Deploy**
   - Feature deployada no ambiente de staging
   - Validada pelo Product Owner

---

## Priorização do Backlog

### Must Have (Alta Prioridade)
1. Sistema de autenticação básico
2. Listagem de cursos
3. Visualizador de lições (vídeo, PDF, texto)
4. Navegação entre lições
5. Painel administrativo básico

### Should Have (Média Prioridade)
6. Sistema de comentários
7. Anotações pessoais
8. Progresso do aluno
9. Dashboard do estudante
10. Gestão completa de conteúdo

### Could Have (Baixa Prioridade)
11. Sistema de pontos XP
12. Ranking de alunos
13. Certificados
14. Notificações
15. Analytics avançados

---

## Estimativas Iniciais

Utilizando Planning Poker, as histórias foram estimadas em Story Points:

| História | Pontos | Complexidade |
|----------|--------|--------------|
| Sistema de login/signup | 5 | Média |
| Listagem de cursos | 3 | Baixa |
| Visualizador de vídeo | 3 | Baixa |
| Visualizador de PDF | 8 | Alta |
| Sistema de comentários | 8 | Alta |
| Anotações pessoais | 5 | Média |
| Dashboard admin | 13 | Muito Alta |
| Sistema de progresso | 8 | Alta |
| Rankings | 5 | Média |

**Velocidade estimada inicial:** 20-25 pontos por sprint de 1 semana
