# Fundo de Equipes (F1): documento de projeto

Projeto para um jogo de automobilismo baseado no **Fundo de Clubes** (`index.html` deste repositório). A ideia central fica igual: você não pilota nem monta o carro. Você **compra equipes, investe nas alavancas certas e vende no momento certo**. O placar é o patrimônio líquido do fundo.

Este documento serve para duas coisas:

1. Planejar o jogo.
2. Servir de instrução para quem for programar, seja você ou o Claude. A seção 14 traz um pedido pronto para colar.

---

## 1. O que muda e o que fica

O futebol tem acesso e rebaixamento, dezenas de clubes por liga e um jogo por rodada. A F1 é diferente: poucas equipes, uma vaga é quase uma franquia, o regulamento muda de tempos em tempos e existe teto de gastos. O jogo precisa aproveitar essas diferenças, não esconder.

| Fundo de Clubes | Fundo de Equipes (F1) |
| --- | --- |
| Clube | Equipe |
| Liga / divisão (Série A, B, C, Premier...) | Categoria (F1, F2, F3, F4 regional) |
| Acesso e rebaixamento | **Não existe.** A subida é comprar uma equipe na categoria de cima ou pagar a taxa de entrada na F1 |
| Rodada (jogo) | Etapa (GP) |
| Classificação da liga | Campeonato de construtores (e de pilotos, só informativo) |
| Elenco (força) | Desempenho do carro + nível dos pilotos |
| Copas (Copa do Brasil, Libertadores) | Não há. No lugar: corridas sprint e bônus por vitória/pódio |
| Fair play financeiro (teto de folha) | **Teto de gastos** (cost cap) da F1 |
| Ciclo de mercado (euforia → crise) | Mantém, e soma o **ciclo de regulamento** |
| Categorias de base | Academia de pilotos |
| Estádio (capacidade, bilheteria) | Fábrica, túnel de vento e simulador (não geram bilheteria; geram desempenho) |
| Sócio-torcedor | Fãs e audiência (efeito "Drive to Survive") |
| Fundos rivais | Fundos rivais **e montadoras** (compram equipes por motivo de marca) |
| Sinergia entre clubes | **Não trazer.** Foi removida do jogo de futebol por ser complicada e render pouco |

---

## 2. O que reaproveitar do código atual

O `index.html` do Fundo de Clubes já resolve a parte chata. Copie a estrutura e troque só o conteúdo de domínio.

**Reaproveitar quase sem mudança:**
- Arquivo único (HTML + CSS + JS), sem dependências, pensado para celular (`#app` com `max-width: 560px`).
- Tema escuro com as variáveis de cor em `:root` e as fontes (Archivo Black, IBM Plex Sans, IBM Plex Mono).
- Utilitários: `ri`, `pick`, `clamp`, `esc`, `poisson`, `moeda`, `sinal`, `pct`. Em `moeda`, trocar `R$` por `US$`.
- Persistência: objeto `DB` sobre `localStorage` com fallback em memória, `salvar`/`carregar`/`apagar`, gravação ao esconder a página (`visibilitychange`/`pagehide`). Usar uma chave nova, por exemplo `fundodeequipes_v1`.
- Renderização: `render()` monta o HTML da tela inteira; botões usam `data-a="acao:param"` e um único `switch` trata as ações. Guardar rolagem por tela (`SCROLL`).
- Componentes de UI: `painel`, `sec`, `ln`, `lnTot`, `tabela`, `seg` (abas), `tag`, `trocador`, `campo`, `selHTML`, modal e `alerta`.
- Gráficos em SVG (`svgLinha`, eixos) para patrimônio e valor das equipes.
- Ciclo de mercado (`novoCiclo`/`evoluirCiclo`/`faseDe`) com as fases euforia, alta, estável, correção e crise.
- Fundos rivais com perfis (agressivo, oportunista, paciente, conservador) e portes (gigante a emergente).
- Due diligence, ofertas de compra (agressiva / preço pedido / fechar na hora), chance de aceite, propostas recebidas.
- Eventos aleatórios com `cond` e `ap`, conquistas, notícias, relatório de fim de temporada, arquivo de ativos vendidos.

**Reescrever:**
- Dados do mundo (equipes e categorias).
- Simulação de corrida no lugar de `simularJogo`/`simularRodada`.
- Receita, despesa e valor de mercado.
- Alavancas de investimento.
- Teto de gastos no lugar do fair play financeiro.
- Calendário, que é único por categoria e não é turno e returno.

---

## 3. O mundo

### Categorias

| Categoria | Equipes | Etapas | Peso econômico | Observação |
| --- | --- | --- | --- | --- |
| F1 | 11 | 24 | muito alto | Vagas fechadas. Entrar exige comprar uma equipe ou pagar a taxa de entrada |
| F2 | 11 | 14 | médio | Vitrine de pilotos; receita vem quase toda de patrocínio e "pay drivers" |
| F3 | 10 | 10 | baixo | Porta de entrada barata do fundo |
| F4 regional (ex.: F4 Brasil, F4 Itália) | 8–12 cada | 8 | mínimo | Opcional no começo; bom para a academia |

Todos os números são **valores iniciais para ajuste**, não dados oficiais. A tabela de constantes deve ficar no topo do código, como já é feito com `LIGAS`, `ECO`, `MANUT` e `TECNICOS`.

### Nomes das equipes

Sugestão: usar **nomes fictícios** (ex.: "Scuderia Vettorini", "Halden Racing"). Com nomes reais, ajustar força e orçamento vira briga com a realidade a cada temporada, e há marcas registradas envolvidas. Se quiser nomes reais, deixe tudo numa lista fácil de editar.

### Dados de cada equipe (`p`, como no jogo atual)

| Campo | Faixa | O que representa |
| --- | --- | --- |
| `carro` | 0–100 | Desempenho atual do carro |
| `confiab` | 0–100 | Chance de terminar a corrida |
| `piloto1`, `piloto2` | 0–100 | Nível dos pilotos (pode virar objeto com nome, idade, salário, contrato) |
| `tunel` | 0–100 | Qualidade de túnel de vento + CFD |
| `fabrica` | 0–100 | Fábrica e capacidade de produzir peças |
| `simulador` | 0–100 | Ajuda a acertar o carro e reduz quedas de desempenho |
| `motor` | `cliente` / `parceria` / `fabrica` | Tipo de acordo de motor |
| `marca` | 0–100 | Força comercial (patrocínio, audiência) |
| `fas` | número | Base de fãs |
| `gestao` | 0–100 | Igual ao jogo atual: reduz custo e melhora contratos |
| `academia` | 0–100 | Academia de pilotos (equivale às categorias de base) |
| `divida`, `caixa` | US$ | Como no jogo atual |
| `momento` | −0,25 a +0,35 | Como no jogo atual |

---

## 4. Simulação de corrida

Simples, rápida e explicável, como a simulação de jogo atual.

```
ritmo(equipe, piloto) = carro * 0.70 + piloto * 0.30 + ruido_normal(0, 4)
abandono = chance de (1 - confiab/100) * 0.18 por carro por corrida
```

1. Para cada carro que não abandonou, calcular o `ritmo`.
2. Ordenar e distribuir pontos: 25, 18, 15, 12, 10, 8, 6, 4, 2, 1 nos dez primeiros.
3. Somar os pontos dos dois carros no campeonato de construtores.
4. Guardar pódios, vitórias e abandonos para o relatório e as conquistas.
5. Opcional: algumas etapas com sprint (8, 7, 6, 5, 4, 3, 2, 1).

A diferença de 1 ponto de `carro` precisa ser sentida, mas sem decidir tudo. Ajuste o `ruido` até um carro 5 pontos melhor vencer algo em torno de 65–75% dos duelos.

---

## 5. Economia

### Receita da temporada

| Fonte | Ideia de cálculo |
| --- | --- |
| Premiação da categoria | Tabela por posição no campeonato de construtores. Na F1, de cerca de US$ 140 mi (1º) a US$ 60 mi (último). Bem menor nas categorias de baixo |
| Patrocínio | `marca/100 * base_da_categoria * (0.8 + gestao/100 * 0.4)` |
| Patrocínio master (naming) | Contrato de várias temporadas negociado como alavanca |
| Pilotos pagantes | Em F2/F3, um piloto pode trazer dinheiro em troca de vaga (piloto pior, caixa melhor) |
| Venda de pilotos da academia | Igual a `vendasBase`: `academia` e resultado da categoria |
| Venda de tecnologia | Equipes com `fabrica` alta vendem peças para equipes clientes |

### Despesa da temporada

Salários (pilotos e equipe), desenvolvimento do carro, operação (viagens, logística), motor (custo depende do tipo de acordo), manutenção da fábrica, juros da dívida.

### Teto de gastos

No lugar do fair play financeiro (`FPF_TETO`, `punicaoPorFpf`):

- Vale **só na F1**. Fica em torno de US$ 215 mi a partir do regulamento de 2026; deixe como constante.
- Salário dos pilotos e marketing ficam **fora** do teto, como na regra real. Desenvolvimento, fábrica e operação ficam **dentro**.
- Estourar até 5%: multa e perda de tempo de túnel de vento na temporada seguinte.
- Estourar mais: multa maior, perda de pontos no campeonato e queda de reputação do fundo.
- Isso cria a decisão principal da F1: dinheiro sobrando não vira desempenho direto. Ele vai para fábrica e infraestrutura **antes** de a equipe estar no limite, ou para coisas fora do teto.

### Valor de mercado de uma equipe

Partir da fórmula atual (`valorMercado`) e trocar os fatores:

```
bruto = valor_da_vaga(categoria)
      * fator_desempenho(carro, posição recente)
      * fator_marca(marca, fas)
      * fator_infra(tunel, fabrica, simulador)
      * fator_saude(divida / receita)
      * momento
      * indice_do_ciclo_de_mercado
liquido = max(bruto * 0.15, bruto - divida)
```

O `valor_da_vaga` é o grande diferencial da F1. Uma vaga vale muito mesmo para uma equipe ruim: uma equipe de fundo de grid na F1 vale mais que a melhor equipe da F2. Isso faz "comprar a pior equipe da F1 e arrumar" ser a jogada clássica, como comprar clube em crise no jogo atual.

---

## 6. Alavancas de investimento

Mesma ideia de `alavancas()`: imediatas e obras de longo prazo, cada uma com custo, efeito e motivo de bloqueio.

| Alavanca | Tipo | Efeito | Conta no teto? |
| --- | --- | --- | --- |
| Pacote de atualizações | Imediata | +carro agora; perde parte se o regulamento mudar | Sim |
| Novo túnel de vento | Obra (2 temporadas) | +tunel, acelera o desenvolvimento | Não (infraestrutura) |
| Ampliar fábrica | Obra (2 temporadas) | +fabrica, +confiab, permite vender peças | Não |
| Simulador novo | Obra (1 temporada) | +simulador, menos variação de resultado | Não |
| Trocar o acordo de motor | Contrato | Cliente (barato, carro limitado) → parceria → motor de fábrica | Parcial |
| Contratar piloto | Mercado de pilotos | +piloto, salário alto | Não |
| Diretor técnico | Contrato | Como `TECNICOS`: custo por nível, bônus de desenvolvimento | Sim |
| Academia de pilotos | Obra | +academia, revela e vende pilotos | Não |
| Marketing e conteúdo | Imediata | +marca, +fas | Não |
| Gestão e governança | Imediata | Igual ao jogo atual | Sim |

### Regra de tempo de túnel (opcional, mas boa)

Na F1 real, quem termina melhor no campeonato recebe **menos** tempo de túnel de vento na temporada seguinte. Implementar como: `ganho_de_desenvolvimento *= 0.75 + (posicao / n_equipes) * 0.5`. Isso freia quem lidera e dá esperança a quem está atrás, sem regra artificial.

---

## 7. Como o fundo sobe de categoria

Sem acesso e rebaixamento, o caminho é financeiro:

1. **Comprar uma equipe já na categoria de cima.** Cara, e os donos de equipes de F1 raramente vendem. Use `chanceAceite` baixa e preço com prêmio alto.
2. **Pagar a taxa de entrada na F1.** Abre uma vaga nova. Exige caixa enorme (na casa de US$ 450 mi), reputação mínima e uma equipe forte de F2 como base. A nova equipe começa com `carro` baixo e infraestrutura do zero.
3. **Vender o que tem para financiar a subida.** Igual ao jogo atual.

A reputação do fundo libera o acesso a cada categoria, como `acessoLiga` faz hoje.

---

## 8. Ciclos

### Ciclo de mercado

Mantém exatamente o do jogo atual (`novoCiclo`/`evoluirCiclo`). Ele mexe no preço de compra e de venda das equipes.

### Ciclo de regulamento (novo)

A cada 4 a 5 temporadas, a F1 muda o regulamento técnico:

- Na temporada da mudança, o `carro` de todas as equipes é recalculado: `novo = carro * 0.4 + (tunel + fabrica + simulador) / 3 * 0.4 + ruido * 0.2`.
- Quem investiu em infraestrutura sai na frente; quem só comprou "pacote de atualizações" perde a vantagem.
- Duas temporadas antes, uma notícia avisa a mudança. O jogador decide entre ganhar agora ou se preparar para o novo regulamento.

Esse é o equivalente F1 da tensão "vender na euforia ou segurar".

---

## 9. Rivais

- **Fundos rivais:** reaproveitar `PERFIS`, `TIERS`, `rivalCompra`, `rivalVende`, `turnoRivais` e o ranking.
- **Montadoras (novo perfil):** pagam acima do valor, mas só por equipes de F1 e só em alguns momentos (por exemplo, antes de um novo regulamento de motor). Uma proposta de montadora é a grande chance de venda.

---

## 10. Eventos

Mesmo formato de `EVENTOS` (`id`, `peso`, `tipo`, `cond`, `ap`):

- **Batida forte:** custo de reparo que conta no teto de gastos.
- **Piloto assediado:** equipe rival oferece contrato ao seu piloto; manter custa salário maior.
- **Patrocinador sai:** queda de receita; mais provável se a marca caiu.
- **Quebra de motor em série:** queda de `confiab` na temporada, mais provável com motor cliente barato.
- **Atualização não funcionou:** pacote rende metade do esperado.
- **Passivo oculto:** igual ao atual, quando a compra foi sem due diligence.
- **Documentário de sucesso:** salto de `fas` e `marca`.
- **Investigação do teto de gastos:** só se a equipe passou perto do limite.

---

## 11. Conquistas (exemplos)

- **Primeira equipe:** comprar a primeira equipe.
- **Primeiro pódio:** um pódio em qualquer categoria.
- **Primeira vitória na F1.**
- **Campeão de construtores** em qualquer categoria.
- **Subiu ao grid:** ter uma equipe na F1.
- **Da F3 à F1:** ter equipes nas três categorias ao mesmo tempo.
- **Revelação:** vender um piloto da academia para uma equipe de F1.
- **Contas em dia:** cinco temporadas na F1 sem estourar o teto.
- **Bilionário:** patrimônio acima de US$ 1 bi.

---

## 12. Telas

Mesma navegação inferior do jogo atual:

| Tela | Conteúdo |
| --- | --- |
| Fundo | Patrimônio, caixa, dívida, reputação, avançar etapas, propostas, crédito |
| Equipes | Equipes do fundo. Abas: Painel, Investir, Pilotos, Finanças, Balanço |
| Mercado | Equipes à venda, mercado de pilotos, ranking dos fundos |
| Campeonatos | Classificação de construtores e de pilotos por categoria, calendário |
| Relatórios | Fechamento de temporada, histórico, ativos vendidos, conquistas |

O relatório de fim de temporada deve mostrar, por equipe: posição, pontos, receita e despesa, situação no teto de gastos, mudança de valor e eventos.

---

## 13. Ordem de construção

Fazer em partes pequenas, cada uma jogável:

1. **Base:** copiar a estrutura do `index.html`, trocar textos, cores de destaque e chave de save. Uma categoria (F3), simulação de corrida e campeonato.
2. **Economia:** receita, despesa, valor de mercado, compra e venda de equipe, relatório de temporada.
3. **Todas as categorias**, acesso por reputação, taxa de entrada na F1.
4. **Alavancas e obras**, teto de gastos.
5. **Rivais e montadoras**, ciclo de mercado.
6. **Ciclo de regulamento**, mercado de pilotos e academia.
7. **Eventos, conquistas, gráficos.**

### Como testar cada parte

Mesmo método usado no Fundo de Clubes:

- `node --check` no JavaScript extraído do HTML.
- Playwright (Chromium headless): criar fundo, comprar equipe, simular 20 temporadas, recarregar e continuar o save, sem erros no console.
- Partidas com cliques aleatórios em todas as telas.
- Testar nome do fundo com HTML (`<img src=x onerror=...>`) para garantir que tudo passa por `esc()`.
- Conferir balanceamento: depois de 20 temporadas, um jogador passivo não deve ficar rico, e um fundo bem administrado deve conseguir chegar à F1 em algo entre 8 e 15 temporadas.

---

## 14. Pedido pronto para o Claude

> Crie um jogo novo chamado **Fundo de Equipes**, em um único arquivo `index.html`, seguindo o documento `FUNDO-F1.md`. Use o `index.html` do jogo Fundo de Clubes como base de arquitetura: mesmo visual, mesmos utilitários, mesma persistência em `localStorage`, mesmo esquema de `render()` com `data-a`. Comece pela etapa 1 da seção 13 e só passe para a próxima quando a anterior estiver jogável e testada com Playwright, sem erros no console. Não implemente sinergia entre equipes.
