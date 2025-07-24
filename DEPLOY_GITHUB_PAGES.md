# Deploy para GitHub Pages

Este documento contém as instruções para fazer o deploy da aplicação no GitHub Pages.

## Configurações Implementadas

### 1. next.config.ts
- ✅ `output: 'export'` - Gera build estático
- ✅ `basePath` - Configurado para funcionar no subdiretório do GitHub Pages
- ✅ `assetPrefix` - URLs corretas para assets
- ✅ `trailingSlash: true` - Compatibilidade com GitHub Pages
- ✅ `images: { unoptimized: true }` - Desabilita otimização de imagens

### 2. Arquivos Removidos/Movidos
- ✅ API routes movidas para `api-backup/` (GitHub Pages não suporta server-side code)
- ✅ Arquivo `.nojekyll` criado em `public/` (necessário para Next.js)

### 3. Correções de Caminhos
- ✅ Função utilitária `getAssetPath()` criada em `src/utils/paths.ts`
- ✅ Imagens de background corrigidas para usar caminhos corretos
- ✅ Referências a assets ajustadas para funcionar com `basePath`

## Como Fazer o Deploy

### Pré-requisitos
1. Certifique-se de que todas as alterações estão commitadas na branch `new-code`
2. Verifique se o repositório tem GitHub Pages habilitado

### Passos para Deploy

1. **Instalar dependências** (se necessário):
   ```bash
   npm install
   ```

2. **Executar o script de deploy**:
   ```bash
   npm run deploy
   ```

   Este comando irá:
   - Executar `npm run build` para gerar o build estático
   - Usar `gh-pages -d out` para fazer deploy da pasta `out` para a branch `gh-pages`

3. **Configurar GitHub Pages** (se ainda não configurado):
   - Vá para Settings > Pages no repositório
   - Selecione "Deploy from a branch"
   - Escolha a branch `gh-pages`
   - Escolha a pasta `/ (root)`

### URL da Aplicação
Após o deploy, a aplicação estará disponível em:
```
https://kingsman-code.github.io/project-document-management/
```

## Verificações Pós-Deploy

1. ✅ Verifique se todas as imagens carregam corretamente
2. ✅ Teste a navegação entre páginas
3. ✅ Confirme que os estilos estão aplicados corretamente
4. ✅ Verifique se não há erros no console do navegador

## Problemas Conhecidos e Soluções

### Imagens não carregam
- **Causa**: Caminhos incorretos para assets
- **Solução**: Usar a função `getAssetPath()` para todos os assets

### Navegação quebrada
- **Causa**: Links não consideram o `basePath`
- **Solução**: Usar `useRouter` do Next.js corretamente

### Estilos não aplicados
- **Causa**: CSS não carrega devido a caminhos incorretos
- **Solução**: Verificar se `assetPrefix` está configurado corretamente

## Desenvolvimento Local

Para testar localmente com as mesmas configurações de produção:

```bash
# Definir NODE_ENV como production temporariamente
NODE_ENV=production npm run dev
```

Isso permitirá testar se os caminhos estão funcionando corretamente antes do deploy.

## Estrutura de Arquivos Modificados

```
project-document-management/
├── next.config.ts (✅ modificado)
├── public/
│   └── .nojekyll (✅ criado)
├── src/utils/
│   └── paths.ts (✅ criado)
├── app/
│   ├── layout.tsx (✅ modificado)
│   └── page.tsx (✅ modificado)
├── api-backup/ (✅ criado)
│   └── upload-document.ts (✅ movido)
└── DEPLOY_GITHUB_PAGES.md (✅ criado)
```

