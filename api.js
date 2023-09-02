const axios = require('axios');
require('dotenv').config();

const token = process.env.MY_GITHUB_FOLLOWERS_TOKEN;
const username = process.env.MY_USER_NAME;

// Função para listar seguidores de todas as páginas
async function listarTodosSeguidores() {
    try {
        let page = 1;
        let seguidores = [];

        while (true) {
            const response = await axios.get(`https://api.github.com/users/${username}/followers`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    per_page: 100, // Defina a quantidade de seguidores por página (máximo de 100)
                    page,
                },
            });

            if (response.data.length === 0) {
                // Não há mais seguidores, saia do loop
                break;
            }

            // Mapeie e adicione os seguidores da página atual à lista
            seguidores = seguidores.concat(response.data.map(seguidor => seguidor.login));

            // Avance para a próxima página
            page++;
        }

        return seguidores;
    }catch (error) {
        console.error('Erro ao listar seguidores:', error.message);
        return [];
    }
}

// Função para listar pessoas que você está seguindo de todas as páginas
async function listarTodosSeguindo() {
    try {
        let page = 1;
        let seguindo = [];

        while (true) {
            const response = await axios.get(`https://api.github.com/users/${username}/following`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    per_page: 100, // Defina a quantidade de pessoas que você está seguindo por página (máximo de 100)
                    page,
                },
            });

            if (response.data.length === 0) {
                // Não há mais pessoas que você está seguindo, saia do loop
                break;
            }

            // Mapeie e adicione as pessoas que você está seguindo da página atual à lista
            seguindo = seguindo.concat(response.data.map(seguindo => seguindo.login));

            // Avance para a próxima página
            page++;
        }

        return seguindo;
    }catch (error) {
        console.error('Erro ao listar quem você está seguindo:', error.message);
        return [];
    }
}

// Chamando as funções assincronamente
Promise.all([listarTodosSeguidores(), listarTodosSeguindo()]).then(([seguidores, seguindo]) => {
    console.log('Seguidores que você não está seguindo:');
    const seguidoresNaoSeguindo = seguidores.filter(seguidor => !seguindo.includes(seguidor));
    console.log(seguidoresNaoSeguindo);

    console.log('Pessoas que você segue, mas não te seguem:');
    const seguindoNaoSeguidores = seguindo.filter(seguindo => !seguidores.includes(seguindo));
    console.log(seguindoNaoSeguidores);

    console.log(`Quantidade de seguidores: ${seguidores.length}`);
    console.log(`Quantidade de seguindo: ${seguindo.length}`);
});

