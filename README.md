# InvBot - Crypto Trading Bot

Um bot de trading para operar futuros na Bybit, utilizando Microsoft QLib para análise e estratégias de trading.

## Características

- Interface mobile-first
- Suporte para modo clássico e hedge
- Integração com Bybit API
- Análise de mercado com Microsoft QLib
- Sistema de grid trading
- Múltiplas alavancagens (1x, 3x, 5x, 10x, 20x)
- Controle de posições em tempo real
- Gerenciamento de risco automatizado

## Requisitos

- Node.js 18+
- NPM ou Yarn
- Conta na Bybit com API Key

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/renanlocatizfernandes/invbot.git
cd invbot
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_BYBIT_API_KEY=sua_api_key
VITE_BYBIT_API_SECRET=seu_api_secret
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Uso

1. Acesse a aplicação no navegador
2. Configure suas credenciais da API da Bybit
3. Selecione o modo de trading (clássico ou hedge)
4. Configure a alavancagem desejada
5. Inicie o trading automatizado

## Segurança

- Nunca compartilhe suas chaves de API
- Use apenas o capital que você pode perder
- Mantenha suas chaves de API seguras
- Monitore regularmente suas posições

## Contribuição

Contribuições são bem-vindas! Por favor, leia o arquivo CONTRIBUTING.md para detalhes sobre nosso código de conduta e o processo para enviar pull requests.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE.md para detalhes.