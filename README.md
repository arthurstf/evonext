# EvoNext — site da agência

Abra `index.html` no navegador para ver o site.

## Estrutura
```
evonext/
├── index.html                    página principal
├── css/style.css                 estilos de todo o site
├── js/main.js                    scripts (edite o bloco CONFIG no topo)
├── images/
│   ├── logo.svg / favicon.svg
│   ├── projetos/                 prints dos 5 sites
│   └── socios/                   fotos: marcos.jpg e arthur.jpg
├── estetica-bella/               página do projeto
├── acai-do-ponto/
├── advocacia-reis/
├── barbearia-alpha/
└── gustavo-luis-arquitetura/
```

## O que trocar antes de publicar
1. `js/main.js` → bloco CONFIG: WhatsApp, telefone, e-mail e Instagram reais.
2. `images/socios/` → fotos dos sócios (arthur.jpg e marcos.jpg).
3. `index.html` → seção Depoimentos: hoje são de demonstração. Troque pelos reais
   (com autorização) e apague a etiqueta "depoimento de demonstração".
4. Cada pasta de projeto tem uma página de apresentação. Para usar o site completo,
   copie os arquivos dele para a pasta (o `index.html` dele substitui o da página de apresentação)
   ou descomente o botão "Abrir o site" e cole o link.
5. Newsletter: em CONFIG, cole o endereço de um serviço de formulário (ex.: Formspree).
   Sem isso, o cadastro abre uma conversa no WhatsApp.

## Visual
Tema escuro/futurista: fundo com grade e brilhos, rede de partículas interativa no hero (reage ao mouse),
luz que segue o cursor, cartões de vidro, inclinação 3D nos projetos e animações ao rolar.
As cores ficam no início de `css/style.css` (bloco `:root`).
