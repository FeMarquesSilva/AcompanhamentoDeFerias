async function obterIdUsuarioLogado() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'login.html';
        return null;
    }
    return parseInt(userId, 10);
}

// Função para formatar a data no formato DD/MM/AAAA - não utilizar
function formatarData(data) {
    const partes = data.split('-'); // Supondo que as datas vêm no formato "AAAA-MM-DD"
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Função para formatar a matrícula no formato 00.000-0
function formatarMatricula(matricula) {
    const cleaned = matricula.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}-${cleaned.slice(5, 6)}`;
}

// Evento de submissão do formulário de cadastro
document.getElementById('cadastroForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const userId = await obterIdUsuarioLogado(); // Obter o ID do usuário logado
    if (!userId) {
        alert('Erro ao obter o ID do usuário logado.');
        return;
    }

    // Obter os valores dos campos do formulário
    const matricula = formatarMatricula(document.getElementById('matricula').value);
    const nomeCompleto = document.getElementById('nomeCompleto').value;
    const nomePrimeiro = document.getElementById('primeiroNome').value;
    const departamento = document.getElementById('dept').value;
    const setor = document.getElementById('setor').value;
    const dataAquisicao = document.getElementById('dataAquisicaoFerias').value; // Formato original para o banco de dados
    const dataIniFerias = document.getElementById('dataInicioFerias').value; // Formato original para o banco de dados
    const dataFimFerias = document.getElementById('dataRetornoFerias').value; // Formato original para o banco de dados

    // Criar um objeto com os dados do funcionário
    const funcionario = {
        matricula,
        nomeCompleto,
        nomePrimeiro,
        departamento,
        setor,
        dataAquisicao,
        dataIniFerias,
        dataFimFerias,
        idProprietario: userId
    };

    try {
        // Salvar os dados do funcionário no Supabase
        const { data, error } = await supabaseClient
            .from('funcionarios')
            .insert([funcionario]);

        // Limpar o formulário após a submissão
        document.getElementById('cadastroForm').reset();

        if (error) {
            console.error(error);
            alert(`Erro ao salvar os dados do funcionário: ${error.message}`);
        } else {
            alert('Funcionário salvo com sucesso!');
        }
    } catch (err) {
        console.error(err);
        alert('Erro ao conectar com o Supabase.');
    }
});