const produtos = [
  { id: 1, nome: "Coca-Cola Lata", grupo: "Bebidas" },
  { id: 2, nome: "Guaraná 2L", grupo: "Bebidas" },
  { id: 3, nome: "Batata Frita", grupo: "Comidas" },
  { id: 4, nome: "Cerveja Heineken", grupo: "Bebidas" }
];
let contagem = {};

function carregarProdutos() {
  renderizarProdutos();
  preencherGrupos();
}

function renderizarProdutos(filtro = "") {
  const container = document.getElementById("lista-produtos");
  container.innerHTML = "";
  let totalGeral = 0;

  produtos.forEach(produto => {
    if (filtro && produto.grupo !== filtro) return;
    const id = produto.id;
    contagem[id] = contagem[id] || {estoque: 0, bar: 0, avaria: 0};
    const total = contagem[id].estoque + contagem[id].bar + contagem[id].avaria;
    totalGeral += total;

    const div = document.createElement("div");
    div.className = "produto";
    div.innerHTML = \`
      <strong>\${produto.nome}</strong> (\${produto.grupo})<br>
      Estoque: <input type="number" value="\${contagem[id].estoque}" onchange="atualizar(\${id}, 'estoque', this.value)">
      Bar: <input type="number" value="\${contagem[id].bar}" onchange="atualizar(\${id}, 'bar', this.value)">
      Avaria: <input type="number" value="\${contagem[id].avaria}" onchange="atualizar(\${id}, 'avaria', this.value)">
      <br>Total: \${total}
    \`;
    container.appendChild(div);
  });
  document.getElementById("total-geral").textContent = totalGeral;
}

function atualizar(id, campo, valor) {
  contagem[id][campo] = parseInt(valor) || 0;
  renderizarProdutos(document.getElementById("grupo-filtro").value);
}

function preencherGrupos() {
  const grupos = [...new Set(produtos.map(p => p.grupo))];
  const select = document.getElementById("grupo-filtro");
  grupos.forEach(grupo => {
    const opt = document.createElement("option");
    opt.value = grupo;
    opt.textContent = grupo;
    select.appendChild(opt);
  });
  select.addEventListener("change", () => {
    renderizarProdutos(select.value);
  });
}

function zerarContagem() {
  for (const id in contagem) {
    contagem[id] = {estoque: 0, bar: 0, avaria: 0};
  }
  renderizarProdutos(document.getElementById("grupo-filtro").value);
}

function exportarCSV() {
  let csv = "Produto,Grupo,Estoque,Bar,Avaria,Total\n";
  produtos.forEach(produto => {
    const id = produto.id;
    const c = contagem[id];
    const total = c.estoque + c.bar + c.avaria;
    csv += \`\${produto.nome},\${produto.grupo},\${c.estoque},\${c.bar},\${c.avaria},\${total}\n\`;
  });
  const blob = new Blob([csv], {type: "text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "contagem.csv";
  a.click();
}

carregarProdutos();