// Importar o módulo redis
const redis = require('redis');

// Criar o cliente Redis
const client = redis.createClient({
    socket: {
        host: '127.0.0.1',  // Endereço do Redis (Docker usa localhost)
        port: 6379          // Porta padrão do Redis
    }
});

// Conectar ao Redis
async function connectRedis() {
    try {
        await client.connect();
        console.log('Conectado ao Redis!');
    } catch (err) {
        console.error('Erro ao conectar ao Redis:', err);
    }
}

// Função para adicionar boybands e membros
async function addBoyBands() {
    try {
        // Inserir os nomes das boybands
        await client.set('boyband:1', 'Backstreet Boys');
        await client.set('boyband:2', 'NSYNC');
        await client.set('boyband:3', 'One Direction');
        console.log('Boybands adicionadas com sucesso!');

        // Inserir membros da Backstreet Boys como hash
        await client.hSet('boyband:1:members', {
            Nick: 'Carter',
            AJ: 'McLean',
            Howie: 'Dorough',
            Brian: 'Littrell',
            Kevin: 'Richardson'
        });
        console.log('Membros da Backstreet Boys adicionados!');

        // Inserir músicas da NSYNC como lista
        await client.lPush('boyband:2:songs', 'Bye Bye Bye', "It's Gonna Be Me", 'Tearin’ Up My Heart');
        console.log('Músicas da NSYNC adicionadas!');

        // Inserir o número de ingressos para um show da One Direction
        await client.set('boyband:3:concert_tickets', 1000);
        await client.expire('boyband:3:concert_tickets', 60);  // Expirar em 60 segundos
        console.log('Ingressos da One Direction adicionados com expiração de 60 segundos!');

    } catch (err) {
        console.error('Erro ao adicionar boybands:', err);
    } finally {
        // Fechar a conexão após todas as operações
        await client.quit();
        console.log('Conexão com o Redis encerrada.');
    }
}

// Conectar e adicionar dados
(async () => {
    await connectRedis();
    await addBoyBands();
})();
