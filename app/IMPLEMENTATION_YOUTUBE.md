# Implementacao: Player do YouTube na Pagina de Letras

## Resumo

Ao selecionar uma musica e ser direcionado para a fase `playing` (onde a letra e exibida com os blanks), exibir na lateral um player embutido do YouTube com o video/audio da musica correspondente. O usuario podera ouvir a musica enquanto preenche os campos sem sair da aplicacao.

---

## Arquitetura Atual (Referencia)

- **Framework:** React 19 + TypeScript + Vite
- **Navegacao:** Baseada em fases (`search` | `loading` | `playing` | `submitted`)
- **Modelo Track:** `{ id, trackName, artistName, albumName, duration }` — sem campo de YouTube
- **Componente de letras:** `LyricDisplay.tsx` — renderiza tokens com inputs
- **API atual:** lrclib.net (apenas letras, sem URLs de video)

---

## Passos da Implementacao

### 1. Obter o Video do YouTube

A API do lrclib nao fornece URLs de video. Precisamos de uma estrategia para buscar o video correto.

**Opcao A — YouTube Data API v3:**
- Fazer uma busca com `trackName + artistName + "official"` via YouTube Data API
- Requer uma API Key do Google Cloud Console
- Limite gratuito: 10.000 unidades/dia (~100 buscas/dia)

**Opcao B — Busca via YouTube sem API Key (embed por query):**
- Construir a URL de embed usando um redirect de busca: `https://www.youtube.com/embed?listType=search&list={trackName}+{artistName}`
- Nao requer chave de API
- Menos controle sobre qual video e selecionado

**Opcao C — Integracao com servico intermediario (ex: Invidious API):**
- Usar uma API alternativa gratuita para buscar video IDs
- Sem custo, mas depende de instancias de terceiros

### 2. Atualizar o Modelo de Dados

**Arquivo:** `src/types/index.ts`

Adicionar campo opcional ao `Track`:

```typescript
export interface Track {
  id: number;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  youtubeVideoId?: string; // novo campo
}
```

### 3. Criar Utilitario de Busca do YouTube

**Novo arquivo:** `src/utils/youtube.ts`

```typescript
export async function searchYoutubeVideo(trackName: string, artistName: string): Promise<string | null> {
  // Implementacao depende da opcao escolhida (A, B ou C)
  // Retorna o videoId ou null se nao encontrar
}
```

### 4. Criar Componente do Player

**Novo arquivo:** `src/components/YoutubePlayer.tsx`

- Recebe `videoId` como prop
- Renderiza um `<iframe>` com embed do YouTube
- Responsivo (adapta ao tamanho do container lateral)
- Controles de play/pause visiveis
- Opcao de minimizar/ocultar o player

```typescript
interface YoutubePlayerProps {
  videoId: string;
  trackName: string;
  artistName: string;
}
```

### 5. Ajustar o Layout da Fase `playing`

**Arquivo:** `src/App.tsx` e `src/App.css`

Mudar o layout de coluna unica para um layout com sidebar:

```
+-------------------------------------------+
|              Header                        |
+-------------------------------------------+
|                          |                 |
|   Lyrics (blanks)        |  YouTube Player |
|   [area principal]       |  [sidebar]      |
|                          |                 |
+-------------------------------------------+
```

- Usar CSS Grid ou Flexbox para dividir o espaco
- Proporcao sugerida: 65% letras / 35% player (ajustavel)
- Em telas menores (mobile), empilhar verticalmente (player em cima, letras embaixo)

### 6. Integrar a Busca no Fluxo de Selecao

**Arquivo:** `src/App.tsx`

No handler `handleSelectTrack`:
1. Buscar letras (ja existente)
2. Em paralelo, buscar o videoId do YouTube
3. Armazenar o videoId no estado
4. Exibir o player quando disponivel (nao bloquear a exibicao das letras se o video demorar)

### 7. Tratar Estados de Erro/Indisponibilidade

- Se nenhum video for encontrado: ocultar a sidebar ou mostrar mensagem "Video nao disponivel"
- Se a API do YouTube falhar: nao impactar a funcionalidade principal (letras)
- Loading state enquanto busca o video

### 8. Responsividade e UX

- **Desktop:** Player fixo na lateral direita com scroll independente das letras
- **Tablet:** Player menor ou colapsavel
- **Mobile:** Player fixo no topo (menor) ou botao para expandir/minimizar
- Player deve continuar tocando mesmo com scroll nas letras

### 9. Estilizacao

**Arquivo:** `src/App.css` ou novo `src/components/YoutubePlayer.css`

- Manter consistencia visual com o tema existente (dark mode incluso)
- Borda/sombra sutil ao redor do player
- Transicao suave ao mostrar/ocultar

---

## Fluxo Completo (Resumo)

```
Usuario busca musica → Seleciona resultado → Loading
  ├── Busca letras (lrclib) → tokeniza → blanks
  └── Busca video (YouTube) → obtem videoId
→ Fase 'playing':
  ├── Lateral esquerda: LyricDisplay com blanks
  └── Lateral direita: YoutubePlayer com iframe embed
```

---

## Perguntas para Esclarecimento

### Sobre a fonte do video

1. **Voce ja possui uma API Key do Google (YouTube Data API v3)?** Se nao, prefere uma solucao que nao exija chave de API (menos precisa na selecao do video)?
R: não possuo api key do google do youtube data api v3, use uma solução que nao precise disso mas que encontr e amusica mesmo assim

2. **E aceitavel que o video seja selecionado automaticamente** (primeiro resultado da busca) ou o usuario deveria poder escolher entre opcoes?
R: sim

3. **Caso o video nao seja encontrado**, o layout deve manter o espaco da sidebar vazio ou voltar para o layout de coluna unica?
R: volte o layout de coluna unica

### Sobre o layout

4. **Qual a prioridade em mobile?** O player deve ficar visivel o tempo todo (fixo no topo) ou o usuario pode minimiza-lo para focar nas letras?
R: pode minimiza-lo

5. **O player deve continuar visivel na fase `submitted`** (apos o usuario enviar as respostas) ou apenas durante a fase `playing`?
R: sim, deve continuar visivel mesmo depois do usuário ter dado submit 

6. **Prefere que o video fique na lateral direita ou esquerda?** Ou em cima das letras?
R: direita

### Sobre funcionalidades extras

7. **Deseja controle de sincronizacao?** Por exemplo: pausar o video automaticamente quando o usuario acertar todas as palavras, ou isso e desnecessario?
R: desncessário

8. **O player deve iniciar automaticamente (autoplay)** ao carregar a pagina ou aguardar o usuario clicar em play?
R: não, o usuário deverá apertar no play para iniciar a musica

9. **Gostaria de um botao para "buscar outro video"** caso o resultado automatico nao seja o correto?
R: sim

10. **Ha interesse em mostrar apenas o audio** (player minimalista sem video) para economizar espaco, ou o video completo e desejado?
R: sim

### Sobre restricoes tecnicas

11. **Ha preocupacao com limites de requisicao** (rate limiting)? Se muitos usuarios usarem ao mesmo tempo, a API do YouTube pode bloquear.
R: não

12. **O projeto sera hospedado em algum lugar especifico** (Vercel, Netlify, etc.)? Isso pode influenciar se precisamos de um backend para proteger a API Key.
R: não, por enquanto apenas no local

13. **Existe alguma restricao de CSP (Content Security Policy)** no projeto que possa bloquear iframes do YouTube?
R: não

---

## Estimativa de Esforco

| Etapa | Complexidade | Tempo estimado |
|-------|-------------|----------------|
| Utilitario de busca YouTube | Media | 1-2h |
| Componente YoutubePlayer | Baixa | 1h |
| Ajuste de layout (desktop) | Media | 1-2h |
| Responsividade (mobile) | Media | 1-2h |
| Integracao no fluxo App.tsx | Baixa | 30min |
| Tratamento de erros | Baixa | 30min |
| Testes e ajustes | Media | 1-2h |
| **Total** | | **~6-10h** |

---

## Proximos Passos

Apos esclarecimento das perguntas acima, posso iniciar a implementacao priorizando:
1. Versao funcional com layout basico (desktop)
2. Responsividade
3. Polimento visual e tratamento de edge cases
