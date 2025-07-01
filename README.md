# Registro de Atrasos de Colaboradores

Este projeto visa criar um sistema simples para registrar atrasos de colaboradores, exibir um ranking e permitir a administração dos dados.

## Estrutura de Dados (localStorage)

Serão utilizados os seguintes itens no `localStorage` para armazenar os dados:

- `colaboradores`: Um array de objetos, onde cada objeto representa um colaborador. Exemplo:
  ```json
  [
    { "id": "uuid-1", "nome": "João Silva" },
    { "id": "uuid-2", "nome": "Maria Oliveira" }
  ]
  ```

- `atrasos`: Um array de objetos, onde cada objeto representa um registro de atraso. Exemplo:
  ```json
  [
    { "id": "uuid-a", "colaboradorId": "uuid-1", "data": "2025-01-01", "minutos": 15 },
    { "id": "uuid-b", "colaboradorId": "uuid-2", "data": "2025-01-02", "minutos": 30 }
  ]
  ```

## Autenticação (Página de Administração)

A autenticação para a página de administração (`admin.html`) será baseada em um nome de usuário e senha pré-definidos no JavaScript. Para simplificar, não haverá um sistema de registro de usuários. A senha será armazenada de forma simples no código JavaScript (para este projeto, não é necessário um sistema de segurança robusto).

- **Usuário:** `admin`
- **Senha:** `admin123`

Após o login bem-sucedido, um sinalizador (por exemplo, `loggedIn: true`) será armazenado no `sessionStorage` para manter o estado de autenticação durante a sessão do navegador. Ao fechar o navegador, o usuário precisará fazer login novamente.

## Próximos Passos

1. Implementar o CSS para estilização e responsividade.
2. Desenvolver as funcionalidades JavaScript para manipulação do `localStorage` e interação com o DOM.
3. Implementar a lógica de autenticação na página de administração.
4. Criar as funções para adicionar, editar e remover colaboradores e atrasos.
5. Gerar o ranking de atrasos.


