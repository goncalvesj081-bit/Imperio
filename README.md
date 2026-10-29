# Fundo de Clubes

Simulador de fundo de investimento em clubes de futebol, feito para jogar no navegador do celular.

Você não escala time nem contrata jogador: **compra clubes, investe nas alavancas certas e vende no momento certo**. O placar é o patrimônio líquido do fundo.

## Como jogar

Abra o `index.html` em qualquer navegador moderno. Não precisa instalar nada nem rodar servidor.

O progresso é salvo automaticamente no `localStorage` do navegador. Para continuar de onde parou, use o botão **Continuar fundo** na tela inicial.

## O jogo

- **Início:** o fundo começa com R$ 90 mi em caixa e escolhe um primeiro clube barato.
- **Ligas:** 18 ligas na América do Sul e na Europa (Séries A, B e C do Brasil, Premier League, La Liga e outras), com acesso e rebaixamento.
- **Copas:** copas nacionais, Libertadores e Liga dos Campeões, cada uma com premiação por fase.
- **Alavancas de investimento:** reforço de elenco, gestão e governança, marketing e sócio-torcedor, categorias de base, centro de treinamento, além de reforma e ampliação de estádio.
- **Mercado:** compra e venda de clubes, relatórios de *due diligence* e propostas recebidas.
- **Fundos rivais:** outros fundos disputam os mesmos clubes e aparecem no ranking de patrimônio.
- **Fair play financeiro:** o clube é punido se a folha passar do teto em relação à receita.
- **Cotistas:** o dinheiro do fundo é de cotistas, que esperam 6% de rendimento da cota por temporada. Confiança alta traz captação de dinheiro novo; confiança baixa traz pedidos de resgate, que precisam ser pagos antes de a temporada começar. Sem caixa para tudo, o fundo paga o que tem, trava o resto e perde reputação.
- **Metas do conselho:** cada clube recebe um objetivo com prazo (subir de divisão, terminar no G4, zerar a dívida, valorizar 30% ou fechar duas temporadas no azul). Cumprir dá reputação e confiança dos cotistas; falhar tira.
- **Sócio minoritário:** venda até 49% de um clube para levantar caixa sem perder o controle. O sócio paga com desconto e leva a parte dele do caixa, dos dividendos e da venda; recomprar custa 10% a mais.
- **Extras:** eventos aleatórios, conquistas e relatórios de fim de temporada.

## Telas

| Tela | Para que serve |
| --- | --- |
| Fundo | Visão geral, avanço das rodadas, cotistas, crédito e propostas |
| Ativos | Clubes do fundo: meta do conselho, investimentos, finanças e sócio minoritário |
| Mercado | Clubes à venda e ranking dos fundos |
| Ligas | Classificações e copas |
| Relatórios | Histórico e balanços das temporadas |

## Estrutura

Tudo está num único arquivo, `index.html`, com HTML, CSS e JavaScript juntos e sem dependências externas além das fontes do Google Fonts.
