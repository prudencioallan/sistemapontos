// Configurações de autenticação
const AUTH_CONFIG = {
    username: 'admin',
    password: 'admin123'
};

// Utilitários para localStorage
const Storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Erro ao ler do localStorage:', error);
            return null;
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    }
};

// Gerador de UUID simples
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Gerenciador de colaboradores
const ColaboradorManager = {
    getAll: () => Storage.get('colaboradores') || [],
    
    add: (nome) => {
        const colaboradores = ColaboradorManager.getAll();
        const novoColaborador = {
            id: generateUUID(),
            nome: nome.trim()
        };
        colaboradores.push(novoColaborador);
        Storage.set('colaboradores', colaboradores);
        return novoColaborador;
    },
    
    remove: (id) => {
        const colaboradores = ColaboradorManager.getAll();
        const novosColaboradores = colaboradores.filter(c => c.id !== id);
        Storage.set('colaboradores', novosColaboradores);
        
        // Remover também todos os atrasos deste colaborador
        const atrasos = AtrasoManager.getAll();
        const novosAtrasos = atrasos.filter(a => a.colaboradorId !== id);
        Storage.set('atrasos', novosAtrasos);
    },
    
    getById: (id) => {
        const colaboradores = ColaboradorManager.getAll();
        return colaboradores.find(c => c.id === id);
    }
};

// Gerenciador de atrasos
const AtrasoManager = {
    getAll: () => Storage.get('atrasos') || [],
    
    add: (colaboradorId, data, minutos) => {
        const atrasos = AtrasoManager.getAll();
        const novoAtraso = {
            id: generateUUID(),
            colaboradorId: colaboradorId,
            data: data,
            minutos: parseInt(minutos)
        };
        atrasos.push(novoAtraso);
        Storage.set('atrasos', atrasos);
        return novoAtraso;
    },
    
    remove: (id) => {
        const atrasos = AtrasoManager.getAll();
        const novosAtrasos = atrasos.filter(a => a.id !== id);
        Storage.set('atrasos', novosAtrasos);
    },
    
    update: (id, data, minutos) => {
        const atrasos = AtrasoManager.getAll();
        const index = atrasos.findIndex(a => a.id === id);
        if (index !== -1) {
            atrasos[index].data = data;
            atrasos[index].minutos = parseInt(minutos);
            Storage.set('atrasos', atrasos);
            return atrasos[index];
        }
        return null;
    },
    
    getByColaborador: (colaboradorId) => {
        const atrasos = AtrasoManager.getAll();
        return atrasos.filter(a => a.colaboradorId === colaboradorId);
    }
};

// Gerenciador de autenticação
const AuthManager = {
    login: (username, password) => {
        if (username === AUTH_CONFIG.username && password === AUTH_CONFIG.password) {
            sessionStorage.setItem('loggedIn', 'true');
            return true;
        }
        return false;
    },
    
    logout: () => {
        sessionStorage.removeItem('loggedIn');
    },
    
    isLoggedIn: () => {
        return sessionStorage.getItem('loggedIn') === 'true';
    }
};

// Utilitários de UI
const UI = {
    showMessage: (elementId, message, type = 'error') => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.className = type;
            setTimeout(() => {
                element.textContent = '';
                element.className = '';
            }, 3000);
        }
    },
    
    clearForm: (formId) => {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    }
};

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
        case '':
            initIndexPage();
            break;
        case 'admin.html':
            initAdminPage();
            break;
        case 'ranking.html':
            initRankingPage();
            break;
    }
});

// Inicialização da página principal
function initIndexPage() {
    loadColaboradoresSelect();
    
    const form = document.getElementById('form-registro');
    if (form) {
        form.addEventListener('submit', handleRegistroAtraso);
    }
    
    // Definir data atual como padrão
    const dataInput = document.getElementById('data-atraso');
    if (dataInput) {
        const hoje = new Date().toISOString().split('T')[0];
        dataInput.value = hoje;
    }
}

// Carregar colaboradores no select
function loadColaboradoresSelect() {
    const select = document.getElementById('colaborador');
    if (!select) return;
    
    const colaboradores = ColaboradorManager.getAll();
    select.innerHTML = '<option value="">Selecione um colaborador</option>';
    
    colaboradores.forEach(colaborador => {
        const option = document.createElement('option');
        option.value = colaborador.id;
        option.textContent = colaborador.nome;
        select.appendChild(option);
    });
}

// Manipular registro de atraso
function handleRegistroAtraso(event) {
    event.preventDefault();
    
    const colaboradorId = document.getElementById('colaborador').value;
    const data = document.getElementById('data-atraso').value;
    const minutos = document.getElementById('minutos-atraso').value;
    
    if (!colaboradorId || !data || !minutos) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    if (parseInt(minutos) <= 0) {
        alert('Os minutos de atraso devem ser maior que zero.');
        return;
    }
    
    try {
        AtrasoManager.add(colaboradorId, data, minutos);
        alert('Atraso registrado com sucesso!');
        UI.clearForm('form-registro');
        
        // Redefinir data atual
        const dataInput = document.getElementById('data-atraso');
        if (dataInput) {
            const hoje = new Date().toISOString().split('T')[0];
            dataInput.value = hoje;
        }
    } catch (error) {
        alert('Erro ao registrar atraso. Tente novamente.');
        console.error('Erro:', error);
    }
}

// Inicialização da página de administração
function initAdminPage() {
    const loginSection = document.getElementById('login');
    const adminPanel = document.getElementById('admin-panel');
    
    if (AuthManager.isLoggedIn()) {
        loginSection.style.display = 'none';
        adminPanel.style.display = 'block';
        loadAdminData();
    } else {
        loginSection.style.display = 'block';
        adminPanel.style.display = 'none';
    }
    
    const loginForm = document.getElementById('form-login');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const colaboradorForm = document.getElementById('form-colaborador');
    if (colaboradorForm) {
        colaboradorForm.addEventListener('submit', handleAddColaborador);
    }
}

// Manipular login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (AuthManager.login(username, password)) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        loadAdminData();
        UI.showMessage('login-message', 'Login realizado com sucesso!', 'success');
    } else {
        UI.showMessage('login-message', 'Usuário ou senha incorretos.');
    }
}

// Carregar dados da administração
function loadAdminData() {
    loadColaboradoresList();
    loadAtrasosList();
}

// Carregar lista de colaboradores
function loadColaboradoresList() {
    const lista = document.getElementById('lista-colaboradores');
    if (!lista) return;
    
    const colaboradores = ColaboradorManager.getAll();
    lista.innerHTML = '';
    
    colaboradores.forEach(colaborador => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${colaborador.nome}</span>
            <button class="btn-action" onclick="removeColaborador('${colaborador.id}')">Remover</button>
        `;
        lista.appendChild(li);
    });
}

// Manipular adição de colaborador
function handleAddColaborador(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome-colaborador').value.trim();
    
    if (!nome) {
        alert('Por favor, digite o nome do colaborador.');
        return;
    }
    
    // Verificar se já existe
    const colaboradores = ColaboradorManager.getAll();
    if (colaboradores.some(c => c.nome.toLowerCase() === nome.toLowerCase())) {
        alert('Já existe um colaborador com este nome.');
        return;
    }
    
    try {
        ColaboradorManager.add(nome);
        UI.clearForm('form-colaborador');
        loadColaboradoresList();
        alert('Colaborador adicionado com sucesso!');
    } catch (error) {
        alert('Erro ao adicionar colaborador. Tente novamente.');
        console.error('Erro:', error);
    }
}

// Remover colaborador
function removeColaborador(id) {
    if (confirm('Tem certeza que deseja remover este colaborador? Todos os atrasos relacionados também serão removidos.')) {
        try {
            ColaboradorManager.remove(id);
            loadColaboradoresList();
            loadAtrasosList();
            alert('Colaborador removido com sucesso!');
        } catch (error) {
            alert('Erro ao remover colaborador. Tente novamente.');
            console.error('Erro:', error);
        }
    }
}

// Carregar lista de atrasos
function loadAtrasosList() {
    const tbody = document.querySelector('#tabela-atrasos tbody');
    if (!tbody) return;
    
    const atrasos = AtrasoManager.getAll();
    const colaboradores = ColaboradorManager.getAll();
    tbody.innerHTML = '';
    
    atrasos.forEach(atraso => {
        const colaborador = colaboradores.find(c => c.id === atraso.colaboradorId);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${colaborador ? colaborador.nome : 'Colaborador não encontrado'}</td>
            <td>${formatDate(atraso.data)}</td>
            <td>${atraso.minutos} min</td>
            <td>
                <button class="btn-action btn-edit" onclick="editAtraso('${atraso.id}')">Editar</button>
                <button class="btn-action" onclick="removeAtraso('${atraso.id}')">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

// Editar atraso
function editAtraso(id) {
    const atrasos = AtrasoManager.getAll();
    const atraso = atrasos.find(a => a.id === id);
    
    if (!atraso) {
        alert('Atraso não encontrado.');
        return;
    }
    
    const novaData = prompt('Nova data (AAAA-MM-DD):', atraso.data);
    if (novaData === null) return;
    
    const novosMinutos = prompt('Novos minutos de atraso:', atraso.minutos);
    if (novosMinutos === null) return;
    
    if (!novaData || !novosMinutos || parseInt(novosMinutos) <= 0) {
        alert('Dados inválidos.');
        return;
    }
    
    try {
        AtrasoManager.update(id, novaData, novosMinutos);
        loadAtrasosList();
        alert('Atraso atualizado com sucesso!');
    } catch (error) {
        alert('Erro ao atualizar atraso. Tente novamente.');
        console.error('Erro:', error);
    }
}

// Remover atraso
function removeAtraso(id) {
    if (confirm('Tem certeza que deseja excluir este registro de atraso?')) {
        try {
            AtrasoManager.remove(id);
            loadAtrasosList();
            alert('Atraso removido com sucesso!');
        } catch (error) {
            alert('Erro ao remover atraso. Tente novamente.');
            console.error('Erro:', error);
        }
    }
}

// Inicialização da página de ranking
function initRankingPage() {
    loadRanking();
}

// Carregar ranking
function loadRanking() {
    const tbody = document.querySelector('#tabela-ranking tbody');
    if (!tbody) return;
    
    const colaboradores = ColaboradorManager.getAll();
    const atrasos = AtrasoManager.getAll();
    
    // Calcular estatísticas por colaborador
    const stats = colaboradores.map(colaborador => {
        const atrasosColaborador = atrasos.filter(a => a.colaboradorId === colaborador.id);
        const totalMinutos = atrasosColaborador.reduce((sum, a) => sum + a.minutos, 0);
        const numeroAtrasos = atrasosColaborador.length;
        
        return {
            nome: colaborador.nome,
            totalMinutos,
            numeroAtrasos
        };
    });
    
    // Ordenar por total de minutos (decrescente)
    stats.sort((a, b) => b.totalMinutos - a.totalMinutos);
    
    tbody.innerHTML = '';
    
    stats.forEach(stat => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${stat.nome}</td>
            <td>${stat.totalMinutos} min</td>
            <td>${stat.numeroAtrasos}</td>
        `;
        tbody.appendChild(tr);
    });
    
    if (stats.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="3" style="text-align: center;">Nenhum atraso registrado ainda.</td>';
        tbody.appendChild(tr);
    }
}

// Inicializar dados de exemplo (apenas para demonstração)
function initSampleData() {
    const colaboradores = ColaboradorManager.getAll();
    if (colaboradores.length === 0) {
        // Adicionar alguns colaboradores de exemplo
        ColaboradorManager.add('João Silva');
        ColaboradorManager.add('Maria Oliveira');
        ColaboradorManager.add('Pedro Santos');
        
        // Adicionar alguns atrasos de exemplo
        const colaboradoresAtualizados = ColaboradorManager.getAll();
        if (colaboradoresAtualizados.length > 0) {
            AtrasoManager.add(colaboradoresAtualizados[0].id, '2025-01-01', 15);
            AtrasoManager.add(colaboradoresAtualizados[1].id, '2025-01-02', 30);
            AtrasoManager.add(colaboradoresAtualizados[0].id, '2025-01-03', 10);
        }
    }
}

// Chamar inicialização de dados de exemplo apenas uma vez
if (!Storage.get('dataInitialized')) {
    initSampleData();
    Storage.set('dataInitialized', true);
}

