# Sistema de Registro de Atrasos de Colaboradores

## Descrição
Este é um sistema web completo para registrar e gerenciar atrasos de colaboradores, desenvolvido com HTML, CSS e JavaScript puro, utilizando localStorage para persistência de dados.

## Funcionalidades

### 📝 Página Principal (index.html)
- **Registro de Atrasos**: Permite registrar novos atrasos selecionando o colaborador, data e minutos de atraso
- **Validação**: Campos obrigatórios e validação de dados
- **Interface Responsiva**: Funciona perfeitamente em desktop e dispositivos móveis

### 🏆 Página de Ranking (ranking.html)
- **Ranking Público**: Exibe todos os colaboradores ordenados por total de minutos atrasados
- **Estatísticas**: Mostra total de minutos e número de atrasos por colaborador
- **Atualização Automática**: Dados são atualizados automaticamente conforme novos registros

### ⚙️ Página de Administração (admin.html)
- **Login Seguro**: Acesso protegido por usuário e senha
- **Gerenciamento de Colaboradores**: Adicionar e remover colaboradores
- **Gerenciamento de Atrasos**: Editar e excluir registros de atraso
- **Interface Completa**: Visualização de todos os dados em tabelas organizadas

## Credenciais de Acesso

### Administração
- **Usuário**: `admin`
- **Senha**: `admin123`

## Como Usar

### 1. Abrindo o Sistema
- Abra o arquivo `index.html` em qualquer navegador web moderno
- O sistema funciona completamente offline, sem necessidade de servidor

### 2. Registrando um Atraso
1. Na página principal, selecione o colaborador no dropdown
2. Escolha a data do atraso (padrão: data atual)
3. Digite os minutos de atraso
4. Clique em "Registrar"
5. O sistema confirmará o registro e limpará o formulário

### 3. Visualizando o Ranking
1. Clique em "Ranking" no menu de navegação
2. Visualize a lista ordenada por total de minutos atrasados
3. A página é atualizada automaticamente com novos dados

### 4. Administrando o Sistema
1. Clique em "Administração" no menu de navegação
2. Faça login com as credenciais fornecidas
3. **Gerenciar Colaboradores**:
   - Digite o nome e clique em "Adicionar Colaborador"
   - Use o botão "Remover" para excluir colaboradores (remove também seus atrasos)
4. **Gerenciar Atrasos**:
   - Use "Editar" para modificar data ou minutos de um registro
   - Use "Excluir" para remover um registro específico

## Dados de Exemplo
O sistema vem com dados de exemplo pré-carregados:
- **Colaboradores**: João Silva, Maria Oliveira, Pedro Santos
- **Atrasos**: Alguns registros de exemplo para demonstração

## Armazenamento de Dados
- **Tecnologia**: localStorage do navegador
- **Persistência**: Dados são mantidos mesmo após fechar o navegador
- **Backup**: Para fazer backup, exporte os dados do localStorage ou copie a pasta do projeto

## Compatibilidade
- **Navegadores**: Chrome, Firefox, Safari, Edge (versões modernas)
- **Dispositivos**: Desktop, tablet e smartphone
- **Requisitos**: JavaScript habilitado

## Estrutura de Arquivos
```
atrasos_colaboradores/
├── index.html          # Página principal (registro de atrasos)
├── ranking.html        # Página de ranking público
├── admin.html          # Página de administração
├── css/
│   └── style.css       # Estilos e responsividade
├── js/
│   └── script.js       # Lógica JavaScript
└── README.md           # Documentação técnica
```

## Personalização

### Alterando Credenciais de Admin
No arquivo `js/script.js`, modifique as linhas:
```javascript
const AUTH_CONFIG = {
    username: 'admin',
    password: 'admin123'
};
```

### Modificando Estilos
Edite o arquivo `css/style.css` para personalizar cores, fontes e layout.

## Suporte
Para dúvidas ou problemas:
1. Verifique se o JavaScript está habilitado no navegador
2. Teste em um navegador diferente
3. Verifique o console do navegador para erros (F12)

## Segurança
- **Ambiente Local**: Sistema projetado para uso em ambiente local/intranet
- **Dados Sensíveis**: Não armazene informações confidenciais
- **Backup**: Faça backup regular dos dados importantes

---
**Desenvolvido em 2025 - Sistema de Registro de Atrasos**

