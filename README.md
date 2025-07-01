# Sistema de Ranking de Atrasos

Um sistema web completo para registrar e acompanhar atrasos de colaboradores, inspirado no design e funcionalidades do site de exemplo fornecido.

## 🎯 Funcionalidades

### 📊 Página de Ranking (Pública)
- **Ranking em tempo real** dos colaboradores por pontuação de atrasos
- **"Quem Paga o Café Este Mês"** - destaque para o colaborador com mais pontos
- **Classificação geral** com posições, pontos, avisos usados e total de atrasos
- **Regras de pontuação** claramente explicadas
- **Atualização automática** a cada 30 segundos
- **Design responsivo** para desktop e mobile

### ⚙️ Área Administrativa (Protegida)
- **Login seguro** com senha (admin123)
- **Registro de atrasos** com formulário completo:
  - Seleção de colaborador
  - Hora de chegada
  - Checkbox para "Avisou antes das 9h"
  - Checkbox para "Excedeu 1 hora de almoço"
- **Gerenciamento de colaboradores**:
  - Adicionar novos colaboradores
  - Remover colaboradores existentes
  - Lista de todos os colaboradores cadastrados
- **Histórico de atrasos**:
  - Visualização de todos os registros
  - Edição de registros existentes
  - Exclusão de registros
- **Navegação fácil** entre páginas

## 🎨 Design

O sistema replica fielmente o design do site de exemplo:
- **Paleta de cores** moderna com gradientes
- **Tipografia** limpa e legível
- **Layout responsivo** que funciona em todos os dispositivos
- **Ícones** intuitivos para melhor usabilidade
- **Animações suaves** para transições
- **Cards e seções** bem organizadas

## 📋 Regras de Pontuação

### ✅ Se avisou antes das 9h:
- Chegou até 09h10 → **0 pontos**
- Chegou após 09h10 → **1-2 pontos** (aleatório)

### ❌ Se não avisou antes das 9h:
- Qualquer horário → **2-3 pontos** (aleatório)

### 🍽️ Regras adicionais:
- Excedeu 1h de almoço: **+1 ponto adicional**
- Limite: **3 avisos por mês**. Depois disso, a pontuação aumenta

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com gradientes e animações
- **JavaScript ES6+** - Funcionalidades interativas
- **localStorage** - Persistência de dados no navegador
- **Design Responsivo** - Compatível com todos os dispositivos

## 📁 Estrutura do Projeto

```
ranking_atrasos_v2/
├── index.html          # Página principal (ranking)
├── admin.html          # Página administrativa
├── css/
│   └── style.css       # Estilos principais
├── js/
│   └── script.js       # Lógica da aplicação
├── img/                # Pasta para imagens (vazia)
└── README.md           # Esta documentação
```

## 🚀 Como Usar

### 1. Acesso Público
- Abra `index.html` no navegador
- Visualize o ranking de atrasos em tempo real
- Acompanhe quem está pagando o café do mês

### 2. Área Administrativa
- Clique em "🔧 Área Administrativa" na página principal
- Digite a senha: `admin123`
- Registre atrasos, gerencie colaboradores e visualize histórico

### 3. Funcionalidades Principais

#### Registrar Atraso:
1. Selecione o colaborador
2. Defina a hora de chegada
3. Marque se avisou antes das 9h
4. Marque se excedeu 1h de almoço
5. Clique em "Registrar Atraso"

#### Gerenciar Colaboradores:
1. Digite o nome do novo colaborador
2. Clique em "Adicionar Colaborador"
3. Use "Remover" para excluir colaboradores

#### Histórico:
- Visualize todos os atrasos registrados
- Use os botões de edição (✏️) e exclusão (🗑️)

## 💾 Armazenamento de Dados

O sistema utiliza `localStorage` para persistir dados:
- **Colaboradores**: Lista de todos os colaboradores cadastrados
- **Atrasos**: Histórico completo de atrasos com pontuação
- **Autenticação**: Estado de login da sessão administrativa

## 🔒 Segurança

- **Autenticação** por senha para área administrativa
- **Validação** de formulários no frontend
- **Sanitização** de dados de entrada
- **Sessão** administrativa com timeout automático

## 📱 Responsividade

O sistema é totalmente responsivo:
- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Adaptação de layout para telas médias
- **Mobile**: Interface otimizada para toque

## 🎯 Dados de Exemplo

O sistema vem pré-carregado com:
- **10 colaboradores** de exemplo
- **Atrasos simulados** para demonstração
- **Pontuações variadas** para mostrar o ranking

## 🔧 Personalização

Para personalizar o sistema:

### Alterar senha administrativa:
```javascript
// Em js/script.js, linha 4
const CONFIG = {
    adminPassword: 'sua_nova_senha',
    // ...
};
```

### Modificar regras de pontuação:
```javascript
// Em js/script.js, função PointsCalculator.calculate
// Ajuste a lógica de cálculo conforme necessário
```

### Personalizar cores:
```css
/* Em css/style.css */
/* Modifique as variáveis de cor nos gradientes */
```

## 🌟 Características Especiais

- **Atualização automática** do ranking a cada 30 segundos
- **Cálculo inteligente** de pontos baseado nas regras
- **Interface intuitiva** similar ao site de exemplo
- **Persistência local** de dados
- **Design moderno** com gradientes e animações
- **Totalmente funcional** sem necessidade de servidor

## 📞 Suporte

Este sistema foi desenvolvido para ser:
- **Fácil de usar** - Interface intuitiva
- **Fácil de instalar** - Apenas abrir no navegador
- **Fácil de personalizar** - Código bem documentado
- **Compatível** - Funciona em todos os navegadores modernos

---

**Desenvolvido com base no site de exemplo fornecido, replicando fielmente suas funcionalidades e design.**

