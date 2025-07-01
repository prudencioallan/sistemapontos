// Configurações do sistema
const CONFIG = {
    adminPassword: 'admin123',
    warningLimit: 3, // Limite de avisos por mês
    updateInterval: 30000 // 30 segundos para atualização automática
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

// Utilitários de data
const DateUtils = {
    getCurrentMonth: () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    },
    
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    },
    
    isCurrentMonth: (dateString) => {
        const currentMonth = DateUtils.getCurrentMonth();
        return dateString.startsWith(currentMonth);
    }
};

// Gerenciador de colaboradores
const CollaboratorManager = {
    getAll: () => Storage.get('collaborators') || [],
    
    add: (name) => {
        const collaborators = CollaboratorManager.getAll();
        const newCollaborator = {
            id: generateUUID(),
            name: name.trim()
        };
        collaborators.push(newCollaborator);
        Storage.set('collaborators', collaborators);
        return newCollaborator;
    },
    
    remove: (id) => {
        const collaborators = CollaboratorManager.getAll();
        const newCollaborators = collaborators.filter(c => c.id !== id);
        Storage.set('collaborators', newCollaborators);
        
        // Remover também todos os atrasos deste colaborador
        const delays = DelayManager.getAll();
        const newDelays = delays.filter(d => d.collaboratorId !== id);
        Storage.set('delays', newDelays);
    },
    
    getById: (id) => {
        const collaborators = CollaboratorManager.getAll();
        return collaborators.find(c => c.id === id);
    }
};

// Gerenciador de atrasos
const DelayManager = {
    getAll: () => Storage.get('delays') || [],
    
    add: (collaboratorId, date, arrivalTime, notifiedBefore9, exceededLunch) => {
        const delays = DelayManager.getAll();
        const points = PointsCalculator.calculate(arrivalTime, notifiedBefore9, exceededLunch, collaboratorId, date);
        
        const newDelay = {
            id: generateUUID(),
            collaboratorId: collaboratorId,
            date: date,
            arrivalTime: arrivalTime,
            notifiedBefore9: notifiedBefore9,
            exceededLunch: exceededLunch,
            points: points
        };
        
        delays.push(newDelay);
        Storage.set('delays', delays);
        return newDelay;
    },
    
    remove: (id) => {
        const delays = DelayManager.getAll();
        const newDelays = delays.filter(d => d.id !== id);
        Storage.set('delays', newDelays);
    },
    
    update: (id, date, arrivalTime, notifiedBefore9, exceededLunch) => {
        const delays = DelayManager.getAll();
        const index = delays.findIndex(d => d.id === id);
        if (index !== -1) {
            const delay = delays[index];
            const points = PointsCalculator.calculate(arrivalTime, notifiedBefore9, exceededLunch, delay.collaboratorId, date);
            
            delays[index] = {
                ...delay,
                date: date,
                arrivalTime: arrivalTime,
                notifiedBefore9: notifiedBefore9,
                exceededLunch: exceededLunch,
                points: points
            };
            Storage.set('delays', delays);
            return delays[index];
        }
        return null;
    },
    
    getByCollaborator: (collaboratorId, monthFilter = null) => {
        const delays = DelayManager.getAll();
        let filtered = delays.filter(d => d.collaboratorId === collaboratorId);
        
        if (monthFilter) {
            filtered = filtered.filter(d => d.date.startsWith(monthFilter));
        }
        
        return filtered;
    },
    
    getCurrentMonthDelays: () => {
        const delays = DelayManager.getAll();
        const currentMonth = DateUtils.getCurrentMonth();
        return delays.filter(d => d.date.startsWith(currentMonth));
    }
};

// Calculadora de pontos
const PointsCalculator = {
    calculate: (arrivalTime, notifiedBefore9, exceededLunch, collaboratorId, date) => {
        let points = 0;
        
        // Converter hora de chegada para minutos
        const [hours, minutes] = arrivalTime.split(':').map(Number);
        const arrivalMinutes = hours * 60 + minutes;
        const nineOhTen = 9 * 60 + 10; // 09:10 em minutos
        
        // Verificar quantos avisos já foram usados no mês
        const currentMonth = date.substring(0, 7); // YYYY-MM
        const monthDelays = DelayManager.getAll().filter(d => 
            d.collaboratorId === collaboratorId && 
            d.date.startsWith(currentMonth) && 
            d.notifiedBefore9
        );
        const warningsUsed = monthDelays.length;
        const exceededWarningLimit = warningsUsed >= CONFIG.warningLimit;
        
        if (notifiedBefore9 && !exceededWarningLimit) {
            // Avisou antes das 9h e ainda tem avisos disponíveis
            if (arrivalMinutes <= nineOhTen) {
                points = 0; // Chegou até 09:10
            } else {
                points = Math.random() < 0.5 ? 1 : 2; // 1-2 pontos aleatório
            }
        } else {
            // Não avisou ou excedeu limite de avisos
            points = Math.random() < 0.5 ? 2 : 3; // 2-3 pontos aleatório
        }
        
        // Adicionar ponto extra se excedeu 1h de almoço
        if (exceededLunch) {
            points += 1;
        }
        
        return points;
    }
};

// Gerenciador de ranking
const RankingManager = {
    generateRanking: () => {
        const collaborators = CollaboratorManager.getAll();
        const currentMonth = DateUtils.getCurrentMonth();
        
        const ranking = collaborators.map(collaborator => {
            const monthDelays = DelayManager.getByCollaborator(collaborator.id, currentMonth);
            const totalPoints = monthDelays.reduce((sum, delay) => sum + delay.points, 0);
            const totalDelays = monthDelays.length;
            const warningsUsed = monthDelays.filter(d => d.notifiedBefore9).length;
            
            return {
                id: collaborator.id,
                name: collaborator.name,
                points: totalPoints,
                delays: totalDelays,
                warningsUsed: warningsUsed,
                warningLimit: CONFIG.warningLimit
            };
        });
        
        // Ordenar por pontos (decrescente)
        ranking.sort((a, b) => b.points - a.points);
        
        return ranking;
    },
    
    getWinner: () => {
        const ranking = RankingManager.generateRanking();
        return ranking.length > 0 ? ranking[0] : null;
    }
};

// Gerenciador de autenticação
const AuthManager = {
    login: (password) => {
        if (password === CONFIG.adminPassword) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            return true;
        }
        return false;
    },
    
    logout: () => {
        sessionStorage.removeItem('adminLoggedIn');
    },
    
    isLoggedIn: () => {
        return sessionStorage.getItem('adminLoggedIn') === 'true';
    }
};

// Utilitários de UI
const UI = {
    showError: (elementId, message) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    },
    
    clearForm: (formId) => {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    },
    
    formatPosition: (position) => {
        const icons = ['🏆', '🥈', '🥉'];
        if (position <= 3) {
            return `${icons[position - 1]}${position}°`;
        }
        return `📍${position}°`;
    }
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Inicializar dados de exemplo se necessário
    initSampleData();
    
    switch (currentPage) {
        case 'index.html':
        case '':
            initRankingPage();
            break;
        case 'admin.html':
            initAdminPage();
            break;
    }
});

// Inicialização da página de ranking
function initRankingPage() {
    updateCurrentMonth();
    loadRanking();
    loadWinner();
    
    // Atualização automática a cada 30 segundos
    setInterval(() => {
        loadRanking();
        loadWinner();
    }, CONFIG.updateInterval);
}

// Atualizar mês atual
function updateCurrentMonth() {
    const monthElement = document.getElementById('current-month');
    if (monthElement) {
        monthElement.textContent = DateUtils.getCurrentMonth();
    }
}

// Carregar ranking
function loadRanking() {
    const tbody = document.getElementById('ranking-tbody');
    if (!tbody) return;
    
    const ranking = RankingManager.generateRanking();
    tbody.innerHTML = '';
    
    ranking.forEach((item, index) => {
        const position = index + 1;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="position-cell">${UI.formatPosition(position)}</td>
            <td class="name-cell">${item.name}</td>
            <td class="points-cell">${item.points} pts</td>
            <td class="warnings-cell">${item.warningsUsed}/${item.warningLimit}</td>
            <td class="delays-cell">${item.delays}</td>
        `;
        tbody.appendChild(tr);
    });
    
    if (ranking.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="5" class="loading">Nenhum colaborador cadastrado ainda.</td>';
        tbody.appendChild(tr);
    }
}

// Carregar vencedor (quem paga o café)
function loadWinner() {
    const winner = RankingManager.getWinner();
    
    const winnerNameElement = document.getElementById('winner-name');
    const winnerPointsElement = document.getElementById('winner-points');
    const winnerDelaysElement = document.getElementById('winner-delays');
    
    if (winner && winner.points > 0) {
        if (winnerNameElement) winnerNameElement.textContent = winner.name;
        if (winnerPointsElement) winnerPointsElement.textContent = `- ${winner.points} pontos`;
        if (winnerDelaysElement) winnerDelaysElement.textContent = `${winner.delays} atraso(s) registrado(s)`;
    } else {
        if (winnerNameElement) winnerNameElement.textContent = 'Nenhum atraso registrado ainda';
        if (winnerPointsElement) winnerPointsElement.textContent = '- 0 pontos';
        if (winnerDelaysElement) winnerDelaysElement.textContent = '0 atraso(s) registrado(s)';
    }
}

// Inicialização da página administrativa
function initAdminPage() {
    const loginScreen = document.getElementById('login-screen');
    const adminPanel = document.getElementById('admin-panel');
    
    if (AuthManager.isLoggedIn()) {
        loginScreen.style.display = 'none';
        adminPanel.style.display = 'block';
        loadAdminData();
    } else {
        loginScreen.style.display = 'flex';
        adminPanel.style.display = 'none';
    }
    
    // Event listeners
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterDelay);
    }
    
    const addCollaboratorForm = document.getElementById('add-collaborator-form');
    if (addCollaboratorForm) {
        addCollaboratorForm.addEventListener('submit', handleAddCollaborator);
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Manipular login
function handleLogin(event) {
    event.preventDefault();
    
    const password = document.getElementById('password').value;
    
    if (AuthManager.login(password)) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        loadAdminData();
    } else {
        UI.showError('login-error', 'Senha incorreta. Tente novamente.');
    }
}

// Manipular logout
function handleLogout() {
    AuthManager.logout();
    location.reload();
}

// Carregar dados administrativos
function loadAdminData() {
    loadCollaboratorSelect();
    loadCollaboratorsList();
    loadDelayHistory();
}

// Carregar colaboradores no select
function loadCollaboratorSelect() {
    const select = document.getElementById('collaborator');
    if (!select) return;
    
    const collaborators = CollaboratorManager.getAll();
    select.innerHTML = '<option value="">Selecione um colaborador...</option>';
    
    collaborators.forEach(collaborator => {
        const option = document.createElement('option');
        option.value = collaborator.id;
        option.textContent = collaborator.name;
        select.appendChild(option);
    });
}

// Carregar lista de colaboradores
function loadCollaboratorsList() {
    const list = document.getElementById('collaborators-list');
    if (!list) return;
    
    const collaborators = CollaboratorManager.getAll();
    list.innerHTML = '';
    
    collaborators.forEach(collaborator => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${collaborator.name}</span>
            <button class="btn-danger btn-small" onclick="removeCollaborator('${collaborator.id}')">🗑️ Remover</button>
        `;
        list.appendChild(li);
    });
    
    if (collaborators.length === 0) {
        const li = document.createElement('li');
        li.innerHTML = '<span class="loading">Nenhum colaborador cadastrado ainda.</span>';
        list.appendChild(li);
    }
}

// Carregar histórico de atrasos
function loadDelayHistory() {
    const tbody = document.getElementById('history-tbody');
    if (!tbody) return;
    
    const delays = DelayManager.getAll();
    const collaborators = CollaboratorManager.getAll();
    tbody.innerHTML = '';
    
    // Ordenar por data (mais recente primeiro)
    delays.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    delays.forEach(delay => {
        const collaborator = collaborators.find(c => c.id === delay.collaboratorId);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${DateUtils.formatDate(delay.date)}</td>
            <td>${collaborator ? collaborator.name : 'Colaborador não encontrado'}</td>
            <td>${delay.arrivalTime}</td>
            <td>${delay.notifiedBefore9 ? '✅' : '❌'}</td>
            <td>${delay.exceededLunch ? '✅' : '❌'}</td>
            <td class="points-cell">${delay.points} pts</td>
            <td>
                <button class="btn-secondary btn-small" onclick="editDelay('${delay.id}')">✏️</button>
                <button class="btn-danger btn-small" onclick="removeDelay('${delay.id}')">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    if (delays.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7" class="loading">Nenhum atraso registrado ainda.</td>';
        tbody.appendChild(tr);
    }
}

// Manipular registro de atraso
function handleRegisterDelay(event) {
    event.preventDefault();
    
    const collaboratorId = document.getElementById('collaborator').value;
    const arrivalTime = document.getElementById('arrival-time').value;
    const notifiedBefore9 = document.getElementById('notified-before-9').checked;
    const exceededLunch = document.getElementById('exceeded-lunch').checked;
    
    if (!collaboratorId || !arrivalTime) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
        DelayManager.add(collaboratorId, today, arrivalTime, notifiedBefore9, exceededLunch);
        alert('Atraso registrado com sucesso!');
        UI.clearForm('register-form');
        loadDelayHistory();
    } catch (error) {
        alert('Erro ao registrar atraso. Tente novamente.');
        console.error('Erro:', error);
    }
}

// Manipular adição de colaborador
function handleAddCollaborator(event) {
    event.preventDefault();
    
    const name = document.getElementById('new-collaborator').value.trim();
    
    if (!name) {
        alert('Por favor, digite o nome do colaborador.');
        return;
    }
    
    // Verificar se já existe
    const collaborators = CollaboratorManager.getAll();
    if (collaborators.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        alert('Já existe um colaborador com este nome.');
        return;
    }
    
    try {
        CollaboratorManager.add(name);
        UI.clearForm('add-collaborator-form');
        loadCollaboratorSelect();
        loadCollaboratorsList();
        alert('Colaborador adicionado com sucesso!');
    } catch (error) {
        alert('Erro ao adicionar colaborador. Tente novamente.');
        console.error('Erro:', error);
    }
}

// Remover colaborador
function removeCollaborator(id) {
    const collaborator = CollaboratorManager.getById(id);
    if (!collaborator) return;
    
    if (confirm(`Tem certeza que deseja remover "${collaborator.name}"? Todos os atrasos relacionados também serão removidos.`)) {
        try {
            CollaboratorManager.remove(id);
            loadCollaboratorSelect();
            loadCollaboratorsList();
            loadDelayHistory();
            alert('Colaborador removido com sucesso!');
        } catch (error) {
            alert('Erro ao remover colaborador. Tente novamente.');
            console.error('Erro:', error);
        }
    }
}

// Editar atraso
function editDelay(id) {
    const delays = DelayManager.getAll();
    const delay = delays.find(d => d.id === id);
    
    if (!delay) {
        alert('Atraso não encontrado.');
        return;
    }
    
    const newArrivalTime = prompt('Nova hora de chegada (HH:MM):', delay.arrivalTime);
    if (newArrivalTime === null) return;
    
    const notifiedBefore9 = confirm('Avisou antes das 9h?');
    const exceededLunch = confirm('Excedeu 1 hora de almoço?');
    
    if (!newArrivalTime || !/^\d{2}:\d{2}$/.test(newArrivalTime)) {
        alert('Formato de hora inválido. Use HH:MM.');
        return;
    }
    
    try {
        DelayManager.update(id, delay.date, newArrivalTime, notifiedBefore9, exceededLunch);
        loadDelayHistory();
        alert('Atraso atualizado com sucesso!');
    } catch (error) {
        alert('Erro ao atualizar atraso. Tente novamente.');
        console.error('Erro:', error);
    }
}

// Remover atraso
function removeDelay(id) {
    if (confirm('Tem certeza que deseja excluir este registro de atraso?')) {
        try {
            DelayManager.remove(id);
            loadDelayHistory();
            alert('Atraso removido com sucesso!');
        } catch (error) {
            alert('Erro ao remover atraso. Tente novamente.');
            console.error('Erro:', error);
        }
    }
}

// Inicializar dados de exemplo
function initSampleData() {
    const collaborators = CollaboratorManager.getAll();
    if (collaborators.length === 0) {
        // Adicionar colaboradores de exemplo
        const sampleCollaborators = [
            'Alex Varela Laurentino',
            'Allan Prudencio Silva',
            'Amabile Gargioni de Lima Vieira',
            'Elson Mateus dos Santos',
            'Filipe Henrique da Mata Melo',
            'Esther Eschembach',
            'Mateus Zatti Padilha',
            'Matheus Henrique Miranda Silva',
            'Rodrigo da Silva Costa',
            'Tatiane Elizabete Conrad Coelho'
        ];
        
        sampleCollaborators.forEach(name => {
            CollaboratorManager.add(name);
        });
        
        // Adicionar alguns atrasos de exemplo
        const collaboratorsAdded = CollaboratorManager.getAll();
        const today = new Date();
        
        // Simular alguns atrasos do mês atual
        for (let i = 0; i < 15; i++) {
            const randomCollaborator = collaboratorsAdded[Math.floor(Math.random() * collaboratorsAdded.length)];
            const randomDay = Math.floor(Math.random() * 30) + 1;
            const date = `${DateUtils.getCurrentMonth()}-${String(randomDay).padStart(2, '0')}`;
            const arrivalTime = `09:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
            const notifiedBefore9 = Math.random() < 0.6; // 60% chance de ter avisado
            const exceededLunch = Math.random() < 0.2; // 20% chance de ter excedido almoço
            
            DelayManager.add(randomCollaborator.id, date, arrivalTime, notifiedBefore9, exceededLunch);
        }
    }
}

