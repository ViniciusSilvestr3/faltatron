# 📚 Faltatron

**Gerenciador de Faltas Acadêmicas Inteligente**

Um aplicativo web avançado e intuitivo para controlar suas faltas universitárias com cálculo automático de presença e alertas personalizados para evitar a temida DP (Dependência)!

## 🎯 Funcionalidades

### ✅ **Múltiplas Matérias**

- Crie cards individuais para cada matéria
- Gerencie faltas de forma independente
- Adicione quantas matérias precisar
- Remova matérias com um clique

### 📊 **Sistema de Presença Inteligente**

- **Porcentagem mínima personalizável**: Defina sua própria % mínima de presença (padrão: 75%)
- **Total de aulas configurável**: Cada matéria pode ter um número diferente de aulas
- **Cálculo automático**: O sistema calcula automaticamente quantas faltas você pode ter
- **Presença atual**: Mostra em tempo real sua porcentagem de presença atual

### 🎨 **Indicadores Visuais Dinâmicos**

- **Cores da presença atual**:
  - 🟢 Verde: Presença acima do mínimo exigido
  - 🟠 Laranja: Atenção! Poucas faltas restantes (≤3)
  - 🔴 Vermelho: Presença abaixo do mínimo exigido
- **Cores das faltas restantes**:
  - 🔵 Azul: Situação tranquila (4+ faltas restantes)
  - 🟠 Laranja: Cuidado! (1-3 faltas restantes)
  - 🔴 Vermelho: Limite atingido (0 faltas restantes)

### 🚨 **Sistema de Alertas Avançado**

- Alerta de DP ao tentar ultrapassar o limite de faltas
- Exibição da porcentagem atual vs. mínima exigida
- Aviso visual "Mais uma é DP paizão..." quando no limite

### ⚙️ **Personalização Completa**

- **% Mínima de Presença**: Configure globalmente (50% a 100%)
- **Total de Aulas**: Configure individualmente para cada matéria (1 a 100 aulas)
- **Nome das Matérias**: Totalmente editável

### 💾 **Persistência de Dados**

- Salva automaticamente no navegador
- Dados mantidos entre sessões
- Não perde informações ao fechar a página
- Backup das configurações de presença

### 🎛️ **Controles Intuitivos**

- **Nome editável**: Clique no título para editar
- **Campo "Total de aulas"**: Configure o número de aulas da matéria
- **Botão +**: Adiciona uma falta
- **Botão ×**: Remove a matéria completamente
- **Campo "% Mínima de Presença"**: Configure globalmente no header

## 🚀 Como Usar

### 1. **Configuração Inicial**

- Abra o `index.html` no seu navegador
- Configure a **% Mínima de Presença** no campo do header (padrão: 75%)

### 2. **Gerenciando Matérias**

- **Edite o nome** da matéria clicando no título
- **Configure o total de aulas** no campo específico de cada card
- **Monitore a presença atual** exibida em tempo real

### 3. **Adicionando Faltas**

- Clique no botão verde **"+ Adicionar Falta"**
- Observe as mudanças automáticas na porcentagem de presença
- Monitore as cores para saber sua situação

### 4. **Interpretando os Indicadores**

- **Presença atual**: Mostra "X.X% (mín: Y%)"
- **Faltas restantes**: Número de faltas que você ainda pode ter
- **Cores**: Verde = OK, Laranja = Atenção, Vermelho = Perigo

### 5. **Organizando**

- **Adicione mais matérias** com o botão azul no topo
- **Remova matérias** clicando no "×" vermelho

## 📋 Exemplos Práticos

### Exemplo 1: Matéria com 80 aulas, 75% presença mínima

- **Faltas permitidas**: 20 faltas máximo
- **Presença necessária**: 60 aulas mínimo
- **Status atual**: 5 faltas = 93.8% presença ✅

### Exemplo 2: Matéria com 40 aulas, 80% presença mínima

- **Faltas permitidas**: 8 faltas máximo
- **Presença necessária**: 32 aulas mínimo
- **Status atual**: 7 faltas = 82.5% presença ⚠️

### Exemplo 3: Situação de risco

- **40 aulas, 75% presença, 11 faltas**
- **Presença atual**: 72.5% (abaixo do mínimo!) 🚨
- **Status**: Já está em DP!

## 📁 Estrutura do Projeto

```
faltatron/
├── index.html      # Página principal com interface
├── style.css       # Estilos, cores e responsividade
├── script.js       # Lógica, cálculos e persistência
└── README.md       # Documentação completa
```

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos e responsivos
- **JavaScript ES6+**: Lógica avançada e DOM manipulation
- **localStorage**: Persistência de dados local

## 🔄 Atualizações Recentes

### v2.0 - Sistema de Presença Inteligente

- ✅ Cálculo automático de presença em porcentagem
- ✅ Configuração de % mínima de presença personalizada
- ✅ Total de aulas configurável por matéria
- ✅ Cores dinâmicas baseadas na situação real
- ✅ Indicadores visuais aprimorados
- ✅ Alertas mais precisos e informativos

## 💡 Dicas Importantes

### 🎯 **Estratégias de Uso**

- **Configure corretamente**: Verifique sempre o total de aulas e % mínima
- **Use as cores como guia**: Verde = tranquilo, Laranja = atenção, Vermelho = perigo
- **Monitore a presença atual**: Não confie apenas nas faltas restantes
- **Atualize regularmente**: Adicione faltas assim que elas acontecerem

### 📊 **Entendendo os Cálculos**

- **Presença atual** = (Aulas presentes ÷ Total de aulas) × 100
- **Aulas presentes** = Total de aulas - Faltas atuais
- **Faltas máximas** = Total de aulas × (100 - % mínima) ÷ 100

### 🔧 **Configurações Recomendadas**

- **Graduação tradicional**: 75% de presença mínima
- **Cursos mais rígidos**: 80% ou 85% de presença
- **Total de aulas**: Verifique no plano de ensino da disciplina

### 💾 **Backup e Segurança**

- Os dados ficam salvos no seu navegador
- **Importante**: Anote suas faltas em outro lugar também
- Limpar dados do navegador apaga as informações

## ⚠️ Avisos Importantes

### 🚨 **Limitações**

- **Não substitui** o controle oficial da instituição
- Use como ferramenta auxiliar de organização
- **Não há função de remover faltas** (como na vida real!)
- Sempre confirme com os registros oficiais

### 📚 **Responsabilidade**

- O aplicativo é uma ferramenta de apoio
- A responsabilidade pelo controle oficial é do estudante
- Verifique sempre com a secretaria da instituição

---

**Desenvolvido para estudantes inteligentes que querem evitar a DP! 🎓📊**
