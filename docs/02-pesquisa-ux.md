# 2. Pesquisa UX - Sistema de Gestão de Cursos Online

## Metodologia de Pesquisa

### Entrevistas com Usuários
**Objetivo:** Entender necessidades, dores e comportamentos de estudantes e educadores em plataformas de ensino online.

**Participantes:**
- 8 estudantes (idades 18-35 anos)
- 4 professores/instrutores
- 2 administradores de plataformas educacionais

**Principais Descobertas:**

#### Estudantes
- 🎯 **Dor #1:** "Perco muito tempo tentando encontrar onde parei na última aula"
- 🎯 **Dor #2:** "Gostaria de fazer anotações enquanto assisto as aulas"
- 🎯 **Dor #3:** "É difícil tirar dúvidas quando não entendo algo"
- 🎯 **Necessidade #1:** Visualização clara de progresso
- 🎯 **Necessidade #2:** Interface simples e focada no conteúdo
- 🎯 **Necessidade #3:** Acesso rápido a materiais complementares (PDFs)

#### Professores/Instrutores
- 🎯 **Dor #1:** "Organizar conteúdo em hierarquias é complicado"
- 🎯 **Dor #2:** "Não consigo ver estatísticas de engajamento facilmente"
- 🎯 **Necessidade #1:** Ferramenta intuitiva para upload de conteúdo
- 🎯 **Necessidade #2:** Analytics de conclusão de cursos

---

## Personas

### Persona 1: Ana Silva - Estudante Universitária

**Dados Demográficos:**
- Idade: 22 anos
- Ocupação: Estudante de Administração
- Localização: São Paulo, SP
- Dispositivos: Notebook e smartphone

**Biografia:**
Ana está no 3º ano de Administração e busca complementar sua formação com cursos online sobre gestão de projetos e marketing digital. Estuda principalmente à noite, após as aulas presenciais.

**Objetivos:**
- Aprender novas habilidades para se destacar no mercado
- Obter certificados para enriquecer o currículo
- Estudar no seu próprio ritmo

**Frustrações:**
- Plataformas complexas com muitas distrações
- Dificuldade em organizar seu tempo de estudo
- Falta de interação com outros estudantes
- Perder o progresso quando muda de dispositivo

**Comportamento Tecnológico:**
- Acessa plataformas principalmente via notebook
- Gosta de fazer anotações digitais
- Prefere vídeos curtos e objetivos
- Usa redes sociais para trocar informações com colegas

**Citação:**
> "Eu preciso de uma plataforma que seja simples e me deixe focar no conteúdo, sem me perder em menus complicados."

---

### Persona 2: Carlos Mendes - Professor Online

**Dados Demográficos:**
- Idade: 38 anos
- Ocupação: Instrutor de cursos de programação
- Localização: Rio de Janeiro, RJ
- Dispositivos: Desktop e tablet

**Biografia:**
Carlos é desenvolvedor há 15 anos e há 3 anos começou a criar cursos online sobre desenvolvimento web. Grava suas aulas em casa e precisa de uma plataforma para hospedar e organizar o conteúdo.

**Objetivos:**
- Organizar cursos de forma hierárquica e lógica
- Acompanhar o progresso dos alunos
- Responder dúvidas rapidamente
- Monetizar seu conhecimento

**Frustrações:**
- Plataformas com interfaces administrativas confusas
- Falta de dados sobre engajamento dos alunos
- Dificuldade em atualizar conteúdo já publicado
- Limitações em tipos de arquivos aceitos

**Comportamento Tecnológico:**
- Prefere interfaces web responsivas
- Grava vídeos em alta qualidade
- Cria materiais complementares em PDF
- Gosta de dashboards com métricas claras

**Citação:**
> "Preciso de uma ferramenta que me permita focar em criar conteúdo de qualidade, não em lutar com a plataforma."

---

### Persona 3: Beatriz Costa - Estudante de Cursos Livres

**Dados Demográficos:**
- Idade: 29 anos
- Ocupação: Designer Gráfica
- Localização: Belo Horizonte, MG
- Dispositivos: Smartphone, tablet e notebook

**Biografia:**
Beatriz trabalha como freelancer e está sempre buscando se atualizar em novas ferramentas e tendências de design. Estuda em horários variados, aproveitando intervalos entre projetos.

**Objetivos:**
- Aprender rapidamente ferramentas específicas
- Aplicar conhecimento imediatamente no trabalho
- Acessar conteúdo de qualquer dispositivo
- Revisar aulas quando necessário

**Frustrações:**
- Vídeos que não carregam bem no celular
- Impossibilidade de assistir offline
- Falta de marcadores para pontos importantes
- Cursos muito teóricos sem exemplos práticos

**Comportamento Tecnológico:**
- Alterna entre dispositivos constantemente
- Prefere conteúdo visual e prático
- Faz screenshots de slides importantes
- Gosta de comunidades para trocar experiências

**Citação:**
> "Quero poder pausar no meio de uma aula no celular e continuar depois no notebook, exatamente de onde parei."

---

## Cenários de Uso

### Cenário 1: Primeira Experiência de Ana
**Contexto:** Ana acabou de criar sua conta na plataforma após ver a indicação de uma amiga.

**Sequência de ações:**
1. Ana cria conta usando email
2. É direcionada ao dashboard de estudante
3. Visualiza os cursos disponíveis
4. Clica em "Gestão de Projetos Ágeis"
5. Vê a estrutura do curso (módulos e lições)
6. Começa a primeira aula
7. Faz uma anotação durante o vídeo
8. Pausa para jantar
9. Retorna horas depois e o sistema lembra onde ela parou

**Resultado esperado:** Ana se sente acolhida pelo sistema e confiante para continuar seus estudos.

---

### Cenário 2: Carlos Criando um Novo Curso
**Contexto:** Carlos quer publicar um novo curso sobre React.

**Sequência de ações:**
1. Faz login no painel administrativo
2. Clica em "Criar Novo Curso"
3. Preenche informações básicas (nome, descrição, thumbnail)
4. Cria módulos (Fundamentos, Hooks, Estado Global, etc.)
5. Dentro de cada módulo, cria submódulos se necessário
6. Adiciona lições com vídeos do YouTube e PDFs
7. Define ordem das lições
8. Publica o curso
9. Visualiza como estudante para conferir

**Resultado esperado:** Carlos consegue organizar todo o conteúdo de forma intuitiva em menos de 30 minutos.

---

### Cenário 3: Beatriz Estudando no Celular
**Contexto:** Beatriz está no metrô voltando para casa e quer aproveitar o tempo.

**Sequência de ações:**
1. Abre o app no celular
2. Retoma o curso onde parou (sistema sincronizado)
3. Assiste a uma lição de 10 minutos
4. Sente dúvida em um ponto específico
5. Pausa o vídeo e adiciona uma anotação
6. Lê comentários de outros alunos sobre o mesmo tópico
7. Responde um comentário colaborando
8. Marca a lição como concluída
9. Vê seu progresso atualizar

**Resultado esperado:** Beatriz maximiza seu tempo de deslocamento e se sente parte de uma comunidade.

---

## Mapeamento da Jornada do Usuário

### Jornada do Estudante (Ana)

```
Descoberta → Cadastro → Exploração → Aprendizado → Engajamento → Conclusão
```

#### Fase 1: Descoberta
**Ações:**
- Recebe indicação de amiga
- Pesquisa sobre a plataforma
- Lê avaliações

**Pensamentos:**
- "Será que vale a pena?"
- "Tem o curso que eu procuro?"

**Emoções:** 😐 Curiosa, mas cética

**Pontos de Dor:**
- Falta de informações claras sobre conteúdo

**Oportunidades:**
- Landing page clara com preview de cursos
- Depoimentos de alunos

---

#### Fase 2: Cadastro
**Ações:**
- Acessa página de signup
- Cria conta com email
- Recebe email de confirmação
- Faz primeiro login

**Pensamentos:**
- "Espero que seja rápido"
- "Não quero preencher formulários longos"

**Emoções:** 😊 Esperançosa

**Pontos de Dor:**
- Processo de cadastro muito longo
- Confirmação de email demorada

**Oportunidades:**
- Cadastro simplificado (apenas email e senha)
- Auto-confirmação de email (modo desenvolvimento)
- Onboarding amigável

---

#### Fase 3: Exploração
**Ações:**
- Navega pelos cursos disponíveis
- Lê descrições e vê thumbnails
- Verifica estrutura de módulos
- Escolhe primeiro curso

**Pensamentos:**
- "O conteúdo parece bom"
- "Gosto da organização clara"

**Emoções:** 😊 Animada

**Pontos de Dor:**
- Difícil avaliar qualidade sem preview
- Muitas opções podem confundir

**Oportunidades:**
- Filtros e busca eficientes
- Prévia de primeira lição gratuita
- Tags e categorias claras

---

#### Fase 4: Aprendizado
**Ações:**
- Inicia primeira lição
- Assiste vídeo
- Lê PDF complementar
- Faz anotações
- Pausa e retoma em outro momento

**Pensamentos:**
- "Está fácil de acompanhar"
- "Gosto de poder anotar"

**Emoções:** 😄 Satisfeita e focada

**Pontos de Dor:**
- Vídeo não carrega rápido
- Player sem recursos de velocidade
- Dificuldade em navegar no PDF

**Oportunidades:**
- Player otimizado com controles avançados
- PDF com zoom e highlight
- Sistema de marcadores/timestamps

---

#### Fase 5: Engajamento
**Ações:**
- Comenta nas lições
- Responde dúvidas de colegas
- Favorita lições importantes
- Verifica seu progresso
- Compara com ranking

**Pensamentos:**
- "Me sinto parte de uma comunidade"
- "Estou evoluindo"

**Emoções:** 😍 Motivada e engajada

**Pontos de Dor:**
- Comentários desorganizados
- Falta de notificações de respostas
- Progresso não claro

**Oportunidades:**
- Sistema de comentários estilo YouTube
- Notificações de interações
- Dashboard visual de progresso
- Gamificação (XP, badges)

---

#### Fase 6: Conclusão
**Ações:**
- Completa última lição
- Recebe certificado
- Compartilha conquista
- Busca próximo curso

**Pensamentos:**
- "Consegui!"
- "Valeu a pena"

**Emoções:** 🎉 Realizada e confiante

**Pontos de Dor:**
- Certificado demora para ser gerado
- Falta de sugestões de próximos passos

**Oportunidades:**
- Certificado instantâneo
- Recomendações personalizadas
- Desconto para próximo curso

---

## Principais Insights da Pesquisa

### 🎯 Insights de UX

1. **Simplicidade é Essencial**
   - Usuários valorizam interfaces limpas e focadas
   - Menus complexos afastam novos usuários
   - Menos é mais quando se trata de opções

2. **Progresso Visível Motiva**
   - Ver quanto já foi completado incentiva continuidade
   - Gamificação leve (XP, níveis) funciona bem
   - Certificados são importantes para estudantes

3. **Comunidade Importa**
   - Estudantes querem interagir uns com os outros
   - Comentários precisam ser organizados e responsivos
   - Respostas rápidas aumentam engajamento

4. **Multi-dispositivo é Obrigatório**
   - Usuários alternam entre celular, tablet e desktop
   - Sincronização de progresso deve ser transparente
   - Design responsivo não é opcional

5. **Conteúdo Deve Ser a Estrela**
   - Player de vídeo deve ser robusto e sem distrações
   - PDFs precisam de recursos de navegação e anotação
   - Tempo de carregamento impacta muito a satisfação

---

## Recomendações de Design

### Prioridades Imediatas
1. ✅ Viewer de lições em tela cheia focado no conteúdo
2. ✅ Sistema de comentários estilo YouTube
3. ✅ Dashboard visual de progresso
4. ✅ Navegação simplificada entre lições
5. ✅ Sistema de anotações pessoais

### Próximas Iterações
6. Notificações de interações
7. Modo offline para lições
8. Filtros e busca avançada
9. Certificados automatizados
10. Recomendações personalizadas de cursos
