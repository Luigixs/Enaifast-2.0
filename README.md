📌 Descrição Geral

Esta plataforma é um sistema educacional completo e gamificado, desenvolvido para gestão de cursos, turmas, usuários, desempenho dos alunos e vendas.
O projeto integra ferramentas avançadas de administração, analytics, comunidade e gamificação, oferecendo uma experiência moderna tanto para administradores quanto para alunos.

🚀 Principais Funcionalidades
🏫 Visão do Administrador

Dashboard completo com estatísticas de usuários, atividade nos últimos 30 dias e gráficos de desempenho.

Gestão da escola: dados institucionais, redes sociais, multilogs, notificações, professores e banners.

Políticas: criação e edição dos Termos de Uso e Política de Privacidade.

Certificados: editor visual com frente e verso personalizáveis.

Gamificação avançada:

Configuração de pontos, XP, moedas, ligas, penalidades e multiplicadores.

Definição de ganhos por ação (login, assistir aula, comentar, responder questão, etc.).

Criação, edição e exclusão de ligas.

Cursos:

Criar, editar, ordenar e gerenciar cursos completos.

Adicionar módulos, aulas (vídeo, PDF, imagem, link) e capas (desktop + mobile).

Gerenciar alunos do curso, enviar mensagens e importar/exportar listas.

Usuários:

Gerenciamento completo com visualização de progresso, cursos e analytics.

Gestão de Perfis:

Criação de perfis (Admin, Gestor, Aluno, Suporte, Monitor etc.).

Controle detalhado de permissões por ação.

Vendas e Planos (Asaas):

Controle de vendas, valores, histórico e % mensal.

Criação de planos: pagamento único ou assinatura (mensal, trimestral, anual).

Integração automática de juros via API.

Banco de Questões:

Gestão de disciplinas, assuntos e classes.

Cadastro completo de questões com enunciado, alternativas A–E, resolução e dica.

Pesquisa avançada e filtros.

🎓 Visão do Aluno

Cursos:

Cards com progresso (%), capa e quantidade de aulas.

Carrossel de aulas com barra de progresso individual.

Vídeos, PDFs e imagens com marca d’água personalizada.

Comentários e anotações (texto ou desenho).

Avaliação da aula e XP exibido.

Questões:

Questões com imagens e estatísticas de acertos, erros e alternativas.

Visualização de dicas.

Comunidade:

Chat geral e grupos.

Criação de tópicos e respostas.

Ranking semanal, mensal e geral.

Analytics Completo:

XP total, XP semanal, streak, patentes, classpoint.

Gráficos: acertos vs erros, desempenho por disciplina, período selecionado.

Mapa de calor anual das atividades.

Ranking Geral:

Exibe posição, nome, foto, patente e XP.

Permite visualizar o analytics de outros alunos.

🧩 Tecnologias Utilizadas

(Você pode ajustar conforme seu stack real)

Frontend: HTML, CSS, JavaScript (ou React/Next.js).

Backend: PHP, Laravel ou Node.js.

Banco de Dados: MySQL ou PostgreSQL.

Integrações:

Pagamentos: Asaas API

Serviços internos: API própria

Outros:

Sistema de Gamificação próprio

Player de vídeo com marca d’água

Visualizador de PDF protegido

📂 Estrutura do Projeto
/src
  /admin
    /dashboard
    /escola
    /cursos
    /usuarios
    /perfis
    /vendas
    /planos
    /banco-questoes
  /aluno
    /cursos
    /comunidade
    /analytics
    /ranking
  /components
  /services
  /assets

🏁 Como Instalar
git clone https://github.com/seu-repositorio/plataforma-educacional.git
cd plataforma-educacional

# Instalar dependências (exemplo Laravel)
composer install
npm install

# Configurar o ambiente
cp .env.example .env
php artisan key:generate

# Rodar migrações
php artisan migrate

# Iniciar servidor
php artisan serve
npm run dev

💡 Próximas Implementações

App mobile (Android/iOS)

Gamificação avançada por temporadas

Notificações push

Lives e transmissões integradas

IA para criação de questões
